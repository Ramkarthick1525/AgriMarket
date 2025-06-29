import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Menu,
  X,
  User,
  ShoppingCart,
  LogOut,
  Settings,
  Sprout
} from 'lucide-react';

const Navbar = () => {
  const { user, userRole, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const categories = [
    { name: 'Seeds & Fertilizers', path: '/category/seeds-fertilizers' },
    { name: 'Vegetables', path: '/category/fresh-produce' },
    { name: 'Fruits', path: '/category/fresh-produce' },
    { name: 'Machinery', path: '/category/machinery' },
    { name: 'Dairy', path: '/category/livestock' }
  ];

  return (
    <nav className="bg-green-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo (shown to all) */}
          <Link to={isAdmin ? "/admin" : "/"} className="flex items-center space-x-2">
            <Sprout className="h-8 w-8 text-green-300" />
            <span className="text-white text-xl font-bold">
              {isAdmin ? "Admin" : "AgriMart"}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAdmin && (
              <>
                <Link to="/" className="text-white hover:text-green-300">Home</Link>
                <Link to="/services" className="text-white hover:text-green-300">Services</Link>
                <Link to="/about" className="text-white hover:text-green-300">About Us</Link>
                <Link to="/contact" className="text-white hover:text-green-300">Contact Us</Link>

                {/* Categories Dropdown */}
                <div className="relative group">
                  <button className="text-white hover:text-green-300">
                    Categories
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {categories.map((category) => (
                      <Link
                        key={category.path}
                        to={category.path}
                        className="block px-4 py-2 text-gray-800 hover:bg-green-50 hover:text-green-800"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-white hover:text-green-300">Admin Panel</Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-white hover:text-green-300"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">{user.name}</span>
                </button>
                {user && (
  <Link
    to="/profile"
    className="text-sm text-gray-700 hover:text-green-600 font-medium"
  >
    
  </Link>
)}
{isProfileOpen && (
  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg">
    <Link
      to="/profile"
      className="flex items-center px-4 py-2 text-gray-800 hover:bg-green-50 hover:text-green-800"
      onClick={() => setIsProfileOpen(false)}
    >
      <User className="h-4 w-4 mr-2" />
      Profile
    </Link>

    {/* Only for user */}
    {!isAdmin && (
      <Link
        to="/orders"
        className="flex items-center px-4 py-2 text-gray-800 hover:bg-green-50 hover:text-green-800"
        onClick={() => setIsProfileOpen(false)}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        My Orders
      </Link>
    )}

    {/* Only for admin */}
    {isAdmin && (
      <Link
        to="/admin"
        className="flex items-center px-4 py-2 text-gray-800 hover:bg-green-50 hover:text-green-800"
        onClick={() => setIsProfileOpen(false)}
      >
        <Settings className="h-4 w-4 mr-2" />
        Admin Panel
      </Link>
    )}

    <button
      onClick={handleLogout}
      className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-red-50 hover:text-red-800"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </button>
  </div>
)}


              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-white hover:text-green-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white hover:text-green-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-green-700 px-4 pb-4">
            <Link to="/" className="block py-2 text-white hover:text-green-300" onClick={() => setIsMenuOpen(false)}>Home</Link>
            {!isAdmin && categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="block py-2 text-white hover:text-green-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" className="block py-2 text-white hover:text-green-300" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
