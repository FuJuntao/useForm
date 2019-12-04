import { BasicFieldValues, FieldNames } from '../types';
import { REGISTER_FIELD, SET_VALUE } from './actionTypes';

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

export { Actions };
