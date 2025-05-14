import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '../Sidebar';
import Header from '../Header';
import LogoutModal from '../LogoutModal';
import { UserProfile } from '../../types/auth';
import { WalletTransaction } from '../../types/wallet';
import { getTransactionHistory } from '../../features/wallet/walletAPI';

interface DashboardLayoutProps {
  user: UserProfile;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  const { data, } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => getTransactionHistory(1, 10),
  });

  const transactions: WalletTransaction[] = data?.transactions || [];

  return (
    <div className="flex">
      <Sidebar
        user={user}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogoutClick={() => setShowLogoutModal(true)}
      />

      <div className="flex-1 bg-gray-50 min-h-screen relative">
        <Header
          user={user}
          onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
          isMenuOpen={isSidebarOpen}
          transactions={transactions}
        />

        {showLogoutModal && (
          <LogoutModal onClose={() => setShowLogoutModal(false)} />
        )}

        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;


