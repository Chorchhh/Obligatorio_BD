import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Coffee, Mail, Lock, AlertCircle } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    correo: "",
    contraseña: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, login } = useAuth();
  const location = useLocation();

  // Si ya está autenticado, redirigir
  if (user) {
    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(formData.correo, formData.contraseña);

    if (result.success) {
      const from = location.state?.from?.pathname || "/dashboard";
      window.location.href = from; // Forzar recarga completa
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #8B4513 0%, #D2691E 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex flex-center" style={{ marginBottom: "16px" }}>
            <Coffee size={48} style={{ color: "#8B4513" }} />
          </div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#1a202c",
              marginBottom: "8px",
            }}
          >
            Cafés Marloy
          </h1>
          <p style={{ color: "#6b7280" }}>Sistema Administrativo</p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="error flex"
            style={{ alignItems: "center", gap: "8px" }}
          >
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <Mail
                size={16}
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
              Correo electrónico
            </label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="form-input"
              placeholder="tu@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock
                size={16}
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
              Contraseña
            </label>
            <input
              type="password"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              className="form-input"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "16px" }}
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        {/* Información de prueba */}
        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            backgroundColor: "#f8fafc",
            borderRadius: "6px",
            fontSize: "14px",
            color: "#6b7280",
          }}
        >
          <p style={{ marginBottom: "8px", fontWeight: "500" }}>
            Usuarios de prueba:
          </p>
          <p style={{ margin: "4px 0" }}>
            <strong>Administrador:</strong> admin@cafesmarloy.com
          </p>
          <p style={{ margin: "4px 0" }}>
            <strong>Cliente:</strong> admin@techsoft.com
          </p>
          <p style={{ margin: "4px 0", fontSize: "12px" }}>
            (Contraseña: cualquier texto)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
