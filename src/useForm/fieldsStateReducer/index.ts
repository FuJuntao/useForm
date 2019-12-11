import { BasicFieldValues } from '../types';

export type FieldsStateActions<
  FieldValues extends BasicFieldValues
> = import('./actions').Actions<FieldValues>;

export type FieldsState<
  FieldValues extends BasicFieldValues
> = import('./reducer').State<FieldValues>;

export { reducer as fieldsStateReducer } from './reducer';
