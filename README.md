# Sistema Administrativo Cafés Marloy

Sistema web completo para la gestión administrativa de **Cafés Marloy**, empresa especializada en máquinas expendedoras de café.

## 🎯 Contexto del Proyecto

**Universidad**: Universidad Católica del Uruguay  
**Curso**: Bases de Datos I - 2025  
**Tipo**: Trabajo Obligatorio

### Empresa: Cafés Marloy

Cafés Marloy es una empresa que gestiona máquinas expendedoras de café ubicadas en diferentes clientes (empresas, hospitales, universidades). La empresa se encarga de:

- 🏢 **Instalación y mantenimiento** de máquinas expendedoras
- ☕ **Suministro de insumos** (café, azúcar, vasos, etc.)
- 👥 **Gestión de clientes** y contratos de alquiler
- 🔧 **Servicios técnicos** especializados
- 📊 **Control y seguimiento** del consumo

## 📋 Descripción del Sistema

El sistema permite gestionar:

- **Proveedores** de insumos y equipamiento
- **Clientes** que alquilan las máquinas
- **Técnicos** especializados en mantenimiento
- **Insumos** y su control de stock
- **Máquinas** expendedoras y su ubicación
- **Mantenimientos** preventivos y correctivos
- **Registro de consumo** por máquina
- **Reportes** de ganancias y estadísticas

## 🛠️ Tecnologías Utilizadas

### Frontend

- **React 18.2** - Framework de JavaScript
- **React Router DOM** - Navegación entre páginas
- **Axios** - Cliente HTTP para comunicación con API
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconografía moderna
- **React Hot Toast** - Sistema de notificaciones
- **Date-fns** - Manejo de fechas

### Backend

- **Python 3.8+** con Flask
- **Flask-JWT-Extended** - Autenticación JWT
- **Flask-CORS** - Configuración CORS
- **MySQL Connector** - Conexión a base de datos
- **BCrypt** - Encriptación de contraseñas

### Base de Datos

- **MySQL** con estructura relacional completa
- **Sin ORM** - Consultas SQL directas como requerido
- **Datos de prueba** incluidos para testing

## 🏗️ Estructura del Proyecto

```
Obligatorio_BD/
├── frontend/                   # Aplicación React
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Auth/
│       │   ├── Common/
│       │   ├── Dashboard/
│       │   ├── Layout/
│       │   └── Pages/
│       ├── contexts/
│       ├── services/
│       ├── App.js
│       └── index.js
├── backend/                    # API Python Flask
│   ├── routes/
│   │   ├── auth_routes.py      # Autenticación
│   │   ├── cliente_routes.py   # Gestión de clientes
│   │   ├── proveedor_routes.py # Gestión de proveedores
│   │   ├── tecnico_routes.py   # Gestión de técnicos
│   │   ├── insumo_routes.py    # Gestión de insumos
│   │   ├── maquina_routes.py   # Gestión de máquinas
│   │   ├── mantenimiento_routes.py # Mantenimientos
│   │   ├── consumo_routes.py   # Registro de consumos
│   │   └── reporte_routes.py   # Reportes y estadísticas
│   ├── app.py                  # Aplicación principal
│   ├── requirements.txt        # Dependencias Python
│   └── README.md              # Documentación backend
├── Tablas.sql                  # Script de base de datos
└── README.md                   # Este archivo
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js 16+** para el frontend
- **Python 3.8+** para el backend
- **MySQL Server** para la base de datos

### 1. Base de Datos

```bash
# Conectar a MySQL
mysql -u root -p

# Crear y ejecutar script
source Tablas.sql
```

### 2. Backend (Puerto 5000)

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

### 3. Frontend (Puerto 3000)

```bash
cd frontend
npm install
npm start
```

El sistema estará disponible en:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

## 👥 Usuarios de Prueba

### Administradores (Acceso completo)

- `admin@cafesmarloy.com`
- `supervisor@cafesmarloy.com`

### Clientes (Acceso limitado)

- `admin@techsoft.com`
- `contacto@hospitalcentral.uy`
- `servicios@ucu.edu.uy`

**Contraseña**: Cualquier texto (en desarrollo)

## 🔧 Funcionalidades del Sistema

### Para Administradores

- ✅ **Dashboard completo** con estadísticas del negocio
- ✅ **Gestión de proveedores** (CRUD completo)
- ✅ **Gestión de técnicos** (CRUD completo)
- ✅ **Gestión de máquinas** (CRUD completo)
- ✅ **Gestión de clientes** (CRUD completo)
- ✅ **Gestión de insumos** (CRUD completo)
- ✅ **Gestión de mantenimientos** (CRUD completo)
- ✅ **Registro de consumos** (CRUD completo)
- ✅ **Reportes avanzados** de ganancias y estadísticas

### Para Clientes

- ✅ **Dashboard personalizado** con sus datos
- ✅ **Consulta y edición** de información personal
- ✅ **Historial de mantenimientos** de sus máquinas
- ✅ **Registro de consumos** de sus máquinas
- ✅ **Información de insumos** disponibles

## 📊 Reportes Implementados

### 1. Ganancias por Cliente

- Cálculo de alquiler mensual + consumo de insumos
- Ranking de los 10 clientes más rentables
- Análisis de ingresos totales por cliente

### 2. Insumos Más Populares

- Cantidad total consumida por tipo de insumo
- Ganancias generadas por cada insumo
- Top 10 insumos más demandados

### 3. Técnicos Más Activos

- Cantidad de mantenimientos realizados por técnico
- Ranking de productividad del equipo técnico
- Análisis de desempeño individual

### 4. Clientes con Más Máquinas

- Distribución de máquinas por cliente
- Análisis de concentración de cartera
- Identificación de clientes principales

## 🎨 Interfaz de Usuario

### Características de Diseño

- **Diseño moderno** con Tailwind CSS
- **Completamente responsive** para todos los dispositivos
- **Navegación intuitiva** con menú lateral dinámico
- **Búsqueda en tiempo real** en todas las tablas de datos
- **Notificaciones toast** para feedback inmediato
- **Modales elegantes** para formularios de creación/edición
- **Iconografía consistente** con Lucide React

### Experiencia de Usuario

- **Login automático** con recordar sesión
- **Redirección inteligente** según permisos de usuario
- **Carga de datos optimizada** con estados de loading
- **Manejo de errores** con mensajes descriptivos
- **Confirmaciones** para acciones destructivas

## 🔐 Seguridad y Autenticación

- **Autenticación JWT** con tokens seguros
- **Roles diferenciados** (Administrador vs Cliente)
- **Control de acceso granular** por funcionalidad
- **Validación de datos** en frontend y backend
- **Manejo seguro de contraseñas** con BCrypt
- **Sesiones persistentes** con almacenamiento local
- **Interceptores HTTP** para manejo automático de autenticación

## 📱 Responsive Design

La aplicación se adapta perfectamente a:

- **Desktop** (1024px+): Layout completo con sidebar expandido
- **Tablet** (768px-1023px): Layout adaptado con sidebar colapsible
- **Mobile** (320px-767px): Layout mobile-first optimizado

## 🧪 Testing y Verificación

### Testing Frontend

```bash
cd frontend
npm test
```

### Testing Backend

```bash
cd backend

# Verificar salud del servidor
curl http://localhost:5000/api/health

# Probar autenticación
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"correo": "admin@cafesmarloy.com", "contraseña": "test"}'

# Probar endpoint protegido
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
http://localhost:5000/api/clientes
```

### Casos de Prueba Manual

1. Login con diferentes tipos de usuario
2. Navegación y permisos por rol
3. Operaciones CRUD en todas las entidades
4. Búsqueda y filtrado en tablas
5. Responsividad en diferentes dispositivos

## 📦 Despliegue en Producción

### Frontend

```bash
cd frontend
npm run build
# La carpeta build/ contiene los archivos estáticos listos para desplegar
```

### Backend

```bash
cd backend
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Consideraciones de Producción

- Cambiar JWT secret key por una clave segura
- Configurar base de datos de producción
- Establecer variables de entorno apropiadas
- Configurar HTTPS y certificados SSL
- Implementar logging y monitoreo

## 🔗 API Endpoints

### Autenticación

- `POST /api/auth/login` - Iniciar sesión

### Gestión de Datos (requiere autenticación)

- `GET/POST/PUT/DELETE /api/clientes` - Gestión de clientes
- `GET/POST/PUT/DELETE /api/insumos` - Gestión de insumos
- `GET/POST/PUT/DELETE /api/mantenimientos` - Gestión de mantenimientos
- `GET/POST/PUT/DELETE /api/registro-consumo` - Registro de consumos

### Solo Administradores

- `GET/POST/PUT/DELETE /api/proveedores` - Gestión de proveedores
- `GET/POST/PUT/DELETE /api/tecnicos` - Gestión de técnicos
- `GET/POST/PUT/DELETE /api/maquinas` - Gestión de máquinas

### Reportes

- `GET /api/reportes/ganancias-clientes` - Ganancias por cliente
- `GET /api/reportes/insumos-populares` - Insumos más consumidos
- `GET /api/reportes/tecnicos-activos` - Técnicos más activos
- `GET /api/reportes/clientes-mas-maquinas` - Clientes con más máquinas

## 📋 Estado del Proyecto

### ✅ Funcionalidades Completadas

- [x] **Base de datos MySQL** con estructura completa y datos de prueba
- [x] **Backend Flask** con API REST completa
- [x] **Frontend React** con todas las funcionalidades requeridas
- [x] **Sistema de autenticación JWT** con roles diferenciados
- [x] **Control de permisos granular** por tipo de usuario
- [x] **Dashboard interactivo** con estadísticas en tiempo real
- [x] **CRUD completo** para todas las entidades del sistema
- [x] **Reportes de negocio** con consultas optimizadas
- [x] **Búsqueda y filtrado** en tiempo real
- [x] **Diseño responsive** para todos los dispositivos
- [x] **Documentación completa** del sistema

### 🎯 Características Destacadas

- **Cumplimiento estricto** de requerimientos (sin ORM)
- **Arquitectura moderna** Frontend/Backend separada
- **Roles diferenciados** con funcionalidades específicas
- **Interfaz profesional** con UX optimizada
- **API REST completa** con todos los endpoints necesarios
- **Reportes útiles** para análisis de negocio
- **Código limpio** con estructura modular
- **Testing incluido** para verificación de funcionalidades

## 📄 Documentación Adicional

- [**Frontend README**](./frontend/README.md) - Documentación detallada del frontend React
- [**Backend README**](./backend/README.md) - Documentación detallada del backend Flask
- [**Script de Base de Datos**](./Tablas.sql) - DDL y DML con comentarios explicativos

## 🛠️ Desarrollo y Arquitectura

Este sistema fue desarrollado siguiendo las mejores prácticas:

### Principios de Desarrollo

- **Separación clara de responsabilidades** (Frontend/Backend/Database)
- **API RESTful** con códigos de estado HTTP apropiados
- **Manejo robusto de errores** en todas las capas
- **Validación exhaustiva** en frontend y backend
- **Código modular y reutilizable** con componentes bien estructurados
- **Documentación completa** con ejemplos prácticos

### Arquitectura del Sistema

- **Frontend SPA** (Single Page Application) con React
- **Backend API** estateless con Flask
- **Base de datos relacional** normalizada con MySQL
- **Autenticación JWT** para sesiones seguras
- **Comunicación HTTP** con Axios interceptors

## 🎓 Valor Académico

Este proyecto demuestra:

- Comprensión profunda de **bases de datos relacionales**
- Implementación correcta de **consultas SQL complejas**
- Desarrollo de **APIs RESTful** profesionales
- Creación de **interfaces de usuario modernas**
- Aplicación de **principios de seguridad** web
- Gestión completa de un **proyecto full-stack**

## 📞 Información de Soporte

Para consultas sobre la implementación:

1. Revisar los **README específicos** de cada módulo
2. Examinar los **comentarios en el código fuente**
3. Consultar la **documentación de la base de datos** en `Tablas.sql`
4. Verificar los **endpoints de la API** en las rutas del backend

---

**Universidad Católica del Uruguay - Bases de Datos I - 2025**  
_Sistema desarrollado como trabajo obligatorio - Estructura frontend/backend profesional_
