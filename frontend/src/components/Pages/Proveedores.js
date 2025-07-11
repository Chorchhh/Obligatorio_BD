import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";
import { Truck, Plus, Search, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const Proveedores = () => {
  const { isAdmin } = useAuth();
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadProveedores = async () => {
    if (!isAdmin()) return;

    try {
      setLoading(true);
      const response = await apiService.getProveedores();
      setProveedores(response.data);
    } catch (error) {
      console.error("Error cargando proveedores:", error);
      toast.error("Error al cargar los proveedores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProveedores();
  }, []);

  if (!isAdmin()) {
    return (
      <div className="text-center py-12">
        <Truck className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Acceso Restringido
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Solo los administradores pueden ver los proveedores.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const filteredProveedores = proveedores.filter((proveedor) =>
    proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Truck className="h-8 w-8 text-orange-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Proveedores
          </h1>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Proveedor
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar proveedores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProveedores.map((proveedor) => (
          <div
            key={proveedor.id}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Truck className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Proveedor
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {proveedor.nombre}
                    </dd>
                  </dl>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <div className="text-sm text-gray-500">
                  {proveedor.telefono}
                </div>
                <div className="text-sm text-gray-500">
                  {proveedor.direccion}
                </div>
              </div>

              <div className="mt-5 flex justify-end space-x-2">
                <button className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Proveedores;
