import React, { useState } from 'react';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { AuthResponse, LoginPayload } from '../types/auth';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import { loginUser } from '../features/auth/authAPI';
import { useDispatch } from 'react-redux';
import { setToken } from '../features/auth/authSlice';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<LoginPayload>({
    email: '',
    password: '',
  });

  const [showForgot, setShowForgot] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: AuthResponse) => {
  if (data.token) {
    dispatch(setToken(data.token));
    toast.success(data.message);
    navigate('/dashboard');
  } else {
    toast.error('Login successful, but no token returned!');
  }
},
    onError: (error: AxiosError<{ message: string }>) => {
      const msg = error.response?.data?.message || 'Login failed!';
      toast.error(msg);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <img src="/wallet (1).png" alt="E-Huza Wallet Logo" className="h-12 w-12" />
          <h1 className="text-3xl font-bold text-gray-800 flex-col">
            <span className="text-blue-600">eHuza</span><br /> wallet
          </h1>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-6">Login to your account</h2>

        <form className="space-y-4 text-left" onSubmit={handleSubmit}>
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
        <button
    type="submit"
    disabled={isPending}
    className="relative w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300 flex justify-center items-center"
   >
  Register
  {isPending && (
    <span className="absolute right-4 loader inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
  )}
</button>
        </form>

        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <span>
            Don’t have an account?{' '}
            <span
              onClick={() => navigate('/register')}
              className="text-blue-600 font-medium cursor-pointer"
            >
              Register
            </span>
          </span>
          <span
            onClick={() => setShowForgot(true)}
            className="text-blue-600 font-medium cursor-pointer"
          >
            Forgot Password?
          </span>
        </div>
      </div>

      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
    </div>
  );
};

export default Login;
