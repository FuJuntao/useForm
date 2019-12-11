import { BasicFieldValues } from '../types';

export type FormStateActions = import('./actions').Actions;

export type FormState<
  FieldValues extends BasicFieldValues
> = import('./reducer').State<FieldValues>;

export { reducer as formStateReducer } from './reducer';
