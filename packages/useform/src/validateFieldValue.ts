import { Schema, ValidationError } from 'yup';
import mapValidationError from './mapValidationError';
import { BasicFieldValues, FieldNames } from './types';

async function validateFieldValue<
  FieldValues extends BasicFieldValues,
  FieldName extends FieldNames<FieldValues>
>(
  validationSchema: Schema<FieldValues>,
  values: FieldValues,
  fieldName: FieldName,
) {
  try {
    await validationSchema.validateAt(fieldName, values, {
      abortEarly: false,
    });
    return { [fieldName]: null };
  } catch (error) {
    if (error instanceof ValidationError) {
      return mapValidationError(error);
    } else {
      return error;
    }
  }
}

export default validateFieldValue;
