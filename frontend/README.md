# Frontend - Sistema Cafés Marloy

Aplicación web desarrollada en React para el sistema administrativo de gestión de máquinas expendedoras de café.

## 🚀 Características

- **Interfaz moderna** y responsive
- **Autenticación con JWT** y roles diferenciados
- **Dashboard interactivo** con estadísticas en tiempo real
- **CRUD completo** para todas las entidades del sistema
- **Búsqueda en tiempo real** en todas las tablas
- **Control de permisos** por tipo de usuario
- **Notificaciones toast** para feedback del usuario
- **Navegación fluida** con React Router

## 🛠️ Tecnologías

- **React 18.2** - Framework de JavaScript
- **React Router DOM** - Navegación entre páginas
- **Axios** - Cliente HTTP para comunicación con API
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconografía moderna
- **React Hot Toast** - Sistema de notificaciones
- **Date-fns** - Manejo de fechas

## 📦 Instalación

### Prerrequisitos

- Node.js 16 o superior
- npm o yarn
- Backend ejecutándose en `http://localhost:5000`

### Pasos de instalación

1. **Navegar al directorio frontend**

```bash
cd frontend
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno** (opcional)
   Crea un archivo `.env` en el directorio frontend:

```
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Iniciar la aplicación**

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 👥 Usuarios de Prueba

### Administrador

- **Email**: `admin@cafesmarloy.com`
- **Contraseña**: Cualquier texto (en desarrollo)
- **Permisos**: Acceso completo a todas las funcionalidades

### Cliente

- **Email**: `admin@techsoft.com`
- **Contraseña**: Cualquier texto (en desarrollo)
- **Permisos**: Acceso limitado a funcionalidades de cliente

## 🖥️ Pantallas Principales

### Login

- Autenticación de usuarios
- Validación de credenciales
- Redirección automática según rol

### Dashboard

- **Administradores**: Estadísticas completas del negocio
  - Total de clientes, máquinas, técnicos
  - Ganancias por cliente
  - Insumos más populares
  - Técnicos más activos
- **Clientes**: Vista limitada de sus datos

### Gestión de Entidades

#### Para Administradores

- **Proveedores**: CRUD completo
- **Técnicos**: CRUD completo
- **Máquinas**: CRUD completo
- **Clientes**: CRUD completo
- **Insumos**: CRUD completo
- **Mantenimientos**: CRUD completo
- **Consumos**: CRUD completo

#### Para Clientes

- **Clientes**: Solo lectura y edición de sus datos
- **Insumos**: Solo lectura
- **Mantenimientos**: Solo lectura de sus mantenimientos
- **Consumos**: Solo lectura de sus consumos

## 📁 Estructura del Proyecto

```
frontend/
├── public/
│   └── index.html              # HTML base
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   └── Login.js        # Componente de login
│   │   ├── Common/
│   │   │   └── ProtectedRoute.js # Protección de rutas
│   │   ├── Dashboard/
│   │   │   └── Dashboard.js    # Dashboard principal
│   │   ├── Layout/
│   │   │   └── Navbar.js       # Barra de navegación
│   │   └── Pages/
│   │       ├── Clientes.js     # Gestión de clientes
│   │       ├── Consumos.js     # Registro de consumos
│   │       ├── Insumos.js      # Gestión de insumos
│   │       ├── Maquinas.js     # Gestión de máquinas
│   │       ├── Mantenimientos.js # Gestión de mantenimientos
│   │       ├── Proveedores.js  # Gestión de proveedores
│   │       └── Tecnicos.js     # Gestión de técnicos
│   ├── contexts/
│   │   └── AuthContext.js      # Contexto de autenticación
│   ├── services/
│   │   └── apiService.js       # Servicio de comunicación con API
│   ├── App.js                  # Componente principal
│   ├── index.js                # Punto de entrada
│   └── index.css               # Estilos globales
├── package.json                # Dependencias y scripts
└── README.md                   # Esta documentación
```

## 🎨 Diseño y UX

### Principios de Diseño

- **Simplicidad**: Interfaz limpia y fácil de usar
- **Consistencia**: Patrones de diseño uniformes
- **Accesibilidad**: Contraste adecuado y navegación por teclado
- **Responsividad**: Adaptable a diferentes tamaños de pantalla

### Paleta de Colores

- **Primario**: Azul (`bg-blue-600`, `text-blue-600`)
- **Secundario**: Gris (`bg-gray-100`, `text-gray-600`)
- **Éxito**: Verde (`bg-green-500`)
- **Error**: Rojo (`bg-red-500`)
- **Advertencia**: Amarillo (`bg-yellow-500`)

### Iconografía

- Lucide React para iconos modernos y consistentes
- Iconos semánticos para cada acción (editar, eliminar, agregar)

## 🔧 Funcionalidades Principales

### Sistema de Autenticación

- Login con email y contraseña
- Almacenamiento seguro del token JWT
- Redirección automática en caso de sesión expirada
- Roles diferenciados (admin vs cliente)

### Gestión de Datos

- **Crear**: Formularios modales para nuevos registros
- **Leer**: Tablas con paginación y búsqueda
- **Actualizar**: Edición inline o modal
- **Eliminar**: Confirmación antes de eliminar

### Búsqueda y Filtrado

- Búsqueda en tiempo real en todas las listas
- Filtrado por múltiples criterios
- Ordenamiento por columnas

### Notificaciones

- Toast notifications para operaciones exitosas
- Alertas de error con mensajes descriptivos
- Confirmaciones para acciones destructivas

## 🔐 Seguridad

### Autenticación

- Tokens JWT almacenados en localStorage
- Validación automática de tokens expirados
- Interceptores HTTP para manejo de autenticación

### Control de Acceso

- Rutas protegidas según rol de usuario
- Componentes condicionales basados en permisos
- Validación tanto en frontend como backend

## 📱 Responsive Design

La aplicación es completamente responsive y se adapta a:

- **Desktop** (1024px+): Layout completo con sidebar
- **Tablet** (768px-1023px): Layout adaptado
- **Mobile** (320px-767px): Layout simplificado

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm start              # Inicia el servidor de desarrollo

# Construcción
npm run build          # Construye la aplicación para producción

# Testing
npm test               # Ejecuta los tests

# Análisis
npm run eject          # Expone configuración de Create React App
```

## 🌐 Variables de Entorno

```bash
# .env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🔍 Testing

### Testing Manual

1. Verificar que el backend esté ejecutándose
2. Hacer login con usuarios de prueba
3. Probar operaciones CRUD en cada sección
4. Verificar permisos por rol

### Testing de Funcionalidades

- Autenticación con credenciales válidas/inválidas
- CRUD operations en todas las entidades
- Búsqueda y filtrado
- Responsive design en diferentes dispositivos

## 🐛 Solución de Problemas

### Error de conexión con el backend

```
Network Error / ERR_CONNECTION_REFUSED
```

**Solución**: Verificar que el backend esté ejecutándose en `http://localhost:5000`

### Token expirado

```
401 Unauthorized
```

**Solución**: La aplicación redirige automáticamente al login

### Estilos no aplicados

**Solución**: Verificar que Tailwind CSS esté instalado correctamente

## 🚀 Despliegue

### Build para Producción

```bash
npm run build
```

### Variables de Entorno para Producción

```bash
REACT_APP_API_URL=https://tu-api-backend.com/api
```

### Servidor de Archivos Estáticos

La aplicación puede desplegarse en cualquier servidor que sirva archivos estáticos:

- Netlify
- Vercel
- GitHub Pages
- Apache/Nginx

## 📄 Licencia

Este proyecto es parte del trabajo obligatorio de Bases de Datos I - UCU - 2025.

## 👨‍💻 Desarrollado por

Proyecto desarrollado para el curso de Bases de Datos I - Universidad Católica del Uruguay - 2025.
