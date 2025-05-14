import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWalletBalance, getTransactionHistory } from '../features/wallet/walletAPI';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import { WalletBalanceResponse } from '../types/wallet';

const calculatePercentageChange = (
  newAmount: number,
  oldAmount: number
): number => {
  return ((newAmount - oldAmount) / oldAmount) * 100;
};

const DashboardCards: React.FC = () => {
  const {
    data: balanceData,
    isLoading: loadingBalance,
  } = useQuery<WalletBalanceResponse>({
    queryKey: ['walletBalance'],
    queryFn: getWalletBalance,
  });

  const {
    data: latestData,
    isPending: loadingLatest,
  } = useQuery({
    queryKey: ['transactionHistory', 1],
    queryFn: () => getTransactionHistory(1, 10),
  });

  const latest = latestData?.transactions || [];

  // Total deposit and withdraw of latest transactions
  const totalDeposit = latest
    .filter((t) => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdraw = latest
    .filter((t) => t.type === 'withdraw')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate percentage changes compared to wallet balance
  const depositBalanceDiff = balanceData?.balance ? balanceData.balance - totalDeposit : 0;
  const withdrawBalanceDiff = balanceData?.balance ? balanceData.balance - totalWithdraw : 0;

  const depositPercentageChange = balanceData?.balance
    ? calculatePercentageChange(balanceData.balance, totalDeposit)
    : 0;
  const withdrawPercentageChange = balanceData?.balance
    ? calculatePercentageChange(balanceData.balance, totalWithdraw)
    : 0;

  return (
    <div className="px-4 md:px-6 pt-6 space-y-6 w-full">
      {/* Wallet Balance Card */}
      <div className="bg-[#060744] text-white p-6 rounded-2xl shadow-sm">
        <p className="text-sm">Wallet Balance</p>
        <p className="text-4xl font-semibold mt-1">
          {loadingBalance ? 'Loading...' : `${balanceData?.balance?.toFixed(2)} RWF`}
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
            {loadingLatest ? '...' : `${totalDeposit.toFixed(2)} RWF`}
          </p>
          <p className="text-sm text-gray-500 mt-1">Compare to wallet balance</p>

          {depositBalanceDiff === 0 ? (
            <p className="text-sm text-gray-400 mt-1">No difference from wallet balance</p>
          ) : (
            <div
              className={`flex items-center gap-1 text-sm mt-1 ${depositPercentageChange >= 0 ? 'text-green-600' : 'text-red-500'}`}
            >
              {depositPercentageChange >= 0 ? <FiArrowUpRight /> : <FiArrowDownRight />}
              {`${Math.abs(depositPercentageChange).toFixed(1)}%`}
            </div>
          )}
        </div>

        {/* Total Withdraw */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Total Withdraw</p>
          <p className="text-3xl font-bold mt-1">
            {loadingLatest ? '...' : `${totalWithdraw.toFixed(2)} RWF`}
          </p>
          <p className="text-sm text-gray-500 mt-1">Compare to wallet balance</p>

          {withdrawBalanceDiff === 0 ? (
            <p className="text-sm text-gray-400 mt-1">No difference from wallet balance</p>
          ) : (
            <div
              className={`flex items-center gap-1 text-sm mt-1 ${withdrawPercentageChange >= 0 ? 'text-green-600' : 'text-red-500'}`}
            >
              {withdrawPercentageChange >= 0 ? <FiArrowUpRight /> : <FiArrowDownRight />}
              {`${Math.abs(withdrawPercentageChange).toFixed(1)}%`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default DashboardCards;
