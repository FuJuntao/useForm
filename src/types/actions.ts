import { SET_VALUE, SET_ERROR, SET_VALIDATE_STATUS } from './actionTypes';
import { ValidateStatus } from './formState';

export type Actions<FormFieldKey> =
  | SetValueAction<FormFieldKey>
  | SetErrorAction<FormFieldKey>
  | SetValidateStatusAction<FormFieldKey>;

interface SetValueAction<FormFieldKey> {
  type: typeof SET_VALUE;
  id: FormFieldKey;
  value: string;
}

interface SetErrorAction<FormFieldKey> {
  type: typeof SET_ERROR;
  id: FormFieldKey;
  error: string;
}

interface SetValidateStatusAction<FormFieldKey> {
  type: typeof SET_VALIDATE_STATUS;
  id: FormFieldKey;
  validateStatus: ValidateStatus;
}
