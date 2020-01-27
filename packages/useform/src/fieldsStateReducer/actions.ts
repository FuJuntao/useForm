import { BasicFieldValues, FieldsErrors } from '../types';
import { SET_VALUE, UPDATE_ERRORS } from './actionTypes';

type ActionSetValue<K extends string, T> = {
  type: typeof SET_VALUE;
  key: K;
  value: T;
};

type ActionUpdateErrors<T extends string> = {
  type: typeof UPDATE_ERRORS;
  errors: FieldsErrors<T>;
};

export type Actions<
  FieldValues extends BasicFieldValues,
  FieldNames extends string
> =
  | ActionSetValue<FieldNames, FieldValues[FieldNames]>
  | ActionUpdateErrors<FieldNames>;
