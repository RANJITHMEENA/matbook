import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Login from './pages/Login';
import List from './pages/List';
import CreateFlowChart from './pages/CreateFlowChart';
import ViewFlowChart from './pages/FlowChart/ViewFlowChart';
import './App.css';
import './config/firebase'; // Import Firebase configuration

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/list" 
          element={
            <PrivateRoute>
              <List />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/flowchart/create" 
          element={
            <PrivateRoute>
              <CreateFlowChart />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/flowchart/:id" 
          element={
            <PrivateRoute>
              <ViewFlowChart />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
