/* ============================================================
   VendeMas App — Script principal
   Autor: Josias Rojas Alca
   Descripción: Interactividad de la landing page:
                - Navbar scroll y menú móvil
                - Animaciones de entrada con IntersectionObserver
                - Smooth scroll para links internos
============================================================ */


/* ============================================================
   NAVBAR — Scroll y menú hamburguesa
============================================================ */

/**
 * Agrega clase 'scrolled' al navbar cuando el usuario hace scroll.
 * Esto activa la sombra definida en el CSS.
 */
function iniciarNavbarScroll() {
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/**
 * Controla el menú hamburguesa en móvil.
 * Alterna la clase 'abierto' en los links de navegación.
 */
function iniciarMenuMovil() {
    const botonHamburguesa = document.getElementById('nav-hamburguesa');
    const navLinks         = document.getElementById('nav-links');

    if (!botonHamburguesa || !navLinks) return;

    botonHamburguesa.addEventListener('click', function () {
        navLinks.classList.toggle('abierto');
    });

    // Cierra el menú al hacer clic en cualquier link
    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('abierto');
        });
    });

    // Cierra el menú al hacer clic fuera de él
    document.addEventListener('click', function (evento) {
        const dentroDelNav = navbar.contains(evento.target);
        if (!dentroDelNav) {
            navLinks.classList.remove('abierto');
        }
    });
}


/* ============================================================
   ANIMACIONES DE ENTRADA — IntersectionObserver
============================================================ */

/**
 * Observa los elementos con clase 'animar' y les agrega
 * la clase 'visible' cuando entran al viewport.
 * Esto dispara la animación CSS definida en style.css.
 */
function iniciarAnimaciones() {
    // Verifica que el navegador soporte IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        // Si no soporta, muestra todo sin animación
        document.querySelectorAll('.animar').forEach(function (el) {
            el.classList.add('visible');
        });
        return;
    }

    const opciones = {
        threshold : 0.15, // Se activa cuando el 15% del elemento es visible
        rootMargin: '0px 0px -50px 0px' // Margen inferior para activar antes
    };

    const observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visible');
                // Deja de observar el elemento una vez animado
                observador.unobserve(entrada.target);
            }
        });
    }, opciones);

    // Observa todos los elementos con clase 'animar'
    document.querySelectorAll('.animar').forEach(function (elemento) {
        observador.observe(elemento);
    });
}


/* ============================================================
   SMOOTH SCROLL — Links internos (#seccion)
============================================================ */

/**
 * Agrega scroll suave a todos los links que apuntan
 * a una sección dentro de la misma página (#id).
 * Compensa la altura del navbar fijo (64px).
 */
function iniciarSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (evento) {
            const href = link.getAttribute('href');

            // Solo actúa si el link tiene un ID válido
            if (href === '#' || href === '') return;

            const seccion = document.querySelector(href);
            if (!seccion) return;

            evento.preventDefault();

            const alturaNavbar   = 64;
            const posicionSeccion = seccion.getBoundingClientRect().top + window.scrollY;
            const posicionFinal  = posicionSeccion - alturaNavbar;

            window.scrollTo({
                top      : posicionFinal,
                behavior : 'smooth'
            });
        });
    });
}


/* ============================================================
   AGREGAR CLASES DE ANIMACIÓN A ELEMENTOS
   Se hace aquí para no ensuciar el HTML
============================================================ */

/**
 * Agrega la clase 'animar' y delays escalonados
 * a los grupos de elementos que deben animarse.
 */
function configurarAnimaciones() {

    // Cards de producto
    document.querySelectorAll('.producto-card').forEach(function (card, index) {
        card.classList.add('animar');
        card.classList.add('animar-delay-' + (index + 1));
    });

    // Items de features
    document.querySelectorAll('.feature-item').forEach(function (item, index) {
        item.classList.add('animar');
        if (index < 4) {
            item.classList.add('animar-delay-' + (index + 1));
        }
    });

    // Cards de precios
    document.querySelectorAll('.plan-card').forEach(function (card, index) {
        card.classList.add('animar');
        card.classList.add('animar-delay-' + (index + 1));
    });

    // Encabezados de sección
    document.querySelectorAll('.seccion-encabezado').forEach(function (encabezado) {
        encabezado.classList.add('animar');
    });

    // Hero texto (animación inmediata al cargar)
    const heroTexto = document.querySelector('.hero-texto');
    if (heroTexto) {
        heroTexto.classList.add('animar');
    }

    const heroImagen = document.querySelector('.hero-imagen');
    if (heroImagen) {
        heroImagen.classList.add('animar');
        heroImagen.classList.add('animar-delay-2');
    }
}


/* ============================================================
   ACTIVE LINK — Resalta el link activo según la sección visible
============================================================ */

/**
 * Observa qué sección está visible y resalta
 * el link correspondiente en el navbar.
 */
function iniciarActivoLink() {
    if (!('IntersectionObserver' in window)) return;

    const secciones = document.querySelectorAll('section[id]');
    const links     = document.querySelectorAll('.nav-link');

    const observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                const id = entrada.target.getAttribute('id');

                links.forEach(function (link) {
                    link.style.color = '';
                    if (link.getAttribute('href') === '#' + id) {
                        link.style.color = 'var(--verde)';
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    secciones.forEach(function (seccion) {
        observador.observe(seccion);
    });
}


/* ============================================================
   INICIALIZACIÓN — Ejecuta todo cuando el DOM está listo
============================================================ */
document.addEventListener('DOMContentLoaded', function () {

    // Configurar animaciones antes de iniciarlas
    configurarAnimaciones();

    // Iniciar todos los módulos
    iniciarNavbarScroll();
    iniciarMenuMovil();
    iniciarAnimaciones();
    iniciarSmoothScroll();
    iniciarActivoLink();

    console.log('[VendeMas App] Página cargada correctamente.');
});
