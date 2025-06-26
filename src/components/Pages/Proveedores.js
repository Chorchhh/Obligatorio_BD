import React, { useState, useEffect } from "react";
import { Truck, Plus, Edit2, Trash2, Search, Phone } from "lucide-react";
import apiService from "../../services/apiService";
import toast from "react-hot-toast";

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    contacto: "",
  });

  useEffect(() => {
    loadProveedores();
  }, []);

  const loadProveedores = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProveedores();
      setProveedores(response.data);
    } catch (error) {
      toast.error("Error al cargar proveedores");
      console.error("Error cargando proveedores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProveedor) {
        await apiService.updateProveedor(editingProveedor.id, formData);
        toast.success("Proveedor actualizado exitosamente");
      } else {
        await apiService.createProveedor(formData);
        toast.success("Proveedor creado exitosamente");
      }

      setShowModal(false);
      setEditingProveedor(null);
      setFormData({ nombre: "", contacto: "" });
      loadProveedores();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error al guardar proveedor"
      );
    }
  };

  const handleEdit = (proveedor) => {
    setEditingProveedor(proveedor);
    setFormData({
      nombre: proveedor.nombre || "",
      contacto: proveedor.contacto || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este proveedor?")) {
      try {
        await apiService.deleteProveedor(id);
        toast.success("Proveedor eliminado exitosamente");
        loadProveedores();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Error al eliminar proveedor"
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

  const filteredProveedores = proveedores.filter(
    (proveedor) =>
      proveedor.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.contacto?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Cargando proveedores...</div>
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
            <Truck size={32} />
            Gestión de Proveedores
          </h1>
          <p style={{ color: "#6b7280", marginTop: "8px" }}>
            Administra los proveedores del sistema (Solo administradores)
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={18} />
          Nuevo Proveedor
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
              placeholder="Buscar proveedores por nombre o contacto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: "44px" }}
            />
          </div>
        </div>
      </div>

      {/* Lista de proveedores */}
      <div className="card">
        {filteredProveedores.length === 0 ? (
          <div className="text-center" style={{ padding: "40px" }}>
            <Truck
              size={48}
              style={{ color: "#d1d5db", marginBottom: "16px" }}
            />
            <p style={{ color: "#6b7280", fontSize: "18px" }}>
              {searchTerm
                ? "No se encontraron proveedores que coincidan con la búsqueda"
                : "No hay proveedores registrados"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-primary mt-4"
              >
                <Plus size={18} />
                Crear primer proveedor
              </button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Contacto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProveedores.map((proveedor) => (
                  <tr key={proveedor.id}>
                    <td>
                      <span className="badge badge-success">
                        #{proveedor.id}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: "500" }}>
                        {proveedor.nombre}
                      </div>
                    </td>
                    <td>
                      <div
                        className="flex"
                        style={{ alignItems: "center", gap: "8px" }}
                      >
                        <Phone size={16} style={{ color: "#6b7280" }} />
                        {proveedor.contacto || "Sin contacto"}
                      </div>
                    </td>
                    <td>
                      <div className="flex" style={{ gap: "8px" }}>
                        <button
                          onClick={() => handleEdit(proveedor)}
                          className="btn btn-secondary"
                          style={{ padding: "4px 8px" }}
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(proveedor.id)}
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
              {editingProveedor ? "Editar Proveedor" : "Nuevo Proveedor"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Nombre del proveedor"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contacto</label>
                <input
                  type="text"
                  name="contacto"
                  value={formData.contacto}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Teléfono o contacto"
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
                    setEditingProveedor(null);
                    setFormData({ nombre: "", contacto: "" });
                  }}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProveedor ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Proveedores;
