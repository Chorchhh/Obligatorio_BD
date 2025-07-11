# 🐳 Cafés Marloy - Configuración con Docker

Esta es la **forma más fácil** de ejecutar el proyecto. Con Docker, todo tu equipo tendrá exactamente la misma base de datos sin configuraciones complicadas.

## ✅ Requisitos

1. **Docker Desktop** - [Descargar aquí](https://www.docker.com/products/docker-desktop)
2. **Git** - Para clonar el repositorio

## 🚀 Inicio Rápido

### 1. Clonar el proyecto

```bash
git clone <url-del-repositorio>
cd Obligatorio_BD
```

### 2. Iniciar base de datos

```bash
./start_database.sh
```

### 3. Iniciar backend

```bash
./start_backend.sh
```

### 4. Iniciar frontend

```bash
./start_frontend.sh
```

¡Listo! El sistema está funcionando:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Adminer** (admin BD): http://localhost:8080

## 📋 Scripts Disponibles

| Script                | Descripción                 |
| --------------------- | --------------------------- |
| `./start_database.sh` | Inicia MySQL en Docker      |
| `./stop_database.sh`  | Detiene la base de datos    |
| `./reset_database.sh` | Resetea completamente la BD |
| `./start_backend.sh`  | Inicia el servidor Flask    |
| `./start_frontend.sh` | Inicia la aplicación React  |

## 🛠️ Administración de Base de Datos

### Adminer (Interfaz Web)

- URL: http://localhost:8080
- Servidor: `mysql`
- Usuario: `root`
- Contraseña: `rootroot`
- Base de datos: `Obligatorio`

### MySQL Directo

```bash
# Conectarse directamente al contenedor
docker exec -it cafes-marloy-db mysql -u root -prootroot Obligatorio

# Ver logs de la base de datos
docker-compose logs mysql
```

## 🔧 Configuración Personalizada

### Cambiar configuración de BD

Si necesitas usar diferentes credenciales:

1. Copia el archivo de ejemplo:

```bash
cp docker.env.example docker.env
```

2. Edita `docker.env` con tus valores:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
```

3. Reinicia el backend:

```bash
./start_backend.sh
```

### Variables de entorno disponibles

- `DB_HOST` - Host de la base de datos
- `DB_PORT` - Puerto de MySQL
- `DB_USER` - Usuario de MySQL
- `DB_PASSWORD` - Contraseña de MySQL
- `FLASK_PORT` - Puerto del backend
- `FLASK_DEBUG` - Modo debug (true/false)

## 🐛 Solución de Problemas

### La base de datos no inicia

```bash
# Ver logs de errores
docker-compose logs mysql

# Reiniciar desde cero
./reset_database.sh
./start_database.sh
```

### Puerto 3306 ya en uso

Si tienes MySQL instalado localmente:

```bash
# Opción 1: Detener MySQL local
sudo service mysql stop

# Opción 2: Cambiar puerto en docker-compose.yml
ports:
  - "3307:3306"  # Usar puerto 3307
```

### Backend no se conecta

```bash
# Verificar que MySQL esté corriendo
docker ps | grep cafes-marloy-db

# Verificar conectividad
docker exec cafes-marloy-db mysqladmin ping -h localhost -u root -prootroot
```

## 📊 Comandos Docker Útiles

```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Entrar al contenedor MySQL
docker exec -it cafes-marloy-db bash

# Limpiar todo Docker
docker system prune -a
```

## 🎯 Flujo de Trabajo para el Equipo

### Al empezar a trabajar:

```bash
./start_database.sh
./start_backend.sh
./start_frontend.sh
```

### Al terminar:

```bash
./stop_database.sh
# Los scripts de frontend/backend se pueden cerrar con Ctrl+C
```

### Si algo se rompe:

```bash
./reset_database.sh
./start_database.sh
```

## 🔒 Seguridad

- ⚠️ Las credenciales actuales son **solo para desarrollo**
- 🚫 **Nunca** uses estas credenciales en producción
- 🔐 Cambia `JWT_SECRET_KEY` antes de desplegar

## 📞 Soporte

Si tienes problemas:

1. Revisa este archivo
2. Verifica que Docker Desktop esté corriendo
3. Ejecuta `./reset_database.sh` para empezar desde cero
4. Contacta al equipo si persisten los problemas

---

**Universidad Católica del Uruguay - Bases de Datos I - 2025**
