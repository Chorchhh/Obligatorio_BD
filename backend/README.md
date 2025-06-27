# Backend - Sistema Cafés Marloy

Backend desarrollado en Python con Flask para el sistema administrativo de gestión de máquinas expendedoras de café.

## 🚀 Características

- **API REST completa** con todas las operaciones CRUD
- **Autenticación JWT** con roles de usuario
- **Control de permisos** por tipo de usuario
- **Reportes y estadísticas** del negocio
- **Conexión a MySQL** sin ORM
- **Validación de datos** en el backend
- **Manejo de errores** robusto

## 🛠️ Tecnologías

- **Python 3.8+**
- **Flask 2.3** - Framework web
- **Flask-JWT-Extended** - Autenticación JWT
- **Flask-CORS** - Configuración CORS
- **MySQL Connector** - Conexión a base de datos
- **BCrypt** - Encriptación de contraseñas

## 📦 Instalación

### Prerrequisitos

- Python 3.8 o superior
- MySQL Server
- pip (gestor de paquetes de Python)

### Pasos de instalación

1. **Crear entorno virtual**

```bash
cd backend
python -m venv venv
```

2. **Activar entorno virtual**

En Windows:

```bash
venv\Scripts\activate
```

En macOS/Linux:

```bash
source venv/bin/activate
```

3. **Instalar dependencias**

```bash
pip install -r requirements.txt
```

4. **Configurar base de datos**

- Asegúrate de que MySQL esté ejecutándose
- Crea la base de datos usando el script `Tablas.sql` del directorio raíz
- Ajusta la configuración de conexión en `app.py` si es necesario

5. **Iniciar el servidor**

```bash
python app.py
```

El servidor estará disponible en `http://localhost:5000`

## 🔧 Configuración

### Base de Datos

Edita la configuración en `app.py`:

```python
DB_CONFIG = {
    'host': 'localhost',
    'database': 'Obligatorio',
    'user': 'root',
    'password': '',  # Ajustar según tu configuración
    'charset': 'utf8',
    'collation': 'utf8_spanish_ci'
}
```

### JWT Secret Key

**IMPORTANTE**: Cambia la clave secreta en producción:

```python
app.config['JWT_SECRET_KEY'] = 'tu-clave-secreta-super-segura'
```

## 📚 API Endpoints

### Autenticación

- `POST /api/auth/login` - Iniciar sesión

### Gestión de Entidades

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

### Utilidades

- `GET /api/health` - Verificación de salud del servidor
- `GET /api/dashboard/stats` - Estadísticas del dashboard

## 🔐 Autenticación

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "correo": "admin@cafesmarloy.com",
  "contraseña": "cualquier_texto"
}'
```

### Usar Token

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
http://localhost:5000/api/clientes
```

## 👥 Usuarios de Prueba

El sistema incluye usuarios predefinidos en la base de datos:

### Administradores

- `admin@cafesmarloy.com`
- `supervisor@cafesmarloy.com`

### Clientes

- `admin@techsoft.com`
- `contacto@hospitalcentral.uy`
- `servicios@ucu.edu.uy`

**Nota**: En desarrollo, cualquier contraseña es válida.

## 📁 Estructura del Proyecto

```
backend/
├── routes/
│   ├── auth_routes.py          # Autenticación
│   ├── cliente_routes.py       # Gestión de clientes
│   ├── proveedor_routes.py     # Gestión de proveedores
│   ├── tecnico_routes.py       # Gestión de técnicos
│   ├── insumo_routes.py        # Gestión de insumos
│   ├── maquina_routes.py       # Gestión de máquinas
│   ├── mantenimiento_routes.py # Gestión de mantenimientos
│   ├── consumo_routes.py       # Registro de consumos
│   └── reporte_routes.py       # Reportes y estadísticas
├── app.py                      # Aplicación principal
├── requirements.txt            # Dependencias
└── README.md                   # Esta documentación
```

## 🚨 Manejo de Errores

El API retorna códigos de estado HTTP estándar:

- `200` - Éxito
- `201` - Creado exitosamente
- `400` - Error en la petición
- `401` - No autorizado
- `403` - Prohibido (sin permisos)
- `404` - No encontrado
- `500` - Error interno del servidor

### Formato de Respuesta de Error

```json
{
  "error": "Descripción del error",
  "message": "Mensaje detallado"
}
```

## 🔍 Testing

### Verificar que el servidor funciona

```bash
curl http://localhost:5000/api/health
```

### Probar autenticación

```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"correo": "admin@cafesmarloy.com", "contraseña": "test"}'
```

## 🚀 Despliegue

### Preparación para Producción

1. **Cambiar la clave secreta JWT**
2. **Configurar base de datos de producción**
3. **Desactivar modo debug**: `app.run(debug=False)`
4. **Usar servidor WSGI** como Gunicorn:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 🐛 Solución de Problemas

### Error de conexión a MySQL

- Verifica que MySQL esté ejecutándose
- Confirma credenciales en `DB_CONFIG`
- Asegúrate de que la base de datos `Obligatorio` exista

### Error de CORS

- Verifica que el frontend esté en `http://localhost:3000`
- Ajusta la configuración CORS en `app.py` si usas otra URL

### Problemas con JWT

- Verifica que el token no haya expirado
- Confirma que el header `Authorization` tenga el formato: `Bearer TOKEN`

## 📄 Licencia

Este proyecto es parte del trabajo obligatorio de Bases de Datos I - UCU - 2025.
