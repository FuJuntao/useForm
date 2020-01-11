import { SET_VALUE } from './actionTypes';
import { BasicFieldValues, FieldNames } from '../types';

type ActionSetValue<
  FieldValues extends BasicFieldValues,
  FieldName extends FieldNames<FieldValues>
> = {
  type: typeof SET_VALUE;
  key: FieldName;
  value: FieldValues[FieldName];
};

export type Actions<FieldValues extends BasicFieldValues> = ActionSetValue<
  FieldValues,
  FieldNames<FieldValues>
>;
