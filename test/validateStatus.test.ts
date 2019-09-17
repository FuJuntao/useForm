import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from '../src/index';

describe('getFieldValidateStatus tests', () => {
  const { result } = renderHook(() => useForm({ field: {} }));

  test("should return 'none' when field has never been validated", () => {
    expect(result.current.getFieldValidateStatus('field')).toBe('none');
  });
});

describe('setFieldValidateStatus tests', () => {
  const { result } = renderHook(() => useForm({ field: {} }));

  test('should change status when set with new validate status', () => {
    act(() => {
      result.current.setFieldValidateStatus('field', 'validating');
    });
    expect(result.current.getFieldValidateStatus('field')).toBe('validating');

    act(() => {
      result.current.setFieldValidateStatus('field', 'error');
    });
    expect(result.current.getFieldValidateStatus('field')).toBe('error');

    act(() => {
      result.current.setFieldValidateStatus('field', 'success');
    });
    expect(result.current.getFieldValidateStatus('field')).toBe('success');
  });
});
