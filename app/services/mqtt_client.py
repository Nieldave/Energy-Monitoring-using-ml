from app.core.config import settings
from app.db.influxdb import influx_client
import json
import logging
import time
import threading
import random
from datetime import datetime

logger = logging.getLogger("mqtt")

class MockMQTTClient:
    def __init__(self):
        self.connected = False
        self.thread = None
        self.running = False
        logger.info("Initialized mock MQTT client")

    def connect(self):
        if not self.connected:
            logger.info("Connected to mock MQTT broker")
            self.connected = True
            self.running = True
            self.thread = threading.Thread(target=self._generate_mock_data)
            self.thread.daemon = True
            self.thread.start()

    def disconnect(self):
        self.running = False
        self.connected = False
        logger.info("Disconnected from mock MQTT broker")

    def _generate_mock_data(self):
        """Generate mock energy data for development"""
        device_ids = ["device1", "device2", "device3"]
        
        while self.running:
            try:
                # Generate random energy data
                device_id = random.choice(device_ids)
                value = random.uniform(0.5, 10.0)
                timestamp = datetime.now().isoformat()
                
                payload = {
                    "device_id": device_id,
                    "value": round(value, 2),
                    "timestamp": timestamp
                }
                
                # Process the mock data
                self._process_data(payload)
                
                # Sleep for a random interval
                time.sleep(random.uniform(1, 5))
            except Exception as e:
                logger.error(f"Error generating mock data: {str(e)}")
                time.sleep(5)  # Sleep and retry

    def _process_data(self, payload):
        try:
            if not self.validate_payload(payload):
                raise ValueError("Invalid payload structure")
            
            # Write to mock InfluxDB
            influx_client.write_data({
                "measurement": "energy_consumption",
                "tags": {"device_id": payload["device_id"]},
                "fields": {"value": payload["value"]},
                "time": payload["timestamp"]
            })
            
            logger.debug(f"Processed MQTT data: {payload}")
        except Exception as e:
            logger.error(f"Error processing MQTT data: {str(e)}")

    def validate_payload(self, payload: dict) -> bool:
        required_fields = {"device_id", "value", "timestamp"}
        return all(field in payload for field in required_fields)

mqtt_client = MockMQTTClient()