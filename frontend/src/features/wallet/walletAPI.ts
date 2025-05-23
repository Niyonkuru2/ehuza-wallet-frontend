import { SERVER_URL } from '../../services/api';
import { ChartData,TransactionHistoryResponse, WalletActionResponse, WalletBalanceResponse, WalletTransactionPayload } from '../../types/wallet';

// Get wallet balance api call
export const getWalletBalance = async (): Promise<WalletBalanceResponse> => {
  const response = await SERVER_URL.get('/wallet');
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
  const response = await SERVER_URL.get('/transactions', {
    params: { page, limit }
  });
  return response.data;
};

// Get monthly transaction data for the user
export const getMonthlyTransaction = async (): Promise<ChartData[]> => {
  const response = await SERVER_URL.get('/transactions/comparision');
  return response.data.monthlyTransactions; // already in ChartData[] format
};

