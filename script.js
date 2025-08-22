document.addEventListener('DOMContentLoaded', function() {

    // --- PANEL DE CONTROL DE STOCK ---
    // Aquí es el único lugar que necesitas editar cada día.
    //
    // --- LÓGICA PARA EL ENCABEZADO FIJO (HEADER) ---
    const header = document.getElementById('main-header');
    const scrollThreshold = 50; // Cuántos píxeles debe hacer scroll el usuario para activar el cambio

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- LÓGICA PARA LA ANIMACIÓN DE PRODUCTOS AL HACER SCROLL (FADE-IN) ---
    const productSections = document.querySelectorAll('.producto');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.2 // El 20% del elemento debe ser visible para activar
    };

    const productObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Deja de observar una vez que es visible
            }
        });
    }, observerOptions);

    productSections.forEach(section => {
        productObserver.observe(section);
    });

    // --- PANEL DE CONTROL DE PRECIOS ---
    // Aquí puedes actualizar los precios de cada producto.
    // Ahora controlamos tanto la etiqueta (label) como el valor (valor).
    const preciosDiarios = {
        "torta-chocolate": {
            entera:  { label: 'Entera',  valor: 55.00 },
            porcion: { label: 'Porción', valor: 9.00 }
        },
        "alfajores": {
            caja:   { label: 'Caja x6', valor: 15.00 },
            unidad: { label: 'Unidad',  valor: 3.00 }
        },
        "red-velvet": {
            entera:  { label: 'Entera',  valor: 60.00 },
            porcion: { label: 'Porción', valor: 10.00 }
        },
        "tres-leches": {
            entera:  { label: 'Entera',  valor: 50.00 },
            porcion: { label: 'Porción', valor: 8.50 }
        },
        "chocoflan": {
            entero:  { label: 'Entero',  valor: 58.00 },
            porcion: { label: 'Porción', valor: 9.50 }
        },
        "crema-volteada": {
            entera:  { label: 'Entera',  valor: 45.00 },
            porcion: { label: 'Porción', valor: 7.00 }
        },
        "bizcocho-naranja": {
            entero: { label: 'Entero', valor: 35.00 } // Usamos 'entero' para consistencia
        },
        "savarin-limon": {
            entero:  { label: 'Entero',  valor: 40.00 },
            porcion: { label: 'Porción', valor: 7.00 }
        },
        "pionono-clasico": {
            entero: { label: 'Entero', valor: 30.00 }
        },
        "mil-hojas-cafe": {
            entero:  { label: 'Entero',  valor: 55.00 },
            porcion: { label: 'Porción', valor: 9.00 }
        },
        "bavarois-melocoton": {
            individual: { label: 'Individual', valor: 10.00 }
        },
        "gelatina-mosaico": {
            fuente: { label: 'Fuente', valor: 35.00 },
            vaso:   { label: 'Vaso',   valor: 5.00 }
        },
        "crepes": {
            porcion2und: { label: 'Porción (2 und)', valor: 12.00 }
        }
    };

    // --- PANEL DE CONTROL DE STOCK ---
    // `true` = disponible, `false` = agotado.
    const stockDiario = {
        "torta-chocolate": { disponible: true },
        "alfajores": { disponible: false }, // Ejemplo de producto agotado
        "red-velvet": { disponible: true },
        "tres-leches": { disponible: true },
        "chocoflan": { disponible: false }, // Ejemplo de producto agotado
        "crema-volteada": { disponible: true },
        "bizcocho-naranja": { disponible: true },
        "savarin-limon": { disponible: true },
        "pionono-clasico": { disponible: false }, // Ejemplo de producto agotado
        "mil-hojas-cafe": { disponible: true },
        "bavarois-melocoton": { disponible: true },
        "gelatina-mosaico": { disponible: true },
        "crepes": { disponible: true }
    };

    // --- LÓGICA DE LA PÁGINA (No necesitas tocar esto) ---

    // 1. Muestra la fecha actual
    const elementoFecha = document.querySelector('.fecha-hoy');
    if (elementoFecha) {
        const hoy = new Date();
        const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        // Capitalizar la primera letra del día
        let fechaFormateada = hoy.toLocaleDateString('es-ES', opcionesFecha);
        fechaFormateada = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
        elementoFecha.textContent = `Disponibilidad para hoy, ${fechaFormateada}`;
    }

    // 2. Actualiza cada producto según el stock y los precios
    // Iteramos sobre stockDiario, pero también obtenemos los precios para el mismo producto
    for (const productoId in stockDiario) {
        const productoElemento = document.getElementById(productoId);
        if (productoElemento) {
            const config = stockDiario[productoId];
            const elementoEstado = productoElemento.querySelector('.estado-stock');
            const botonesComprar = productoElemento.querySelectorAll('.boton-comprar');

            if (config.disponible) {
                elementoEstado.textContent = '¡Disponible hoy!';
                elementoEstado.classList.add('disponible');
            } else {
                elementoEstado.textContent = 'Agotado por hoy';
                elementoEstado.classList.add('agotado');

                botonesComprar.forEach(boton => {
                    boton.classList.add('deshabilitado');
                    // Evita que el link funcione
                    boton.setAttribute('href', 'javascript:void(0)'); 
                    boton.setAttribute('aria-disabled', 'true');
                    // Cambia el texto del botón
                    const icono = boton.querySelector('i');
                    boton.textContent = ' Agotado';
                    if (icono) boton.prepend(icono);
                });
            }

            // Actualizar Precios
            const configPrecios = preciosDiarios[productoId];
            if (configPrecios) {
                // Recorremos cada tipo de precio definido para el producto
                for (const tipoPrecio in configPrecios) {
                    const precioInfo = configPrecios[tipoPrecio]; // Obtenemos el objeto {label, valor}
                    const spanPrecio = productoElemento.querySelector(`.precio-${tipoPrecio}`);
                    if (spanPrecio) {
                        // Reemplazamos completamente el contenido con la etiqueta y el precio del JS
                        spanPrecio.textContent = `${precioInfo.label}: S/ ${precioInfo.valor.toFixed(2)}`;
                    }
                }
            }
        }
    }
});