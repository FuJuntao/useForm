import { Reducer, useCallback, useReducer, useRef } from 'react';
import defaultGetValueFromEvent from './defaultGetValueFromEvent';
import {
  FieldsStateActions,
  fieldsStateReducer,
  FieldsState,
} from './fieldsStateReducer';
import {
  BasicFieldValues,
  FieldNames,
  FormOptions,
  Register,
  RegisterOptions,
} from './types';
import {
  FormState,
  FormStateActions,
  formStateReducer,
} from './formStateReducer';

const DEFAULT_COLLECT_VALUE_TRIGGER = 'onChange';
const DEFAULT_VALIDATION_TRIGGERS = ['onChange'];

const defaultFormState = {
  dirty: false,
  hasSubmitted: false,
  touched: [],
  submitCount: 0,
  isValid: true,
};

function useForm<FieldValues extends BasicFieldValues>(
  options?: FormOptions<FieldValues>,
) {
  const optionsRef = useRef(options);
  const [fromState, formStateDispatch] = useReducer<
    Reducer<FormState<FieldValues>, FormStateActions>
  >(formStateReducer, defaultFormState);
  const [fieldsState, fieldsStateDispatch] = useReducer<
    Reducer<FieldsState<FieldValues>, FieldsStateActions<FieldValues>>
  >(fieldsStateReducer, {});

  const register: Register<FieldValues> = useCallback(
    (...registers: RegisterOptions<FieldValues, FieldNames<FieldValues>>[]) => {
      registers.forEach(register => {
        const { name, defaultValue } = register;
        if (typeof name !== 'string') {
          return;
        }
        fieldsStateDispatch({
          type: 'FIELD_STATE/REGISTER_FIELD',
          name,
          value: defaultValue,
          getValueFromEvent:
            register.getValueFromEvent ??
            optionsRef.current?.getValueFromEvent ??
            defaultGetValueFromEvent,
          collectValueTrigger:
            register.collectValueTrigger ??
            optionsRef.current?.collectValueTrigger ??
            DEFAULT_COLLECT_VALUE_TRIGGER,
          validationTriggers:
            register.validationTriggers ?? DEFAULT_VALIDATION_TRIGGERS,
        });
      });
    },
    [],
  );

  return {fromState, fieldsState, register };
}

export default useForm;
