import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from '../src/index';

describe('getFeildValidateStatus tests', () => {
  const { result } = renderHook(() => useForm({ feild: {} }));

  test("should return 'none' when feild has never been validated", () => {
    expect(result.current.getFeildValidateStatus('feild')).toBe('none');
  });
});

describe('setFeildValidateStatus tests', () => {
  const { result } = renderHook(() => useForm({ feild: {} }));

  test('should change status when set with new validate status', () => {
    act(() => {
      result.current.setFeildValidateStatus('feild', 'validating');
    });
    expect(result.current.getFeildValidateStatus('feild')).toBe('validating');

    act(() => {
      result.current.setFeildValidateStatus('feild', 'error');
    });
    expect(result.current.getFeildValidateStatus('feild')).toBe('error');

    act(() => {
      result.current.setFeildValidateStatus('feild', 'success');
    });
    expect(result.current.getFeildValidateStatus('feild')).toBe('success');
  });
});
