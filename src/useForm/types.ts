export type BasicFieldValues = Record<string, any>;

export type FieldNames<FieldValues> = Extract<keyof FieldValues, string>;

export type GetValueFromEvent<
  FieldValues extends BasicFieldValues,
  FieldName extends FieldNames<FieldValues>
> = (e: any) => FieldValues[FieldName];

type ValidationMode = 'onSubmit' | 'onChange';

export type FormOptions<FieldValues extends BasicFieldValues> = {
  getValueFromEvent?: GetValueFromEvent<FieldValues, any>;
  collectValueTrigger?: string;
  validationMode?: ValidationMode;
};

// TODO:
// Could return boolean
type ValidationResult = void | string;

type CallbackValidator<
  FieldValues extends BasicFieldValues,
  FieldName extends FieldNames<FieldValues>
> = (
  value: FieldValues[FieldName],
) => ValidationResult | Promise<ValidationResult>;

// TODO:
// Should have some builtin validators: required, minLength, pattern, etc...
type Validators<
  FieldValues extends BasicFieldValues,
  FieldName extends FieldNames<FieldValues>
> = {
  validate: CallbackValidator<FieldValues, FieldName>;
};

export interface RegisterOptions<
  FieldValues extends BasicFieldValues,
  FieldName extends FieldNames<FieldValues>
> {
  name: FieldName;
  defaultValue?: FieldValues[FieldName];
  getValueFromEvent?: GetValueFromEvent<FieldValues, FieldName>;
  collectValueTrigger?: string;
  validationTriggers?: string[];
  // validators?: Validators<FieldValues, FieldName>;
}

export interface Register<FieldValues extends BasicFieldValues> {
  <T1 extends FieldNames<FieldValues>>(
    arg1: RegisterOptions<FieldValues, T1>,
  ): void;
  <T1 extends FieldNames<FieldValues>, T2 extends FieldNames<FieldValues>>(
    arg1: RegisterOptions<FieldValues, T1>,
    arg2: RegisterOptions<FieldValues, T2>,
  ): void;
  <
    T1 extends FieldNames<FieldValues>,
    T2 extends FieldNames<FieldValues>,
    T3 extends FieldNames<FieldValues>
  >(
    arg1: RegisterOptions<FieldValues, T1>,
    arg2: RegisterOptions<FieldValues, T2>,
    arg3: RegisterOptions<FieldValues, T3>,
  ): void;
  <
    T1 extends FieldNames<FieldValues>,
    T2 extends FieldNames<FieldValues>,
    T3 extends FieldNames<FieldValues>,
    T4 extends FieldNames<FieldValues>
  >(
    arg1: RegisterOptions<FieldValues, T1>,
    arg2: RegisterOptions<FieldValues, T2>,
    arg3: RegisterOptions<FieldValues, T3>,
    arg4: RegisterOptions<FieldValues, T4>,
  ): void;
  <
    T1 extends FieldNames<FieldValues>,
    T2 extends FieldNames<FieldValues>,
    T3 extends FieldNames<FieldValues>,
    T4 extends FieldNames<FieldValues>,
    T5 extends FieldNames<FieldValues>
  >(
    arg1: RegisterOptions<FieldValues, T1>,
    arg2: RegisterOptions<FieldValues, T2>,
    arg3: RegisterOptions<FieldValues, T3>,
    arg4: RegisterOptions<FieldValues, T4>,
    arg5: RegisterOptions<FieldValues, T5>,
  ): void;
  <
    T1 extends FieldNames<FieldValues>,
    T2 extends FieldNames<FieldValues>,
    T3 extends FieldNames<FieldValues>,
    T4 extends FieldNames<FieldValues>,
    T5 extends FieldNames<FieldValues>,
    T6 extends FieldNames<FieldValues>
  >(
    arg1: RegisterOptions<FieldValues, T1>,
    arg2: RegisterOptions<FieldValues, T2>,
    arg3: RegisterOptions<FieldValues, T3>,
    arg4: RegisterOptions<FieldValues, T4>,
    arg5: RegisterOptions<FieldValues, T5>,
    arg6: RegisterOptions<FieldValues, T6>,
  ): void;
  <
    T1 extends FieldNames<FieldValues>,
    T2 extends FieldNames<FieldValues>,
    T3 extends FieldNames<FieldValues>,
    T4 extends FieldNames<FieldValues>,
    T5 extends FieldNames<FieldValues>,
    T6 extends FieldNames<FieldValues>,
    T7 extends FieldNames<FieldValues>
  >(
    arg1: RegisterOptions<FieldValues, T1>,
    arg2: RegisterOptions<FieldValues, T2>,
    arg3: RegisterOptions<FieldValues, T3>,
    arg4: RegisterOptions<FieldValues, T4>,
    arg5: RegisterOptions<FieldValues, T5>,
    arg6: RegisterOptions<FieldValues, T6>,
    arg7: RegisterOptions<FieldValues, T7>,
  ): void;
  <
    T1 extends FieldNames<FieldValues>,
    T2 extends FieldNames<FieldValues>,
    T3 extends FieldNames<FieldValues>,
    T4 extends FieldNames<FieldValues>,
    T5 extends FieldNames<FieldValues>,
    T6 extends FieldNames<FieldValues>,
    T7 extends FieldNames<FieldValues>,
    T8 extends FieldNames<FieldValues>
  >(
    arg1: RegisterOptions<FieldValues, T1>,
    arg2: RegisterOptions<FieldValues, T2>,
    arg3: RegisterOptions<FieldValues, T3>,
    arg4: RegisterOptions<FieldValues, T4>,
    arg5: RegisterOptions<FieldValues, T5>,
    arg6: RegisterOptions<FieldValues, T6>,
    arg7: RegisterOptions<FieldValues, T7>,
    arg8: RegisterOptions<FieldValues, T8>,
  ): void;
  <
    T1 extends FieldNames<FieldValues>,
    T2 extends FieldNames<FieldValues>,
    T3 extends FieldNames<FieldValues>,
    T4 extends FieldNames<FieldValues>,
    T5 extends FieldNames<FieldValues>,
    T6 extends FieldNames<FieldValues>,
    T7 extends FieldNames<FieldValues>,
    T8 extends FieldNames<FieldValues>,
    T9 extends FieldNames<FieldValues>
  >(
    arg1: RegisterOptions<FieldValues, T1>,
    arg2: RegisterOptions<FieldValues, T2>,
    arg3: RegisterOptions<FieldValues, T3>,
    arg4: RegisterOptions<FieldValues, T4>,
    arg5: RegisterOptions<FieldValues, T5>,
    arg6: RegisterOptions<FieldValues, T6>,
    arg7: RegisterOptions<FieldValues, T7>,
    arg8: RegisterOptions<FieldValues, T8>,
    arg9: RegisterOptions<FieldValues, T9>,
  ): void;
  <
    T1 extends FieldNames<FieldValues>,
    T2 extends FieldNames<FieldValues>,
    T3 extends FieldNames<FieldValues>,
    T4 extends FieldNames<FieldValues>,
    T5 extends FieldNames<FieldValues>,
    T6 extends FieldNames<FieldValues>,
    T7 extends FieldNames<FieldValues>,
    T8 extends FieldNames<FieldValues>,
    T9 extends FieldNames<FieldValues>,
    T10 extends FieldNames<FieldValues>
  >(
    arg1: RegisterOptions<FieldValues, T1>,
    arg2: RegisterOptions<FieldValues, T2>,
    arg3: RegisterOptions<FieldValues, T3>,
    arg4: RegisterOptions<FieldValues, T4>,
    arg5: RegisterOptions<FieldValues, T5>,
    arg6: RegisterOptions<FieldValues, T6>,
    arg7: RegisterOptions<FieldValues, T7>,
    arg8: RegisterOptions<FieldValues, T8>,
    arg9: RegisterOptions<FieldValues, T9>,
    arg10: RegisterOptions<FieldValues, T10>,
  ): void;
  <
    T1 extends FieldNames<FieldValues>,
    T2 extends FieldNames<FieldValues>,
    T3 extends FieldNames<FieldValues>,
    T4 extends FieldNames<FieldValues>,
    T5 extends FieldNames<FieldValues>,
    T6 extends FieldNames<FieldValues>,
    T7 extends FieldNames<FieldValues>,
    T8 extends FieldNames<FieldValues>,
    T9 extends FieldNames<FieldValues>,
    T10 extends FieldNames<FieldValues>,
    T11 extends FieldNames<FieldValues>
  >(
    arg1: RegisterOptions<FieldValues, T1>,
    arg2: RegisterOptions<FieldValues, T2>,
    arg3: RegisterOptions<FieldValues, T3>,
    arg4: RegisterOptions<FieldValues, T4>,
    arg5: RegisterOptions<FieldValues, T5>,
    arg6: RegisterOptions<FieldValues, T6>,
    arg7: RegisterOptions<FieldValues, T7>,
    arg8: RegisterOptions<FieldValues, T8>,
    arg9: RegisterOptions<FieldValues, T9>,
    arg10: RegisterOptions<FieldValues, T10>,
    arg11: RegisterOptions<FieldValues, T11>,
    ...args: Array<RegisterOptions<FieldValues, FieldNames<FieldValues>>>
  ): void;
}
