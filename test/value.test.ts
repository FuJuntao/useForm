import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from '../src/index';

describe('getFieldValue tests', () => {
  test('should return empty string when not provide initialValue', () => {
    const { result } = renderHook(() => useForm({ user: {} }));

    expect(result.current.getFieldValue('user')).toBe('');
  });

  test('should return the same value when provide initialValue', () => {
    const initialValue = { someValue: 123123 };
    const { result } = renderHook(() => useForm({ user: { initialValue } }));

    expect(result.current.getFieldValue('user')).toEqual(initialValue);
  });
});

describe('getFieldsValue tests', () => {
  const field1 = { initialValue: 'abcdef' };
  const field2 = { initialValue: { a: 123 } };
  const { result } = renderHook(() => useForm({ field1, field2 }));

  test('should return correct value when provide only one id', () => {
    expect(result.current.getFieldsValue('field1')).toEqual({
      field1: field1.initialValue,
    });
  });

  test('should return correct value when provide mutiple ids as array', () => {
    expect(result.current.getFieldsValue(['field1', 'field2'])).toEqual({
      field1: field1.initialValue,
      field2: field2.initialValue,
    });
  });

  test("should return all fields' value when not provide any ids", () => {
    expect(result.current.getFieldsValue()).toEqual({
      field1: field1.initialValue,
      field2: field2.initialValue,
    });
  });
});

describe('setFieldValue tests', () => {
  const field = {};
  const { result } = renderHook(() => useForm({ field }));

  test('should change value when set with new value', () => {
    const newValue = { someValue: 'abc' };
    act(() => {
      result.current.setFieldValue('field', newValue);
    });

    expect(result.current.getFieldValue('field')).toEqual(newValue);
  });
});
