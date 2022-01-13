import { List } from './list';
import { SearchPanel } from './search-panel';
import React from 'react';
import { useDebounce, useDocumentTitle } from 'utils';
import { useProjects } from 'utils/project'
import { useUsers } from 'utils/user'
import styled from '@emotion/styled';
import { useProjectModal, useProjectsSearchParams } from './util'
import { ButtonNoPadding, ErrorBox, Row } from 'components/lib';

// 基本类型，可以放到依赖里；组件状态，可以放到依赖里；非组件状态的对象，绝不可以放到依赖里

export const ProjectListScreen = () => {
  useDocumentTitle('项目列表', false)

  const {open} = useProjectModal()

  const [param, setParam] = useProjectsSearchParams()
  const { isLoading, error, data: list } = useProjects(useDebounce(param, 200))
  const { data: users } = useUsers()

  return (
    <Container>
      <Row between={true}>
        <h1>项目列表</h1>
        <ButtonNoPadding onClick={open} type={"link"}>创建项目</ButtonNoPadding>
      </Row>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      <ErrorBox error={error} />
      <List loading={isLoading} users={users || []} dataSource={list || []} />
    </Container>
  );
};

const Container = styled.div`
  padding: 3.2rem;
`
