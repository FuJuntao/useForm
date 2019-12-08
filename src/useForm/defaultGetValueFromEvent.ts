import { ChangeEvent } from 'react';

function defaultGetValueFromEvent<
  T extends any = ChangeEvent<HTMLInputElement>
>(e: T) {
  if (!e || !e.target) {
    return e;
  }
  const { target } = e;
  return target.type === 'checkbox' ? target.checked : target.value;
}

export default defaultGetValueFromEvent;
