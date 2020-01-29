import useForm from '@fujuntao/use-form';
import { Box, TextField } from '@material-ui/core';
import React, { useEffect } from 'react';
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

const IndexPage: React.FC = () => {
  const { values, register, bind, errors } = useForm<Fields>({
    defaultValues: {
      email: '12312',
      password: '123123',
      date: new Date(),
    },
  });

  useEffect(() => {
    register(
      {
        name: 'email',
        validationTriggers: 'onBlur',
        validationSchema: yup
          .string()
          .required()
          .email()
          .min(12),
      },
      {
        name: 'password',
        validationSchema: yup
          .string()
          .required()
          .min(6)
          .max(10),
      },
      { name: 'date', validationSchema: yup.date().required() },
    );
  }, [register]);

  // // console.log('TCL: IndexPage:React.FC -> formState', formState);
  // console.log('TCL: IndexPage:React.FC -> values', values);
  console.log('TCL: IndexPage:React.FC -> errors', errors);

  return (
    <Box display="flex" flexDirection="column">
      <StyledTextField
        label="email"
        {...bind('email')}
        error={!!errors?.email?.message}
        helperText={errors?.email?.message}
      />
      <StyledTextField
        label="password"
        {...bind('password')}
        error={!!errors?.password?.message}
        helperText={errors?.password?.message}
      />
    </Box>
  );
};

export default IndexPage;
