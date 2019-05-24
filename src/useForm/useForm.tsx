import { useCallback, useMemo } from 'react';
import { Subject, Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Handlers, Options, ValidateStatus } from './types';
import useFormState from './useFormState';

function useForm(options: Options = {}) {
  const { formState, strictOptions, dispatch } = useFormState(options);

  /**
   * 遍历用户输入的配置，获取所有的 ID
   */
  const _allIds: string[] = useMemo(() => Object.keys(options), [options]);

  /**
   * 把用户传入的 ids 转换成数组
   * @param ids 用户输入的 id，可以是字符串或字符串数组。如果不填写，则默认返回表单状态中所有的 ID
   */
  const _toList = useCallback(
    function toList(ids?: string | string[]): string[] {
      // 如果只是一个字符串，则转成数组
      if (typeof ids === 'string') {
        return [ids];
      }
      // 如果没有给任何值，则默认获取所有的 ID
      if (typeof ids === 'undefined') {
        return _allIds;
      }
      return ids;
    },
    [_allIds],
  );

  /**
   * 设置一个表单域的值
   * @param id
   * @param value
   */
  const setFeildValue = useCallback(
    function setFeildValue(id: string, value: any): void {
      dispatch({ type: 'SET_VALUE', id, value });
    },
    [dispatch],
  );

  /**
   * 设置一个表单域的错误信息
   * @param id
   * @param error
   */
  const setFeildError = useCallback(
    function setFeildError(id: string, error?: string | void): void {
      dispatch({ type: 'SET_ERROR', id, error: error ? error : '' });
    },
    [dispatch],
  );

  /**
   * 设置表单域的校验状态
   * @param id
   * @param status
   */
  const setFeildValidateStatus = useCallback(
    function setFeildValidateStatus(id: string, status: ValidateStatus) {
      dispatch({
        type: 'SET_VALIDATE_STATUS',
        id,
        validateStatus: status,
      });
    },
    [dispatch],
  );

  /**
   * 校验给定的值
   * @param id 表单域的 ID
   * @param eventSubject 用来获取被校验的值
   */
  const _subscribeToValidate = useCallback(
    function subscribeToValidate(id: string, eventSubject: Observable<any>) {
      eventSubject
        .pipe(
          switchMap(value => {
            const { validator } = strictOptions[id];
            // 设置校验状态为校验中
            setFeildValidateStatus(id, 'validating');
            // 先暂时重置表单的错误信息
            setFeildError(id, '');

            return from(Promise.resolve(validator(value)));
          }),
        )
        .subscribe(validateResult => {
          // 保存校验结果
          setFeildError(id, validateResult ? validateResult : '');
          // 根据校验结果设置校验状态
          setFeildValidateStatus(id, validateResult ? 'error' : 'success');
        });
    },
    [setFeildError, setFeildValidateStatus, strictOptions],
  );

  /**
   * 创建指定表单域的事件处理函数
   * @param id
   */
  const _createHandlers = useCallback(
    function createHandlers(id: string): Handlers {
      const {
        collectValueTrigger,
        getValueFromEvent,
        validateTriggers,
      } = strictOptions[id];
      const handlers: Handlers = {};

      // 遍历 [validateTriggers]，根据其事件名称，分别生成一个校验函数
      validateTriggers.forEach(item => {
        if (item && item !== collectValueTrigger) {
          const validateTriggerSubject = new Subject<any>();
          handlers[item] = e => {
            const value = getValueFromEvent(e);
            validateTriggerSubject.next(value);
          };
          // 注册校验
          _subscribeToValidate(id, validateTriggerSubject);
        }
      });

      const collectValueTriggerSubject = new Subject<any>();
      if (validateTriggers.includes(collectValueTrigger)) {
        // 如果 [validateTriggers] 中包含 [collectValueTrigger]
        // 则在该事件中也要校验用户输入的值
        handlers[collectValueTrigger] = e => {
          const value = getValueFromEvent(e);
          setFeildValue(id, value);
          collectValueTriggerSubject.next(value);
        };
        // 注册校验
        _subscribeToValidate(id, collectValueTriggerSubject);
      } else {
        // 如果不需要在该事件中校验用户输入的值，取消订阅相关事件
        collectValueTriggerSubject.unsubscribe();

        handlers[collectValueTrigger] = e => {
          const value = getValueFromEvent(e);
          setFeildValue(id, value);
        };
      }

      return handlers;
    },
    [setFeildValue, strictOptions, _subscribeToValidate],
  );

  /**
   * 获取一个表单域的值
   * @param id
   */
  const getFeildValue = useCallback(
    function getFeildValue(id: string): any {
      const { value } = formState[id];
      return value;
    },
    [formState],
  );

  /**
   * 获取指定表单域的值
   * 如果不传入任何参数，则获取所有表单域的值
   * 返回值格式如下：
   * ```javascript
   * {
   *   mobile: '1234567890',
   *   password: '987654321',
   *   imageList: ['img1','img2','img3'],
   * }
   * ```
   * @param ids
   */
  const getFeildsValue = useCallback(
    function getFeildsValue(ids?: string | string[]): { [id: string]: any } {
      const idList = _toList(ids);
      const values: { [id: string]: any } = {};

      idList.forEach(id => {
        values[id] = getFeildValue(id);
      });

      return values;
    },
    [getFeildValue, _toList],
  );

  /**
   * 获取一个表单域的错误信息
   * 如果有错误，返回错误提示文字
   * 如果没有错误，返回空字符串
   * @param id
   */
  const getFeildError = useCallback(
    function getFeildError(id: string): string {
      const { error } = formState[id];
      return error;
    },
    [formState],
  );

  /**
   * 获取指定表单域的错误信息
   * 如果不传入任何参数，则获取所有表单域的错误信息
   * 如果所有表单域校验都通过了，则返回 null
   * 如果有错误，返回格式如下：
   * ```javascript
   * {
   *   mobile: {
   *     error: '请输入手机号'
   *   },
   *   password: {
   *     error: '请输入密码'
   *   }
   * }
   * ```
   * @param ids
   */
  const getFeildsError = useCallback(
    function getFeildsError(ids?: string | string[]) {
      const idList = _toList(ids);

      const errors: { [id: string]: { error: string } } = {};
      let noErrors = true;

      idList.forEach(id => {
        const error = getFeildError(id);
        if (error) {
          noErrors = false;
        }
        errors[id] = { error };
      });

      return noErrors ? null : errors;
    },
    [getFeildError, _toList],
  );

  /**
   * 获取一个表单域的属性
   * 包括该表单域的值和相应的事件处理器
   * 调用该函数后的返回值，可以使用扩展运算符全部传给相应的表单组件
   * @param id
   */
  const useFeildProps = useCallback(
    function useFeildProps(
      id: string,
    ): { value: any; [handler: string]: Handlers } {
      const handlers = useMemo(() => _createHandlers(id), [id]);

      return { value: getFeildValue(id), ...handlers };
    },
    [_createHandlers, getFeildValue],
  );

  /**
   * 获取表单域的校验状态
   * @param id
   */
  const getFeildValidateStatus = useCallback(
    function getFeildValidateStatus(id: string): ValidateStatus {
      const { validateStatus } = formState[id];
      return validateStatus;
    },
    [formState],
  );

  /**
   * 校验一个指定表单域
   * 校验通过，返回 true；否则，返回 false
   * @param id
   */
  const _validateFeild = useCallback(
    async function validateFeild(id: string): Promise<boolean> {
      const { value, error, validateStatus } = formState[id];
      const { validator } = strictOptions[id];

      if (validateStatus !== 'none' && error) {
        return false;
      } else {
        // 设置校验状态为校验中
        setFeildValidateStatus(id, 'validating');
        // 先暂时重置表单的错误信息
        setFeildError(id, '');

        const error = await validator(value);

        // 保存校验结果
        setFeildError(id, error);
        // 根据校验结果设置校验状态
        setFeildValidateStatus(id, error ? 'error' : 'success');

        return error ? false : true;
      }
    },
    [formState, strictOptions, setFeildValidateStatus, setFeildError],
  );

  /**
   * 校验表单域
   * 如果不传入任何参数，则校验所有表单域
   * 表单域中只要有一个校验未通过，就返回 false
   * 如果所有都校验成功，就返回 true
   * @param ids
   */
  const validateFeilds = useCallback(
    async function validateFeilds(ids?: string | string[]): Promise<boolean> {
      const idList = _toList(ids);
      const resultList = await Promise.all(
        idList.map(id => _validateFeild(id)),
      );
      return resultList.some(passed => !passed) ? false : true;
    },
    [_toList, _validateFeild],
  );

  return {
    setFeildValue,
    setFeildError,
    useFeildProps,
    getFeildValue,
    getFeildsValue,
    getFeildError,
    getFeildsError,
    getFeildValidateStatus,
    validateFeilds,
  };
}

export default useForm;
