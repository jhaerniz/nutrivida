/* =====================================================
   DATOS Y TEXTOS DE LA PÁGINA
   Aquí está todo lo que se puede cambiar sin tocar la lógica:
   números de los cálculos, metas, alimentos y textos.
   ===================================================== */

/* Ayudante para buscar un elemento de la página por su selector */
function $(selector) {
    return document.querySelector(selector);
}

/* ---------- NÚMEROS DE LOS CÁLCULOS ---------- */
var EDAD_ADULTO = 18;                          // desde esta edad se clasifica el IMC (OMS)
var FACTOR_ACTIVIDAD = [1.2, 1.375, 1.55, 1.725]; // multiplica las calorías según el movimiento
var META_AGUA = 8;                             // vasos al día
var META_FRUTAS_VERDURAS = 5;                  // porciones al día (OMS: 400 g)
var META_MINUTOS = 30;                         // minutos de actividad al día

/* Reparto de las calorías del día: [nombre, porcentaje, color, ejemplo de comida] */
var REPARTO = [
    ['Desayuno',   0.25, '--oro',    'pito de cañahua con leche y una fruta.'],
    ['Almuerzo',   0.35, '--verde',  'sopa de quinua con verduras, y de segundo papa cocida con haba.'],
    ['Cena',       0.25, '--rojo',   'ensalada de tarwi, choclo y verduras.'],
    ['Colaciones', 0.15, '--morado', 'una fruta de temporada o amaranto inflado.']
];

/* ---------- ALIMENTOS (la foto va en la carpeta img con el nombre "archivo".jpg) ---------- */
var ALIMENTOS = [
    {nombre: 'Quinua', emoji: '🌾', archivo: 'quinua', descripcion: 'Grano andino de sabor suave, con proteína y fibra.', uso: 'Sopas, graneado, jugos o en lugar del arroz.'},
    {nombre: 'Cañahua', emoji: '🌱', archivo: 'canahua', descripcion: 'Grano pequeño de los Andes, base de pitos y harinas.', uso: 'Pito con leche, mezclado en panes y galletas caseras.'},
    {nombre: 'Amaranto (kiwicha)', emoji: '🌺', archivo: 'amaranto', descripcion: 'Grano de color claro que se infla fácilmente.', uso: 'Amaranto inflado con frutas o yogur, o en sopas.'},
    {nombre: 'Papa', emoji: '🥔', archivo: 'papa', descripcion: 'Tubérculo andino con cientos de variedades y mucha energía.', uso: 'Cocida, en sopa o al horno, mejor que frita.'},
    {nombre: 'Maíz', emoji: '🌽', archivo: 'maiz', descripcion: 'Cereal presente en choclos, mote y muchas preparaciones.', uso: 'Choclo con queso, mote, sopas y humintas.'},
    {nombre: 'Haba', emoji: '🫘', archivo: 'haba', descripcion: 'Legumbre con proteína y fibra, de las más comunes en el altiplano.', uso: 'Hervida, en ensaladas o en guisos con papa.'},
    {nombre: 'Frutas', emoji: '🍎', archivo: 'frutas', descripcion: 'Aportan color, vitaminas y variedad según la temporada.', uso: 'Enteras de postre o de colación, en lugar de dulces.'},
    {nombre: 'Verduras', emoji: '🥕', archivo: 'verduras', descripcion: 'Zanahoria, tomate, cebolla, lechuga y más en cada comida.', uso: 'Medio plato de verduras en almuerzo y cena.'},
    {nombre: 'Tarwi', emoji: '🌼', archivo: 'tarwi', descripcion: 'Legumbre andina rica en proteína que se consume desamargada.', uso: 'Ceviche de tarwi, ensaladas y salsas. Necesita desamargado previo.'}
];

/* ---------- PLATO DE COLORES (texto al tocar cada color) ---------- */
var PLATO = {
    granos: 'Quinua, cañahua, amaranto, papa, maíz y mote. Aportan energía: alterna variedades.',
    verduras: 'Zanahoria, tomate, cebolla, lechuga, locoto y más. Intenta llenar medio plato.',
    frutas: 'Plátano, naranja, mandarina, manzana y las de temporada. Mejor enteras que en jugo.',
    legumbres: 'Haba, tarwi, arveja, lentejas, huevo, queso y carnes. Aportan proteínas.'
};

/* ---------- ACTIVIDAD FÍSICA ---------- */
var NIVELES_ACTIVIDAD = [
    {nombre: 'Suave', ejercicios: ['Caminar 20 a 30 minutos', 'Estiramientos al despertar', 'Subir escaleras en vez de ascensor', 'Bailar una canción completa']},
    {nombre: 'Moderado', ejercicios: ['Trote suave o caminata rápida', 'Saltar la cuerda por intervalos', 'Fútbol o básquet recreativo', 'Paseo en bicicleta']},
    {nombre: 'Activo', ejercicios: ['Circuito: sentadillas, flexiones y plancha', 'Intervalos de carrera corta', 'Ejercicios con el peso del cuerpo', 'Deporte en equipo con regularidad']}
];

/* ---------- RESULTADO DE LA VALORACIÓN ---------- */
var NOMBRE_IMC = {
    bajo: 'Por debajo del rango habitual',
    normal: 'En el rango habitual',
    sobrepeso: 'Sobrepeso',
    obesidad: 'Obesidad'
};

var CONSEJOS = {
    bajo: ['Suma comidas nutritivas: quinua con huevo o queso, tarwi, habas y papa.', 'Come 4 o 5 veces al día y agrega frutas como colación.'],
    normal: ['Mantén la variedad: alterna quinua, cañahua, maíz, papa y verduras de colores.', 'Conserva tu rutina de movimiento y toma agua durante el día.'],
    sobrepeso: ['Prefiere sopas, ensaladas y granos andinos; reduce frituras y bebidas azucaradas.', 'Camina a diario y aumenta el tiempo de movimiento poco a poco.'],
    obesidad: ['Empieza con cambios pequeños: más verduras, menos frituras y gaseosas.', 'Consulta a un profesional de salud para un plan hecho a tu medida.'],
    menor: ['En menores de 18 años el IMC se interpreta con tablas por edad y sexo; pide a un profesional que lo revise.', 'Mientras tanto: come variado, toma agua y busca movimiento a diario.']
};

/* Consejo según cuánto se mueve la persona (0 = casi nada ... 3 = mucho) */
var CONSEJO_ACTIVIDAD = [
    'Empieza con 10 a 15 minutos de caminata diaria y súbelos poco a poco.',
    'Ya te mueves un poco: intenta sumar un día más de actividad por semana.',
    'Buen nivel de actividad: cuida el descanso y la hidratación.',
    'Nivel muy activo: recupera con buen descanso y comidas completas.'
];

/* Alimentos bolivianos recomendados según el resultado (se muestran hasta 5) */
var RECOMENDADOS = {
    bajo: [
        {alimento: 'Quinua', razon: 'Con huevo o queso suma proteína y energía a tus comidas.'},
        {alimento: 'Tarwi', razon: 'Legumbre rica en proteína para ensaladas y salsas.'},
        {alimento: 'Haba', razon: 'Aporta proteína y fibra; combínala con papa.'},
        {alimento: 'Papa', razon: 'Fuente de energía: cocida o al horno, con queso.'},
        {alimento: 'Frutas', razon: 'Plátano o mandarina de colación entre comidas.'}
    ],
    normal: [
        {alimento: 'Quinua', razon: 'Alterna con el arroz para variar tu plato.'},
        {alimento: 'Cañahua', razon: 'Prueba el pito con leche en el desayuno.'},
        {alimento: 'Maíz', razon: 'Choclo o mote como acompañante.'},
        {alimento: 'Verduras', razon: 'Medio plato de colores en almuerzo y cena.'},
        {alimento: 'Frutas', razon: 'De postre o colación, mejor enteras.'}
    ],
    sobrepeso: [
        {alimento: 'Verduras', razon: 'Llena medio plato: dan volumen con pocas calorías.'},
        {alimento: 'Quinua', razon: 'En sopas o graneado, en porciones moderadas.'},
        {alimento: 'Haba', razon: 'Su fibra ayuda a sentirte satisfecho; hervida o en ensalada.'},
        {alimento: 'Cañahua', razon: 'Pito sin azúcar agregada, a media mañana o en el desayuno.'},
        {alimento: 'Frutas', razon: 'Enteras, en lugar de dulces o jugos azucarados.'}
    ],
    menor: [
        {alimento: 'Quinua', razon: 'En sopas o con verduras, varias veces por semana.'},
        {alimento: 'Haba', razon: 'Hervida o en guisos con papa.'},
        {alimento: 'Frutas', razon: 'Una o dos al día, de temporada.'},
        {alimento: 'Verduras', razon: 'Que no falten en el almuerzo.'},
        {alimento: 'Maíz', razon: 'Choclo, mote o humintas como acompañante.'}
    ]
};
/* Si entrena bastante se agrega este alimento a la lista */
var EXTRA_ENTRENA = {alimento: 'Maíz', razon: 'Aporta energía para tus días de entrenamiento: choclo, mote o humintas.'};
