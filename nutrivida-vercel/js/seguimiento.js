/* =====================================================
   MI SEGUIMIENTO
   Perfiles con nombre y PIN, guardados solo en este dispositivo.
   Estructura guardada:  { "nombre en minúsculas": {nombre, pin, reg: [registros]} }
   Cada registro: {f: fecha, peso, agua, fv: frutas y verduras, min: minutos}
   ===================================================== */

var CLAVE_PERFILES = 'nutrivida_perfiles';
var CLAVE_SESION = 'nutrivida_sesion';
var perfilActual = '';
try { perfilActual = sessionStorage.getItem(CLAVE_SESION) || ''; } catch (e) {}

/* --- Leer y guardar todos los perfiles --- */
function leerPerfiles() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_PERFILES) || '{}');
    } catch (e) {
        return {};
    }
}
function guardarPerfiles(perfiles) {
    try { localStorage.setItem(CLAVE_PERFILES, JSON.stringify(perfiles)); } catch (e) {}
}

/* --- Fecha de hoy con formato AAAA-MM-DD --- */
function fechaHoy() {
    return new Date().toLocaleDateString('en-CA');
}

/* --- Entrar a un perfil, o crearlo si crear es true --- */
function entrar(crear) {
    var nombre = $('#l-nombre').value.trim();
    var clave = nombre.toLowerCase();
    var pin = $('#l-pin').value;
    var perfiles = leerPerfiles();

    if (nombre.length < 2 || !/^\d{4}$/.test(pin)) {
        $('#l-error').textContent = 'Escribe un nombre de 2 o más letras y un PIN de 4 números.';
        return;
    }
    if (crear) {
        if (perfiles[clave]) {
            $('#l-error').textContent = 'Ese nombre ya existe en este dispositivo. Pulsa Entrar.';
            return;
        }
        perfiles[clave] = {nombre: nombre, pin: pin, reg: []};
        guardarPerfiles(perfiles);
    } else if (!perfiles[clave] || perfiles[clave].pin !== pin) {
        $('#l-error').textContent = 'Nombre o PIN incorrecto.';
        return;
    }

    $('#l-error').textContent = '';
    perfilActual = clave;
    try { sessionStorage.setItem(CLAVE_SESION, clave); } catch (e) {}
    $('#l-pin').value = '';
    mostrarPanel();
}

function salir() {
    perfilActual = '';
    try { sessionStorage.removeItem(CLAVE_SESION); } catch (e) {}
    mostrarPanel();
}

/* --- Muestra el login o el panel, según si hay sesión --- */
function mostrarPanel() {
    var perfil = leerPerfiles()[perfilActual];
    $('#form-login').hidden = !!perfil;
    $('#seg-panel').hidden = !perfil;
    if (!perfil) return;

    $('#saludo').textContent = 'Hola, ' + perfil.nombre;

    var hoy = {};
    for (var i = 0; i < perfil.reg.length; i++) {
        if (perfil.reg[i].f === fechaHoy()) hoy = perfil.reg[i];
    }
    var campos = $('#form-reg').elements;
    campos.peso.value = hoy.peso || '';
    campos.agua.value = hoy.agua || 0;
    campos.fv.value = hoy.fv || 0;
    campos.min.value = hoy.min || 0;

    mostrarResumen(perfil);
}

/* --- Una barra de progreso --- */
function htmlBarra(nombre, valor, meta, unidad) {
    return '<label>' + nombre + ': ' + valor + ' de ' + meta + ' ' + unidad + '<progress value="' + valor + '" max="' + meta + '"></progress></label>';
}

/* --- Gráfica de peso (línea hecha con SVG) --- */
function htmlGrafica(pesos) {
    if (pesos.length < 2) {
        return '<p class="vacio">Registra tu peso en al menos 2 días para ver tu gráfica.</p>';
    }
    var menor = pesos[0].peso, mayor = pesos[0].peso;
    for (var i = 0; i < pesos.length; i++) {
        if (pesos[i].peso < menor) menor = pesos[i].peso;
        if (pesos[i].peso > mayor) mayor = pesos[i].peso;
    }
    menor = menor - 1;
    mayor = mayor + 1;

    var puntos = '';
    var circulos = '';
    for (var j = 0; j < pesos.length; j++) {
        var x = 20 + j * (280 / (pesos.length - 1));
        var y = 100 - (pesos[j].peso - menor) / (mayor - menor) * 80;
        puntos += x + ',' + y + ' ';
        circulos += '<circle cx="' + x + '" cy="' + y + '" r="4" fill="#15325f"/>';
    }
    return '<svg viewBox="0 0 320 120" role="img" aria-label="Gráfica de tu peso"><polyline points="' + puntos + '" fill="none" stroke="#c4283f" stroke-width="3"/>' + circulos + '</svg>' +
        '<p class="vacio">De ' + pesos[0].peso + ' kg a ' + pesos[pesos.length - 1].peso + ' kg</p>';
}

/* --- Calcula y dibuja el resumen del perfil --- */
function mostrarResumen(perfil) {
    var registros = perfil.reg.slice().sort(function (a, b) {
        if (a.f < b.f) return -1;
        return 1;
    });
    var ultimos = registros.slice(-7);

    var hoy = {agua: 0, fv: 0, min: 0};
    var pesos = [];
    for (var i = 0; i < registros.length; i++) {
        if (registros[i].f === fechaHoy()) hoy = registros[i];
        if (registros[i].peso) pesos.push(registros[i]);
    }
    pesos = pesos.slice(-14);

    var sumaAgua = 0, sumaMin = 0;
    for (var j = 0; j < ultimos.length; j++) {
        sumaAgua += ultimos[j].agua;
        sumaMin += ultimos[j].min;
    }
    var promedioAgua = 0;
    if (ultimos.length > 0) promedioAgua = (sumaAgua / ultimos.length).toFixed(1);

    var cambio = '-';
    if (pesos.length > 1) {
        var dif = pesos[pesos.length - 1].peso - pesos[0].peso;
        cambio = dif.toFixed(1) + ' kg';
        if (dif > 0) cambio = '+' + cambio;
    }

    $('#seg-res').innerHTML =
        '<h3>Hoy</h3>' +
        htmlBarra('Agua', hoy.agua, META_AGUA, 'vasos') +
        htmlBarra('Frutas y verduras', hoy.fv, META_FRUTAS_VERDURAS, 'porciones') +
        htmlBarra('Movimiento', hoy.min, META_MINUTOS, 'minutos') +
        '<div class="stats">' +
        '<div><b>' + registros.length + '</b>días registrados</div>' +
        '<div><b>' + promedioAgua + '</b>vasos de agua por día (últimos 7 registros)</div>' +
        '<div><b>' + sumaMin + '</b>minutos de actividad (últimos 7 registros)</div>' +
        '<div><b>' + cambio + '</b>cambio de peso</div></div>' +
        '<h3>Evolución de tu peso</h3>' + htmlGrafica(pesos) +
        '<p class="nota-seg">Las metas son ideas de referencia, no una indicación médica.</p>';
}

/* --- Guardar el registro de hoy --- */
function guardarRegistro(evento) {
    evento.preventDefault();
    var perfiles = leerPerfiles();
    var perfil = perfiles[perfilActual];
    if (!perfil) return;

    var campos = $('#form-reg').elements;
    var peso = 0;
    if (campos.peso.value) peso = Number(campos.peso.value);
    var agua = Number(campos.agua.value) || 0;
    var fv = Number(campos.fv.value) || 0;
    var min = Number(campos.min.value) || 0;

    $('#r-ok').textContent = '';
    var pesoMal = peso !== 0 && (peso < 25 || peso > 250);
    if (pesoMal || agua < 0 || agua > 20 || fv < 0 || fv > 15 || min < 0 || min > 300) {
        $('#r-error').textContent = 'Revisa los números ingresados.';
        return;
    }
    $('#r-error').textContent = '';

    // quita el registro de hoy si ya existía y agrega el nuevo
    var otros = [];
    for (var i = 0; i < perfil.reg.length; i++) {
        if (perfil.reg[i].f !== fechaHoy()) otros.push(perfil.reg[i]);
    }
    otros.push({f: fechaHoy(), peso: peso, agua: agua, fv: fv, min: min});
    perfil.reg = otros;

    guardarPerfiles(perfiles);
    mostrarResumen(perfil);
    $('#r-ok').textContent = 'Registro guardado.';
}

/* --- Conectar los botones --- */
$('#form-login').onsubmit = function (e) { e.preventDefault(); entrar(false); };
$('#b-crear').onclick = function () { entrar(true); };
$('#b-salir').onclick = salir;
$('#b-borrar').onclick = function () {
    if (confirm('¿Borrar tu perfil y todos tus registros de este dispositivo?')) {
        var perfiles = leerPerfiles();
        delete perfiles[perfilActual];
        guardarPerfiles(perfiles);
        salir();
    }
};
$('#form-reg').onsubmit = guardarRegistro;

mostrarPanel();
