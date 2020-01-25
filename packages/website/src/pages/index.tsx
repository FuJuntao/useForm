import useForm from '@fujuntao/use-form';
import { Box, TextField } from '@material-ui/core';
import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import * as yup from 'yup';

const StyledTextField = styled(TextField)({
  marginTop: 10,
});

interface Fields {
  email: string;
  password: string;
  date: Date;
}

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required()
    .email()
    .min(12),
  password: yup
    .string()
    .required()
    .min(6)
    .max(10),
  date: yup.date().required(),
});

const IndexPage: React.FC = () => {
  const { errors, formState, bind } = useForm<Fields>({
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

  // console.log('TCL: IndexPage:React.FC -> formState', formState);

  return (
    <Box display="flex" flexDirection="column">
      <StyledTextField
        label="email"
        {...bind('email')}
        error={!!errors.email?.message}
        helperText={errors.email?.message}
      />
      <StyledTextField
        label="password"
        {...bind('password')}
        error={!!errors.password?.message}
        helperText={errors.password?.message}
      />
    </Box>
  );
};

export default IndexPage;
