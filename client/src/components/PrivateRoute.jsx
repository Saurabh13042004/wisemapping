import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from '../api/axiosInstance';

const PrivateRoute = ({ children }) => {
  const [isTokenValid, setIsTokenValid] = useState(null);
  const token = Cookies.get('token');

  useEffect(() => {
    if (token) {
      const checkToken = async () => {
        try {
          const response = await axios.post('/check-token', {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
          if (response.data.isValid) {
            setIsTokenValid(true);
          } else {
            setIsTokenValid(false);
          }
        } catch (error) {
          setIsTokenValid(false);
        }
      };
      checkToken();
    } else {
      console.error('Error checking token health:', error);
      setIsTokenValid(false);
    }
  }, [token]);

  if (isTokenValid === null) {
    return <div>Loading...</div>;
  }

  if (isTokenValid === false) {
    const currentPath = window.location.pathname;
    if (currentPath === '/login' || currentPath === '/register' || currentPath === '/') {
      return children;
    }
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;