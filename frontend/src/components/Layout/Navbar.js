import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  LogOut,
  Home,
  Building,
  Package,
  Truck,
  Wrench,
  Coffee,
  Settings,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home, forAll: true },
    { path: "/clientes", label: "Clientes", icon: Building, forAll: true },
    { path: "/insumos", label: "Insumos", icon: Package, forAll: true },
    {
      path: "/mantenimientos",
      label: "Mantenimientos",
      icon: Settings,
      forAll: true,
    },
    { path: "/consumos", label: "Consumos", icon: BarChart3, forAll: true },
    { path: "/proveedores", label: "Proveedores", icon: Truck, forAll: false },
    { path: "/tecnicos", label: "Técnicos", icon: Wrench, forAll: false },
    { path: "/maquinas", label: "Máquinas", icon: Coffee, forAll: false },
  ];

  const visibleItems = menuItems.filter((item) => item.forAll || isAdmin());

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo y título */}
          <div className="flex items-center">
            <Coffee className="h-8 w-8 text-amber-600 mr-2" />
            <span className="text-xl font-bold text-gray-800">
              Cafés Marloy
            </span>
          </div>

          {/* Menú desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-amber-100 text-amber-700"
                      : "text-gray-600 hover:text-amber-600 hover:bg-amber-50"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Usuario y logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-sm text-gray-600">
              <span className="font-medium">
                {user?.nombre || user?.correo}
              </span>
              <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                {isAdmin() ? "Admin" : "Cliente"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden md:inline">Salir</span>
            </button>

            {/* Botón menú móvil */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-amber-600"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <div className="px-3 py-2 text-sm text-gray-600 border-b">
              <span className="font-medium">
                {user?.nombre || user?.correo}
              </span>
              <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                {isAdmin() ? "Admin" : "Cliente"}
              </span>
            </div>
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-amber-100 text-amber-700"
                      : "text-gray-600 hover:text-amber-600 hover:bg-amber-50"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
