import { Schema } from 'yup';

export type BasicFieldValues = Record<string, any>;

export type FieldNames<FieldValues> = Extract<keyof FieldValues, string>;

export type GetValueFromEvent<T = any> = (e: any) => T;

interface RegisterOptions<T> {
  defaultValue: T;
  getValueFromEvent?: GetValueFromEvent<T>;
  collectValueTrigger?: string;
  validationTriggers?: string | string[];
}

export type Register<FieldValues extends BasicFieldValues> = {
  [Key in FieldNames<FieldValues>]: RegisterOptions<FieldValues[Key]>;
};

interface FieldOptions<T> {
  defaultValue: T;
  getValueFromEvent: GetValueFromEvent<T>;
  collectValueTrigger: string;
  validationTriggers: string[];
}

export type FieldsOptions<FieldValues extends BasicFieldValues> = {
  [Key in FieldNames<FieldValues>]: FieldOptions<FieldValues[Key]>;
};

type ValidationMode = 'onSubmit' | 'onChange';

export type FormOptions<FieldValues extends BasicFieldValues> = {
  register: Register<FieldValues>;
  getValueFromEvent?: GetValueFromEvent;
  collectValueTrigger?: string;
  validationMode?: ValidationMode;
  validationSchema?: Schema<FieldValues>;
};

export type Handlers<Keys = string> = {
  [Key in Extract<Keys, string>]: (e: any) => void;
};

export interface FieldError {
  type: string;
  message: string;
  errors: { [Key in string]: string };
}

export type FieldsErrors<T extends string> = {
  [Key in T]: FieldError | null;
};
