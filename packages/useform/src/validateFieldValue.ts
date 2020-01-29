import { Schema, ValidationError } from 'yup';
import mapValidationError from './mapValidationError';
import { BasicFieldValues, FieldNames, FieldsErrors } from './types';

async function validateFieldValue<FieldValues extends BasicFieldValues>(
  validationSchema: Schema<FieldValues>,
  values: FieldValues,
  fieldName: FieldNames<FieldValues>,
): Promise<null | FieldsErrors<FieldValues>> {
  try {
    await validationSchema.validateAt(fieldName, values, {
      abortEarly: false,
    });
    return null;
  } catch (error) {
    if (error instanceof ValidationError) {
      return mapValidationError<FieldValues>(error);
    } else {
      return error;
    }
  }
}

export default validateFieldValue;
