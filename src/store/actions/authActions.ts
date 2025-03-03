import { Dispatch } from 'redux';
import * as api from '../../api';
import { User } from '../../types';

export const login = (email: string, password: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: 'LOGIN_REQUEST' });
    const response = await api.login(email, password);
    
    // Extract token and user from response
    const { access_token, user } = response.data;
    
    // Store token in localStorage
    localStorage.setItem('token', access_token);
    
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: { user, token: access_token },
    });
  } catch (error) {
    dispatch({
      type: 'LOGIN_FAILURE',
      payload: error instanceof Error ? error.message : 'Login failed',
    });
  }
};

export const register = (name: string, email: string, password: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: 'REGISTER_REQUEST' });
    const response = await api.register(name, email, password);
    
    // Extract token and user from response
    const { access_token, user } = response.data;
    
    // Store token in localStorage
    localStorage.setItem('token', access_token);
    
    dispatch({
      type: 'REGISTER_SUCCESS',
      payload: { user, token: access_token },
    });
  } catch (error) {
    dispatch({
      type: 'REGISTER_FAILURE',
      payload: error instanceof Error ? error.message : 'Registration failed',
    });
  }
};

export const logout = () => async (dispatch: Dispatch) => {
  try {
    await api.logout();
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  } catch (error) {
    console.error('Logout error:', error);
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  }
};

export const loadUser = () => async (dispatch: Dispatch) => {
  try {
    const response = await api.getCurrentUser();
    dispatch({
      type: 'USER_LOADED',
      payload: response.data,
    });
  } catch (error) {
    dispatch({ type: 'AUTH_ERROR' });
  }
};

export const updateProfile = (userData: Partial<User>) => async (dispatch: Dispatch) => {
  try {
    const response = await api.updateUserProfile(userData);
    dispatch({
      type: 'USER_LOADED',
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};