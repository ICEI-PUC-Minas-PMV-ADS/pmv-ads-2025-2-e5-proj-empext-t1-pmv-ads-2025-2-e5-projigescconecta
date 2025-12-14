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
import Company from '@/pages/Company';
import Donation from '@/pages/Donation';
import User from '@/pages/User';
import Person from '@/pages/Person';
import PersonTeam from '@/pages/PersonTeam';
import ProjectType from '@/pages/ProjectType';
import ProjectTheme from '@/pages/ProjectTheme';
import ProjectProgram from '@/pages/ProjectProgram';
import PersonOsc from '@/pages/PersonOsc';
import Report from '@/pages/Report';
import ProjectDocument from '@/pages/ProjectDocument';

const routeConfig = [
  { path: '/login', element: <Login />, isPrivate: false },
  { path: '/forgot-password', element: <ForgotPassword />, isPrivate: false },
  { path: '/reset-password', element: <ResetPassword />, isPrivate: false },
  { path: '/home', element: <Home />, isPrivate: true },
  { path: '/course', element: <Course />, isPrivate: true },
  { path: '/team', element: <Team />, isPrivate: true },
  { path: '/team/:teamId/persons-team', element: <PersonTeam />, isPrivate: true },
  { path: '/osc', element: <Osc />, isPrivate: true },
  { path: '/beneficiary', element: <Beneficiary />, isPrivate: true },
  { path: '/business-case', element: <BusinessCase />, isPrivate: true },
  {
    path: '/business-case/:businessCaseId/origin-business-case',
    element: <OriginBusinessCase />,
    isPrivate: true,
  },
  { path: '/osc/:oscId/person-osc', element: <PersonOsc />, isPrivate: true },
  { path: '/company', element: <Company />, isPrivate: true },
  { path: '/donation', element: <Donation />, isPrivate: true },
  { path: '/user', element: <User />, isPrivate: true },
  { path: '/person', element: <Person />, isPrivate: true },
  { path: '/project-type', element: <ProjectType />, isPrivate: true },
  { path: '/project-theme', element: <ProjectTheme />, isPrivate: true },
  { path: '/project-program', element: <ProjectProgram />, isPrivate: true },
  {
    path: '/project-program/:projectProgramId/documents',
    element: <ProjectDocument />,
    isPrivate: true,
  },
  { path: '/report', element: <Report />, isPrivate: true },
];

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

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

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
