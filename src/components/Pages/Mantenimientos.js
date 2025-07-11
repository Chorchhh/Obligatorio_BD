import React, { useState, useEffect } from "react";
import {
  Settings,
  Plus,
  Edit2,
  Trash2,
  Search,
  Coffee,
  User,
  Calendar,
  Clock,
} from "lucide-react";
import apiService from "../../services/apiService";
import toast from "react-hot-toast";
import { format } from "date-fns";

const Mantenimientos = () => {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMantenimiento, setEditingMantenimiento] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    id_maquina: "",
    ci_tecnico: "",
    tipo: "",
    fecha: "",
    observaciones: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [mantenimientosRes, maquinasRes, tecnicosRes] = await Promise.all([
        apiService.getMantenimientos(),
        apiService.getMaquinas(),
        apiService.getTecnicos(),
      ]);
      setMantenimientos(mantenimientosRes.data);
      setMaquinas(maquinasRes.data);
      setTecnicos(tecnicosRes.data);
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
        ci_tecnico: parseInt(formData.ci_tecnico),
      };

      if (editingMantenimiento) {
        await apiService.updateMantenimiento(editingMantenimiento.id, data);
        toast.success("Mantenimiento actualizado exitosamente");
      } else {
        await apiService.createMantenimiento(data);
        toast.success("Mantenimiento creado exitosamente");
      }

      setShowModal(false);
      setEditingMantenimiento(null);
      setFormData({
        id_maquina: "",
        ci_tecnico: "",
        tipo: "",
        fecha: "",
        observaciones: "",
      });
      loadData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error al guardar mantenimiento"
      );
    }
  };

  const handleEdit = (mantenimiento) => {
    setEditingMantenimiento(mantenimiento);
    setFormData({
      id_maquina: mantenimiento.id_maquina?.toString() || "",
      ci_tecnico: mantenimiento.ci_tecnico?.toString() || "",
      tipo: mantenimiento.tipo || "",
      fecha: mantenimiento.fecha
        ? format(new Date(mantenimiento.fecha), "yyyy-MM-dd'T'HH:mm")
        : "",
      observaciones: mantenimiento.observaciones || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("¿Está seguro de que desea eliminar este mantenimiento?")
    ) {
      try {
        await apiService.deleteMantenimiento(id);
        toast.success("Mantenimiento eliminado exitosamente");
        loadData();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Error al eliminar mantenimiento"
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

  const getTecnicoInfo = (ci) => {
    const tecnico = tecnicos.find((t) => t.ci === ci);
    return tecnico
      ? `${tecnico.nombre} ${tecnico.apellido}`
      : "Técnico desconocido";
  };

  const filteredMantenimientos = mantenimientos.filter(
    (mantenimiento) =>
      mantenimiento.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mantenimiento.observaciones
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      getMaquinaInfo(mantenimiento.id_maquina)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      getTecnicoInfo(mantenimiento.ci_tecnico)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Cargando mantenimientos...</div>
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
            <Settings size={32} />
            Gestión de Mantenimientos
          </h1>
          <p style={{ color: "#6b7280", marginTop: "8px" }}>
            Registra y administra los mantenimientos de las máquinas
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={18} />
          Nuevo Mantenimiento
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
              placeholder="Buscar mantenimientos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: "44px" }}
            />
          </div>
        </div>
      </div>

      <div className="card">
        {filteredMantenimientos.length === 0 ? (
          <div className="text-center" style={{ padding: "40px" }}>
            <Settings
              size={48}
              style={{ color: "#d1d5db", marginBottom: "16px" }}
            />
            <p style={{ color: "#6b7280", fontSize: "18px" }}>
              {searchTerm
                ? "No se encontraron mantenimientos"
                : "No hay mantenimientos registrados"}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Máquina</th>
                  <th>Técnico</th>
                  <th>Tipo</th>
                  <th>Fecha</th>
                  <th>Observaciones</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredMantenimientos.map((mantenimiento) => (
                  <tr key={mantenimiento.id}>
                    <td>
                      <span className="badge badge-success">
                        #{mantenimiento.id}
                      </span>
                    </td>
                    <td>
                      <div
                        className="flex"
                        style={{ alignItems: "center", gap: "8px" }}
                      >
                        <Coffee size={16} style={{ color: "#6b7280" }} />
                        {getMaquinaInfo(mantenimiento.id_maquina)}
                      </div>
                    </td>
                    <td>
                      <div
                        className="flex"
                        style={{ alignItems: "center", gap: "8px" }}
                      >
                        <User size={16} style={{ color: "#6b7280" }} />
                        {getTecnicoInfo(mantenimiento.ci_tecnico)}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          mantenimiento.tipo === "Preventivo"
                            ? "badge-success"
                            : "badge-warning"
                        }`}
                      >
                        {mantenimiento.tipo}
                      </span>
                    </td>
                    <td>
                      <div
                        className="flex"
                        style={{ alignItems: "center", gap: "8px" }}
                      >
                        <Calendar size={16} style={{ color: "#6b7280" }} />
                        {mantenimiento.fecha
                          ? format(
                              new Date(mantenimiento.fecha),
                              "dd/MM/yyyy HH:mm"
                            )
                          : "Sin fecha"}
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {mantenimiento.observaciones || "Sin observaciones"}
                      </div>
                    </td>
                    <td>
                      <div className="flex" style={{ gap: "8px" }}>
                        <button
                          onClick={() => handleEdit(mantenimiento)}
                          className="btn btn-secondary"
                          style={{ padding: "4px 8px" }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(mantenimiento.id)}
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
              {editingMantenimiento
                ? "Editar Mantenimiento"
                : "Nuevo Mantenimiento"}
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
                <label className="form-label">Técnico *</label>
                <select
                  name="ci_tecnico"
                  value={formData.ci_tecnico}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Seleccionar técnico</option>
                  {tecnicos.map((tecnico) => (
                    <option key={tecnico.ci} value={tecnico.ci}>
                      {tecnico.nombre} {tecnico.apellido}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tipo de Mantenimiento *</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Preventivo">Preventivo</option>
                  <option value="Correctivo">Correctivo</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Fecha y Hora *</label>
                <input
                  type="datetime-local"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Observaciones</label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Detalles del mantenimiento realizado"
                  rows="3"
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
                    setEditingMantenimiento(null);
                    setFormData({
                      id_maquina: "",
                      ci_tecnico: "",
                      tipo: "",
                      fecha: "",
                      observaciones: "",
                    });
                  }}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMantenimiento ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mantenimientos;
