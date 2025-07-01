# Backend Flask Simple - Cafés Marloy

## 📋 Descripción

Esta es una implementación alternativa del sistema de gestión de Cafés Marloy usando Flask de manera simple y directa. Es una aplicación monolítica que incluye:

- ✅ **Autenticación con sesiones** (sin JWT)
- ✅ **Interfaz web completa** con templates HTML
- ✅ **CRUD completo** para todas las entidades
- ✅ **Reportes de negocio** 
- ✅ **Control de roles** (Administrador/Usuario)
- ✅ **Diseño responsive** con Bootstrap

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Python 3.7+
- MySQL Server
- Base de datos `cafes_marloy_vale` configurada

### Pasos para ejecutar:

1. **Instalar dependencias:**
```bash
cd backend-flask-simple
pip install -r requirements.txt
```

2. **Configurar la base de datos:**
```bash
# Importar datos de demo
mysql -u root -p cafes_marloy_vale < usuarios_demo.sql
```

3. **Configurar conexión MySQL:**
Editar las credenciales en `app.py` línea 12-17:
```python
def conectar():
    return mysql.connector.connect(
        host="localhost",
        user="root",                    # <- Tu usuario MySQL
        password="valerodma",           # <- Tu contraseña MySQL  
        database="cafes_marloy_vale"    # <- Tu base de datos
    )
```

4. **Ejecutar la aplicación:**
```bash
python3 app.py
```

5. **Acceder al sistema:**
- Abrir navegador en: `http://localhost:5000`
- Login como:
  - **Admin**: `admin@cafesmarloy.com` / `123456`
  - **Usuario**: `usuario@cafesmarloy.com` / `123456`

## 📁 Estructura de Archivos

```
backend-flask-simple/
├── app.py              # Aplicación Flask principal
├── requirements.txt    # Dependencias Python
├── templates/          # Plantillas HTML
├── static/            # CSS y JavaScript
├── usuarios_demo.sql  # Datos de prueba
├── diagnostico.py     # Script de diagnóstico
└── Ejecutable.py      # Script de ejecución alternativo
```

## 🎯 Funcionalidades

### Para Todos los Usuarios:
- Login/Logout seguro
- Dashboard con estadísticas
- Gestión de clientes
- Gestión de insumos  
- Visualización de técnicos y máquinas
- Registro de consumos
- Registro de mantenimientos

### Solo para Administradores:
- Agregar técnicos
- Agregar máquinas
- Reportes de negocio:
  - Total mensual por cliente
  - Insumos más usados
  - Técnicos más activos
  - Clientes con más máquinas

## 🔧 Características Técnicas

- **Framework**: Flask 2.3.3
- **Base de datos**: MySQL con mysql-connector-python
- **Frontend**: Bootstrap 5 + HTML/CSS/JS
- **Autenticación**: Sessions Flask
- **Validación**: Client-side y server-side

## 🚨 Diagnóstico

Para diagnosticar problemas de conexión:
```bash
python3 diagnostico.py
```

## 📝 Notas de Implementación

- **Sin ORM**: Usa consultas SQL directas según requerimientos
- **Arquitectura simple**: Todo en un solo archivo `app.py` 
- **Control de permisos**: Decoradores `@login_required` y `@admin_required`
- **API REST**: Endpoints `/api/*` para comunicación con frontend
- **Responsive**: Funciona en desktop, tablet y móvil

## 🔗 Diferencias con backend/ principal

| Característica | Backend Principal | Backend Simple |
|---|---|---|
| Arquitectura | Modular (blueprints) | Monolítica |
| Autenticación | JWT | Sessions |
| Frontend | React SPA | Templates HTML |
| API | Solo REST | REST + Web pages |
| Complejidad | Alta | Media |
| Ideal para | Producción | Desarrollo/Demo |

---

**Implementación por**: Valentín Rodriguez (ValeRodMa)  
**Curso**: Bases de Datos I - UCU 2025 