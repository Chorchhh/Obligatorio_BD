#!/bin/bash

echo "🎨 Iniciando Sistema Cafés Marloy - Frontend"
echo "=============================================="

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi

# Cambiar al directorio frontend
cd frontend

# Verificar si existen las dependencias
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias de Node.js..."
    npm install
fi

# Mostrar información de inicio
echo ""
echo "✅ Frontend configurado correctamente"
echo "🌐 Aplicación disponible en: http://localhost:3000"
echo "🔗 Conecta con API en: http://localhost:5000/api"
echo ""
echo "🔑 Usuarios de prueba:"
echo "   Admin: admin@cafesmarloy.com"
echo "   Cliente: admin@techsoft.com"
echo "   Contraseña: cualquier texto"
echo ""

# Iniciar servidor de desarrollo
echo "🚀 Iniciando servidor de desarrollo React..."
npm start 