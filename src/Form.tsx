import React, { MouseEvent, useMemo } from 'react';
import { TextField, Button, CircularProgress } from '@material-ui/core';
import { useForm, Options } from './useForm';

const mobileRegExp = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;

/**
 * 延迟返回结果以模拟网络请求
 * @param time 延迟时间
 * @param data 延迟返回的值
 */
function delay(time: number, data?: string): Promise<string> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, time);
  });
}

interface FormProps {
  mobile: string;
}

function Form({ mobile }: FormProps) {
  const options = useMemo<Options>(
    () => ({
      mobile: {
        initialValue: mobile,
        validator: async (value: string) => {
          if (!value) {
            return '请输入手机号';
          }

          await delay(Math.random() * 2000);
          if (!mobileRegExp.test(value)) {
            return '手机号格式不正确';
          }
        },
        validateTriggers: ['onBlur', 'onChange'],
      },

      password: {
        validator: value => {
          if (!value) {
            return '请输入密码';
          }
        },
        validateTriggers: 'onChange',
      },
    }),
    [mobile],
  );

  const {
    useFeildProps,
    getFeildValidateStatus,
    getFeildError,
    validateFeilds,
    getFeildsValue,
  } = useForm(options);

  async function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const isFormValide = await validateFeilds();
    console.log(`表单校验是否通过：${isFormValide}`);

    if (isFormValide) {
      const values = getFeildsValue();
      console.log('表单值：', values);
    }
  }

  return (
    <form>
      <div>
        <TextField
          label="mobile"
          {...useFeildProps('mobile')}
          error={!!getFeildError('mobile')}
          helperText={getFeildError('mobile')}
        />

        {getFeildValidateStatus('mobile') === 'validating' && (
          <CircularProgress size={30} />
        )}
      </div>

      <div>
        <TextField
          label="password"
          {...useFeildProps('password')}
          error={!!getFeildError('password')}
          helperText={getFeildError('password')}
        />

        {getFeildValidateStatus('password') === 'validating' && (
          <CircularProgress size={30} />
        )}
      </div>

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        submit
      </Button>
    </form>
  );
}

export default Form;
