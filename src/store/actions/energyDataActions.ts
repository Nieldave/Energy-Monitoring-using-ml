import { Dispatch } from 'redux';
import * as api from '../../api';

export const fetchEnergyData = (deviceId?: string, startDate?: string, endDate?: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: 'FETCH_ENERGY_DATA_REQUEST' });
    const response = await api.getEnergyData(deviceId, startDate, endDate);
    dispatch({
      type: 'FETCH_ENERGY_DATA_SUCCESS',
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: 'FETCH_ENERGY_DATA_FAILURE',
      payload: error instanceof Error ? error.message : 'Failed to fetch energy data',
    });
  }
};

export const fetchRealtimeData = (deviceId?: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: 'FETCH_REALTIME_DATA_REQUEST' });
    const response = await api.getRealtimeEnergyData(deviceId);
    dispatch({
      type: 'FETCH_REALTIME_DATA_SUCCESS',
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: 'FETCH_REALTIME_DATA_FAILURE',
      payload: error instanceof Error ? error.message : 'Failed to fetch realtime data',
    });
  }
};

export const fetchEnergyForecast = (deviceId: string, days: number) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: 'FETCH_FORECAST_DATA_REQUEST' });
    const response = await api.getEnergyForecast(deviceId, days);
    dispatch({
      type: 'FETCH_FORECAST_DATA_SUCCESS',
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: 'FETCH_FORECAST_DATA_FAILURE',
      payload: error instanceof Error ? error.message : 'Failed to fetch forecast data',
    });
  }
};

export const updateRealtimeData = (data: any) => ({
  type: 'UPDATE_REALTIME_DATA',
  payload: data,
});