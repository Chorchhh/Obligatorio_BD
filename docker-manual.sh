#!/bin/bash

# Script de inicio manual para Docker
echo "🚀 Iniciando Sistema Cafés Marloy - Modo Manual"
echo "==============================================="

# Verificar Docker
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker no está corriendo. Inicia Docker Desktop."
    exit 1
fi

# Comando de Docker Compose
DOCKER_COMPOSE_CMD="docker-compose"
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
fi

echo "📋 Usando: $DOCKER_COMPOSE_CMD"

# Detener contenedores existentes
echo "🔄 Deteniendo contenedores existentes..."
$DOCKER_COMPOSE_CMD down --remove-orphans 2>/dev/null || true

# Construir aplicación
echo "🔨 Construyendo imagen de Flask..."
$DOCKER_COMPOSE_CMD build --no-cache flask_app

# Iniciar MySQL
echo "🗄️ Iniciando MySQL..."
$DOCKER_COMPOSE_CMD up -d mysql_db

# Esperar MySQL
echo "⏳ Esperando MySQL..."
sleep 15

# Iniciar Flask
echo "🌐 Iniciando Flask..."
$DOCKER_COMPOSE_CMD up -d flask_app

# Iniciar phpMyAdmin
echo "🔧 Iniciando phpMyAdmin..."
$DOCKER_COMPOSE_CMD up -d phpmyadmin

# Estado final
echo "📊 Estado del sistema:"
$DOCKER_COMPOSE_CMD ps

echo ""
echo "✅ Sistema iniciado!"
echo "🌐 App: http://localhost:5001"
echo "🔧 phpMyAdmin: http://localhost:8080"
echo "📧 Login: admin@cafesmarloy.com / admin123" 