from fastapi import APIRouter, Depends, Body
from app.core.security import get_current_user
from app.services.voice import voice_processor
from pydantic import BaseModel

router = APIRouter()

class VoiceCommandRequest(BaseModel):
    command: str

class VoiceCommandResponse(BaseModel):
    action: str
    response: str
    data: dict = None

@router.post("/process", response_model=VoiceCommandResponse)
async def process_voice_command(
    command_data: VoiceCommandRequest,
    current_user: dict = Depends(get_current_user)
):
    # Process the voice command
    result = await voice_processor.process_command(command_data.command)
    
    # Extract action and response
    action = result.get("action", "unknown")
    response = result.get("response", "Command processed")
    
    # Remove these keys from the result to avoid duplication
    if "action" in result:
        del result["action"]
    if "response" in result:
        del result["response"]
    
    # Return the processed command
    return {
        "action": action,
        "response": response,
        "data": result if result else None
    }