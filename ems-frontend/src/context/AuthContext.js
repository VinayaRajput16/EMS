import { createContext, useContext, useState } from 'react';
import { authApi } from '../api/authApi.js';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const getInitialUser = () => {
  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');

  return token && role && userId
    ? { id: userId, role, token }
    : null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser);
  const [loading, setLoading] = useState(false);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const { data } = await authApi.login({ email, password });

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('userId', data.user.id);

      setUser({
        id: data.user.id,
        role: data.user.role,
        name: data.user.name,
        token: data.accessToken,
      });

      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password, role }) => {
    setLoading(true);
    try {
      const { data } = await authApi.register({ name, email, password, role });

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('userId', data.user.id);

      setUser({
        id: data.user.id,
        role: data.user.role,
        name: data.user.name,
        token: data.accessToken,
      });

      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isOrganizer: user?.role === 'ORGANIZER',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
