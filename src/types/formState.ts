export type ValidateStatus = 'none' | 'validating' | 'success' | 'error';

export type FormState<FormFeildKey extends string> = {
  [key in FormFeildKey]: FormFeildState
};

interface FormFeildState {
  value: any;
  error: string;
  validateStatus: ValidateStatus;
}

export type Timestamps = {
  [key: string]: number;
};
