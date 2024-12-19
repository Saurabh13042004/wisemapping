import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

const AuthProvider = ({ children, navigate }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setUser({ name: "John Doe", email: "john@example.com" });
    }
  }, []);

  const login = (newToken) => {
    Cookies.set("token", newToken, { expires: 7 });
    setUser({ name: "John Doe", email: "john@example.com" });
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
