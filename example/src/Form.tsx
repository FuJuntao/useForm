import React, { MouseEvent, useMemo } from 'react';
import {
  TextField,
  Button,
  CircularProgress,
  makeStyles,
  Paper,
} from '@material-ui/core';
import { useForm } from '@fujuntao/use-form';

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

const useStyles = makeStyles({
  background: {
    height: '100vh',
    width: '100wh',
    background: 'linear-gradient(to right, #232526, #414345)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  paper: {
    minWidth: 500,
    padding: 50,
  },

  form: {
    display: 'grid',
    gap: '30px',
  },

  validatingWrap: {
    display: 'flex',
    alignItems: 'center',
    '& > span': {
      marginRight: 4,
    },
  },
});

function Validating() {
  const { validatingWrap } = useStyles();

  return (
    <div className={validatingWrap}>
      <span>校验中</span>
      <CircularProgress size={12} />
    </div>
  );
}

interface FormProps {
  mobile: string;
}

function Form({ mobile }: FormProps) {
  const config = useMemo(
    () => ({
      mobile: {
        initialValue: mobile,
        validator: async (value: string) => {
          if (!value) {
            return '请输入手机号';
          }

          await delay((Math.random() + 1) * 2000);
          if (!mobileRegExp.test(value)) {
            return '手机号格式不正确';
          }
        },
        validateTriggers: ['onBlur', 'onChange'],
      },

      password: {
        validator: (value: any) => {
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
    useFieldProps,
    getFieldValidateStatus,
    getFieldError,
    validateFields,
    getFieldsValue,
  } = useForm(config);

  async function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const isFormValide = await validateFields();
    console.log(`表单校验是否通过：${isFormValide}`);

    if (isFormValide) {
      const values = getFieldsValue();
      console.log('表单值：', values);
    }
  }

  const styles = useStyles();

  return (
    <div className={styles.background}>
      <Paper className={styles.paper}>
        <form className={styles.form}>
          <TextField
            label="mobile"
            {...useFieldProps('mobile')}
            error={!!getFieldError('mobile')}
            FormHelperTextProps={{ component: 'div' }}
            helperText={
              getFieldValidateStatus('mobile') === 'validating' ? (
                <Validating />
              ) : (
                getFieldError('mobile')
              )
            }
            variant="outlined"
            fullWidth
          />

          <TextField
            label="password"
            {...useFieldProps('password')}
            error={!!getFieldError('password')}
            helperText={getFieldError('password')}
            variant="outlined"
            fullWidth
          />

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
          >
            submit
          </Button>
        </form>
      </Paper>
    </div>
  );
}

export default Form;
