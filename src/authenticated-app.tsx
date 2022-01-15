import styled from '@emotion/styled'
import { useAuth } from 'context/auth-context'
import React from 'react'
import { ProjectListScreen } from "./screens/project-list"
import { ButtonNoPadding, Row } from "components/lib"
import { Button, Dropdown, Menu } from 'antd'
import { Navigate, Route, Routes } from 'react-router'
import { BrowserRouter as Router } from 'react-router-dom'
import { ProjectScreen } from "./screens/project"
import { resetRoute } from 'utils'
import { ProjectModal } from 'screens/project-list/project-modal'
import { ProjectPopover } from "components/project-popover"
import { ReactComponent as SoftwareLogo } from "assets/software-logo.svg"

// 一般来说，一维布局用flex，二维布局用grid
// flex从内容出发：先有内容（数量不固定），均匀分布容器中，由内容自己的大小决定占据的空间
// grid从布局出发：先规划网格（数量一般比较固定），然后再把元素往里面填充

export const AuthenticatedApp = () => {

  return <Container>
    <Router>
      <PageHeader />
      <Main>
        <Routes>
          <Route path={'*'} element={<Navigate to={'/projects'} />}></Route>
          <Route path={'/projects'} element={<ProjectListScreen />}></Route>
          <Route path={'/projects/:projectId/*'} element={<ProjectScreen />}></Route>
        </Routes>
      </Main>
      <ProjectModal />
    </Router>
  </Container>
}

const PageHeader = () => {
  return <Header between={true}>
    <HeaderLeft gap={true}>
      <ButtonNoPadding type={'link'} onClick={resetRoute}>
        <SoftwareLogo width={'18rem'} color={'rgb(38, 132, 255)'} />
      </ButtonNoPadding>
      <ProjectPopover />
      <span>用户</span>
    </HeaderLeft>
    <HeaderRight>
      <User />
    </HeaderRight>
  </Header>
}

const User = () => {
  const { logout, user } = useAuth()
  return <Dropdown overlay={<Menu>
    <Menu.Item key={'logout'}>
      <Button type={'link'} onClick={logout}>登出</Button>
    </Menu.Item>
  </Menu>}>
    <Button type={'link'} onClick={e => e.preventDefault()}>
      Hi, {user?.name}
    </Button>
  </Dropdown>
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem 1fr;
  height: 100vh;
`
const Header = styled(Row)`
  padding: 3.2rem;
  box-shadow: 0 0 5px 0 rgba(0,0,0,0.1);
  z-index: 1;
`;
const HeaderLeft = styled(Row)``;
const HeaderRight = styled.div``;


// 遗留问题，会导致页面不均衡
const Main = styled.main`
  display: flex;
  overflow: hidden;
`