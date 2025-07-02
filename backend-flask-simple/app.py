from flask import Flask, render_template, request, jsonify, redirect, url_for, session, flash
import mysql.connector
from datetime import datetime
from functools import wraps
import re
import html
import os
from decimal import Decimal, InvalidOperation

app = Flask(__name__)
# Configuración de seguridad usando variables de entorno
app.secret_key = os.getenv("SECRET_KEY", "cafes_marloy_secret_key_2025_CAMBIAR_EN_PRODUCCION")

# ─────────────── SISTEMA DE VALIDACIONES ───────────────

class ValidationError(Exception):
    """Excepción personalizada para errores de validación"""
    pass

def validar_email(email):
    """Valida formato de email"""
    if not email or not isinstance(email, str):
        raise ValidationError("Email es requerido")
    
    email = email.strip().lower()
    
    # Patrón regex para email válido
    patron_email = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    if not re.match(patron_email, email):
        raise ValidationError("Formato de email inválido")
    
    if len(email) > 100:
        raise ValidationError("Email no puede exceder 100 caracteres")
    
    return email

def validar_texto_requerido(texto, nombre_campo, longitud_min=1, longitud_max=255):
    """Valida texto requerido con longitud específica"""
    if not texto or not isinstance(texto, str):
        raise ValidationError(f"{nombre_campo} es requerido")
    
    texto = texto.strip()
    
    if len(texto) < longitud_min:
        raise ValidationError(f"{nombre_campo} debe tener al menos {longitud_min} caracteres")
    
    if len(texto) > longitud_max:
        raise ValidationError(f"{nombre_campo} no puede exceder {longitud_max} caracteres")
    
    # Sanitizar caracteres especiales para prevenir XSS
    texto = html.escape(texto)
    
    return texto

def validar_texto_opcional(texto, nombre_campo, longitud_max=255):
    """Valida texto opcional"""
    if not texto:
        return ""
    
    if not isinstance(texto, str):
        raise ValidationError(f"{nombre_campo} debe ser texto")
    
    texto = texto.strip()
    
    if len(texto) > longitud_max:
        raise ValidationError(f"{nombre_campo} no puede exceder {longitud_max} caracteres")
    
    # Sanitizar caracteres especiales
    texto = html.escape(texto)
    
    return texto

def validar_cedula_uruguaya(ci):
    """Valida cédula de identidad uruguaya"""
    if not ci or not isinstance(ci, str):
        raise ValidationError("Cédula es requerida")
    
    ci = ci.strip().replace(".", "").replace("-", "")
    
    # Debe tener entre 7 y 8 dígitos
    if not ci.isdigit() or len(ci) < 7 or len(ci) > 8:
        raise ValidationError("Cédula debe tener entre 7 y 8 dígitos numéricos")
    
    # Algoritmo de validación de cédula uruguaya
    if len(ci) == 7:
        ci = "0" + ci
    
    coeficientes = [2, 9, 8, 7, 6, 3, 4]
    suma = sum(int(ci[i]) * coeficientes[i] for i in range(7))
    
    digito_verificador = (10 - (suma % 10)) % 10
    
    if int(ci[7]) != digito_verificador:
        raise ValidationError("Cédula inválida - dígito verificador incorrecto")
    
    return ci

def validar_telefono(telefono):
    """Valida número de teléfono uruguayo"""
    if not telefono:
        return ""
    
    if not isinstance(telefono, str):
        raise ValidationError("Teléfono debe ser texto")
    
    telefono = telefono.strip().replace(" ", "").replace("-", "")
    
    # Teléfono uruguayo: celular (09XXXXXXXX) o fijo (2XXXXXXX)
    patron_telefono = r'^(09\d{7}|2\d{7})$'
    
    if not re.match(patron_telefono, telefono):
        raise ValidationError("Teléfono debe ser celular (09XXXXXXXX) o fijo (2XXXXXXX)")
    
    return telefono

def validar_precio(precio):
    """Valida precio/costo decimal"""
    if precio is None:
        raise ValidationError("Precio es requerido")
    
    try:
        precio_decimal = Decimal(str(precio))
        
        if precio_decimal < 0:
            raise ValidationError("Precio no puede ser negativo")
        
        if precio_decimal > 999999.99:
            raise ValidationError("Precio no puede exceder $999,999.99")
        
        # Máximo 2 decimales
        if precio_decimal.as_tuple().exponent < -2:
            raise ValidationError("Precio no puede tener más de 2 decimales")
        
        return float(precio_decimal)
        
    except (InvalidOperation, ValueError):
        raise ValidationError("Precio debe ser un número válido")

def validar_cantidad(cantidad):
    """Valida cantidad usada"""
    if cantidad is None:
        raise ValidationError("Cantidad es requerida")
    
    try:
        cantidad_decimal = Decimal(str(cantidad))
        
        if cantidad_decimal <= 0:
            raise ValidationError("Cantidad debe ser mayor a 0")
        
        if cantidad_decimal > 999.99:
            raise ValidationError("Cantidad no puede exceder 999.99")
        
        return float(cantidad_decimal)
        
    except (InvalidOperation, ValueError):
        raise ValidationError("Cantidad debe ser un número válido")

def validar_fecha(fecha_str):
    """Valida formato de fecha"""
    if not fecha_str:
        raise ValidationError("Fecha es requerida")
    
    try:
        fecha = datetime.strptime(fecha_str, '%Y-%m-%d')
        
        # No puede ser fecha futura (para consumos/mantenimientos)
        if fecha.date() > datetime.now().date():
            raise ValidationError("La fecha no puede ser futura")
        
        return fecha_str
        
    except ValueError:
        raise ValidationError("Formato de fecha inválido (YYYY-MM-DD)")

def validar_fecha_hora(fecha_hora_str):
    """Valida formato de fecha y hora"""
    if not fecha_hora_str:
        raise ValidationError("Fecha y hora son requeridas")
    
    try:
        fecha_hora = datetime.strptime(fecha_hora_str, '%Y-%m-%d %H:%M:%S')
        
        # No puede ser fecha/hora futura
        if fecha_hora > datetime.now():
            raise ValidationError("La fecha y hora no pueden ser futuras")
        
        return fecha_hora_str
        
    except ValueError:
        raise ValidationError("Formato de fecha/hora inválido (YYYY-MM-DD HH:MM:SS)")

def validar_id_entero(id_valor, nombre_campo):
    """Valida ID como entero positivo"""
    if id_valor is None:
        raise ValidationError(f"{nombre_campo} es requerido")
    
    try:
        id_int = int(id_valor)
        
        if id_int <= 0:
            raise ValidationError(f"{nombre_campo} debe ser un número positivo")
        
        return id_int
        
    except (ValueError, TypeError):
        raise ValidationError(f"{nombre_campo} debe ser un número entero válido")

# ─────────────── CONEXIÓN MYSQL ───────────────

def conectar():
    """Conexión a MySQL usando variables de entorno (Docker-friendly)"""
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "3306")),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", "rootroot"),
        database=os.getenv("DB_NAME", "cafes_marloy"),
        charset='utf8mb4',
        collation='utf8mb4_unicode_ci',
        autocommit=False,
        # Configuraciones adicionales para Docker
        connection_timeout=30,
        auth_plugin='mysql_native_password'
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
        try:
            # Validaciones de entrada
            correo = validar_email(request.form.get('correo'))
            contrasena = validar_texto_requerido(request.form.get('contrasena'), 'Contraseña', 1)

            autenticado, es_admin = verificar_login(correo, contrasena)

            if autenticado:
                session['usuario_correo'] = correo
                session['es_admin'] = es_admin
                flash(
                    f'Bienvenido, {correo}. Rol: {"Administrador" if es_admin else "Usuario"}', 'success')
                return redirect(url_for('index'))
            else:
                flash('Credenciales incorrectas', 'error')
                
        except ValidationError as e:
            flash(f'Error de validación: {str(e)}', 'error')

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
        
        # Validaciones
        nombre = validar_texto_requerido(data.get('nombre'), 'Nombre', 2, 100)
        direccion = validar_texto_opcional(data.get('direccion'), 'Dirección', 150)
        telefono = validar_telefono(data.get('telefono', ''))
        correo = validar_email(data.get('correo')) if data.get('correo') else ""
        
        # Verificar email único si se proporciona
        if correo:
            conn = conectar()
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM clientes WHERE correo = %s", (correo,))
            if cursor.fetchone():
                cursor.close()
                conn.close()
                return jsonify({'error': 'Ya existe un cliente con ese email'}), 400
            cursor.close()
            conn.close()
        
        # Insertar cliente
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO clientes (nombre, direccion, telefono, correo) VALUES (%s, %s, %s, %s)",
                       (nombre, direccion, telefono, correo))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Cliente agregado correctamente'})
        
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Error interno: {str(e)}'}), 500

# ─────────────── API ENDPOINTS - PROVEEDORES ───────────────

@app.route('/api/proveedores', methods=['GET'])
@login_required
def api_listar_proveedores():
    try:
        conn = conectar()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, nombre, contacto FROM proveedores")
        proveedores = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(proveedores)
    except Exception as e:
        return jsonify({'error': f'Error interno: {str(e)}'}), 500

@app.route('/api/proveedores', methods=['POST'])
@login_required
@admin_required
def api_agregar_proveedor():
    try:
        data = request.json
        
        # Validaciones
        nombre = validar_texto_requerido(data.get('nombre'), 'Nombre', 2, 100)
        contacto = validar_texto_opcional(data.get('contacto'), 'Contacto', 100)
        
        # Verificar nombre único
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM proveedores WHERE nombre = %s", (nombre,))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'error': 'Ya existe un proveedor con ese nombre'}), 400
        
        # Insertar proveedor
        cursor.execute("INSERT INTO proveedores (nombre, contacto) VALUES (%s, %s)",
                       (nombre, contacto))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Proveedor agregado correctamente'})
        
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Error interno: {str(e)}'}), 500

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
        
        # Validaciones
        descripcion = validar_texto_requerido(data.get('descripcion'), 'Descripción', 3, 100)
        tipo = validar_texto_opcional(data.get('tipo'), 'Tipo', 50)
        precio_unitario = validar_precio(data.get('precio_unitario'))
        id_proveedor = validar_id_entero(data.get('id_proveedor'), 'ID Proveedor') if data.get('id_proveedor') else None
        
        # Verificar que el proveedor existe si se especifica
        if id_proveedor:
            conn = conectar()
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM proveedores WHERE id = %s", (id_proveedor,))
            if not cursor.fetchone():
                cursor.close()
                conn.close()
                return jsonify({'error': 'El proveedor especificado no existe'}), 400
            cursor.close()
            conn.close()
        
        # Insertar insumo
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO insumos (descripcion, tipo, precio_unitario, id_proveedor) VALUES (%s, %s, %s, %s)",
                       (descripcion, tipo, precio_unitario, id_proveedor))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Insumo agregado correctamente'})
        
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Error interno: {str(e)}'}), 500

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
        
        # Validaciones
        ci = validar_cedula_uruguaya(data.get('ci'))
        nombre = validar_texto_requerido(data.get('nombre'), 'Nombre', 2, 50)
        apellido = validar_texto_requerido(data.get('apellido'), 'Apellido', 2, 50)
        telefono = validar_telefono(data.get('telefono', ''))
        
        # Verificar cédula única
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute("SELECT ci FROM tecnicos WHERE ci = %s", (ci,))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'error': 'Ya existe un técnico con esa cédula'}), 400
        
        # Insertar técnico
        cursor.execute("INSERT INTO tecnicos (ci, nombre, apellido, telefono) VALUES (%s, %s, %s, %s)",
                       (ci, nombre, apellido, telefono))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Técnico agregado correctamente'})
        
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Error interno: {str(e)}'}), 500

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
        
        # Validaciones
        modelo = validar_texto_opcional(data.get('modelo'), 'Modelo', 50)
        id_cliente = validar_id_entero(data.get('id_cliente'), 'ID Cliente')
        ubicacion_cliente = validar_texto_opcional(data.get('ubicacion_cliente'), 'Ubicación', 100)
        costo_alquiler_mensual = validar_precio(data.get('costo_alquiler_mensual'))
        
        # Verificar que el cliente existe
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM clientes WHERE id = %s", (id_cliente,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'error': 'El cliente especificado no existe'}), 400
        
        # Insertar máquina
        cursor.execute("INSERT INTO maquinas (modelo, id_cliente, ubicacion_cliente, costo_alquiler_mensual) VALUES (%s, %s, %s, %s)",
                       (modelo, id_cliente, ubicacion_cliente, costo_alquiler_mensual))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Máquina agregada correctamente'})
        
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Error interno: {str(e)}'}), 500

# ─────────────── API ENDPOINTS - CONSUMO ───────────────

@app.route('/api/registro-consumo', methods=['GET'])
@login_required
def api_listar_consumos():
    try:
        conn = conectar()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT rc.id, rc.id_maquina, m.modelo as maquina_modelo, 
                   rc.id_insumo, i.descripcion as insumo_descripcion,
                   rc.fecha, rc.cantidad_usada
            FROM registro_consumo rc
            JOIN maquinas m ON rc.id_maquina = m.id
            JOIN insumos i ON rc.id_insumo = i.id
            ORDER BY rc.fecha DESC
        """)
        consumos = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(consumos)
    except Exception as e:
        return jsonify({'error': f'Error interno: {str(e)}'}), 500

@app.route('/api/consumo', methods=['POST'])
@login_required
def api_registrar_consumo():
    try:
        data = request.json
        
        # Validaciones
        id_maquina = validar_id_entero(data.get('id_maquina'), 'ID Máquina')
        id_insumo = validar_id_entero(data.get('id_insumo'), 'ID Insumo')
        fecha = validar_fecha(data.get('fecha'))
        cantidad_usada = validar_cantidad(data.get('cantidad_usada'))
        
        # Verificar que máquina e insumo existen
        conn = conectar()
        cursor = conn.cursor()
        
        cursor.execute("SELECT id FROM maquinas WHERE id = %s", (id_maquina,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'error': 'La máquina especificada no existe'}), 400
        
        cursor.execute("SELECT id FROM insumos WHERE id = %s", (id_insumo,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'error': 'El insumo especificado no existe'}), 400
        
        # Insertar consumo
        cursor.execute("INSERT INTO registro_consumo (id_maquina, id_insumo, fecha, cantidad_usada) VALUES (%s, %s, %s, %s)",
                       (id_maquina, id_insumo, fecha, cantidad_usada))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Consumo registrado correctamente'})
        
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Error interno: {str(e)}'}), 500

# ─────────────── API ENDPOINTS - MANTENIMIENTO ───────────────

@app.route('/api/mantenimientos', methods=['GET'])
@login_required
def api_listar_mantenimientos():
    try:
        conn = conectar()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT m.id, m.id_maquina, maq.modelo as maquina_modelo,
                   m.ci_tecnico, CONCAT(t.nombre, ' ', t.apellido) as tecnico_nombre,
                   m.tipo, m.fecha, m.observaciones
            FROM mantenimientos m
            JOIN maquinas maq ON m.id_maquina = maq.id
            JOIN tecnicos t ON m.ci_tecnico = t.ci
            ORDER BY m.fecha DESC
        """)
        mantenimientos = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(mantenimientos)
    except Exception as e:
        return jsonify({'error': f'Error interno: {str(e)}'}), 500

@app.route('/api/mantenimiento', methods=['POST'])
@login_required
def api_registrar_mantenimiento():
    try:
        data = request.json
        
        # Validaciones
        id_maquina = validar_id_entero(data.get('id_maquina'), 'ID Máquina')
        ci_tecnico = validar_cedula_uruguaya(data.get('ci_tecnico'))
        tipo = validar_texto_requerido(data.get('tipo'), 'Tipo de mantenimiento', 1, 50)
        fecha = validar_fecha_hora(data.get('fecha'))
        observaciones = validar_texto_opcional(data.get('observaciones'), 'Observaciones', 500)
        
        # Verificar que máquina y técnico existen
        conn = conectar()
        cursor = conn.cursor()
        
        cursor.execute("SELECT id FROM maquinas WHERE id = %s", (id_maquina,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'error': 'La máquina especificada no existe'}), 400
        
        cursor.execute("SELECT ci FROM tecnicos WHERE ci = %s", (ci_tecnico,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'error': 'El técnico especificado no existe'}), 400

        # Verificar si el técnico ya tiene mantenimiento ese día y hora exacta
        cursor.execute("""
            SELECT * FROM mantenimientos
            WHERE ci_tecnico = %s AND fecha = %s
        """, (ci_tecnico, fecha))

        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'error': 'El técnico ya tiene otro mantenimiento en ese momento'}), 400
        
        # Insertar mantenimiento
        cursor.execute("""
            INSERT INTO mantenimientos (id_maquina, ci_tecnico, tipo, fecha, observaciones)
            VALUES (%s, %s, %s, %s, %s)
        """, (id_maquina, ci_tecnico, tipo, fecha, observaciones))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Mantenimiento registrado correctamente'})
        
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Error interno: {str(e)}'}), 500

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
    # Configuración para Docker y entornos variables
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", "5001"))
    DEBUG = os.getenv("FLASK_DEBUG", "0") == "1"
    
    print("🚀 Iniciando servidor de Cafés Marloy...")
    print(f"📊 Dashboard disponible en: http://{HOST}:{PORT}/")
    print(f"🔑 Endpoints de autenticación: http://{HOST}:{PORT}/login")
    
    app.run(debug=DEBUG, host=HOST, port=PORT)
