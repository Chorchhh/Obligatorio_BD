import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import Navbar from "./components/Layout/Navbar";

// Páginas
import Login from "./components/Auth/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Clientes from "./components/Pages/Clientes";
import Proveedores from "./components/Pages/Proveedores";
import Tecnicos from "./components/Pages/Tecnicos";
import Insumos from "./components/Pages/Insumos";
import Maquinas from "./components/Pages/Maquinas";
import Mantenimientos from "./components/Pages/Mantenimientos";
import Consumos from "./components/Pages/Consumos";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Ruta de login */}
            <Route path="/login" element={<Login />} />

            {/* Rutas protegidas */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            />
          </Routes>

          {/* Notificaciones toast */}
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                theme: {
                  primary: "#4aed88",
                },
              },
              error: {
                duration: 4000,
                theme: {
                  primary: "#ff6b6b",
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Redirigir raíz al dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Gestión general (accesible para todos los usuarios autenticados) */}
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/insumos" element={<Insumos />} />
          <Route path="/mantenimientos" element={<Mantenimientos />} />
          <Route path="/consumos" element={<Consumos />} />

          {/* Gestión administrativa (solo administradores) */}
          <Route
            path="/proveedores"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Proveedores />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tecnicos"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Tecnicos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maquinas"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Maquinas />
              </ProtectedRoute>
            }
          />

          {/* Ruta 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
};

const NotFound = () => {
  return (
    <div className="container" style={{ paddingTop: "80px" }}>
      <div className="text-center">
        <h1
          style={{
            fontSize: "72px",
            fontWeight: "bold",
            color: "#d1d5db",
            marginBottom: "16px",
          }}
        >
          404
        </h1>
        <h2
          style={{ fontSize: "24px", fontWeight: "600", marginBottom: "8px" }}
        >
          Página no encontrada
        </h2>
        <p style={{ color: "#6b7280", marginBottom: "24px" }}>
          La página que estás buscando no existe o ha sido movida.
        </p>
        <a href="/dashboard" className="btn btn-primary">
          Volver al Dashboard
        </a>
      </div>
    </div>
  );
};

export default App;
