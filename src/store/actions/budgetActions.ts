import { Dispatch } from 'redux';
import * as api from '../../api';
import { Budget } from '../../types';

export const fetchBudgets = () => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: 'FETCH_BUDGETS_REQUEST' });
    const response = await api.getBudgets();
    dispatch({
      type: 'FETCH_BUDGETS_SUCCESS',
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: 'FETCH_BUDGETS_FAILURE',
      payload: error instanceof Error ? error.message : 'Failed to fetch budgets',
    });
  }
};

export const createBudget = (budgetData: Omit<Budget, 'id' | 'currentUsage'>) => async (dispatch: Dispatch) => {
  try {
    const response = await api.createBudget(budgetData);
    dispatch({
      type: 'CREATE_BUDGET_SUCCESS',
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    console.error('Create budget error:', error);
    throw error;
  }
};

export const updateBudget = (id: string, budgetData: Partial<Budget>) => async (dispatch: Dispatch) => {
  try {
    const response = await api.updateBudget(id, budgetData);
    dispatch({
      type: 'UPDATE_BUDGET_SUCCESS',
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    console.error('Update budget error:', error);
    throw error;
  }
};

export const deleteBudget = (id: string) => async (dispatch: Dispatch) => {
  try {
    await api.deleteBudget(id);
    dispatch({
      type: 'DELETE_BUDGET_SUCCESS',
      payload: id,
    });
  } catch (error) {
    console.error('Delete budget error:', error);
    throw error;
  }
};

export const updateBudgetUsage = (id: string, usage: number) => ({
  type: 'UPDATE_BUDGET_USAGE',
  payload: { id, usage },
});