#!/bin/bash

# ═══════════════════════════════════════════════════════
# SCRIPT DE PARADA - SISTEMA CAFÉS MARLOY CON DOCKER
# ═══════════════════════════════════════════════════════

set -e  # Salir si cualquier comando falla

echo "🛑 Deteniendo Sistema Cafés Marloy"
echo "=================================="

# Determinar comando de Docker Compose
DOCKER_COMPOSE_CMD="docker-compose"
if docker compose version &> /dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker compose"
fi

# Detener servicios gradualmente
echo "⏸️  Deteniendo servicios..."
$DOCKER_COMPOSE_CMD stop

echo "🧹 Eliminando contenedores..."
$DOCKER_COMPOSE_CMD down --remove-orphans

# Preguntar si eliminar volúmenes
echo ""
read -p "¿Deseas eliminar también los datos de la base de datos? (y/N): " -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Eliminando volúmenes de datos..."
    $DOCKER_COMPOSE_CMD down -v
    echo "⚠️  Todos los datos han sido eliminados."
else
    echo "💾 Los datos de la base de datos se mantienen para el próximo inicio."
fi

echo ""
echo "✅ Sistema detenido correctamente"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📚 Para volver a iniciar:"
echo "   ./docker-start.sh"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" 