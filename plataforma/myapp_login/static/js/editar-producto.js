// JavaScript para editar-producto.js - Validación y funcionalidades del formulario de edición
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('editarProductoForm');
    const btnGuardar = document.getElementById('btnGuardar');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Validación en tiempo real
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateField(this);
        });
        
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
    
    // Función de validación de campos
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        // Remover clases previas
        field.classList.remove('is-valid', 'is-invalid');
        
        // Validaciones específicas
        let isValid = true;
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
        }
        
        if (fieldName === 'precio' && value) {
            const precio = parseFloat(value);
            if (isNaN(precio) || precio <= 0) {
                isValid = false;
            }
        }
        
        if (fieldName === 'cantidad' && value) {
            const cantidad = parseInt(value);
            if (isNaN(cantidad) || cantidad < 0) {
                isValid = false;
            }
        }
        
        if (fieldName === 'nombre' && value && value.length < 2) {
            isValid = false;
        }
        
        // Aplicar clase de validación
        if (value) {
            field.classList.add(isValid ? 'is-valid' : 'is-invalid');
        }
    }
    
    // Validación al enviar el formulario
    form.addEventListener('submit', function(e) {
        let formIsValid = true;
        
        // Validar todos los campos requeridos
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            validateField(field);
            if (field.classList.contains('is-invalid') || !field.value.trim()) {
                formIsValid = false;
            }
        });
        
        if (!formIsValid) {
            e.preventDefault();
            
            // Mostrar mensaje de error
            showAlert('Por favor, corrija los errores en el formulario antes de continuar.', 'danger');
            
            // Scroll al primer campo con error
            const firstInvalidField = form.querySelector('.is-invalid, [required]:invalid');
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalidField.focus();
            }
        } else {
            // Mostrar estado de carga en el botón
            btnGuardar.classList.add('btn-loading');
            btnGuardar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
            btnGuardar.disabled = true;
        }
    });
    
    // Función para mostrar alertas
    function showAlert(message, type = 'info') {
        const existingAlert = form.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = `<strong>${message}</strong>`;
        form.insertBefore(alertDiv, form.firstChild);
        
        // Remover el mensaje después de 5 segundos
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
    
    // Validación inicial de campos con valores
    inputs.forEach(input => {
        if (input.value.trim()) {
            validateField(input);
        }
    });
});

// Prevenir envío doble del formulario
let formSubmitted = false;
document.getElementById('editarProductoForm').addEventListener('submit', function() {
    if (formSubmitted) {
        return false;
    }
    formSubmitted = true;
    return true;
});