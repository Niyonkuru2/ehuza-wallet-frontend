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

// Define the number of rows shown per page in the transaction table
const ROWS_PER_PAGE = 10;
const Transactions: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ deposit: true, withdrawal: true });
  const [sortByDateAsc, setSortByDateAsc] = useState(false);
  const [page, setPage] = useState(1);

  // Fetch user profile data
  const {
    data: user,

    isError: errorUser,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
  });

  // Fetch transaction history data with pagination
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

  // Extract transactions array
  const transactions: WalletTransaction[] = data?.transactions ?? [];

  // Filter and sort transactions based on type,
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

  // Function to export the filtered transactions as an Excel file
  const handleExportExcel = () => {
    const exportData = filteredTxs.map((tx) => ({
      Date: new Date(tx.createdAt).toLocaleString(),
      Description: tx.description,
      Amount: tx.amount,
      Type: tx.type === 'deposit' ? 'Deposit' : 'Withdraw',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    saveAs(blob, 'Transactions.xlsx');
  };
  if (isPending || !user) {
    return <p className="text-center py-10">Loading user...</p>;
  }
  return (
    <DashboardLayout user={user}>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Page Header with Export Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold">Transactions</h2>
          <div className="hidden sm:flex flex-wrap gap-2">
            <button onClick={handleExportExcel} className="btn flex items-center gap-1">
              <FiDownload /> Export
            </button>
            <button className="btn flex items-center gap-1">
              <FaFileExcel className="text-green-600" /> Excel
            </button>
          </div>
        </div>

        {/* Filter and Search Section */}
        <div className="hidden sm:flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {/* Deposit and Withdraw Filters */}
            <div className="hidden sm:flex flex-wrap gap-4">
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
          </div>

          {/* Search Input */}
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
          // Show loading message if data is loading
          <p className="text-center py-10">Loading transactions...</p>
        ) : isError || errorUser ? (
          // Show error message if data fails to load
          <p className="text-center text-red-600 py-10">Failed to load data.</p>
        ) : (
          // Display transactions history
          <div className="overflow-x-auto rounded-md border">
            <table className="min-w-full table-auto text-sm block md:table">
              <thead className="bg-gray-100 hidden md:table-header-group">
                <tr>
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
              <tbody className="bg-white divide-y block md:table-row-group">
                {filteredTxs.map((tx, index) => (
                  <tr
                    key={tx.transactionId}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-t`}
                  >
                    <td className="p-4 block md:table-cell">
                      <span className="font-semibold md:hidden">Date: </span>
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 block md:table-cell">
                      <span className="font-semibold md:hidden">Description: </span>
                      {tx.description}
                    </td>
                    <td className="p-4 block md:table-cell">
                      <span className="font-semibold md:hidden">Amount: </span>
                      {tx.amount.toFixed(2)} RWF
                    </td>
                    <td className="p-4 block md:table-cell">
                      <span className="font-semibold md:hidden">Type: </span>
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

            {/* Pagination Controls */}
            {data?.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 mt-4 p-4">
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
