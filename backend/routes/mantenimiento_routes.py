from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
import mysql.connector
from mysql.connector import Error

mantenimiento_bp = Blueprint('mantenimiento', __name__)

def get_db_connection():
    try:
        return mysql.connector.connect(
            host='localhost', database='Obligatorio', user='root', password='rootroot',
            charset='utf8', collation='utf8_spanish_ci'
        )
    except Error as e:
        return None

@mantenimiento_bp.route('', methods=['GET'])
@jwt_required()
def get_mantenimientos():
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT m.*, ma.modelo as maquina_modelo, t.nombre as tecnico_nombre, t.apellido as tecnico_apellido
            FROM mantenimientos m 
            LEFT JOIN maquinas ma ON m.id_maquina = ma.id 
            LEFT JOIN tecnicos t ON m.ci_tecnico = t.ci
            ORDER BY m.fecha DESC
        """)
        mantenimientos = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(mantenimientos), 200
    except Error as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@mantenimiento_bp.route('', methods=['POST'])
@jwt_required()
def create_mantenimiento():
    try:
        data = request.get_json()
        required_fields = ['id_maquina', 'ci_tecnico', 'tipo', 'fecha']
        if not data or not all(data.get(field) for field in required_fields):
            return jsonify({'message': 'Máquina, técnico, tipo y fecha son requeridos'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor()
        query = "INSERT INTO mantenimientos (id_maquina, ci_tecnico, tipo, fecha, observaciones) VALUES (%s, %s, %s, %s, %s)"
        values = (data.get('id_maquina'), data.get('ci_tecnico'), data.get('tipo'), data.get('fecha'), data.get('observaciones'))
        
        cursor.execute(query, values)
        connection.commit()
        mantenimiento_id = cursor.lastrowid
        cursor.close()
        connection.close()
        
        return jsonify({'id': mantenimiento_id, 'message': 'Mantenimiento creado exitosamente'}), 201
    except Error as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@mantenimiento_bp.route('/<int:mantenimiento_id>', methods=['PUT'])
@jwt_required()
def update_mantenimiento(mantenimiento_id):
    try:
        data = request.get_json()
        required_fields = ['id_maquina', 'ci_tecnico', 'tipo', 'fecha']
        if not data or not all(data.get(field) for field in required_fields):
            return jsonify({'message': 'Máquina, técnico, tipo y fecha son requeridos'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor()
        query = "UPDATE mantenimientos SET id_maquina = %s, ci_tecnico = %s, tipo = %s, fecha = %s, observaciones = %s WHERE id = %s"
        values = (data.get('id_maquina'), data.get('ci_tecnico'), data.get('tipo'), data.get('fecha'), data.get('observaciones'), mantenimiento_id)
        
        cursor.execute(query, values)
        connection.commit()
        
        if cursor.rowcount == 0:
            cursor.close()
            connection.close()
            return jsonify({'message': 'Mantenimiento no encontrado'}), 404
        
        cursor.close()
        connection.close()
        return jsonify({'message': 'Mantenimiento actualizado exitosamente'}), 200
    except Error as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@mantenimiento_bp.route('/<int:mantenimiento_id>', methods=['DELETE'])
@jwt_required()
def delete_mantenimiento(mantenimiento_id):
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor()
        cursor.execute("DELETE FROM mantenimientos WHERE id = %s", (mantenimiento_id,))
        connection.commit()
        
        if cursor.rowcount == 0:
            cursor.close()
            connection.close()
            return jsonify({'message': 'Mantenimiento no encontrado'}), 404
        
        cursor.close()
        connection.close()
        return jsonify({'message': 'Mantenimiento eliminado exitosamente'}), 200
    except Error as e:
        return jsonify({'error': 'Error interno del servidor'}), 500 