from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
import mysql.connector
from mysql.connector import Error
import bcrypt

auth_bp = Blueprint('auth', __name__)

# Usar la configuración centralizada
from config import get_db_connection

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

@auth_bp.route('/register', methods=['POST'])
def register():
    """Endpoint de registro de usuarios"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Datos requeridos'}), 400
        
        # Validar campos requeridos
        required_fields = ['nombre', 'correo', 'contraseña']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'message': f'{field} es requerido'}), 400
        
        nombre = data.get('nombre')
        correo = data.get('correo')
        contraseña = data.get('contraseña')
        direccion = data.get('direccion', '')
        telefono = data.get('telefono', '')
        
        # Validar formato de correo básico
        if '@' not in correo or '.' not in correo:
            return jsonify({'message': 'Formato de correo inválido'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor(dictionary=True)
        
        # Verificar si el correo ya existe
        cursor.execute("SELECT correo FROM login WHERE correo = %s", (correo,))
        if cursor.fetchone():
            cursor.close()
            connection.close()
            return jsonify({'message': 'El correo ya está registrado'}), 409
        
        # Verificar si el correo ya existe en clientes
        cursor.execute("SELECT correo FROM clientes WHERE correo = %s", (correo,))
        if cursor.fetchone():
            cursor.close()
            connection.close()
            return jsonify({'message': 'El correo ya está registrado'}), 409
        
        # Crear cliente
        cursor.execute("""
            INSERT INTO clientes (nombre, direccion, telefono, correo)
            VALUES (%s, %s, %s, %s)
        """, (nombre, direccion, telefono, correo))
        
        cliente_id = cursor.lastrowid
        
        # Hash de la contraseña (para desarrollo, usamos texto plano)
        # En producción, usar bcrypt.hashpw(contraseña.encode('utf-8'), bcrypt.gensalt())
        contraseña_hash = '$2b$12$' + contraseña  # Simulación para desarrollo
        
        # Crear login (usuario cliente, no administrador)
        cursor.execute("""
            INSERT INTO login (correo, contraseña, es_administrador, id_cliente)
            VALUES (%s, %s, FALSE, %s)
        """, (correo, contraseña_hash, cliente_id))
        
        connection.commit()
        cursor.close()
        connection.close()
        
        return jsonify({
            'message': 'Usuario registrado exitosamente',
            'cliente_id': cliente_id,
            'correo': correo
        }), 201
        
    except mysql.connector.IntegrityError as e:
        return jsonify({'message': 'El correo ya está registrado'}), 409
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