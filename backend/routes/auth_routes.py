from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
import mysql.connector
from mysql.connector import Error
import bcrypt

auth_bp = Blueprint('auth', __name__)

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

@auth_bp.route('/login', methods=['POST'])
def login():
    """Endpoint de autenticación"""
    try:
        data = request.get_json()
        
        if not data or not data.get('correo'):
            return jsonify({'message': 'Correo es requerido'}), 400
        
        correo = data.get('correo')
        contraseña = data.get('contraseña', '')
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor(dictionary=True)
        
        # Buscar usuario en la tabla login
        cursor.execute("""
            SELECT l.correo, l.es_administrador, l.id_cliente, c.nombre as cliente_nombre
            FROM login l
            LEFT JOIN clientes c ON l.id_cliente = c.id
            WHERE l.correo = %s
        """, (correo,))
        
        user = cursor.fetchone()
        
        cursor.close()
        connection.close()
        
        if not user:
            return jsonify({'message': 'Credenciales inválidas'}), 401
        
        # Para desarrollo, aceptamos cualquier contraseña
        # En producción, verificar la contraseña hasheada
        
        # Crear token JWT
        user_identity = {
            'correo': user['correo'],
            'es_administrador': bool(user['es_administrador']),
            'id_cliente': user['id_cliente'],
            'cliente_nombre': user['cliente_nombre']
        }
        
        access_token = create_access_token(identity=user_identity)
        
        return jsonify({
            'token': access_token,
            'user': user_identity
        }), 200
        
    except Error as e:
        print(f"Error de base de datos: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500

@auth_bp.route('/verify', methods=['GET'])
def verify_token():
    """Verificar si el token es válido"""
    from flask_jwt_extended import jwt_required, get_jwt_identity
    
    @jwt_required()
    def verify():
        current_user = get_jwt_identity()
        return jsonify({'user': current_user}), 200
    
    return verify() 