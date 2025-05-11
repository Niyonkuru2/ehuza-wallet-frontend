import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import Header from '../Header';
import LogoutModal from '../LogoutModal';
import { UserProfile } from '../../types/auth';

interface DashboardLayoutProps {
  user: UserProfile;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
        />

        {showLogoutModal && (
          <LogoutModal onClose={() => setShowLogoutModal(false)} />
        )}

        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
