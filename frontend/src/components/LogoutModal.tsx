import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LogoutModalProps {
  onClose: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      new Promise<void>((resolve) => {
        setTimeout(() => {
          localStorage.removeItem('token');
          resolve();
        }, 1000); // simulate delay
      }),
    onSuccess: () => {
      navigate('/login');
    },
  });

  const handleLogout = () => {
    mutate();
  };

  return (
  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-sm">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Are you sure you want to log out?
      </h3>
      <div className="flex justify-between gap-2">
        <button
          onClick={onClose}
          disabled={isPending}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="px-4 py-2 bg-[#CD3D3D] text-white rounded hover:bg-[#d45d5d] flex items-center gap-2"
        >
          Logout
          {isPending && (
            <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
        </button>
      </div>
    </div>
  </div>
);
}

export default LogoutModal;
