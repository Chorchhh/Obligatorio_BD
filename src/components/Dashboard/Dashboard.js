import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";
import {
  Coffee,
  Building2,
  Package,
  Users,
  Wrench,
  DollarSign,
  TrendingUp,
  Activity,
} from "lucide-react";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({});
  const [reportes, setReportes] = useState({
    ganancias: [],
    insumosPopulares: [],
    tecnicosActivos: [],
    clientesConMasMaquinas: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Cargar estadísticas básicas (simuladas para demo)
      const statsResponse = await Promise.allSettled([
        apiService.getClientes(),
        apiService.getMaquinas(),
        apiService.getInsumos(),
        apiService.getTecnicos(),
        apiService.getMantenimientos(),
        apiService.getRegistrosConsumo(),
      ]);

      const [clientes, maquinas, insumos, tecnicos, mantenimientos, consumos] =
        statsResponse.map((result) =>
          result.status === "fulfilled" ? result.value.data : []
        );

      setStats({
        totalClientes: clientes.length || 0,
        totalMaquinas: maquinas.length || 0,
        totalInsumos: insumos.length || 0,
        totalTecnicos: tecnicos.length || 0,
        totalMantenimientos: mantenimientos.length || 0,
        totalConsumos: consumos.length || 0,
      });

      // Cargar reportes
      if (isAdmin()) {
        const reportesResponse = await Promise.allSettled([
          apiService.getGananciasClientes(),
          apiService.getInsumosPopulares(),
          apiService.getTecnicosActivos(),
          apiService.getClientesConMasMaquinas(),
        ]);

        const [
          ganancias,
          insumosPopulares,
          tecnicosActivos,
          clientesConMasMaquinas,
        ] = reportesResponse.map((result) =>
          result.status === "fulfilled" ? result.value.data : []
        );

        setReportes({
          ganancias: ganancias.slice(0, 5) || [],
          insumosPopulares: insumosPopulares.slice(0, 5) || [],
          tecnicosActivos: tecnicosActivos.slice(0, 5) || [],
          clientesConMasMaquinas: clientesConMasMaquinas.slice(0, 5) || [],
        });
      }
    } catch (error) {
      console.error("Error cargando datos del dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <Activity size={24} style={{ marginRight: "8px" }} />
          Cargando dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "24px" }}>
      {/* Bienvenida */}
      <div className="mb-4">
        <h1
          style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px" }}
        >
          Bienvenido, {user?.correo?.split("@")[0]}
        </h1>
        <p style={{ color: "#6b7280", fontSize: "18px" }}>
          {isAdmin() ? "Panel de administración" : "Panel de cliente"}
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="stats-grid">
        <div className="stat-card">
          <Building2
            size={32}
            style={{ color: "#3b82f6", marginBottom: "12px" }}
          />
          <div className="stat-number">{stats.totalClientes}</div>
          <div className="stat-label">Clientes</div>
        </div>

        <div className="stat-card">
          <Coffee
            size={32}
            style={{ color: "#8b5cf6", marginBottom: "12px" }}
          />
          <div className="stat-number">{stats.totalMaquinas}</div>
          <div className="stat-label">Máquinas</div>
        </div>

        <div className="stat-card">
          <Package
            size={32}
            style={{ color: "#10b981", marginBottom: "12px" }}
          />
          <div className="stat-number">{stats.totalInsumos}</div>
          <div className="stat-label">Tipos de Insumos</div>
        </div>

        {isAdmin() && (
          <div className="stat-card">
            <Users
              size={32}
              style={{ color: "#f59e0b", marginBottom: "12px" }}
            />
            <div className="stat-number">{stats.totalTecnicos}</div>
            <div className="stat-label">Técnicos</div>
          </div>
        )}

        <div className="stat-card">
          <Wrench
            size={32}
            style={{ color: "#ef4444", marginBottom: "12px" }}
          />
          <div className="stat-number">{stats.totalMantenimientos}</div>
          <div className="stat-label">Mantenimientos</div>
        </div>

        <div className="stat-card">
          <TrendingUp
            size={32}
            style={{ color: "#06b6d4", marginBottom: "12px" }}
          />
          <div className="stat-number">{stats.totalConsumos}</div>
          <div className="stat-label">Registros de Consumo</div>
        </div>
      </div>

      {/* Reportes para administradores */}
      {isAdmin() && (
        <div className="grid grid-2">
          {/* Ganancias por cliente */}
          <div className="card">
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <DollarSign size={20} />
              Top Clientes por Ganancias
            </h3>
            {reportes.ganancias.length > 0 ? (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Ganancias</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportes.ganancias.map((item, index) => (
                      <tr key={index}>
                        <td>{item.cliente}</td>
                        <td>
                          ${item.ganancias_totales?.toLocaleString() || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: "#6b7280" }}>No hay datos disponibles</p>
            )}
          </div>

          {/* Insumos más populares */}
          <div className="card">
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Package size={20} />
              Insumos Más Consumidos
            </h3>
            {reportes.insumosPopulares.length > 0 ? (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Insumo</th>
                      <th>Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportes.insumosPopulares.map((item, index) => (
                      <tr key={index}>
                        <td>{item.descripcion}</td>
                        <td>{item.total_insumos?.toLocaleString() || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: "#6b7280" }}>No hay datos disponibles</p>
            )}
          </div>

          {/* Técnicos más activos */}
          <div className="card">
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Wrench size={20} />
              Técnicos Más Activos
            </h3>
            {reportes.tecnicosActivos.length > 0 ? (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Técnico</th>
                      <th>Mantenimientos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportes.tecnicosActivos.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {item.nombre} {item.apellido}
                        </td>
                        <td>{item.cantidad_mantenimientos || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: "#6b7280" }}>No hay datos disponibles</p>
            )}
          </div>

          {/* Clientes con más máquinas */}
          <div className="card">
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Building2 size={20} />
              Clientes con Más Máquinas
            </h3>
            {reportes.clientesConMasMaquinas.length > 0 ? (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Máquinas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportes.clientesConMasMaquinas.map((item, index) => (
                      <tr key={index}>
                        <td>{item.nombre}</td>
                        <td>{item.cantidad_maquinas || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: "#6b7280" }}>No hay datos disponibles</p>
            )}
          </div>
        </div>
      )}

      {/* Accesos rápidos */}
      <div className="card">
        <h3
          style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}
        >
          Accesos Rápidos
        </h3>
        <div className="grid grid-4">
          <a href="/clientes" className="btn btn-primary">
            <Building2 size={18} />
            Gestionar Clientes
          </a>
          <a href="/insumos" className="btn btn-secondary">
            <Package size={18} />
            Gestionar Insumos
          </a>
          <a href="/mantenimientos" className="btn btn-success">
            <Wrench size={18} />
            Mantenimientos
          </a>
          <a href="/consumos" className="btn btn-primary">
            <TrendingUp size={18} />
            Registrar Consumos
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
