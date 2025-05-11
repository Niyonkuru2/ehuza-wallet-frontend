// pages/Dashboard.tsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useQuery } from '@tanstack/react-query';
import { UserProfile } from '../types/auth';
import { getUserProfile } from '../features/auth/authAPI';

const Dashboard: React.FC = () => {
  const { data: user, isLoading, isError } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000, // optional: avoids frequent refetch
  });

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError || !user) return <div className="p-6 text-red-500">Failed to load user profile.</div>;

  return (
    <div className="flex">
      <Sidebar user={user} />
      <div className="flex-1 bg-gray-50 min-h-screen">
        <Header user={user} />
      </div>
    </div>
  );
};

export default Dashboard;
