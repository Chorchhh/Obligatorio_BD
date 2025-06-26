#!/bin/bash

echo "🚀 Iniciando Sistema Cafés Marloy - Backend"
echo "=============================================="

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 no está instalado"
    exit 1
fi

# Cambiar al directorio backend
cd backend

# Verificar si existe el entorno virtual
if [ ! -d "venv" ]; then
    echo "📦 Creando entorno virtual..."
    python3 -m venv venv
fi

# Activar entorno virtual
echo "🔧 Activando entorno virtual..."
source venv/bin/activate

# Instalar dependencias
echo "📥 Instalando dependencias..."
pip install -r requirements.txt

# Mostrar información de inicio
echo ""
echo "✅ Backend configurado correctamente"
echo "📍 Servidor disponible en: http://localhost:5000"
echo "📊 Health check: http://localhost:5000/api/health"
echo "📚 API endpoints: http://localhost:5000/api/"
echo ""
echo "🔑 Usuarios de prueba:"
echo "   Admin: admin@cafesmarloy.com"
echo "   Cliente: admin@techsoft.com"
echo ""

# Iniciar servidor
echo "🎯 Iniciando servidor Flask..."
python app.py 