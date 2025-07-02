// Funciones JavaScript comunes para el sistema Cafés Marloy

// Mostrar alertas
function mostrarAlerta(mensaje, tipo = "success") {
  const alertContainer = document.getElementById("alertContainer");
  const alertId = "alert_" + Date.now();

  const alertHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert" id="${alertId}">
            <i class="bi bi-${
              tipo === "success"
                ? "check-circle"
                : tipo === "danger"
                ? "exclamation-triangle"
                : "info-circle"
            }"></i>
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

  alertContainer.insertAdjacentHTML("beforeend", alertHTML);

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
  if (!fecha) return "";
  return new Date(fecha).toLocaleString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Formatear moneda
function formatearMoneda(cantidad) {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
  }).format(cantidad);
}

// Validar formulario
function validarFormulario(formElement) {
  const inputs = formElement.querySelectorAll(
    "input[required], select[required], textarea[required]"
  );
  let esValido = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.classList.add("is-invalid");
      esValido = false;
    } else {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
    }
  });

  return esValido;
}

// Limpiar validación de formulario
function limpiarValidacion(formElement) {
  const inputs = formElement.querySelectorAll(".is-valid, .is-invalid");
  inputs.forEach((input) => {
    input.classList.remove("is-valid", "is-invalid");
  });
}

// Cargar opciones de select desde API
async function cargarOpcionesSelect(
  selectElement,
  apiUrl,
  valorProp,
  textoProp,
  placeholder = "Seleccionar..."
) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    selectElement.innerHTML = `<option value="">${placeholder}</option>`;

    data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item[valorProp];
      option.textContent = item[textoProp];
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error("Error cargando opciones:", error);
    mostrarAlerta("Error cargando opciones del servidor", "danger");
  }
}

// Mostrar loading en botón
function mostrarLoading(boton, mostrar = true) {
  if (mostrar) {
    boton.disabled = true;
    const textoOriginal = boton.innerHTML;
    boton.setAttribute("data-original-text", textoOriginal);
    boton.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2"></span>Cargando...';
  } else {
    boton.disabled = false;
    const textoOriginal = boton.getAttribute("data-original-text");
    if (textoOriginal) {
      boton.innerHTML = textoOriginal;
    }
  }
}

// Petición AJAX genérica
async function hacerPeticion(url, opciones = {}) {
  const opcionesDefault = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const opcionesFinales = { ...opcionesDefault, ...opciones };

  try {
    const response = await fetch(url, opcionesFinales);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error en la petición");
    }

    return data;
  } catch (error) {
    console.error("Error en petición:", error);
    throw error;
  }
}

// Inicialización global
document.addEventListener("DOMContentLoaded", function () {
  // Inicializar tooltips de Bootstrap
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Marcar enlace activo en navegación
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });
});

// ═══════════════════════════════════════════════════════
// SISTEMA AVANZADO DE VALIDACIÓN DE FORMULARIOS
// ═══════════════════════════════════════════════════════

// Mostrar error específico en un campo
function mostrarErrorCampo(campo, mensaje) {
  // Limpiar errores previos
  limpiarErrorCampo(campo);

  // Agregar clase de error
  campo.classList.add("is-invalid");

  // Crear o actualizar mensaje de error
  let errorDiv = campo.parentNode.querySelector(".invalid-feedback");
  if (!errorDiv) {
    errorDiv = document.createElement("div");
    errorDiv.className = "invalid-feedback";
    campo.parentNode.appendChild(errorDiv);
  }

  errorDiv.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${mensaje}`;
  errorDiv.style.display = "block";
}

// Limpiar error de un campo específico
function limpiarErrorCampo(campo) {
  campo.classList.remove("is-invalid");
  campo.classList.remove("is-valid");

  const errorDiv = campo.parentNode.querySelector(".invalid-feedback");
  if (errorDiv) {
    errorDiv.remove();
  }
}

// Mostrar campo como válido
function mostrarCampoValido(campo) {
  limpiarErrorCampo(campo);
  campo.classList.add("is-valid");
}

// Procesar errores del backend y mostrarlos en el formulario
function mostrarErroresValidacion(formulario, error) {
  // Limpiar errores previos
  limpiarValidacionCompleta(formulario);

  const errorMessage = error.message || error;

  // Si el error contiene información específica de campo
  if (errorMessage.toLowerCase().includes("email")) {
    const campoEmail = formulario.querySelector(
      'input[type="email"], input[name="correo"]'
    );
    if (campoEmail) {
      mostrarErrorCampo(campoEmail, errorMessage);
      return;
    }
  }

  if (
    errorMessage.toLowerCase().includes("teléfono") ||
    errorMessage.toLowerCase().includes("telefono")
  ) {
    const campoTelefono = formulario.querySelector(
      'input[type="tel"], input[name="telefono"]'
    );
    if (campoTelefono) {
      mostrarErrorCampo(campoTelefono, errorMessage);
      return;
    }
  }

  if (
    errorMessage.toLowerCase().includes("cédula") ||
    errorMessage.toLowerCase().includes("cedula") ||
    errorMessage.toLowerCase().includes("ci")
  ) {
    const campoCedula = formulario.querySelector(
      'input[name="ci"], input[name="cedula"]'
    );
    if (campoCedula) {
      mostrarErrorCampo(campoCedula, errorMessage);
      return;
    }
  }

  if (errorMessage.toLowerCase().includes("precio")) {
    const campoPrecio = formulario.querySelector(
      'input[name="precio_unitario"], input[name="costo_alquiler_mensual"]'
    );
    if (campoPrecio) {
      mostrarErrorCampo(campoPrecio, errorMessage);
      return;
    }
  }

  if (errorMessage.toLowerCase().includes("cantidad")) {
    const campoCantidad = formulario.querySelector(
      'input[name="cantidad_usada"]'
    );
    if (campoCantidad) {
      mostrarErrorCampo(campoCantidad, errorMessage);
      return;
    }
  }

  if (errorMessage.toLowerCase().includes("fecha")) {
    const campoFecha = formulario.querySelector(
      'input[type="date"], input[type="datetime-local"], input[name="fecha"]'
    );
    if (campoFecha) {
      mostrarErrorCampo(campoFecha, errorMessage);
      return;
    }
  }

  if (errorMessage.toLowerCase().includes("nombre")) {
    const campoNombre = formulario.querySelector('input[name="nombre"]');
    if (campoNombre) {
      mostrarErrorCampo(campoNombre, errorMessage);
      return;
    }
  }

  if (
    errorMessage.toLowerCase().includes("descripción") ||
    errorMessage.toLowerCase().includes("descripcion")
  ) {
    const campoDescripcion = formulario.querySelector(
      'input[name="descripcion"], textarea[name="descripcion"]'
    );
    if (campoDescripcion) {
      mostrarErrorCampo(campoDescripcion, errorMessage);
      return;
    }
  }

  // Si no se puede asociar a un campo específico, mostrar error general
  mostrarAlerta(`Error de validación: ${errorMessage}`, "danger");
}

// Limpiar validación completa del formulario
function limpiarValidacionCompleta(formulario) {
  const campos = formulario.querySelectorAll("input, select, textarea");
  campos.forEach((campo) => {
    limpiarErrorCampo(campo);
  });
}

// Validación en tiempo real
function configurarValidacionTiempoReal(formulario) {
  const campos = formulario.querySelectorAll("input, select, textarea");

  campos.forEach((campo) => {
    // Validar al salir del campo
    campo.addEventListener("blur", function () {
      validarCampoIndividual(campo);
    });

    // Limpiar error al escribir
    campo.addEventListener("input", function () {
      if (campo.classList.contains("is-invalid")) {
        limpiarErrorCampo(campo);
      }
    });
  });
}

// Validar campo individual
function validarCampoIndividual(campo) {
  const valor = campo.value.trim();
  const tipo = campo.type;
  const nombre = campo.name;

  // Campo requerido
  if (campo.hasAttribute("required") && !valor) {
    mostrarErrorCampo(campo, "Este campo es requerido");
    return false;
  }

  // Validaciones específicas por tipo
  if (valor) {
    if (tipo === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(valor)) {
        mostrarErrorCampo(campo, "Formato de email inválido");
        return false;
      }
    }

    if (tipo === "tel" || nombre === "telefono") {
      const telefonoRegex = /^(09\d{7}|2\d{7})$/;
      const telefonoLimpio = valor.replace(/[\s\-]/g, "");
      if (!telefonoRegex.test(telefonoLimpio)) {
        mostrarErrorCampo(
          campo,
          "Teléfono debe ser celular (09XXXXXXXX) o fijo (2XXXXXXX)"
        );
        return false;
      }
    }

    if (nombre === "ci" || nombre === "cedula") {
      const ciLimpio = valor.replace(/[\.\-]/g, "");
      if (
        ciLimpio.length < 7 ||
        ciLimpio.length > 8 ||
        !/^\d+$/.test(ciLimpio)
      ) {
        mostrarErrorCampo(
          campo,
          "Cédula debe tener entre 7 y 8 dígitos numéricos"
        );
        return false;
      }
    }

    if (
      tipo === "number" &&
      (nombre.includes("precio") || nombre.includes("costo"))
    ) {
      const precio = parseFloat(valor);
      if (precio < 0) {
        mostrarErrorCampo(campo, "El precio no puede ser negativo");
        return false;
      }
      if (precio > 999999.99) {
        mostrarErrorCampo(campo, "El precio no puede exceder $999,999.99");
        return false;
      }
    }
  }

  // Si llegamos aquí, el campo es válido
  mostrarCampoValido(campo);
  return true;
}

// Validar formulario completo con errores específicos
function validarFormularioCompleto(formulario) {
  let esValido = true;
  const campos = formulario.querySelectorAll("input, select, textarea");

  campos.forEach((campo) => {
    if (!validarCampoIndividual(campo)) {
      esValido = false;
    }
  });

  return esValido;
}

// Manejo mejorado de respuestas del servidor
async function manejarRespuestaServidor(response, formulario = null) {
  try {
    const data = await response.json();

    if (!response.ok) {
      const error = data.error || "Error desconocido";

      if (formulario) {
        mostrarErroresValidacion(formulario, error);
      } else {
        mostrarAlerta(`Error: ${error}`, "danger");
      }

      throw new Error(error);
    }

    return data;
  } catch (error) {
    if (error.name === "SyntaxError") {
      // Error de parsing JSON, probablemente una respuesta HTML (redirect)
      mostrarAlerta(
        "Error de autenticación. Por favor, inicie sesión nuevamente.",
        "warning"
      );
      window.location.href = "/login";
    }
    throw error;
  }
}
