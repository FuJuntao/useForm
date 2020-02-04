import { useCallback, useRef, useState } from 'react';
import defaultGetValueFromEvent from './defaultGetValueFromEvent';
import get from './get';
import set from './set';
import {
  BasicFieldValues,
  FieldError,
  FieldErrors,
  FieldName,
  FieldOption,
  FieldOptions,
  FieldValidationStatus,
  FormOptions,
  FormState,
  Handlers,
  Register,
  RegisterOption,
  ValidationStatus,
} from './types';
import validateFieldValue from './validateFieldValue';
import validateFieldValues from './validateFieldValues';

const DEFAULT_COLLECT_VALUE_TRIGGER = 'onChange';
const DEFAULT_VALIDATION_TRIGGERS = ['onChange'];

const defaultFormState = {
  dirty: false,
  isSubmitting: false,
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
  type FieldNames = FieldName<FieldValues>;

  const optionsRef = useRef(options);
  const [fieldOptions, setFieldOptions] = useState<FieldOptions<FieldValues>>();
  const [values, setValues] = useState<FieldValues>(
    optionsRef.current.defaultValues,
  );
  const [errors, setErrors] = useState<FieldErrors<FieldValues> | null>(null);
  const [validationStatus, setValidationSatus] = useState<
    FieldValidationStatus<FieldValues> | undefined
  >();
  const [formState, setFormState] = useState<FormState>(defaultFormState);

  const setIsFormSubmitting = useCallback((isSubmitting: boolean) => {
    setFormState(formState => ({ ...formState, isSubmitting }));
  }, []);

  const markDirty = useCallback(() => {
    setFormState(formState => ({ ...formState, dirty: true }));
  }, []);

  const setValue = useCallback(
    <FieldName extends FieldNames>(
      fieldName: FieldName,
      value: FieldValues[FieldName],
    ) => {
      setValues(values => set(values, fieldName, value));
      markDirty();
    },
    [markDirty],
  );

  const setError = useCallback(
    (fieldName: FieldNames, error: FieldError | null) => {
      setErrors(errors => set(errors, fieldName, error));
    },
    [],
  );

  const setFieldValidationSatus = useCallback(
    (fieldName: FieldNames, status: ValidationStatus) => {
      setValidationSatus(validationStatus =>
        set(validationStatus, fieldName, status),
      );
    },
    [],
  );

  const register: Register<FieldValues> = useCallback(
    (...registerOptions: any[]) => {
      if (Array.isArray(registerOptions))
        registerOptions.forEach(
          (registerOption: RegisterOption<FieldValues>) => {
            const { name, defaultValue } = registerOption;

            setValues(values =>
              set(values, name, get(values, name) ?? defaultValue ?? null),
            );

            setFieldOptions(fieldOptions =>
              set(fieldOptions ?? {}, name, {
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
                startValidationAfterSubmitting:
                  registerOption.startValidationAfterSubmitting ??
                  optionsRef.current.startValidationAfterSubmitting ??
                  true,
              }),
            );

            setFieldValidationSatus(name, 'none');
          },
        );
    },
    [setFieldValidationSatus],
  );

  const getCollectValueEventHandler = useCallback(
    <FieldName extends FieldNames>(fieldName: FieldName) => {
      const getValueFromEvent = get<FieldOption<FieldValues[FieldName]>>(
        fieldOptions,
        fieldName,
      )?.getValueFromEvent;
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
      const fieldOption = get<FieldOption<FieldValues[FieldName]>>(
        fieldOptions,
        fieldName,
      );
      const validationTriggers = fieldOption?.validationTriggers;
      const getValueFromEvent = fieldOption?.getValueFromEvent;
      const startValidationAfterSubmitting =
        fieldOption?.startValidationAfterSubmitting;
      const { validationSchema } = optionsRef.current;
      const handlers: Handlers = {};
      if (validationTriggers) {
        validationTriggers.forEach(item => {
          handlers[item] = async (e: any) => {
            if (
              validationSchema &&
              getValueFromEvent &&
              (!startValidationAfterSubmitting || formState.hasSubmitted)
            ) {
              const value = getValueFromEvent(e);
              const newValues = set<FieldValues>(values, fieldName, value);
              setFieldValidationSatus(fieldName, 'pending');
              const validationResult = await validateFieldValue<FieldValues>(
                validationSchema,
                newValues,
                fieldName,
                optionsRef.current.validateOptions,
              );
              setFieldValidationSatus(fieldName, 'none');
              setError(fieldName, validationResult);
            }
          };
        });
      }
      return handlers;
    },
    [
      fieldOptions,
      formState.hasSubmitted,
      setError,
      setFieldValidationSatus,
      values,
    ],
  );

  const mergeEventHandlers = useCallback(
    <FieldName extends FieldNames>(fieldName: FieldName) => {
      const fieldOption = get<FieldOption<FieldValues[FieldName]>>(
        fieldOptions,
        fieldName,
      );
      const collectValueTrigger = fieldOption?.collectValueTrigger;
      const validationTriggers = fieldOption?.validationTriggers;
      if (!collectValueTrigger || !validationTriggers) return {};

      const collectValueEventHandler = getCollectValueEventHandler(fieldName);
      const validationEventHandlers = getValidationEventHandlers(fieldName);
      return {
        ...validationEventHandlers,
        [collectValueTrigger]: (e: any) => {
          collectValueEventHandler(e);
          if (validationTriggers.includes(collectValueTrigger)) {
            validationEventHandlers[collectValueTrigger]?.(e);
          }
        },
      };
    },
    [fieldOptions, getCollectValueEventHandler, getValidationEventHandlers],
  );

  const bind = useCallback(
    <FieldName extends FieldNames>(fieldName: FieldName) => {
      const value = get(values, fieldName);
      return { value, ...mergeEventHandlers(fieldName) };
    },
    [mergeEventHandlers, values],
  );

  const handleSubmit = useCallback(
    (onSubmit: (data: FieldValues) => void) => async (e: any) => {
      setFormState(formState => ({
        ...formState,
        hasSubmitted: true,
        submitCount: formState.submitCount + 1,
      }));
      const { validationSchema } = optionsRef.current;
      if (validationSchema) {
        setIsFormSubmitting(true);
        const validationResult = await validateFieldValues<FieldValues>(
          validationSchema,
          values,
        );
        setIsFormSubmitting(false);
        setErrors(validationResult);
        if (!validationResult) {
          onSubmit(values);
        }
      }
    },
    [setIsFormSubmitting, values],
  );

  return {
    register,
    bind,
    formState,
    values,
    setValue,
    errors,
    setError,
    validationStatus,
    setValidationSatus: setFieldValidationSatus,
    handleSubmit,
  };
}

export default useForm;
