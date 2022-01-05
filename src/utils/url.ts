import { URLSearchParamsInit, useSearchParams } from "react-router-dom"
import { useMemo } from "react"
import { cleanObject } from "utils"
/**
  *返回页面url中，指定键的参数值
  */
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams, setSearchParam] = useSearchParams()
  return [
    useMemo(() => keys.reduce((prev, key) => {
      return { ...prev, [key]: searchParams.get(key) || '' }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, {} as { [key in K]: string }), [searchParams]),
    (params: Partial<{ [key in K]: unknown }>) => {
      const o = cleanObject({ ...Object.fromEntries(searchParams), ...params }) as URLSearchParamsInit
      return setSearchParam(o)
    }
  ] as const
} 