/* =====================================================
   MI AUTOVALORACIÓN
   Calcula el IMC y las calorías, y muestra el resultado.
   Los textos y números están en datos.js
   ===================================================== */

var CLAVE_VALORACION = 'nutrivida_valoracion';
var formVal = $('#form-val');
var resultado = $('#resultado');

/* --- IMC = peso (kg) dividido entre la talla (m) al cuadrado --- */
function calcularIMC(peso, talla) {
    var metros = talla / 100;
    return peso / (metros * metros);
}

/* --- Categoría del IMC (cortes de la OMS para adultos) --- */
function clasificarIMC(imc, edad) {
    if (edad < EDAD_ADULTO) return 'menor';
    if (imc < 18.5) return 'bajo';
    if (imc < 25) return 'normal';
    if (imc < 30) return 'sobrepeso';
    return 'obesidad';
}

/* --- Calorías al día: ecuación de Mifflin-St Jeor por el factor de actividad --- */
function calcularKcal(peso, talla, edad, sexo, actividad) {
    var base = 10 * peso + 6.25 * talla - 5 * edad;
    if (sexo === 'm') {
        base = base + 5;
    } else {
        base = base - 161;
    }
    return Math.round(base * FACTOR_ACTIVIDAD[actividad] / 10) * 10;
}

/* --- Busca el emoji de un alimento --- */
function emojiDe(nombre) {
    for (var i = 0; i < ALIMENTOS.length; i++) {
        if (ALIMENTOS[i].nombre.indexOf(nombre) === 0) {
            return ALIMENTOS[i].emoji;
        }
    }
    return '🍽️';
}

/* --- Lista de alimentos bolivianos recomendados --- */
function htmlRecomendados(d, categoria) {
    var clave = categoria;
    if (categoria === 'obesidad') clave = 'sobrepeso';
    var lista = RECOMENDADOS[clave].slice();

    if (d.act >= 2) {
        var yaEsta = false;
        for (var i = 0; i < lista.length; i++) {
            if (lista[i].alimento === EXTRA_ENTRENA.alimento) yaEsta = true;
        }
        if (!yaEsta) lista.splice(1, 0, EXTRA_ENTRENA);
    }
    lista = lista.slice(0, 5);

    var html = '<h4>Alimentos bolivianos para ti</h4><div class="recom">';
    for (var j = 0; j < lista.length; j++) {
        html += '<div><span>' + emojiDe(lista[j].alimento) + '</span><div><b>' + lista[j].alimento + '</b><p>' + lista[j].razon + '</p></div></div>';
    }
    html += '</div>';

    html += '<h4>Ejemplo de un día</h4><ul class="menu">';
    for (var k = 0; k < REPARTO.length; k++) {
        html += '<li><b>' + REPARTO[k][0] + ':</b> ' + REPARTO[k][3];
        if (d.edad >= EDAD_ADULTO) {
            html += ' <small>(unas ' + (Math.round(d.kcal * REPARTO[k][1] / 10) * 10) + ' kcal)</small>';
        }
        html += '</li>';
    }
    html += '</ul><p class="nota">Ideas generales, no una dieta personalizada. <a href="#alimentos">Ver todos los alimentos</a></p>';
    return html;
}

/* --- Gráfico circular de calorías --- */
function htmlDonut(kcal) {
    var colores = '';
    var lista = '';
    var desde = 0;
    for (var i = 0; i < REPARTO.length; i++) {
        var hasta = desde + REPARTO[i][1] * 100;
        if (i > 0) colores += ', ';
        colores += 'var(' + REPARTO[i][2] + ') ' + desde + '% ' + hasta + '%';
        lista += '<li><i style="background:var(' + REPARTO[i][2] + ')"></i>' + REPARTO[i][0] + ': ' + (Math.round(kcal * REPARTO[i][1] / 10) * 10) + ' kcal</li>';
        desde = hasta;
    }
    return '<div class="donut-wrap"><div class="donut-box"><div class="donut" style="background:conic-gradient(' + colores + ')"></div>' +
        '<span><b>' + kcal + '</b>kcal al día</span></div><ul class="comidas">' + lista + '</ul></div>' +
        '<p class="nota">Cálculo aproximado y distribución orientativa.</p>';
}

/* --- Dibuja todo el resultado --- */
function mostrarResultado(d) {
    var adulto = d.edad >= EDAD_ADULTO;
    var categoria = clasificarIMC(d.imc, d.edad);

    var posicion = (d.imc - 15) / 25 * 100;
    if (posicion < 2) posicion = 2;
    if (posicion > 98) posicion = 98;

    var titulo = 'Requiere interpretación según tu edad';
    if (adulto) titulo = NOMBRE_IMC[categoria];

    var html = '<div class="imc"><span class="num">' + d.imc.toFixed(1) + '</span><div><b>Tu IMC</b><br>' + titulo + '</div></div>';

    if (adulto) {
        html += '<div class="gauge"><i style="left:' + posicion + '%"></i></div>';
        html += '<div class="escala"><span>Bajo</span><span>Normal</span><span>Sobrepeso</span><span>Obesidad</span></div>';
        html += htmlDonut(d.kcal);
    }

    html += htmlRecomendados(d, categoria);

    html += '<div class="tips">';
    var consejos = CONSEJOS[categoria].concat([CONSEJO_ACTIVIDAD[d.act]]);
    for (var i = 0; i < consejos.length; i++) {
        html += '<p>' + consejos[i] + '</p>';
    }
    html += '</div>';

    html += '<p class="nota">Orientación educativa. No es un diagnóstico.</p>';
    html += '<p class="guardado">Guardado solo en este dispositivo (' + d.fecha + '). <button type="button" id="borrar">Borrar mis datos</button></p>';

    resultado.hidden = false;
    resultado.innerHTML = html;

    $('#borrar').onclick = function () {
        try { localStorage.removeItem(CLAVE_VALORACION); } catch (e) {}
        formVal.reset();
        resultado.hidden = true;
    };
}

/* --- Cuando la persona pulsa "Ver mi resultado" --- */
formVal.onsubmit = function (evento) {
    evento.preventDefault();
    var campos = formVal.elements;
    var edad = Number(campos.edad.value);
    var peso = Number(campos.peso.value);
    var talla = Number(campos.talla.value);

    var datosOk = edad >= 10 && edad <= 100 && peso >= 25 && peso <= 250 && talla >= 120 && talla <= 230;
    if (!datosOk) {
        $('#error').textContent = 'Revisa los datos: edad de 10 a 100, peso de 25 a 250 kg, talla de 120 a 230 cm.';
        return;
    }
    $('#error').textContent = '';

    var actividad = Number(campos.act.value);
    var datos = {
        edad: edad,
        sexo: campos.sexo.value,
        peso: peso,
        talla: talla,
        act: actividad,
        imc: calcularIMC(peso, talla),
        kcal: calcularKcal(peso, talla, edad, campos.sexo.value, actividad),
        fecha: new Date().toLocaleDateString('es-BO')
    };

    try { localStorage.setItem(CLAVE_VALORACION, JSON.stringify(datos)); } catch (e) {}
    mostrarResultado(datos);
    resultado.scrollIntoView({behavior: 'smooth', block: 'nearest'});
};

/* --- Al abrir la página: recupera la última valoración guardada --- */
try {
    var guardado = JSON.parse(localStorage.getItem(CLAVE_VALORACION) || 'null');
    if (guardado) {
        formVal.elements.edad.value = guardado.edad;
        formVal.elements.sexo.value = guardado.sexo;
        formVal.elements.peso.value = guardado.peso;
        formVal.elements.talla.value = guardado.talla;
        formVal.elements.act.value = guardado.act;
        mostrarResultado(guardado);
    }
} catch (e) {}
