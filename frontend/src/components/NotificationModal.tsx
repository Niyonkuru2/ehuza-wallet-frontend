// components/NotificationPopup.tsx
import React from 'react';
import { FiX } from 'react-icons/fi';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { WalletTransaction } from '../types/wallet';

interface Props {
  transactions: WalletTransaction[];
  onClose: () => void;
}

const NotificationModal: React.FC<Props> = ({ transactions, onClose }) => {
  // Get latest 3
  const latest = transactions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="fixed top-5 right-5 w-96 bg-[#0D1B2A] text-white rounded-lg shadow-lg z-50">
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <button 
         aria-label="modal"
        onClick={onClose}>
          <FiX className="text-white text-xl" />
        </button>
      </div>
      <div className="divide-y divide-gray-700">
        {latest.map((tx) => (
          <div key={tx.transactionId} className="flex items-start gap-3 px-4 py-3">
            {tx.status === 'success' ? (
              <FaCheckCircle className="text-green-500 text-xl mt-1" />
            ) : (
              <FaExclamationCircle className="text-red-500 text-xl mt-1" />
            )}
            <div>
              <p className="text-sm">
                {tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'} of ${tx.amount}{' '}
                {tx.status === 'success' ? 'was successful' : 'failed'}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(tx.createdAt).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationModal;
