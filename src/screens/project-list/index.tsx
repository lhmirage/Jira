import { List } from './list';
import { SearchPanel } from './search-panel';
import React from 'react';
import { useDebounce, useDocumentTitle } from 'utils';
import { useProjects } from 'utils/project'
import { useUsers } from 'utils/user'
import styled from '@emotion/styled';
import { Typography } from 'antd';
import { useProjectsSearchParams } from './util'

// 基本类型，可以放到依赖里；组件状态，可以放到依赖里；非组件状态的对象，绝不可以放到依赖里

export const ProjectListScreen = () => {
  useDocumentTitle('项目列表', false)

  const [param, setParam] = useProjectsSearchParams()
  const { isLoading, error, data: list, retry} = useProjects(useDebounce(param, 200))
  const { data: users } = useUsers()

  return (
    <Container>
      <h1>项目列表</h1>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      {error ? <Typography.Text type={"danger"}>{error.message}</Typography.Text> : null}
      <List refresh={retry} loading={isLoading} users={users || []} dataSource={list || []} />
    </Container>
  );
};

const Container = styled.div`
  padding: 3.2rem;
`
