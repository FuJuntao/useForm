import { Schema } from 'yup';
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
    const result = await validationSchema.validateAt(fieldName, values, {
      abortEarly: false,
    });
    console.log('TCL: getValidationEventHandlers -> result', result);
  } catch (error) {
    console.log('TCL: error', error);
  }
}

export default validateFieldValue;
