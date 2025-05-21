from typing import Optional
from pydantic import BaseModel
from modules.connectivity import broadcast_updates


# region Classes and Setup


# Class representing requests made to the API for changing its settings
class ChangeRequest(BaseModel):
    amount: int
    set: Optional[bool] = None


# region Status Manipulation


async def manipulate_status(clients, source_data, name, value, set=False):
    if set:
        source_data["LSL_Data_API_Status"]["ddStatus"][name] = value
        preposition = "to"
    else:
        source_data["LSL_Data_API_Status"]["ddStatus"][name] += value
        preposition = "by"

    await broadcast_updates(
        clients,
        "LSL_Data_API_Status",
        "ddStatus",
        source_data["LSL_Data_API_Status"]["ddStatus"],
    )
    return {"message": f"{name} changed {preposition} {value}"}


# region Request Handlers


# Request Handler for any change event
async def server_settings_request_handler(clients, source_data, field_name, request):
    if request is not None:
        amount = int(request.amount) or 0
        set = request.set or False
        return await manipulate_status(clients, source_data, field_name, amount, set)
    else:
        return {"message": f"Request Could not be Processed without Body"}
