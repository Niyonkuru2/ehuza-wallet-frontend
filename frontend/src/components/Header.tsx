import React from 'react';
import { FiBell } from 'react-icons/fi';
import { UserProfile } from '../types/auth';

interface HeaderProps {
  user: UserProfile;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="sticky top-0 z-50 flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 bg-white shadow-md gap-4 sm:gap-0">
      <div className="text-center sm:text-left">
        <p className="text-gray-500 text-sm sm:text-base">Welcome, {user.name}</p>
      </div>
      <div className="flex items-center gap-3 sm:gap-4">
        <FiBell className="text-xl sm:text-2xl" />
        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src={user.imageUrl || '/noavatar.jpg'}
            alt="Profile"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-400 object-cover ring-2"
          />
          <span className="hidden sm:inline text-gray-700 font-medium text-sm sm:text-base">
            {user.name}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
