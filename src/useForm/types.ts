/**
 * 校验用户输入
 * 可以是同步或异步函数
 * 函数返回值会被保存在 [FormState.error] 中，并作为表单的错误提示
 */
export type Validator = (
  value: string,
) => Promise<string | undefined | void> | string | undefined | void;

/**
 * 表单的验证状态
 */
export type ValidateStatus = 'none' | 'validating' | 'success' | 'error';

/**
 * 用户输入的选项配置
 */
export interface Options {
  [id: string]: {
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
  };
}

/**
 * 将用户输入的选项配置转换后的更严格的类型
 */
export interface StrictOptions {
  [id: string]: {
    // 如何从事件处理器中取到值
    getValueFromEvent: (e: any) => any;
    // 收集值的时机
    collectValueTrigger: string;
    // 校验用户输入
    validator: Validator;
    // 在哪些事件中触发表单域校验
    validateTriggers: string[];
  };
}

/**
 * 表单的状态
 * 这里保存的是会随用户输入而发生变化的状态
 */
export interface FormState {
  [id: string]: {
    // 表单域的输入值
    value: any;
    // 表单域的错误提示
    error: string;
    // 表单域的校验状态
    validateStatus: ValidateStatus;
  };
}

/**
 * 与表单域相关的所有事件处理器
 */
export interface Handlers {
  [key: string]: (value: any) => void;
}
