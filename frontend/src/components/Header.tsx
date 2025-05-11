// components/Header.tsx
import React from 'react';
import { FiBell } from 'react-icons/fi';
import { UserProfile } from '../types/auth';

interface HeaderProps {
  user: UserProfile;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="sticky top-0 z-50 flex justify-between items-center p-6 bg-white shadow-md">
      <div>
        <p className="text-gray-500">Welcome, {user.name}</p>
      </div>
      <div className="flex items-center gap-4">
        <FiBell className="text-xl" />
        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src={user.imageUrl || '/profile.JPG'}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <span className="text-gray-700 font-medium">{user.name}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
