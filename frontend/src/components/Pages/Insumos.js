import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";
import { Package, Plus, Search, Edit, Trash2, DollarSign } from "lucide-react";
import toast from "react-hot-toast";

const Insumos = () => {
  const { isAdmin } = useAuth();
  const [insumos, setInsumos] = useState([]);
  const [filteredInsumos, setFilteredInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingInsumo, setEditingInsumo] = useState(null);
  const [formData, setFormData] = useState({
    descripcion: "",
    precio_unitario: "",
  });

  const loadInsumos = async () => {
    try {
      setLoading(true);
      const response = await apiService.getInsumos();
      setInsumos(response.data);
      setFilteredInsumos(response.data);
    } catch (error) {
      console.error("Error cargando insumos:", error);
      toast.error("Error al cargar los insumos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsumos();
  }, []);

  useEffect(() => {
    const filtered = insumos.filter((insumo) =>
      insumo.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInsumos(filtered);
  }, [searchTerm, insumos]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingInsumo) {
        await apiService.updateInsumo(editingInsumo.id, formData);
        toast.success("Insumo actualizado exitosamente");
      } else {
        await apiService.createInsumo(formData);
        toast.success("Insumo creado exitosamente");
      }

      setShowModal(false);
      setEditingInsumo(null);
      setFormData({ descripcion: "", precio_unitario: "" });
      loadInsumos();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.error || "Error al guardar el insumo");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Package className="h-8 w-8 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Insumos
          </h1>
        </div>
        {isAdmin() && (
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Insumo
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar insumos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredInsumos.map((insumo) => (
          <div
            key={insumo.id}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Insumo
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {insumo.descripcion}
                    </dd>
                  </dl>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center text-sm text-gray-500">
                  <DollarSign className="h-4 w-4 mr-2" />$
                  {insumo.precio_unitario}
                </div>
              </div>

              {isAdmin() && (
                <div className="mt-5 flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setEditingInsumo(insumo);
                      setFormData({
                        descripcion: insumo.descripcion,
                        precio_unitario: insumo.precio_unitario,
                      });
                      setShowModal(true);
                    }}
                    className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingInsumo ? "Editar Insumo" : "Nuevo Insumo"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Descripción
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Precio Unitario
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.precio_unitario}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        precio_unitario: e.target.value,
                      })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingInsumo(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    {editingInsumo ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insumos;
