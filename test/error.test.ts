import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from '../src/index';

describe('getFieldError tests', () => {
  test('should return empty string if there is no error', () => {
    const { result } = renderHook(() => useForm({ user: {} }));

    expect(result.current.getFieldError('user')).toBe('');
  });
});

describe('getFieldsError tests', () => {
  const { result } = renderHook(() => useForm({ field1: {}, field2: {} }));
  const field1ErrorMessage = 'Error 1 occurred';
  const field2ErrorMessage = 'Error 2 occurred';
  act(() => {
    result.current.setFieldError('field1', field1ErrorMessage);
    result.current.setFieldError('field2', field2ErrorMessage);
  });

  test('should return correct error message when provide only one id', () => {
    expect(result.current.getFieldsError('field1')).toEqual({
      field1: field1ErrorMessage,
    });
  });

  test('should return correct value when provide mutiple ids as array', () => {
    expect(result.current.getFieldsError(['field1', 'field2'])).toEqual({
      field1: field1ErrorMessage,
      field2: field2ErrorMessage,
    });
  });

  test("should return all fields' value when not provide any ids", () => {
    expect(result.current.getFieldsError(['field1', 'field2'])).toEqual({
      field1: field1ErrorMessage,
      field2: field2ErrorMessage,
    });
  });
});

describe('setFieldError tests', () => {
  const field = {};
  const { result } = renderHook(() => useForm({ field }));

  test('should change error when set with new error', () => {
    const error = 'Some error occurred!';
    act(() => {
      result.current.setFieldError('field', error);
    });

    expect(result.current.getFieldError('field')).toEqual(error);
  });
});
