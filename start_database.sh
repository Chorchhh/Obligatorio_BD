#!/bin/bash

echo "🐳 Iniciando Base de Datos MySQL con Docker"
echo "=============================================="

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado"
    echo "📥 Instala Docker Desktop desde: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Verificar si Docker está ejecutándose
if ! docker info &> /dev/null; then
    echo "❌ Docker no está ejecutándose"
    echo "🚀 Inicia Docker Desktop y vuelve a intentar"
    exit 1
fi

echo "✅ Docker detectado y funcionando"

# Verificar si el contenedor ya existe
if docker ps -a --format 'table {{.Names}}' | grep -q 'cafes-marloy-db'; then
    echo "📦 Contenedor existente detectado"
    
    # Verificar si está ejecutándose
    if docker ps --format 'table {{.Names}}' | grep -q 'cafes-marloy-db'; then
        echo "✅ Base de datos ya está ejecutándose"
        echo "🌐 Adminer disponible en: http://localhost:8080"
        echo "🔑 Credenciales: servidor=mysql, usuario=root, contraseña=rootroot"
        exit 0
    else
        echo "🔄 Iniciando contenedor existente..."
        docker-compose up -d
    fi
else
    echo "📦 Creando nueva base de datos..."
    docker-compose up -d
fi

echo ""
echo "⏳ Esperando que MySQL esté listo..."

# Esperar hasta que MySQL esté disponible
for i in {1..30}; do
    if docker exec cafes-marloy-db mysqladmin ping -h localhost -u root -prootroot --silent; then
        echo "✅ MySQL está listo!"
        break
    fi
    
    if [ $i -eq 30 ]; then
        echo "❌ Timeout: MySQL tardó demasiado en iniciar"
        echo "🔍 Verifica los logs: docker-compose logs mysql"
        exit 1
    fi
    
    printf "."
    sleep 2
done

echo ""
echo "🎉 Base de datos iniciada correctamente!"
echo ""
echo "📊 Estado de contenedores:"
docker-compose ps
echo ""
echo "🌐 Adminer (administrador web): http://localhost:8080"
echo "🔑 Credenciales:"
echo "   - Servidor: mysql"
echo "   - Usuario: root" 
echo "   - Contraseña: rootroot"
echo "   - Base de datos: Obligatorio"
echo ""
echo "🚀 Ya puedes iniciar el backend con: ./start_backend.sh" 