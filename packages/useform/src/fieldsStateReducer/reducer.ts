import { BasicFieldValues, FieldError, FieldNames } from '../types';
import { Actions } from './actions';
import { SET_VALUE, UPDATE_ERRORS } from './actionTypes';

interface FieldState<T> {
  value: T;
  error: FieldError | null;
}

export type State<FieldValues extends BasicFieldValues, Keys extends string> = {
  [Key in Keys]: FieldState<FieldValues[Key]>;
};

export function reducer<FieldValues extends BasicFieldValues>(
  state: State<FieldValues, FieldNames<FieldValues>>,
  action: Actions<FieldValues, FieldNames<FieldValues>>,
) {
  switch (action.type) {
    case SET_VALUE: {
      const { key, value } = action;
      return { ...state, [key]: { ...state[key], value } };
    }
    case UPDATE_ERRORS: {
      const { errors } = action;
      if (!errors) return state;
      const newState = { ...state };
      Object.entries(errors).forEach(([key, error]) => {
        newState[key as FieldNames<FieldValues>].error = error;
      });
      return newState;
    }
    default: {
      return state;
    }
  }
}
