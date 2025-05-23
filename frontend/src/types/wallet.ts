//walletBalance interface
export interface WalletBalanceResponse {
  balance: number;
}

//wallettransaction interface payload
export interface WalletTransactionPayload {
  amount: number;
  description: string;
}

//walletActionResponse Interface payload
export interface WalletActionResponse {
  success: boolean;
  message: string;
  balance: number;
}

//get wallet transaction interface payload 
export interface WalletTransaction {
  transactionId: string;
  amount: number;
  type: 'deposit' | 'withdraw';
  description: string;
  createdAt: string;
}

//transactionHistoryResponce Interface Payload
export interface TransactionHistoryResponse {
  success: boolean;
  transactions: WalletTransaction[];
  total: number;
  page: number;
  totalPages: number;
}
// chart data interface
export type ChartData = {
  month: string;
  deposit: number;
  withdraw: number;
};



