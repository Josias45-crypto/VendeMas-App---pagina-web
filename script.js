/* --- Sistema solar animado --- */
function iniciarCanvas() {
    var canvas = document.getElementById('canvas-bg');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H, cx, cy;

    function resize() {
        W  = canvas.width  = window.innerWidth;
        H  = canvas.height = window.innerHeight;
        cx = W * 0.72;
        cy = H * 0.48;
    }
    resize();
    window.addEventListener('resize', resize);

    /* ── Planetas ──────────────────────────────────────────────
       vel: radianes por frame  (a 60fps: 0.022 ≈ 1 órbita en 4.8s)
       Planeta 1 — rápido   →  1 vuelta en ~7 s
       Planeta 2 — medio    →  1 vuelta en ~11 s
       Planeta 3 — lento    →  1 vuelta en ~21 s            */
    var planetas = [
        { orbita: 90,  vel: 0.015, ang: 0,                    size: 5, color: [  0, 212, 255], alpha: 0.90 },
        { orbita: 155, vel: 0.009, ang: (Math.PI * 2) / 3,    size: 8, color: [ 51, 223, 255], alpha: 0.75 },
        { orbita: 230, vel: 0.005, ang: (Math.PI * 4) / 3,    size: 6, color: [  0, 153, 187], alpha: 0.60 }
    ];

    /* estrellas de fondo — 120 partículas, opacidad 0.15–0.40 */
    var estrellas = [];
    for (var i = 0; i < 120; i++) {
        estrellas.push({
            fx: Math.random(), fy: Math.random(),
            r:  Math.random() * 0.8 + 0.2,
            o:  Math.random() * 0.25 + 0.15,
            fase: Math.random() * Math.PI * 2
        });
    }

    var t = 0;

    /* ── helpers ── */
    function rgba(c, a) {
        return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a.toFixed(3) + ')';
    }

    /* ── dibujado ── */
    function drawGradiente() {
        var gx = W * 0.72, gy = H * 0.45;
        var grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, W * 0.38);
        grad.addColorStop(0, 'rgba(0,212,255,0.04)');
        grad.addColorStop(1, 'rgba(0,212,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
    }

    function drawEstrellas() {
        for (var i = 0; i < estrellas.length; i++) {
            var s = estrellas[i];
            var brillo = s.o + 0.07 * Math.sin(t * 1.1 + s.fase);
            ctx.beginPath();
            ctx.arc(s.fx * W, s.fy * H, s.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0,212,255,' + brillo.toFixed(3) + ')';
            ctx.fill();
        }
    }

    function drawConexiones() {
        var umbral = 110;
        ctx.lineWidth = 0.5;
        for (var i = 0; i < estrellas.length - 1; i++) {
            var ax = estrellas[i].fx * W;
            var ay = estrellas[i].fy * H;
            for (var j = i + 1; j < estrellas.length; j++) {
                var bx = estrellas[j].fx * W;
                var by = estrellas[j].fy * H;
                var dx = ax - bx, dy = ay - by;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < umbral) {
                    var a = (0.15 * (1 - dist / umbral)).toFixed(3);
                    ctx.beginPath();
                    ctx.moveTo(ax, ay);
                    ctx.lineTo(bx, by);
                    ctx.strokeStyle = 'rgba(0,212,255,' + a + ')';
                    ctx.stroke();
                }
            }
        }
    }

    function drawOrbitas() {
        ctx.setLineDash([4, 8]);
        ctx.lineWidth = 0.6;
        for (var i = 0; i < planetas.length; i++) {
            var p = planetas[i];
            ctx.beginPath();
            ctx.arc(cx, cy, p.orbita, 0, Math.PI * 2);
            ctx.strokeStyle = rgba(p.color, p.alpha * 0.22);
            ctx.stroke();
        }
        ctx.setLineDash([]);
    }

    function drawNucleo() {
        /* halo */
        var halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, 38);
        halo.addColorStop(0,   'rgba(0,212,255,0.35)');
        halo.addColorStop(0.5, 'rgba(0,212,255,0.10)');
        halo.addColorStop(1,   'rgba(0,212,255,0)');
        ctx.beginPath();
        ctx.arc(cx, cy, 38, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        /* núcleo */
        var g = ctx.createRadialGradient(cx - 3, cy - 3, 1, cx, cy, 13);
        g.addColorStop(0,   '#ffffff');
        g.addColorStop(0.3, '#00D4FF');
        g.addColorStop(1,   'rgba(0,130,180,0)');
        ctx.beginPath();
        ctx.arc(cx, cy, 13, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        /* destello en cruz */
        var pulso = 0.18 + 0.08 * Math.sin(t * 2.5);
        ctx.save();
        ctx.globalAlpha = pulso;
        ctx.strokeStyle = '#00D4FF';
        ctx.lineWidth = 1;
        for (var a = 0; a < Math.PI; a += Math.PI / 4) {
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(a) * 15, cy + Math.sin(a) * 15);
            ctx.lineTo(cx + Math.cos(a) * 34, cy + Math.sin(a) * 34);
            ctx.stroke();
        }
        ctx.restore();
    }

    function drawPlaneta(p) {
        var px = cx + Math.cos(p.ang) * p.orbita;
        var py = cy + Math.sin(p.ang)  * p.orbita;

        /* halo */
        var hp = ctx.createRadialGradient(px, py, 0, px, py, p.size * 2.4);
        hp.addColorStop(0, rgba(p.color, p.alpha * 0.6));
        hp.addColorStop(1, rgba(p.color, 0));
        ctx.beginPath();
        ctx.arc(px, py, p.size * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = hp;
        ctx.fill();

        /* cuerpo */
        var gp = ctx.createRadialGradient(px - p.size * 0.3, py - p.size * 0.3, 0.5, px, py, p.size);
        gp.addColorStop(0,   '#ffffff');
        gp.addColorStop(0.4, rgba(p.color, 1));
        gp.addColorStop(1,   rgba(p.color, 0.6));
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = gp;
        ctx.fill();

        p.ang += p.vel;
    }

    /* ── loop principal ── */
    function loop() {
        ctx.clearRect(0, 0, W, H);
        drawGradiente();
        drawEstrellas();
        drawConexiones();
        drawOrbitas();
        drawNucleo();
        for (var i = 0; i < planetas.length; i++) drawPlaneta(planetas[i]);
        t += 0.016;
        requestAnimationFrame(loop);
    }
    loop();
}

/* --- Navbar scroll + hamburguesa --- */
function iniciarNavbar() {
    var navbar      = document.getElementById('navbar');
    var hamburguesa = document.getElementById('hamburguesa');
    var navLinks    = document.getElementById('nav-links');

    window.addEventListener('scroll', function() {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
    });

    if (hamburguesa && navLinks) {
        hamburguesa.addEventListener('click', function() {
            navLinks.classList.toggle('abierto');
            var abierto = navLinks.classList.contains('abierto');
            hamburguesa.setAttribute('aria-expanded', abierto);
        });
        navLinks.querySelectorAll('.nav-link').forEach(function(link) {
            link.addEventListener('click', function() {
                navLinks.classList.remove('abierto');
                hamburguesa.setAttribute('aria-expanded', 'false');
            });
        });
        /* cerrar al hacer clic fuera */
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target)) {
                navLinks.classList.remove('abierto');
                hamburguesa.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

/* alias requerido por el usuario */
function iniciarMenu() { iniciarNavbar(); }

/* --- Animaciones fade-in al hacer scroll --- */
function iniciarAnimaciones() {
    var elementos = document.querySelectorAll(
        '.seccion-header, .servicio-card, .producto-item, .porque-item, ' +
        '.miembro-card, .nosotros-inner, .agendar-contenido, ' +
        '.producto-proximo, .confianza'
    );

    elementos.forEach(function(el) {
        el.classList.add('anim-oculto');
    });

    var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('anim-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    elementos.forEach(function(el) { obs.observe(el); });
}

/* --- Smooth scroll JS (complementa CSS scroll-behavior) --- */
function iniciarSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(enlace) {
        enlace.addEventListener('click', function(e) {
            var id = enlace.getAttribute('href');
            if (id === '#') return;
            var destino = document.querySelector(id);
            if (!destino) return;
            e.preventDefault();
            destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

/* --- Formulario WhatsApp --- */
var opcionSeleccionada = 'Quiero una demo de VendeMas App';

function seleccionarOpcion(btn, texto) {
    opcionSeleccionada = texto;
    document.querySelectorAll('.form-opcion').forEach(function(b) {
        b.classList.remove('activo');
    });
    btn.classList.add('activo');
}

function enviarWhatsApp() {
    var nombre  = (document.getElementById('nombre-input')  || {}).value || '';
    var empresa = (document.getElementById('empresa-input') || {}).value || '';
    if (!nombre.trim()) {
        var input = document.getElementById('nombre-input');
        if (input) { input.focus(); input.style.borderColor = 'var(--cyan)'; }
        return;
    }
    var msg = opcionSeleccionada;
    msg += '. Mi nombre es ' + nombre.trim();
    if (empresa.trim()) msg += ', de ' + empresa.trim();
    msg += '.';
    window.open('https://wa.me/51929201444?text=' + encodeURIComponent(msg), '_blank');
}

/* --- Cursor personalizado --- */
function iniciarCursor() {
    var outer = document.getElementById('cursorOuter');
    var inner = document.getElementById('cursorInner');
    if (!outer || !inner) return;

    /* ocultar hasta que el mouse se mueva por primera vez */
    outer.style.opacity = '0';
    inner.style.opacity = '0';

    var ox = -100, oy = -100, ix = -100, iy = -100, iniciado = false;

    document.addEventListener('mousemove', function(e) {
        ix = e.clientX; iy = e.clientY;
        inner.style.left = ix + 'px';
        inner.style.top  = iy + 'px';
        if (!iniciado) {
            ox = ix; oy = iy;
            outer.style.opacity = '1';
            inner.style.opacity = '1';
            iniciado = true;
        }
    });

    function animOuter() {
        ox += (ix - ox) * 0.12;
        oy += (iy - oy) * 0.12;
        outer.style.left = ox + 'px';
        outer.style.top  = oy + 'px';
        requestAnimationFrame(animOuter);
    }
    animOuter();

    document.addEventListener('mouseleave', function() {
        outer.style.opacity = '0';
        inner.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function() {
        if (iniciado) {
            outer.style.opacity = '1';
            inner.style.opacity = '1';
        }
    });
}

/* --- Slider de reseñas --- */
function iniciarSlider() {
    var track  = document.getElementById('sliderTrack');
    var prev   = document.getElementById('sliderPrev');
    var next   = document.getElementById('sliderNext');
    var dots   = document.querySelectorAll('.slider__dot');
    if (!track) return;

    var total    = track.children.length;
    var actual   = 0;
    var intervalo = null;

    function ir(n) {
        actual = (n + total) % total;
        track.style.transform = 'translateX(-' + (actual * 100) + '%)';
        dots.forEach(function(d, i) {
            d.classList.toggle('slider__dot--active', i === actual);
        });
    }

    function reiniciarAutoplay() {
        clearInterval(intervalo);
        intervalo = setInterval(function() { ir(actual + 1); }, 6000);
    }

    if (prev) prev.addEventListener('click', function() { ir(actual - 1); reiniciarAutoplay(); });
    if (next) next.addEventListener('click', function() { ir(actual + 1); reiniciarAutoplay(); });
    dots.forEach(function(d) {
        d.addEventListener('click', function() {
            ir(parseInt(d.getAttribute('data-index')));
            reiniciarAutoplay();
        });
    });

    /* swipe táctil */
    var startX = 0;
    track.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function(e) {
        var diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { ir(diff > 0 ? actual + 1 : actual - 1); reiniciarAutoplay(); }
    }, { passive: true });

    reiniciarAutoplay();
}

/* --- Contadores animados con data-target --- */
function iniciarContadoresV2() {
    var done = false;
    var els  = document.querySelectorAll('[data-target]');
    if (!els.length) return;

    var obs = new IntersectionObserver(function(entries) {
        if (!entries[0].isIntersecting || done) return;
        done = true;
        els.forEach(function(el) {
            var target = parseInt(el.getAttribute('data-target'));
            var t0 = null;
            function paso(t) {
                if (!t0) t0 = t;
                var p = Math.min((t - t0) / 1400, 1);
                var e = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(target * e);
                if (p < 1) requestAnimationFrame(paso);
            }
            requestAnimationFrame(paso);
        });
    }, { threshold: 0.4 });

    var m = document.querySelector('.hero-metricas');
    if (m) obs.observe(m);
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarCanvas();
    iniciarNavbar();
    iniciarAnimaciones();
    iniciarSmoothScroll();
    iniciarCursor();
    iniciarSlider();
    iniciarContadoresV2();
});
