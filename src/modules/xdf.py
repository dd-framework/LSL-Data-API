import asyncio
import pylsl
from pylsl import StreamInfo

from modules.connectivity import broadcast_updates


# region File Watching


def scan_for_xdf_files(source_data, xdf_path):
    xdf_files = list(xdf_path.rglob("*.xdf"))
    print("Current .xdf files in dumps:")

    source_data["Recording_Loaders"]["ddURL"] = {
        "Load Dummy": {
            "url": "http://localhost:3151/load",
            "method": "POST",
            "body": {"path": "Dummy Dump"},
        }
    }

    for file_path in xdf_files:
        urlObject = {
            "url": "http://localhost:3151/load",
            "method": "POST",
            "body": {"path": str(file_path)},
        }

        parent_folder = file_path.relative_to(xdf_path).parts[0]
        unique_key = f"{parent_folder}/.../{file_path.name}"
        source_data["Recording_Loaders"]["ddURL"][unique_key] = urlObject


async def xdf_change_handler(clients, source_data, xdf_path, event):
    scan_for_xdf_files(source_data, xdf_path)
    await broadcast_updates(
        clients, "Recording_Loaders", "ddURL", source_data["Recording_Loaders"]["ddURL"]
    )


def xdf_change_handler_sync(clients, source_data, xdf_path, event, loop):
    asyncio.run_coroutine_threadsafe(
        xdf_change_handler(clients, source_data, xdf_path, event), loop
    )


# region Stream Creation


def create_stream_info_from_xdf(xdf_info):
    """Convert XDF stream metadata to a pylsl StreamInfo object."""

    name = xdf_info.get("name", ["Unnamed"])[0]
    type_ = xdf_info.get("type", ["Unknown"])[0]
    channel_count = int(xdf_info.get("channel_count", [1])[0])
    nominal_srate = float(xdf_info.get("nominal_srate", [0.0])[0])
    channel_format = xdf_info.get("channel_format", ["float32"])[0]
    source_id = xdf_info.get("source_id", [name])[
        0
    ]  # Default to stream name if missing

    # Convert channel_format string to PyLSL enum value
    format_map = {
        "float32": pylsl.cf_float32,
        "double64": pylsl.cf_double64,
        "int32": pylsl.cf_int32,
        "int16": pylsl.cf_int16,
        "int8": pylsl.cf_int8,
        "string": pylsl.cf_string,
    }
    channel_format_enum = format_map.get(channel_format.lower(), pylsl.cf_float32)

    # Create StreamInfo object
    stream_info = StreamInfo(
        name, type_, channel_count, nominal_srate, channel_format_enum, source_id
    )

    return stream_info
