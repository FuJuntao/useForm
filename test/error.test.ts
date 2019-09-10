import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from '../src/index';

describe('getFeildError tests', () => {
  test('should return empty string if there is no error', () => {
    const { result } = renderHook(() => useForm({ user: {} }));

    expect(result.current.getFeildError('user')).toBe('');
  });
});

describe('getFeildsError tests', () => {
  const { result } = renderHook(() => useForm({ feild1: {}, feild2: {} }));
  const feild1ErrorMessage = 'Error 1 occurred';
  const feild2ErrorMessage = 'Error 2 occurred';
  act(() => {
    result.current.setFeildError('feild1', feild1ErrorMessage);
    result.current.setFeildError('feild2', feild2ErrorMessage);
  });

  test('should return correct error message when provide only one id', () => {
    expect(result.current.getFeildsError('feild1')).toEqual({
      feild1: feild1ErrorMessage,
    });
  });

  test('should return correct value when provide mutiple ids as array', () => {
    expect(result.current.getFeildsError(['feild1', 'feild2'])).toEqual({
      feild1: feild1ErrorMessage,
      feild2: feild2ErrorMessage,
    });
  });

  test("should return all feilds' value when not provide any ids", () => {
    expect(result.current.getFeildsError(['feild1', 'feild2'])).toEqual({
      feild1: feild1ErrorMessage,
      feild2: feild2ErrorMessage,
    });
  });
});

describe('setFeildError tests', () => {
  const feild = {};
  const { result } = renderHook(() => useForm({ feild }));

  test('should change error when set with new error', () => {
    const error = 'Some error occurred!';
    act(() => {
      result.current.setFeildError('feild', error);
    });

    expect(result.current.getFeildError('feild')).toEqual(error);
  });
});
