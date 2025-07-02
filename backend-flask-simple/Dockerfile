# ═══════════════════════════════════════════════════════
# DOCKERFILE PARA SISTEMA CAFÉS MARLOY
# ═══════════════════════════════════════════════════════
# Imagen base oficial de Python optimizada para producción
FROM python:3.11-slim

# Información del mantenedor
LABEL maintainer="Sistema Cafés Marloy"
LABEL description="Backend Flask para gestión de máquinas expendedoras"
LABEL version="1.0"

# Establecer variables de entorno
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_APP=app.py \
    FLASK_ENV=production \
    PYTHONPATH=/app

# Crear usuario no-root para seguridad
RUN groupadd -r flaskuser && useradd -r -g flaskuser flaskuser

# Instalar dependencias del sistema necesarias
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Crear directorio de trabajo
WORKDIR /app

# Copiar requirements primero para aprovechar cache de Docker
COPY requirements.txt .

# Instalar dependencias de Python
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copiar código de la aplicación
COPY . .

# Crear directorio para logs
RUN mkdir -p /app/logs

# Cambiar propiedad de archivos al usuario no-root
RUN chown -R flaskuser:flaskuser /app

# Cambiar a usuario no-root
USER flaskuser

# Exponer puerto
EXPOSE 5001

# Comando de salud para Docker
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5001/ || exit 1

# Comando para ejecutar la aplicación
CMD ["python", "app.py"] 