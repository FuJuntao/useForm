import { useCallback, useMemo, useRef, useState } from 'react';
import * as yup from 'yup';
import defaultGetValueFromEvent from './defaultGetValueFromEvent';
import {
  BasicFieldValues,
  FieldErrors,
  FieldOptions,
  FormOptions,
  FormState,
  Handlers,
  Register,
  RegisterOption,
} from './types';
import validateFieldValue from './validateFieldValue';
import validateFieldValues from './validateFieldValues';

const DEFAULT_COLLECT_VALUE_TRIGGER = 'onChange';
const DEFAULT_VALIDATION_TRIGGERS = ['onChange'];

const defaultFormState = {
  dirty: false,
  hasSubmitted: false,
  submitCount: 0,
};

function getValidationTriggers(validationTriggers?: string | string[]) {
  if (Array.isArray(validationTriggers)) {
    return validationTriggers;
  }
  if (validationTriggers) {
    return [validationTriggers];
  }
  return validationTriggers;
}

function useForm<FieldValues extends BasicFieldValues>(
  options: FormOptions<FieldValues>,
) {
  type FieldNames = Extract<keyof FieldValues, string>;

  const optionsRef = useRef(options);
  const [values, setValues] = useState<FieldValues>(
    optionsRef.current.defaultValues,
  );
  const [errors, setErrors] = useState<FieldErrors<FieldValues> | null>(null);
  const [fieldOptions, setFieldOptions] = useState<FieldOptions<FieldValues>>();
  const [formState, setFormState] = useState<FormState>(defaultFormState);

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
                startValidationAfterSubmitting:
                  registerOption.startValidationAfterSubmitting ??
                  optionsRef.current.startValidationAfterSubmitting ??
                  true,
              },
            }));
          },
        );
    },
    [],
  );

  const markDirty = useCallback(() => {
    setFormState(formState => ({ ...formState, dirty: true }));
  }, []);

  const setValue = useCallback(
    <FieldName extends FieldNames>(
      fieldName: FieldName,
      value: FieldValues[FieldName],
    ) => {
      setValues(values => ({ ...values, [fieldName]: value }));
      markDirty();
    },
    [markDirty],
  );

  const setError = useCallback(
    <FieldName extends FieldNames>(
      fieldName: FieldName,
      error: FieldErrors<FieldValues> | null,
    ) => {
      setErrors(errors => {
        const newErrors: FieldErrors<FieldValues> = { ...errors };
        if (!error) {
          delete newErrors[fieldName];
          return newErrors;
        }
        return { ...newErrors, ...error };
      });
    },
    [],
  );

  const getCollectValueEventHandler = useCallback(
    <FieldName extends FieldNames>(fieldName: FieldName) => {
      const getValueFromEvent = fieldOptions?.[fieldName]?.getValueFromEvent;
      return async (e: any) => {
        if (getValueFromEvent) {
          const value = getValueFromEvent(e);
          setValue(fieldName, value);
        }
      };
    },
    [fieldOptions, setValue],
  );

  const getValidationEventHandlers = useCallback(
    <FieldName extends FieldNames>(fieldName: FieldName) => {
      const validationTriggers = fieldOptions?.[fieldName]?.validationTriggers;
      const getValueFromEvent = fieldOptions?.[fieldName]?.getValueFromEvent;
      const startValidationAfterSubmitting =
        fieldOptions?.[fieldName]?.startValidationAfterSubmitting;
      const handlers: Handlers = {};
      if (validationTriggers) {
        validationTriggers.forEach(item => {
          handlers[item] = async (e: any) => {
            if (
              getValueFromEvent &&
              validationSchema &&
              (!startValidationAfterSubmitting || formState.hasSubmitted)
            ) {
              const value = getValueFromEvent(e);
              const newValues = { ...values, [fieldName]: value };
              const validationResult = await validateFieldValue<FieldValues>(
                validationSchema,
                newValues,
                fieldName,
              );
              setError(fieldName, validationResult);
            }
          };
        });
      }
      return handlers;
    },
    [fieldOptions, formState.hasSubmitted, setError, validationSchema, values],
  );

  const getEventHandlers = useCallback(
    <FieldName extends FieldNames>(fieldName: FieldName) => {
      const collectValueTrigger =
        fieldOptions?.[fieldName]?.collectValueTrigger;
      const validationTriggers = fieldOptions?.[fieldName]?.validationTriggers;
      if (!collectValueTrigger || !validationTriggers) return {};

      const collectValueEventHandler = getCollectValueEventHandler(fieldName);
      const validationEventHandlers = getValidationEventHandlers(fieldName);
      return {
        ...validationEventHandlers,
        [collectValueTrigger]: (e: any) => {
          collectValueEventHandler(e);
          if (validationTriggers.includes(collectValueTrigger)) {
            validationEventHandlers[collectValueTrigger](e);
          }
        },
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

  const handleSubmit = useCallback(
    (onSubmit: (data: FieldValues) => void) => async (e: any) => {
      setFormState(formState => ({
        ...formState,
        hasSubmitted: true,
        submitCount: formState.submitCount + 1,
      }));
      if (validationSchema) {
        const validationResult = await validateFieldValues<FieldValues>(
          validationSchema,
          values,
        );
        setErrors(validationResult);
        if (!validationResult) {
          onSubmit(values);
        }
      }
    },
    [validationSchema, values],
  );

  return {
    register,
    bind,
    formState,
    values,
    setValue,
    errors,
    setError,
    handleSubmit,
  };
}

export default useForm;
