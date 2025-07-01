// Funciones JavaScript comunes para el sistema Cafés Marloy

// Mostrar alertas
function mostrarAlerta(mensaje, tipo = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    const alertId = 'alert_' + Date.now();

    const alertHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert" id="${alertId}">
            <i class="bi bi-${tipo === 'success' ? 'check-circle' : tipo === 'danger' ? 'exclamation-triangle' : 'info-circle'}"></i>
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    alertContainer.insertAdjacentHTML('beforeend', alertHTML);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        const alert = document.getElementById(alertId);
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000);
}

// Confirmar acción
function confirmarAccion(mensaje, callback) {
    if (confirm(mensaje)) {
        callback();
    }
}

// Formatear fecha para input datetime-local
function formatearFechaParaInput(fecha) {
    if (!fecha) {
        const now = new Date();
        return now.toISOString().slice(0, 16);
    }
    return new Date(fecha).toISOString().slice(0, 16);
}

// Formatear fecha para mostrar
function formatearFecha(fecha) {
    if (!fecha) return '';
    return new Date(fecha).toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Formatear moneda
function formatearMoneda(cantidad) {
    return new Intl.NumberFormat('es-UY', {
        style: 'currency',
        currency: 'UYU'
    }).format(cantidad);
}

// Validar formulario
function validarFormulario(formElement) {
    const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
    let esValido = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            esValido = false;
        } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        }
    });

    return esValido;
}

// Limpiar validación de formulario
function limpiarValidacion(formElement) {
    const inputs = formElement.querySelectorAll('.is-valid, .is-invalid');
    inputs.forEach(input => {
        input.classList.remove('is-valid', 'is-invalid');
    });
}

// Cargar opciones de select desde API
async function cargarOpcionesSelect(selectElement, apiUrl, valorProp, textoProp, placeholder = 'Seleccionar...') {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        selectElement.innerHTML = `<option value="">${placeholder}</option>`;

        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valorProp];
            option.textContent = item[textoProp];
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando opciones:', error);
        mostrarAlerta('Error cargando opciones del servidor', 'danger');
    }
}

// Mostrar loading en botón
function mostrarLoading(boton, mostrar = true) {
    if (mostrar) {
        boton.disabled = true;
        const textoOriginal = boton.innerHTML;
        boton.setAttribute('data-original-text', textoOriginal);
        boton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Cargando...';
    } else {
        boton.disabled = false;
        const textoOriginal = boton.getAttribute('data-original-text');
        if (textoOriginal) {
            boton.innerHTML = textoOriginal;
        }
    }
}

// Petición AJAX genérica
async function hacerPeticion(url, opciones = {}) {
    const opcionesDefault = {
        headers: {
            'Content-Type': 'application/json',
        }
    };

    const opcionesFinales = { ...opcionesDefault, ...opciones };

    try {
        const response = await fetch(url, opcionesFinales);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error en la petición');
        }

        return data;
    } catch (error) {
        console.error('Error en petición:', error);
        throw error;
    }
}

// Inicialización global
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar tooltips de Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Marcar enlace activo en navegación
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}); 