from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
import mysql.connector
from mysql.connector import Error

consumo_bp = Blueprint('consumo', __name__)

def get_db_connection():
    try:
        return mysql.connector.connect(
            host='localhost', database='Obligatorio', user='root', password='rootroot',
            charset='utf8', collation='utf8_spanish_ci'
        )
    except Error as e:
        return None

@consumo_bp.route('', methods=['GET'])
@jwt_required()
def get_consumos():
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT rc.*, m.modelo as maquina_modelo, i.descripcion as insumo_descripcion, i.precio_unitario
            FROM registro_consumo rc
            LEFT JOIN maquinas m ON rc.id_maquina = m.id
            LEFT JOIN insumos i ON rc.id_insumo = i.id
            ORDER BY rc.fecha DESC, rc.id DESC
        """)
        consumos = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(consumos), 200
    except Error as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@consumo_bp.route('', methods=['POST'])
@jwt_required()
def create_consumo():
    try:
        data = request.get_json()
        required_fields = ['id_maquina', 'id_insumo', 'fecha', 'cantidad_usada']
        if not data or not all(data.get(field) for field in required_fields):
            return jsonify({'message': 'Máquina, insumo, fecha y cantidad son requeridos'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor()
        query = "INSERT INTO registro_consumo (id_maquina, id_insumo, fecha, cantidad_usada) VALUES (%s, %s, %s, %s)"
        values = (data.get('id_maquina'), data.get('id_insumo'), data.get('fecha'), data.get('cantidad_usada'))
        
        cursor.execute(query, values)
        connection.commit()
        consumo_id = cursor.lastrowid
        cursor.close()
        connection.close()
        
        return jsonify({'id': consumo_id, 'message': 'Registro de consumo creado exitosamente'}), 201
    except Error as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@consumo_bp.route('/<int:consumo_id>', methods=['PUT'])
@jwt_required()
def update_consumo(consumo_id):
    try:
        data = request.get_json()
        required_fields = ['id_maquina', 'id_insumo', 'fecha', 'cantidad_usada']
        if not data or not all(data.get(field) for field in required_fields):
            return jsonify({'message': 'Máquina, insumo, fecha y cantidad son requeridos'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor()
        query = "UPDATE registro_consumo SET id_maquina = %s, id_insumo = %s, fecha = %s, cantidad_usada = %s WHERE id = %s"
        values = (data.get('id_maquina'), data.get('id_insumo'), data.get('fecha'), data.get('cantidad_usada'), consumo_id)
        
        cursor.execute(query, values)
        connection.commit()
        
        if cursor.rowcount == 0:
            cursor.close()
            connection.close()
            return jsonify({'message': 'Registro de consumo no encontrado'}), 404
        
        cursor.close()
        connection.close()
        return jsonify({'message': 'Registro de consumo actualizado exitosamente'}), 200
    except Error as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@consumo_bp.route('/<int:consumo_id>', methods=['DELETE'])
@jwt_required()
def delete_consumo(consumo_id):
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor()
        cursor.execute("DELETE FROM registro_consumo WHERE id = %s", (consumo_id,))
        connection.commit()
        
        if cursor.rowcount == 0:
            cursor.close()
            connection.close()
            return jsonify({'message': 'Registro de consumo no encontrado'}), 404
        
        cursor.close()
        connection.close()
        return jsonify({'message': 'Registro de consumo eliminado exitosamente'}), 200
    except Error as e:
        return jsonify({'error': 'Error interno del servidor'}), 500 