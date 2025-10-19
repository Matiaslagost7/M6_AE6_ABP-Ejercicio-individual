// JavaScript optimizado para la página de inicio

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funcionalidades básicas
    setupScrollEffects();
    setupButtonEffects();
    
    console.log('Página de inicio cargada correctamente');
});

// Configurar efectos de scroll simples
function setupScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        
        // Efecto parallax en el hero icon
        const heroIcon = document.querySelector('.hero-icon');
        if (heroIcon) {
            const rate = scrolled * -0.3;
            heroIcon.style.transform = `translateY(${rate}px) rotate(${scrolled * 0.05}deg)`;
        }
        
        ticking = false;
    }
    
    function requestUpdateScrollEffects() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestUpdateScrollEffects);
}

// Configurar efectos de botones
function setupButtonEffects() {
    // Efecto ripple para botones
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                transform: scale(0);
                animation: rippleEffect 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // CSS para el efecto ripple
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleEffect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Manejo de errores global
window.addEventListener('error', function(e) {
    console.error('Error en la página de inicio:', e.error);
});

console.log('Script optimizado de inicio cargado correctamente');