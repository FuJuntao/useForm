import defaultGetValueFromEvent from './defaultGetValueFromEvent';
import { State as FieldsState } from './fieldsStateReducer';
import { BasicFieldValues, FieldNames, FormOptions } from './types';

const DEFAULT_COLLECT_VALUE_TRIGGER = 'onChange';
const DEFAULT_VALIDATION_TRIGGERS = ['onChange'];

function getDefaultFieldsState<FieldValues extends BasicFieldValues>(
  options: FormOptions<FieldValues>,
) {
  const { register } = options;
  const defaultState = {} as FieldsState<FieldValues>;

  Object.keys(register).forEach(key => {
    const typedKey = key as FieldNames<FieldValues>;
    let {
      defaultValue,
      getValueFromEvent,
      collectValueTrigger,
      validationTriggers,
    } = register[typedKey];

    if (typeof validationTriggers === 'string') {
      validationTriggers = [validationTriggers];
    }

    defaultState[typedKey] = {
      value: defaultValue,
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

  return defaultState;
}

export default getDefaultFieldsState;
