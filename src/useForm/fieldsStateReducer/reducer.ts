import { BasicFieldValues, FieldNames, GetValueFromEvent } from '../types';
import { Actions } from './actions';
import { REGISTER_FIELD } from './actionTypes';

interface FieldState<
  FieldValues extends BasicFieldValues,
  FieldName extends FieldNames<FieldValues>
> {
  value: FieldValues[FieldName];
  getValueFromEvent: GetValueFromEvent<FieldValues, FieldName>;
}

export type State<FieldValues extends BasicFieldValues> = {
  [Key in FieldNames<FieldValues>]?: FieldState<FieldValues, Key>;
};

export function reducer<FieldValues extends BasicFieldValues>(
  state: State<FieldValues>,
  action: Actions<FieldValues>,
) {
  switch (action.type) {
    case REGISTER_FIELD: {
      const { name, value, getValueFromEvent, collectValueTrigger } = action;
      return {
        ...state,
        [name]: { value, getValueFromEvent, collectValueTrigger },
      };
    }
    default: {
      return state;
    }
  }
}
