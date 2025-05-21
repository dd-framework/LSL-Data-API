from datetime import datetime
from pathlib import Path
import socket
from typing import Optional
from pydantic import BaseModel

from modules.connectivity import broadcast_updates

# region Setup
base_path = Path(__file__).parent.parent
current_date = datetime.now().strftime("%Y%m%d_%H%M%S")
dump_dir = base_path / "dumps" / current_date
dump_dir.mkdir(parents=True, exist_ok=True)

lr_socket = None
lr_root = f"{{root:{dump_dir}}}"


# region Classes


# Class encapsulating Settings that can be passed to the LabRecorder
class LabRecorderSettings(BaseModel):
    root: Optional[str] = None
    template: Optional[str] = None
    task: Optional[str] = None
    run: Optional[int] = None
    participant: Optional[str] = None
    session: Optional[str] = None
    acquisition: Optional[str] = None
    modality: Optional[str] = None


# region Connect TCP


async def establish_lr_tcp_connection(clients, source_data):
    global lr_socket

    try:
        lr_socket = socket.create_connection(("localhost", 22345))
    except:
        print("Could not open a Connection to the LabRecorder")

    source_data["LabRecorder_Status"]["ddStatus"]["LabRecorder Connected"] = (
        lr_socket != None
    )

    await broadcast_updates(
        clients,
        "LabRecorder_Status",
        "ddStatus",
        source_data["LabRecorder_Status"]["ddStatus"],
    )

    return source_data["LabRecorder_Status"]["ddStatus"]["LabRecorder Connected"]


# region Connect


async def lr_connect(clients, source_data):
    try:
        connected = await establish_lr_tcp_connection(clients, source_data)
        return (
            f"LabRecorder Connected"
            if connected
            else f"Could not find any Lab Recorders"
        )
    except Exception as e:
        return f"Could not find any Lab Recorders"


# region Set


async def lr_set(clients, source_data, settings):
    global lr_socket

    if lr_socket is not None:
        options = []

        if settings is not None:
            # Use the provided root or a default value
            if settings.root:
                options.append(f"{{root:{settings.root}}}")
            else:
                options.append(lr_root)

            # Add additional options if they are provided
            if settings.template:
                options.append(f"{{template:{settings.template}}}")
            if settings.task:
                options.append(f"{{task:{settings.task}}}")
            if settings.run is not None:
                options.append(f"{{run:{settings.run}}}")
            if settings.participant:
                options.append(f"{{participant:{settings.participant}}}")
            if settings.session:
                options.append(f"{{session:{settings.session}}}")
            if settings.acquisition:
                options.append(f"{{acquisition:{settings.acquisition}}}")
            if settings.modality:
                options.append(f"{{modality:{settings.modality}}}")
        else:
            options.append(lr_root)

        # Quickly setting the local status
        if settings is not None:
            preset_update = settings.model_dump(
                exclude_unset=True, exclude={"root", "template"}
            )
            source_data["LabRecorder_Status"]["ddStatus"]["LabRecorder Preset"].update(
                preset_update
            )

            await broadcast_updates(
                clients,
                "LabRecorder_Status",
                "ddStatus",
                source_data["LabRecorder_Status"]["ddStatus"],
            )

        # Build the command string with a trailing newline
        command_str = "filename " + " ".join(options) + "\n"

        try:
            # Convert the string to bytes and send via the socket
            lr_socket.sendall(command_str.encode())
            return "LabRecorder Set"
        except Exception as e:
            return "An error occurred while setting the LabRecorder settings."

    else:
        return "No LabRecorders found"


# region Record


async def lr_record(mode):
    global lr_socket

    if lr_socket != None:
        lr_socket.sendall(b"update\n")
        lr_socket.sendall(b"select all\n")
        lr_socket.sendall(mode)
        return f"Recording Started" if mode == b"start\n" else f"Recording Stopped"
    else:
        return f"No LabRecorders found"
