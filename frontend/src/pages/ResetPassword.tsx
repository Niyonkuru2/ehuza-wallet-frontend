import React, { useState } from 'react';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../features/auth/authAPI';
import { AuthResponse } from '../types/auth';
import { AxiosError } from 'axios';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: () => resetPassword({ token, newPassword }),
    onSuccess: (data: AuthResponse) => {
      toast.success(data.message)
      navigate('/login');
    },
    onError: (error: AxiosError<{ message: string }>) => {
          const msg = error.response?.data?.message;
          toast.error(msg);
        },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    mutate();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <img src="/wallet (1).png" alt="Logo" className="h-12 w-12" />
          <h1 className="text-3xl font-bold text-gray-800">
            <span className="text-blue-600">eHuza</span><br /> wallet
          </h1>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-6">Reset your password</h2>

        <form className="space-y-4 text-left" onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="relative">
            <RiLockPasswordLine className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <RiLockPasswordLine className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit */}
            
         <button
            type="submit"
          disabled={isPending}
        className="relative w-full bg-[#060744] hover:bg-[#060872] text-white font-semibold py-2 rounded-lg transition duration-300 flex justify-center items-center"
        >
      <span className="flex items-center gap-2">
      Reset Password
    {isPending && (
       <span className="absolute right-4 loader inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
    )}
  </span>
</button>


        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
