document.addEventListener('DOMContentLoaded', function() {
    // --- Lógica para el header ---
    const mainHeader = document.getElementById('main-header');
    const headerScrollThreshold = 50;

    // --- Lógica para el botón flotante ---
    const floatingButton = document.querySelector('.whatsapp-flotante');
    // El botón aparecerá después de que el usuario baje esta cantidad de píxeles
    const buttonScrollThreshold = 300; 

    // Función que maneja el evento de scroll
    function handleScroll() {
        // Lógica del header
        if (window.scrollY > headerScrollThreshold) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }

        // Lógica del botón flotante
        if (floatingButton) { // Comprobamos que el botón exista
            if (window.scrollY > buttonScrollThreshold) {
                floatingButton.classList.add('visible');
            } else {
                floatingButton.classList.remove('visible');
            }
        }
    }

    // Ejecutamos la función una vez al cargar la página para establecer el estado inicial
    handleScroll();

    // Añadimos el 'listener' para el evento de scroll en la ventana
    window.addEventListener('scroll', handleScroll);
        // --- Lógica para la animación de Fade-in de productos ---
        const productSections = document.querySelectorAll('.producto, .producto-invertido');
    
        if (productSections.length > 0) {
            const observerOptions = {
                root: null, // Observa en relación al viewport
                rootMargin: '0px',
                threshold: 0.1 // Se activa cuando el 10% del elemento es visible
            };
    
            const observerCallback = (entries, observer) => {
                entries.forEach(entry => {
                    // Si el elemento está entrando en la pantalla
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        // Dejamos de observar el elemento una vez que es visible para que la animación no se repita
                        observer.unobserve(entry.target);
                    }
                });
            };
    
            const productObserver = new IntersectionObserver(observerCallback, observerOptions);
    
            // Ponemos a observar cada una de las secciones de producto
            productSections.forEach(section => productObserver.observe(section));
        }
    
});