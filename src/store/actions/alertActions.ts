import { Dispatch } from 'redux';
import * as api from '../../api';
import { Alert } from '../../types';

export const fetchAlerts = () => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: 'FETCH_ALERTS_REQUEST' });
    const response = await api.getAlerts();
    dispatch({
      type: 'FETCH_ALERTS_SUCCESS',
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: 'FETCH_ALERTS_FAILURE',
      payload: error instanceof Error ? error.message : 'Failed to fetch alerts',
    });
  }
};

export const markAlertAsRead = (id: string) => async (dispatch: Dispatch) => {
  try {
    await api.markAlertAsRead(id);
    dispatch({
      type: 'MARK_ALERT_READ',
      payload: id,
    });
  } catch (error) {
    console.error('Mark alert as read error:', error);
  }
};

export const receiveNewAlert = (alert: Alert) => ({
  type: 'NEW_ALERT',
  payload: alert,
});