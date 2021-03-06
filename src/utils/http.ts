import * as qs from 'qs';
import { useCallback } from 'react';
import * as auth from '../auth-provider'
import { useAuth } from '../context/auth-context';

const apiUrl = process.env.REACT_APP_API_URL;

interface Config extends RequestInit {
  token?: string,
  data?: object
}

export const http = async (endpoint: string, { data, token, headers, ...customConfig }: Config = {}) => {
  const config = {
    method: 'GET',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': data ? 'application/json' : ''
    },
    ...customConfig
  }

  if (config.method.toUpperCase() === 'GET') {
    endpoint += `?${qs.stringify(data)}`
  } else {
    config.body = JSON.stringify(data || {})
  }

  return window.fetch(`${apiUrl}/${endpoint}`, config)
    .then(async response => {
      if (response.status === 401) {
        await auth.logout()
        window.location.reload()
        return Promise.reject({ message: '请重新登录' })
      }
      const data = await response.json()
      if (response.ok) {
        return data
      } else {
        return Promise.reject(data)
      }
    })
}

export const useHttp = () => {
  const { user } = useAuth()

  // utility type 的用法:用泛型给它传入一个其他类型，然后utility type对这个类型进行某种操作
  return useCallback((...[endpoint, config]: Parameters<typeof http>) => http(endpoint, { ...config, token: user?.token }), [user?.token])
}

  // TS Utility Types
  // 类型别名（定义联合类型常用）在很多情况下可以和interface互换
  // interface 也不能实现Utility Type
  // ts中的typeof是静态运行的,js中的typeof是在runtime时运行的
  // Partial 和 Omit（Pick和Exclude） 用法