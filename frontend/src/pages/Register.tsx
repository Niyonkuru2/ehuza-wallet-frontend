import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { AuthResponse, RegisterPayload } from '../types/auth'; 
import { registerUser } from '../features/auth/authAPI';

const Register: React.FC = () => {
  const navigate = useNavigate();

  // Local form state
  const [formData, setFormData] = useState<RegisterPayload>({
    name: '',
    email: '',
    password: '',
  });

  // React Query mutation
  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data: AuthResponse) => {
      toast.success(data.message || 'Registration successful!');
      navigate('/login');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message || 'Registration failed!';
      toast.error(message);
    },
  });

  // Handle form field changes
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
            <span className="text-blue-600">eHuza</span><br /> wallet
          </h1>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-6">Create your account</h2>

        <form className="space-y-4 text-left" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="relative">
            <FaUser className="absolute left-3 top-3.5 text-gray-400" />
            <input
              name="name"
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

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
            {isPending ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-blue-600 font-medium cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
