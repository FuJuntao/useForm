import { Schema, ValidateOptions } from 'yup';

export type BasicFieldValues = Record<string, any>;

export type FieldName<T> = (keyof T & string) | string;

type BasicTypes =
  | DateConstructor
  | number
  | string
  | boolean
  | symbol
  | null
  | undefined;

type GetValueFromEvent<T = any> = (e: any) => T;

type KeyType = string | number;

export interface FormOptions<FieldValues> {
  defaultValues: FieldValues;
  getValueFromEvent?: GetValueFromEvent;
  collectValueTrigger?: string;
  validationTriggers?: string | string[];
  startValidationAfterSubmitting?: boolean;
  validationSchema?: Schema<Partial<FieldValues>>;
  validateOptions?: ValidateOptions;
}

export interface FieldOption<T> {
  getValueFromEvent: GetValueFromEvent<T>;
  collectValueTrigger: string;
  validationTriggers: string[];
  startValidationAfterSubmitting: boolean;
}

type NestedObject<T, P> = {
  [Key in keyof T]: T[Key] extends BasicTypes ? P : NestedObject<T[Key], P>;
};

type PartialNestedObject<T, P> = {
  [Key in keyof T]?: T[Key] extends BasicTypes
    ? P
    : PartialNestedObject<T[Key], P>;
};

export type FieldOptions<FieldValues> = {
  [Key in keyof FieldValues]?: keyof FieldValues[Key] extends KeyType
    ? FieldOptions<FieldValues[Key]>
    : FieldOption<FieldValues[Key]>;
};

export interface FieldError {
  type: string;
  message: string;
  errors: { [Key in string]: string };
}

export type FieldErrors<FieldValues> = PartialNestedObject<
  FieldValues,
  FieldError
>;

export type ValidationStatus = 'pending' | 'none';

export type FieldValidationStatus<FieldValues> = NestedObject<
  FieldValues,
  ValidationStatus
>;

export type FormState = {
  dirty: boolean;
  isSubmitting: boolean;
  hasSubmitted: boolean;
  submitCount: number;
};

export interface RegisterOption<FieldValues, T = any> {
  name: FieldName<FieldValues> | string;
  defaultValue?: T;
  getValueFromEvent?: GetValueFromEvent<T>;
  collectValueTrigger?: string;
  validationTriggers?: string | string[];
  startValidationAfterSubmitting?: boolean;
}

/* prettier-ignore */
export interface Register<FieldValues> {
  <T1>(...options: [RegisterOption<FieldValues, T1>]): void;
  <T1, T2>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>]): void;
  <T1, T2, T3>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>, RegisterOption<FieldValues, T3>]): void;
  <T1, T2, T3, T4>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>, RegisterOption<FieldValues, T3>, RegisterOption<FieldValues, T4>]): void;
  <T1, T2, T3, T4, T5>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>, RegisterOption<FieldValues, T3>, RegisterOption<FieldValues, T4>, RegisterOption<FieldValues, T5>]): void;
  <T1, T2, T3, T4, T5, T6>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>, RegisterOption<FieldValues, T3>, RegisterOption<FieldValues, T4>, RegisterOption<FieldValues, T5>, RegisterOption<FieldValues, T6>]): void;
  <T1, T2, T3, T4, T5, T6, T7>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>, RegisterOption<FieldValues, T3>, RegisterOption<FieldValues, T4>, RegisterOption<FieldValues, T5>, RegisterOption<FieldValues, T6>, RegisterOption<FieldValues, T7>]): void;
  <T1, T2, T3, T4, T5, T6, T7, T8>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>, RegisterOption<FieldValues, T3>, RegisterOption<FieldValues, T4>, RegisterOption<FieldValues, T5>, RegisterOption<FieldValues, T6>, RegisterOption<FieldValues, T7>, RegisterOption<FieldValues, T8>]): void;
  <T1, T2, T3, T4, T5, T6, T7, T8, T9>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>, RegisterOption<FieldValues, T3>, RegisterOption<FieldValues, T4>, RegisterOption<FieldValues, T5>, RegisterOption<FieldValues, T6>, RegisterOption<FieldValues, T7>, RegisterOption<FieldValues, T8>, RegisterOption<FieldValues, T9>]): void;
  <T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(...options: [RegisterOption<FieldValues, T1>, RegisterOption<FieldValues, T2>, RegisterOption<FieldValues, T3>, RegisterOption<FieldValues, T4>, RegisterOption<FieldValues, T5>, RegisterOption<FieldValues, T6>, RegisterOption<FieldValues, T7>, RegisterOption<FieldValues, T8>, RegisterOption<FieldValues, T9>, RegisterOption<FieldValues, T10>]): void;
  (...options: RegisterOption<FieldValues>[]): void;
}

export type Handlers = {
  [Key in any]?: (e: any) => void;
};
