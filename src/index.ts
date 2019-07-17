import { ChangeEvent, useReducer, useMemo } from 'react';
import {
  FormState,
  Config,
  StrictConfig,
  FormFeildConfig,
  Actions,
  SET_VALUE,
  ValidateStatus,
  SET_ERROR,
  SET_VALIDATE_STATUS,
  Validator,
  Timestamps,
} from './types';

function reducer<FormFeildKey extends string>(
  state: FormState<FormFeildKey>,
  action: Actions<FormFeildKey>,
): FormState<FormFeildKey> {
  switch (action.type) {
    case SET_VALUE: {
      const { id, value } = action;
      return {
        ...state,
        [id]: {
          ...state[id],
          value,
        },
      };
    }

    case SET_ERROR: {
      const { id, error } = action;
      return {
        ...state,
        [id]: {
          ...state[id],
          error,
        },
      };
    }

    case SET_VALIDATE_STATUS: {
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

function getInitialState<FormFeildKey extends string>(
  config: Config<FormFeildKey>,
): FormState<FormFeildKey> {
  const initialState = {} as FormState<FormFeildKey>;
  for (let key in config) {
    initialState[key] = {
      value: config[key].initialValue,
      error: '',
      validateStatus: 'none',
    };
  }
  return initialState;
}

function defaultGetValueFromEvent(e: ChangeEvent<HTMLInputElement>) {
  if (!e || !e.target) {
    return e;
  }
  const { target } = e;
  return target.type === 'checkbox' ? target.checked : target.value;
}

function getStrictConfig<FormFeildKey extends string>(
  config: Config<FormFeildKey>,
): StrictConfig<FormFeildKey> {
  const strictConfig = {} as StrictConfig<FormFeildKey>;
  Object.entries<FormFeildConfig>(config).forEach(
    ([
      key,
      {
        validator = () => {},
        validateTriggers = ['onChange'],
        getValueFromEvent = defaultGetValueFromEvent,
        collectValueTrigger = 'onChange',
      },
    ]) => {
      const typedKey = key as Extract<FormFeildKey, string>;
      strictConfig[typedKey] = {
        getValueFromEvent,
        collectValueTrigger,
        validator,
        validateTriggers:
          typeof validateTriggers === 'string'
            ? [validateTriggers]
            : validateTriggers,
      };
    },
  );
  return strictConfig;
}

const timestamps: Timestamps = {};

export default function useForm<FormFeildKey extends string>(
  config: Config<FormFeildKey>,
) {
  const initialState = useMemo(() => getInitialState(config), [config]);
  const [state, dispatch] = useReducer(reducer, initialState);

  const strictConfig = useMemo(() => getStrictConfig(config), [config]);

  type Ids = FormFeildKey | FormFeildKey[];

  function _toList(ids?: Ids): FormFeildKey[] {
    if (typeof ids === 'string') {
      return [ids];
    }
    if (typeof ids === 'undefined') {
      return Object.keys(config) as FormFeildKey[];
    }
    return ids;
  }

  function setFeildValue(id: FormFeildKey, value: any): void {
    dispatch({ type: 'SET_VALUE', id, value });
  }

  function setFeildError(id: FormFeildKey, error?: string): void {
    dispatch({ type: 'SET_ERROR', id, error: error ? error : '' });
  }

  function setFeildValidateStatus(id: FormFeildKey, status: ValidateStatus) {
    dispatch({
      type: 'SET_VALIDATE_STATUS',
      id,
      validateStatus: status,
    });
  }

  function getFeildValue(id: FormFeildKey) {
    const { value } = state[id];
    return value;
  }

  function getFeildsValue(ids?: Ids) {
    const idList = _toList(ids);
    const values = {} as { [id in FormFeildKey]: any };
    idList.forEach(id => {
      values[id] = getFeildValue(id);
    });
    return values;
  }

  function getFeildError(id: FormFeildKey): string {
    const { error } = state[id];
    return error;
  }

  function getFeildsError(ids?: Ids) {
    const idList = _toList(ids);
    const errors = {} as { [id in FormFeildKey]: string };
    let noErrors = true;

    idList.forEach(id => {
      const error = getFeildError(id);
      if (error) {
        noErrors = false;
      }
      errors[id] = error;
    });

    return noErrors ? null : errors;
  }

  function getFeildValidateStatus(id: FormFeildKey) {
    const { validateStatus } = state[id];
    return validateStatus;
  }

  function _getValidateResult(validator: Validator, value: any) {
    const result = validator(value);
    if (result instanceof Promise) {
      return result.then(error => {
        return error ? error : '';
      });
    } else if (typeof result === 'string') {
      return Promise.resolve(result);
    } else {
      return Promise.resolve('');
    }
  }

  function _validateFeild(id: FormFeildKey, value: any): Promise<boolean> {
    const { error, validateStatus } = state[id];
    const { validator } = strictConfig[id];

    if (validateStatus !== 'none' && error) {
      return Promise.resolve(false);
    } else {
      setFeildValidateStatus(id, 'validating');
      setFeildError(id, '');

      const now = new Date().getTime();
      timestamps[id] = now;

      return _getValidateResult(validator, value).then(result => {
        const validateTimestamp = timestamps[id];
        if (now == validateTimestamp) {
          setFeildError(id, result);
          setFeildValidateStatus(id, result ? 'error' : 'success');
        }
        return result ? false : true;
      });
    }
  }

  function validateFeilds(ids: Ids) {
    const idList = _toList(ids);
    return Promise.all(
      idList.map(id => _validateFeild(id, getFeildValue(id))),
    ).then(resultList => (resultList.some(passed => !passed) ? false : true));
  }

  function _createHandlers(id: FormFeildKey) {
    const {
      collectValueTrigger,
      getValueFromEvent,
      validateTriggers,
    } = strictConfig[id];

    const handlers: { [key: string]: (value: any) => void } = {};

    validateTriggers.forEach(item => {
      if (item && item !== collectValueTrigger) {
        handlers[item] = e => {
          const value = getValueFromEvent(e);
          _validateFeild(id, value);
        };
      }
    });

    const validateValueInCollectValueTrigger: boolean = validateTriggers.includes(
      collectValueTrigger,
    );
    handlers[collectValueTrigger] = validateValueInCollectValueTrigger
      ? e => {
          const value = getValueFromEvent(e);
          setFeildValue(id, value);
          _validateFeild(id, value);
        }
      : e => {
          const value = getValueFromEvent(e);
          setFeildValue(id, value);
        };

    return handlers;
  }

  function useFeildProps(id: FormFeildKey) {
    const handlers = useMemo(() => _createHandlers(id), [id]);
    return { value: getFeildValue(id), ...handlers };
  }

  return {
    setFeildValue,
    setFeildError,
    setFeildValidateStatus,
    getFeildValue,
    getFeildsValue,
    getFeildError,
    getFeildsError,
    getFeildValidateStatus,
    validateFeilds,
    useFeildProps,
  };
}
