import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const RedirectIfLoggedIn = ({ children }) => {
  const token = Cookies.get('token');
  return token ? <Navigate to="/dashboard" /> : children;
};

export default RedirectIfLoggedIn;