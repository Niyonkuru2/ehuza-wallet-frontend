import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserProfile } from '../features/auth/authAPI';
import { UserProfile } from '../types/auth';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

const ProfileInfo: React.FC = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: profile, isPending } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000,
  });

  const [isEdit, setIsEdit] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [joinedAt, setJoinedAt] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setImageUrl(profile.imageUrl);
      setJoinedAt(new Date(profile.createdAt).toLocaleDateString());
    }
  }, [profile]);
   
  const handleMenuClick = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      setIsEdit(false);
      setNewPassword('');
      setConfirmPassword('');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const msg = error.response?.data?.message;
      toast.error(msg);
    },
  });

  const handleUpdate = () => {
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    mutation.mutate({
      name,
      email,
      imageUrl,
      newPassword: newPassword ? newPassword : undefined,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loader inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar user={{ name, imageUrl, email, userId: '', createdAt: '', newPassword }}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 bg-gray-50 min-h-screen">
        <Header user={{ name, imageUrl, email, userId: '', createdAt: '', newPassword }}
        onMenuClick={handleMenuClick}
      isMenuOpen={isSidebarOpen}
        />
        <div className="max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
            <button
              onClick={() => setIsEdit(!isEdit)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
            >
              {isEdit ? 'Cancel' : 'Update Profile'}
            </button>
          </div>

          <div className="flex items-center mb-6">
            <div
              className={`w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 ${
                isEdit ? 'cursor-pointer' : ''
              }`}
              onClick={() => isEdit && fileInputRef.current?.click()}
            >
              <img
                src={imageUrl || '/noavatar.jpg'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              placeholder="image"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="ml-4">
              <p className="font-semibold text-gray-800">{name}</p>
              <p className="text-gray-500 text-sm">{email}</p>
              <p className="text-gray-400 text-xs mt-1">Joined on: {joinedAt}</p>
            </div>
          </div>

          {isEdit && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  placeholder="Full Name"
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <hr className="my-4" />

              <h3 className="text-lg font-semibold text-gray-800 mb-2">Change Password</h3>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  placeholder="New Password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  placeholder="Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleUpdate}
                disabled={mutation.isPending}
                className="relative w-full bg-[#060744] hover:bg-[#060872] text-white font-semibold py-2 rounded-lg transition duration-300 flex justify-center items-center"
              >
                Save Changes
                {mutation.isPending &&(
                  <span className="absolute right-4 loader inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
