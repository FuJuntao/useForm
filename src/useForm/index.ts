import { Reducer, useCallback, useReducer } from 'react';
import defaultGetValueFromEvent from './defaultGetValueFromEvent';
import { Actions, reducer, State } from './reducer';
import {
  BasicFieldValues,
  FieldNames,
  FormOptions,
  Register,
  RegisterOptions,
} from './types';

function useForm<FieldValues extends BasicFieldValues>(
  options?: FormOptions<FieldValues>,
) {
  const defaultState = {};
  const [state, dispatch] = useReducer<
    Reducer<State<FieldValues>, Actions<FieldValues>>
  >(reducer, defaultState);

  const register: Register<FieldValues> = useCallback(
    (...registers: RegisterOptions<FieldValues, FieldNames<FieldValues>>[]) => {
      registers.forEach(register => {
        const { name, defaultValue } = register;
        if (typeof name !== 'string') {
          return;
        }
        dispatch({
          type: 'REGISTER_FIELD',
          name,
          value: defaultValue,
          getValueFromEvent:
            register.getValueFromEvent ??
            options?.getValueFromEvent ??
            defaultGetValueFromEvent,
          collectValueTrigger:
            register.collectValueTrigger ??
            options?.collectValueTrigger ??
            'onChange',
        });
      });
    },
    [],
  );

  return { state, register };
}

export default useForm;
