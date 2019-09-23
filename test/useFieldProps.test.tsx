import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from '../src/index';
import { render, fireEvent, wait } from '@testing-library/react';

describe('useFieldProps tests', () => {
  test('should have default value when not provide any config', async () => {
    const { result } = renderHook(() =>
      useForm({ field: {} }).useFieldProps('field'),
    );

    expect(result.current).toEqual(
      expect.objectContaining({ value: '', onChange: expect.any(Function) }),
    );
  });

  test('should return correct number of handlers when provide config', () => {
    const { result } = renderHook(() =>
      useForm({
        field: {
          validateTriggers: ['onChange', 'onBlur'],
          collectValueTrigger: 'onChange',
        },
      }).useFieldProps('field'),
    );

    expect(result.current).toEqual(
      expect.objectContaining({
        value: '',
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
      }),
    );
  });

  test("should collect value when event specified in 'collectValueTrigger' is triggered", async () => {
    const { result, waitForNextUpdate } = renderHook<{}, any>(() =>
      useForm({ field: { getValueFromEvent: e => e } }).useFieldProps('field'),
    );
    const value = 'hello world';
    act(() => {
      result.current.onChange(value);
    });
    await waitForNextUpdate();

    expect(result.current.value).toBe(value);
  });

  test("should validate value when event specified in 'validateTriggers' is triggered", async () => {
    expect.assertions(2);
    const errorMessage = 'please enter something';
    const { result: useFormResult, waitForNextUpdate } = renderHook(() =>
      useForm({
        field: {
          initialValue: 'abc',
          getValueFromEvent: e => e,
          validator: (value: string) =>
            value.length === 0 ? errorMessage : '',
        },
      }),
    );
    const { result: useFieldPropsResult } = renderHook<unknown, any>(() =>
      useFormResult.current.useFieldProps('field'),
    );

    act(() => {
      useFieldPropsResult.current.onChange('');
    });
    await waitForNextUpdate();

    expect(useFormResult.current.getFieldError('field')).toBe(errorMessage);
    expect(useFormResult.current.getFieldValidateStatus('field')).toBe('error');
  });

  function Input() {
    const { useFieldProps, getFieldError } = useForm({
      field: {
        validator: (value: string) => {
          return new Promise(resolve => {
            setTimeout(
              () => {
                resolve(value);
              },
              // When pass string '1', it will wait for 5ms to return a result
              // otherwise, it will wait for 0ms to return a result asynchronously
              value === '1' ? 5 : 0,
            );
          });
        },
      },
    });

    return (
      <div>
        <input {...useFieldProps('field')} data-testid="input" />
        <p data-testid="error">{getFieldError('field')}</p>
      </div>
    );
  }

  test('should only apply result from the last validate request', async () => {
    expect.assertions(1);

    const { getByTestId } = render(<Input />);

    fireEvent.change(getByTestId('input'), { target: { value: '1' } });
    fireEvent.change(getByTestId('input'), { target: { value: '2' } });

    await wait(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 60);
        }),
    );

    // request for validating value '1' first, then call for value '2'
    // '1's validate result comes later than '2's
    // it should be result from validating value '2' to be applied
    expect(getByTestId('error').innerHTML).toBe('2');
  });
});
