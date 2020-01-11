import { FieldNames, BasicFieldValues } from '../types';
import { Actions } from './actions';
import { MARK_FORM_DIRTY, MARK_FORM_SUBMITTED } from './actionTypes';

export type State<FieldValues extends BasicFieldValues> = {
  dirty: boolean;
  hasSubmitted: boolean;
  touched: FieldNames<FieldValues>[];
  submitCount: number;
  isValid: boolean;
};

export function reducer<FieldValues extends BasicFieldValues>(
  state: State<FieldValues>,
  action: Actions,
) {
  switch (action.type) {
    case MARK_FORM_DIRTY: {
      return { ...state, dirty: true };
    }
    case MARK_FORM_SUBMITTED: {
      return { ...state, hasSubmitted: true };
    }
    default: {
      return state;
    }
  }
}
