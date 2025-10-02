import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './../pages/Login';
import ResetPassword from './../pages/ResetPassword';
import ForgotPassword from './../pages/ForgotPassword';
import Home from './../pages/Home';
import PrivateRoute from './privateRoute';
import Course from './../pages/Course';
import Team from '@/pages/Team';
import { Box } from '@mui/material';
import SideMenu from '@/components/SideMenu';

const routeConfig = [
  { path: '/login', element: <Login />, isPrivate: false },
  { path: '/forgot-password', element: <ForgotPassword />, isPrivate: false },
  { path: '/reset-password', element: <ResetPassword />, isPrivate: false },
  { path: '/home', element: <Home />, isPrivate: true },
  { path: '/course', element: <Course />, isPrivate: true },
  { path: '/team', element: <Team />, isPrivate: true },
];

export default function AppRoutes() {
  return (
    <Routes>
      {/* Redirect para login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rotas mapeadas */}
      {routeConfig.map(({ path, element, isPrivate }) => (
        <Route
          key={path}
          path={path}
          element={
            isPrivate ? (
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <SideMenu />

                <PrivateRoute>{element}</PrivateRoute>
              </Box>
            ) : (
              element
            )
          }
        />
      ))}

      {/* Fallback para rotas não encontradas */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
