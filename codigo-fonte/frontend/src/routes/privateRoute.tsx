import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenValid, refreshAccessToken } from '../services/auth';
import { scheduleTokenRefresh } from '../services/auth';

import type { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [authorized, setAuthorized] = useState<boolean | null>(null); // null = carregando

  useEffect(() => {
  const checkAuth = async () => {
    const accessToken = localStorage.getItem('accessToken');

    if (isTokenValid(accessToken)) {
      const loginResponse = JSON.parse(localStorage.getItem('loginResponse')!);
      scheduleTokenRefresh(parseInt(loginResponse.expiresIn));
      setAuthorized(true);
    } else {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        const newLogin = JSON.parse(localStorage.getItem('loginResponse')!);
        scheduleTokenRefresh(parseInt(newLogin.expiresIn));
      }
      setAuthorized(refreshed);
    }
  };

  checkAuth();
}, []);


  if (authorized === null) {
    // Spinner ou tela de carregamento enquanto valida
    return <div>Carregando...</div>;
  }

  return authorized ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
