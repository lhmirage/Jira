import React, { useCallback } from "react";
import { useDocumentTitle } from "utils";
import { useKanbans, useReorderKanban } from "utils/kanban"
import { useKanbanSearchParams, useKanbansQueryKey, useProjectInUrl, useTasksQueryKey, useTasksSearchParams } from "screens/Kanban/util"
import { KanbanColumn } from "screens/Kanban/kanban-column"
import styled from "@emotion/styled";
import { SearchPanel } from "screens/Kanban/search-panel";
import { ScreenContainer } from "components/lib";
import { useReorderTask, useTasks } from "utils/task";
import { Spin } from "antd";
import { CreateKanban } from "screens/Kanban/create-kanban"
import { TaskModal } from "screens/Kanban/task-modal"
import { DragDropContext, DropResult } from "react-beautiful-dnd"
import { Drop, DropChild, Drag } from "components/drag-and-drop"

export const KanbanScreen = () => {
  useDocumentTitle('看板列表')

  const { data: currentProject } = useProjectInUrl()
  const { data: kanbans, isLoading: kanbanIsLoading } = useKanbans(useKanbanSearchParams())
  const { isLoading: taskIsLoading } = useTasks(useTasksSearchParams())
  const isLoading = taskIsLoading || kanbanIsLoading

  const onDragEnd = useDragEnd()

  return <DragDropContext onDragEnd={onDragEnd}>
    <ScreenContainer>
      <h1>{currentProject?.name}看板</h1>
      <SearchPanel />
      {isLoading ? <Spin size={"large"} /> : (
        <ColumnContainer>
          <Drop type={'COLUMN'} direction={"horizontal"} droppableId={'kanban'}>
            <DropChild style={{ display: 'flex' }}>
              {
                kanbans?.map((kanban, index) => (
                  <Drag key={kanban.id} draggableId={'kanban' + kanban.id} index={index}>
                    <KanbanColumn kanban={kanban} key={kanban.id} />
                  </Drag>
                ))
              }
            </DropChild>
          </Drop>
          <CreateKanban />
        </ColumnContainer>
      )}
      <TaskModal />
    </ScreenContainer>
  </DragDropContext>
}


export const useDragEnd = () => {
  const { data: kanbans } = useKanbans(useKanbanSearchParams())
  const { mutate: reorderKanban } = useReorderKanban(useKanbansQueryKey())
  const { mutate: reorderTask } = useReorderTask(useTasksQueryKey())
  const { data: allTasks = [] } = useTasks(useTasksSearchParams())
  return useCallback(({ source, destination, type }: DropResult) => {
    if (!destination) {
      return
    }
    // 看板排序
    if (type === 'COLUMN') {
      const fromId = kanbans?.[source.index].id
      const toId = kanbans?.[destination.index].id
      if (!fromId || !toId || fromId === toId) {
        return
      }
      const type = destination.index > source.index ? 'after' : 'before'
      reorderKanban({ fromId, referenceId: toId, type })
    }
    if (type === 'ROW') {
      const fromKanbanId = +source.droppableId
      const toKanbanId = +destination.droppableId
      if (fromKanbanId === toKanbanId) {
        return
      }
      const fromTask = allTasks.filter(task => task.kanbanId === fromKanbanId)[source.index]
      const toTask = allTasks.filter(task => task.kanbanId === toKanbanId)[destination.index]
      if (fromTask?.id === toTask?.id) {
        return
      }
      reorderTask({
        fromId: fromTask?.id,
        referenceId: toTask?.id,
        fromKanbanId,
        toKanbanId,
        type: fromKanbanId === toKanbanId && destination.index > source.index ? 'after' : 'before'
      })
    }
  }, [kanbans, reorderKanban, allTasks, reorderTask])
}

export const ColumnContainer = styled('div')`
  display: flex; 
  overflow-x: scroll;
  flex: 1;
`