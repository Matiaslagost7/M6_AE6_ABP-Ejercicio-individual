// JavaScript para el formulario de contacto

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar validación del formulario
    initContactForm();
    
    // Agregar animaciones de entrada
    addEntranceAnimations();
    
    // Configurar validación en tiempo real
    setupRealTimeValidation();
});

// Función principal para inicializar el formulario
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Configurar validación del formulario
    form.addEventListener('submit', handleFormSubmit);
    
    // Agregar eventos de validación en tiempo real
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearValidationState);
    });
    
    // Configurar contador de caracteres para el textarea
    setupCharacterCounter();
    
    // Configurar auto-resize para textarea
    setupTextareaAutoResize();
    
    console.log('Formulario de contacto inicializado correctamente');
}

// Manejar el envío del formulario
function handleFormSubmit(event) {
    const form = event.target;
    const submitBtn = form.querySelector('.btn-primary');
    
    // Validar todo el formulario antes del envío
    const isValid = validateAllFields(form);
    
    if (!isValid) {
        event.preventDefault();
        showFormError('Por favor, corrija los errores en el formulario');
        return false;
    }
    
    // Mostrar estado de carga
    showLoadingState(submitBtn);
    
    // El formulario se enviará normalmente, pero podemos agregar feedback
    setTimeout(() => {
        // Esto se ejecutará si hay algún error de servidor
        hideLoadingState(submitBtn);
    }, 10000); // Timeout de 10 segundos
}

// Validar todos los campos del formulario
function validateAllFields(form) {
    const inputs = form.querySelectorAll('.form-control');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validar un campo individual
function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let message = '';
    
    // Limpiar estado previo
    clearFieldValidation(field);
    
    // Validaciones específicas por campo
    switch(fieldName) {
        case 'nombre':
            if (!value) {
                isValid = false;
                message = 'El nombre es obligatorio';
            } else if (value.length < 2) {
                isValid = false;
                message = 'El nombre debe tener al menos 2 caracteres';
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                isValid = false;
                message = 'El nombre solo puede contener letras y espacios';
            }
            break;
            
        case 'email':
            if (!value) {
                isValid = false;
                message = 'El email es obligatorio';
            } else if (!isValidEmail(value)) {
                isValid = false;
                message = 'Por favor, ingrese un email válido';
            }
            break;
            
        case 'asunto':
            if (!value) {
                isValid = false;
                message = 'El asunto es obligatorio';
            } else if (value.length < 5) {
                isValid = false;
                message = 'El asunto debe tener al menos 5 caracteres';
            } else if (value.length > 100) {
                isValid = false;
                message = 'El asunto no puede exceder 100 caracteres';
            }
            break;
            
        case 'mensaje':
            if (!value) {
                isValid = false;
                message = 'El mensaje es obligatorio';
            } else if (value.length < 10) {
                isValid = false;
                message = 'El mensaje debe tener al menos 10 caracteres';
            } else if (value.length > 1000) {
                isValid = false;
                message = 'El mensaje no puede exceder 1000 caracteres';
            }
            break;
    }
    
    // Aplicar estado de validación
    if (isValid) {
        setFieldValid(field, 'Campo válido');
    } else {
        setFieldInvalid(field, message);
    }
    
    return isValid;
}

// Validar formato de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Establecer campo como válido
function setFieldValid(field, message) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    showFieldFeedback(field, message, 'valid');
}

// Establecer campo como inválido
function setFieldInvalid(field, message) {
    field.classList.remove('is-valid');
    field.classList.add('is-invalid');
    showFieldFeedback(field, message, 'invalid');
}

// Mostrar feedback del campo
function showFieldFeedback(field, message, type) {
    let feedback = field.parentNode.querySelector('.form-feedback');
    
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'form-feedback';
        field.parentNode.appendChild(feedback);
    }
    
    feedback.className = `form-feedback ${type}`;
    feedback.textContent = message;
}

// Limpiar validación del campo
function clearFieldValidation(field) {
    field.classList.remove('is-valid', 'is-invalid');
    const feedback = field.parentNode.querySelector('.form-feedback');
    if (feedback) {
        feedback.remove();
    }
}

// Limpiar estado de validación al escribir
function clearValidationState(event) {
    const field = event.target;
    if (field.classList.contains('is-invalid')) {
        clearFieldValidation(field);
    }
}

// Configurar validación en tiempo real
function setupRealTimeValidation() {
    const inputs = document.querySelectorAll('.form-control');
    
    inputs.forEach(input => {
        // Validación mientras se escribe (con debounce)
        let timeoutId;
        input.addEventListener('input', function() {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (this.value.trim().length > 0) {
                    validateField({ target: this });
                }
            }, 500); // Esperar 500ms después de dejar de escribir
        });
    });
}

// Configurar contador de caracteres
function setupCharacterCounter() {
    const textarea = document.querySelector('textarea[name="mensaje"]');
    if (!textarea) return;
    
    const maxLength = 1000;
    
    // Crear contador
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = `
        text-align: right;
        font-size: 0.8rem;
        color: #6c757d;
        margin-top: 0.5rem;
    `;
    
    textarea.parentNode.appendChild(counter);
    
    // Actualizar contador
    function updateCounter() {
        const length = textarea.value.length;
        counter.textContent = `${length}/${maxLength} caracteres`;
        
        if (length > maxLength * 0.9) {
            counter.style.color = '#dc3545';
        } else if (length > maxLength * 0.7) {
            counter.style.color = '#ffc107';
        } else {
            counter.style.color = '#6c757d';
        }
    }
    
    textarea.addEventListener('input', updateCounter);
    updateCounter(); // Inicializar
}

// Configurar auto-resize para textarea
function setupTextareaAutoResize() {
    const textarea = document.querySelector('textarea[name="mensaje"]');
    if (!textarea) return;
    
    function autoResize() {
        textarea.style.height = 'auto';
        textarea.style.height = Math.max(120, textarea.scrollHeight) + 'px';
    }
    
    textarea.addEventListener('input', autoResize);
    autoResize(); // Inicializar
}

// Mostrar estado de carga en botón
function showLoadingState(button) {
    if (!button) return;
    
    button.disabled = true;
    button.classList.add('btn-loading');
    
    // Guardar texto original
    if (!button.dataset.originalText) {
        button.dataset.originalText = button.innerHTML;
    }
    
    button.innerHTML = '<span>Enviando...</span>';
}

// Ocultar estado de carga
function hideLoadingState(button) {
    if (!button) return;
    
    button.disabled = false;
    button.classList.remove('btn-loading');
    
    if (button.dataset.originalText) {
        button.innerHTML = button.dataset.originalText;
    }
}

// Mostrar error general del formulario
function showFormError(message) {
    // Buscar contenedor de error existente
    let errorContainer = document.querySelector('.form-error-message');
    
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.className = 'form-error-message';
        errorContainer.style.cssText = `
            background: #f8d7da;
            color: #721c24;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            border: 1px solid #f5c6cb;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        const form = document.getElementById('contactForm');
        form.insertBefore(errorContainer, form.firstChild);
    }
    
    errorContainer.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
    `;
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        if (errorContainer.parentNode) {
            errorContainer.remove();
        }
    }, 5000);
    
    // Scroll al error
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Agregar animaciones de entrada
function addEntranceAnimations() {
    const elements = document.querySelectorAll('.contacto-header, .contacto-form-container, .info-item');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 * (index + 1));
    });
}

// Utilidades adicionales
const ContactUtils = {
    // Formatear nombre (primera letra mayúscula)
    formatName: function(name) {
        return name.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    },
    
    // Limpiar espacios extra
    cleanText: function(text) {
        return text.replace(/\s+/g, ' ').trim();
    },
    
    // Detectar spam básico
    isSpam: function(text) {
        const spamWords = ['viagra', 'casino', 'lottery', 'winner', 'urgent'];
        const lowercaseText = text.toLowerCase();
        return spamWords.some(word => lowercaseText.includes(word));
    }
};

// Event listeners adicionales para mejorar UX
document.addEventListener('DOMContentLoaded', function() {
    // Efecto focus en campos
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.style.transform = 'scale(1.02)';
            this.parentNode.style.transition = 'transform 0.2s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.style.transform = 'scale(1)';
        });
    });
    
    // Efecto hover en info items
    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Exposar funciones globalmente si es necesario
window.ContactForm = {
    validateField,
    showLoadingState,
    hideLoadingState,
    ContactUtils
};

console.log('Script de contacto cargado correctamente');