import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from '../src/index';

describe('setFeildValue tests', () => {
  const feild = {};
  const { result } = renderHook(() => useForm({ feild }));

  test('should change value when set with new value', () => {
    const newValue = { someValue: 'abc' };
    act(() => {
      result.current.setFeildValue('feild', newValue);
    });

    expect(result.current.getFeildValue('feild')).toEqual(newValue);
  });
});
