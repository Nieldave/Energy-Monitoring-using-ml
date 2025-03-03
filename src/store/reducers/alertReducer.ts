import { Alert } from '../../types';

interface AlertState {
  alerts: Alert[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: AlertState = {
  alerts: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

type AlertAction =
  | { type: 'FETCH_ALERTS_REQUEST' }
  | { type: 'FETCH_ALERTS_SUCCESS'; payload: Alert[] }
  | { type: 'FETCH_ALERTS_FAILURE'; payload: string }
  | { type: 'NEW_ALERT'; payload: Alert }
  | { type: 'MARK_ALERT_READ'; payload: string };

const alertReducer = (state = initialState, action: AlertAction): AlertState => {
  switch (action.type) {
    case 'FETCH_ALERTS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_ALERTS_SUCCESS':
      return {
        ...state,
        alerts: action.payload,
        unreadCount: action.payload.filter(alert => !alert.read).length,
        loading: false,
        error: null,
      };
    case 'FETCH_ALERTS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'NEW_ALERT':
      return {
        ...state,
        alerts: [action.payload, ...state.alerts],
        unreadCount: state.unreadCount + 1,
      };
    case 'MARK_ALERT_READ':
      return {
        ...state,
        alerts: state.alerts.map(alert => 
          alert.id === action.payload 
            ? { ...alert, read: true } 
            : alert
        ),
        unreadCount: state.unreadCount - 1,
      };
    default:
      return state;
  }
};

export default alertReducer;