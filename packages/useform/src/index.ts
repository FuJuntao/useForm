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
import { BasicFieldValues, FieldNames, FormOptions, Handlers } from './types';
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
  const optionsRef = useRef(options);
  const fieldsOptions = useMemo(() => getFieldsOptions(optionsRef.current), []);
  const [formState, formStateDispatch] = useReducer<
    Reducer<FormState<FieldValues>, FormStateActions>
  >(formStateReducer, defaultFormState);
  const [fieldsState, fieldsStateDispatch] = useReducer<
    Reducer<FieldsState<FieldValues>, FieldsStateActions<FieldValues>>
  >(fieldsStateReducer, getDefaultFieldsState(optionsRef.current));

  const getValues = useCallback(() => {
    const values = {} as FieldValues;
    Object.keys(fieldsState).forEach(key => {
      const typedKey = key as FieldNames<FieldValues>;
      values[typedKey] = fieldsState[typedKey].value;
    });
    return values;
  }, [fieldsState]);

  const dispatchSetValue = <FieldName extends FieldNames<FieldValues>>(
    fieldName: FieldName,
    value: FieldValues[FieldName],
  ) => {
    fieldsStateDispatch({
      type: fieldsStateActionTypes.SET_VALUE,
      key: fieldName,
      value,
    });
  };

  const getCollectValueEventHandler = useCallback(
    <FieldName extends FieldNames<FieldValues>>(fieldName: FieldName) => {
      const { getValueFromEvent } = fieldsOptions[fieldName];
      return async (e: any) => {
        const value = getValueFromEvent(e);
        dispatchSetValue(fieldName, value);
      };
    },
    [fieldsOptions],
  );

  const getValidationEventHandlers = useCallback(
    <FieldName extends FieldNames<FieldValues>>(fieldName: FieldName) => {
      const { validationSchema } = optionsRef.current;
      const { validationTriggers, getValueFromEvent } = fieldsOptions[
        fieldName
      ];
      const handlers: Handlers = {};
      validationTriggers.forEach(item => {
        handlers[item] = async (e: any) => {
          const value = getValueFromEvent(e);
          if (validationSchema) {
            const values = getValues();
            values[fieldName] = value;
            await validateFieldValue(validationSchema, values, fieldName);
          }
        };
      });
      return handlers;
    },
    [fieldsOptions, getValues],
  );

  const getEventHandlers = useCallback(
    <FieldName extends FieldNames<FieldValues>>(fieldName: FieldName) => {
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
    <FieldName extends FieldNames<FieldValues>>(fieldName: FieldName) => {
      const { value } = fieldsState[fieldName];
      return { value, ...getEventHandlers(fieldName) };
    },
    [fieldsState, getEventHandlers],
  );

  return { formState, getValues, bind };
}

export default useForm;
