/* =====================================================
   EXTRAS DE LA PÁGINA
   Alimentos, actividad física, plato de colores,
   menú del celular, aparición suave y modo sin internet.
   ===================================================== */

/* ---------- ALIMENTOS: crea una tarjeta por cada alimento de datos.js ---------- */
function crearAlimentos() {
    var html = '';
    for (var i = 0; i < ALIMENTOS.length; i++) {
        var a = ALIMENTOS[i];
        html += '<article class="alimento">' +
            '<div class="foto" data-e="' + a.emoji + '"><img src="img/' + a.archivo + '.jpg" alt="' + a.nombre + '" loading="lazy" onerror="this.remove()"></div>' +
            '<div class="info"><h3>' + a.nombre + '</h3><p>' + a.descripcion + '</p>' +
            '<p class="uso"><b>Cómo usarla:</b> ' + a.uso + '</p></div></article>';
    }
    $('#grid-alimentos').innerHTML = html;
}
crearAlimentos();

/* ---------- ACTIVIDAD FÍSICA: botones Suave / Moderado / Activo ---------- */
var contenedorTabs = $('#tabs');
var panelActividad = $('#panel');

function mostrarNivel(numero) {
    for (var i = 0; i < contenedorTabs.children.length; i++) {
        contenedorTabs.children[i].setAttribute('aria-selected', i === numero);
    }
    var html = '';
    var ejercicios = NIVELES_ACTIVIDAD[numero].ejercicios;
    for (var j = 0; j < ejercicios.length; j++) {
        html += '<div>' + ejercicios[j] + '</div>';
    }
    panelActividad.innerHTML = html;
}

function crearBotonNivel(numero) {
    var boton = document.createElement('button');
    boton.type = 'button';
    boton.setAttribute('role', 'tab');
    boton.textContent = NIVELES_ACTIVIDAD[numero].nombre;
    boton.onclick = function () { mostrarNivel(numero); };
    contenedorTabs.appendChild(boton);
}
for (var n = 0; n < NIVELES_ACTIVIDAD.length; n++) {
    crearBotonNivel(n);
}
mostrarNivel(0);

/* ---------- PLATO DE COLORES: al tocar un color se muestran ejemplos ---------- */
var botonesPlato = document.querySelectorAll('.leyenda button');

function elegirColor(boton) {
    for (var i = 0; i < botonesPlato.length; i++) {
        botonesPlato[i].setAttribute('aria-pressed', botonesPlato[i] === boton);
    }
    $('#plato-info').textContent = PLATO[boton.getAttribute('data-k')];
}
for (var p = 0; p < botonesPlato.length; p++) {
    botonesPlato[p].onclick = function () { elegirColor(this); };
}

/* ---------- MENÚ DEL CELULAR ---------- */
var botonMenu = $('#burger');
var menu = $('#menu');

function abrirCerrarMenu() {
    var abierto = menu.classList.toggle('abierto');
    botonMenu.setAttribute('aria-expanded', abierto);
}
function cerrarMenu() {
    menu.classList.remove('abierto');
    botonMenu.setAttribute('aria-expanded', false);
}
botonMenu.onclick = abrirCerrarMenu;
var enlacesMenu = menu.querySelectorAll('a');
for (var m = 0; m < enlacesMenu.length; m++) {
    enlacesMenu[m].onclick = cerrarMenu;
}

/* ---------- APARICIÓN SUAVE AL BAJAR (una sola vez) ---------- */
if ('IntersectionObserver' in window) {
    var observador = new IntersectionObserver(function (entradas) {
        for (var i = 0; i < entradas.length; i++) {
            if (entradas[i].isIntersecting) {
                entradas[i].target.classList.add('vis');
                observador.unobserve(entradas[i].target);
            }
        }
    }, {threshold: 0.15});

    var elementos = document.querySelectorAll('.cab, .alimento, .hab div');
    for (var e = 0; e < elementos.length; e++) {
        elementos[e].classList.add('rev');
        observador.observe(elementos[e]);
    }
}

/* ---------- MODO SIN INTERNET (solo cuando la página está publicada en https) ---------- */
if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
}
