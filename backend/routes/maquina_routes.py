from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import mysql.connector
from mysql.connector import Error
from functools import wraps

maquina_bp = Blueprint('maquina', __name__)

def get_db_connection():
    try:
        return mysql.connector.connect(
            host='localhost', database='Obligatorio', user='root', password='',
            charset='utf8', collation='utf8_spanish_ci'
        )
    except Error as e:
        return None

def require_admin(f):
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        current_user = get_jwt_identity()
        if not current_user.get('es_administrador'):
            return jsonify({'message': 'Se requieren permisos de administrador'}), 403
        return f(*args, **kwargs)
    return decorated_function

@maquina_bp.route('', methods=['GET'])
@jwt_required()
def get_maquinas():
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT m.*, c.nombre as cliente_nombre 
            FROM maquinas m 
            LEFT JOIN clientes c ON m.id_cliente = c.id 
            ORDER BY m.modelo
        """)
        maquinas = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(maquinas), 200
    except Error as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@maquina_bp.route('', methods=['POST'])
@require_admin
def create_maquina():
    try:
        data = request.get_json()
        required_fields = ['modelo', 'id_cliente', 'ubicacion_cliente', 'costo_alquiler_mensual']
        if not data or not all(data.get(field) for field in required_fields):
            return jsonify({'message': 'Todos los campos son requeridos'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor()
        query = "INSERT INTO maquinas (modelo, id_cliente, ubicacion_cliente, costo_alquiler_mensual) VALUES (%s, %s, %s, %s)"
        values = (data.get('modelo'), data.get('id_cliente'), data.get('ubicacion_cliente'), data.get('costo_alquiler_mensual'))
        
        cursor.execute(query, values)
        connection.commit()
        maquina_id = cursor.lastrowid
        cursor.close()
        connection.close()
        
        return jsonify({'id': maquina_id, 'message': 'Máquina creada exitosamente'}), 201
    except Error as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@maquina_bp.route('/<int:maquina_id>', methods=['PUT'])
@require_admin
def update_maquina(maquina_id):
    try:
        data = request.get_json()
        required_fields = ['modelo', 'id_cliente', 'ubicacion_cliente', 'costo_alquiler_mensual']
        if not data or not all(data.get(field) for field in required_fields):
            return jsonify({'message': 'Todos los campos son requeridos'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor()
        query = "UPDATE maquinas SET modelo = %s, id_cliente = %s, ubicacion_cliente = %s, costo_alquiler_mensual = %s WHERE id = %s"
        values = (data.get('modelo'), data.get('id_cliente'), data.get('ubicacion_cliente'), data.get('costo_alquiler_mensual'), maquina_id)
        
        cursor.execute(query, values)
        connection.commit()
        
        if cursor.rowcount == 0:
            cursor.close()
            connection.close()
            return jsonify({'message': 'Máquina no encontrada'}), 404
        
        cursor.close()
        connection.close()
        return jsonify({'message': 'Máquina actualizada exitosamente'}), 200
    except Error as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@maquina_bp.route('/<int:maquina_id>', methods=['DELETE'])
@require_admin
def delete_maquina(maquina_id):
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor()
        
        # Verificar si tiene mantenimientos o consumos
        cursor.execute("SELECT COUNT(*) as count FROM mantenimientos WHERE id_maquina = %s", (maquina_id,))
        mantenimientos = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) as count FROM registro_consumo WHERE id_maquina = %s", (maquina_id,))
        consumos = cursor.fetchone()[0]
        
        if mantenimientos > 0 or consumos > 0:
            cursor.close()
            connection.close()
            return jsonify({'message': 'No se puede eliminar la máquina porque tiene registros asociados'}), 400
        
        cursor.execute("DELETE FROM maquinas WHERE id = %s", (maquina_id,))
        connection.commit()
        
        if cursor.rowcount == 0:
            cursor.close()
            connection.close()
            return jsonify({'message': 'Máquina no encontrada'}), 404
        
        cursor.close()
        connection.close()
        return jsonify({'message': 'Máquina eliminada exitosamente'}), 200
    except Error as e:
        return jsonify({'error': 'Error interno del servidor'}), 500 