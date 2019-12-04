import { BasicFieldValues, FieldNames } from './types';
import { Reducer } from 'react';

const SET_VALUE = 'SET_VALUE';

const REGISTER_FIELD = 'REGISTER_FIELD';

type SetValueAction<
  FieldValues extends BasicFieldValues,
  FieldName extends FieldNames<FieldValues>
> = {
  type: typeof SET_VALUE;
  name: FieldName;
  value: FieldValues[FieldName];
};

type RegisterFieldAction<
  FieldValues extends BasicFieldValues,
  FieldName extends FieldNames<FieldValues>
> = {
  type: typeof REGISTER_FIELD;
  name: FieldName;
  value?: FieldValues[FieldName];
};

type Actions<FieldValues extends BasicFieldValues> =
  | SetValueAction<FieldValues, FieldNames<FieldValues>>
  | RegisterFieldAction<FieldValues, FieldNames<FieldValues>>;

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
