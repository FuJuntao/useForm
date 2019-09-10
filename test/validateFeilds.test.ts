import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from '../src/index';

describe('validateFeilds tests', () => {
  const feild1ErrorMessage = 'please enter something';
  const feild1 = {
    initialValue: '',
    validator: (value: string) =>
      value.length === 0 ? feild1ErrorMessage : '',
  };
  const feild2ErrorMessage = 'please enter more than 3 characters';
  const feild2 = {
    initialValue: 'abcd',
    validator: (value: string) => (value.length > 3 ? '' : feild2ErrorMessage),
  };

  test('should return correct result after validating', async () => {
    expect.assertions(1);
    const { result, waitForNextUpdate } = renderHook(() =>
      useForm({ feild1, feild2 }),
    );

    let validateResult;
    act(() => {
      result.current.validateFeilds(['feild1', 'feild2']).then(result => {
        validateResult = result;
      });
    });
    await waitForNextUpdate();

    expect(validateResult).toBe(false);
  });

  test('should validate all feilds when not provide any id', async () => {
    expect.assertions(1);
    const { result, waitForNextUpdate } = renderHook(() =>
      useForm({ feild1, feild2 }),
    );

    let validateResult;
    act(() => {
      result.current.validateFeilds().then(result => {
        validateResult = result;
      });
    });
    await waitForNextUpdate();

    expect(validateResult).toBe(false);
  });

  test("validate status should be 'validating' when being validated", async () => {
    expect.assertions(2);
    const { result, waitForNextUpdate } = renderHook(() => useForm({ feild1 }));

    act(() => {
      result.current.validateFeilds('feild1');
    });

    expect(result.current.getFeildValidateStatus('feild1')).toBe('validating');
    await waitForNextUpdate();
    expect(result.current.getFeildValidateStatus('feild1')).toBe('error');
  });

  test('should change validate status after validation', async () => {
    expect.assertions(1);
    const { result, waitForNextUpdate } = renderHook(() => useForm({ feild1 }));

    act(() => {
      result.current.validateFeilds('feild1');
    });
    await waitForNextUpdate();

    expect(result.current.getFeildValidateStatus('feild1')).toBe('error');
  });
});
