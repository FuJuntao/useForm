import { ValidationError } from 'yup';
import { FieldError } from './types';

export default function mapValidationError(
  validationErrors: ValidationError | ValidationError[],
): FieldError | null {
  if (Array.isArray(validationErrors)) {
    let fieldError: FieldError | null = null;
    validationErrors.forEach(error => {
      const prev: Partial<FieldError> = fieldError ?? {};
      fieldError = {
        type: prev.type ?? error.type,
        message: prev.message ?? error.message,
        ...prev,
        errors: {
          ...prev?.errors,
          [error.type]: error.message,
        },
      };
    });
    return fieldError;
  }

  return {
    type: validationErrors.type,
    message: validationErrors.message,
    errors: {},
  };
}
