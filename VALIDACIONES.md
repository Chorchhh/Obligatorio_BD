# 🛡️ Sistema de Validaciones - Cafés Marloy

## 📋 Resumen de Validaciones Implementadas

Este documento describe todas las validaciones de datos implementadas en el sistema para garantizar la integridad y seguridad de los datos.

## ✅ Validaciones de Formato

### 📧 **Email**

- Formato válido según RFC estándar
- Longitud máxima: 100 caracteres
- Conversión automática a minúsculas
- Verificación de unicidad en clientes

### 📱 **Teléfono (Uruguay)**

- **Celular**: 09XXXXXXXX (9 dígitos)
- **Fijo**: 2XXXXXXX (8 dígitos)
- Limpieza automática de espacios y guiones

### 🆔 **Cédula de Identidad (Uruguay)**

- 7-8 dígitos numéricos
- Validación de dígito verificador
- Algoritmo oficial uruguayo
- Verificación de unicidad en técnicos

## 🔤 Validaciones de Texto

### ✅ **Campos Requeridos**

- **Nombre**: 2-100 caracteres
- **Apellido**: 2-50 caracteres
- **Descripción**: 3-100 caracteres
- **Tipo Mantenimiento**: 1-50 caracteres

### 📝 **Campos Opcionales**

- **Dirección**: máximo 150 caracteres
- **Contacto**: máximo 100 caracteres
- **Ubicación**: máximo 100 caracteres
- **Observaciones**: máximo 500 caracteres

### 🧹 **Sanitización**

- Eliminación de espacios extra
- Escape de caracteres HTML (prevención XSS)
- Limpieza de caracteres especiales

## 💰 Validaciones Numéricas

### 💵 **Precios y Costos**

- **Rango**: $0.00 - $999,999.99
- **Decimales**: máximo 2
- **Validación**: formato decimal válido

### 📊 **Cantidades**

- **Rango**: 0.01 - 999.99
- **Validación**: mayor a 0
- **Formato**: decimal válido

### 🔢 **IDs y Referencias**

- **Validación**: números enteros positivos
- **Verificación**: existencia en base de datos
- **Relaciones**: integridad referencial

## 📅 Validaciones de Fecha/Hora

### 📆 **Fechas**

- **Formato**: YYYY-MM-DD
- **Restricción**: no puede ser futura
- **Contexto**: consumos y registros

### ⏰ **Fecha y Hora**

- **Formato**: YYYY-MM-DD HH:MM:SS
- **Restricción**: no puede ser futura
- **Validación**: conflictos de horarios (técnicos)

## 🔒 Validaciones de Seguridad

### 🚫 **Prevención de Inyección SQL**

- Uso de parámetros preparados
- Validación de tipos de datos
- Escapado de caracteres especiales

### 🛡️ **Prevención XSS**

- Sanitización HTML automática
- Validación de longitudes
- Filtrado de caracteres peligrosos

### 🔐 **Autenticación**

- Validación de email en login
- Verificación de contraseña no vacía
- Manejo seguro de errores

## 🗂️ Validaciones por Endpoint

### 👥 **Clientes** (`/api/clientes`)

- ✅ Nombre: requerido (2-100 chars)
- ✅ Email: formato válido, único
- ✅ Teléfono: formato uruguayo
- ✅ Dirección: opcional (max 150 chars)

### 🔧 **Técnicos** (`/api/tecnicos`)

- ✅ Cédula: formato uruguayo válido, único
- ✅ Nombre: requerido (2-50 chars)
- ✅ Apellido: requerido (2-50 chars)
- ✅ Teléfono: formato uruguayo

### 📦 **Insumos** (`/api/insumos`)

- ✅ Descripción: requerida (3-100 chars)
- ✅ Tipo: opcional (max 50 chars)
- ✅ Precio: válido ($0.00-$999,999.99)
- ✅ Proveedor: existencia verificada

### 🏭 **Proveedores** (`/api/proveedores`)

- ✅ Nombre: requerido (2-100 chars), único
- ✅ Contacto: opcional (max 100 chars)

### ⚙️ **Máquinas** (`/api/maquinas`)

- ✅ Modelo: opcional (max 50 chars)
- ✅ Cliente: ID válido, existencia verificada
- ✅ Ubicación: opcional (max 100 chars)
- ✅ Costo: válido ($0.00-$999,999.99)

### 📊 **Consumos** (`/api/consumo`)

- ✅ Máquina: ID válido, existencia verificada
- ✅ Insumo: ID válido, existencia verificada
- ✅ Fecha: formato válido, no futura
- ✅ Cantidad: válida (0.01-999.99)

### 🔧 **Mantenimientos** (`/api/mantenimiento`)

- ✅ Máquina: ID válido, existencia verificada
- ✅ Técnico: cédula válida, existencia verificada
- ✅ Tipo: requerido (1-50 chars)
- ✅ Fecha/Hora: formato válido, no futura
- ✅ Disponibilidad: sin conflictos de horario
- ✅ Observaciones: opcional (max 500 chars)

## ⚠️ Manejo de Errores

### 🚨 **Códigos de Respuesta**

- **400**: Error de validación (datos inválidos)
- **500**: Error interno del servidor
- **401**: No autenticado
- **403**: Sin permisos

### 📝 **Mensajes de Error**

- Específicos y descriptivos
- En español para usuario final
- Sin información sensible del sistema

### 🔍 **Tipos de Validación**

```javascript
// Ejemplos de respuestas de error
{
  "error": "Email es requerido"
}
{
  "error": "Cédula debe tener entre 7 y 8 dígitos numéricos"
}
{
  "error": "Ya existe un cliente con ese email"
}
```

## 🎯 Beneficios Implementados

### 🛡️ **Seguridad**

- Prevención de inyección SQL
- Prevención de ataques XSS
- Validación de entrada robusta

### 📊 **Calidad de Datos**

- Formatos consistentes
- Datos completos y válidos
- Integridad referencial

### 👤 **Experiencia de Usuario**

- Mensajes de error claros
- Validación inmediata
- Prevención de errores comunes

### 🔧 **Mantenibilidad**

- Código centralizado
- Funciones reutilizables
- Fácil extensión

## 📋 Testing de Validaciones

Para probar las validaciones, puedes intentar:

1. **Email inválido**: `test@invalid` → Error de formato
2. **Cédula inválida**: `1234567` → Error de dígito verificador
3. **Precio negativo**: `-100` → Error de rango
4. **Fecha futura**: `2030-12-31` → Error de restricción temporal
5. **Campos vacíos**: `""` → Error de campo requerido

---

✅ **Sistema completamente validado y seguro**
