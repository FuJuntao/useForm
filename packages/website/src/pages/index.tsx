import React, { ChangeEvent } from 'react';
import useForm from '@fujuntao/use-form';
import * as yup from 'yup';

interface Fields {
  phone: string;
  password: number;
  date: Date;
}

const validationSchema = yup.object().shape({
  phone: yup
    .string()
    .required()
    .max(10),
  password: yup
    .number()
    .required()
    .lessThan(2019),
  date: yup.date().required(),
});

const IndexPage: React.FC = () => {
  const { getValues, formState, bind } = useForm<Fields>({
    getValueFromEvent: (value: any) => value,
    register: {
      phone: {
        defaultValue: '12312',
        getValueFromEvent: (e: ChangeEvent<HTMLInputElement>) => {
          return e.target.value;
        },
      },
      password: {
        defaultValue: 123123123123,
        getValueFromEvent: (e: ChangeEvent<HTMLInputElement>) => {
          return +e.target.value;
        },
      },
      date: { defaultValue: new Date() },
    },
    validationSchema,
  });

  // console.log('TCL: App:React.FC -> fromState', formState);
  // console.log(getValues());
  console.log(bind('date'));

  return (
    <div>
      <p>asdf</p>
      <input {...bind('phone')} />
      <input {...bind('password')} />
    </div>
  );
};

export default IndexPage;
