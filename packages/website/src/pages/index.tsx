import useForm from '@fujuntao/use-form';
import { Box, Button, TextField } from '@material-ui/core';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import * as yup from 'yup';

const StyledTextField = styled(TextField)({
  marginTop: 10,
});

interface NestedFiedlsValues {
  form: {
    email: string;
    password: string;
  };
  date: Date;
  abb: [number, string];
}

const IndexPage: React.FC = () => {
  const {
    register,
    setValue,
    values,
    errors,
    bind,
    handleSubmit,
    formState,
    validationStatus,
  } = useForm<NestedFiedlsValues>({
    defaultValues: {
      form: {
        email: 'fujuntao@outlook.com',
        password: '123123',
      },
      date: new Date(),
      abb: [123, '123123'],
    },
    validationSchema: yup.object().shape({
      form: yup.object().shape({
        email: yup
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
        password: yup
          .string()
          .required()
          .min(6)
          .max(10),
      }),
    }),
  });

  // console.log('TCL: IndexPage:React.FC -> validationStatus', validationStatus);
  // console.log('TCL: IndexPage:React.FC -> errors', errors);
  // console.log('TCL: IndexPage:React.FC -> values', values);

  useEffect(() => {
    register(
      {
        name: 'form.email',
        validationTriggers: 'onBlur',
      },
      {
        name: 'form.password',
        startValidationAfterSubmitting: false,
      },
      // { name: 'date', validationSchema: yup.date().required() },
    );
  }, [register]);

  const onSubmit = (data: NestedFiedlsValues) => {
    console.log('TCL: onSubmit -> data', data);
  };

  // console.log(errors?.abb?.[0]?.);

  return (
    <Box display="flex" flexDirection="column">
      <StyledTextField
        label="email"
        {...bind('form.email')}
        error={!!errors?.form?.email?.message}
        helperText={errors?.form?.email?.message}
      />
      <StyledTextField
        label="password"
        {...bind('form.password')}
        error={!!errors?.form?.password?.message}
        helperText={errors?.form?.password?.message}
      />
      <Button onClick={handleSubmit(onSubmit)}>
        {formState.isSubmitting ? '...' : 'submit'}
      </Button>

      {/* <Button
        onClick={() => {
          setValue('form.email', '1231');
        }}
      >
        click
      </Button> */}
    </Box>
  );
};

export default IndexPage;
