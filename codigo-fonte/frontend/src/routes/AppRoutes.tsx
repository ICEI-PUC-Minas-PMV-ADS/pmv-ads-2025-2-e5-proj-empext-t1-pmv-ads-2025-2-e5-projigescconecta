import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './../pages/Login';
import ResetPassword from './../pages/ResetPassword';
import ForgotPassword from './../pages/ForgotPassword';
import Home from './../pages/Home';
import PrivateRoute from './privateRoute';
import Course from './../pages/Course';
import Team from '@/pages/Team';
import Osc from './../pages/Osc';
import Beneficiary from '@/pages/Beneficiary';
import { Box } from '@mui/material';
import SideMenu from '@/components/SideMenu';
import BusinessCase from '@/pages/BusinessCase';
import OriginBusinessCase from '@/pages/OriginBusinessCase';
import Empresa from '@/pages/Empresa';
import Donation from '@/pages/Donation';
import User from '@/pages/User';

const routeConfig = [
  { path: '/login', element: <Login />, isPrivate: false },
  { path: '/forgot-password', element: <ForgotPassword />, isPrivate: false },
  { path: '/reset-password', element: <ResetPassword />, isPrivate: false },
  { path: '/home', element: <Home />, isPrivate: true },
  { path: '/course', element: <Course />, isPrivate: true },
  { path: '/team', element: <Team />, isPrivate: true },
  { path: '/osc', element: <Osc />, isPrivate: true },
  { path: '/beneficiary', element: <Beneficiary />, isPrivate: true },
  { path: '/business-case', element: <BusinessCase />, isPrivate: true },
  { path: '/business-case/:businessCaseId/origin-business-case', element: <OriginBusinessCase />, isPrivate: true },
  { path: '/empresa', element: <Empresa />, isPrivate: true },
  { path: '/donation', element: <Donation />, isPrivate: true },
  { path: '/user', element: <User />, isPrivate: true },
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
                <SideMenu /> {/* Provisório para testes */}

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
