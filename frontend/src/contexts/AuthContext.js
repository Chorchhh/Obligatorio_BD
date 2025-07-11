import React, { createContext, useState, useContext, useEffect } from "react";
import apiService from "../services/apiService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        apiService.setAuthToken(token);
      } catch (error) {
        console.error("Error al parsear datos del usuario:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (correo, contraseña) => {
    try {
      const response = await apiService.login(correo, contraseña);
      const { token, user: userData } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      apiService.setAuthToken(token);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Error al iniciar sesión",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    apiService.setAuthToken(null);
  };

  const isAdmin = () => {
    return user?.es_administrador === true;
  };

  const isClient = () => {
    return user?.es_administrador === false;
  };

  const value = {
    user,
    login,
    logout,
    isAdmin,
    isClient,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
