import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from '../src/index';

describe('setFeildError', () => {
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
