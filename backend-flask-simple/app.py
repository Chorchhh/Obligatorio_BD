from flask import Flask, render_template, request, jsonify, redirect, url_for, session, flash
import mysql.connector
from datetime import datetime
from functools import wraps

app = Flask(__name__)
# Cambiar por una clave secreta segura
app.secret_key = 'cafes_marloy_secret_key_2025'

# ─────────────── CONEXIÓN MYSQL ───────────────


def conectar():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="valerodma",
        database="cafes_marloy_vale"
    )

# ─────────────── AUTENTICACIÓN Y PERMISOS ───────────────


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'usuario_correo' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function


def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'usuario_correo' not in session:
            return redirect(url_for('login'))
        if not session.get('es_admin', False):
            flash(
                'Acceso denegado. Solo administradores pueden acceder a esta función.', 'error')
            return redirect(url_for('index'))
        return f(*args, **kwargs)
    return decorated_function


def verificar_login(correo, contrasena):
    try:
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT es_administrador FROM login WHERE correo = %s AND contrasena = %s",
            (correo, contrasena)
        )
        resultado = cursor.fetchone()
        cursor.close()
        conn.close()

        if resultado:
            return True, resultado[0]  # (autenticado, es_admin)
        return False, False
    except Exception as e:
        print(f"Error en login: {e}")
        return False, False

# ─────────────── RUTAS DE AUTENTICACIÓN ───────────────


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        correo = request.form['correo']
        contrasena = request.form['contrasena']

        autenticado, es_admin = verificar_login(correo, contrasena)

        if autenticado:
            session['usuario_correo'] = correo
            session['es_admin'] = es_admin
            flash(
                f'Bienvenido, {correo}. Rol: {"Administrador" if es_admin else "Usuario"}', 'success')
            return redirect(url_for('index'))
        else:
            flash('Credenciales incorrectas', 'error')

    return render_template('login.html')


@app.route('/logout')
def logout():
    session.clear()
    flash('Sesión cerrada correctamente', 'info')
    return redirect(url_for('login'))

# ─────────────── RUTAS PRINCIPALES ───────────────


@app.route('/')
@login_required
def index():
    return render_template('index.html')


@app.route('/clientes')
@login_required
def clientes():
    return render_template('clientes.html')


@app.route('/insumos')
@login_required
def insumos():
    return render_template('insumos.html')


@app.route('/tecnicos')
@login_required
def tecnicos():
    return render_template('tecnicos.html')


@app.route('/maquinas')
@login_required
def maquinas():
    return render_template('maquinas.html')


@app.route('/consumo')
@login_required
def consumo():
    return render_template('consumo.html')


@app.route('/mantenimiento')
@login_required
def mantenimiento():
    return render_template('mantenimiento.html')


@app.route('/reportes')
@login_required
@admin_required
def reportes():
    return render_template('reportes.html')

# ─────────────── API ENDPOINTS - CLIENTES ───────────────


@app.route('/api/clientes', methods=['GET'])
@login_required
def api_listar_clientes():
    try:
        conn = conectar()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT id, nombre, direccion, telefono, correo FROM clientes")
        clientes = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(clientes)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/clientes', methods=['POST'])
@login_required
def api_agregar_cliente():
    try:
        data = request.json
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO clientes (nombre, direccion, telefono, correo) VALUES (%s, %s, %s, %s)",
                       (data['nombre'], data['direccion'], data['telefono'], data['correo']))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Cliente agregado correctamente'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ─────────────── API ENDPOINTS - INSUMOS ───────────────


@app.route('/api/insumos', methods=['GET'])
@login_required
def api_listar_insumos():
    try:
        conn = conectar()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT id, descripcion, tipo, precio_unitario, id_proveedor FROM insumos")
        insumos = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(insumos)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/insumos', methods=['POST'])
@login_required
def api_agregar_insumo():
    try:
        data = request.json
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO insumos (descripcion, tipo, precio_unitario, id_proveedor) VALUES (%s, %s, %s, %s)",
                       (data['descripcion'], data['tipo'], data['precio_unitario'], data['id_proveedor']))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Insumo agregado correctamente'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ─────────────── API ENDPOINTS - TÉCNICOS ───────────────


@app.route('/api/tecnicos', methods=['GET'])
@login_required
def api_listar_tecnicos():
    try:
        conn = conectar()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT ci, nombre, apellido, telefono FROM tecnicos")
        tecnicos = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(tecnicos)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/tecnicos', methods=['POST'])
@login_required
@admin_required
def api_agregar_tecnico():
    try:
        data = request.json
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO tecnicos (ci, nombre, apellido, telefono) VALUES (%s, %s, %s, %s)",
                       (data['ci'], data['nombre'], data['apellido'], data['telefono']))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Técnico agregado correctamente'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ─────────────── API ENDPOINTS - MÁQUINAS ───────────────


@app.route('/api/maquinas', methods=['GET'])
@login_required
def api_listar_maquinas():
    try:
        conn = conectar()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT m.id, m.modelo, m.id_cliente, c.nombre as cliente_nombre, 
                   m.ubicacion_cliente, m.costo_alquiler_mensual
            FROM maquinas m
            JOIN clientes c ON m.id_cliente = c.id
        """)
        maquinas = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(maquinas)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/maquinas', methods=['POST'])
@login_required
@admin_required
def api_agregar_maquina():
    try:
        data = request.json
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO maquinas (modelo, id_cliente, ubicacion_cliente, costo_alquiler_mensual) VALUES (%s, %s, %s, %s)",
                       (data['modelo'], data['id_cliente'], data['ubicacion_cliente'], data['costo_alquiler_mensual']))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Máquina agregada correctamente'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ─────────────── API ENDPOINTS - CONSUMO ───────────────


@app.route('/api/consumo', methods=['POST'])
@login_required
def api_registrar_consumo():
    try:
        data = request.json
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO registro_consumo (id_maquina, id_insumo, fecha, cantidad_usada) VALUES (%s, %s, %s, %s)",
                       (data['id_maquina'], data['id_insumo'], data['fecha'], data['cantidad_usada']))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Consumo registrado correctamente'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ─────────────── API ENDPOINTS - MANTENIMIENTO ───────────────


@app.route('/api/mantenimiento', methods=['POST'])
@login_required
def api_registrar_mantenimiento():
    try:
        data = request.json
        conn = conectar()
        cursor = conn.cursor()

        # Verificar si el técnico ya tiene mantenimiento ese día y hora exacta
        cursor.execute("""
            SELECT * FROM mantenimientos
            WHERE ci_tecnico = %s AND fecha = %s
        """, (data['ci_tecnico'], data['fecha']))

        if cursor.fetchone():
            return jsonify({'error': 'El técnico ya tiene otro mantenimiento en ese momento'}), 400
        else:
            cursor.execute("""
                INSERT INTO mantenimientos (id_maquina, ci_tecnico, tipo, fecha, observaciones)
                VALUES (%s, %s, %s, %s, %s)
            """, (data['id_maquina'], data['ci_tecnico'], data['tipo'], data['fecha'], data['observaciones']))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({'success': True, 'message': 'Mantenimiento registrado correctamente'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ─────────────── API ENDPOINTS - REPORTES ───────────────


@app.route('/api/reportes/total-mensual/<mes>')
@login_required
@admin_required
def api_reporte_total_mensual(mes):
    try:
        conn = conectar()
        cursor = conn.cursor(dictionary=True)

        # Alquiler mensual por cliente
        cursor.execute("""
            SELECT c.id, c.nombre, SUM(m.costo_alquiler_mensual) AS total_alquiler
            FROM clientes c
            JOIN maquinas m ON m.id_cliente = c.id
            GROUP BY c.id
        """)
        alquileres = {row['id']: {"nombre": row['nombre'], "alquiler": float(row['total_alquiler'])}
                      for row in cursor.fetchall()}

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
        consumos = {row['id']: float(row['total_consumo'])
                    for row in cursor.fetchall()}

        resultado = []
        for cid in alquileres:
            nombre = alquileres[cid]["nombre"]
            total_alquiler = alquileres[cid]["alquiler"]
            total_consumo = consumos.get(cid, 0)
            total = total_alquiler + total_consumo
            resultado.append({
                'cliente': nombre,
                'alquiler': total_alquiler,
                'consumo': total_consumo,
                'total': total
            })

        cursor.close()
        conn.close()
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/reportes/insumos-mas-usados')
@login_required
@admin_required
def api_reporte_insumos_mas_usados():
    try:
        conn = conectar()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT i.descripcion, SUM(rc.cantidad_usada) AS total_usado,
                   SUM(rc.cantidad_usada * i.precio_unitario) AS costo_total
            FROM registro_consumo rc
            JOIN insumos i ON rc.id_insumo = i.id
            GROUP BY rc.id_insumo
            ORDER BY total_usado DESC
            LIMIT 5
        """)
        resultado = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/reportes/tecnicos-mas-mantenimientos')
@login_required
@admin_required
def api_reporte_tecnicos_mas_mantenimientos():
    try:
        conn = conectar()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT t.nombre, t.apellido, COUNT(*) AS total
            FROM mantenimientos m
            JOIN tecnicos t ON m.ci_tecnico = t.ci
            GROUP BY t.ci
            ORDER BY total DESC
            LIMIT 5
        """)
        resultado = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/reportes/clientes-mas-maquinas')
@login_required
@admin_required
def api_reporte_clientes_mas_maquinas():
    try:
        conn = conectar()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT c.nombre, COUNT(*) AS cantidad
            FROM maquinas m
            JOIN clientes c ON m.id_cliente = c.id
            GROUP BY c.id
            ORDER BY cantidad DESC
            LIMIT 5
        """)
        resultado = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
