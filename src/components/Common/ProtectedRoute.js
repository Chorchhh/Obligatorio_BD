import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading">
        <div>Cargando...</div>
      </div>
    );
  }

  if (!user) {
    // Redirigir a login guardando la ubicación actual
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !user.es_administrador) {
    // Redirigir al dashboard si no es administrador
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
