import { useState, useCallback, useReducer } from "react"
import { useMountedRef } from "utils"

interface State<D> {
  error: Error | null;
  data: D | null;
  stat: 'idle' | 'loading' | 'error' | 'success';
}

const defaultInitialState: State<null> = {
  stat: 'idle',
  data: null,
  error: null
}

const defaultConfig = {
  throwOnError: false
}

const useSafeDispatch = <T>(dispatch: (...args: T[]) => void) => {
  const mountedRef = useMountedRef()

  return useCallback((...args: T[]) => (mountedRef.current ? dispatch(...args) : void 0), [dispatch, mountedRef])

}

export const useAsync = <D>(initialState?: State<D>, initialConfig?: typeof defaultConfig) => {
  const config = { ...defaultConfig, ...initialConfig }
  const [state, dispatch] = useReducer((state: State<D>, action: Partial<State<D>>) => ({ ...state, ...action }), {
    ...defaultInitialState,
    ...initialState
  })

  const safeDispatch =  useSafeDispatch(dispatch)
  // useState直接传入函数的含义是：惰性初始化：所以，要用useState保存函数，不能直接传入函数
  // 使用useref的时候，因为改变的不是组件的状态，所以重新赋值current不会导致组件的更新，可以自己强制读取

  const [retry, setRetry] = useState(() => () => { })

  const setData = useCallback((data: D) => safeDispatch({
    data,
    stat: 'success',
    error: null
  }), [safeDispatch])

  const setError = useCallback((error: Error) => safeDispatch({
    error,
    stat: 'error',
    data: null
  }), [safeDispatch])

  // 用来触发异步请求
  const run = useCallback(
    (promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
      if (!promise || !promise.then) {
        throw new Error('请传入Promise类型数据')
      }
      setRetry(() => () => {
        if (runConfig?.retry) {
          run(runConfig?.retry(), runConfig)
        }
      })
      safeDispatch({ stat: 'loading' })
      return promise.then(data => {
        setData(data);
        return data
      }).catch(error => {
        // catch会消化异常，如果不主动抛出，外面是接收不到的
        setError(error)
        if (config.throwOnError) {
          return Promise.reject(error)
        }
        return error
      })
    },
    [config.throwOnError, setData, setError, safeDispatch])

  return {
    isIdle: state.stat === 'idle',
    isLoading: state.stat === 'loading',
    isError: state.stat === 'error',
    isSuccess: state.stat === 'success',
    run,
    setData,
    setError,
    // retry 被调用时重新跑一遍run，让state刷新一遍
    retry,
    ...state
  }
}