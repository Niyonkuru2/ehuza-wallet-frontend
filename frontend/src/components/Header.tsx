import React, { useState } from 'react';
import { FiBell, FiMenu, FiX } from 'react-icons/fi';
import { UserProfile } from '../types/auth';
import { WalletTransaction } from '../types/wallet';
import NotificationModal from './NotificationModal';
import { Link } from 'react-router-dom';

interface HeaderProps {
  user: UserProfile;
  isMenuOpen: boolean;
  onMenuClick: () => void;
  transactions: WalletTransaction[];
}

const Header: React.FC<HeaderProps> = ({ user, isMenuOpen, onMenuClick, transactions }) => {
  const [showPopup, setShowPopup] = useState(false);

  console.log('🧾 Transactions passed to Header:', transactions);

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center p-6 bg-white shadow-md">
      {/* Toggle button for mobile menu */}
      <button
        className="sm:hidden text-gray-600 mr-4"
        onClick={onMenuClick}
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        title={isMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <p className="text-gray-500 hidden sm:block">Welcome, {user.name}</p>

      <div className="flex items-center gap-6 relative">
        {/* Bell icon */}
        <button
          aria-label={showPopup ? 'Close notifications' : 'Open notifications'}
          onClick={() => setShowPopup(!showPopup)}
          className="relative"
        >
          <FiBell className="text-xl text-gray-600 hover:text-gray-800" />
        </button>

        {/* Profile */}
        <Link to="/profile">
        <div className="flex items-center gap-2 cursor-pointer" >
          <img
            src={user.imageUrl || '/noavatar.jpg'}
            alt="Profile"
            className="w-10 h-10 rounded-full border border-gray-500 object-cover ring-2"
          />
          <span className="text-gray-700 font-medium hidden sm:block">
            {user.name}
          </span>
        </div>
        </Link>
        {/* Notification Popup */}
        {showPopup && (
          <div className="absolute top-12 right-0">
            <NotificationModal
              transactions={transactions}
              onClose={() => setShowPopup(false)}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
