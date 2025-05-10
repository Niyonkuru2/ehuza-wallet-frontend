import { SERVER_URL } from '../../services/api';
import { RegisterPayload, LoginPayload, AuthResponse } from '../../types/auth';

export const registerUser = async (data: RegisterPayload): Promise<AuthResponse> => {
  const response = await SERVER_URL.post('/user/register', data);
  return response.data;
};

export const loginUser = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await SERVER_URL.post('user/login', data);
  return response.data;
};

export const requestResetPassword = async ({ email }: { email: string }) => {
  const response = await SERVER_URL.post('/request-password-reset', { email });
  return response.data;
};

