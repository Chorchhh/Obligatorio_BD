import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";
import { Wrench, Plus, Search } from "lucide-react";
import toast from "react-hot-toast";

const Tecnicos = () => {
  const { isAdmin } = useAuth();
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTecnicos = async () => {
    if (!isAdmin()) return;

    try {
      setLoading(true);
      const response = await apiService.getTecnicos();
      setTecnicos(response.data);
    } catch (error) {
      console.error("Error cargando técnicos:", error);
      toast.error("Error al cargar los técnicos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTecnicos();
  }, []);

  if (!isAdmin()) {
    return (
      <div className="text-center py-12">
        <Wrench className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Acceso Restringido
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Solo los administradores pueden ver los técnicos.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Wrench className="h-8 w-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Técnicos
          </h1>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Técnico
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tecnicos.map((tecnico) => (
          <div
            key={tecnico.ci}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Wrench className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Técnico
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {tecnico.nombre} {tecnico.apellido}
                    </dd>
                  </dl>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <div className="text-sm text-gray-500">CI: {tecnico.ci}</div>
                <div className="text-sm text-gray-500">{tecnico.telefono}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tecnicos;
