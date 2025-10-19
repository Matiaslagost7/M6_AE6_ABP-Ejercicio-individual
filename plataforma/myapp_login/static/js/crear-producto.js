// JavaScript para crear-producto.js - Validación y funcionalidades del formulario
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('createProductForm');
    const submitBtn = document.getElementById('submitBtn');
    
    // Validación en tiempo real para precio
    const precioInput = document.getElementById('precio');
    precioInput.addEventListener('input', function() {
        if (this.value < 0) {
            this.value = 0;
        }
        validateField(this);
    });
    
    // Validación en tiempo real para cantidad
    const cantidadInput = document.getElementById('cantidad');
    cantidadInput.addEventListener('input', function() {
        if (this.value < 0) {
            this.value = 0;
        }
        validateField(this);
    });

    // Validación para nombre
    const nombreInput = document.getElementById('nombre');
    nombreInput.addEventListener('input', function() {
        validateField(this);
    });

    // Auto-focus en el primer campo
    nombreInput.focus();

    // Función de validación visual
    function validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        
        field.classList.remove('is-valid', 'is-invalid');
        
        if (isRequired && !value) {
            field.classList.add('is-invalid');
        } else if (value) {
            field.classList.add('is-valid');
        }
    }

    // Animación de loading en el botón al enviar
    form.addEventListener('submit', function() {
        submitBtn.classList.add('btn-loading');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        submitBtn.disabled = true;
    });

    // Validación del formulario antes del envío
    form.addEventListener('submit', function(e) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            }
        });

        if (!isValid) {
            e.preventDefault();
            submitBtn.classList.remove('btn-loading');
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Producto';
            submitBtn.disabled = false;
            
            // Scroll al primer campo con error
            const firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalid.focus();
            }
        }
    });

    // Formateo automático del precio
    precioInput.addEventListener('blur', function() {
        if (this.value) {
            this.value = parseFloat(this.value).toFixed(2);
        }
    });
});