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
              <p><strong>Mobile Number:</strong> {user?.mobile || 'N/A'}</p>
              <p><strong>Marketing Info:</strong> {user?.marketInfo || 'N/A'}</p>
            </>
          )}
        </div>

        
      </div>
    </div>
  );
};

export default Profile;
