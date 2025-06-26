# Frontend - Sistema Cafés Marloy

Frontend desarrollado en React para el sistema administrativo de gestión de máquinas expendedoras de café de Cafés Marloy.

## 🚀 Características

- **Sistema de autenticación** con roles (administrador/cliente)
- **Dashboard interactivo** con estadísticas y reportes
- **CRUD completo** para todas las entidades del sistema
- **Interfaz responsive** y moderna
- **Control de permisos** según el tipo de usuario
- **Gestión en tiempo real** de consumos y mantenimientos

## 📋 Funcionalidades Principales

### Para Administradores

- Gestión completa de proveedores, técnicos y máquinas
- Visualización de todos los reportes y estadísticas
- Acceso total a todas las funcionalidades

### Para Clientes

- Visualización de sus máquinas y consumos
- Gestión de insumos y mantenimientos
- Dashboard personalizado

### Módulos Incluidos

- 🏢 **Clientes**: Gestión de empresas clientes
- 📦 **Insumos**: Control de inventario de insumos
- 🚚 **Proveedores**: Administración de proveedores (solo admin)
- 👷 **Técnicos**: Gestión de personal técnico (solo admin)
- ☕ **Máquinas**: Control de máquinas expendedoras (solo admin)
- 🔧 **Mantenimientos**: Registro de mantenimientos
- 📊 **Consumos**: Registro de consumo de insumos
- 📈 **Dashboard**: Estadísticas y reportes

## 🛠️ Tecnologías Utilizadas

- **React 18.2.0** - Framework principal
- **React Router DOM** - Navegación
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos modernos
- **React Hot Toast** - Notificaciones
- **Date-fns** - Manejo de fechas

## 📦 Instalación

### Prerrequisitos

- Node.js 16+
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio** (si es necesario)

```bash
git clone [url-del-repositorio]
cd Obligatorio_BD
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno** (opcional)

```bash
# Crear archivo .env.local (opcional)
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env.local
```

4. **Iniciar la aplicación**

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# URL base de la API del backend
REACT_APP_API_URL=http://localhost:5000/api
```

Si no se especifica, por defecto usará `http://localhost:5000/api`.

## 👥 Usuarios de Prueba

El sistema incluye usuarios de prueba predefinidos:

### Administrador

- **Email**: `admin@cafesmarloy.com`
- **Contraseña**: cualquier texto (para desarrollo)

### Cliente

- **Email**: `admin@techsoft.com`
- **Contraseña**: cualquier texto (para desarrollo)

## 🎯 Estructura del Proyecto

```
src/
├── components/
│   ├── Auth/
│   │   └── Login.js           # Página de login
│   ├── Common/
│   │   └── ProtectedRoute.js  # Protección de rutas
│   ├── Dashboard/
│   │   └── Dashboard.js       # Dashboard principal
│   ├── Layout/
│   │   └── Navbar.js          # Barra de navegación
│   └── Pages/
│       ├── Clientes.js        # Gestión de clientes
│       ├── Insumos.js         # Gestión de insumos
│       ├── Proveedores.js     # Gestión de proveedores
│       ├── Tecnicos.js        # Gestión de técnicos
│       ├── Maquinas.js        # Gestión de máquinas
│       ├── Mantenimientos.js  # Gestión de mantenimientos
│       └── Consumos.js        # Registro de consumos
├── contexts/
│   └── AuthContext.js         # Contexto de autenticación
├── services/
│   └── apiService.js          # Servicio de API
├── App.js                     # Componente principal
├── index.js                   # Punto de entrada
└── index.css                  # Estilos globales
```

## 🔐 Autenticación y Permisos

El sistema implementa un sistema de autenticación basado en JWT con dos tipos de usuarios:

### Administradores

- Acceso completo a todas las funcionalidades
- Pueden gestionar proveedores, técnicos y máquinas
- Visualización de todos los reportes

### Clientes

- Acceso limitado a funcionalidades generales
- No pueden gestionar proveedores, técnicos o máquinas
- Dashboard personalizado

## 📱 Características de la Interfaz

- **Responsive Design**: Funciona en dispositivos móviles y desktop
- **Navegación Intuitiva**: Menú adaptativo según permisos
- **Feedback Visual**: Notificaciones toast para todas las acciones
- **Estados de Carga**: Indicadores de carga en todas las operaciones
- **Búsqueda en Tiempo Real**: Filtros de búsqueda en todas las listas
- **Modales Modernos**: Formularios overlay para crear/editar

## 🚨 Manejo de Errores

- Interceptores de Axios para manejo global de errores
- Redirección automática al login en caso de token expirado
- Notificaciones descriptivas para errores de validación
- Estados de error manejados en cada componente

## 📝 Scripts Disponibles

```bash
# Iniciar en modo desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar tests
npm test

# Eyectar configuración (no recomendado)
npm run eject
```

## 🔗 Integración con Backend

El frontend está diseñado para integrarse con una API REST que debe implementar los siguientes endpoints:

### Autenticación

- `POST /api/auth/login` - Iniciar sesión

### Entidades principales

- `GET/POST/PUT/DELETE /api/clientes` - Gestión de clientes
- `GET/POST/PUT/DELETE /api/insumos` - Gestión de insumos
- `GET/POST/PUT/DELETE /api/proveedores` - Gestión de proveedores
- `GET/POST/PUT/DELETE /api/tecnicos` - Gestión de técnicos
- `GET/POST/PUT/DELETE /api/maquinas` - Gestión de máquinas
- `GET/POST/PUT/DELETE /api/mantenimientos` - Gestión de mantenimientos
- `GET/POST/PUT/DELETE /api/registro-consumo` - Registro de consumos

### Reportes

- `GET /api/reportes/ganancias-clientes` - Ganancias por cliente
- `GET /api/reportes/insumos-populares` - Insumos más consumidos
- `GET /api/reportes/tecnicos-activos` - Técnicos más activos
- `GET /api/reportes/clientes-mas-maquinas` - Clientes con más máquinas

## 🎨 Personalización

### Colores del Sistema

El sistema utiliza una paleta de colores temática de café:

- **Primario**: Tonos marrones (#8B4513, #D2691E)
- **Secundario**: Grises (#6b7280)
- **Éxito**: Verde (#10b981)
- **Error**: Rojo (#ef4444)

### Modificar Estilos

Los estilos están centralizados en `src/index.css` y utilizan clases CSS modulares.

## 🐛 Resolución de Problemas

### Error de CORS

Si encuentras errores de CORS, asegúrate de que el backend esté configurado para permitir requests desde `http://localhost:3000`.

### Error de conexión con API

Verifica que la variable `REACT_APP_API_URL` esté correctamente configurada y que el backend esté ejecutándose.

### Problemas de autenticación

Limpia el localStorage del navegador para eliminar tokens corruptos:

```javascript
localStorage.clear();
```
