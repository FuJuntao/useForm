import { Schema, ValidateOptions, ValidationError } from 'yup';
import mapValidationError from './mapValidationError';
import { BasicFieldValues, FieldError, FieldName } from './types';

async function validateFieldValue<FieldValues extends BasicFieldValues>(
  validationSchema: Schema<Partial<FieldValues>>,
  values: FieldValues,
  fieldName: FieldName<FieldValues>,
  validateOptions?: ValidateOptions,
): Promise<null | FieldError> {
  try {
    await validationSchema.validateAt(fieldName, values, validateOptions);
    return null;
  } catch (error) {
    if (error instanceof ValidationError) {
      return mapValidationError(
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
