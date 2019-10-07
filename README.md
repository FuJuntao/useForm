# useForm

A custom hook to help validate from fields and manage form state.

## Features

- Using `useReducer` with `Context` to store form state

- Easy to set and query any form field's state

- Validate multiple form fields automatically or manually

- Async validation

## Example

[Edit Online](https://codesandbox.io/s/useform-example-y90m3)

```javascript
const config = {
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

function Form() {
  const {
    useFieldProps,
    getFieldError,
    validateFields,
    getFieldsValue,
  } = useForm(config);

  async function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    // validate all fields' values
    const isFormValide = await validateFields();

    if (isFormValide) {
      const values = getFieldsValue();
      console.log('Form values: ', values);
    }
  }

  return (
    <form>
      <div>
        <label>
          mobile: <input {...useFieldProps('mobile')} />
        </label>
        {getFieldError('mobile') && <p>{getFieldError('mobile')}</p>}
      </div>

      <div>
        <label>
          password: <input {...useFieldProps('password')} />
        </label>
        {getFieldError('password') && <p>{getFieldError('password')}</p>}
      </div>

      <button onClick={handleSubmit}>submit</button>
    </form>
  );
}
```

## API

### Config

```javascript
const config = {
  // Every key of the `config` object is the unique identifier for one form field
  formFieldId: {
    // Initial value of this field
    initialValue: '',

    // `getValueFromEvent` indicates how to retrieve value from triggers
    //  which are defined below in `collectValueTrigger` and `validateTriggers`
    getValueFromEvent: e => {
      if (!e || !e.target) {
        return e;
      }
      const { target } = e;
      return target.type === 'checkbox' ? target.checked : target.value;
    },

    // `collectValueTrigger` is a user defined event
    // indicates in which event should the value be collected and stored in the form state
    collectValueTrigger: 'onChange',

    // `validator` is a function takes this form field's value as argument
    // and returns a string synchronously or asynchronously as the result of the validation
    // if the result is an empty string or not a string, then the validation is considered to be passed
    // the validation result will be stored in the form state
    // this function will be called when events defined below in `validateTriggers` are triggered
    validator: value => '',

    // `validateTriggers` is a string or an array contains user defined events
    //  indicates in which event or events should call validator function
    validateTriggers: ['onChange'],
  },
};
```

### Functions

When `useForm` is called with `config` as argument, it will return an object contains functions ( listed down below ) that can be used to set and query form state, generate event handlers, perform validation.

#### setFieldValue

type: `(id: FormFieldId, value: any) => void`

Set value of the given form field.

#### getFieldValue

type: `(id: FormFieldId) => any`

Returns the value of the given form field.

#### getFieldsValue

type: `(ids?: FormFieldId | FormFieldId[]) => { [id: FormFieldId]: any }`

Returns an object contains one or multiple fields' values.
if not provide with any argument, then all fields' values will be returned.

#### setFieldError

type: `(id: FormFieldId, error?: string) => void`

Set error message of the given field.

#### getFieldError

type: `(id: FormFieldId) => string`

Returns the error message of the given field.

#### getFieldsError

type: `(ids?: FormFieldId | FormFieldId[]) => { [id: FormFieldId]: { error: string } } | null`

Returns an object contains one or multiple fields' error messages.
if not provide with any argument, then all fields' error messages will be returned.
if there are no error messages in any of the given fields, then `null` will be returned.

#### setFieldValidateStatus

type: `(id: FormFieldId, status: 'none' | 'validating' | 'success' | 'error') => void`

Set validation status of the given field.

Validation status could only be one of the following values:

- `none` This field's value has never been validated.
- `validating` This field's value is being validated.
- `success` This field's value has been validated, and the validation is passed.
- `error` This field's value has been validated, and the validation is not passed, an error message should have been returned.

#### getFieldValidateStatus

type: `(id: FormFieldId) => 'none' | 'validating' | 'success' | 'error'`

Returns the validation status of the given field.

#### validateFields

type: `(ids?: FormFieldId | FormFieldId[]) => Promise<boolean>`

Validate one or multiple fields' values asynchronously.
If not provide with any argument, then all fields will be validated.
If all fields' validation are passed, return `true`, otherwise return `false`.

#### useFieldProps

type: `(id: FormFieldId) => { value: any; [handler: string]: (e: any) => void }`

A custom hook returns a given field's value and all its event handlers.
The typical use of this function is by using speard operator to pass field's value and its event handlers to a form element all at once.

```js
// ...
const { useFieldProps } = useForm(config);
return <input {...useFieldProps('password')} />;
```

## License

MIT
