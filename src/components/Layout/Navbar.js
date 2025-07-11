import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Coffee,
  LogOut,
  User,
  Settings,
  BarChart3,
  Package,
  Users,
  Wrench,
  Truck,
  Building2,
} from "lucide-react";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        background: "linear-gradient(135deg, #8B4513 0%, #D2691E 100%)",
        padding: "0 20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <div className="container">
        <div className="flex flex-between" style={{ padding: "16px 0" }}>
          {/* Logo y título */}
          <Link
            to="/dashboard"
            className="flex"
            style={{
              alignItems: "center",
              textDecoration: "none",
              color: "white",
              gap: "12px",
            }}
          >
            <Coffee size={32} />
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                Cafés Marloy
              </h1>
              <p style={{ fontSize: "14px", margin: 0, opacity: 0.9 }}>
                Sistema Administrativo
              </p>
            </div>
          </Link>

          {/* Menú de navegación */}
          <div className="flex" style={{ alignItems: "center", gap: "20px" }}>
            <div className="flex" style={{ gap: "16px" }}>
              {/* Dashboard */}
              <Link
                to="/dashboard"
                className="flex"
                style={{
                  alignItems: "center",
                  gap: "8px",
                  color: "white",
                  textDecoration: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <BarChart3 size={18} />
                Dashboard
              </Link>

              {/* Menús según permisos */}
              {isAdmin() && (
                <>
                  <Link
                    to="/proveedores"
                    className="flex"
                    style={{
                      alignItems: "center",
                      gap: "8px",
                      color: "white",
                      textDecoration: "none",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    <Truck size={18} />
                    Proveedores
                  </Link>

                  <Link
                    to="/tecnicos"
                    className="flex"
                    style={{
                      alignItems: "center",
                      gap: "8px",
                      color: "white",
                      textDecoration: "none",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    <Wrench size={18} />
                    Técnicos
                  </Link>

                  <Link
                    to="/maquinas"
                    className="flex"
                    style={{
                      alignItems: "center",
                      gap: "8px",
                      color: "white",
                      textDecoration: "none",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    <Coffee size={18} />
                    Máquinas
                  </Link>
                </>
              )}

              <Link
                to="/clientes"
                className="flex"
                style={{
                  alignItems: "center",
                  gap: "8px",
                  color: "white",
                  textDecoration: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <Building2 size={18} />
                Clientes
              </Link>

              <Link
                to="/insumos"
                className="flex"
                style={{
                  alignItems: "center",
                  gap: "8px",
                  color: "white",
                  textDecoration: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <Package size={18} />
                Insumos
              </Link>

              <Link
                to="/mantenimientos"
                className="flex"
                style={{
                  alignItems: "center",
                  gap: "8px",
                  color: "white",
                  textDecoration: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <Settings size={18} />
                Mantenimientos
              </Link>

              <Link
                to="/consumos"
                className="flex"
                style={{
                  alignItems: "center",
                  gap: "8px",
                  color: "white",
                  textDecoration: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <BarChart3 size={18} />
                Consumos
              </Link>
            </div>

            {/* Usuario y logout */}
            <div className="flex" style={{ alignItems: "center", gap: "12px" }}>
              <div
                className="flex"
                style={{ alignItems: "center", gap: "8px", color: "white" }}
              >
                <User size={18} />
                <div>
                  <span style={{ fontSize: "14px", fontWeight: "500" }}>
                    {user?.correo}
                  </span>
                  {isAdmin() && (
                    <div style={{ fontSize: "12px", opacity: 0.8 }}>
                      Administrador
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex"
                style={{
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "rgba(255,255,255,0.2)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
                }
              >
                <LogOut size={18} />
                Salir
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
