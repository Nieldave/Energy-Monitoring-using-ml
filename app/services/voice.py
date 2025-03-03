import logging
from typing import Dict
from fastapi import HTTPException

logger = logging.getLogger("voice")

class VoiceProcessor:
    def __init__(self):
        try:
            # Mock NLP model for development
            logger.info("Initialized mock voice processor")
            self.command_map = {
                "monitor": self.handle_monitor,
                "forecast": self.handle_forecast,
                "budget": self.handle_budget,
                "show": self.handle_show,
                "turn": self.handle_turn,
                "get": self.handle_get
            }
        except Exception as e:
            logger.error(f"Failed to initialize voice processor: {str(e)}")
            raise

    async def process_command(self, text: str) -> Dict:
        try:
            # Simple keyword-based command processing for development
            text = text.lower()
            
            # Check for each command type
            for keyword, handler in self.command_map.items():
                if keyword in text:
                    return await handler(text)
            
            return {"action": "unknown", "response": "Could not understand command"}
        except Exception as e:
            logger.error(f"Voice processing error: {str(e)}")
            raise HTTPException(
                status_code=500, 
                detail="Voice command processing failed"
            )

    async def handle_monitor(self, text):
        if "start" in text:
            return {"action": "start_monitoring", "response": "Monitoring started"}
        elif "stop" in text:
            return {"action": "stop_monitoring", "response": "Monitoring stopped"}
        return {"action": "monitor_status", "response": "Monitoring status retrieved"}

    async def handle_forecast(self, text):
        days = 7  # Default
        
        # Try to extract number of days
        words = text.split()
        for i, word in enumerate(words):
            if word.isdigit() and i > 0 and words[i-1] in ["next", "for"]:
                days = int(word)
                break
        
        return {
            "action": "get_forecast", 
            "days": days,
            "response": f"Fetching energy forecast for the next {days} days"
        }

    async def handle_budget(self, text):
        # Extract numerical value
        words = text.split()
        for i, word in enumerate(words):
            if word.replace('.', '', 1).isdigit():
                return {
                    "action": "set_budget",
                    "value": float(word),
                    "response": f"Budget set to {word} kWh"
                }
        
        if "show" in text or "get" in text:
            return {"action": "get_budget", "response": "Retrieving your current budget"}
            
        return {"action": "budget_info", "error": "No budget value specified"}

    async def handle_show(self, text):
        if "device" in text:
            return {"action": "show_devices", "response": "Showing all devices"}
        elif "alert" in text:
            return {"action": "show_alerts", "response": "Showing all alerts"}
        elif "dashboard" in text:
            return {"action": "show_dashboard", "response": "Showing dashboard"}
        return {"action": "unknown_show", "response": "Not sure what to show"}

    async def handle_turn(self, text):
        state = "on" if "on" in text else "off"
        
        if "device" in text:
            # Try to extract device name or number
            device = "all"
            words = text.split()
            for i, word in enumerate(words):
                if word == "device" and i < len(words) - 1:
                    device = words[i+1]
                    break
            
            return {
                "action": f"turn_{state}_device",
                "device": device,
                "response": f"Turning {state} {device} device(s)"
            }
        
        return {"action": "unknown_turn", "response": f"Not sure what to turn {state}"}

    async def handle_get(self, text):
        if "consumption" in text or "usage" in text:
            return {"action": "get_consumption", "response": "Getting current energy consumption"}
        elif "saving" in text:
            return {"action": "get_savings", "response": "Calculating your energy savings"}
        return {"action": "unknown_get", "response": "Not sure what information to retrieve"}

voice_processor = VoiceProcessor()