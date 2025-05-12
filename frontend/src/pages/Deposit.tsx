import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import { depositMoney} from '../features/wallet/walletAPI';
import { getUserProfile } from '../features/auth/authAPI';
import { UserProfile } from '../types/auth';
import { WalletActionResponse } from '../types/wallet';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';

const WithdrawPage: React.FC = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  // Fetch user profile
  const { data: user, isLoading: isUserLoading, isError: userError } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000, // Avoid frequent refetch
  });

  // Mutation to handle withdrawal
  const { mutate, isPending } = useMutation({
    mutationFn: depositMoney,
    onSuccess: (data: WalletActionResponse) => {
      toast.success(data.message);
      setAmount('');
      setDescription('');
      navigate('/transactions');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const msg = error.response?.data?.message;
      toast.error(msg);
    },
  });

  // Handle form submission for Deposit
  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare Deposit request data with description
    const withdrawalData = {
      amount: parseFloat(amount),
      description,
    };

    // Trigger the Deposit mutation
    mutate(withdrawalData);
  };

  // Loading state for user profile
  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loader inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  // Error state if user profile fails to load
  if (userError || !user) {
    return <div className="p-6 text-red-500">Failed to load user profile.</div>;
  }

  return (
    <DashboardLayout user={user}>
      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Withdraw Funds</h2>
        <form
          onSubmit={handleWithdraw}
          className="bg-white shadow-md rounded-xl p-6 space-y-5 border"
        >
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="amount">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount To deposit"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Add Description for this Deposit"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
         type="submit"
       disabled={isPending}
      className="relative w-full bg-[#060744] hover:bg-[#090a5a] text-white font-semibold py-2 rounded-lg transition duration-300 flex justify-center items-center"
   >
        Deposit
    {isPending && (
    <span className="absolute right-4 loader inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
  )}
    </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default WithdrawPage;
