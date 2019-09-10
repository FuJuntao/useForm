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
    const { result } = renderHook(() => {
      return useForm({
        feild: {
          validateTriggers: ['onChange', 'onBlur'],
          collectValueTrigger: 'onChange',
        },
      }).useFeildProps('feild');
    });

    expect(result.current).toEqual(
      expect.objectContaining({
        value: '',
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
      }),
    );
  });

  test("should collect value when 'collectValueTrigger' event is triggered", async () => {
    const { result, waitForNextUpdate } = renderHook<{}, any>(() => {
      return useForm({ feild: { getValueFromEvent: e => e } }).useFeildProps(
        'feild',
      );
    });
    const value = 'hello world';
    act(() => {
      result.current.onChange(value);
    });
    await waitForNextUpdate();

    expect(result.current.value).toBe(value);
  });

  test("should validate value when 'validateTriggers' event is triggered", async () => {
    const mockValidator = jest.fn((value: string) => value);
    const { result, waitForNextUpdate } = renderHook<{}, any>(() => {
      return useForm({
        feild: { getValueFromEvent: e => e, validator: mockValidator },
      }).useFeildProps('feild');
    });

    act(() => {
      result.current.onChange('change');
      result.current.onChange('');
    });
    await waitForNextUpdate();

    expect(mockValidator.mock.calls.length).toBe(2);
  });
});
