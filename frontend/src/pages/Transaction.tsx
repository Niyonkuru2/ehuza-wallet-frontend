import React, { useState } from 'react';
import {
  FiDownload,
  FiFileText,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { getUserTransactions } from '../features/transaction/transactionAPI';
import { Transaction } from '../types/transaction';

const statusStyles = {
  Completed: 'text-green-600 bg-green-100',
  Pending: 'text-yellow-600 bg-yellow-100',
  Failed: 'text-red-600 bg-red-100',
};

const TransactionsPage: React.FC = () => {
  const user = { name: 'Samuel Niyonkuru' };

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ deposit: true, withdrawal: true });
  const [sortByDateAsc, setSortByDateAsc] = useState(false);

  const { data: transactions = [], isLoading, isError } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: getUserTransactions,
    staleTime: 5 * 60 * 1000,
  });

  const filteredTxs = transactions
    .filter((tx) =>
      (filters.deposit && tx.description.toLowerCase().includes('deposit')) ||
      (filters.withdrawal && tx.description.toLowerCase().includes('withdraw'))
    )
    .filter((tx) =>
      tx.description.toLowerCase().includes(search.toLowerCase()) ||
      tx.date.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortByDateAsc ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-50 min-h-screen">
        <Header user={user} />
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Transactions</h2>
            <div className="flex gap-2">
              <button className="btn"><FiDownload /> Export</button>
              <button className="btn"><FiFileText /> PDF</button>
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <div className="flex gap-4">
              <label><input type="checkbox" checked={filters.deposit} onChange={() => setFilters({ ...filters, deposit: !filters.deposit })} /> Deposit</label>
              <label><input type="checkbox" checked={filters.withdrawal} onChange={() => setFilters({ ...filters, withdrawal: !filters.withdrawal })} /> Withdraw</label>
            </div>

            <div className="relative w-full md:w-1/3">
              <FiSearch className="absolute top-2.5 left-3 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-md text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <p className="text-center py-10">Loading transactions...</p>
          ) : isError ? (
            <p className="text-center text-red-600 py-10">Failed to load transactions.</p>
          ) : (
            <div className="overflow-x-auto border rounded-md">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      className="p-4 cursor-pointer flex items-center gap-1"
                      onClick={() => setSortByDateAsc(!sortByDateAsc)}
                    >
                      Date {sortByDateAsc ? <FiChevronUp /> : <FiChevronDown />}
                    </th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  {filteredTxs.map((tx) => (
                    <tr key={tx.id}>
                      <td className="p-4">{tx.date}</td>
                      <td className="p-4">{tx.description}</td>
                      <td className="p-4">${tx.amount.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[tx.status]}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
