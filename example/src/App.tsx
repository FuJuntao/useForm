import React, { useEffect, ChangeEvent } from 'react';
import useForm from '../../src/index';

interface Fields {
  phone: string;
  password: number;
  date: string;
}

const App: React.FC = () => {
  const { register, state } = useForm<Fields>({
    getValueFromEvent: (e: any) => {
      return e.target.value;
    },
  });

  useEffect(() => {
    register(
      {
        name: 'phone',
        defaultValue: '12312',
        validators: { validate: e => {} },
        getValueFromEvent: (e: ChangeEvent<HTMLInputElement>) => {
          return e.target.value;
        },
      },
      {
        name: 'password',
        defaultValue: 123123,
        validators: { validate: async e => {} },
        getValueFromEvent: (e: ChangeEvent<HTMLInputElement>) => {
          return +e.target.value;
        },
      },
      {
        name: 'date',
        defaultValue: '1995-11-01',
        validators: { validate: e => {} },
      },
    );
  }, [register]);

  return (
    <div>
      <p>asdf</p>
      <input onChange={e => {}} />
    </div>
  );
};

export default App;
