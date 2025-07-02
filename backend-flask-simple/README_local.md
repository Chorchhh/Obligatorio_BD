# 🚀 Sistema Web Cafés Marloy

Sistema integral de gestión para máquinas de café con interfaz web moderna, funcional y **sistema de autenticación con roles**.

## 📋 Funcionalidades

- **🔐 Sistema de Login** con roles de usuario (Administrador/Usuario)
- **Dashboard** con estadísticas en tiempo real
- **Gestión de Clientes** - Agregar y listar clientes
- **Gestión de Máquinas** - Control de máquinas instaladas (solo Admin)
- **Gestión de Insumos** - Control de inventario de insumos
- **Gestión de Técnicos** - Administración del personal técnico (solo Admin)
- **Registro de Consumo** - Tracking de consumo de insumos
- **Registro de Mantenimientos** - Programación y seguimiento
- **Reportes Avanzados** - Analytics y estadísticas del negocio (solo Admin)

## 🛠️ Instalación

### Requisitos Previos
- Python 3.7+ instalado
- MySQL Server ejecutándose
- Base de datos `cafes_marloy_vale` creada y configurada

### Pasos de Instalación

1. **Instalar dependencias**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configurar base de datos**
   
   Asegúrate de que tu base de datos MySQL esté ejecutándose con:
   - Host: `localhost`
   - Usuario: `root`
   - Contraseña: `valerodma`
   - Base de datos: `cafes_marloy_vale`

   Si necesitas cambiar estos valores, edítalos en el archivo `app.py` en la función `conectar()`.

3. **Crear usuarios del sistema**
   
   Ejecuta el script SQL para crear usuarios de demostración:
   ```bash
   mysql -u root -p cafes_marloy_vale < usuarios_demo.sql
   ```
   
   Esto creará:
   - **👑 Administrador**: admin@cafesmarloy.com / admin123
   - **👤 Usuario Técnico**: tecnico1@cafesmarloy.com / tecnico123

4. **Ejecutar la aplicación**
   ```bash
   python3 app.py
   ```

5. **Acceder al sistema**
   
   Abre tu navegador web y ve a: [http://127.0.0.1:5000](http://127.0.0.1:5000)

## 🖥️ Uso del Sistema

### 🔐 Inicio de Sesión
Al acceder al sistema por primera vez, verás la pantalla de login:
- Ingresa tu correo y contraseña
- El sistema te redirigirá al dashboard según tu rol
- Puedes usar las credenciales de demostración:
  - **Admin**: admin@cafesmarloy.com / admin123
  - **Usuario Técnico**: tecnico1@cafesmarloy.com / tecnico123

### 👥 Roles y Permisos

#### 👑 **Administrador**
- ✅ Acceso completo al sistema
- ✅ Puede agregar técnicos
- ✅ Puede agregar máquinas
- ✅ Acceso a todos los reportes
- ✅ Todas las funciones de usuario regular

#### 👤 **Usuario Regular**
- ✅ Ver dashboard y estadísticas
- ✅ Gestionar clientes e insumos
- ✅ Registrar consumo y mantenimientos
- ❌ NO puede agregar técnicos
- ❌ NO puede agregar máquinas
- ❌ NO puede acceder a reportes

### Página Principal
- Dashboard con estadísticas actualizadas
- Accesos rápidos a las principales funciones
- Información del usuario logueado y su rol

### Gestión de Datos

#### Clientes
- **Agregar**: Nombre, dirección, teléfono, correo
- **Listar**: Ver todos los clientes registrados
- **Detalles**: Información completa de cada cliente

#### Máquinas
- **Agregar**: Modelo, cliente, ubicación, costo mensual
- **Listar**: Ver máquinas con información del cliente
- **Gestión**: Control de máquinas por ubicación

#### Insumos
- **Agregar**: Descripción, tipo, precio, proveedor
- **Listar**: Inventario completo con precios
- **Categorías**: Café, Azúcar, Leche, Vasos, Otros

#### Técnicos
- **Agregar**: CI, nombre, apellido, teléfono
- **Listar**: Personal técnico disponible
- **Gestión**: Control de técnicos activos

### Operaciones

#### Registro de Consumo
- Selecciona máquina y insumo
- Ingresa fecha y cantidad consumida
- Cálculo automático de costos
- Tracking de consumo en tiempo real

#### Registro de Mantenimientos
- Asignación de técnico y máquina
- Tipos: Preventivo o Correctivo
- Programación de fecha y hora
- Observaciones detalladas
- Validación de disponibilidad del técnico

### Reportes

#### Total Mensual por Cliente
- Desglose de alquiler y consumo
- Cálculo de facturación mensual
- Filtrado por mes específico

#### Top 5 Insumos Más Usados
- Ranking de consumo de insumos
- Análisis de costos totales
- Identificación de insumos críticos

#### Técnicos con Más Mantenimientos
- Ranking de productividad
- Análisis de carga de trabajo
- Gestión de recursos humanos

#### Clientes con Más Máquinas
- Identificación de clientes principales
- Análisis de penetración de mercado
- Oportunidades de crecimiento

## 🔧 Características Técnicas

### Frontend
- **Bootstrap 5** - Framework CSS moderno
- **Bootstrap Icons** - Iconografía completa
- **JavaScript ES6+** - Funcionalidad moderna
- **Responsive Design** - Compatible con móviles

### Backend
- **Flask** - Framework web de Python
- **MySQL Connector** - Conectividad con base de datos
- **API REST** - Arquitectura moderna
- **Error Handling** - Manejo robusto de errores

### Seguridad
- Validación de formularios
- Sanitización de datos
- Manejo seguro de conexiones DB
- Prevención de conflictos de programación

## 📱 Interfaz

### Navegación Intuitiva
- Menú principal con iconos descriptivos
- Breadcrumbs y navegación contextual
- Alertas y notificaciones en tiempo real

### Experiencia de Usuario
- Formularios con validación en vivo
- Modales para acciones rápidas
- Tablas responsivas con scroll
- Loading states y feedback visual

### Diseño Moderno
- Colores corporativos consistentes
- Animaciones suaves
- Tipografía clara y legible
- Espaciado y layout optimizado

## 🚨 Solución de Problemas

### Error de Conexión a Base de Datos
- Verificar que MySQL esté ejecutándose
- Confirmar credenciales en `app.py`
- Verificar que la base de datos existe

### Error de Dependencias
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Puerto en Uso
- Cambiar puerto en `app.py`: `app.run(port=5001)`
- O liberar el puerto 5000

## 📞 Soporte

Para cualquier problema o consulta sobre el sistema, contacta al desarrollador.
felipe.heredia@correo.ucu.edu.uy
jorge.mendez@correo.ucu.edu.uy
vale.rodriguez@correo.ucu.edu.uy

---

**Sistema desarrollado para Cafés Marloy** ☕
*Gestión inteligente de máquinas de café* 
