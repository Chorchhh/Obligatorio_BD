from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import mysql.connector
from mysql.connector import Error
import bcrypt
import os
from datetime import timedelta, datetime
from functools import wraps
import traceback

# Importar rutas
from routes.auth_routes import auth_bp
from routes.cliente_routes import cliente_bp
from routes.proveedor_routes import proveedor_bp
from routes.tecnico_routes import tecnico_bp
from routes.insumo_routes import insumo_bp
from routes.maquina_routes import maquina_bp
from routes.mantenimiento_routes import mantenimiento_bp
from routes.consumo_routes import consumo_bp
from routes.reporte_routes import reporte_bp

# Configurar Flask
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'cafes-marloy-secret-key-2025'  # Cambiar en producción
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Configurar CORS y JWT
CORS(app, origins=['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'])
jwt = JWTManager(app)

# Configuración de base de datos
DB_CONFIG = {
    'host': 'localhost',
    'database': 'Obligatorio',
    'user': 'root',
    'password': '',  # Ajustar según configuración local
    'charset': 'utf8',
    'collation': 'utf8_spanish_ci'
}

def get_db_connection():
    """Obtener conexión a la base de datos"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
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

# Registrar blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(cliente_bp, url_prefix='/api/clientes')
app.register_blueprint(proveedor_bp, url_prefix='/api/proveedores')
app.register_blueprint(tecnico_bp, url_prefix='/api/tecnicos')
app.register_blueprint(insumo_bp, url_prefix='/api/insumos')
app.register_blueprint(maquina_bp, url_prefix='/api/maquinas')
app.register_blueprint(mantenimiento_bp, url_prefix='/api/mantenimientos')
app.register_blueprint(consumo_bp, url_prefix='/api/registro-consumo')
app.register_blueprint(reporte_bp, url_prefix='/api/reportes')

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint de verificación de salud"""
    return jsonify({'status': 'OK', 'message': 'API funcionando correctamente'}), 200

@app.route('/api/dashboard/stats', methods=['GET'])
@jwt_required()
def dashboard_stats():
    """Obtener estadísticas para el dashboard"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        cursor = connection.cursor(dictionary=True)
        
        # Obtener estadísticas básicas
        stats = {}
        
        # Total de clientes
        cursor.execute("SELECT COUNT(*) as total FROM clientes")
        stats['totalClientes'] = cursor.fetchone()['total']
        
        # Total de máquinas
        cursor.execute("SELECT COUNT(*) as total FROM maquinas")
        stats['totalMaquinas'] = cursor.fetchone()['total']
        
        # Total de insumos
        cursor.execute("SELECT COUNT(*) as total FROM insumos")
        stats['totalInsumos'] = cursor.fetchone()['total']
        
        # Total de técnicos
        cursor.execute("SELECT COUNT(*) as total FROM tecnicos")
        stats['totalTecnicos'] = cursor.fetchone()['total']
        
        # Total de mantenimientos
        cursor.execute("SELECT COUNT(*) as total FROM mantenimientos")
        stats['totalMantenimientos'] = cursor.fetchone()['total']
        
        # Total de registros de consumo
        cursor.execute("SELECT COUNT(*) as total FROM registro_consumo")
        stats['totalConsumos'] = cursor.fetchone()['total']
        
        cursor.close()
        connection.close()
        
        return jsonify(stats), 200
        
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint no encontrado'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Error interno del servidor'}), 500

@app.errorhandler(Exception)
def handle_exception(e):
    """Manejo global de excepciones"""
    print(f"Excepción no manejada: {e}")
    print(traceback.format_exc())
    return jsonify({'error': 'Error interno del servidor'}), 500

if __name__ == '__main__':
    print("🚀 Iniciando servidor de Cafés Marloy...")
    print("📊 Dashboard disponible en: http://localhost:5000/api/health")
    print("🔑 Endpoints de autenticación: http://localhost:5000/api/auth/")
    app.run(debug=True, host='0.0.0.0', port=5000) 