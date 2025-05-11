import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserProfile } from '../features/auth/authAPI'
import { UserProfile } from '../types/auth';

const ProfileInfo: React.FC = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000,
  });

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [joinedAt, setJoinedAt] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setImageUrl(profile.imageUrl);
      setJoinedAt(new Date(profile.createdAt).toLocaleDateString());
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      alert('Profile updated!');
      setEditMode(false);
    },
  });

  const handleUpdate = () => {
    mutation.mutate({ name, email, imageUrl });
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

  if (isLoading) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="flex">
      <Sidebar user={{ name, imageUrl, email, userId: '', createdAt:'' }} />
      <div className="flex-1 bg-gray-50 min-h-screen">
        <Header user={{ name, imageUrl, email, userId: '', createdAt:'' }} />
        <div className="max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
            <button
              onClick={() => setEditMode(!editMode)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
            >
              {editMode ? 'Cancel' : 'Update Profile'}
            </button>
          </div>

          <div className="flex items-center mb-6">
            <div
              className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer"
              onClick={() => editMode && fileInputRef.current?.click()}
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

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              readOnly={!editMode}
              placeholder="Enter full name"
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-3 border rounded-xl ${editMode ? 'bg-white' : 'bg-gray-100'}`}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              readOnly={!editMode}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 border rounded-xl ${editMode ? 'bg-white' : 'bg-gray-100'}`}
            />
          </div>

          {editMode && (
            <button
              onClick={handleUpdate}
              className="relative w-full bg-[#060744] hover:bg-[#060872] text-white font-semibold py-2 rounded-lg transition duration-300 flex justify-center items-center"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
