import React from "react";
import { useDocumentTitle } from "utils";
import { useKanbans } from "utils/kanban"
import { useKanbanSearchParams, useProjectInUrl, useTasksSearchParams } from "screens/Kanban/util"
import { KanbanColumn } from "screens/Kanban/kanban-column"
import styled from "@emotion/styled";
import { SearchPanel } from "screens/Kanban/search-panel";
import { ScreenContainer } from "components/lib";
import { useTasks } from "utils/task";
import { Spin } from "antd";
import { CreateKanban } from "screens/Kanban/create-kanban"
import { TaskModal } from "screens/Kanban/task-modal"

export const KanbanScreen = () => {
  useDocumentTitle('看板列表')

  const { data: currentProject } = useProjectInUrl()
  const { data: kanbans, isLoading: kanbanIsLoading } = useKanbans(useKanbanSearchParams())
  const { isLoading: taskIsLoading } = useTasks(useTasksSearchParams())
  const isLoading = taskIsLoading || kanbanIsLoading

  return <ScreenContainer>
    <h1>{currentProject?.name}看板</h1>
    <SearchPanel />
    {isLoading ? <Spin size={"large"} /> : <ColumnContainer>
      {
        kanbans?.map(kanban => <KanbanColumn kanban={kanban} key={kanban.id} />)
      }
      <CreateKanban />
    </ColumnContainer>
    }
    <TaskModal />
  </ScreenContainer>
}

export const ColumnContainer = styled.div`
  display: flex; 
  overflow-x: scroll;
  flex: 1;
`