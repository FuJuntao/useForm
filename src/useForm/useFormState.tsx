import { useReducer, ChangeEvent, useMemo } from 'react';
import { Options, FormState, StrictOptions } from './types';
import * as actionTypes from './actionTypes';
import { Actions } from './actions';

function reducer(state: FormState, action: Actions): FormState {
  switch (action.type) {
    case actionTypes.SET_VALUE: {
      const { id, value } = action;
      return {
        ...state,
        [id]: {
          ...state[id],
          value,
        },
      };
    }

    case actionTypes.SET_ERROR: {
      const { id, error } = action;
      return {
        ...state,
        [id]: {
          ...state[id],
          error,
        },
      };
    }

    case actionTypes.SET_VALIDATE_STATUS: {
      const { id, validateStatus } = action;
      return {
        ...state,
        [id]: {
          ...state[id],
          validateStatus,
        },
      };
    }

    default: {
      return state;
    }
  }
}

/**
 * 如何从 event 中取值
 * @param e
 */
function defaultGetValueFromEvent(e: ChangeEvent<HTMLInputElement>) {
  if (!e || !e.target) {
    return e;
  }
  const { target } = e;
  return target.type === 'checkbox' ? target.checked : target.value;
}

/**
 * 根据用户输入的表单配置，生成一个初始的表单状态。
 * @param options
 */
function createInitialState(options: Options) {
  const initialState: FormState = {};

  Object.entries(options).forEach(function([key, { initialValue = '' }]) {
    initialState[key] = {
      value: initialValue,
      error: '',
      validateStatus: 'none',
    };
  });
  return initialState;
}

/**
 * 转换用户输入的配置为类型更严格的对象
 * 对于未配置的选项，提供一个默认值
 * @param options
 */
function createStrictOptions(options: Options) {
  const strictOptions: StrictOptions = {};

  Object.entries(options).forEach(function([
    key,
    {
      validator = () => {},
      validateTriggers = ['onChange'],
      getValueFromEvent = defaultGetValueFromEvent,
      collectValueTrigger = 'onChange',
    },
  ]) {
    strictOptions[key] = {
      getValueFromEvent,
      collectValueTrigger,
      validator,
      // 如果是字符串，则转为数组
      validateTriggers:
        typeof validateTriggers === 'string'
          ? [validateTriggers]
          : validateTriggers,
    };
  });
  return strictOptions;
}

function useFormState(options: Options = {}) {
  const initialState = useMemo(() => createInitialState(options), [options]);
  const strictOptions = useMemo(() => createStrictOptions(options), [options]);

  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    formState: state,
    strictOptions,
    dispatch,
  };
}

export default useFormState;
