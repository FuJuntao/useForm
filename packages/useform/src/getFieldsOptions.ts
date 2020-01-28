import defaultGetValueFromEvent from './defaultGetValueFromEvent';
import { BasicFieldValues, FieldsOptions, FormOptions } from './types';

const DEFAULT_COLLECT_VALUE_TRIGGER = 'onChange';
const DEFAULT_VALIDATION_TRIGGERS = ['onChange'];

function getFieldsOptions<FieldValues extends BasicFieldValues>(
  options: FormOptions<FieldValues>,
) {
  const { register } = options;
  const fieldsOptions = {} as FieldsOptions<FieldValues>;

  Object.keys(register).forEach(key => {
    const typedKey = key as keyof FieldValues;
    let {
      defaultValue,
      getValueFromEvent,
      collectValueTrigger,
      validationTriggers,
    } = register[typedKey];

    if (typeof validationTriggers === 'string') {
      validationTriggers = [validationTriggers];
    }

    fieldsOptions[typedKey] = {
      defaultValue,
      getValueFromEvent:
        getValueFromEvent ??
        options?.getValueFromEvent ??
        defaultGetValueFromEvent,
      collectValueTrigger:
        collectValueTrigger ??
        options?.collectValueTrigger ??
        DEFAULT_COLLECT_VALUE_TRIGGER,
      validationTriggers: validationTriggers ?? DEFAULT_VALIDATION_TRIGGERS,
    };
  });

  return fieldsOptions;
}

export default getFieldsOptions;
