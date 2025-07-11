from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
import mysql.connector
from mysql.connector import Error

insumo_bp = Blueprint('insumo', __name__)

# Usar configuración centralizada
from config import get_db_connection

@insumo_bp.route('', methods=['GET'])
@jwt_required()
def get_insumos():
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT i.*, p.nombre as proveedor_nombre 
            FROM insumos i 
            LEFT JOIN proveedores p ON i.id_proveedor = p.id 
            ORDER BY i.descripcion
        """)
        insumos = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(insumos), 200
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@insumo_bp.route('', methods=['POST'])
@jwt_required()
def create_insumo():
    try:
        data = request.get_json()
        if not data or not data.get('descripcion') or not data.get('precio_unitario'):
            return jsonify({'message': 'Descripción y precio son requeridos'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor()
        query = "INSERT INTO insumos (descripcion, tipo, precio_unitario, id_proveedor) VALUES (%s, %s, %s, %s)"
        values = (data.get('descripcion'), data.get('tipo'), data.get('precio_unitario'), data.get('id_proveedor'))
        
        cursor.execute(query, values)
        connection.commit()
        insumo_id = cursor.lastrowid
        cursor.close()
        connection.close()
        
        return jsonify({'id': insumo_id, 'message': 'Insumo creado exitosamente'}), 201
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@insumo_bp.route('/<int:insumo_id>', methods=['PUT'])
@jwt_required()
def update_insumo(insumo_id):
    try:
        data = request.get_json()
        if not data or not data.get('descripcion') or not data.get('precio_unitario'):
            return jsonify({'message': 'Descripción y precio son requeridos'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor()
        query = "UPDATE insumos SET descripcion = %s, tipo = %s, precio_unitario = %s, id_proveedor = %s WHERE id = %s"
        values = (data.get('descripcion'), data.get('tipo'), data.get('precio_unitario'), data.get('id_proveedor'), insumo_id)
        
        cursor.execute(query, values)
        connection.commit()
        
        if cursor.rowcount == 0:
            cursor.close()
            connection.close()
            return jsonify({'message': 'Insumo no encontrado'}), 404
        
        cursor.close()
        connection.close()
        return jsonify({'message': 'Insumo actualizado exitosamente'}), 200
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@insumo_bp.route('/<int:insumo_id>', methods=['DELETE'])
@jwt_required()
def delete_insumo(insumo_id):
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor()
        
        # Verificar si tiene registros de consumo
        cursor.execute("SELECT COUNT(*) as count FROM registro_consumo WHERE id_insumo = %s", (insumo_id,))
        result = cursor.fetchone()
        
        if result[0] > 0:
            cursor.close()
            connection.close()
            return jsonify({'message': 'No se puede eliminar el insumo porque tiene registros de consumo'}), 400
        
        cursor.execute("DELETE FROM insumos WHERE id = %s", (insumo_id,))
        connection.commit()
        
        if cursor.rowcount == 0:
            cursor.close()
            connection.close()
            return jsonify({'message': 'Insumo no encontrado'}), 404
        
        cursor.close()
        connection.close()
        return jsonify({'message': 'Insumo eliminado exitosamente'}), 200
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500 