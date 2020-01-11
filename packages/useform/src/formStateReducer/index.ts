import { BasicFieldValues } from '../types';

export type Actions = import('./actions').Actions;

export type State<
  FieldValues extends BasicFieldValues
> = import('./reducer').State<FieldValues>;

export { reducer } from './reducer';
