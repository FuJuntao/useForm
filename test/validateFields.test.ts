import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from '../src/index';

describe('validateFields tests', () => {
  const field1ErrorMessage = 'please enter something';
  const field1 = {
    initialValue: '',
    validator: (value: string) =>
      value.length === 0 ? field1ErrorMessage : '',
  };
  const field2ErrorMessage = 'please enter more than 3 characters';
  const field2 = {
    initialValue: 'abcd',
    validator: (value: string) => (value.length > 3 ? '' : field2ErrorMessage),
  };

  test('should return correct result after validating', async () => {
    expect.assertions(1);
    const { result, waitForNextUpdate } = renderHook(() =>
      useForm({ field1, field2 }),
    );

    let validateResult;
    act(() => {
      result.current.validateFields(['field1', 'field2']).then(result => {
        validateResult = result;
      });
    });
    await waitForNextUpdate();

    expect(validateResult).toBe(false);
  });

  test('should validate all fields when not provide any id', async () => {
    expect.assertions(1);
    const { result, waitForNextUpdate } = renderHook(() =>
      useForm({ field1, field2 }),
    );

    let validateResult;
    act(() => {
      result.current.validateFields().then(result => {
        validateResult = result;
      });
    });
    await waitForNextUpdate();

    expect(validateResult).toBe(false);
  });

  test("validate status should be 'validating' when being validated", async () => {
    expect.assertions(2);
    const { result, waitForNextUpdate } = renderHook(() => useForm({ field1 }));

    act(() => {
      result.current.validateFields('field1');
    });

    expect(result.current.getFieldValidateStatus('field1')).toBe('validating');
    await waitForNextUpdate();
    expect(result.current.getFieldValidateStatus('field1')).toBe('error');
  });

  test('should change validate status after validation', async () => {
    expect.assertions(1);
    const { result, waitForNextUpdate } = renderHook(() => useForm({ field1 }));

    act(() => {
      result.current.validateFields('field1');
    });
    await waitForNextUpdate();

    expect(result.current.getFieldValidateStatus('field1')).toBe('error');
  });
});
