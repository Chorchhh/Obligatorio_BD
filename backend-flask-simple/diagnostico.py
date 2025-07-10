#!/usr/bin/env python3
"""
Script de Diagnóstico - Sistema Cafés Marloy
Verifica usuarios y datos en la base de datos
"""

import mysql.connector


def conectar():
    try:
        return mysql.connector.connect(
            host="localhost",
            user="root",
            password="rootroot",
            database="cafes_marloy"
        )
    except Exception as e:
        print(f"❌ Error conectando a la base de datos: {e}")
        return None


def verificar_usuarios():
    print("🔍 VERIFICANDO USUARIOS DE LOGIN...")
    conn = conectar()
    if not conn:
        return

    try:
        cursor = conn.cursor()
        cursor.execute("SHOW TABLES LIKE 'login'")
        if not cursor.fetchone():
            print("❌ La tabla 'login' NO EXISTE")
            print("💡 Necesitas crear los usuarios primero")
            return

        cursor.execute("SELECT correo, es_administrador FROM login")
        usuarios = cursor.fetchall()

        if not usuarios:
            print("❌ NO HAY USUARIOS en la tabla login")
            print("💡 Necesitas ejecutar el script de usuarios")
        else:
            print("✅ Usuarios encontrados:")
            for correo, es_admin in usuarios:
                rol = "👑 ADMIN" if es_admin else "👤 Usuario"
                print(f"   - {correo} ({rol})")

    except Exception as e:
        print(f"❌ Error verificando usuarios: {e}")
    finally:
        cursor.close()
        conn.close()


def verificar_datos():
    print("\n📊 VERIFICANDO DATOS PARA REPORTES...")
    conn = conectar()
    if not conn:
        return

    try:
        cursor = conn.cursor()

        # Verificar clientes
        cursor.execute("SELECT COUNT(*) FROM clientes")
        total_clientes = cursor.fetchone()[0]
        print(f"👥 Clientes: {total_clientes}")

        # Verificar máquinas
        cursor.execute("SELECT COUNT(*) FROM maquinas")
        total_maquinas = cursor.fetchone()[0]
        print(f"🖥️  Máquinas: {total_maquinas}")

        # Verificar insumos
        cursor.execute("SELECT COUNT(*) FROM insumos")
        total_insumos = cursor.fetchone()[0]
        print(f"📦 Insumos: {total_insumos}")

        # Verificar técnicos
        cursor.execute("SELECT COUNT(*) FROM tecnicos")
        total_tecnicos = cursor.fetchone()[0]
        print(f"🔧 Técnicos: {total_tecnicos}")

        # Verificar registros de consumo
        cursor.execute("SELECT COUNT(*) FROM registro_consumo")
        total_consumo = cursor.fetchone()[0]
        print(f"📈 Registros de consumo: {total_consumo}")

        # Verificar mantenimientos
        cursor.execute("SELECT COUNT(*) FROM mantenimientos")
        total_mantenimientos = cursor.fetchone()[0]
        print(f"🛠️  Mantenimientos: {total_mantenimientos}")

        if total_consumo == 0:
            print("\n⚠️  NO HAY REGISTROS DE CONSUMO")
            print("💡 Los reportes necesitan datos de consumo para mostrar información")

    except Exception as e:
        print(f"❌ Error verificando datos: {e}")
    finally:
        cursor.close()
        conn.close()


def crear_usuarios():
    print("\n🔧 CREANDO USUARIOS DE DEMOSTRACIÓN...")
    conn = conectar()
    if not conn:
        return

    try:
        cursor = conn.cursor()

        # Crear tabla login si no existe
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS login (
                correo VARCHAR(100) PRIMARY KEY,
                contrasena VARCHAR(255) NOT NULL,
                es_administrador BOOLEAN DEFAULT FALSE
            )
        """)

        # Insertar usuarios
        cursor.execute("""
            INSERT INTO login (correo, contrasena, es_administrador) VALUES 
            ('admin@cafesmarloy.com', '123456', TRUE),
            ('usuario@cafesmarloy.com', '123456', FALSE)
            ON DUPLICATE KEY UPDATE 
                contrasena = VALUES(contrasena),
                es_administrador = VALUES(es_administrador)
        """)

        conn.commit()
        print("✅ Usuarios creados correctamente:")
        print("   👑 admin@cafesmarloy.com / 123456 (ADMINISTRADOR)")
        print("   👤 usuario@cafesmarloy.com / 123456 (Usuario regular)")

    except Exception as e:
        print(f"❌ Error creando usuarios: {e}")
    finally:
        cursor.close()
        conn.close()


def main():
    print("="*60)
    print("🚀 DIAGNÓSTICO SISTEMA CAFÉS MARLOY")
    print("="*60)

    verificar_usuarios()
    verificar_datos()

    print("\n" + "="*60)
    print("💡 SOLUCIONES:")
    print("="*60)
    print("1️⃣  Si NO hay usuarios, escribe: y")
    print("2️⃣  Si NO aparecen reportes, usa cuenta de ADMIN")
    print("3️⃣  Si reportes están vacíos, agrega más datos")
    print("="*60)

    respuesta = input("\n¿Crear usuarios de demostración? (y/n): ")
    if respuesta.lower() == 'y':
        crear_usuarios()
        print("\n🎉 ¡Usuarios creados! Ahora prueba:")
        print("   🌐 http://127.0.0.1:5000")
        print("   👑 admin@cafesmarloy.com / 123456")


if __name__ == "__main__":
    main()
