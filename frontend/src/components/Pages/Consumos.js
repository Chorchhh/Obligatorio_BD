import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";
import { BarChart3, Plus } from "lucide-react";
import toast from "react-hot-toast";

const Consumos = () => {
  const { isAdmin } = useAuth();
  const [consumos, setConsumos] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadConsumos = async () => {
    try {
      setLoading(true);
      const response = await apiService.getRegistrosConsumo();
      setConsumos(response.data);
    } catch (error) {
      console.error("Error cargando consumos:", error);
      toast.error("Error al cargar los registros de consumo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsumos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Registro de Consumos
          </h1>
        </div>
        {isAdmin() && (
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Registro
          </button>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {consumos.map((consumo) => (
            <li key={consumo.id} className="px-4 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BarChart3 className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {consumo.insumo_descripcion || "Insumo no especificado"}
                    </div>
                    <div className="text-sm text-gray-500">
                      Máquina #{consumo.id_maquina} - Cantidad:{" "}
                      {consumo.cantidad_usada}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-900 font-medium">
                    {new Date(consumo.fecha).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(consumo.fecha).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {consumos.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay registros de consumo
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron registros de consumo.
          </p>
        </div>
      )}
    </div>
  );
};

export default Consumos;
