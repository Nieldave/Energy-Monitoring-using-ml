from app.core.config import settings
import logging

logger = logging.getLogger("influxdb")

# Mock InfluxDB client for development
class InfluxDB:
    def __init__(self):
        logger.info("Initializing mock InfluxDB client")
        self.data = []
    
    def write_data(self, data):
        logger.info(f"Writing data to mock InfluxDB: {data}")
        self.data.append(data)
        return True

influx_client = InfluxDB()