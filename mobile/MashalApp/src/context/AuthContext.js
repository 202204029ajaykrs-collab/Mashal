import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { API_URL } from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for a stored token and log the user in
    const loadUser = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
        try {
          const res = await axios.get(`${API_URL}/api/auth/me`);
          setUser({ token, ...res.data });
        } catch (err) {
          console.warn('Saved token is invalid, signing out');
          await AsyncStorage.removeItem('token');
          delete axios.defaults.headers.common['x-auth-token'];
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      await AsyncStorage.setItem('token', res.data.token);

      const me = await axios.get(`${API_URL}/api/auth/me`);
      setUser({ token: res.data.token, ...me.data });
    } catch (err) {
      console.error(err);
      // Handle login error (e.g., show an error message)
    }
  };

  const register = async (name, email, userId, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        userId,
        password,
      });
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      await AsyncStorage.setItem('token', res.data.token);

      const me = await axios.get(`${API_URL}/api/auth/me`);
      setUser({ token: res.data.token, ...me.data });
    } catch (err) {
      console.error(err);
      // Handle registration error
    }
  };

  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const res = await axios.post(`${API_URL}/api/auth/google`, {
        idToken,
      });
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      await AsyncStorage.setItem('token', res.data.token);

      const me = await axios.get(`${API_URL}/api/auth/me`);
      setUser({ token: res.data.token, ...me.data });
    } catch (err) {
      console.error(err);
      // Handle Google Sign-In error
    }
  };

  const logout = async () => {
    setUser(null);
    delete axios.defaults.headers.common['x-auth-token'];
    await AsyncStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, googleLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
