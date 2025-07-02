#!/bin/bash

# ═══════════════════════════════════════════════════════
# SCRIPT DE INICIO - SISTEMA CAFÉS MARLOY CON DOCKER
# ═══════════════════════════════════════════════════════

set -e  # Salir si cualquier comando falla

echo "🚀 Iniciando Sistema Cafés Marloy con Docker Compose"
echo "========================================================"

# Verificar que Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

# Verificar que Docker Compose está disponible
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose no está disponible. Por favor instala Docker Compose."
    exit 1
fi

# Determinar comando de Docker Compose
DOCKER_COMPOSE_CMD="docker-compose"
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
fi

# Detener contenedores existentes si están corriendo
echo "🔄 Deteniendo contenedores existentes..."
$DOCKER_COMPOSE_CMD down --remove-orphans 2>/dev/null || true

# Construir e iniciar servicios
echo "🔨 Construyendo imágenes..."
$DOCKER_COMPOSE_CMD build --no-cache

echo "🚀 Iniciando servicios..."
$DOCKER_COMPOSE_CMD up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Verificar estado de los servicios
echo "📊 Verificando estado de los servicios..."
$DOCKER_COMPOSE_CMD ps

# Verificar logs iniciales
echo "📝 Logs iniciales de la aplicación:"
$DOCKER_COMPOSE_CMD logs flask_app | tail -10

echo ""
echo "✅ Sistema iniciado correctamente!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Aplicación web:     http://localhost:5001"
echo "🗄️  Base de datos:     localhost:3306"
echo "🔧 phpMyAdmin:        http://localhost:8080"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Credenciales de acceso:"
echo "   • Usuario admin: admin@cafesmarloy.com"
echo "   • Contraseña: admin123"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📚 Comandos útiles:"
echo "   • Ver logs:    $DOCKER_COMPOSE_CMD logs -f"
echo "   • Detener:     $DOCKER_COMPOSE_CMD down"
echo "   • Reiniciar:   $DOCKER_COMPOSE_CMD restart"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" 