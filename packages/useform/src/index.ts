import { Reducer, useCallback, useMemo, useReducer, useRef } from 'react';
import {
  Actions as FieldsStateActions,
  actionTypes as fieldsStateActionTypes,
  reducer as fieldsStateReducer,
  State as FieldsState,
} from './fieldsStateReducer';
import {
  Actions as FormStateActions,
  reducer as formStateReducer,
  State as FormState,
} from './formStateReducer';
import getDefaultFieldsState from './getDefaultFieldsState';
import getFieldsOptions from './getFieldsOptions';
import { BasicFieldValues, FieldsErrors, FormOptions, Handlers } from './types';
import validateFieldValue from './validateFieldValue';

const defaultFormState = {
  dirty: false,
  hasSubmitted: false,
  touched: [],
  submitCount: 0,
  isValid: true,
};

function useForm<FieldValues extends BasicFieldValues>(
  options: FormOptions<FieldValues>,
) {
  type FieldNames = Extract<keyof FieldValues, string>;

  const optionsRef = useRef(options);
  const fieldsOptions = useMemo(() => getFieldsOptions(optionsRef.current), []);
  const [formState, formStateDispatch] = useReducer<
    Reducer<FormState<FieldValues>, FormStateActions>
  >(formStateReducer, defaultFormState);
  const [fieldsState, fieldsStateDispatch] = useReducer<
    Reducer<FieldsState<FieldValues>, FieldsStateActions<FieldValues>>
  >(fieldsStateReducer, getDefaultFieldsState(optionsRef.current));

  const getSpecificFieldsState = useCallback(() => {
    const values = {} as FieldValues;
    const errors = {} as FieldsErrors<FieldValues>;
    Object.keys(fieldsState).forEach(key => {
      const typedKey = key as FieldNames;
      const { value, error } = fieldsState[typedKey];
      values[typedKey] = value;
      errors[typedKey] = error;
    });
    return { values, errors };
  }, [fieldsState]);

  const setValue = useCallback(
    <FieldName extends FieldNames>(
      fieldName: FieldName,
      value: FieldValues[FieldName],
    ) => {
      fieldsStateDispatch({
        type: fieldsStateActionTypes.SET_VALUE,
        key: fieldName,
        value,
      });
    },
    [],
  );

  const dispatchUpdateErrors = useCallback(
    (errors: FieldsErrors<FieldValues>) => {
      fieldsStateDispatch({
        type: fieldsStateActionTypes.UPDATE_ERRORS,
        errors,
      });
    },
    [],
  );

  const getCollectValueEventHandler = useCallback(
    <FieldName extends FieldNames>(fieldName: FieldName) => {
      const { getValueFromEvent } = fieldsOptions[fieldName];
      return async (e: any) => {
        const value = getValueFromEvent(e);
        setValue(fieldName, value);
      };
    },
    [setValue, fieldsOptions],
  );

  const getValidationEventHandlers = useCallback(
    <FieldName extends FieldNames>(fieldName: FieldName) => {
      const { validationSchema } = optionsRef.current;
      const { validationTriggers, getValueFromEvent } = fieldsOptions[
        fieldName
      ];
      const handlers: Handlers = {};
      validationTriggers.forEach(item => {
        handlers[item] = async (e: any) => {
          const value = getValueFromEvent(e);
          if (validationSchema) {
            const { values } = getSpecificFieldsState();
            values[fieldName] = value;
            const validationResult = await validateFieldValue<
              FieldValues,
              FieldName
            >(validationSchema, values, fieldName);
            dispatchUpdateErrors(validationResult);
          }
        };
      });
      return handlers;
    },
    [dispatchUpdateErrors, fieldsOptions, getSpecificFieldsState],
  );

  const getEventHandlers = useCallback(
    <FieldName extends FieldNames>(fieldName: FieldName) => {
      const { collectValueTrigger, validationTriggers } = fieldsOptions[
        fieldName
      ];
      const collectValueEventHandler = getCollectValueEventHandler(fieldName);
      const validationEventHandlers = getValidationEventHandlers(fieldName);
      if (validationTriggers.includes(collectValueTrigger)) {
        return {
          ...validationEventHandlers,
          [collectValueTrigger]: (e: any) => {
            collectValueEventHandler(e);
            validationEventHandlers[collectValueTrigger](e);
          },
        };
      }
      return {
        collectValueTrigger: collectValueEventHandler,
        ...validationEventHandlers,
      };
    },
    [fieldsOptions, getCollectValueEventHandler, getValidationEventHandlers],
  );

  const bind = useCallback(
    <FieldName extends FieldNames>(fieldName: FieldName) => {
      const { value } = fieldsState[fieldName];
      return { value, ...getEventHandlers(fieldName) };
    },
    [fieldsState, getEventHandlers],
  );

  return {
    formState,
    bind,
    setValue,
    ...getSpecificFieldsState(),
  };
}

export default useForm;
