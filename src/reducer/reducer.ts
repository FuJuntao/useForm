import { Reducer } from 'react';
import { BasicFieldValues, FieldNames } from '../types';
import { Actions } from './actions';
import { REGISTER_FIELD, SET_VALUE } from './actionTypes';

interface FieldState<
  FieldValues extends BasicFieldValues,
  FieldName extends FieldNames<FieldValues>
> {
  value: FieldValues[FieldName];
}

type State<FieldValues extends BasicFieldValues> = {
  [Key in FieldNames<FieldValues>]?: FieldState<FieldValues, Key>;
};

export type FormReducer<FieldValues extends BasicFieldValues> = Reducer<
  State<FieldValues>,
  Actions<FieldValues>
>;

export function reducer<FieldValues extends BasicFieldValues>(
  state: State<FieldValues>,
  action: Actions<FieldValues>,
) {
  switch (action.type) {
    case REGISTER_FIELD: {
      const { name, value } = action;
      return { ...state, [name]: { value } };
    }
    case SET_VALUE: {
      const { name: id, value } = action;
      return {
        ...state,
        [id]: {
          ...state[id],
          value,
        },
      };
    }

    default: {
      return state;
    }
  }
}
