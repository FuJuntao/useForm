import { BasicFieldValues } from '../types';

export type Actions<
  FieldValues extends BasicFieldValues
> = import('./actions').Actions<FieldValues>;

export type State<
  FieldValues extends BasicFieldValues
> = import('./reducer').State<FieldValues>;

export { reducer } from './reducer';
