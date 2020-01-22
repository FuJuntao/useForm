import { Reducer, useReducer, useRef } from 'react';
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
import { BasicFieldValues, FieldNames, FormOptions, Handlers } from './types';
import { Schema } from 'yup';

const defaultFormState = {
  dirty: false,
  hasSubmitted: false,
  touched: [],
  submitCount: 0,
  isValid: true,
};

async function validateValue<T>(validationSchema: Schema<T>, values: T) {
  try {
    const result = await validationSchema.validate(values, {
      abortEarly: false,
    });
    console.log('TCL: getValidationEventHandlers -> result', result);
  } catch (error) {
    console.log('TCL: error', error);
  }
}

function useForm<FieldValues extends BasicFieldValues>(
  options: FormOptions<FieldValues>,
) {
  const optionsRef = useRef(options);
  const [formState, formStateDispatch] = useReducer<
    Reducer<FormState<FieldValues>, FormStateActions>
  >(formStateReducer, defaultFormState);
  const [fieldsState, fieldsStateDispatch] = useReducer<
    Reducer<FieldsState<FieldValues>, FieldsStateActions<FieldValues>>
  >(fieldsStateReducer, getDefaultFieldsState(optionsRef.current));

  const getValues = () => {
    const values = {} as FieldValues;
    Object.keys(fieldsState).forEach(key => {
      const typedKey = key as FieldNames<FieldValues>;
      values[typedKey] = fieldsState[typedKey].value;
    });
    return values;
  };

  const dispatchSetValue = <FieldName extends FieldNames<FieldValues>>(
    value: FieldValues[FieldName],
    fieldName: FieldName,
  ) => {
    fieldsStateDispatch({
      type: fieldsStateActionTypes.SET_VALUE,
      key: fieldName,
      value,
    });
  };

  const getCollectValueEventHandler = <
    FieldName extends FieldNames<FieldValues>
  >(
    fieldName: FieldName,
  ) => {
    const { getValueFromEvent } = fieldsState[fieldName];
    return async (e: any) => {
      const value = getValueFromEvent(e);
      dispatchSetValue(value, fieldName);
    };
  };

  const getValidationEventHandlers = <
    FieldName extends FieldNames<FieldValues>
  >(
    fieldName: FieldName,
  ) => {
    const { validationSchema } = optionsRef.current;
    const {
      collectValueTrigger,
      validationTriggers,
      getValueFromEvent,
    } = fieldsState[fieldName];
    const handlers: Handlers = {};
    validationTriggers.forEach(item => {
      handlers[item] = async (e: any) => {
        const value = getValueFromEvent(e);
        // If validationTriggers includes collectValueTrigger,
        // dispatch the value to update fieldsState
        if (item === collectValueTrigger) {
          dispatchSetValue(value, fieldName);
        }
        if (validationSchema) {
          const values = getValues();
          values[fieldName] = value;
          await validateValue(validationSchema, values);
        }
      };
    });
    return handlers;
  };

  const bind = <FieldName extends FieldNames<FieldValues>>(
    fieldName: FieldName,
  ) => {
    const { value, collectValueTrigger } = fieldsState[fieldName];
    return {
      value,
      [collectValueTrigger]: getCollectValueEventHandler(fieldName),
      ...getValidationEventHandlers(fieldName),
    };
  };

  return { formState, getValues, bind };
}

export default useForm;
