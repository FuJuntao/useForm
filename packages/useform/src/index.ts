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
    const values: Partial<FieldValues> = {};
    Object.keys(fieldsState).forEach(key => {
      const typedKey = key as FieldNames<FieldValues>;
      values[typedKey] = fieldsState[typedKey]?.value;
    });
    return values;
  };

  const bind = <FieldName extends FieldNames<FieldValues>>(
    fieldName: FieldName,
  ) => {
    const {
      value,
      collectValueTrigger,
      validationTriggers,
      getValueFromEvent,
    } = fieldsState[fieldName];
    const { validationSchema } = optionsRef.current;

    const dispatchSetValue = (value: FieldValues[FieldName]) => {
      fieldsStateDispatch({
        type: fieldsStateActionTypes.SET_VALUE,
        key: fieldName,
        value,
      });
    };

    const getValidationEventHandlers = () => {
      const handlers: Handlers = {};
      validationTriggers.forEach(item => {
        if (item === collectValueTrigger) {
          handlers[item] = async (e: any) => {
            const value = getValueFromEvent(e);
            dispatchSetValue(value);
            if (validationSchema) {
              const values = getValues();
              values[fieldName] = value;
              await validateValue(validationSchema, values);
            }
          };
        } else {
          handlers[item] = async (e: any) => {
            const value = getValueFromEvent(e);
            if (validationSchema) {
              const values = getValues();
              values[fieldName] = value;
              await validateValue(validationSchema, values);
            }
          };
        }
      });
      return handlers;
    };

    return {
      value,
      [collectValueTrigger]: dispatchSetValue,
      ...getValidationEventHandlers(),
    };
  };

  return { formState, getValues, bind };
}

export default useForm;
