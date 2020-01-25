import { BasicFieldValues, FieldNames, FieldsErrors } from '../types';
import { SET_VALUE, UPDATE_ERRORS } from './actionTypes';

type ActionSetValue<
  FieldValues extends BasicFieldValues,
  FieldName extends FieldNames<FieldValues>
> = {
  type: typeof SET_VALUE;
  key: FieldName;
  value: FieldValues[FieldName];
};

type ActionUpdateErrors<
  FieldValues extends BasicFieldValues,
  FieldName extends FieldNames<FieldValues>
> = {
  type: typeof UPDATE_ERRORS;
  errors: FieldsErrors<FieldValues>;
};

export type Actions<FieldValues extends BasicFieldValues> =
  | ActionSetValue<FieldValues, FieldNames<FieldValues>>
  | ActionUpdateErrors<FieldValues, FieldNames<FieldValues>>;
