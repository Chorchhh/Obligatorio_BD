import mysql.connector

# ─────────────── CONEXIÓN MYSQL ───────────────
def conectar():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="rootroot",
        database="cafes_marloy"
    )

# ─────────────── USUARIOS ───────────────
usuario_actual = None
es_admin = False


def login_usuario():
    global usuario_actual, es_admin
    correo = input("📧 Correo: ")
    contrasena = input("🔐 Contraseña: ")

    conn = conectar()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT es_administrador FROM login WHERE correo = %s AND contrasena = %s", (correo, contrasena))
    resultado = cursor.fetchone()
    cursor.close()
    conn.close()

    if resultado:
        usuario_actual = correo
        es_admin = resultado[0]
        print(
            f"\n✅ Bienvenido, {correo}. Rol: {'Administrador' if es_admin else 'Usuario'}")
        return True
    else:
        print("❌ Credenciales incorrectas.")
        return False

# ─────────────── CLIENTES ───────────────

def listar_clientes():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nombre, direccion, telefono FROM clientes")
    for (id, nombre, direccion, telefono) in cursor.fetchall():
        print(f"{id}: {nombre} - {direccion} - {telefono}")
    cursor.close()
    conn.close()


def agregar_cliente():
    nombre = input("Nombre del cliente: ")
    direccion = input("Dirección: ")
    telefono = input("Teléfono: ")
    correo = input("Correo: ")

    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO clientes (nombre, direccion, telefono, correo) VALUES (%s, %s, %s, %s)",
                   (nombre, direccion, telefono, correo))
    conn.commit()
    print("✅ Cliente agregado.")
    cursor.close()
    conn.close()

# ─────────────── INSUMOS ───────────────

def listar_insumos():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, descripcion, tipo, precio_unitario FROM insumos")
    for row in cursor.fetchall():
        print(row)
    cursor.close()
    conn.close()


def agregar_insumo():
    descripcion = input("Descripción: ")
    tipo = input("Tipo: ")
    precio = float(input("Precio unitario: "))
    id_proveedor = int(input("ID del proveedor: "))

    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO insumos (descripcion, tipo, precio_unitario, id_proveedor) VALUES (%s, %s, %s, %s)",
                   (descripcion, tipo, precio, id_proveedor))
    conn.commit()
    print("✅ Insumo agregado.")
    cursor.close()
    conn.close()

# ─────────────── TÉCNICOS ───────────────

def listar_tecnicos():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT ci, nombre, apellido, telefono FROM tecnicos")
    for row in cursor.fetchall():
        print(row)
    cursor.close()
    conn.close()


def agregar_tecnico():
    ci = input("CI: ")
    nombre = input("Nombre: ")
    apellido = input("Apellido: ")
    telefono = input("Teléfono: ")

    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO tecnicos (ci, nombre, apellido, telefono) VALUES (%s, %s, %s, %s)",
                   (ci, nombre, apellido, telefono))
    conn.commit()
    print("✅ Técnico agregado.")
    cursor.close()
    conn.close()

# ─────────────── MÁQUINAS ───────────────

def listar_maquinas():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, modelo, id_cliente, ubicacion_cliente, costo_alquiler_mensual FROM maquinas")
    for row in cursor.fetchall():
        print(row)
    cursor.close()
    conn.close()


def agregar_maquina():
    modelo = input("Modelo: ")
    id_cliente = int(input("ID cliente: "))
    ubicacion = input("Ubicación dentro del cliente: ")
    costo = float(input("Costo mensual de alquiler: "))

    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO maquinas (modelo, id_cliente, ubicacion_cliente, costo_alquiler_mensual) VALUES (%s, %s, %s, %s)",
                   (modelo, id_cliente, ubicacion, costo))
    conn.commit()
    print("✅ Máquina agregada.")
    cursor.close()
    conn.close()

# ─────────────── REGISTRO DE CONSUMO ───────────────

def registrar_consumo():
    id_maquina = int(input("ID de máquina: "))
    id_insumo = int(input("ID de insumo: "))
    fecha = input("Fecha (YYYY-MM-DD): ")
    cantidad = float(input("Cantidad usada: "))

    conn = conectar()
    cursor = conn.cursor()
    sql = "INSERT INTO registro_consumo (id_maquina, id_insumo, fecha, cantidad_usada) VALUES (%s, %s, %s, %s)"
    cursor.execute(sql, (id_maquina, id_insumo, fecha, cantidad))
    conn.commit()
    print("✅ Consumo registrado.")
    cursor.close()
    conn.close()

# ─────────────── REGISTRO DE MANTENIMIENTO ───────────────

def registrar_mantenimiento():
    id_maquina = int(input("ID de máquina: "))
    ci_tecnico = input("CI del técnico: ")
    tipo = input("Tipo de mantenimiento (Preventivo/Correctivo): ")
    fecha = input("Fecha y hora (YYYY-MM-DD HH:MM:SS): ")
    observaciones = input("Observaciones: ")

    conn = conectar()
    cursor = conn.cursor()

    # Verificar si el técnico ya tiene mantenimiento ese día y hora exacta
    cursor.execute("""
        SELECT * FROM mantenimientos
        WHERE ci_tecnico = %s AND fecha = %s
    """, (ci_tecnico, fecha))

    if cursor.fetchone():
        print("❌ ERROR: El técnico ya tiene otro mantenimiento en ese momento.")
    else:
        cursor.execute("""
            INSERT INTO mantenimientos (id_maquina, ci_tecnico, tipo, fecha, observaciones)
            VALUES (%s, %s, %s, %s, %s)
        """, (id_maquina, ci_tecnico, tipo, fecha, observaciones))
        conn.commit()
        print("✅ Mantenimiento registrado.")

    cursor.close()
    conn.close()

# ─────────────── REPORTERÍA ───────────────

    # ─────────────── TOTAL MENSUAL x CLIENTE (ALQUILER + EL CONSUMO)───────────────

def reporte_total_mensual():
    mes = input("Ingresá el mes en formato YYYY-MM (por ejemplo 2025-06): ")

    conn = conectar()
    cursor = conn.cursor()

    # Alquiler mensual por cliente (sin importar mes)
    cursor.execute("""
        SELECT c.id, c.nombre, SUM(m.costo_alquiler_mensual) AS total_alquiler
        FROM clientes c
        JOIN maquinas m ON m.id_cliente = c.id
        GROUP BY c.id
    """)
    alquileres = {cid: {"nombre": nombre, "alquiler": total}
                  for cid, nombre, total in cursor.fetchall()}

    # Consumo mensual por cliente
    cursor.execute("""
        SELECT cl.id, cl.nombre, SUM(rc.cantidad_usada * i.precio_unitario) AS total_consumo
        FROM registro_consumo rc
        JOIN maquinas m ON rc.id_maquina = m.id
        JOIN clientes cl ON m.id_cliente = cl.id
        JOIN insumos i ON rc.id_insumo = i.id
        WHERE DATE_FORMAT(rc.fecha, '%Y-%m') = %s
        GROUP BY cl.id
    """, (mes,))
    consumos = {cid: total for cid, _, total in cursor.fetchall()}

    print(f"\n📅 Reporte mensual de cobro para {mes}:")
    for cid in alquileres:
        nombre = alquileres[cid]["nombre"]
        total_alquiler = alquileres[cid]["alquiler"]
        total_consumo = consumos.get(cid, 0)
        total = total_alquiler + total_consumo
        print(
            f"- {nombre}: Alquiler ${total_alquiler:.2f} + Insumos ${total_consumo:.2f} → Total ${total:.2f}")

    cursor.close()
    conn.close()

    # ─────────────── TOP 5 DE INSUMOS MÁS USADOS ───────────────

def reporte_insumos_mas_usados():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT i.descripcion, SUM(rc.cantidad_usada) AS total_usado,
               SUM(rc.cantidad_usada * i.precio_unitario) AS costo_total
        FROM registro_consumo rc
        JOIN insumos i ON rc.id_insumo = i.id
        GROUP BY rc.id_insumo
        ORDER BY total_usado DESC
        LIMIT 5
    """)
    print("\n🥤 Top 5 insumos más usados:")
    for desc, usado, costo in cursor.fetchall():
        print(f"- {desc}: {usado:.2f} unidades, costo total: ${costo:.2f}")
    cursor.close()
    conn.close()

    # ─────────────── TÉCNICOS CON MÁS MANTENIMIENTO ───────────────

def reporte_tecnicos_mas_mantenimientos():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT t.nombre, t.apellido, COUNT(*) AS total
        FROM mantenimientos m
        JOIN tecnicos t ON m.ci_tecnico = t.ci
        GROUP BY t.ci
        ORDER BY total DESC
        LIMIT 5
    """)
    print("\n🔧 Técnicos con más mantenimientos realizados:")
    for nombre, apellido, total in cursor.fetchall():
        print(f"- {nombre} {apellido}: {total} mantenimientos")
    cursor.close()
    conn.close()

    # ─────────────── CLIENTES CON MÁS MÁQUINAS INSTALADAS ───────────────

def reporte_clientes_con_mas_maquinas():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT c.nombre, COUNT(*) AS cantidad
        FROM maquinas m
        JOIN clientes c ON m.id_cliente = c.id
        GROUP BY c.id
        ORDER BY cantidad DESC
        LIMIT 5
    """)
    print("\n🏢 Clientes con más máquinas instaladas:")
    for nombre, cantidad in cursor.fetchall():
        print(f"- {nombre}: {cantidad} máquinas")
    cursor.close()
    conn.close()

# ───────────────---------------───────────────
# ─────────────── MENÚ PRINCIPAL ───────────────
def menu():
    while True:
        print("\n📋 Menú Principal:")
        print("1. Listar clientes")
        print("2. Agregar cliente")
        print("3. Listar insumos")
        print("4. Agregar insumo")
        print("5. Listar técnicos")
        if es_admin:
            print("6. Agregar técnico")
        print("7. Listar máquinas")
        if es_admin:
            print("8. Agregar máquina")
        print("9. Registrar consumo")
        print("10. Registrar mantenimiento")
        if es_admin:
            print("11. Reportes 📊")
        print("0. Salir")

        op = input("Elegí una opción: ")

        if op == "1":
            listar_clientes()
        elif op == "2":
            agregar_cliente()
        elif op == "3":
            listar_insumos()
        elif op == "4":
            agregar_insumo()
        elif op == "5":
            listar_tecnicos()
        elif op == "6" and es_admin:
            agregar_tecnico()
        elif op == "7":
            listar_maquinas()
        elif op == "8" and es_admin:
            agregar_maquina()
        elif op == "9":
            registrar_consumo()
        elif op == "10":
            registrar_mantenimiento()
        elif op == "11" and es_admin:
            sub_menu_reportes()
        elif op == "0":
            print("👋 ¡Hasta luego!")
            break
        else:
            print("❌ Opción inválida o no permitida.")

def sub_menu_reportes():
    print("\n📊 SUBMENÚ DE REPORTES:")
    print("1. Total mensual por cliente")
    print("2. Insumos más usados")
    print("3. Técnicos con más mantenimientos")
    print("4. Clientes con más máquinas")
    print("0. Volver al menú principal")

    opcion = input("Opción: ")
    if opcion == "1":
        reporte_total_mensual()
    elif opcion == "2":
        reporte_insumos_mas_usados()
    elif opcion == "3":
        reporte_tecnicos_mas_mantenimientos()
    elif opcion == "4":
        reporte_clientes_con_mas_maquinas()
    elif opcion == "0":
        return
    else:
        print("❌ Opción inválida.")

    input("\nPresioná Enter para volver al menú principal...")

# ─────────────── EJECUTAR MENÚ SEGUN USUARIO───────────────
if __name__ == "__main__":
    if login_usuario():
        menu()
