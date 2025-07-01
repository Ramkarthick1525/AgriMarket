import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <div className="flex justify-center mb-4">
          <div className="bg-green-600 p-3 rounded-full">
            <Sprout className="h-8 w-8 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">My Profile</h2>

        <div className="space-y-4 text-gray-700">
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>

          {user?.role === 'admin' && (
            <>
              <p><strong>Mobile Number:</strong> { '90423 94728'}</p>
              <p><strong>Market Info:</strong> { 'Local Market'}</p>
            </>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
