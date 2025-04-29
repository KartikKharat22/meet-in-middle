import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api'; // Ensure this points to your Axios instance

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Send OTP to user's phone
  const sendOTP = async (phone) => {
    try {
      setLoading(true);
      setError(null);
      
      // Format phone number to E.164 standard
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      const response = await API.post('/auth/send-otp', { 
        phone: formattedPhone 
      });

      if (response.data.success) {
        return { success: true };
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP sending failed');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and log user in
  const verifyOTP = async (phone, otp) => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.post('/auth/verify-otp', {
        phone,
        code: otp
      });

      if (response.data.success) {
        setUser({
          phone: response.data.user.phone,
          token: response.data.token
        });
        
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        
        navigate('/dashboard');
        return { success: true };
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Log user out
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  // Check if user is logged in (for persistent sessions)
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      try {
        const response = await API.get('/auth/me', {
          headers: { 'x-auth-token': token }
        });
        setUser(response.data.user);
      } catch (err) {
        localStorage.removeItem('token');
      }
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error, 
        sendOTP, 
        verifyOTP, 
        logout, 
        checkAuth 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}