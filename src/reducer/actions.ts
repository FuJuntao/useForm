import { BasicFieldValues, FieldNames, GetValueFromEvent } from '../types';
import { REGISTER_FIELD } from './actionTypes';

type RegisterFieldAction<
  FieldValues extends BasicFieldValues,
  FieldName extends FieldNames<FieldValues>
> = {
  type: typeof REGISTER_FIELD;
  name: FieldName;
  value?: FieldValues[FieldName];
  getValueFromEvent: GetValueFromEvent<FieldValues, FieldName>;
};

type Actions<FieldValues extends BasicFieldValues> = RegisterFieldAction<
  FieldValues,
  FieldNames<FieldValues>
>;

export { Actions };
