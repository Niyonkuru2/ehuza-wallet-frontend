import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWalletBalance, getTransactionHistory } from '../features/wallet/walletAPI';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import { WalletBalanceResponse, Transaction } from '../types/wallet';

const DashboardCards: React.FC = () => {
  const { data: balanceData, isLoading: loadingBalance } = useQuery<WalletBalanceResponse>({
    queryKey: ['walletBalance'],
    queryFn: getWalletBalance,
  });

  const {
    data: transactionData,
    isLoading: loadingTransactions,
  } = useQuery({
    queryKey: ['transactionHistory'],
    queryFn: () => getTransactionHistory(1, 10),
  });

  const transactions: Transaction[] = transactionData?.transactions || [];

  const totalDeposit = transactions
    .filter((tx) => tx.type === 'deposit')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalWithdraw = transactions
    .filter((tx) => tx.type === 'withdraw')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="px-4 md:px-6 pt-6 space-y-6 w-full">
      {/* Wallet Balance Card */}
      <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-sm">
        <p className="text-sm">Wallet Balance</p>
        <p className="text-4xl font-semibold mt-1">
          {loadingBalance ? 'Loading...' : `$${balanceData?.balance.toFixed(2)}`}
        </p>
      </div>

      {/* Summary Title */}
      <h2 className="text-lg font-semibold text-gray-800">Summary</h2>

      {/* Deposit and Withdraw Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Deposit */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Total Deposit</p>
          <p className="text-3xl font-bold mt-1">
            {loadingTransactions ? '...' : `$${totalDeposit.toFixed(2)}`}
          </p>
          <p className="text-sm text-gray-500 mt-1">Based on last 10 transactions</p>
          <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
            <FiArrowUpRight />
            {/* Placeholder for future comparison logic */}
            8.2%
          </div>
        </div>

        {/* Total Withdraw */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Total Withdraw</p>
          <p className="text-3xl font-bold mt-1">
            {loadingTransactions ? '...' : `$${totalWithdraw.toFixed(2)}`}
          </p>
          <p className="text-sm text-gray-500 mt-1">Based on last 10 transactions</p>
          <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
            <FiArrowDownRight />
            1.8%
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
