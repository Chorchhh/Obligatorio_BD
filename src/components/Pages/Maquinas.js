import React, { useState, useEffect } from "react";
import {
  Coffee,
  Plus,
  Edit2,
  Trash2,
  Search,
  Building2,
  DollarSign,
  MapPin,
} from "lucide-react";
import apiService from "../../services/apiService";
import toast from "react-hot-toast";

const Maquinas = () => {
  const [maquinas, setMaquinas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMaquina, setEditingMaquina] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    modelo: "",
    id_cliente: "",
    ubicacion_cliente: "",
    costo_alquiler_mensual: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [maquinasRes, clientesRes] = await Promise.all([
        apiService.getMaquinas(),
        apiService.getClientes(),
      ]);
      setMaquinas(maquinasRes.data);
      setClientes(clientesRes.data);
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
        id_cliente: parseInt(formData.id_cliente),
        costo_alquiler_mensual: parseFloat(formData.costo_alquiler_mensual),
      };

      if (editingMaquina) {
        await apiService.updateMaquina(editingMaquina.id, data);
        toast.success("Máquina actualizada exitosamente");
      } else {
        await apiService.createMaquina(data);
        toast.success("Máquina creada exitosamente");
      }

      setShowModal(false);
      setEditingMaquina(null);
      setFormData({
        modelo: "",
        id_cliente: "",
        ubicacion_cliente: "",
        costo_alquiler_mensual: "",
      });
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al guardar máquina");
    }
  };

  const handleEdit = (maquina) => {
    setEditingMaquina(maquina);
    setFormData({
      modelo: maquina.modelo || "",
      id_cliente: maquina.id_cliente?.toString() || "",
      ubicacion_cliente: maquina.ubicacion_cliente || "",
      costo_alquiler_mensual: maquina.costo_alquiler_mensual?.toString() || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar esta máquina?")) {
      try {
        await apiService.deleteMaquina(id);
        toast.success("Máquina eliminada exitosamente");
        loadData();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Error al eliminar máquina"
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

  const getClienteNombre = (id) => {
    const cliente = clientes.find((c) => c.id === id);
    return cliente?.nombre || "Cliente desconocido";
  };

  const filteredMaquinas = maquinas.filter(
    (maquina) =>
      maquina.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maquina.ubicacion_cliente
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      getClienteNombre(maquina.id_cliente)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Cargando máquinas...</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "24px" }}>
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
            <Coffee size={32} />
            Gestión de Máquinas
          </h1>
          <p style={{ color: "#6b7280", marginTop: "8px" }}>
            Administra las máquinas expendedoras (Solo administradores)
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={18} />
          Nueva Máquina
        </button>
      </div>

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
              placeholder="Buscar máquinas por modelo, ubicación o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: "44px" }}
            />
          </div>
        </div>
      </div>

      <div className="card">
        {filteredMaquinas.length === 0 ? (
          <div className="text-center" style={{ padding: "40px" }}>
            <Coffee
              size={48}
              style={{ color: "#d1d5db", marginBottom: "16px" }}
            />
            <p style={{ color: "#6b7280", fontSize: "18px" }}>
              {searchTerm
                ? "No se encontraron máquinas"
                : "No hay máquinas registradas"}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Modelo</th>
                  <th>Cliente</th>
                  <th>Ubicación</th>
                  <th>Costo Mensual</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaquinas.map((maquina) => (
                  <tr key={maquina.id}>
                    <td>
                      <span className="badge badge-success">#{maquina.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: "500" }}>{maquina.modelo}</div>
                    </td>
                    <td>
                      <div
                        className="flex"
                        style={{ alignItems: "center", gap: "8px" }}
                      >
                        <Building2 size={16} style={{ color: "#6b7280" }} />
                        {getClienteNombre(maquina.id_cliente)}
                      </div>
                    </td>
                    <td>
                      <div
                        className="flex"
                        style={{ alignItems: "center", gap: "8px" }}
                      >
                        <MapPin size={16} style={{ color: "#6b7280" }} />
                        {maquina.ubicacion_cliente}
                      </div>
                    </td>
                    <td>
                      <div
                        className="flex"
                        style={{ alignItems: "center", gap: "8px" }}
                      >
                        <DollarSign size={16} style={{ color: "#6b7280" }} />
                        <span style={{ fontWeight: "600", color: "#059669" }}>
                          $
                          {maquina.costo_alquiler_mensual?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex" style={{ gap: "8px" }}>
                        <button
                          onClick={() => handleEdit(maquina)}
                          className="btn btn-secondary"
                          style={{ padding: "4px 8px" }}
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(maquina.id)}
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
              {editingMaquina ? "Editar Máquina" : "Nueva Máquina"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Modelo *</label>
                <input
                  type="text"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Modelo de la máquina"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cliente *</label>
                <select
                  name="id_cliente"
                  value={formData.id_cliente}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Seleccionar cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Ubicación en Cliente *</label>
                <input
                  type="text"
                  name="ubicacion_cliente"
                  value={formData.ubicacion_cliente}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Hall principal, Piso 2, etc."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Costo Alquiler Mensual *</label>
                <input
                  type="number"
                  name="costo_alquiler_mensual"
                  value={formData.costo_alquiler_mensual}
                  onChange={handleChange}
                  className="form-input"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
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
                    setEditingMaquina(null);
                    setFormData({
                      modelo: "",
                      id_cliente: "",
                      ubicacion_cliente: "",
                      costo_alquiler_mensual: "",
                    });
                  }}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMaquina ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maquinas;
