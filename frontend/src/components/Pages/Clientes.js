import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";
import {
  Building,
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";

const Clientes = () => {
  const { isAdmin } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    correo: "",
  });

  const loadClientes = async () => {
    try {
      setLoading(true);
      const response = await apiService.getClientes();
      setClientes(response.data);
      setFilteredClientes(response.data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
      toast.error("Error al cargar los clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  useEffect(() => {
    const filtered = clientes.filter(
      (cliente) =>
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.direccion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClientes(filtered);
  }, [searchTerm, clientes]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCliente) {
        await apiService.updateCliente(editingCliente.id, formData);
        toast.success("Cliente actualizado exitosamente");
      } else {
        await apiService.createCliente(formData);
        toast.success("Cliente creado exitosamente");
      }

      setShowModal(false);
      setEditingCliente(null);
      setFormData({ nombre: "", direccion: "", telefono: "", correo: "" });
      loadClientes();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.error || "Error al guardar el cliente");
    }
  };

  const handleEdit = (cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nombre: cliente.nombre,
      direccion: cliente.direccion,
      telefono: cliente.telefono,
      correo: cliente.correo,
    });
    setShowModal(true);
  };

  const handleDelete = async (cliente) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar el cliente "${cliente.nombre}"?`
      )
    ) {
      try {
        await apiService.deleteCliente(cliente.id);
        toast.success("Cliente eliminado exitosamente");
        loadClientes();
      } catch (error) {
        console.error("Error:", error);
        toast.error(
          error.response?.data?.error || "Error al eliminar el cliente"
        );
      }
    }
  };

  const openCreateModal = () => {
    setEditingCliente(null);
    setFormData({ nombre: "", direccion: "", telefono: "", correo: "" });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Building className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Clientes
          </h1>
        </div>
        {isAdmin() && (
          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar clientes por nombre, correo o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Clientes Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClientes.map((cliente) => (
          <div
            key={cliente.id}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Building className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Cliente
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {cliente.nombre}
                    </dd>
                  </dl>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="h-4 w-4 mr-2" />
                  {cliente.correo}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="h-4 w-4 mr-2" />
                  {cliente.telefono}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  {cliente.direccion}
                </div>
              </div>

              {isAdmin() && (
                <div className="mt-5 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(cliente)}
                    className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cliente)}
                    className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredClientes.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay clientes
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "No se encontraron clientes que coincidan con la búsqueda."
              : "Comienza creando un nuevo cliente."}
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCliente ? "Editar Cliente" : "Nuevo Cliente"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Dirección
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.direccion}
                    onChange={(e) =>
                      setFormData({ ...formData, direccion: e.target.value })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Correo
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.correo}
                    onChange={(e) =>
                      setFormData({ ...formData, correo: e.target.value })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {editingCliente ? "Actualizar" : "Crear"}
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

export default Clientes;
