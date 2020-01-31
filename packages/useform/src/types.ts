import { Schema } from 'yup';

export type BasicFieldValues = Record<string, any>;

export type FieldNames<FieldValues extends BasicFieldValues> = Extract<
  keyof FieldValues,
  string
>;

type GetValueFromEvent<T = any> = (e: any) => T;

export interface FormOptions<FieldValues> {
  defaultValues: FieldValues;
  getValueFromEvent?: GetValueFromEvent;
  collectValueTrigger?: string;
  validationTriggers?: string | string[];
  startValidationAfterSubmitting?: boolean;
}

export interface RegisterOption<
  FieldValues,
  Key extends keyof FieldValues = keyof FieldValues
> {
  name: Key;
  defaultValue?: FieldValues[Key];
  getValueFromEvent?: GetValueFromEvent<FieldValues[Key]>;
  collectValueTrigger?: string;
  validationTriggers?: string | string[];
  validationSchema?: Schema<FieldValues[Key]>;
  startValidationAfterSubmitting?: boolean;
}

export type FieldOptions<FieldValues> = {
  [Key in keyof FieldValues]?: {
    getValueFromEvent: GetValueFromEvent<FieldValues[Key]>;
    collectValueTrigger: string;
    validationTriggers: string[];
    validationSchema?: Schema<FieldValues[Key]>;
    startValidationAfterSubmitting: boolean;
  };
};

/* prettier-ignore */
export interface Register<FieldValues> {
  <T1 extends keyof FieldValues>(...options: [RegisterOption<FieldValues, T1>]): void;
  <T1 extends keyof FieldValues, T2 extends keyof FieldValues>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>]): void;
  <T1 extends keyof FieldValues, T2 extends keyof FieldValues, T3 extends keyof FieldValues>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>, RegisterOption<FieldValues, T3>]): void;
  <T1 extends keyof FieldValues, T2 extends keyof FieldValues, T3 extends keyof FieldValues, T4 extends keyof FieldValues>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>, RegisterOption<FieldValues, T3>, RegisterOption<FieldValues, T4>]): void;
  <T1 extends keyof FieldValues, T2 extends keyof FieldValues, T3 extends keyof FieldValues, T4 extends keyof FieldValues, T5 extends keyof FieldValues>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>, RegisterOption<FieldValues, T3>, RegisterOption<FieldValues, T4>, RegisterOption<FieldValues, T5>]): void;
  <T1 extends keyof FieldValues, T2 extends keyof FieldValues, T3 extends keyof FieldValues, T4 extends keyof FieldValues, T5 extends keyof FieldValues, T6 extends keyof FieldValues>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>, RegisterOption<FieldValues, T3>, RegisterOption<FieldValues, T4>, RegisterOption<FieldValues, T5>, RegisterOption<FieldValues, T6>]): void;
  <T1 extends keyof FieldValues, T2 extends keyof FieldValues, T3 extends keyof FieldValues, T4 extends keyof FieldValues, T5 extends keyof FieldValues, T6 extends keyof FieldValues, T7 extends keyof FieldValues>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>, RegisterOption<FieldValues, T3>, RegisterOption<FieldValues, T4>, RegisterOption<FieldValues, T5>, RegisterOption<FieldValues, T6>, RegisterOption<FieldValues, T7>]): void;
  <T1 extends keyof FieldValues, T2 extends keyof FieldValues, T3 extends keyof FieldValues, T4 extends keyof FieldValues, T5 extends keyof FieldValues, T6 extends keyof FieldValues, T7 extends keyof FieldValues, T8 extends keyof FieldValues>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>, RegisterOption<FieldValues, T3>, RegisterOption<FieldValues, T4>, RegisterOption<FieldValues, T5>, RegisterOption<FieldValues, T6>, RegisterOption<FieldValues, T7>, RegisterOption<FieldValues, T8>]): void;
  <T1 extends keyof FieldValues, T2 extends keyof FieldValues, T3 extends keyof FieldValues, T4 extends keyof FieldValues, T5 extends keyof FieldValues, T6 extends keyof FieldValues, T7 extends keyof FieldValues, T8 extends keyof FieldValues, T9 extends keyof FieldValues>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>, RegisterOption<FieldValues, T3>, RegisterOption<FieldValues, T4>, RegisterOption<FieldValues, T5>, RegisterOption<FieldValues, T6>, RegisterOption<FieldValues, T7>, RegisterOption<FieldValues, T8>, RegisterOption<FieldValues, T9>]): void;
  <T1 extends keyof FieldValues, T2 extends keyof FieldValues, T3 extends keyof FieldValues, T4 extends keyof FieldValues, T5 extends keyof FieldValues, T6 extends keyof FieldValues, T7 extends keyof FieldValues, T8 extends keyof FieldValues, T9 extends keyof FieldValues, T10 extends keyof FieldValues>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>, RegisterOption<FieldValues, T3>, RegisterOption<FieldValues, T4>, RegisterOption<FieldValues, T5>, RegisterOption<FieldValues, T6>, RegisterOption<FieldValues, T7>, RegisterOption<FieldValues, T8>, RegisterOption<FieldValues, T9>, RegisterOption<FieldValues, T10>]): void;
  (...options: RegisterOption<FieldValues>[]): void;
}

export type Handlers<Keys = string> = {
  [Key in Extract<Keys, string>]: (e: any) => void;
};

export interface FieldError {
  type: string;
  message: string;
  errors: { [Key in string]: string };
}

export type FieldErrors<FieldValues extends BasicFieldValues> = {
  [Key in FieldNames<FieldValues>]?: FieldError;
};

export type FormState = {
  dirty: boolean;
  hasSubmitted: boolean;
  submitCount: number;
};
