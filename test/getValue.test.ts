import { renderHook } from '@testing-library/react-hooks';
import { useForm } from '../src/index';

describe('getFeildValue tests', () => {
  test('should return empty string when not provide initialValue', () => {
    const { result } = renderHook(() => useForm({ user: {} }));

    expect(result.current.getFeildValue('user')).toBe('');
  });

  test('should return the same value when provide initialValue', () => {
    const initialValue = { someValue: 123123 };
    const { result } = renderHook(() => useForm({ user: { initialValue } }));

    expect(result.current.getFeildValue('user')).toEqual(initialValue);
  });
});

describe('getFeildsValue tests', () => {
  const feild1 = { initialValue: 'abcdef' };
  const feild2 = { initialValue: { a: 123 } };
  const { result } = renderHook(() => useForm({ feild1, feild2 }));

  test('should return correct value when provide only one id', () => {
    expect(result.current.getFeildsValue('feild1')).toEqual({
      feild1: feild1.initialValue,
    });
  });

  test('should return correct value when provide mutiple ids as array', () => {
    expect(result.current.getFeildsValue(['feild1', 'feild2'])).toEqual({
      feild1: feild1.initialValue,
      feild2: feild2.initialValue,
    });
  });

  test("should return all feilds' value when not provide any ids", () => {
    expect(result.current.getFeildsValue()).toEqual({
      feild1: feild1.initialValue,
      feild2: feild2.initialValue,
    });
  });
});
