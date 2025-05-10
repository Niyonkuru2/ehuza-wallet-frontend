import React, { useState } from 'react';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { loginUser } from '../features/auth/authAPI';
import { AuthResponse, LoginPayload } from '../types/auth';

const Login: React.FC = () => {
  const navigate = useNavigate();

  // State for form inputs
  const [formData, setFormData] = useState<LoginPayload>({
    email: '',
    password: '',
  });

  // React Query mutation
  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: AuthResponse) => {
      toast.success(data.message || 'Login successful!');
      navigate('/dashboard'); // Change path if needed
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const msg = error.response?.data?.message || 'Login failed!';
      toast.error(msg);
    },
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <img
            src="/wallet (1).png"
            alt="E-Huza Wallet Logo"
            className="h-12 w-12"
          />
          <h1 className="text-3xl font-bold text-gray-800 flex-col">
            <span className="text-blue-600">E-HUZA</span> <span>WALLET</span>
          </h1>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-6">Login to your account</h2>

        <form className="space-y-4 text-left" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="relative">
            <MdEmail className="absolute left-3 top-3.5 text-gray-400" />
            <input
              name="email"
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <RiLockPasswordLine className="absolute left-3 top-3.5 text-gray-400" />
            <input
              name="password"
              type="password"
              placeholder="Your Password"
              value={formData.password}
              onChange={handleChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            {isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6">
          Don’t have an account?{' '}
          <span onClick={() => navigate('/register')} className="text-blue-600 font-medium cursor-pointer">
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
