from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import mysql.connector
from mysql.connector import Error

reporte_bp = Blueprint('reporte', __name__)

def get_db_connection():
    try:
        return mysql.connector.connect(
            host='localhost', database='Obligatorio', user='root', password='',
            charset='utf8', collation='utf8_spanish_ci'
        )
    except Error as e:
        return None

@reporte_bp.route('/ganancias-clientes', methods=['GET'])
@jwt_required()
def ganancias_clientes():
    """Reporte de ganancias por cliente"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT c.nombre AS cliente,
                   SUM(m.costo_alquiler_mensual) AS total_alquiler,
                   COALESCE(SUM(r.cantidad_usada * i.precio_unitario), 0) AS total_insumos,
                   SUM(m.costo_alquiler_mensual) + COALESCE(SUM(r.cantidad_usada * i.precio_unitario), 0) AS ganancias_totales
            FROM clientes c
            JOIN maquinas m ON c.id = m.id_cliente
            LEFT JOIN registro_consumo r ON r.id_maquina = m.id
            LEFT JOIN insumos i ON r.id_insumo = i.id
            GROUP BY c.id, c.nombre
            ORDER BY ganancias_totales DESC
            LIMIT 10
        """)
        resultados = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(resultados), 200
    except Error as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@reporte_bp.route('/insumos-populares', methods=['GET'])
@jwt_required()
def insumos_populares():
    """Reporte de insumos más consumidos"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT i.descripcion,
                   SUM(rc.cantidad_usada) AS total_insumos,
                   SUM(i.precio_unitario * rc.cantidad_usada) AS total_ganancias
            FROM insumos i
            JOIN registro_consumo rc ON i.id = rc.id_insumo
            GROUP BY i.id, i.descripcion
            ORDER BY total_ganancias DESC
            LIMIT 10
        """)
        resultados = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(resultados), 200
    except Error as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@reporte_bp.route('/tecnicos-activos', methods=['GET'])
@jwt_required()
def tecnicos_activos():
    """Reporte de técnicos con más mantenimientos"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT t.nombre, t.apellido,
                   COUNT(*) AS cantidad_mantenimientos
            FROM tecnicos t
            JOIN mantenimientos m ON t.ci = m.ci_tecnico
            GROUP BY t.ci, t.nombre, t.apellido
            ORDER BY cantidad_mantenimientos DESC
            LIMIT 10
        """)
        resultados = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(resultados), 200
    except Error as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@reporte_bp.route('/clientes-mas-maquinas', methods=['GET'])
@jwt_required()
def clientes_mas_maquinas():
    """Reporte de clientes con más máquinas"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT c.nombre,
                   COUNT(m.id) AS cantidad_maquinas
            FROM clientes c
            LEFT JOIN maquinas m ON c.id = m.id_cliente
            GROUP BY c.id, c.nombre
            HAVING cantidad_maquinas > 0
            ORDER BY cantidad_maquinas DESC
            LIMIT 10
        """)
        resultados = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(resultados), 200
    except Error as e:
        return jsonify({'error': 'Error interno del servidor'}), 500 