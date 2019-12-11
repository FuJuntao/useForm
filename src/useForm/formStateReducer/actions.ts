import { MARK_FORM_DIRTY, MARK_FORM_SUBMITTED } from './actionTypes';

type MarkFormDirty = {
  type: typeof MARK_FORM_DIRTY;
};

type MarkFormSubmitted = {
  type: typeof MARK_FORM_SUBMITTED;
};

export type Actions = MarkFormDirty | MarkFormSubmitted;
