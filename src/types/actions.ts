import { SET_VALUE, SET_ERROR, SET_VALIDATE_STATUS } from './actionTypes';
import { ValidateStatus } from './formState';

export type Actions<FormFeildKey> =
  | SetValueAction<FormFeildKey>
  | SetErrorAction<FormFeildKey>
  | SetValidateStatusAction<FormFeildKey>;

interface SetValueAction<FormFeildKey> {
  type: typeof SET_VALUE;
  id: FormFeildKey;
  value: string;
}

interface SetErrorAction<FormFeildKey> {
  type: typeof SET_ERROR;
  id: FormFeildKey;
  error: string;
}

interface SetValidateStatusAction<FormFeildKey> {
  type: typeof SET_VALIDATE_STATUS;
  id: FormFeildKey;
  validateStatus: ValidateStatus;
}
