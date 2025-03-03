import numpy as np
from app.core.config import settings
from functools import lru_cache
import logging
from typing import Optional
import random

logger = logging.getLogger("ml")

class MLService:
    def __init__(self):
        self.model = None
        self.fallback_enabled = True
        self.last_prediction = None
    
    @lru_cache(maxsize=1)
    def load_model(self):
        try:
            # Mock model loading for development
            logger.info("Mock ML model loaded successfully")
            self.model = "mock_model"
        except Exception as e:
            logger.error(f"Model loading failed: {str(e)}")
            self.model = None
    
    async def predict(self, data: dict) -> Optional[float]:
        try:
            if not self.model:
                self.load_model()
            
            # Mock prediction for development
            # In a real scenario, we would use the actual model
            prediction = random.uniform(0.5, 10.0)
            self.last_prediction = float(prediction)
            return self.last_prediction
        
        except Exception as e:
            logger.error(f"Prediction failed: {str(e)}")
            if self.fallback_enabled and self.last_prediction:
                return self.last_prediction
            raise

ml_service = MLService()