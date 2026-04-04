/* ============================================================
   Nexvora Systems — Script principal
   Funciones: navbar scroll, menú móvil, animaciones entrada
============================================================ */

/* --- Navbar scroll --- */
function iniciarNavbarScroll() {
    var navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* --- Menú hamburguesa móvil --- */
function iniciarMenuMovil() {
    var btn    = document.getElementById('hamburguesa');
    var links  = document.getElementById('nav-links');
    if (!btn || !links) return;

    btn.addEventListener('click', function () {
        links.classList.toggle('abierto');
    });

    links.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            links.classList.remove('abierto');
        });
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.nav-inner')) {
            links.classList.remove('abierto');
        }
    });
}

/* --- Animaciones de entrada con IntersectionObserver --- */
function iniciarAnimaciones() {
    /* Agregar clase animar a elementos clave */
    document.querySelectorAll('.servicio-card').forEach(function (el, i) {
        el.classList.add('animar');
        el.classList.add('delay-' + Math.min(i + 1, 4));
    });

    document.querySelectorAll('.porque-item').forEach(function (el, i) {
        el.classList.add('animar');
        el.classList.add('delay-' + Math.min(i + 1, 4));
    });

    document.querySelectorAll('.seccion-header').forEach(function (el) {
        el.classList.add('animar');
    });

    document.querySelector('.hero-contenido') &&
        document.querySelector('.hero-contenido').classList.add('animar');

    /* Observer */
    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.animar').forEach(function (el) {
            el.classList.add('visible');
        });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.animar').forEach(function (el) {
        observer.observe(el);
    });
}

/* --- Smooth scroll --- */
function iniciarSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href    = link.getAttribute('href');
            if (href === '#' || href === '') return;
            var destino = document.querySelector(href);
            if (!destino) return;
            e.preventDefault();
            var offset = 72;
            var pos    = destino.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: pos, behavior: 'smooth' });
        });
    });
}

/* --- Init --- */
document.addEventListener('DOMContentLoaded', function () {
    iniciarNavbarScroll();
    iniciarMenuMovil();
    iniciarAnimaciones();
    iniciarSmoothScroll();
});