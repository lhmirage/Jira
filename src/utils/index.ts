/* 常用数据操作 */

import { useEffect, useState } from "react";

/**
 * 判断是否是假值
 * @param val
 * @returns
 */
 export const isFalsy = (val: unknown) => (val === 0 ? false : !val);
 /**
  * 清楚掉对象中值为空的项
  * @param obj
  * @returns
  */
 export const cleanObject = (obj: object) => {
   const result = { ...obj };
   Object.keys(obj).forEach(key => {
     // @ts-ignore
     const value = obj[key];
     if (isFalsy(value)) {
       // @ts-ignore
       delete result[key];
     }
   });
   return result;
 };

 export const useMount = (callback: () => void) => {
   useEffect(() => {
     callback();
   }, [])
 }

 export const useDebounce = <V>(value: V, delay?: number) => {
   const [debouncedValue, setDebouncedValue] = useState(value)

   useEffect(() => {
     const timeout = setTimeout(() => setDebouncedValue(value), delay)
     return () => clearTimeout(timeout)
   }, [value, delay])

   return debouncedValue
 }

 export const useArray = <T>(initialArray: T[]) => {
   const [value, setValue] = useState(initialArray)
   return {
     value,
     setValue,
     add: (item: T) => setValue([...value, item]),
     clear: () => setValue([]),
     removeIndex: (index: number) => {
       const copy = [...value]
       copy.splice(index, 1)
       setValue(copy)
     }
   }
 }