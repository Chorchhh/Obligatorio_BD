from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import mysql.connector
from mysql.connector import Error

cliente_bp = Blueprint('cliente', __name__)

def get_db_connection():
    """Obtener conexión a la base de datos"""
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='Obligatorio',
            user='root',
            password='',
            charset='utf8',
            collation='utf8_spanish_ci'
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

@cliente_bp.route('', methods=['GET'])
@jwt_required()
def get_clientes():
    """Obtener todos los clientes"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM clientes ORDER BY nombre")
        clientes = cursor.fetchall()
        
        cursor.close()
        connection.close()
        
        return jsonify(clientes), 200
        
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@cliente_bp.route('', methods=['POST'])
@jwt_required()
def create_cliente():
    """Crear un nuevo cliente"""
    try:
        data = request.get_json()
        
        if not data or not data.get('nombre'):
            return jsonify({'message': 'Nombre es requerido'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor()
        
        query = """
        INSERT INTO clientes (nombre, direccion, telefono, correo)
        VALUES (%s, %s, %s, %s)
        """
        values = (
            data.get('nombre'),
            data.get('direccion'),
            data.get('telefono'),
            data.get('correo')
        )
        
        cursor.execute(query, values)
        connection.commit()
        
        cliente_id = cursor.lastrowid
        cursor.close()
        connection.close()
        
        return jsonify({'id': cliente_id, 'message': 'Cliente creado exitosamente'}), 201
        
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@cliente_bp.route('/<int:cliente_id>', methods=['PUT'])
@jwt_required()
def update_cliente(cliente_id):
    """Actualizar un cliente"""
    try:
        data = request.get_json()
        
        if not data or not data.get('nombre'):
            return jsonify({'message': 'Nombre es requerido'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor()
        
        query = """
        UPDATE clientes 
        SET nombre = %s, direccion = %s, telefono = %s, correo = %s
        WHERE id = %s
        """
        values = (
            data.get('nombre'),
            data.get('direccion'),
            data.get('telefono'),
            data.get('correo'),
            cliente_id
        )
        
        cursor.execute(query, values)
        connection.commit()
        
        if cursor.rowcount == 0:
            cursor.close()
            connection.close()
            return jsonify({'message': 'Cliente no encontrado'}), 404
        
        cursor.close()
        connection.close()
        
        return jsonify({'message': 'Cliente actualizado exitosamente'}), 200
        
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@cliente_bp.route('/<int:cliente_id>', methods=['DELETE'])
@jwt_required()
def delete_cliente(cliente_id):
    """Eliminar un cliente"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor()
        
        # Verificar si el cliente tiene máquinas asociadas
        cursor.execute("SELECT COUNT(*) as count FROM maquinas WHERE id_cliente = %s", (cliente_id,))
        result = cursor.fetchone()
        
        if result[0] > 0:
            cursor.close()
            connection.close()
            return jsonify({'message': 'No se puede eliminar el cliente porque tiene máquinas asociadas'}), 400
        
        # Eliminar cliente
        cursor.execute("DELETE FROM clientes WHERE id = %s", (cliente_id,))
        connection.commit()
        
        if cursor.rowcount == 0:
            cursor.close()
            connection.close()
            return jsonify({'message': 'Cliente no encontrado'}), 404
        
        cursor.close()
        connection.close()
        
        return jsonify({'message': 'Cliente eliminado exitosamente'}), 200
        
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500 