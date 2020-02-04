import { Schema, ValidationError } from 'yup';
import mapValidationError from './mapValidationError';
import set from './set';
import { BasicFieldValues, FieldErrors } from './types';

async function validateFieldValues<FieldValues extends BasicFieldValues>(
  validationSchema: Schema<Partial<FieldValues>>,
  values: FieldValues,
) {
  try {
    await validationSchema.validate(values, { abortEarly: false });
    return null;
  } catch (error) {
    if (error instanceof ValidationError) {
      let errors: { [key in any]: ValidationError[] } = {};
      error.inner.forEach(item => {
        errors[item.path] = [...(errors[item.path] ?? []), item];
      });
      let result: FieldErrors<FieldValues> = {};
      Object.keys(errors).forEach(item => {
        result = {
          ...result,
          ...set(result, item, mapValidationError(errors[item])),
        };
      });
      return result;
    } else {
      return error;
    }
  }
}

export default validateFieldValues;
