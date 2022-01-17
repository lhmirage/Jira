import { User } from "../types/User";
import { useQuery } from "react-query";
import { useHttp } from './http'

export const useUsers = (param?: Partial<User>) => {
  const client = useHttp()

  return useQuery<User[]>(['users', param], () => client('users', { data: param }))
}
