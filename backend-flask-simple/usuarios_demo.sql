-- ============================================================
-- SCRIPT PARA CREAR USUARIOS DE DEMOSTRACIÓN
-- ============================================================
-- Ejecuta este script en tu base de datos MySQL para crear usuarios de prueba

-- Crear tabla login si no existe
CREATE TABLE IF NOT EXISTS login (
    correo VARCHAR(100) PRIMARY KEY,
    contrasena VARCHAR(255) NOT NULL,
    es_administrador BOOLEAN DEFAULT FALSE
);

-- Insertar usuarios de demostración
INSERT INTO login (correo, contrasena, es_administrador) VALUES 
('admin@cafesmarloy.com', '123456', TRUE),
('usuario@cafesmarloy.com', '123456', FALSE)
ON DUPLICATE KEY UPDATE 
    contrasena = VALUES(contrasena),
    es_administrador = VALUES(es_administrador);

-- Verificar que los usuarios se crearon correctamente
SELECT correo, es_administrador FROM login;

-- ============================================================
-- INFORMACIÓN DE USUARIOS CREADOS:
-- ============================================================
-- 
-- ADMINISTRADOR:
-- ✓ Correo: admin@cafesmarloy.com
-- ✓ Contraseña: 123456
-- ✓ Permisos: Acceso completo al sistema
-- 
-- USUARIO REGULAR:
-- ✓ Correo: usuario@cafesmarloy.com  
-- ✓ Contraseña: 123456
-- ✓ Permisos: Solo lectura y operaciones básicas
-- 
-- ============================================================ 