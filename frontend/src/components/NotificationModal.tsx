import React from 'react';
import { FiX } from 'react-icons/fi';
import { FaCheckCircle } from 'react-icons/fa';
import { WalletTransaction } from '../types/wallet';

interface Props {
  transactions?: WalletTransaction[];
  onClose: () => void;
}

const NotificationModal: React.FC<Props> = ({ transactions = [], onClose }) => {
  const latest = transactions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="fixed top-0 right-0 sm:top-5 sm:right-5 w-full sm:w-[28rem] bg-[#0D1B2A] text-white rounded-none sm:rounded-lg shadow-lg z-50 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <button aria-label="Close Modal" onClick={onClose}>
          <FiX className="text-white text-xl" />
        </button>
      </div>

      {latest.length === 0 ? (
        <div className="px-4 py-3 text-sm text-gray-400">No recent transactions.</div>
      ) : (
        <div className="divide-y divide-gray-700">
          {latest.map((tx) => (
            <div key={tx.transactionId} className="flex items-start gap-3 px-4 py-3">
              <FaCheckCircle className="text-green-500 text-xl mt-1" />
              <div>
                <p className="text-sm">
                  {tx.type === 'deposit' ? 'Deposit' : 'Withdraw'} of {tx.amount} RWF was successful
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(tx.createdAt).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="text-xs italic text-gray-300">{tx.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationModal;
