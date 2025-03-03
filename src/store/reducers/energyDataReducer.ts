import { EnergyData } from '../../types';

interface EnergyDataState {
  historicalData: EnergyData[];
  realtimeData: EnergyData[];
  forecastData: EnergyData[];
  loading: boolean;
  error: string | null;
}

const initialState: EnergyDataState = {
  historicalData: [],
  realtimeData: [],
  forecastData: [],
  loading: false,
  error: null,
};

type EnergyDataAction =
  | { type: 'FETCH_ENERGY_DATA_REQUEST' }
  | { type: 'FETCH_ENERGY_DATA_SUCCESS'; payload: EnergyData[] }
  | { type: 'FETCH_ENERGY_DATA_FAILURE'; payload: string }
  | { type: 'FETCH_REALTIME_DATA_REQUEST' }
  | { type: 'FETCH_REALTIME_DATA_SUCCESS'; payload: EnergyData[] }
  | { type: 'FETCH_REALTIME_DATA_FAILURE'; payload: string }
  | { type: 'FETCH_FORECAST_DATA_REQUEST' }
  | { type: 'FETCH_FORECAST_DATA_SUCCESS'; payload: EnergyData[] }
  | { type: 'FETCH_FORECAST_DATA_FAILURE'; payload: string }
  | { type: 'UPDATE_REALTIME_DATA'; payload: EnergyData };

const energyDataReducer = (state = initialState, action: EnergyDataAction): EnergyDataState => {
  switch (action.type) {
    case 'FETCH_ENERGY_DATA_REQUEST':
    case 'FETCH_REALTIME_DATA_REQUEST':
    case 'FETCH_FORECAST_DATA_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_ENERGY_DATA_SUCCESS':
      return {
        ...state,
        historicalData: action.payload,
        loading: false,
        error: null,
      };
    case 'FETCH_REALTIME_DATA_SUCCESS':
      return {
        ...state,
        realtimeData: action.payload,
        loading: false,
        error: null,
      };
    case 'FETCH_FORECAST_DATA_SUCCESS':
      return {
        ...state,
        forecastData: action.payload,
        loading: false,
        error: null,
      };
    case 'FETCH_ENERGY_DATA_FAILURE':
    case 'FETCH_REALTIME_DATA_FAILURE':
    case 'FETCH_FORECAST_DATA_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'UPDATE_REALTIME_DATA':
      return {
        ...state,
        realtimeData: [...state.realtimeData, action.payload],
      };
    default:
      return state;
  }
};

export default energyDataReducer;