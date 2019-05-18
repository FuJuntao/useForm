import * as actionTypes from './actionTypes';
import { ValidateStatus } from './types';

export type Actions = SetValueAction | SetErrorAction | SetValidateStatusAction;

interface SetValueAction {
  type: typeof actionTypes.SET_VALUE;
  id: string;
  value: string;
}

interface SetErrorAction {
  type: typeof actionTypes.SET_ERROR;
  id: string;
  error: string;
}

interface SetValidateStatusAction {
  type: typeof actionTypes.SET_VALIDATE_STATUS;
  id: string;
  validateStatus: ValidateStatus;
}
