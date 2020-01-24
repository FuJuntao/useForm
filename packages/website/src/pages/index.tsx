import useForm from '@fujuntao/use-form';
import { TextField } from '@material-ui/core';
import React, { ChangeEvent } from 'react';
import * as yup from 'yup';

interface Fields {
  email: string;
  password: string;
  date: Date;
}

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required()
    .email(),
  password: yup
    .string()
    .required()
    .min(6)
    .max(10),
  date: yup.date().required(),
});

const IndexPage: React.FC = () => {
  const { getValues, formState, bind } = useForm<Fields>({
    register: {
      email: {
        defaultValue: '12312',
      },
      password: {
        defaultValue: 'password',
        getValueFromEvent: (e: ChangeEvent<HTMLInputElement>) => {
          return e.target.value;
        },
      },
      date: {
        defaultValue: new Date(),
      },
    },
    validationSchema,
  });

  return (
    <div>
      <TextField {...bind('email')} />
      <TextField {...bind('password')} />
    </div>
  );
};

export default IndexPage;
