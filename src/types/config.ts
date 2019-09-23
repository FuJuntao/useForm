export type Validator = (
  value: any,
) => Promise<string | undefined | void> | string | undefined | void;

export type Config<FormFieldKey extends string> = {
  [key in FormFieldKey]: FormFieldConfig;
};

export interface FormFieldConfig {
  // 表单域的初始值
  initialValue?: any;
  // 如何从事件处理器中取到值
  getValueFromEvent?: (e: any) => any;
  // 收集值的时机
  collectValueTrigger?: string;
  // 校验用户输入
  validator?: Validator;
  // 在哪些事件中触发表单域校验
  validateTriggers?: string | string[];
}

export type StrictConfig<FormFieldKey extends string> = {
  [key in FormFieldKey]: StrictFormFieldConfig;
};

interface StrictFormFieldConfig {
  // 如何从事件处理器中取到值
  getValueFromEvent: (e: any) => any;
  // 收集值的时机
  collectValueTrigger: string;
  // 校验用户输入
  validator: Validator;
  // 在哪些事件中触发表单域校验
  validateTriggers: string[];
}
