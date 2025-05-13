import React, { useState } from 'react';
import {
  FiDownload,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { getTransactionHistory } from '../features/wallet/walletAPI'; 
import { getUserProfile } from '../features/auth/authAPI';
import { WalletTransaction } from '../types/wallet';
import DashboardLayout from '../components/layout/DashboardLayout';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FaFileExcel } from 'react-icons/fa';

const ROWS_PER_PAGE = 10; // Number of rows per page for pagination

const Transactions: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ deposit: true, withdrawal: true });
  const [sortByDateAsc, setSortByDateAsc] = useState(false);
  const [page, setPage] = useState(1);

  // Query to get user profile
  const {
    data: user,
    isPending: loadingUser,
    isError: errorUser,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
  });

  // Query to get paginated transactions
  const {
    data,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['transactions', page],
    queryFn: () => getTransactionHistory(page, ROWS_PER_PAGE),
    placeholderData: {
      success: true,
      transactions: [],
      total: 0,
      page,
      totalPages: 0,
    },
  });

  const transactions: WalletTransaction[] = data?.transactions ?? [];

  // Filtering and sorting the transactions before displaying
  const filteredTxs = transactions
    .filter(
      (tx) =>
        (filters.deposit && tx.type === 'deposit') ||
        (filters.withdrawal && tx.type === 'withdraw')
    )
    .filter(
      (tx) =>
        tx.description.toLowerCase().includes(search.toLowerCase()) ||
        new Date(tx.createdAt).toLocaleString().toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortByDateAsc ? dateA - dateB : dateB - dateA;
    });

  // Export visible data to Excel
  const handleExportExcel = () => {
    const exportData = filteredTxs.map((tx) => ({
      Date: new Date(tx.createdAt).toLocaleString(),
      Description: tx.description,
      Amount: tx.amount,
      Type: tx.type === 'deposit' ? 'Deposit' : 'Withdraw',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData); // Convert to Excel worksheet
    const workbook = XLSX.utils.book_new(); // Create new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions'); // Add worksheet

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' }); // Write buffer
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    saveAs(blob, 'Transactions.xlsx'); // Download file
  };

  // Show loading while fetching user
  if (loadingUser || !user) {
    return <p className="text-center py-10">Loading user...</p>;
  }

  return (
    <DashboardLayout user={user}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Transactions</h2>
          <div className="flex gap-2">
            <button onClick={handleExportExcel} className="btn flex items-center gap-1">
              <FiDownload /> Export
            </button>
            <button className="btn flex items-center gap-1">
              <FaFileExcel className="text-green-600" /> Excel
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex justify-between flex-wrap gap-4 items-center">
          {/* Filter checkboxes */}
          <div className="flex gap-4">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={filters.deposit}
                onChange={() =>
                  setFilters((prev) => ({ ...prev, deposit: !prev.deposit }))
                }
              />
              Deposit
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={filters.withdrawal}
                onChange={() =>
                  setFilters((prev) => ({ ...prev, withdrawal: !prev.withdrawal }))
                }
              />
              Withdraw
            </label>
          </div>

          {/* Search input */}
          <div className="relative w-full md:w-1/3">
            <FiSearch className="absolute top-2.5 left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search Transaction..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Transaction Table */}
        {isPending ? (
          <p className="text-center py-10">Loading transactions...</p>
        ) : isError || errorUser ? (
          <p className="text-center text-red-600 py-10">Failed to load data.</p>
        ) : (
          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {/* Clickable column header for sorting */}
                  <th
                    className="p-4 cursor-pointer"
                    onClick={() => setSortByDateAsc(!sortByDateAsc)}
                  >
                    <div className="flex items-center gap-1">
                      Date {sortByDateAsc ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                  </th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Type</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {filteredTxs.map((tx, index) => (
                  <tr
                    key={tx.transactionId}
                    className={`${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                    } border-t`}
                  >
                    <td className="p-4">{new Date(tx.createdAt).toLocaleString()}</td>
                    <td className="p-4">{tx.description}</td>
                    <td className="p-4">{tx.amount.toFixed(2)} RWF</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          tx.type === 'deposit'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {data?.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-4">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm">
                  Page {page} of {data.totalPages}
                </span>
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, data.totalPages))}
                  disabled={page === data.totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
