import { Schema, ValidateOptions } from 'yup';

export type BasicFieldValues = Record<string, any>;

export type FieldNames<FieldValues extends BasicFieldValues> = Extract<
  keyof FieldValues,
  string
>;

type GetValueFromEvent<T = any> = (e: any) => T;

export interface RegisterOption<
  FieldValues,
  Key extends FieldNames<FieldValues> = FieldNames<FieldValues>
> {
  name: Key;
  defaultValue?: FieldValues[Key];
  getValueFromEvent?: GetValueFromEvent<FieldValues[Key]>;
  collectValueTrigger?: string;
  validationTriggers?: string | string[];
  validationSchema?: Schema<FieldValues[Key]>;
  startValidationAfterSubmitting?: boolean;
}

/* prettier-ignore */
export interface Register<FieldValues> {
  <T1 extends FieldNames<FieldValues>>(...options: [RegisterOption<FieldValues, T1>]): void;
  <T1 extends FieldNames<FieldValues>, T2 extends FieldNames<FieldValues>>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>]): void;
  <T1 extends FieldNames<FieldValues>, T2 extends FieldNames<FieldValues>, T3 extends FieldNames<FieldValues>>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>, RegisterOption<FieldValues, T3>]): void;
  <T1 extends FieldNames<FieldValues>, T2 extends FieldNames<FieldValues>, T3 extends FieldNames<FieldValues>, T4 extends FieldNames<FieldValues>>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>, RegisterOption<FieldValues, T3>, RegisterOption<FieldValues, T4>]): void;
  <T1 extends FieldNames<FieldValues>, T2 extends FieldNames<FieldValues>, T3 extends FieldNames<FieldValues>, T4 extends FieldNames<FieldValues>, T5 extends FieldNames<FieldValues>>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>, RegisterOption<FieldValues, T3>, RegisterOption<FieldValues, T4>, RegisterOption<FieldValues, T5>]): void;
  <T1 extends FieldNames<FieldValues>, T2 extends FieldNames<FieldValues>, T3 extends FieldNames<FieldValues>, T4 extends FieldNames<FieldValues>, T5 extends FieldNames<FieldValues>, T6 extends FieldNames<FieldValues>>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>, RegisterOption<FieldValues, T3>, RegisterOption<FieldValues, T4>, RegisterOption<FieldValues, T5>, RegisterOption<FieldValues, T6>]): void;
  <T1 extends FieldNames<FieldValues>, T2 extends FieldNames<FieldValues>, T3 extends FieldNames<FieldValues>, T4 extends FieldNames<FieldValues>, T5 extends FieldNames<FieldValues>, T6 extends FieldNames<FieldValues>, T7 extends FieldNames<FieldValues>>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>, RegisterOption<FieldValues, T3>, RegisterOption<FieldValues, T4>, RegisterOption<FieldValues, T5>, RegisterOption<FieldValues, T6>, RegisterOption<FieldValues, T7>]): void;
  <T1 extends FieldNames<FieldValues>, T2 extends FieldNames<FieldValues>, T3 extends FieldNames<FieldValues>, T4 extends FieldNames<FieldValues>, T5 extends FieldNames<FieldValues>, T6 extends FieldNames<FieldValues>, T7 extends FieldNames<FieldValues>, T8 extends FieldNames<FieldValues>>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>, RegisterOption<FieldValues, T3>, RegisterOption<FieldValues, T4>, RegisterOption<FieldValues, T5>, RegisterOption<FieldValues, T6>, RegisterOption<FieldValues, T7>, RegisterOption<FieldValues, T8>]): void;
  <T1 extends FieldNames<FieldValues>, T2 extends FieldNames<FieldValues>, T3 extends FieldNames<FieldValues>, T4 extends FieldNames<FieldValues>, T5 extends FieldNames<FieldValues>, T6 extends FieldNames<FieldValues>, T7 extends FieldNames<FieldValues>, T8 extends FieldNames<FieldValues>, T9 extends FieldNames<FieldValues>>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>, RegisterOption<FieldValues, T3>, RegisterOption<FieldValues, T4>, RegisterOption<FieldValues, T5>, RegisterOption<FieldValues, T6>, RegisterOption<FieldValues, T7>, RegisterOption<FieldValues, T8>, RegisterOption<FieldValues, T9>]): void;
  <T1 extends FieldNames<FieldValues>, T2 extends FieldNames<FieldValues>, T3 extends FieldNames<FieldValues>, T4 extends FieldNames<FieldValues>, T5 extends FieldNames<FieldValues>, T6 extends FieldNames<FieldValues>, T7 extends FieldNames<FieldValues>, T8 extends FieldNames<FieldValues>, T9 extends FieldNames<FieldValues>, T10 extends FieldNames<FieldValues>>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>, RegisterOption<FieldValues, T3>, RegisterOption<FieldValues, T4>, RegisterOption<FieldValues, T5>, RegisterOption<FieldValues, T6>, RegisterOption<FieldValues, T7>, RegisterOption<FieldValues, T8>, RegisterOption<FieldValues, T9>, RegisterOption<FieldValues, T10>]): void;
  (...options: RegisterOption<FieldValues>[]): void;
}

export type Handlers<Keys = string> = {
  [Key in Extract<Keys, string>]: (e: any) => void;
};

export interface FormOptions<FieldValues> {
  defaultValues: FieldValues;
  getValueFromEvent?: GetValueFromEvent;
  collectValueTrigger?: string;
  validationTriggers?: string | string[];
  startValidationAfterSubmitting?: boolean;
  validateOptions?: ValidateOptions;
}

export type FieldOptions<FieldValues> = {
  [Key in FieldNames<FieldValues>]?: {
    getValueFromEvent: GetValueFromEvent<FieldValues[Key]>;
    collectValueTrigger: string;
    validationTriggers: string[];
    validationSchema?: Schema<FieldValues[Key]>;
    startValidationAfterSubmitting: boolean;
  };
};

export interface FieldError {
  type: string;
  message: string;
  errors: { [Key in string]: string };
}

export type FieldErrors<FieldValues extends BasicFieldValues> = {
  [Key in FieldNames<FieldValues>]?: FieldError;
};

export type ValidationStatus = 'pending' | 'none';

export type FieldValidationStatus<FieldValues extends BasicFieldValues> = {
  [Key in FieldNames<FieldValues>]?: ValidationStatus;
};

export type FormState = {
  dirty: boolean;
  isSubmitting: boolean;
  hasSubmitted: boolean;
  submitCount: number;
};

export interface MethodGetOptions {
  nested?: boolean;
}
