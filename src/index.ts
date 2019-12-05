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
        let getValueFromEvent;
        if (typeof name !== 'string') {
          return;
        }
        if (typeof options?.getValueFromEvent === 'function') {
          getValueFromEvent = options.getValueFromEvent;
        }
        if (typeof register.getValueFromEvent === 'function') {
          getValueFromEvent = register.getValueFromEvent;
        }
        dispatch({
          type: 'REGISTER_FIELD',
          name,
          value: defaultValue,
          getValueFromEvent: getValueFromEvent ?? defaultGetValueFromEvent,
        });
      });
    },
    [],
  );

  return { state, register };
}

export default useForm;
