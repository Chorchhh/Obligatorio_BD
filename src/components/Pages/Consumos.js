import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Search,
  Coffee,
  Package,
  Calendar,
  Hash,
} from "lucide-react";
import apiService from "../../services/apiService";
import toast from "react-hot-toast";
import { format } from "date-fns";

const Consumos = () => {
  const [consumos, setConsumos] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingConsumo, setEditingConsumo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    id_maquina: "",
    id_insumo: "",
    fecha: "",
    cantidad_usada: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [consumosRes, maquinasRes, insumosRes] = await Promise.all([
        apiService.getRegistrosConsumo(),
        apiService.getMaquinas(),
        apiService.getInsumos(),
      ]);
      setConsumos(consumosRes.data);
      setMaquinas(maquinasRes.data);
      setInsumos(insumosRes.data);
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
        id_maquina: parseInt(formData.id_maquina),
        id_insumo: parseInt(formData.id_insumo),
        cantidad_usada: parseInt(formData.cantidad_usada),
      };

      if (editingConsumo) {
        await apiService.updateRegistroConsumo(editingConsumo.id, data);
        toast.success("Registro de consumo actualizado exitosamente");
      } else {
        await apiService.createRegistroConsumo(data);
        toast.success("Registro de consumo creado exitosamente");
      }

      setShowModal(false);
      setEditingConsumo(null);
      setFormData({
        id_maquina: "",
        id_insumo: "",
        fecha: "",
        cantidad_usada: "",
      });
      loadData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error al guardar registro de consumo"
      );
    }
  };

  const handleEdit = (consumo) => {
    setEditingConsumo(consumo);
    setFormData({
      id_maquina: consumo.id_maquina?.toString() || "",
      id_insumo: consumo.id_insumo?.toString() || "",
      fecha: consumo.fecha ? format(new Date(consumo.fecha), "yyyy-MM-dd") : "",
      cantidad_usada: consumo.cantidad_usada?.toString() || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "¿Está seguro de que desea eliminar este registro de consumo?"
      )
    ) {
      try {
        await apiService.deleteRegistroConsumo(id);
        toast.success("Registro de consumo eliminado exitosamente");
        loadData();
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Error al eliminar registro de consumo"
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

  const getMaquinaInfo = (id) => {
    const maquina = maquinas.find((m) => m.id === id);
    return maquina
      ? `${maquina.modelo} (ID: ${maquina.id})`
      : "Máquina desconocida";
  };

  const getInsumoInfo = (id) => {
    const insumo = insumos.find((i) => i.id === id);
    return insumo ? insumo.descripcion : "Insumo desconocido";
  };

  const getInsumoCosto = (id, cantidad) => {
    const insumo = insumos.find((i) => i.id === id);
    return insumo ? (insumo.precio_unitario * cantidad).toFixed(2) : "0.00";
  };

  const filteredConsumos = consumos.filter(
    (consumo) =>
      getMaquinaInfo(consumo.id_maquina)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      getInsumoInfo(consumo.id_insumo)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      consumo.fecha?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Cargando registros de consumo...</div>
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
            <TrendingUp size={32} />
            Registros de Consumo
          </h1>
          <p style={{ color: "#6b7280", marginTop: "8px" }}>
            Registra el consumo de insumos por máquina y fecha
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={18} />
          Nuevo Registro
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
              placeholder="Buscar registros de consumo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: "44px" }}
            />
          </div>
        </div>
      </div>

      <div className="card">
        {filteredConsumos.length === 0 ? (
          <div className="text-center" style={{ padding: "40px" }}>
            <TrendingUp
              size={48}
              style={{ color: "#d1d5db", marginBottom: "16px" }}
            />
            <p style={{ color: "#6b7280", fontSize: "18px" }}>
              {searchTerm
                ? "No se encontraron registros de consumo"
                : "No hay registros de consumo"}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Máquina</th>
                  <th>Insumo</th>
                  <th>Fecha</th>
                  <th>Cantidad</th>
                  <th>Costo Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredConsumos.map((consumo) => (
                  <tr key={consumo.id}>
                    <td>
                      <span className="badge badge-success">#{consumo.id}</span>
                    </td>
                    <td>
                      <div
                        className="flex"
                        style={{ alignItems: "center", gap: "8px" }}
                      >
                        <Coffee size={16} style={{ color: "#6b7280" }} />
                        <div
                          style={{
                            maxWidth: "150px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {getMaquinaInfo(consumo.id_maquina)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div
                        className="flex"
                        style={{ alignItems: "center", gap: "8px" }}
                      >
                        <Package size={16} style={{ color: "#6b7280" }} />
                        <div
                          style={{
                            maxWidth: "150px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {getInsumoInfo(consumo.id_insumo)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div
                        className="flex"
                        style={{ alignItems: "center", gap: "8px" }}
                      >
                        <Calendar size={16} style={{ color: "#6b7280" }} />
                        {consumo.fecha
                          ? format(new Date(consumo.fecha), "dd/MM/yyyy")
                          : "Sin fecha"}
                      </div>
                    </td>
                    <td>
                      <div
                        className="flex"
                        style={{ alignItems: "center", gap: "8px" }}
                      >
                        <Hash size={16} style={{ color: "#6b7280" }} />
                        <span style={{ fontWeight: "600" }}>
                          {consumo.cantidad_usada || 0}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: "600", color: "#059669" }}>
                        $
                        {getInsumoCosto(
                          consumo.id_insumo,
                          consumo.cantidad_usada
                        )}
                      </span>
                    </td>
                    <td>
                      <div className="flex" style={{ gap: "8px" }}>
                        <button
                          onClick={() => handleEdit(consumo)}
                          className="btn btn-secondary"
                          style={{ padding: "4px 8px" }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(consumo.id)}
                          className="btn btn-danger"
                          style={{ padding: "4px 8px" }}
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
              {editingConsumo
                ? "Editar Registro de Consumo"
                : "Nuevo Registro de Consumo"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Máquina *</label>
                <select
                  name="id_maquina"
                  value={formData.id_maquina}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Seleccionar máquina</option>
                  {maquinas.map((maquina) => (
                    <option key={maquina.id} value={maquina.id}>
                      {maquina.modelo} (ID: {maquina.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Insumo *</label>
                <select
                  name="id_insumo"
                  value={formData.id_insumo}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Seleccionar insumo</option>
                  {insumos.map((insumo) => (
                    <option key={insumo.id} value={insumo.id}>
                      {insumo.descripcion} - ${insumo.precio_unitario}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Fecha *</label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cantidad Usada *</label>
                <input
                  type="number"
                  name="cantidad_usada"
                  value={formData.cantidad_usada}
                  onChange={handleChange}
                  className="form-input"
                  required
                  min="1"
                  placeholder="Cantidad consumida"
                />
              </div>

              {formData.id_insumo && formData.cantidad_usada && (
                <div className="form-group">
                  <div
                    style={{
                      padding: "12px",
                      backgroundColor: "#f0fdf4",
                      borderRadius: "6px",
                      border: "1px solid #bbf7d0",
                    }}
                  >
                    <p
                      style={{ margin: 0, fontWeight: "500", color: "#059669" }}
                    >
                      Costo total: $
                      {getInsumoCosto(
                        parseInt(formData.id_insumo),
                        parseInt(formData.cantidad_usada) || 0
                      )}
                    </p>
                  </div>
                </div>
              )}

              <div
                className="flex"
                style={{ gap: "12px", justifyContent: "flex-end" }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingConsumo(null);
                    setFormData({
                      id_maquina: "",
                      id_insumo: "",
                      fecha: "",
                      cantidad_usada: "",
                    });
                  }}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingConsumo ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consumos;
