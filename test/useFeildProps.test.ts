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

  test("should collect value when 'collectValueTrigger' event is triggered", async () => {
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

  test("should validate value when 'validateTriggers' event is triggered", async () => {
    const errorMessage = 'please enter something';
    const { result, waitForNextUpdate } = renderHook(() =>
      useForm({
        feild: {
          getValueFromEvent: e => e,
          validator: (value: string) =>
            value.length === 0 ? errorMessage : '',
        },
      }),
    );
    const props = renderHook<unknown, any>(() =>
      result.current.useFeildProps('feild'),
    );

    act(() => {
      props.result.current.onChange('change');
      props.result.current.onChange('');
    });
    await waitForNextUpdate();

    expect(result.current.getFeildError('feild')).toBe(errorMessage);
    expect(result.current.getFeildValidateStatus('feild')).toBe('error');
  });
});
