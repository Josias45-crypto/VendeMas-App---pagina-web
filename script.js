/* ============================================================
   Nexvora Systems — script.js v2
   Efectos: Canvas partículas, navbar scroll, menú móvil,
            animaciones entrada con IntersectionObserver
============================================================ */

/* ============================================================
   CANVAS DE PARTÍCULAS — red de nodos interconectados
   Efecto clásico de empresa tech de alto nivel
============================================================ */
function iniciarCanvas() {
    var canvas = document.getElementById('canvas-bg');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    var particulas = [];
    var cantidad   = Math.floor((canvas.width * canvas.height) / 14000);
    var mouse      = { x: null, y: null, radio: 150 };

    window.addEventListener('mousemove', function(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('resize', function() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        iniciarParticulas();
    });

    function Particula() {
        this.x    = Math.random() * canvas.width;
        this.y    = Math.random() * canvas.height;
        this.vx   = (Math.random() - 0.5) * 0.4;
        this.vy   = (Math.random() - 0.5) * 0.4;
        this.r    = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.2;
    }

    Particula.prototype.update = function() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
    };

    Particula.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,212,255,' + this.alpha + ')';
        ctx.fill();
    };

    function iniciarParticulas() {
        particulas = [];
        cantidad = Math.floor((canvas.width * canvas.height) / 14000);
        for (var i = 0; i < cantidad; i++) {
            particulas.push(new Particula());
        }
    }

    function conectar() {
        var distMax = 120;
        for (var i = 0; i < particulas.length; i++) {
            for (var j = i + 1; j < particulas.length; j++) {
                var dx   = particulas[i].x - particulas[j].x;
                var dy   = particulas[i].y - particulas[j].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < distMax) {
                    var opacity = (1 - dist / distMax) * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(particulas[i].x, particulas[i].y);
                    ctx.lineTo(particulas[j].x, particulas[j].y);
                    ctx.strokeStyle = 'rgba(0,212,255,' + opacity + ')';
                    ctx.lineWidth   = 0.5;
                    ctx.stroke();
                }
            }
            /* Conexión con el mouse */
            if (mouse.x !== null) {
                var mdx  = particulas[i].x - mouse.x;
                var mdy  = particulas[i].y - mouse.y;
                var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mdist < mouse.radio) {
                    var mopacity = (1 - mdist / mouse.radio) * 0.6;
                    ctx.beginPath();
                    ctx.moveTo(particulas[i].x, particulas[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = 'rgba(0,212,255,' + mopacity + ')';
                    ctx.lineWidth   = 0.7;
                    ctx.stroke();
                }
            }
        }
    }

    function animar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < particulas.length; i++) {
            particulas[i].update();
            particulas[i].draw();
        }
        conectar();
        requestAnimationFrame(animar);
    }

    iniciarParticulas();
    animar();
}

/* ============================================================
   NAVBAR SCROLL
============================================================ */
function iniciarNavbarScroll() {
    var navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ============================================================
   MENÚ HAMBURGUESA
============================================================ */
function iniciarMenuMovil() {
    var btn   = document.getElementById('hamburguesa');
    var links = document.getElementById('nav-links');
    if (!btn || !links) return;

    btn.addEventListener('click', function() {
        links.classList.toggle('abierto');
    });

    links.querySelectorAll('.nav-link').forEach(function(link) {
        link.addEventListener('click', function() {
            links.classList.remove('abierto');
        });
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-inner')) {
            links.classList.remove('abierto');
        }
    });
}

/* ============================================================
   ANIMACIONES DE ENTRADA
============================================================ */
function iniciarAnimaciones() {
    document.querySelectorAll('.servicio-card').forEach(function(el, i) {
        el.classList.add('animar', 'delay-' + Math.min(i+1, 4));
    });
    document.querySelectorAll('.porque-item').forEach(function(el, i) {
        el.classList.add('animar', 'delay-' + Math.min(i+1, 4));
    });
    document.querySelectorAll('.seccion-header').forEach(function(el) {
        el.classList.add('animar');
    });
    var hc = document.querySelector('.hero-contenido');
    if (hc) hc.classList.add('animar');

    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.animar').forEach(function(el) { el.classList.add('visible'); });
        return;
    }

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.animar').forEach(function(el) { observer.observe(el); });
}

/* ============================================================
   SMOOTH SCROLL
============================================================ */
function iniciarSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            var href    = link.getAttribute('href');
            if (href === '#' || href === '') return;
            var destino = document.querySelector(href);
            if (!destino) return;
            e.preventDefault();
            var pos = destino.getBoundingClientRect().top + window.scrollY - 72;
            window.scrollTo({ top: pos, behavior: 'smooth' });
        });
    });
}

/* ============================================================
   CONTADOR ANIMADO para las métricas del hero
============================================================ */
function iniciarContadores() {
    var contadores = document.querySelectorAll('.metrica strong');
    var ya = false;

    function animar() {
        if (ya) return;
        ya = true;
        contadores.forEach(function(el) {
            var texto = el.textContent;
            var num   = parseFloat(texto.replace(/[^0-9.]/g, ''));
            var sufijo = texto.replace(/[0-9.]/g, '');
            if (isNaN(num)) return;
            var inicio  = 0;
            var duracion = 1500;
            var inicio_t = null;
            function paso(t) {
                if (!inicio_t) inicio_t = t;
                var progreso = Math.min((t - inicio_t) / duracion, 1);
                var eased    = 1 - Math.pow(1 - progreso, 3);
                var actual   = Math.round(inicio + (num - inicio) * eased);
                el.textContent = actual + sufijo;
                if (progreso < 1) requestAnimationFrame(paso);
            }
            requestAnimationFrame(paso);
        });
    }

    var obs = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) animar();
    }, { threshold: 0.5 });

    var metricas = document.querySelector('.hero-metricas');
    if (metricas) obs.observe(metricas);
}

/* ============================================================
   INIT
============================================================ */
document.addEventListener('DOMContentLoaded', function() {
    iniciarCanvas();
    iniciarNavbarScroll();
    iniciarMenuMovil();
    iniciarAnimaciones();
    iniciarSmoothScroll();
    iniciarContadores();
});