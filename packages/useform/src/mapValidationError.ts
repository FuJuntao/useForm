import { ValidationError } from 'yup';
import { BasicFieldValues, FieldErrors, FieldNames } from './types';

export default function mapValidationError<
  FieldValues extends BasicFieldValues
>(validationErrors: ValidationError | ValidationError[]) {
  const fieldsErrors = {} as FieldErrors<FieldValues>;

  if (Array.isArray(validationErrors)) {
    validationErrors.forEach(error => {
      const fieldPath = error.path as FieldNames<FieldValues>;
      const previousError = fieldsErrors[fieldPath];
      fieldsErrors[fieldPath] = {
        type: previousError?.type ?? error.type,
        message: previousError?.message ?? error.message,
        errors: {
          ...previousError?.errors,
          [error.type]: error.message,
        },
      };
    });
  } else {
    const fieldPath = validationErrors.path as FieldNames<FieldValues>;
    fieldsErrors[fieldPath] = {
      type: validationErrors.type,
      message: validationErrors.message,
      errors: {},
    };
  }

  return fieldsErrors;
}
