import { Budget } from '../../types';

interface BudgetState {
  budgets: Budget[];
  loading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  budgets: [],
  loading: false,
  error: null,
};

type BudgetAction =
  | { type: 'FETCH_BUDGETS_REQUEST' }
  | { type: 'FETCH_BUDGETS_SUCCESS'; payload: Budget[] }
  | { type: 'FETCH_BUDGETS_FAILURE'; payload: string }
  | { type: 'CREATE_BUDGET_SUCCESS'; payload: Budget }
  | { type: 'UPDATE_BUDGET_SUCCESS'; payload: Budget }
  | { type: 'DELETE_BUDGET_SUCCESS'; payload: string }
  | { type: 'UPDATE_BUDGET_USAGE'; payload: { id: string; usage: number } };

const budgetReducer = (state = initialState, action: BudgetAction): BudgetState => {
  switch (action.type) {
    case 'FETCH_BUDGETS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_BUDGETS_SUCCESS':
      return {
        ...state,
        budgets: action.payload,
        loading: false,
        error: null,
      };
    case 'FETCH_BUDGETS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'CREATE_BUDGET_SUCCESS':
      return {
        ...state,
        budgets: [...state.budgets, action.payload],
      };
    case 'UPDATE_BUDGET_SUCCESS':
      return {
        ...state,
        budgets: state.budgets.map(budget => 
          budget.id === action.payload.id 
            ? action.payload 
            : budget
        ),
      };
    case 'DELETE_BUDGET_SUCCESS':
      return {
        ...state,
        budgets: state.budgets.filter(budget => budget.id !== action.payload),
      };
    case 'UPDATE_BUDGET_USAGE':
      return {
        ...state,
        budgets: state.budgets.map(budget => 
          budget.id === action.payload.id 
            ? { ...budget, currentUsage: action.payload.usage } 
            : budget
        ),
      };
    default:
      return state;
  }
};

export default budgetReducer;