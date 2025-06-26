import React, { useState, useEffect } from "react";
import { Wrench, Plus, Edit2, Trash2, Search, Phone, User } from "lucide-react";
import apiService from "../../services/apiService";
import toast from "react-hot-toast";

const Tecnicos = () => {
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTecnico, setEditingTecnico] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    ci: "",
    nombre: "",
    apellido: "",
    telefono: "",
  });

  useEffect(() => {
    loadTecnicos();
  }, []);

  const loadTecnicos = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTecnicos();
      setTecnicos(response.data);
    } catch (error) {
      toast.error("Error al cargar técnicos");
      console.error("Error cargando técnicos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, ci: parseInt(formData.ci) };

      if (editingTecnico) {
        await apiService.updateTecnico(editingTecnico.ci, data);
        toast.success("Técnico actualizado exitosamente");
      } else {
        await apiService.createTecnico(data);
        toast.success("Técnico creado exitosamente");
      }

      setShowModal(false);
      setEditingTecnico(null);
      setFormData({ ci: "", nombre: "", apellido: "", telefono: "" });
      loadTecnicos();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al guardar técnico");
    }
  };

  const handleEdit = (tecnico) => {
    setEditingTecnico(tecnico);
    setFormData({
      ci: tecnico.ci?.toString() || "",
      nombre: tecnico.nombre || "",
      apellido: tecnico.apellido || "",
      telefono: tecnico.telefono || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (ci) => {
    if (window.confirm("¿Está seguro de que desea eliminar este técnico?")) {
      try {
        await apiService.deleteTecnico(ci);
        toast.success("Técnico eliminado exitosamente");
        loadTecnicos();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Error al eliminar técnico"
        );
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const filteredTecnicos = tecnicos.filter(
    (tecnico) =>
      tecnico.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tecnico.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tecnico.ci?.toString().includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Cargando técnicos...</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "24px" }}>
      {/* Header */}
      <div className="flex flex-between mb-4">
        <div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Wrench size={32} />
            Gestión de Técnicos
          </h1>
          <p style={{ color: "#6b7280", marginTop: "8px" }}>
            Administra los técnicos del sistema (Solo administradores)
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={18} />
          Nuevo Técnico
        </button>
      </div>

      {/* Buscador */}
      <div className="card">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <div style={{ position: "relative" }}>
            <Search
              size={20}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6b7280",
              }}
            />
            <input
              type="text"
              placeholder="Buscar técnicos por nombre, apellido o CI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: "44px" }}
            />
          </div>
        </div>
      </div>

      {/* Lista de técnicos */}
      <div className="card">
        {filteredTecnicos.length === 0 ? (
          <div className="text-center" style={{ padding: "40px" }}>
            <Wrench
              size={48}
              style={{ color: "#d1d5db", marginBottom: "16px" }}
            />
            <p style={{ color: "#6b7280", fontSize: "18px" }}>
              {searchTerm
                ? "No se encontraron técnicos que coincidan con la búsqueda"
                : "No hay técnicos registrados"}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>CI</th>
                  <th>Nombre Completo</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTecnicos.map((tecnico) => (
                  <tr key={tecnico.ci}>
                    <td>
                      <span className="badge badge-success">{tecnico.ci}</span>
                    </td>
                    <td>
                      <div
                        className="flex"
                        style={{ alignItems: "center", gap: "8px" }}
                      >
                        <User size={16} style={{ color: "#6b7280" }} />
                        <span style={{ fontWeight: "500" }}>
                          {tecnico.nombre} {tecnico.apellido}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div
                        className="flex"
                        style={{ alignItems: "center", gap: "8px" }}
                      >
                        <Phone size={16} style={{ color: "#6b7280" }} />
                        {tecnico.telefono || "Sin teléfono"}
                      </div>
                    </td>
                    <td>
                      <div className="flex" style={{ gap: "8px" }}>
                        <button
                          onClick={() => handleEdit(tecnico)}
                          className="btn btn-secondary"
                          style={{ padding: "4px 8px" }}
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(tecnico.ci)}
                          className="btn btn-danger"
                          style={{ padding: "4px 8px" }}
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="card"
            style={{ width: "100%", maxWidth: "500px", margin: "20px" }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "24px",
              }}
            >
              {editingTecnico ? "Editar Técnico" : "Nuevo Técnico"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">CI *</label>
                <input
                  type="number"
                  name="ci"
                  value={formData.ci}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Cédula de identidad"
                  disabled={editingTecnico} // No permitir cambiar CI al editar
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Nombre del técnico"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Apellido *</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Apellido del técnico"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="094 123 456"
                />
              </div>

              <div
                className="flex"
                style={{ gap: "12px", justifyContent: "flex-end" }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTecnico(null);
                    setFormData({
                      ci: "",
                      nombre: "",
                      apellido: "",
                      telefono: "",
                    });
                  }}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTecnico ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tecnicos;
