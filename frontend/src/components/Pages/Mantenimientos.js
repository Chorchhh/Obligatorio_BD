import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";
import { Settings, Plus } from "lucide-react";
import toast from "react-hot-toast";

const Mantenimientos = () => {
  const { isAdmin } = useAuth();
  const [mantenimientos, setMantenimientos] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMantenimientos = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMantenimientos();
      setMantenimientos(response.data);
    } catch (error) {
      console.error("Error cargando mantenimientos:", error);
      toast.error("Error al cargar los mantenimientos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMantenimientos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Settings className="h-8 w-8 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Mantenimientos
          </h1>
        </div>
        {isAdmin() && (
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Mantenimiento
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {mantenimientos.map((mantenimiento) => (
          <div
            key={mantenimiento.id}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Settings className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="ml-5">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500">
                        Mantenimiento #{mantenimiento.id}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {mantenimiento.tipo_mantenimiento}
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    Fecha: {new Date(mantenimiento.fecha).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    Técnico: {mantenimiento.tecnico_nombre}
                  </div>
                </div>
              </div>

              {mantenimiento.descripcion && (
                <div className="mt-4">
                  <p className="text-sm text-gray-700">
                    {mantenimiento.descripcion}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {mantenimientos.length === 0 && (
        <div className="text-center py-12">
          <Settings className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay mantenimientos
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron mantenimientos registrados.
          </p>
        </div>
      )}
    </div>
  );
};

export default Mantenimientos;
