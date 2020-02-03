import useForm from '@fujuntao/use-form';
import { Box, Button, TextField } from '@material-ui/core';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import * as yup from 'yup';

const StyledTextField = styled(TextField)({
  marginTop: 10,
});

interface Fields {
  'form.email': string;
  'form.password': string;
  date?: Date;
}

interface NestedFiedlsValues {
  form: {
    email: string;
    password: string;
  };
  date: Date;
}

interface NestedFields<T> {
  form: {
    email: T;
    password: T;
  };
  date: T;
}

const IndexPage: React.FC = () => {
  const {
    register,
    bind,
    formState,
    getErrors,
    getValues,
    handleSubmit,
  } = useForm<Fields>({
    defaultValues: {
      'form.email': '12312',
      'form.password': '123123',
      date: new Date(),
    },
  });

  useEffect(() => {
    register(
      {
        name: 'form.email',
        validationTriggers: 'onBlur',
        validationSchema: yup
          .string()
          .required()
          .email()
          .min(12)
          .test('123123', '123123', () => {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve(false);
              }, 1000);
            });
          }),
      },
      {
        name: 'form.password',
        validationSchema: yup
          .string()
          .required()
          .min(6)
          .max(10),
        startValidationAfterSubmitting: false,
      },
      // { name: 'date', validationSchema: yup.date().required() },
    );
  }, [register]);

  const onSubmit = (data: Fields) => {
    console.log('TCL: onSubmit -> data', data);
  };

  const values = getValues<NestedFiedlsValues>();
  const errors = getErrors();

  // console.log('TCL: IndexPage:React.FC -> values', values);
  // console.log('TCL: IndexPage:React.FC -> errors', errors);
  // console.log('TCL: IndexPage:React.FC -> validationStatus', validationStatus);
  // console.log('TCL: IndexPage:React.FC -> formState', formState);

  return (
    <Box display="flex" flexDirection="column">
      <StyledTextField
        label="email"
        {...bind('form.email')}
        error={!!errors?.form?.email.message}
        helperText={errors?.form?.email.message}
      />
      <StyledTextField
        label="password"
        {...bind('form.password')}
        error={!!errors?.password?.message}
        helperText={errors?.password?.message}
      />
      <Button onClick={handleSubmit(onSubmit)}>
        {formState.isSubmitting ? '...' : 'submit'}
      </Button>
    </Box>
  );
};

export default IndexPage;
