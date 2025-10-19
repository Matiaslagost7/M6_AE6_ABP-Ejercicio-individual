// JavaScript para eliminar-producto.js - Validación y funcionalidades del formulario de eliminación
// Nota: Esta función necesita recibir el nombre del producto como parámetro
function initEliminarProducto(nombreProducto) {
    document.addEventListener('DOMContentLoaded', function() {
        const confirmacionInput = document.getElementById('confirmacion');
        const btnEliminar = document.getElementById('btnEliminar');
        const formEliminar = document.getElementById('formEliminar');
        
        // Auto-focus en el campo de confirmación
        confirmacionInput.focus();
        
        // Validación en tiempo real del campo de confirmación
        confirmacionInput.addEventListener('input', function() {
            const valorIngresado = this.value.trim();
            
            if (valorIngresado === nombreProducto) {
                // Nombre correcto
                btnEliminar.disabled = false;
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
                btnEliminar.classList.add('confirmado');
                
                // Efecto visual de confirmación
                setTimeout(() => {
                    btnEliminar.classList.remove('confirmado');
                }, 500);
            } else {
                // Nombre incorrecto
                btnEliminar.disabled = true;
                this.classList.remove('is-valid');
                btnEliminar.classList.remove('confirmado');
                
                if (valorIngresado !== '') {
                    this.classList.add('is-invalid');
                } else {
                    this.classList.remove('is-invalid');
                }
            }
        });
        
        // Validación al enviar el formulario
        formEliminar.addEventListener('submit', function(e) {
            const valorConfirmacion = confirmacionInput.value.trim();
            
            // Verificar que el nombre coincida exactamente
            if (valorConfirmacion !== nombreProducto) {
                e.preventDefault();
                
                // Mostrar alerta y enfocar el campo
                alert(`Error: Debes escribir exactamente "${nombreProducto}" para confirmar la eliminación.`);
                confirmacionInput.focus();
                confirmacionInput.select();
                return false;
            }
            
            // Confirmación final con dialog nativo
            const confirmacionFinal = confirm(
                `🚨 CONFIRMACIÓN FINAL 🚨\n\n` +
                `¿Estás ABSOLUTAMENTE SEGURO de eliminar "${nombreProducto}"?\n\n` +
                `✋ RECUERDA: Esta acción NO se puede deshacer.\n` +
                `💀 Se perderán todos los datos del producto.\n\n` +
                `Haz clic en "Aceptar" solo si estás 100% seguro.`
            );
            
            if (!confirmacionFinal) {
                e.preventDefault();
                return false;
            }
            
            // Mostrar estado de carga en el botón
            btnEliminar.classList.add('btn-loading');
            btnEliminar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Eliminando...';
            btnEliminar.disabled = true;
            
            // Deshabilitar todos los botones para evitar doble envío
            const todosLosBotones = document.querySelectorAll('.btn');
            todosLosBotones.forEach(btn => {
                btn.style.pointerEvents = 'none';
                btn.style.opacity = '0.6';
            });
        });
        
        // Efecto visual al enfocar el campo
        confirmacionInput.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        confirmacionInput.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
        
        // Prevenir cierre accidental de la página
        let formularioEnviado = false;
        
        formEliminar.addEventListener('submit', function() {
            formularioEnviado = true;
        });
        
        window.addEventListener('beforeunload', function(e) {
            if (!formularioEnviado && confirmacionInput.value.trim() !== '') {
                e.preventDefault();
                e.returnValue = '¿Estás seguro de que quieres salir? Se perderá el progreso de confirmación.';
                return e.returnValue;
            }
        });
    });
}