import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserProfile } from '../types/auth';
import { getUserProfile } from '../features/auth/authAPI';
import DashboardLayout from '../components/layout/DashboardLayout';
import LogoutModal from '../components/LogoutModal';
import DashboardCards from '../components/DashboardCards';

const Dashboard: React.FC = () => {
  const { data: user, isPending, isError } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000, // Avoids frequent refetch
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loader inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (isError || !user) {
    return <div className="p-6 text-red-500">Failed to load user profile.</div>;
  }

  return (
    <DashboardLayout user={user}>
      {/* Content goes here */}
      {/* You can add any specific content for the Dashboard here */}
       <DashboardCards />
      {/* Centered Logout Modal */}
      {showLogoutModal && (
        <LogoutModal onClose={() => setShowLogoutModal(false)} />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
