import { State as FieldsState } from './fieldsStateReducer';
import { BasicFieldValues, FieldNames, FormOptions } from './types';

function getDefaultFieldsState<FieldValues extends BasicFieldValues>(
  options: FormOptions<FieldValues>,
) {
  const { register } = options;
  const defaultState = {} as FieldsState<FieldValues>;

  Object.keys(register).forEach(key => {
    const typedKey = key as FieldNames<FieldValues>;
    let { defaultValue } = register[typedKey];

    defaultState[typedKey] = {
      value: defaultValue,
      error: null,
    };
  });

  return defaultState;
}

export default getDefaultFieldsState;
