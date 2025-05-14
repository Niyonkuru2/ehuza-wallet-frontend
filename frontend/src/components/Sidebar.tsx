import React from 'react';
import {
  FiHome,
  FiBarChart2,
  FiLogOut,
  FiDollarSign,
} from 'react-icons/fi';
import { Link, NavLink } from 'react-router-dom';
import { UserProfile } from '../types/auth';

interface SidebarProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onLogoutClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, isOpen, onClose, onLogoutClick }) => {
  const menuItems = [
    { name: 'Dashboard', icon: <FiHome />, path: '/dashboard' },
    { name: 'Transactions', icon: <FiBarChart2 />, path: '/transactions' },
    { name: 'Deposit', icon: <FiDollarSign />, path: '/deposit' },
    { name: 'Withdraw', icon: <FiDollarSign />, path: '/withdraw' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 sm:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed sm:sticky top-0 left-0 h-screen w-64 bg-[#0f172a] text-white flex flex-col justify-between shadow-md z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0`}
      >
        <div>
          <div className="p-6 text-2xl font-bold border-b border-gray-700 mt-2 flex justify-between items-center">
            eHuza Wallet
          </div>
          <nav className="flex flex-col gap-1 px-4 mt-10">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`
                }
                onClick={onClose} // Close sidebar on menu click (mobile)
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="px-4 py-6 border-t border-gray-700 flex flex-col gap-3">
          <Link to="/profile" onClick={onClose}>
            <div className="flex items-center gap-3">
              <img
                src={user.imageUrl || '/noavatar.jpg'}
                alt="User"
                className="w-10 h-10 rounded-full border border-gray-500 object-cover ring-2"
              />
              <div>
                <p className="text-sm font-semibold leading-tight">
                  {user.name}
                </p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
          </Link>
          <button
            onClick={() => {
              onLogoutClick(); //  trigger parent logout modal
              onClose();       // close sidebar (on mobile)
            }}
            className="text-red-400 hover:text-red-300 flex items-center gap-1 mt-5"
          >
            <FiLogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
