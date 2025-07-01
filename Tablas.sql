CREATE DATABASE cafes_marloy_vale;
USE cafes_marloy_vale;

CREATE TABLE login (
    correo VARCHAR(100) PRIMARY KEY,
    contrasena VARCHAR(255) NOT NULL,
    es_administrador BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contacto VARCHAR(100)
);

CREATE TABLE insumos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL,
    tipo VARCHAR(50),
    precio_unitario DECIMAL(10,2) NOT NULL,
    id_proveedor INT,
    FOREIGN KEY (id_proveedor) REFERENCES proveedores(id)
);

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(150),
    telefono VARCHAR(20),
    correo VARCHAR(100)
);

CREATE TABLE maquinas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    modelo VARCHAR(50),
    id_cliente INT,
    ubicacion_cliente VARCHAR(100),
    costo_alquiler_mensual DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id)
);

CREATE TABLE tecnicos (
    ci VARCHAR(15) PRIMARY KEY,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    telefono VARCHAR(20)
);

CREATE TABLE mantenimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_maquina INT,
    ci_tecnico VARCHAR(15),
    tipo VARCHAR(50),
    fecha DATETIME NOT NULL,
    observaciones TEXT,
    FOREIGN KEY (id_maquina) REFERENCES maquinas(id),
    FOREIGN KEY (ci_tecnico) REFERENCES tecnicos(ci)
);

CREATE TABLE registro_consumo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_maquina INT,
    id_insumo INT,
    fecha DATE NOT NULL,
    cantidad_usada DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_maquina) REFERENCES maquinas(id),
    FOREIGN KEY (id_insumo) REFERENCES insumos(id)
);

INSERT INTO proveedores (nombre, contacto) VALUES
('Proveedor Café SA', 'contacto@cafesa.com'),
('Insumos Latinos', 'info@inslat.com'),
('SaborUruguay', 'ventas@saboruy.com'),
('Café Global Ltda.', 'global@cafe.com');

INSERT INTO insumos (descripcion, tipo, precio_unitario, id_proveedor) VALUES
('Café en grano', 'Café', 200.00, 1),
('Leche en polvo', 'Lácteo', 150.00, 2),
('Chocolate', 'Saborizante', 180.00, 2),
('Canela en polvo', 'Saborizante', 90.00, 3),
('Azúcar', 'Complemento', 50.00, 4);

INSERT INTO clientes (nombre, direccion, telefono, correo) VALUES
('Oficina Central', 'Av. Rivera 1234', '29011234', 'oficina@cliente.com'),
('Sucursal Cordón', 'Bvar. Artigas 5678', '24001122', 'sucursal@cliente.com'),
('Sucursal Parque Rodó', 'Jackson 1223', '27123456', 'parque@cliente.com'),
('Oficina Punta Carretas', '21 de Setiembre 321', '27119988', 'punta@cliente.com');

INSERT INTO maquinas (modelo, id_cliente, ubicacion_cliente, costo_alquiler_mensual) VALUES
('Modelo A1', 1, 'Hall de entrada', 1000.00),
('Modelo B2', 2, 'Cocina', 1200.00),
('Modelo C3', 2, 'Sala de espera', 1100.00),
('Modelo D4', 3, 'Entrada principal', 1050.00),
('Modelo E5', 4, 'Recepción', 950.00);

INSERT INTO tecnicos (ci, nombre, apellido, telefono) VALUES
('41234567', 'Juan', 'Pérez', '099123456'),
('42345678', 'Lucía', 'Fernández', '098765432'),
('43456789', 'Diego', 'Silva', '091234567'),
('44567890', 'Carla', 'Méndez', '097654321');

INSERT INTO mantenimientos (id_maquina, ci_tecnico, tipo, fecha, observaciones) VALUES
(1, '41234567', 'Preventivo', '2025-06-01 10:00:00', 'Sin observaciones'),
(2, '42345678', 'Correctivo', '2025-06-03 14:00:00', 'Cambio de válvula'),
(3, '41234567', 'Preventivo', '2025-06-05 09:00:00', 'Revisión general'),
(4, '43456789', 'Correctivo', '2025-06-06 15:00:00', 'Cambio de motor'),
(5, '44567890', 'Preventivo', '2025-06-07 10:00:00', 'Mantenimiento de rutina');

INSERT INTO registro_consumo (id_maquina, id_insumo, fecha, cantidad_usada) VALUES
(1, 1, '2025-06-01', 2.5),
(1, 2, '2025-06-01', 1.2),
(2, 1, '2025-06-02', 3.0),
(3, 3, '2025-06-03', 1.5),
(3, 1, '2025-06-05', 2.0),
(3, 4, '2025-06-05', 1.0),
(4, 2, '2025-06-06', 1.5),
(5, 5, '2025-06-07', 0.8),
(2, 1, '2025-06-03', 2.7);

INSERT INTO login (correo, contrasena, es_administrador) VALUES
('admin@cafesmarloy.com', 'admin123', TRUE),
('tecnico1@cafesmarloy.com', 'tecnico123', FALSE),
('admin2@cafesmarloy.com', 'admin456', TRUE),
('tecnico2@cafesmarloy.com', 'tecnico456', FALSE);
