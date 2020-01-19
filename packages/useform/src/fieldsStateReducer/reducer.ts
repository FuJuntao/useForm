import { BasicFieldValues, FieldNames, GetValueFromEvent } from '../types';
import { Actions } from './actions';
import { SET_VALUE } from './actionTypes';

interface FieldState<
  FieldValues extends BasicFieldValues,
  FieldName extends FieldNames<FieldValues>
> {
  value: FieldValues[FieldName];
  getValueFromEvent: GetValueFromEvent<FieldValues, FieldName>;
  collectValueTrigger: string;
  validationTriggers: string[];
}

export type State<FieldValues extends BasicFieldValues> = {
  [Key in FieldNames<FieldValues>]: FieldState<FieldValues, Key>;
};

export function reducer<FieldValues extends BasicFieldValues>(
  state: State<FieldValues>,
  action: Actions<FieldValues>,
) {
  switch (action.type) {
    case SET_VALUE: {
      const { key, value } = action;
      return { ...state, [key]: { ...state[key], value } };
    }
    default: {
      return state;
    }
  }
}
