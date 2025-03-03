import { Device } from '../../types';

interface DeviceState {
  devices: Device[];
  selectedDevice: Device | null;
  loading: boolean;
  error: string | null;
}

const initialState: DeviceState = {
  devices: [],
  selectedDevice: null,
  loading: false,
  error: null,
};

type DeviceAction =
  | { type: 'FETCH_DEVICES_REQUEST' }
  | { type: 'FETCH_DEVICES_SUCCESS'; payload: Device[] }
  | { type: 'FETCH_DEVICES_FAILURE'; payload: string }
  | { type: 'SELECT_DEVICE'; payload: Device }
  | { type: 'UPDATE_DEVICE_STATUS'; payload: { id: string; status: 'online' | 'offline' } };

const deviceReducer = (state = initialState, action: DeviceAction): DeviceState => {
  switch (action.type) {
    case 'FETCH_DEVICES_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_DEVICES_SUCCESS':
      return {
        ...state,
        devices: action.payload,
        loading: false,
        error: null,
      };
    case 'FETCH_DEVICES_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'SELECT_DEVICE':
      return {
        ...state,
        selectedDevice: action.payload,
      };
    case 'UPDATE_DEVICE_STATUS':
      return {
        ...state,
        devices: state.devices.map(device => 
          device.id === action.payload.id 
            ? { ...device, status: action.payload.status } 
            : device
        ),
        selectedDevice: state.selectedDevice?.id === action.payload.id 
          ? { ...state.selectedDevice, status: action.payload.status } 
          : state.selectedDevice,
      };
    default:
      return state;
  }
};

export default deviceReducer;