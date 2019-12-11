import React, { useEffect, ChangeEvent } from 'react';
import useForm from './useForm';

interface Fields {
  phone: string;
  password: number;
  date: string;
}

const App: React.FC = () => {
  const { register, fromState, fieldsState } = useForm<Fields>({
    getValueFromEvent: (value: any) => value,
    collectValueTrigger: 'onBlur',
  });

  useEffect(() => {
    register(
      {
        name: 'phone',
        defaultValue: '12312',
        // validators: { validate: e => {} },
        getValueFromEvent: (e: ChangeEvent<HTMLInputElement>) => {
          return e.target.value;
        },
      },
      {
        name: 'password',
        defaultValue: 123123,
        // validators: { validate: async e => {} },
        getValueFromEvent: (e: ChangeEvent<HTMLInputElement>) => {
          return +e.target.value;
        },
      },
      {
        name: 'date',
        defaultValue: '1995-11-01',
        // validators: { validate: e => {} },
      },
    );
  }, [register]);

  console.log('TCL: App:React.FC -> fromState', fromState);
  console.log('TCL: App:React.FC -> state', fieldsState);

  return (
    <div>
      <p>asdf</p>
      <input onChange={e => {}} />
    </div>
  );
};

export default App;
