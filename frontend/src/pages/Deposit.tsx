import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { depositMoney } from '../features/wallet/walletAPI';
import { getUserProfile } from '../features/auth/authAPI';
import { UserProfile } from '../types/auth';
import { WalletActionResponse } from '../types/wallet';

const DepositPage: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const { data: user, isPending: isUserLoading, isError: userError } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: depositMoney,
    onSuccess: (data: WalletActionResponse) => {
      toast.success(data.message || 'Deposit successful!');
      setAmount('');
      setDescription('');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const msg = error.response?.data?.message || 'Deposit failed. Try again.';
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) {
      toast.error('Both amount and description are required!');
      return;
    }

    mutate({
      amount: parseFloat(amount),
      description,
    });
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loader inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (userError || !user) {
    return <div className="p-6 text-red-500">Failed to load user profile.</div>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-50 min-h-screen">
        <Header user={user} />
        <div className="p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Make a Deposit</h2>
          <form
            onSubmit={handleSubmit}
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
                placeholder="Enter amount"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-100"
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
                placeholder="Enter deposit description"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-100"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-150 relative"
            >
              Submit Deposit
              {isPending && (
                <span className="absolute right-4 loader inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              <FiSend className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DepositPage;
