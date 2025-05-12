export interface WalletBalanceResponse {
  balance: number;
}

export interface WalletTransactionPayload {
  amount: number;
  description: string;
}

export interface WalletActionResponse {
  success: boolean;
  message: string;
  balance: number;
}
