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
  const userConfig = useMemo<Options>(
    () => ({
      mobile: {
        initialValue: mobile,
        validator: async (value: string) => {
          await delay(3000);
          if (!value) {
            return '请输入手机号';
          }
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
  } = useForm(userConfig);

  async function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const isPassed = await validateFeilds();
    console.log(`表单校验是否通过：${isPassed}`);

    if (isPassed) {
      const values = getFeildsValue();
      console.log('表单值：', values);
    }
  }

  return (
    <form>
      <div>
        <TextField
          label="手机号"
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
          label="密码"
          {...useFeildProps('password')}
          error={!!getFeildError('password')}
          helperText={getFeildError('password')}
        />

        {getFeildValidateStatus('password') === 'validating' && (
          <CircularProgress size={30} />
        )}
      </div>

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        提交
      </Button>
    </form>
  );
}

export default Form;
