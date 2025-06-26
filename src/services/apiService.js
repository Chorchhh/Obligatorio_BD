import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Interceptor para manejar errores globalmente
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token) {
    if (token) {
      this.api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common["Authorization"];
    }
  }

  // Autenticación
  login(correo, contraseña) {
    return this.api.post("/auth/login", { correo, contraseña });
  }

  // Proveedores
  getProveedores() {
    return this.api.get("/proveedores");
  }

  createProveedor(data) {
    return this.api.post("/proveedores", data);
  }

  updateProveedor(id, data) {
    return this.api.put(`/proveedores/${id}`, data);
  }

  deleteProveedor(id) {
    return this.api.delete(`/proveedores/${id}`);
  }

  // Clientes
  getClientes() {
    return this.api.get("/clientes");
  }

  createCliente(data) {
    return this.api.post("/clientes", data);
  }

  updateCliente(id, data) {
    return this.api.put(`/clientes/${id}`, data);
  }

  deleteCliente(id) {
    return this.api.delete(`/clientes/${id}`);
  }

  // Técnicos
  getTecnicos() {
    return this.api.get("/tecnicos");
  }

  createTecnico(data) {
    return this.api.post("/tecnicos", data);
  }

  updateTecnico(ci, data) {
    return this.api.put(`/tecnicos/${ci}`, data);
  }

  deleteTecnico(ci) {
    return this.api.delete(`/tecnicos/${ci}`);
  }

  // Insumos
  getInsumos() {
    return this.api.get("/insumos");
  }

  createInsumo(data) {
    return this.api.post("/insumos", data);
  }

  updateInsumo(id, data) {
    return this.api.put(`/insumos/${id}`, data);
  }

  deleteInsumo(id) {
    return this.api.delete(`/insumos/${id}`);
  }

  // Máquinas
  getMaquinas() {
    return this.api.get("/maquinas");
  }

  createMaquina(data) {
    return this.api.post("/maquinas", data);
  }

  updateMaquina(id, data) {
    return this.api.put(`/maquinas/${id}`, data);
  }

  deleteMaquina(id) {
    return this.api.delete(`/maquinas/${id}`);
  }

  // Registro de consumo
  getRegistrosConsumo() {
    return this.api.get("/registro-consumo");
  }

  createRegistroConsumo(data) {
    return this.api.post("/registro-consumo", data);
  }

  updateRegistroConsumo(id, data) {
    return this.api.put(`/registro-consumo/${id}`, data);
  }

  deleteRegistroConsumo(id) {
    return this.api.delete(`/registro-consumo/${id}`);
  }

  // Mantenimientos
  getMantenimientos() {
    return this.api.get("/mantenimientos");
  }

  createMantenimiento(data) {
    return this.api.post("/mantenimientos", data);
  }

  updateMantenimiento(id, data) {
    return this.api.put(`/mantenimientos/${id}`, data);
  }

  deleteMantenimiento(id) {
    return this.api.delete(`/mantenimientos/${id}`);
  }

  // Reportes
  getGananciasClientes() {
    return this.api.get("/reportes/ganancias-clientes");
  }

  getInsumosPopulares() {
    return this.api.get("/reportes/insumos-populares");
  }

  getTecnicosActivos() {
    return this.api.get("/reportes/tecnicos-activos");
  }

  getClientesConMasMaquinas() {
    return this.api.get("/reportes/clientes-mas-maquinas");
  }

  getDashboardStats() {
    return this.api.get("/dashboard/stats");
  }
}

const apiService = new ApiService();
export default apiService;
