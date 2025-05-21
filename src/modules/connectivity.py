import json


# region Broadcast Updates


# Function to broadcast WebSocket updates to a group of predefined clients
async def broadcast_updates(clients, source_key, dyndash_type, updated_data, append=[]):
    data_object = {}
    data_object[dyndash_type] = updated_data

    message = json.dumps(
        {
            "status": "updated",
            "source": source_key,
            "type": dyndash_type,
            "data": data_object,
            "append": append,
        }
    )
    # Iterate over a copy of the clients dict.
    for ws, requested_source in list(clients.items()):
        if requested_source == source_key:
            try:
                await ws.send_text(message)
            except Exception:
                # Remove client if sending fails.
                clients.pop(ws, None)


# region Process WS Message


# Function for processing incoming WS messages
async def process_ws_message(clients, websocket, message, sources, source_data):
    message_data = json.loads(message)
    source = message_data.get("source")

    if not source:
        await websocket.send_text(json.dumps({"error": "No source specified."}))
        return False

    if source in source_data:
        print(f"Client requested source: {source}")
        clients[websocket] = source  # Track the client and requested source

        dyndash_type = sources[source]["dataTypes"][0]

        if dyndash_type in source_data[source]:
            data_object = source_data[source]
        else:
            data_object = {}
            data_object[dyndash_type] = source_data[source]

        # print(source, dyndash_type, source_data[source])

        await websocket.send_text(
            json.dumps(
                {
                    "status": "connected",
                    "source": source,
                    "data": data_object,
                }
            )
        )

        return True
    else:
        await websocket.send_text(
            json.dumps(
                {
                    "error": f"Source '{source}' not found.",
                }
            )
        )

        return False
