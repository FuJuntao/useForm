import { ChangeEvent, useReducer, useMemo } from 'react';
import {
  FormState,
  Config,
  StrictConfig,
  FormFieldConfig,
  Actions,
  SET_VALUE,
  ValidateStatus,
  SET_ERROR,
  SET_VALIDATE_STATUS,
  Validator,
  Timestamps,
} from './types';

function reducer<FormFieldKey extends string>(
  state: FormState<FormFieldKey>,
  action: Actions<FormFieldKey>,
): FormState<FormFieldKey> {
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

function getInitialState<FormFieldKey extends string>(
  config: Config<FormFieldKey>,
): FormState<FormFieldKey> {
  const initialState = {} as FormState<FormFieldKey>;
  for (let key in config) {
    initialState[key] = {
      value:
        config[key].initialValue === null ||
        config[key].initialValue === undefined
          ? ''
          : config[key].initialValue,
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

function defaultValidator(value: any) {
  return '';
}

function getStrictConfig<FormFieldKey extends string>(
  config: Config<FormFieldKey>,
): StrictConfig<FormFieldKey> {
  const strictConfig = {} as StrictConfig<FormFieldKey>;
  Object.entries<FormFieldConfig>(config).forEach(
    ([
      key,
      {
        validator = defaultValidator,
        validateTriggers = ['onChange'],
        getValueFromEvent = defaultGetValueFromEvent,
        collectValueTrigger = 'onChange',
      },
    ]) => {
      const typedKey = key as Extract<FormFieldKey, string>;
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

export function useForm<FormFieldKey extends string>(
  config: Config<FormFieldKey>,
) {
  const initialState = useMemo(() => getInitialState(config), [config]);
  const [state, dispatch] = useReducer(reducer, initialState);

  const strictConfig = useMemo(() => getStrictConfig(config), [config]);

  type Ids = FormFieldKey | FormFieldKey[];

  function _toList(ids?: Ids): FormFieldKey[] {
    if (typeof ids === 'string') {
      return [ids];
    }
    if (typeof ids === 'undefined') {
      return Object.keys(config) as FormFieldKey[];
    }
    return ids;
  }

  function setFieldValue(id: FormFieldKey, value: any): void {
    dispatch({ type: 'SET_VALUE', id, value });
  }

  function setFieldError(id: FormFieldKey, error?: string): void {
    dispatch({ type: 'SET_ERROR', id, error: error ? error : '' });
  }

  function setFieldValidateStatus(id: FormFieldKey, status: ValidateStatus) {
    dispatch({
      type: 'SET_VALIDATE_STATUS',
      id,
      validateStatus: status,
    });
  }

  function getFieldValue(id: FormFieldKey) {
    const { value } = state[id];
    return value;
  }

  function getFieldsValue(ids?: Ids) {
    const idList = _toList(ids);
    const values = {} as { [id in FormFieldKey]: any };
    idList.forEach(id => {
      values[id] = getFieldValue(id);
    });
    return values;
  }

  function getFieldError(id: FormFieldKey): string {
    const { error } = state[id];
    return error;
  }

  function getFieldsError(ids?: Ids) {
    const idList = _toList(ids);
    const errors = {} as { [id in FormFieldKey]: string };
    let noErrors = true;

    idList.forEach(id => {
      const error = getFieldError(id);
      if (error) {
        noErrors = false;
      }
      errors[id] = error;
    });

    return noErrors ? null : errors;
  }

  function getFieldValidateStatus(id: FormFieldKey) {
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

  function _validateField(id: FormFieldKey, value: any): Promise<boolean> {
    const { error, validateStatus } = state[id];
    const { validator } = strictConfig[id];

    if (validateStatus !== 'none' && error) {
      return Promise.resolve(false);
    } else {
      setFieldValidateStatus(id, 'validating');
      setFieldError(id, '');

      const now = new Date().getTime();
      timestamps[id] = now;

      return _getValidateResult(validator, value).then(result => {
        const validateTimestamp = timestamps[id];
        if (now == validateTimestamp) {
          setFieldError(id, result);
          setFieldValidateStatus(id, result ? 'error' : 'success');
        }
        return result ? false : true;
      });
    }
  }

  function validateFields(ids?: Ids) {
    const idList = _toList(ids);
    return Promise.all(
      idList.map(id => _validateField(id, getFieldValue(id))),
    ).then(resultList => (resultList.some(passed => !passed) ? false : true));
  }

  function _createHandlers(id: FormFieldKey) {
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
          _validateField(id, value);
        };
      }
    });

    const validateValueInCollectValueTrigger: boolean = validateTriggers.includes(
      collectValueTrigger,
    );
    handlers[collectValueTrigger] = validateValueInCollectValueTrigger
      ? e => {
          const value = getValueFromEvent(e);
          setFieldValue(id, value);
          _validateField(id, value);
        }
      : e => {
          const value = getValueFromEvent(e);
          setFieldValue(id, value);
        };

    return handlers;
  }

  function useFieldProps(id: FormFieldKey) {
    const handlers = useMemo(() => _createHandlers(id), [id]);
    return { value: getFieldValue(id), ...handlers };
  }

  return {
    setFieldValue,
    setFieldError,
    setFieldValidateStatus,
    getFieldValue,
    getFieldsValue,
    getFieldError,
    getFieldsError,
    getFieldValidateStatus,
    validateFields,
    useFieldProps,
  };
}
