import { ValidationError } from 'yup';
import { BasicFieldValues, FieldNames, FieldsErrors } from './types';

export default function mapValidationError<
  FieldValues extends BasicFieldValues
>(validationError: ValidationError) {
  const fieldsErrors = {} as FieldsErrors<FieldValues>;

  validationError.inner.forEach(innerError => {
    const fieldPath = innerError.path as FieldNames<FieldValues>;
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
