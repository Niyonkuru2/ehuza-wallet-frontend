import React, { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserProfile } from '../features/auth/authAPI';
import { UserProfile } from '../types/auth';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import DashboardLayout from '../components/layout/DashboardLayout';

const ProfileInfo: React.FC = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileRef = useRef<File | null>(null); // to store selected file

  const { data: user, isPending } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000,
  });

  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [joinedAt, setJoinedAt] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setImageUrl(user.imageUrl);
      setJoinedAt(new Date(user.createdAt).toLocaleDateString());
    }
  }, [user]);

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

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (fileRef.current) {
      formData.append('image', fileRef.current);
    }
    if (newPassword) {
      formData.append('newPassword', newPassword);
    }

    mutation.mutate(formData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      fileRef.current = file;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (isPending || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loader inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="w-full max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow p-6 sm:p-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
          <button
            onClick={() => setIsEdit(!isEdit)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
          >
            {isEdit ? 'Cancel' : 'Update'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start mb-6 gap-4">
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
            placeholder="Image"
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="text-center md:text-left">
            <p className="font-semibold text-gray-800">{name}</p>
            <p className="text-gray-500 text-sm break-words">{email}</p>
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
                className="pl-3 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                className="pl-3 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="pl-3 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-3 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleUpdate}
              disabled={mutation.isPending}
              className="relative w-full bg-[#060744] hover:bg-[#060872] text-white font-semibold py-2 rounded-lg transition duration-300 flex justify-center items-center"
            >
              Save Changes
              {mutation.isPending && (
                <span className="absolute right-4 loader inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
            </button>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfileInfo;
