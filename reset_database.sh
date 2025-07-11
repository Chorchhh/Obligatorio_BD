#!/bin/bash

echo "🗑️  Reseteando Base de Datos MySQL"
echo "=================================="
echo "⚠️  ADVERTENCIA: Esto eliminará TODOS los datos!"
echo ""

# Pedir confirmación
read -p "¿Estás seguro? (escribe 'SI' para continuar): " confirmation

if [ "$confirmation" != "SI" ]; then
    echo "❌ Operación cancelada"
    exit 1
fi

# Verificar si Docker está disponible
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado"
    exit 1
fi

echo ""
echo "🛑 Deteniendo y eliminando contenedores..."
docker-compose down

echo "🗑️  Eliminando volúmenes de datos..."
docker-compose down -v

echo "🧹 Limpiando imágenes no utilizadas..."
docker system prune -f

echo "📦 Eliminando volumen persistente..."
docker volume rm obligatorio_bd_mysql_data 2>/dev/null || true

echo ""
echo "✅ Base de datos completamente reseteada"
echo ""
echo "🚀 Para crear una nueva base de datos limpia:"
echo "   ./start_database.sh"
echo ""
echo "📊 Verificar que no hay contenedores:"
docker-compose ps 