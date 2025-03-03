import { Dispatch } from 'redux';
import * as api from '../../api';
import { Device } from '../../types';

export const fetchDevices = () => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: 'FETCH_DEVICES_REQUEST' });
    const response = await api.getDevices();
    dispatch({
      type: 'FETCH_DEVICES_SUCCESS',
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: 'FETCH_DEVICES_FAILURE',
      payload: error instanceof Error ? error.message : 'Failed to fetch devices',
    });
  }
};

export const selectDevice = (device: Device) => ({
  type: 'SELECT_DEVICE',
  payload: device,
});

export const updateDeviceStatus = (id: string, status: 'online' | 'offline') => ({
  type: 'UPDATE_DEVICE_STATUS',
  payload: { id, status },
});

export const updateDevice = (id: string, deviceData: Partial<Device>) => async (dispatch: Dispatch) => {
  try {
    const response = await api.updateDevice(id, deviceData);
    dispatch(fetchDevices());
    return response.data;
  } catch (error) {
    console.error('Update device error:', error);
    throw error;
  }
};