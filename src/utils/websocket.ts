import { updateRealtimeData } from '../store/actions/energyDataActions';
import { updateDeviceStatus } from '../store/actions/deviceActions';
import { receiveNewAlert } from '../store/actions/alertActions';
import { updateBudgetUsage } from '../store/actions/budgetActions';
import store from '../store';

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: number = 1000;

  connect() {
    if (this.socket?.readyState === WebSocket.OPEN) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    // Updated WebSocket URL to match the backend
    this.socket = new WebSocket(`ws://localhost:8000/ws?token=${token}`);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleWebSocketMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      this.attemptReconnect();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.socket?.close();
    };
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const timeout = this.reconnectTimeout * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${timeout}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, timeout);
  }

  private handleWebSocketMessage(data: any) {
    // Skip heartbeat messages
    if (data.type === 'heartbeat') {
      return;
    }
    
    // Handle connection established message
    if (data.type === 'connection_established') {
      console.log('WebSocket connection authenticated:', data.authenticated);
      return;
    }
    
    switch (data.type) {
      case 'energy_data':
        store.dispatch(updateRealtimeData(data.payload));
        break;
      case 'device_status':
        store.dispatch(updateDeviceStatus(data.payload.id, data.payload.status));
        break;
      case 'alert':
        store.dispatch(receiveNewAlert(data.payload));
        break;
      case 'budget_update':
        store.dispatch(updateBudgetUsage(data.payload.id, data.payload.usage));
        break;
      default:
        console.log('Unknown WebSocket message type:', data.type);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  isConnected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

export default new WebSocketService();