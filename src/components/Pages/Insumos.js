import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  DollarSign,
  Tag,
  Truck,
} from "lucide-react";
import apiService from "../../services/apiService";
import toast from "react-hot-toast";

const Insumos = () => {
  const [insumos, setInsumos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInsumo, setEditingInsumo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    descripcion: "",
    tipo: "",
    precio_unitario: "",
    id_proveedor: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [insumosRes, proveedoresRes] = await Promise.all([
        apiService.getInsumos(),
        apiService.getProveedores(),
      ]);
      setInsumos(insumosRes.data);
      setProveedores(proveedoresRes.data);
    } catch (error) {
      toast.error("Error al cargar datos");
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        precio_unitario: parseFloat(formData.precio_unitario),
        id_proveedor: parseInt(formData.id_proveedor) || null,
      };

      if (editingInsumo) {
        await apiService.updateInsumo(editingInsumo.id, data);
        toast.success("Insumo actualizado exitosamente");
      } else {
        await apiService.createInsumo(data);
        toast.success("Insumo creado exitosamente");
      }

      setShowModal(false);
      setEditingInsumo(null);
      setFormData({
        descripcion: "",
        tipo: "",
        precio_unitario: "",
        id_proveedor: "",
      });
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al guardar insumo");
    }
  };

  const handleEdit = (insumo) => {
    setEditingInsumo(insumo);
    setFormData({
      descripcion: insumo.descripcion || "",
      tipo: insumo.tipo || "",
      precio_unitario: insumo.precio_unitario?.toString() || "",
      id_proveedor: insumo.id_proveedor?.toString() || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este insumo?")) {
      try {
        await apiService.deleteInsumo(id);
        toast.success("Insumo eliminado exitosamente");
        loadData();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Error al eliminar insumo"
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

  const getProveedorNombre = (id) => {
    const proveedor = proveedores.find((p) => p.id === id);
    return proveedor?.nombre || "Sin proveedor";
  };

  const filteredInsumos = insumos.filter(
    (insumo) =>
      insumo.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insumo.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getProveedorNombre(insumo.id_proveedor)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Cargando insumos...</div>
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
            <Package size={32} />
            Gestión de Insumos
          </h1>
          <p style={{ color: "#6b7280", marginTop: "8px" }}>
            Administra los insumos del sistema
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={18} />
          Nuevo Insumo
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
              placeholder="Buscar insumos por descripción, tipo o proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: "44px" }}
            />
          </div>
        </div>
      </div>

      {/* Lista de insumos */}
      <div className="card">
        {filteredInsumos.length === 0 ? (
          <div className="text-center" style={{ padding: "40px" }}>
            <Package
              size={48}
              style={{ color: "#d1d5db", marginBottom: "16px" }}
            />
            <p style={{ color: "#6b7280", fontSize: "18px" }}>
              {searchTerm
                ? "No se encontraron insumos que coincidan con la búsqueda"
                : "No hay insumos registrados"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-primary mt-4"
              >
                <Plus size={18} />
                Crear primer insumo
              </button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Tipo</th>
                  <th>Precio Unitario</th>
                  <th>Proveedor</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredInsumos.map((insumo) => (
                  <tr key={insumo.id}>
                    <td>
                      <div style={{ fontWeight: "500" }}>
                        {insumo.descripcion}
                      </div>
                    </td>
                    <td>
                      <div
                        className="flex"
                        style={{ alignItems: "center", gap: "8px" }}
                      >
                        <Tag size={16} style={{ color: "#6b7280" }} />
                        <span className="badge badge-success">
                          {insumo.tipo || "Sin tipo"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div
                        className="flex"
                        style={{ alignItems: "center", gap: "8px" }}
                      >
                        <DollarSign size={16} style={{ color: "#6b7280" }} />
                        <span style={{ fontWeight: "600", color: "#059669" }}>
                          ${insumo.precio_unitario?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div
                        className="flex"
                        style={{ alignItems: "center", gap: "8px" }}
                      >
                        <Truck size={16} style={{ color: "#6b7280" }} />
                        {getProveedorNombre(insumo.id_proveedor)}
                      </div>
                    </td>
                    <td>
                      <div className="flex" style={{ gap: "8px" }}>
                        <button
                          onClick={() => handleEdit(insumo)}
                          className="btn btn-secondary"
                          style={{ padding: "4px 8px" }}
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(insumo.id)}
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
              {editingInsumo ? "Editar Insumo" : "Nuevo Insumo"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Descripción *</label>
                <input
                  type="text"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Descripción del insumo"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tipo</label>
                <input
                  type="text"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Tipo de insumo (ej: Café, Lácteo, Endulzante)"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Precio Unitario *</label>
                <input
                  type="number"
                  name="precio_unitario"
                  value={formData.precio_unitario}
                  onChange={handleChange}
                  className="form-input"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Proveedor</label>
                <select
                  name="id_proveedor"
                  value={formData.id_proveedor}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Seleccionar proveedor</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor.id} value={proveedor.id}>
                      {proveedor.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className="flex"
                style={{ gap: "12px", justifyContent: "flex-end" }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingInsumo(null);
                    setFormData({
                      descripcion: "",
                      tipo: "",
                      precio_unitario: "",
                      id_proveedor: "",
                    });
                  }}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingInsumo ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insumos;
