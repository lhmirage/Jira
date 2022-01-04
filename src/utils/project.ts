import { useEffect } from "react"
import { useAsync } from './use-async'
import {Project} from "../screens/project-list/list"
import { cleanObject } from './index';
import { useHttp } from './http'

export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp()
  const { run, ...result} = useAsync<Project[]>()

  useEffect(() => {
    run(client('projects', { data: cleanObject(param || {}) }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param])

  return result
}