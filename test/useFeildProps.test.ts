import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from '../src/index';

describe('useFeildProps tests', () => {
  test('should have default value when not provide any config', async () => {
    const { result } = renderHook(() =>
      useForm({ feild: {} }).useFeildProps('feild'),
    );

    expect(result.current).toEqual(
      expect.objectContaining({ value: '', onChange: expect.any(Function) }),
    );
  });

  test('should return correct number of handlers when provide config', () => {
    const { result } = renderHook(() =>
      useForm({
        feild: {
          validateTriggers: ['onChange', 'onBlur'],
          collectValueTrigger: 'onChange',
        },
      }).useFeildProps('feild'),
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
      useForm({ feild: { getValueFromEvent: e => e } }).useFeildProps('feild'),
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
        feild: {
          initialValue: 'abc',
          getValueFromEvent: e => e,
          validator: (value: string) =>
            value.length === 0 ? errorMessage : '',
        },
      }),
    );
    const { result: useFeildPropsResult } = renderHook<unknown, any>(() =>
      useFormResult.current.useFeildProps('feild'),
    );

    act(() => {
      useFeildPropsResult.current.onChange('');
    });
    await waitForNextUpdate();

    expect(useFormResult.current.getFeildError('feild')).toBe(errorMessage);
    expect(useFormResult.current.getFeildValidateStatus('feild')).toBe('error');
  });

  test('should only apply result from the last validate request', async () => {
    expect.assertions(1);
    const { result: useFormResult, waitForNextUpdate } = renderHook(() =>
      useForm({
        feild: {
          getValueFromEvent: e => e,
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
      }),
    );
    const { result: useFeildPropsResult } = renderHook<unknown, any>(() =>
      useFormResult.current.useFeildProps('feild'),
    );

    act(() => {
      useFeildPropsResult.current.onChange('1');
    });
    await waitForNextUpdate();
    act(() => {
      useFeildPropsResult.current.onChange('2');
    });
    await waitForNextUpdate();

    // request for validating value '1' first, then call for value '2'
    // '1's validate result comes later than '2's
    // it should be result from validating value '2' to be applied
    expect(useFormResult.current.getFeildError('feild')).toBe('2');
  });
});
