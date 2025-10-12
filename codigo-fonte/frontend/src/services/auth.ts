import { AuthApi, Configuration, LoginResponse } from '../api';
import { jwtDecode } from 'jwt-decode';
import { AxiosResponse } from 'axios';
import { BASE_PATH } from '@/api/base';

interface JwtPayload { exp: number; }

export function persistLoginResponse(data: LoginResponse, name?: string) {
  const payload = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresIn: data.expiresIn,
    ...(name ? { name } : {}),
    ...(data as any).name ? { name: (data as any).name } : {},
  };
  localStorage.setItem('loginResponse', JSON.stringify(payload));
  localStorage.setItem('accessToken', data.accessToken || '');
  localStorage.setItem('refreshToken', data.refreshToken || '');
}

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch {
    return false;
  }
};

export const scheduleTokenRefresh = (expiresInSeconds: number) => {
  const expires = Number(expiresInSeconds);
  const timeout = ((Number.isFinite(expires) && expires > 0 ? expires : 600) - 60) * 1000;
  setTimeout(async () => {
    const success = await refreshAccessToken();
    if (success) {
      const newLogin = JSON.parse(localStorage.getItem('loginResponse') || '{}');
      scheduleTokenRefresh(Number(newLogin.expiresIn || 600));
    } else {
      localStorage.removeItem('loginResponse');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
  }, Math.max(timeout, 15000));
};

export const refreshAccessToken = async (): Promise<boolean> => {
  const loginResponseStr = localStorage.getItem('loginResponse');
  if (!loginResponseStr) return false;

  const loginResponse: LoginResponse = JSON.parse(loginResponseStr);

  try {
    const response: AxiosResponse<LoginResponse> = await apiInstance.refreshToken(loginResponse);
    if (response.status === 200 && response.data) {
      persistLoginResponse(response.data);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const apiConfig = new Configuration({
  basePath: BASE_PATH,
  accessToken: async () => {
    const t = localStorage.getItem('accessToken');
    return t || '';
  },
});
