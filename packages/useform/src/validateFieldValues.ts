import { Schema, ValidationError } from 'yup';
import mapValidationError from './mapValidationError';
import { BasicFieldValues, FieldErrors } from './types';

async function validateFieldValues<FieldValues extends BasicFieldValues>(
  validationSchema: Schema<FieldValues>,
  values: FieldValues,
): Promise<null | FieldErrors<FieldValues>> {
  try {
    await validationSchema.validate(values, { abortEarly: false });
    return null;
  } catch (error) {
    if (error instanceof ValidationError) {
      return mapValidationError<FieldValues>(error.inner);
    } else {
      return error;
    }
  }
}

export default validateFieldValues;
