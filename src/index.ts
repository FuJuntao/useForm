import { useCallback, useReducer } from 'react';
import { FormReducer, reducer } from './reducer';
import {
  BasicFieldValues,
  FieldNames,
  RegisterOptions,
  Register,
  FormOptions,
} from './types';

function useForm<FieldValues extends BasicFieldValues>(
  options?: FormOptions<FieldValues>,
) {
  const defaultState = {};
  const [state, dispatch] = useReducer<FormReducer<FieldValues>>(
    reducer,
    defaultState,
  );

  const register: Register<FieldValues> = useCallback(
    (...registers: RegisterOptions<FieldValues, FieldNames<FieldValues>>[]) => {
      registers.forEach(register => {
        const { name, defaultValue } = register;
        dispatch({ type: 'REGISTER_FIELD', name, value: defaultValue });
      });
    },
    [],
  );

  return { register };
}

export default useForm;
