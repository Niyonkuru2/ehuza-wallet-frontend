import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const ProfileInfo: React.FC = () => {
  const [name, setName] = useState('Samuel Niyonkuru');
  const [email, setEmail] = useState('samuel@example.com');
  const [password, setPassword] = useState('********');

  const handleUpdate = () => {
    // Handle form submission or API call here
    alert('Profile updated!');
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-50 min-h-screen">
        <Header user={{ name }} />
        <div className="max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h2>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <div className="flex items-center">
              <input
                type="password"
                value={password}
                readOnly
                className="w-full p-3 border rounded-xl focus:outline-none bg-gray-100"
              />
              <button
                className="ml-3 text-blue-600 font-medium"
                onClick={() => setPassword('')}
              >
                Change
              </button>
            </div>
          </div>

          <div className="flex items-center mb-6">
            <img
              src="/profile.JPG"
              alt="Profile"
              className="w-20 h-20 rounded-full mr-4"
            />
            <div>
              <p className="font-semibold text-gray-800">{name}</p>
              <p className="text-gray-500 text-sm">{email}</p>
              <button className="text-blue-600 text-sm mt-1">Change Picture</button>
            </div>
          </div>

          <button
            onClick={handleUpdate}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
