import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import authReducer from './reducers/authReducer';
import energyDataReducer from './reducers/energyDataReducer';
import deviceReducer from './reducers/deviceReducer';
import alertReducer from './reducers/alertReducer';
import budgetReducer from './reducers/budgetReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  energyData: energyDataReducer,
  devices: deviceReducer,
  alerts: alertReducer,
  budgets: budgetReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;