from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import mysql.connector
from mysql.connector import Error
from functools import wraps

tecnico_bp = Blueprint('tecnico', __name__)

def get_db_connection():
    try:
        return mysql.connector.connect(
            host='localhost', database='Obligatorio', user='root', password='rootroot',
            charset='utf8', collation='utf8_spanish_ci'
        )
    except Error as e:
        print(f"Error: {e}")
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

@tecnico_bp.route('', methods=['GET'])
@jwt_required()
def get_tecnicos():
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM tecnicos ORDER BY nombre, apellido")
        tecnicos = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(tecnicos), 200
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@tecnico_bp.route('', methods=['POST'])
@require_admin
def create_tecnico():
    try:
        data = request.get_json()
        if not data or not data.get('ci') or not data.get('nombre') or not data.get('apellido'):
            return jsonify({'message': 'CI, nombre y apellido son requeridos'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor()
        query = "INSERT INTO tecnicos (ci, nombre, apellido, telefono) VALUES (%s, %s, %s, %s)"
        values = (data.get('ci'), data.get('nombre'), data.get('apellido'), data.get('telefono'))
        
        cursor.execute(query, values)
        connection.commit()
        cursor.close()
        connection.close()
        
        return jsonify({'message': 'Técnico creado exitosamente'}), 201
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@tecnico_bp.route('/<int:ci>', methods=['PUT'])
@require_admin
def update_tecnico(ci):
    try:
        data = request.get_json()
        if not data or not data.get('nombre') or not data.get('apellido'):
            return jsonify({'message': 'Nombre y apellido son requeridos'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor()
        query = "UPDATE tecnicos SET nombre = %s, apellido = %s, telefono = %s WHERE ci = %s"
        values = (data.get('nombre'), data.get('apellido'), data.get('telefono'), ci)
        
        cursor.execute(query, values)
        connection.commit()
        
        if cursor.rowcount == 0:
            cursor.close()
            connection.close()
            return jsonify({'message': 'Técnico no encontrado'}), 404
        
        cursor.close()
        connection.close()
        return jsonify({'message': 'Técnico actualizado exitosamente'}), 200
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@tecnico_bp.route('/<int:ci>', methods=['DELETE'])
@require_admin
def delete_tecnico(ci):
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor()
        
        # Verificar si tiene mantenimientos
        cursor.execute("SELECT COUNT(*) as count FROM mantenimientos WHERE ci_tecnico = %s", (ci,))
        result = cursor.fetchone()
        
        if result[0] > 0:
            cursor.close()
            connection.close()
            return jsonify({'message': 'No se puede eliminar el técnico porque tiene mantenimientos asignados'}), 400
        
        cursor.execute("DELETE FROM tecnicos WHERE ci = %s", (ci,))
        connection.commit()
        
        if cursor.rowcount == 0:
            cursor.close()
            connection.close()
            return jsonify({'message': 'Técnico no encontrado'}), 404
        
        cursor.close()
        connection.close()
        return jsonify({'message': 'Técnico eliminado exitosamente'}), 200
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500 