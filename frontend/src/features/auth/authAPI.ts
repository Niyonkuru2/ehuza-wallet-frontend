import { SERVER_URL } from '../../services/api';
import { RegisterPayload, LoginPayload, AuthResponse, UserProfile } from '../../types/auth';
import { TransactionHistoryResponse, WalletActionResponse, WalletBalanceResponse, WalletTransactionPayload } from '../../types/wallet';

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
export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await SERVER_URL.get('/user/profile');
  return response.data.profileInfo;
};

// Update user profile api call
export const updateUserProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
  const response = await SERVER_URL.put('/user/update', data);
  return response.data.updatedProfile;
};

// Get wallet balance apii call
export const getWalletBalance = async (): Promise<WalletBalanceResponse> => {
  const response = await SERVER_URL.get('/wallet/balance');
  return response.data;
};

// Deposit money api call
export const depositMoney = async (
  data: WalletTransactionPayload
): Promise<WalletActionResponse> => {
  const response = await SERVER_URL.post('/wallet/deposit', data);
  return response.data;
};

// Withdraw money api call
export const withdrawMoney = async (
  data: WalletTransactionPayload
): Promise<WalletActionResponse> => {
  const response = await SERVER_URL.post('/wallet/withdraw', data);
  return response.data;
};

// Get latest transactions with pagination
export const getTransactionHistory = async (page = 1, limit = 10): Promise<TransactionHistoryResponse> => {
  const response = await SERVER_URL.get('/wallet/transactions', {
    params: { page, limit }
  });
  return response.data;
};


