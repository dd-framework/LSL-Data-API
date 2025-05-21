from contextlib import asynccontextmanager
import json
import os
import time
from pydantic import BaseModel
import pyxdf
import asyncio
import threading
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from pathlib import Path
from pylsl import resolve_streams, StreamInlet, StreamInfo
import numpy as np
from typing import Optional
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler
from pprint import pprint

from modules.anomaly_detection import detect_anomaly
from modules.connectivity import broadcast_updates, process_ws_message
from modules.data_point_creation import get_data_point_creator
from modules.labrecorder import LabRecorderSettings, lr_connect, lr_record, lr_set
from modules.server_settings import ChangeRequest, server_settings_request_handler
from modules.xdf import create_stream_info_from_xdf, xdf_change_handler_sync

# region File Loading

base_path = Path(__file__).parent

try:
    sources = json.loads((base_path / "sources.json").read_text())
except Exception as e:
    raise RuntimeError(f"Error loading sources.json: {e}")

try:
    data_types = json.loads((base_path / "data_types.json").read_text())
except Exception as e:
    raise RuntimeError(f"Error loading data_types.json: {e}")

try:
    source_data = json.loads((base_path / "data.json").read_text())
except Exception as e:
    raise RuntimeError(f"Error loading data.json: {e}")

components = {}


async def load_components():
    src = os.path.join(os.path.dirname(__file__), "components")
    files = []

    try:
        # Get all .js files in the directory
        files = [f for f in os.listdir(src) if f.endswith(".js")]
    except:
        print("An error occurred while trying to find directory.")
        return

    for file in files:
        file_path = os.path.join(src, file)

        if os.path.isfile(file_path):
            try:
                # Read file content as string
                with open(file_path, "r", encoding="utf-8") as f:
                    file_content = f.read()
                    file_name = file.replace(".js", "")

                # Store in components dictionary with key as filename without extension
                components[file_name] = file_content
            except Exception as err:
                print(f"Error reading file {file}:", err)


# region XDF File Watching

xdf_path = base_path / "dumps"
patterns = ["*.xdf"]


def start_observer(loop):
    event_handler = PatternMatchingEventHandler(
        patterns=patterns, ignore_directories=True
    )
    event_handler.on_created = lambda event: xdf_change_handler_sync(
        clients, source_data, xdf_path, event, loop
    )
    event_handler.on_deleted = lambda event: xdf_change_handler_sync(
        clients, source_data, xdf_path, event, loop
    )

    observer = Observer()
    observer.schedule(event_handler, xdf_path, recursive=True)
    observer.daemon = True

    observer.start()
    return observer


# region Setup

clients = {}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    loop = asyncio.get_running_loop()

    print("Running initial File Scan:")
    xdf_change_handler_sync(clients, source_data, xdf_path, None, loop)

    observer_thread = threading.Thread(target=start_observer, args=(loop,), daemon=True)
    observer_thread.start()
    print("File watcher initialized during startup.")

    yield  # Everything before this runs on startup, everything after runs on shutdown

    print("Shutting down observer...")


app.router.lifespan_context = lifespan


# region Type Handling

# Declare as which DynDash Type a LSL Type will be packaged
type_map = {
    "EEG": "ddStream",
    "IMU": "ddGeneric",
    "GAZE": "ddGeneric",
    "MOCAP": "LiAQualisys",
    "VIDEORAW": "ddGeneric",
}

batchables = ["ddStream", "LiAQualisys"]


# region Routes (General)


# Route to get an overview of all included Data Types
@app.get("/types")
def read_data_types():
    return data_types


# Route to get an overview of all included Sources
@app.get("/sources")
def read_sources():
    return sources


# Route to get an overview of all included Components
@app.get("/components")
async def read_components():
    await load_components()
    return components


# Route to get the Application information for display in the Provider Indicator Elements of a DynDash Application
@app.get("/info")
def read_info():
    return {
        "name": "LSL Data API",
        "info": "This is a source provider that collects the LSL Streams in the local network and serves them to any DynDash Application connected to it.",
        "provides": {
            "dashboards": False,
            "components": True,
            "sources": True,
            "types": True,
        },
    }


# Route to get the Application Icon for display in the Provider Indicator Elements of a DynDash Application
@app.get("/icon")
def read_icon():
    icon_path = base_path / "icon.svg"
    if not icon_path.exists():
        raise HTTPException(status_code=404, detail="Icon not found")
    return FileResponse(icon_path, media_type="image/svg+xml")


# region Routes (Data)


# Route for receiving either all data, or data from a specified endpoint (source)
@app.get("/sources/data/{key}")
@app.get("/sources/data")
def read_source_data(key: str = None):
    if key is None:
        return source_data

    if key in source_data:
        return source_data[key]

    raise HTTPException(status_code=404, detail=f"Key '{key}' not found in source data")


@app.websocket("/sources/data")
async def websocket_source_data(websocket: WebSocket):
    await websocket.accept()
    print("New WebSocket connection")

    try:
        while True:
            # Wait for a message from the client
            message = await websocket.receive_text()

            try:
                processable = await process_ws_message(
                    clients, websocket, message, sources, source_data
                )
                if not processable:
                    continue
            except json.JSONDecodeError:
                await websocket.send_text(
                    json.dumps({"error": "Invalid message format."})
                )

    except WebSocketDisconnect:
        print("WebSocket connection closed")
        clients.pop(websocket, None)


# region Routes (Server Controls)


# Route to change Threshold
@app.post("/threshold")
async def change_threshold(request: Optional[ChangeRequest] = None):
    return await server_settings_request_handler(
        clients, source_data, "Anomaly Threshold", request
    )


# Route to change Window
@app.post("/window")
async def change_window(request: Optional[ChangeRequest] = None):
    return await server_settings_request_handler(
        clients, source_data, "Anomaly Window", request
    )


# Route to change Sending Interval
@app.post("/sending")
async def change_threshold(request: Optional[ChangeRequest] = None):
    return await server_settings_request_handler(
        clients, source_data, "Sending Interval", request
    )


# Route to change Pulling Timeout
@app.post("/pulling")
async def change_window(request: Optional[ChangeRequest] = None):
    return await server_settings_request_handler(
        clients, source_data, "Pulling Timeout", request
    )


# region Routes (LabRecorder)


# Route to connect the LabRecorder
@app.post("/labrecorder/connect")
async def connect_labrecorder():
    return_string = await lr_connect(clients, source_data)
    return {"message": return_string}


# Route to set the LabRecorder
@app.post("/labrecorder/set")
async def set_labrecorder(settings: Optional[LabRecorderSettings] = None):
    return_string = await lr_set(clients, source_data, settings)
    return {"message": return_string}


# Route to start the LabRecorder
@app.post("/labrecorder/start")
async def start_labrecorder(settings: Optional[LabRecorderSettings] = None):
    await set_labrecorder(settings)
    return_string = await lr_record(b"start\n")
    return {"message": return_string}


# Route to stop the LabRecorder
@app.post("/labrecorder/stop")
async def stop_labrecorder():
    return_string = await lr_record(b"stop\n")
    return {"message": return_string}


# region Routes (Purge)
@app.post("/sources/purge")
async def purge_sources():

    # Setting Mode to non-serving
    source_data["LSL_Data_API_Status"]["ddStatus"]["Serving"] = False
    await broadcast_updates(
        clients,
        "LSL_Data_API_Status",
        "ddStatus",
        source_data["LSL_Data_API_Status"]["ddStatus"],
    )

    protected = {
        "LSL_Data_API_Controls",
        "LSL_Data_API_Status",
        "LabRecorder_Actions",
        "LabRecorder_Status",
        "Recording_Loaders",
    }

    # Clearing Sources
    for key in list(sources.keys()):
        if key not in protected:
            sources[key] = None

    # Clearing Sources Data
    for key in list(source_data.keys()):
        if key not in protected:
            del source_data[key]

    # For source_data: delete non-protected key-value pairs

    # Telling the DynDash to refresh Sources
    return {
        "message": "Devices were Purged from Memory",
        "dispatch": {"ddSources": None},
    }


# region Routes (Load)


# Class representing requests made to the API for loading data
class LoadRequest(BaseModel):
    path: str


# Route for Loading the Data from a file
@app.post("/load")
async def load_recording(request: LoadRequest = None):
    await purge_sources()

    source_data["LSL_Data_API_Status"]["ddStatus"]["Serving"] = "Loading Recording..."
    await broadcast_updates(
        clients,
        "LSL_Data_API_Status",
        "ddStatus",
        source_data["LSL_Data_API_Status"]["ddStatus"],
    )

    data, header = pyxdf.load_xdf(request.path)

    for stream in data:
        try:
            xdf_info = stream.get("info")
            stream_info = create_stream_info_from_xdf(xdf_info)

            stream_id = stream_info.source_id()
            stream_type = stream_info.type().upper()
            stream_name = stream_info.name()

            dyndash_type = type_map.get(stream_type, "ddGeneric")

            variants = [
                {"suffix": "", "label": "", "data_type": dyndash_type},
                {
                    "suffix": "_anomaly",
                    "label": " (anomaly)",
                    "data_type": "ddStream",
                },
            ]

            for variant in variants:
                suffix = variant["suffix"]
                label = variant["label"]
                dd_type = variant["data_type"]

                if suffix == "":
                    explanation = f"A stream with the name {stream_name} of type {stream_type} that loaded from an .xdf file."
                else:
                    explanation = f"The anomaly stream for the stream with the name {stream_name} of type {stream_type} that was loaded from an .xdf file."

                source_information = {
                    "name": f"{stream_name}{label}",
                    "information": f"stream, {stream_type} data{label}",
                    "explanation": explanation,
                    "dataTypes": [dd_type],
                    "connection": {
                        "protocol": "WS",
                        "address": "ws://localhost:3151/sources/data",
                        "endpoint": f"{stream_id}{suffix}",
                    },
                }

                sources[f"{stream_id}{suffix}"] = source_information

                source_data[f"{stream_id}{suffix}"] = []

            create_data_point = get_data_point_creator(stream_type, stream_info)
            processed_data = []
            anomaly_data = []

            full_stream = zip(stream.get("time_series"), stream.get("time_stamps"))

            for sample, timestamp in full_stream:
                data_point = create_data_point(
                    sample.tolist() if isinstance(sample, np.ndarray) else sample,
                    float(timestamp),
                )
                anomaly_point = detect_anomaly(source_data, data_point)

                processed_data.append(data_point)

                anomaly_data.append(anomaly_point)

            source_data[stream_id] = processed_data
            source_data[f"{stream_id}_anomaly"] = anomaly_data

        except:
            return {
                "message": "An error occurred while trying to load a dump File.",
            }

    file_path = Path(request.path)
    parent_folder = file_path.relative_to(xdf_path).parts[0]
    unique_key = f"{parent_folder}/.../{file_path.name}"

    source_data["LSL_Data_API_Status"]["ddStatus"]["Serving"] = f"{unique_key}"
    await broadcast_updates(
        clients,
        "LSL_Data_API_Status",
        "ddStatus",
        source_data["LSL_Data_API_Status"]["ddStatus"],
    )

    return {
        "message": "Recording loaded and Sources served.",
        "dispatch": {"ddSources": None},
    }


# region Routes (Scan)


# Route to start a "scan" and return a message that tells the DynDash Application to refresh its available Sources
@app.post("/sources/scan")
async def post_source_scan():

    # Discover LSL streams on the network.
    streams = await asyncio.to_thread(resolve_streams, wait_time=2)

    if not streams:
        return {"message": "No LSL streams found"}

    source_data["LSL_Data_API_Status"]["ddStatus"]["Serving"] = "Live Data"
    await broadcast_updates(
        clients,
        "LSL_Data_API_Status",
        "ddStatus",
        source_data["LSL_Data_API_Status"]["ddStatus"],
    )

    loop = asyncio.get_running_loop()

    # For each discovered stream, add/update the sources and start data collection.
    for stream in streams:
        # Use stream name as key; you could also use stream.source_id() if available.
        stream_id = stream.source_id()
        stream_name = stream.name()
        stream_type = stream.type().upper()

        dyndash_type = type_map[stream_type] if stream_type in type_map else "ddGeneric"

        # Avoid duplicate registration if the stream is already in our 'sources'
        if stream_id not in sources or sources[stream_id] is None:
            # Add source info with LSL connection details.
            variants = [
                {"suffix": "", "label": "", "data_type": dyndash_type},
                {
                    "suffix": "_anomaly",
                    "label": " (anomaly)",
                    "data_type": "ddStream",
                },
            ]

            for variant in variants:
                suffix = variant["suffix"]
                label = variant["label"]
                dd_type = variant["data_type"]

                if suffix == "":
                    explanation = f"A stream with the name {stream_name} of type {stream_type} that was discovered broadcasting its data on the network."
                else:
                    explanation = f"The anomaly stream for the stream with the name {stream_name} of type {stream_type} that was discovered broadcasting its data on the network."

                source_information = {
                    "name": f"{stream_name}{label}",
                    "information": f"stream, {stream_type} data{label}",
                    "explanation": explanation,
                    "dataTypes": [dd_type],
                    "connection": {
                        "protocol": "WS",
                        "address": "ws://localhost:3151/sources/data",
                        "endpoint": f"{stream_id}{suffix}",
                    },
                }

                sources[f"{stream_id}{suffix}"] = source_information

                # Initialize data storage for the stream.
                source_data[f"{stream_id}{suffix}"] = []

            # Function to read from the stream in a background thread.
            def read_stream_data(lsl_stream, source_key, stream_type, loop):
                inlet = StreamInlet(lsl_stream)
                stream_info = inlet.info()
                dyndash_type = (
                    type_map[stream_type] if stream_type in type_map else "ddGeneric"
                )

                # Based on Stream Type and Stream Info, get the data type creation function
                create_data_point = get_data_point_creator(stream_type, stream_info)

                batch = []  # Buffer to collect multiple samples
                batch_anomaly = []

                last_send_time = time.time()
                append = []

                while True:
                    sending_interval = source_data["LSL_Data_API_Status"]["ddStatus"][
                        "Sending Interval"
                    ]
                    pulling_timeout = source_data["LSL_Data_API_Status"]["ddStatus"][
                        "Pulling Timeout"
                    ]

                    # timeout simply defines maximum time to wait when no sample is received beforehand
                    # if the timeout is met even after the timeout has concluded, None is returned
                    # we, however, only want to deal with actual samples, so we only deal with non-None ones
                    sample, timestamp = inlet.pull_sample(timeout=pulling_timeout)

                    if sample is not None:
                        # If a sample exists, build a data point with the gotten function
                        data_point = create_data_point(sample, timestamp)
                        anomaly_point = detect_anomaly(source_data, data_point)

                        source_data[source_key].append(data_point)
                        source_data[f"{source_key}_anomaly"].append(anomaly_point)

                        send_data = source_data[source_key]
                        send_anomaly = source_data[f"{source_key}_anomaly"]

                        if dyndash_type in batchables:
                            batch.append(data_point)
                            batch_anomaly.append(anomaly_point)
                            send_data = batch[:]
                            send_anomaly = batch_anomaly[:]
                            append = [dyndash_type]

                    # Send batch/all data if interval has passed
                    if time.time() - last_send_time >= sending_interval:
                        asyncio.run_coroutine_threadsafe(
                            broadcast_updates(
                                clients,
                                source_key,
                                dyndash_type,
                                send_data,
                                append,
                            ),
                            loop,
                        )

                        asyncio.run_coroutine_threadsafe(
                            broadcast_updates(
                                clients,
                                f"{source_key}_anomaly",
                                dyndash_type,
                                send_anomaly,
                                append,
                            ),
                            loop,
                        )

                        batch.clear(),
                        batch_anomaly.clear(),

                        last_send_time = time.time()
                    else:
                        time.sleep(0.05)  # Short sleep to reduce CPU usage

            # Start a background thread to read incoming samples.
            thread = threading.Thread(
                target=read_stream_data,
                args=(stream, stream_id, stream_type, loop),
                daemon=True,
            )
            thread.start()

    return {
        "message": "LSL streams scanned, sources updated, and data collection started.",
        "dispatch": {"ddSources": None},
    }
