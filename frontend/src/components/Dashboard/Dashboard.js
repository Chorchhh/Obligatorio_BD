import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";
import {
  Users,
  Coffee,
  Package,
  Wrench,
  TrendingUp,
  Building,
  Truck,
  BarChart3,
} from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({});
  const [reportes, setReportes] = useState({
    gananciasClientes: [],
    insumosPopulares: [],
    tecnicosActivos: [],
    clientesMasMaquinas: [],
  });
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Cargar estadísticas básicas
      const statsResponse = await apiService.getDashboardStats();
      setStats(statsResponse.data);

      if (isAdmin()) {
        // Solo para admins: cargar reportes
        const [ganancias, insumos, tecnicos, clientes] = await Promise.all([
          apiService.getGananciasClientes(),
          apiService.getInsumosPopulares(),
          apiService.getTecnicosActivos(),
          apiService.getClientesConMasMaquinas(),
        ]);

        setReportes({
          gananciasClientes: ganancias.data.slice(0, 5),
          insumosPopulares: insumos.data.slice(0, 5),
          tecnicosActivos: tecnicos.data.slice(0, 5),
          clientesMasMaquinas: clientes.data.slice(0, 5),
        });
      }
    } catch (error) {
      console.error("Error cargando dashboard:", error);
      toast.error("Error al cargar los datos del dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Clientes",
      value: stats.totalClientes || 0,
      icon: Building,
      color: "blue",
      visible: true,
    },
    {
      title: "Máquinas",
      value: stats.totalMaquinas || 0,
      icon: Coffee,
      color: "amber",
      visible: true,
    },
    {
      title: "Insumos",
      value: stats.totalInsumos || 0,
      icon: Package,
      color: "green",
      visible: true,
    },
    {
      title: "Técnicos",
      value: stats.totalTecnicos || 0,
      icon: Users,
      color: "purple",
      visible: isAdmin(),
    },
    {
      title: "Mantenimientos",
      value: stats.totalMantenimientos || 0,
      icon: Wrench,
      color: "red",
      visible: true,
    },
    {
      title: "Consumos",
      value: stats.totalConsumos || 0,
      icon: BarChart3,
      color: "indigo",
      visible: true,
    },
  ].filter((card) => card.visible);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Coffee className="h-8 w-8 text-amber-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Bienvenido, {user?.nombre || user?.correo}
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    Dashboard - Cafés Marloy
                  </div>
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-amber-600">
                    {isAdmin() ? "Administrador" : "Cliente"}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className={`h-6 w-6 text-${card.color}-600`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {card.title}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {card.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reportes - Solo para Admins */}
      {isAdmin() && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ganancias por Cliente */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Top Clientes por Ganancias
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {reportes.gananciasClientes.map((cliente, index) => (
                  <li key={index} className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">
                        {cliente.cliente}
                      </div>
                      <div className="text-sm text-green-600 font-semibold">
                        ${cliente.ganancias_totales?.toLocaleString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Insumos Populares */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-600" />
                Insumos Más Populares
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {reportes.insumosPopulares.map((insumo, index) => (
                  <li key={index} className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">
                        {insumo.descripcion}
                      </div>
                      <div className="text-sm text-blue-600">
                        {insumo.total_insumos} unidades
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Técnicos Activos */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <Wrench className="h-5 w-5 mr-2 text-purple-600" />
                Técnicos Más Activos
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {reportes.tecnicosActivos.map((tecnico, index) => (
                  <li key={index} className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">
                        {tecnico.nombre} {tecnico.apellido}
                      </div>
                      <div className="text-sm text-purple-600">
                        {tecnico.cantidad_mantenimientos} servicios
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Clientes con Más Máquinas */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <Building className="h-5 w-5 mr-2 text-indigo-600" />
                Clientes con Más Máquinas
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {reportes.clientesMasMaquinas.map((cliente, index) => (
                  <li key={index} className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">
                        {cliente.nombre}
                      </div>
                      <div className="text-sm text-indigo-600">
                        {cliente.cantidad_maquinas} máquinas
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje para clientes */}
      {!isAdmin() && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Building className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Panel de Cliente
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Bienvenido al sistema de gestión de Cafés Marloy. Como
                  cliente, puedes acceder a la información de tus máquinas,
                  consultar insumos, ver el historial de mantenimientos y
                  registros de consumo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
