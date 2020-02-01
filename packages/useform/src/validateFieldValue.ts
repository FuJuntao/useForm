import { Schema, ValidateOptions, ValidationError } from 'yup';
import mapValidationError from './mapValidationError';
import { BasicFieldValues, FieldErrors, FieldNames } from './types';

async function validateFieldValue<FieldValues extends BasicFieldValues>(
  validationSchema: Schema<FieldValues>,
  values: FieldValues,
  fieldName: FieldNames<FieldValues>,
  validateOptions?: ValidateOptions,
): Promise<null | FieldErrors<FieldValues>> {
  try {
    await validationSchema.validateAt(fieldName, values, validateOptions);
    return null;
  } catch (error) {
    if (error instanceof ValidationError) {
      return mapValidationError<FieldValues>(
        validateOptions?.abortEarly === undefined ||
          validateOptions?.abortEarly === true
          ? error
          : error.inner,
      );
    } else {
      return error;
    }
  }
}

export default validateFieldValue;
