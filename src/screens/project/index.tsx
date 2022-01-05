import React from "react";
import { Link } from "react-router-dom";
import { Navigate, Route, Routes } from 'react-router'
import { KanbanScreen } from 'screens/Kanban'
import { EpicScreen } from 'screens/epic'

export const ProjectScreen = () => {
  return <div>
    <Link to={'kanban'}>看板</Link>
    <Link to={'epic'}>任务组</Link>
    <Routes>
      <Route path={'/kanban'} element={<KanbanScreen />}></Route>
      <Route path={'/epic'} element={<EpicScreen />}></Route>
      <Route path={'*'} element={<Navigate to={window.location.pathname + '/kanban'} />}></Route>
    </Routes>
  </div>
}