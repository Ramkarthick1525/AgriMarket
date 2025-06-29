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

  const login = async (email, password) => {
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

 const register = async (email, password, name, role = "user", mobile, marketInfo) => {
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
    role,
    ...(role === 'admin' && { mobile, marketInfo })
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
