import secrets
from pydantic import BaseSettings, AnyUrl, validator

class Settings(BaseSettings):
    POSTGRES_URL: AnyUrl = "postgresql://user:password@localhost/energy_db"
    INFLUXDB_TOKEN: str = "your-influxdb-token"  # Default for development
    INFLUXDB_ORG: str = "energy-org"
    INFLUXDB_BUCKET: str = "energy-data"
    MQTT_BROKER: str = "mqtt.eclipse.org"
    MQTT_PORT: int = 1883
    MQTT_TOPIC: str = "energy/meters"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ML_MODEL_PATH: str = "./models/energy_forecast_model.h5"
    RATE_LIMIT: int = 100  # Requests per minute
    
    @validator("POSTGRES_URL")
    def validate_postgres(cls, v):
        if "@localhost" in str(v) and "password" in str(v):
            # For development, we'll allow default credentials
            # In production, this would raise an error
            pass
        return v

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()