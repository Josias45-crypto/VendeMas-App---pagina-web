/* ============================================================
   Nexvora Systems — script.js v3
   Canvas partículas, navbar, menú, animaciones, formulario
============================================================ */

/* --- Canvas partículas --- */
function iniciarCanvas() {
    var canvas = document.getElementById('canvas-bg');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var particulas = [];
    var mouse = { x: null, y: null };

    window.addEventListener('mousemove', function(e) { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('resize', function() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; crearParticulas(); });

    function Particula() {
        this.x  = Math.random() * canvas.width;
        this.y  = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.r  = Math.random() * 1.4 + 0.4;
        this.a  = Math.random() * 0.4 + 0.15;
    }
    Particula.prototype.update = function() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
    };
    Particula.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,212,255,' + this.a + ')';
        ctx.fill();
    };

    function crearParticulas() {
        particulas = [];
        var n = Math.floor((canvas.width * canvas.height) / 15000);
        for (var i = 0; i < n; i++) particulas.push(new Particula());
    }

    function conectar() {
        var d = 110;
        for (var i = 0; i < particulas.length; i++) {
            for (var j = i + 1; j < particulas.length; j++) {
                var dx = particulas[i].x - particulas[j].x;
                var dy = particulas[i].y - particulas[j].y;
                var dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < d) {
                    ctx.beginPath();
                    ctx.moveTo(particulas[i].x, particulas[i].y);
                    ctx.lineTo(particulas[j].x, particulas[j].y);
                    ctx.strokeStyle = 'rgba(0,212,255,' + (1 - dist/d) * 0.25 + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
            if (mouse.x !== null) {
                var mdx = particulas[i].x - mouse.x;
                var mdy = particulas[i].y - mouse.y;
                var md  = Math.sqrt(mdx*mdx + mdy*mdy);
                if (md < 140) {
                    ctx.beginPath();
                    ctx.moveTo(particulas[i].x, particulas[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = 'rgba(0,212,255,' + (1 - md/140) * 0.5 + ')';
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    function animar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particulas.forEach(function(p) { p.update(); p.draw(); });
        conectar();
        requestAnimationFrame(animar);
    }
    crearParticulas();
    animar();
}

/* --- Navbar scroll --- */
function iniciarNavbar() {
    var nb = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        nb.classList.toggle('scrolled', window.scrollY > 40);
    });
}

/* --- Menú hamburguesa --- */
function iniciarMenu() {
    var btn   = document.getElementById('hamburguesa');
    var links = document.getElementById('nav-links');
    if (!btn) return;
    btn.addEventListener('click', function() { links.classList.toggle('abierto'); });
    links.querySelectorAll('.nav-link').forEach(function(l) {
        l.addEventListener('click', function() { links.classList.remove('abierto'); });
    });
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-inner')) links.classList.remove('abierto');
    });
}

/* --- Animaciones de entrada --- */
function iniciarAnimaciones() {
    var animar = function(selector, delay) {
        document.querySelectorAll(selector).forEach(function(el, i) {
            el.classList.add('animar');
            if (delay) el.classList.add('delay-' + Math.min(i+1, 4));
        });
    };
    animar('.servicio-card', true);
    animar('.porque-item', true);
    animar('.miembro-card', true);
    animar('.resena-card', true);
    animar('.seccion-header', false);
    animar('.producto-item', false);

    var hc = document.querySelector('.hero-contenido');
    if (hc) hc.classList.add('animar');

    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.animar').forEach(function(el) { el.classList.add('visible'); });
        return;
    }
    var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
            if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.animar').forEach(function(el) { obs.observe(el); });
}

/* --- Smooth scroll --- */
function iniciarScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
        a.addEventListener('click', function(e) {
            var href = a.getAttribute('href');
            if (href === '#' || !href) return;
            var dest = document.querySelector(href);
            if (!dest) return;
            e.preventDefault();
            window.scrollTo({ top: dest.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
        });
    });
}

/* --- Formulario de cita --- */
var opcionSeleccionada = 'Quiero una demo de VendeMas App';

function seleccionarOpcion(btn, texto) {
    document.querySelectorAll('.form-opcion').forEach(function(b) { b.classList.remove('activo'); });
    btn.classList.add('activo');
    opcionSeleccionada = texto;
}

function enviarWhatsApp() {
    var nombre  = document.getElementById('nombre-input').value.trim();
    var empresa = document.getElementById('empresa-input').value.trim();
    var msg = 'Hola Nexvora Systems, ';
    msg += opcionSeleccionada + '.';
    if (nombre)  msg += ' Mi nombre es ' + nombre + '.';
    if (empresa) msg += ' Mi empresa es ' + empresa + '.';
    msg += ' Quisiera más información.';
    window.open('https://wa.me/51929201444?text=' + encodeURIComponent(msg), '_blank');
}

/* --- Contador animado métricas --- */
function iniciarContadores() {
    var done = false;
    var obs  = new IntersectionObserver(function(entries) {
        if (!entries[0].isIntersecting || done) return;
        done = true;
        document.querySelectorAll('.metrica strong').forEach(function(el) {
            var txt  = el.textContent;
            var num  = parseFloat(txt.replace(/[^0-9.]/g, ''));
            var suf  = txt.replace(/[0-9.]/g, '');
            if (isNaN(num)) return;
            var t0 = null;
            function paso(t) {
                if (!t0) t0 = t;
                var p = Math.min((t - t0) / 1400, 1);
                var e = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(num * e) + suf;
                if (p < 1) requestAnimationFrame(paso);
            }
            requestAnimationFrame(paso);
        });
    }, { threshold: 0.5 });
    var m = document.querySelector('.hero-metricas');
    if (m) obs.observe(m);
}

/* --- INIT --- */
document.addEventListener('DOMContentLoaded', function() {
    iniciarCanvas();
    iniciarNavbar();
    iniciarMenu();
    iniciarAnimaciones();
    iniciarScroll();
    iniciarContadores();
});