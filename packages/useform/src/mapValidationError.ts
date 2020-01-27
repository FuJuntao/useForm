import { ValidationError } from 'yup';
import { FieldsErrors } from './types';

export default function mapValidationError<FieldName extends string>(
  validationError: ValidationError,
) {
  const fieldsErrors = {} as FieldsErrors<FieldName>;

  validationError.inner.forEach(innerError => {
    const fieldPath = innerError.path as FieldName;
    const previousError = fieldsErrors[fieldPath];
    fieldsErrors[fieldPath] = {
      type: previousError?.type ?? innerError.type,
      message: previousError?.message ?? innerError.message,
      errors: {
        ...previousError?.errors,
        [innerError.type]: innerError.message,
      },
    };
  });

  return fieldsErrors;
}
