from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import mysql.connector
from mysql.connector import Error
from functools import wraps

proveedor_bp = Blueprint('proveedor', __name__)

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

def require_admin(f):
    """Decorador para rutas que requieren permisos de administrador"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        current_user = get_jwt_identity()
        if not current_user.get('es_administrador'):
            return jsonify({'message': 'Se requieren permisos de administrador'}), 403
        return f(*args, **kwargs)
    return decorated_function

@proveedor_bp.route('', methods=['GET'])
@jwt_required()
def get_proveedores():
    """Obtener todos los proveedores"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM proveedores ORDER BY nombre")
        proveedores = cursor.fetchall()
        
        cursor.close()
        connection.close()
        
        return jsonify(proveedores), 200
        
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@proveedor_bp.route('', methods=['POST'])
@require_admin
def create_proveedor():
    """Crear un nuevo proveedor (solo administradores)"""
    try:
        data = request.get_json()
        
        if not data or not data.get('nombre'):
            return jsonify({'message': 'Nombre es requerido'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor()
        
        query = """
        INSERT INTO proveedores (nombre, contacto)
        VALUES (%s, %s)
        """
        values = (
            data.get('nombre'),
            data.get('contacto')
        )
        
        cursor.execute(query, values)
        connection.commit()
        
        proveedor_id = cursor.lastrowid
        cursor.close()
        connection.close()
        
        return jsonify({'id': proveedor_id, 'message': 'Proveedor creado exitosamente'}), 201
        
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@proveedor_bp.route('/<int:proveedor_id>', methods=['PUT'])
@require_admin
def update_proveedor(proveedor_id):
    """Actualizar un proveedor (solo administradores)"""
    try:
        data = request.get_json()
        
        if not data or not data.get('nombre'):
            return jsonify({'message': 'Nombre es requerido'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor()
        
        query = """
        UPDATE proveedores 
        SET nombre = %s, contacto = %s
        WHERE id = %s
        """
        values = (
            data.get('nombre'),
            data.get('contacto'),
            proveedor_id
        )
        
        cursor.execute(query, values)
        connection.commit()
        
        if cursor.rowcount == 0:
            cursor.close()
            connection.close()
            return jsonify({'message': 'Proveedor no encontrado'}), 404
        
        cursor.close()
        connection.close()
        
        return jsonify({'message': 'Proveedor actualizado exitosamente'}), 200
        
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@proveedor_bp.route('/<int:proveedor_id>', methods=['DELETE'])
@require_admin
def delete_proveedor(proveedor_id):
    """Eliminar un proveedor (solo administradores)"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor()
        
        # Verificar si el proveedor tiene insumos asociados
        cursor.execute("SELECT COUNT(*) as count FROM insumos WHERE id_proveedor = %s", (proveedor_id,))
        result = cursor.fetchone()
        
        if result[0] > 0:
            cursor.close()
            connection.close()
            return jsonify({'message': 'No se puede eliminar el proveedor porque tiene insumos asociados'}), 400
        
        # Eliminar proveedor
        cursor.execute("DELETE FROM proveedores WHERE id = %s", (proveedor_id,))
        connection.commit()
        
        if cursor.rowcount == 0:
            cursor.close()
            connection.close()
            return jsonify({'message': 'Proveedor no encontrado'}), 404
        
        cursor.close()
        connection.close()
        
        return jsonify({'message': 'Proveedor eliminado exitosamente'}), 200
        
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500 