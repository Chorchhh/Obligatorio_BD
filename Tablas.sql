DROP DATABASE IF EXISTS Obligatorio;
CREATE DATABASE Obligatorio DEFAULT CHARACTER SET utf8 COLLATE utf8_spanish_ci;

CREATE TABLE Obligatorio.proveedores (
    id INT AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL,
    contacto VARCHAR(12),
    PRIMARY KEY (id)
);

CREATE TABLE Obligatorio.clientes (
    id INT AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    direccion VARCHAR(100),
    telefono VARCHAR(12),
    correo VARCHAR(50) UNIQUE,
    PRIMARY KEY (id)
);


CREATE TABLE Obligatorio.tecnicos (
    ci INT,
    nombre VARCHAR(30) NOT NULL,
    apellido VARCHAR(30) NOT NULL,
    telefono VARCHAR(12),
    PRIMARY KEY (ci)
);


CREATE TABLE Obligatorio.login (
    correo VARCHAR(50),
    contraseña VARCHAR(60) NOT NULL,
    es_administrador BOOLEAN DEFAULT FALSE,
    id_cliente INT,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id),
    PRIMARY KEY (correo)
);




CREATE TABLE Obligatorio.insumos (
    id INT AUTO_INCREMENT,
    descripcion VARCHAR(70) NOT NULL,
    tipo VARCHAR(30),
    precio_unitario DECIMAL(8, 2) NOT NULL,
    id_proveedor INT,
    PRIMARY KEY (id),
    FOREIGN KEY (id_proveedor) REFERENCES proveedores(id)
);

CREATE TABLE Obligatorio.maquinas (
    id INT AUTO_INCREMENT,
    modelo VARCHAR(30) NOT NULL,
    id_cliente INT NOT NULL,
    ubicacion_cliente VARCHAR(100) NOT NULL,
    costo_alquiler_mensual DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id)
);

CREATE TABLE Obligatorio.registro_consumo (
    id INT AUTO_INCREMENT,
    id_maquina INT,
    id_insumo INT,
    fecha DATE NOT NULL,
    cantidad_usada INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_maquina) REFERENCES maquinas(id),
    FOREIGN KEY (id_insumo)  REFERENCES insumos(id)
);

CREATE TABLE Obligatorio.mantenimientos(
    id INT AUTO_INCREMENT,
    id_maquina INT NOT NULL,
    ci_tecnico INT NOT NULL,
    tipo VARCHAR(30) NOT NULL,
    fecha DATETIME NOT NULL,
    observaciones VARCHAR(250),
    PRIMARY KEY (id),
    FOREIGN KEY (id_maquina) REFERENCES maquinas(id),
    FOREIGN KEY (ci_tecnico) REFERENCES tecnicos(ci)
);

INSERT INTO Obligatorio.proveedores (nombre, contacto) VALUES
('Distribuidora Norte', '094 123 456'),
('Café Premium SA', '094 234 567'),
('Insumos del Sur', '094 345 678'),
('Lácteos Frescos', '099 111 222'),
('Especias & Más', '098 333 444');


INSERT INTO Obligatorio.clientes (nombre, direccion, telefono, correo) VALUES
('Empresa TechSoft', '8 de octubre 1234', '094 987 654', 'admin@techsoft.com'),
('Hospital Central', 'Av. Italia 2567', '094 876 543', 'contacto@hospitalcentral.uy'),
('UCU', '18 de Julio 1456', '094 765 432', 'servicios@ucu.edu.uy'),
('Banco Nacional', 'Mercedes 1890', '094 654 321', 'operaciones@bn.com.uy'),
('Centro Comercial', 'Pocitos 3456', '094 543 210', 'administracion@ccpocitos.com');

INSERT INTO Obligatorio.tecnicos (ci, nombre, apellido, telefono) VALUES
(12345678, 'Carlos', 'Martínez', '094 111 111'),
(23456789, 'Ana', 'González', '094 222 222'),
(34567890, 'Luis', 'Rodríguez', '094 333 333'),
(45678901, 'María', 'Fernández', '094 444 444');

INSERT INTO Obligatorio.login (correo, contraseña, es_administrador, id_cliente) VALUES
('admin@cafesmarloy.com', '$2b$12$hash_admin_password', TRUE, NULL),
('supervisor@cafesmarloy.com', '$2b$12$hash_supervisor_password', TRUE, NULL),
('admin@techsoft.com', '$2b$12$hash_client_password', FALSE, 1),
('contacto@hospitalcentral.uy', '$2b$12$hash_client_password', FALSE, 2),
('servicios@ucu.edu.uy', '$2b$12$hash_client_password', FALSE, 3);

INSERT INTO Obligatorio.insumos (descripcion, tipo, precio_unitario, id_proveedor) VALUES
('Café en grano premium', 'Café', 450.00, 2),
('Leche en polvo', 'Lácteo', 280.00, 4),
('Azúcar blanca', 'Endulzante', 65.00, 3),
('Chocolate en polvo', 'Saborizante', 320.00, 1),
('Canela molida', 'Especia', 180.00, 5),
('Crema vegetal', 'Lácteo', 150.00, 4),
('Café soluble', 'Café', 380.00, 2),
('Edulcorante artificial', 'Endulzante', 95.00, 3);

INSERT INTO Obligatorio.maquinas (modelo, id_cliente, ubicacion_cliente, costo_alquiler_mensual) VALUES
('CoffeeMax Pro 3000', 1, 'Hall principal', 15000.00),
('CoffeeMax Pro 3000', 1, 'Piso 3 - Oficinas', 15000.00),
('EspressoMatic 2500', 2, 'Sala de espera', 12000.00),
('EspressoMatic 2500', 2, 'Cafetería planta baja', 12000.00),
('CoffeeMax Basic 1500', 3, 'Biblioteca', 10000.00),
('CoffeeMax Pro 3000', 4, 'Lobby principal', 15000.00),
('EspressoMatic 2500', 5, 'Food court', 12000.00);

INSERT INTO Obligatorio.registro_consumo (id_maquina, id_insumo, fecha, cantidad_usada) VALUES
(1, 1, '2025-06-01', 500),
(1, 2, '2025-06-01', 200),
(1, 3, '2025-06-01', 150),
(2, 1, '2025-06-02', 300),
(2, 4, '2025-06-02', 100),
(3, 7, '2025-06-01', 400),
(3, 2, '2025-06-01', 250),
(4, 1, '2025-06-03', 600),
(5, 6, '2025-06-03', 180);

INSERT INTO Obligatorio.mantenimientos (id_maquina, ci_tecnico, tipo, fecha, observaciones) VALUES
(1, 12345678, 'Preventivo', '2025-06-01 09:00:00', 'Limpieza general y calibración'),
(2, 23456789, 'Correctivo', '2025-06-02 14:30:00', 'Reparación bomba de agua'),
(3, 34567890, 'Preventivo', '2025-06-03 10:15:00', 'Cambio de filtros'),
(4, 45678901, 'Preventivo', '2025-06-04 08:45:00', 'Mantenimiento rutinario'),
(5, 12345678, 'Correctivo', '2025-06-05 16:00:00', 'Problema en dispensador de azúcar');

SELECT * FROM Obligatorio.mantenimientos
WHERE DATE(fecha) BETWEEN '2025-06-01' AND '2025-06-03';

-- Ganancias
SELECT c.nombre AS cliente,
    (
           SELECT SUM(m.costo_alquiler_mensual)
           FROM Obligatorio.maquinas m
           WHERE m.id_cliente = c.id
    ) AS total_alquiler,

    (
        SELECT SUM(r.cantidad_usada * i.precio_unitario)
        FROM Obligatorio.maquinas m
        LEFT JOIN Obligatorio.registro_consumo r ON r.id_maquina = m.id
        LEFT JOIN Obligatorio.insumos i ON r.id_insumo = i.id
        WHERE m.id_cliente = c.id
    ) AS total_insumos,
    COALESCE(
        (
          SELECT SUM(m.costo_alquiler_mensual)
          FROM Obligatorio.maquinas m
          WHERE m.id_cliente = c.id
        ), 0
    )
    +
    COALESCE(
        (
        SELECT SUM(r.cantidad_usada * i.precio_unitario)
        FROM Obligatorio.maquinas m
        LEFT JOIN Obligatorio.registro_consumo r ON r.id_maquina = m.id
        LEFT JOIN Obligatorio.insumos i ON r.id_insumo = i.id
        WHERE m.id_cliente = c.id
        ), 0
  ) AS total_ganancias
FROM Obligatorio.clientes c
ORDER BY total_alquiler + total_insumos DESC;

-- Insumos más usados
SELECT i.descripcion,
SUM(rc.cantidad_usada) AS total_insumos,
SUM(i.precio_unitario * rc.cantidad_usada) AS total_ganancias
FROM Obligatorio.insumos i
JOIN obligatorio.registro_consumo rc on i.id = rc.id_insumo
GROUP BY i.id
ORDER BY total_ganancias DESC
LIMIT 2;

-- Técnicos con más mantenimientos

SELECT t.nombre, t.apellido,
COUNT(*) AS cantidad_mantenimientos
FROM Obligatorio.tecnicos t
JOIN Obligatorio.mantenimientos m ON t.ci = m.ci_tecnico
GROUP BY t.ci
ORDER BY cantidad_mantenimientos DESC;