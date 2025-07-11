import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Coffee,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  UserPlus,
} from "lucide-react";
import toast from "react-hot-toast";
import apiService from "../../services/apiService";

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    telefono: "",
    direccion: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.nombre || !formData.correo || !formData.contraseña) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    if (formData.contraseña.length < 4) {
      toast.error("La contraseña debe tener al menos 4 caracteres");
      return;
    }

    setLoading(true);

    try {
      await apiService.register(formData);
      toast.success("¡Registro exitoso! Ya puedes iniciar sesión");
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al registrar usuario";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo-container">
          <div className="logo-icon">
            <Coffee size={32} />
          </div>
        </div>

        <h2 className="title">Registrarse</h2>
        <p className="subtitle">Crea tu cuenta en Cafés Marloy</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">
              <User
                size={16}
                style={{ display: "inline", marginRight: "8px" }}
              />
              Nombre de la empresa *
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              value={formData.nombre}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Nombre de tu empresa"
            />
          </div>

          <div className="form-group">
            <label htmlFor="correo" className="form-label">
              <Mail
                size={16}
                style={{ display: "inline", marginRight: "8px" }}
              />
              Correo electrónico *
            </label>
            <input
              id="correo"
              name="correo"
              type="email"
              required
              value={formData.correo}
              onChange={handleInputChange}
              className="form-input"
              placeholder="empresa@ejemplo.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contraseña" className="form-label">
              <Lock
                size={16}
                style={{ display: "inline", marginRight: "8px" }}
              />
              Contraseña *
            </label>
            <input
              id="contraseña"
              name="contraseña"
              type="password"
              required
              value={formData.contraseña}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Tu contraseña"
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono" className="form-label">
              <Phone
                size={16}
                style={{ display: "inline", marginRight: "8px" }}
              />
              Teléfono
            </label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleInputChange}
              className="form-input"
              placeholder="094 123 456"
            />
          </div>

          <div className="form-group">
            <label htmlFor="direccion" className="form-label">
              <MapPin
                size={16}
                style={{ display: "inline", marginRight: "8px" }}
              />
              Dirección
            </label>
            <input
              id="direccion"
              name="direccion"
              type="text"
              value={formData.direccion}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Dirección de tu empresa"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            <UserPlus size={16} style={{ marginRight: "8px" }} />
            {loading ? "Registrando..." : "Crear Cuenta"}
          </button>
        </form>

        <div className="text-center" style={{ marginTop: "20px" }}>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              style={{
                color: "#8B4513",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Iniciar Sesión
            </Link>
          </p>
        </div>

        <div
          className="text-center"
          style={{ marginTop: "30px", fontSize: "12px", color: "#6b7280" }}
        >
          <p style={{ fontSize: "11px", color: "#9ca3af" }}>
            * Campos obligatorios
          </p>
          <p>Universidad Católica del Uruguay</p>
          <p>Bases de Datos I - 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
