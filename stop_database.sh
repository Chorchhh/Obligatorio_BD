#!/bin/bash

echo "🐳 Deteniendo Base de Datos MySQL"
echo "================================="

# Verificar si Docker está disponible
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado"
    exit 1
fi

# Verificar si los contenedores están ejecutándose
if docker ps --format 'table {{.Names}}' | grep -q 'cafes-marloy'; then
    echo "🛑 Deteniendo contenedores..."
    docker-compose down
    echo "✅ Contenedores detenidos"
else
    echo "ℹ️  Los contenedores ya están detenidos"
fi

echo ""
echo "📊 Estado actual:"
docker-compose ps

echo ""
echo "🔄 Para volver a iniciar la base de datos: ./start_database.sh"
echo "🗑️  Para eliminar completamente los datos: ./reset_database.sh" 