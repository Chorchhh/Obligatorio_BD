import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Coffee, Mail, Lock, LogIn } from "lucide-react";
import toast from "react-hot-toast";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!correo || !contraseña) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const result = await login(correo, contraseña);

      if (result.success) {
        toast.success("¡Bienvenido!");
        navigate(from, { replace: true });
      } else {
        toast.error(result.error || "Error al iniciar sesión");
      }
    } catch (error) {
      toast.error("Error inesperado. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (userType) => {
    if (userType === "admin") {
      setCorreo("admin@cafesmarloy.com");
    } else {
      setCorreo("admin@techsoft.com");
    }
    setContraseña("demo");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo-container">
          <div className="logo-icon">
            <Coffee size={32} />
          </div>
        </div>

        <h2 className="title">Cafés Marloy</h2>
        <p className="subtitle">Sistema de Gestión Administrativa</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="correo" className="form-label">
              <Mail
                size={16}
                style={{ display: "inline", marginRight: "8px" }}
              />
              Correo electrónico
            </label>
            <input
              id="correo"
              name="correo"
              type="email"
              autoComplete="email"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="form-input"
              placeholder="usuario@ejemplo.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contraseña" className="form-label">
              <Lock
                size={16}
                style={{ display: "inline", marginRight: "8px" }}
              />
              Contraseña
            </label>
            <input
              id="contraseña"
              name="contraseña"
              type="password"
              autoComplete="current-password"
              required
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              className="form-input"
              placeholder="Tu contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            <LogIn size={16} style={{ marginRight: "8px" }} />
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <div
          style={{
            margin: "30px 0",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: "1px",
              background: "#e5e7eb",
            }}
          ></div>
          <span
            style={{
              background: "white",
              padding: "0 15px",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Usuarios de prueba
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            type="button"
            onClick={() => handleDemoLogin("admin")}
            className="btn btn-secondary btn-demo"
          >
            👨‍💼 Administrador
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin("client")}
            className="btn btn-secondary btn-demo"
          >
            🏢 Cliente
          </button>
        </div>

        <div className="text-center" style={{ marginTop: "20px" }}>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            ¿No tienes una cuenta?{" "}
            <Link
              to="/register"
              style={{
                color: "#8B4513",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Regístrate aquí
            </Link>
          </p>
        </div>

        <div
          className="text-center"
          style={{ marginTop: "30px", fontSize: "12px", color: "#6b7280" }}
        >
          <p>Universidad Católica del Uruguay</p>
          <p>Bases de Datos I - 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
