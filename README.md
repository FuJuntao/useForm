# useForm

这是一个使用 React Hooks 实现，用于简化表单状态管理和表单校验的库。

## [示例](https://fujuntao.github.io/useForm)

声明一个配置对象，该对象的 key 表示表单域的 ID，对应的 value 则是表单域的配置。

```typescript
const options: Options = {
  mobile: {
    initialValue: '123456',
    validator: async (value: string) => {
      if (!value) {
        return 'Please enter your phone number';
      }

      if (!mobileRegExp.test(value)) {
        return 'Please enter your phone number correctly';
      }
    },
    validateTriggers: 'onBlur',
  },

  password: {
    validator: value => {
      if (!value) {
        return 'Please enter your password';
      }
    },
    validateTriggers: ['onBlur', 'onChange'],
  },
};
```

将配置对象作为参数传递给 `useForm` 方法，以获取相应的方法。
使用 ID 作为参数，调用这些方法，获取对应表单域的状态。

```typescript
function Form() {
  const {
    useFeildProps,
    getFeildError,
    validateFeilds,
    getFeildsValue,
  } = useForm(options);

  async function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    // validate all feilds' value
    const isFormValide = await validateFeilds();

    if (isFormValide) {
      const values = getFeildsValue();
      console.log('Form values: ', values);
    }
  }

  return (
    <form>
      <div>
        <label>
          mobile: <input {...useFeildProps('mobile')} />
        </label>
        {getFeildError('mobile') && <p>{getFeildError('mobile')}</p>}
      </div>

      <div>
        <label>
          password: <input {...useFeildProps('password')} />
        </label>
        {getFeildError('password') && <p>{getFeildError('password')}</p>}
      </div>

      <button onClick={handleSubmit}>submit</button>
    </form>
  );
}
```

## API

### `useForm(options)`

传入配置文件并执行，会返回用于获取相应表单域状态的函数。

### `Options`

```typescript
interface Options {
  [id: string]: Option;
}
```

Options 是定义的表单配置。该配置对象的 `key` 表示表单域的 ID，`value` 则对应其配置。

> 应保证表单域的 ID 不会重复，以免后面声明的配置覆盖了前面同名表单域的配置。

### `Option`

```typescript
interface Option {
  initialValue?: any;
  getValueFromEvent?: (e: any) => any;
  collectValueTrigger?: string;
  validator?: (
    value: any,
  ) => Promise<string | undefined | void> | string | undefined | void;
  validateTriggers?: string | string[];
}
```

Option 是单个表单域的配置，包含初始值、校验函数、触发校验的时机、收集值的时机等。

下面是配置项的详细说明

#### `initialValue`

类型： `any`

表单域的初始值

#### `getValueFromEvent`

类型： `(e: any) => any`

表明如何在 `collectValueTrigger` 和 `validateTriggers` 声明的事件中取值。

#### `collectValueTrigger`

类型： `string`

默认值： `onChange`

表明在哪个事件中收集表单域的值。

#### `validateTriggers`

类型： `string | string[]`

默认值： `['onChange']`

表明在什么事件中触发表单域的校验。

#### `validator`

类型： `( value: any ) => Promise<string | undefined | void> | string | undefined | void`

默认值： `() => {}`

用于校验用户输入的值。可以是一个普通函数，也可以是一个 async 函数。尽管可以使用普通函数，但表单校验统一采用异步校验的形式。该回调函数的参数是从校验事件中收集到的值。如果有返回值，则应该返回一个字符串，表明当前校验结果。如果不返回任何值，则表明校验通过。

### 获取相应表单域状态的方法

调用 `useForm` 后，会返回一个对象，其中包含了以下方法：

#### `setFeildValue`

类型： `(id: string, value: any) => void`

设置单个表单域的值。

#### `getFeildValue`

类型： `(id: string): any`

获取单个表单域的值。

#### `getFeildsValue`

类型： `(ids?: string | string[]) => { [id: string]: any }`

获取单个或多个表单域的值。如果不传入任何参数，则默认获取所有表单域的值。

#### `setFeildError`

类型： `(id: string, error?: string) => void`

设置单个表单域的错误信息。

#### `getFeildError`

类型： `(id: string): string`

获取单个表单域的错误信息。

#### `getFeildsError`

类型： `(ids?: string | string[]) => { [id: string]: { error: string } } | null`

获取单个或多个表单域的错误信息。如果不传入任何参数，则默认获取所有表单域的错误信息。
如果获取到的表单域中，都没有错误信息，则返回 `null`。

#### `getFeildValidateStatus`

类型： `(id: string): 'none' | 'validating' | 'success' | 'error'`

获取表单域当前的校验状态。

- `none` 从未进行过校验。
- `validating` 正在校验中。可以根据该状态，显示相应的用户提示。
- `success` 校验通过。
- `error` 校验未通过。

#### `validateFeilds`

类型： `(ids?: string | string[]) => Promise<boolean>`

校验单个或多个表单域。如果不传入任何参数，则默认校验所有表单域。
如果所有指定的表单域的校验都通过了，则返回 true；否则，返回 false。

#### `useFeildProps`

类型： `(id: string) => { value: any; [handler: string]: Handlers }`

获取一个表单域的属性。包括该表单域的值和相应的事件处理器。
该方法主要是为了方便绑定相应的值和事件处理器。
典型用法是使用扩展运算符将调用该方法后返回的值，全部传递给相应的表单域组件。

> `useFeildProps` 是 [custom Hook](https://reactjs.org/docs/hooks-custom.html)，应遵循 Hooks 的[使用规范](https://reactjs.org/docs/hooks-rules.html)。
