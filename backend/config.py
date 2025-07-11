import os
from typing import Dict, Any

class DatabaseConfig:
    """Configuración de base de datos con variables de entorno"""
    
    @staticmethod
    def get_config() -> Dict[str, Any]:
        """
        Obtiene la configuración de base de datos desde variables de entorno
        o usa valores por defecto para desarrollo local
        
        Para cambiar la configuración:
        1. Exporta las variables de entorno en tu terminal:
           export DB_HOST=tu_host
           export DB_USER=tu_usuario
           export DB_PASSWORD=tu_contraseña
           
        2. O crea un archivo .env en la carpeta backend/ con:
           DB_HOST=tu_host
           DB_USER=tu_usuario
           DB_PASSWORD=tu_contraseña
        """
        
        return {
            'host': os.getenv('DB_HOST', 'localhost'),
            'port': int(os.getenv('DB_PORT', '3306')),
            'database': os.getenv('DB_NAME', 'Obligatorio'),
            'user': os.getenv('DB_USER', 'root'),
            'password': os.getenv('DB_PASSWORD', 'rootroot'),
            'charset': 'utf8',
            'collation': 'utf8_spanish_ci',
            'autocommit': True,
            'raise_on_warnings': True
        }

class ServerConfig:
    """Configuración del servidor Flask"""
    
    @staticmethod
    def get_config() -> Dict[str, Any]:
        return {
            'port': int(os.getenv('FLASK_PORT', '5000')),
            'debug': os.getenv('FLASK_DEBUG', 'true').lower() == 'true',
            'host': os.getenv('FLASK_HOST', '0.0.0.0')
        }

class SecurityConfig:
    """Configuración de seguridad"""
    
    @staticmethod
    def get_jwt_secret() -> str:
        return os.getenv('JWT_SECRET_KEY', 'cafes-marloy-secret-key-2025')
    
    @staticmethod
    def get_cors_origins() -> list:
        frontend_urls = os.getenv('FRONTEND_URLS', 'http://localhost:3000,http://localhost:3001,http://localhost:3002')
        return [url.strip() for url in frontend_urls.split(',')]

def load_env_file():
    """Carga variables de entorno desde archivo .env si existe"""
    env_file = os.path.join(os.path.dirname(__file__), '.env')
    
    if os.path.exists(env_file):
        print(f"📄 Cargando configuración desde: {env_file}")
        with open(env_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()
    else:
        print("⚠️  No se encontró archivo .env, usando configuración por defecto")

# Cargar configuración PRIMERO
load_env_file()

# Configuraciones para fácil acceso (DESPUÉS de cargar .env)
DB_CONFIG = DatabaseConfig.get_config()
SERVER_CONFIG = ServerConfig.get_config()
JWT_SECRET = SecurityConfig.get_jwt_secret()
CORS_ORIGINS = SecurityConfig.get_cors_origins()

def print_config_summary():
    """Imprime un resumen de la configuración actual"""
    print("\n" + "="*50)
    print("📋 CONFIGURACIÓN ACTUAL")
    print("="*50)
    print(f"🗄️  Base de datos: {DB_CONFIG['user']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}")
    print(f"🌐 Servidor: {SERVER_CONFIG['host']}:{SERVER_CONFIG['port']}")
    print(f"🐛 Debug mode: {'✅' if SERVER_CONFIG['debug'] else '❌'}")
    print(f"🔒 CORS origins: {', '.join(CORS_ORIGINS)}")
    print("="*50 + "\n")

def get_db_connection():
    """Obtener conexión a la base de datos usando configuración centralizada"""
    import mysql.connector
    from mysql.connector import Error
    
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"❌ Error connecting to MySQL: {e}")
        print(f"🔧 Configuración actual: {DB_CONFIG['user']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}")
        return None 