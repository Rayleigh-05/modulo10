// Referencias a elementos del DOM
const inputCedula = document.getElementById('cedula');
const btnValidar = document.getElementById('validar');
const resultado = document.getElementById('resultado');

// Formatear cédula mientras se escribe
inputCedula.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Solo números
    
    if (value.length > 11) {
        value = value.substring(0, 11);
    }
    
    // Formatear con guiones: XXX-XXXXXXX-X
    if (value.length > 3 && value.length <= 10) {
        value = value.substring(0, 3) + '-' + value.substring(3);
    } else if (value.length > 10) {
        value = value.substring(0, 3) + '-' + value.substring(3, 10) + '-' + value.substring(10);
    }
    
    e.target.value = value;
});

// Evento del botón validar
btnValidar.addEventListener('click', function() {
    const cedula = inputCedula.value;
    validarCedula(cedula);
});

// Validar al presionar Enter
inputCedula.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        validarCedula(inputCedula.value);
    }
});

/**
 * Función principal para validar la cédula usando Módulo 10
 * @param {string} cedula - Cédula a validar en formato XXX-XXXXXXX-X
 */
function validarCedula(cedula) {
    // Limpiar cédula (eliminar guiones)
    const cedulaLimpia = cedula.replace(/-/g, '');
    
    // Validar que tenga exactamente 11 dígitos
    if (cedulaLimpia.length !== 11) {
        mostrarResultado('CÉDULA ES INCORRECTA', false);
        return;
    }
    
    // Validar que todos sean números
    if (!/^\d+$/.test(cedulaLimpia)) {
        mostrarResultado('CÉDULA ES INCORRECTA', false);
        return;
    }
    
    // Extraer los primeros 10 dígitos y el dígito verificador
    const digitosParaValidar = cedulaLimpia.substring(0, 10);
    const digitoVerificador = parseInt(cedulaLimpia.charAt(10));
    
    // Calcular el dígito verificador usando Módulo 10
    const digitoCalculado = calcularDigitoVerificador(digitosParaValidar);
    
    // Comparar
    if (digitoCalculado === digitoVerificador) {
        mostrarResultado('CÉDULA ES CORRECTA', true);
    } else {
        mostrarResultado('CÉDULA ES INCORRECTA', false);
    }
}

/**
 * Calcula el dígito verificador usando el algoritmo Módulo 10
 * @param {string} digitos - Los primeros 10 dígitos de la cédula
 * @returns {number} - Dígito verificador calculado
 */
function calcularDigitoVerificador(digitos) {
    let suma = 0;
    
    // Recorrer los 10 dígitos de derecha a izquierda
    for (let i = 0; i < digitos.length; i++) {
        let digito = parseInt(digitos.charAt(i));
        
        // Si la posición es impar (contando desde la derecha, posiciones 1, 3, 5, 7, 9)
        // En el índice esto corresponde a i impar (1, 3, 5, 7, 9)
        if (i % 2 === 1) {
            digito *= 2;
            
            // Si el resultado es mayor que 9, sumar los dígitos
            if (digito > 9) {
                digito = Math.floor(digito / 10) + (digito % 10);
            }
        }
        
        suma += digito;
    }
    
    // Calcular el módulo 10
    const modulo = suma % 10;
    
    // El dígito verificador es 10 - módulo, pero si es 10, se convierte en 0
    const digitoVerificador = modulo === 0 ? 0 : 10 - modulo;
    
    return digitoVerificador;
}

/**
 * Muestra el resultado de la validación
 * @param {string} mensaje - Mensaje a mostrar
 * @param {boolean} esCorrecta - Si la cédula es correcta o no
 */
function mostrarResultado(mensaje, esCorrecta) {
    resultado.textContent = mensaje;
    resultado.className = 'resultado show ' + (esCorrecta ? 'correcta' : 'incorrecta');
}