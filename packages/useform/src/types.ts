import { Schema } from 'yup';

export type BasicFieldValues = Record<string, any>;

export type FieldNames<FieldValues> = Extract<keyof FieldValues, string>;

export type GetValueFromEvent<
  FieldValues extends BasicFieldValues,
  FieldName extends FieldNames<FieldValues>
> = (e: any) => FieldValues[FieldName];

type ValidationMode = 'onSubmit' | 'onChange';

interface RegisterOptions<
  FieldValues extends BasicFieldValues,
  FieldName extends FieldNames<FieldValues>
> {
  defaultValue?: FieldValues[FieldName];
  getValueFromEvent?: GetValueFromEvent<FieldValues, FieldName>;
  collectValueTrigger?: string;
  validationTriggers?: string | string[];
}

export type Register<FieldValues extends BasicFieldValues> = {
  [Key in FieldNames<FieldValues>]: RegisterOptions<FieldValues, Key>;
};

export type FormOptions<FieldValues extends BasicFieldValues> = {
  register: Register<FieldValues>;
  getValueFromEvent?: GetValueFromEvent<FieldValues, any>;
  collectValueTrigger?: string;
  validationMode?: ValidationMode;
  validationSchema?: Schema<FieldValues>;
};

export type Handlers = {
  [Key in string]: (e: any) => void;
};
