import { AuthApi, Configuration, LoginResponse } from '../api';
import { jwtDecode } from 'jwt-decode';
import { AxiosResponse } from 'axios';
import { BASE_PATH } from '@/api/base';

interface JwtPayload {
  exp: number;
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
  const timeout = (expiresInSeconds - 60) * 1000; // renova 1 minuto antes de expirar
  setTimeout(async () => {
    const success = await refreshAccessToken();
    if (success) {
      const newLogin = JSON.parse(localStorage.getItem('loginResponse')!);
      scheduleTokenRefresh(parseInt(newLogin.expiresIn)); // agenda próxima renovação
    } else {
      console.log('Refresh token expirou. Usuário precisa logar novamente.');
      localStorage.removeItem('loginResponse');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login'; // força logout
    }
  }, timeout);
};


// Função para tentar renovar o access token usando o refresh token
export const refreshAccessToken = async (): Promise<boolean> => {
  const loginResponseStr = localStorage.getItem('loginResponse');
  if (!loginResponseStr) return false;

  const loginResponse: LoginResponse = JSON.parse(loginResponseStr);

  try {
    // Recebe o retorno do Axios com o tipo correto
    const response: AxiosResponse<LoginResponse> = await apiInstance.refreshToken(
      loginResponse
    );

    console.log('Resposta do refresh token:', response);

    if (response.status === 200 && response.data) {
      const data = response.data;
      // Atualiza os dados no localStorage
      localStorage.setItem(
        'loginResponse',
        JSON.stringify({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresIn: data.expiresIn,
        })
      );
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
};

export const apiConfig = new Configuration({
  basePath: BASE_PATH,
  accessToken: async () => {
    const loginResponseStr = localStorage.getItem('loginResponse');
    if (!loginResponseStr) return '';
    const loginResponse = JSON.parse(loginResponseStr);
    return loginResponse.accessToken;
  },
});
