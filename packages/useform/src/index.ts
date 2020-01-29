import { useCallback, useMemo, useRef, useState } from 'react';
import * as yup from 'yup';
import defaultGetValueFromEvent from './defaultGetValueFromEvent';
import {
  BasicFieldValues,
  FieldErrorsState,
  FieldOptions,
  FormOptions,
  Handlers,
  Register,
  RegisterOption,
} from './types';
import validateFieldValue from './validateFieldValue';

function getValidationTriggers(validationTriggers?: string | string[]) {
  if (Array.isArray(validationTriggers)) {
    return validationTriggers;
  }
  if (validationTriggers) {
    return [validationTriggers];
  }
  return validationTriggers;
}

const DEFAULT_COLLECT_VALUE_TRIGGER = 'onChange';
const DEFAULT_VALIDATION_TRIGGERS = ['onChange'];

function useForm<FieldValues extends BasicFieldValues>(
  options: FormOptions<FieldValues>,
) {
  type FieldNames = Extract<keyof FieldValues, string>;

  const optionsRef = useRef(options);
  const [values, setValues] = useState<FieldValues>(
    optionsRef.current.defaultValues,
  );
  const [errors, setErrors] = useState<FieldErrorsState<FieldValues>>(null);
  const [fieldOptions, setFieldOptions] = useState<FieldOptions<FieldValues>>();

  const validationSchema = useMemo(() => {
    if (!fieldOptions) return null;
    const schema = {} as {
      [Key in keyof FieldValues]: yup.Schema<FieldValues[Key]>;
    };
    Object.entries(fieldOptions).forEach(item => {
      const key = item[0] as keyof FieldValues;
      const validationSchema = item[1]?.validationSchema;
      if (validationSchema) {
        schema[key] = validationSchema;
      }
    });
    return yup.object().shape(schema);
  }, [fieldOptions]);

  const register: Register<FieldValues> = useCallback(
    (...registerOptions: any[]) => {
      if (Array.isArray(registerOptions))
        registerOptions.forEach(
          (registerOption: RegisterOption<FieldValues>) => {
            const { name, defaultValue } = registerOption;

            setValues(values => ({
              ...values,
              [name]: values[name] ?? defaultValue ?? null,
            }));

            setFieldOptions(fieldOptions => ({
              ...fieldOptions,
              [name]: {
                getValueFromEvent:
                  registerOption.getValueFromEvent ??
                  optionsRef.current.getValueFromEvent ??
                  defaultGetValueFromEvent,
                collectValueTrigger:
                  registerOption.collectValueTrigger ??
                  optionsRef.current.collectValueTrigger ??
                  DEFAULT_COLLECT_VALUE_TRIGGER,
                validationTriggers:
                  getValidationTriggers(registerOption.validationTriggers) ??
                  getValidationTriggers(
                    optionsRef.current.validationTriggers,
                  ) ??
                  DEFAULT_VALIDATION_TRIGGERS,
                validationSchema: registerOption.validationSchema,
              },
            }));
          },
        );
    },
    [],
  );

  const getCollectValueEventHandler = useCallback(
    <FieldName extends FieldNames>(fieldName: FieldName) => {
      const getValueFromEvent = fieldOptions?.[fieldName]?.getValueFromEvent;
      return async (e: any) => {
        if (getValueFromEvent) {
          const value = getValueFromEvent(e);
          setValues(values => ({ ...values, [fieldName]: value }));
        }
      };
    },
    [fieldOptions],
  );

  const getValidationEventHandlers = useCallback(
    <FieldName extends FieldNames>(fieldName: FieldName) => {
      const validationTriggers = fieldOptions?.[fieldName]?.validationTriggers;
      const getValueFromEvent = fieldOptions?.[fieldName]?.getValueFromEvent;
      const handlers: Handlers = {};
      if (validationTriggers) {
        validationTriggers.forEach(item => {
          handlers[item] = async (e: any) => {
            if (getValueFromEvent && validationSchema) {
              const value = getValueFromEvent(e);
              const newValues = { ...values, [fieldName]: value };
              const validationResult = await validateFieldValue<FieldValues>(
                validationSchema,
                newValues,
                fieldName,
              );
              setErrors(errors => {
                const newErrors: FieldErrorsState<FieldValues> = errors
                  ? { ...errors }
                  : {};
                if (!validationResult) {
                  delete newErrors[fieldName];
                }
                return { ...newErrors, ...validationResult };
              });
            }
          };
        });
      }
      return handlers;
    },
    [fieldOptions, validationSchema, values],
  );

  const getEventHandlers = useCallback(
    <FieldName extends FieldNames>(fieldName: FieldName) => {
      const collectValueTrigger =
        fieldOptions?.[fieldName]?.collectValueTrigger;
      const validationTriggers = fieldOptions?.[fieldName]?.validationTriggers;
      if (!collectValueTrigger || !validationTriggers) return {};

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
        [collectValueTrigger]: collectValueEventHandler,
        ...validationEventHandlers,
      };
    },
    [fieldOptions, getCollectValueEventHandler, getValidationEventHandlers],
  );

  const bind = useCallback(
    <FieldName extends FieldNames>(fieldName: FieldName) => {
      const value = values[fieldName];
      return { value, ...getEventHandlers(fieldName) };
    },
    [getEventHandlers, values],
  );

  return { register, bind, values, errors };
}

export default useForm;
