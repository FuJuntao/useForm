import { BasicFieldValues, FieldsErrors } from '../types';
import { SET_VALUE, UPDATE_ERRORS } from './actionTypes';

type ActionSetValue<K, T> = {
  type: typeof SET_VALUE;
  key: K;
  value: T;
};

type ActionUpdateErrors<FieldValues extends BasicFieldValues> = {
  type: typeof UPDATE_ERRORS;
  errors: FieldsErrors<FieldValues>;
};

export type Actions<FieldValues extends BasicFieldValues> =
  | ActionSetValue<keyof FieldValues, FieldValues>
  | ActionUpdateErrors<FieldValues>;
