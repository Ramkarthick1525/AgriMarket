import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  // ✅ Admin login (hardcoded)
  const login = async (email, password) => {
    if (email === 'tamilvaanan2004@gmail.com' && password === 'admin@123') {
      const adminUser = {
        name: "Admin",
        email,
        role: "admin",
        
      };
      localStorage.setItem("loggedInUser", JSON.stringify(adminUser));
      setUser(adminUser);
      toast.success("Logged in as Admin");
      return adminUser;
    }

    // ✅ Normal user login
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (!foundUser) {
      toast.error("Invalid email or password");
      throw new Error("Login failed");
    }

    localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
    setUser(foundUser);
    toast.success("Logged in successfully");
    return foundUser;
  };

  // ✅ User registration only (no admin or seller registration)
  const register = async (email, password, name) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      toast.error("User already exists with this email");
      throw new Error("Registration failed");
    }

    const newUser = {
      name,
      email,
      password,
      role: "user",
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedInUser", JSON.stringify(newUser));
    setUser(newUser);
    toast.success("Account created successfully");
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    toast.success("Logged out");
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin: user?.role === "admin",
    isUser: user?.role === "user",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
