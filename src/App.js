import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import List from './pages/List';
import CreateFlowChart from './pages/FlowChart/CreateFlowChart';
import ViewFlowChart from './pages/FlowChart/ViewFlowChart';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/list" element={<List />} />
        <Route path="/flowchart/create" element={<CreateFlowChart />} />
        <Route path="/flowchart/:id" element={<ViewFlowChart />} />
      </Routes>
    </Router>
  );
}

export default App;
