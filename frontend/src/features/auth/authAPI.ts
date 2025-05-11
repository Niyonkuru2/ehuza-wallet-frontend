import { SERVER_URL } from '../../services/api';
import { RegisterPayload, LoginPayload, AuthResponse } from '../../types/auth';

//Register user api call
export const registerUser = async (data: RegisterPayload): Promise<AuthResponse> => {
  const response = await SERVER_URL.post('/user/register', data);
  return response.data;
};

//Login user api call
export const loginUser = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await SERVER_URL.post('user/login', data);
  return response.data;
};

//requestResetPassword api call
export const requestResetPassword = async ({ email }: { email: string }) => {
  const response = await SERVER_URL.post('/user/request-reset-password', { email });
  return response.data;
};

//resetPassword api call
export const resetPassword = async ({token,newPassword,}: {
  token?: string;
  newPassword: string;
}) => {
  const response = await SERVER_URL.post(`/user/reset-password/${token}`, {
    newPassword,
  });
  return response.data;
};

//Get UserProfile api call
export const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await SERVER_URL.get('/user/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.profileInfo;
};


