export type ValidateStatus = 'none' | 'validating' | 'success' | 'error';

export type FormState<FormFieldKey extends string> = {
  [key in FormFieldKey]: FormFieldState;
};

interface FormFieldState {
  value: any;
  error: string;
  validateStatus: ValidateStatus;
}

export type Timestamps = {
  [key: string]: number;
};
