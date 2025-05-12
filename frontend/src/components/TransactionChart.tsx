import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { getMonthlyTransaction } from '../features/wallet/walletAPI';
import { MonthlyTransactionData } from '../types/wallet';

type ChartData = {
  month: string;
  deposit: number;
  withdraw: number;
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const TransactionChart: React.FC = () => {
  const { data, isLoading, isError } = useQuery<ChartData[]>({
    queryKey: ['monthlyTransactions'],
    queryFn: getMonthlyTransaction,
    select: (response: { monthlyTransactions: MonthlyTransactionData[] }) => {
      const map = new Map<number, ChartData>();

      response.monthlyTransactions.forEach(({ month, deposit, withdraw }) => {
        if (!map.has(month)) {
          map.set(month, { month: monthNames[month - 1], deposit: 0, withdraw: 0 });
        }
        const current = map.get(month)!;
        current.deposit += deposit;
        current.withdraw += withdraw;
      });

      return Array.from(map.values());
    },
  });

  if (isLoading) return <p>Loading data...</p>;
  if (isError || !data) return <p>Error loading data.</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Monthly Comparison</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="deposit" stroke="#8884d8" strokeWidth={2} />
          <Line type="monotone" dataKey="withdraw" stroke="#82ca9d" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionChart;
