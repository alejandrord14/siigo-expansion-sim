// Generador de clientes sintéticos para simular una cartera de un ERP/contable
// (tipo Siigo) y priorizar el siguiente módulo a ofrecer a cada uno.

function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SEED = 42;
const rng = mulberry32(SEED);

// Uniforme, sin sesgo.
function randRange(min, max) {
  return min + rng() * (max - min);
}

// Sesga hacia el mínimo: útil para variables donde "bajo es mejor"
// (variabilidad de uso, días de inactividad).
function skewLow(min, max, n = 2) {
  return min + Math.pow(rng(), n) * (max - min);
}

// Sesga hacia el máximo: útil para variables donde "alto es mejor"
// (actividad reciente).
function skewHigh(min, max, n = 2) {
  return max - Math.pow(rng(), n) * (max - min);
}

function shuffle(array) {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const CUSTOMER_NAMES = [
  // Tecnología
  'NimbusTech', 'CodeAndes', 'Vórtice Digital', 'Pixel Sur', 'DataLoom México', 'ClaridAI', 'Rutas Cloud', 'Byte Cordillera',
  // Textiles
  'Textiles del Valle', 'Hilos Andinos', 'Manufacturas Cuzco', 'Algodón & Trama', 'Telar Bogotá', 'Fibra Austral',
  // Agencias
  'Agencia Norte Sur', 'Estudio Malbec', 'Creativos del Río', 'Agencia Pampa', 'Impacto Andino', 'Bravo Comunicación',
  // Distribuidoras
  'Distribuidora Central Andes', 'Comercial Aconcagua', 'Distribuciones El Faro', 'Mayorista Guadalupe', 'Distribuidora Costa Verde', 'Suministros Patagonia',
  // Constructoras
  'Constructora Altiplano', 'Grupo Edifica', 'Obras del Pacífico', 'Constructora Meridiano', 'Ingeniería Cordillera', 'Edificaciones Sureste',
  // Bufetes de abogados
  'Bufete Reyes & Asociados', 'Legal Andes', 'Consultores Jurídicos del Valle', 'Abogados Montecristo', 'Bufete Zamora Ríos', 'Estudio Legal Austral',
  // Otros rubros
  'Logística Nortesur', 'Grupo Gastronómico Cielo', 'Clínica Vitalis', 'Café Andino Export', 'Transportes Sierra Madre', 'Farmacéutica Cruz del Sur',
];

// Orden típico de adopción: casi todo cliente entra por contabilidad y desde
// ahí se le ofrecen los módulos siguientes en este orden.
const MODULES = ['contabilidad', 'facturacion', 'nomina', 'pagos', 'fiscal'];

const MODULE_LABELS = {
  contabilidad: 'Contabilidad',
  facturacion: 'Facturación electrónica',
  nomina: 'Nómina',
  pagos: 'Pagos',
  fiscal: 'Fiscal',
};

const COUNTRIES = ['Colombia', 'México', 'Ecuador', 'Chile'];

const SIZES = ['micro', 'pequena', 'mediana', 'grande'];

const SIZE_LABELS = {
  micro: 'Micro',
  pequena: 'Pequeña',
  mediana: 'Mediana',
  grande: 'Grande',
};

function pickCurrentModules() {
  const optional = shuffle(MODULES.filter((m) => m !== 'contabilidad'));
  const extraCount = Math.floor(skewLow(0, 4.999, 1.6));
  const picked = new Set(['contabilidad', ...optional.slice(0, extraCount)]);
  return MODULES.filter((m) => picked.has(m));
}

function nextModuleFor(currentModules) {
  return MODULES.find((m) => !currentModules.includes(m)) || null;
}

function pickCompanySize() {
  const roll = rng();
  if (roll < 0.40) return 'micro';
  if (roll < 0.72) return 'pequena';
  if (roll < 0.92) return 'mediana';
  return 'grande';
}

function pickCountry() {
  return COUNTRIES[Math.floor(rng() * COUNTRIES.length)];
}

function pickSupportAlert() {
  const roll = rng();
  if (roll < 0.02) return 'alta';
  if (roll < 0.10) return 'media';
  return 'ninguna';
}

function pickUsageDataAvailable() {
  return rng() < 0.88;
}

function generateCustomer(id, name) {
  const current_modules = pickCurrentModules();

  return {
    id,
    name,
    months_active: Math.round(randRange(2, 42)),
    current_modules,
    next_module: nextModuleFor(current_modules),
    activity_level: Number(skewHigh(20, 100, 2).toFixed(1)),
    days_since_last_use: Math.round(skewLow(0, 45, 2.5)),
    usage_variability: Number(skewLow(5, 50, 2).toFixed(1)),
    company_size: pickCompanySize(),
    country: pickCountry(),
    support_alert: pickSupportAlert(),
    usage_data_available: pickUsageDataAvailable(),
  };
}

function generateCustomers(count = 30) {
  const names = shuffle(CUSTOMER_NAMES).slice(0, count);
  return names.map((name, index) => generateCustomer(index + 1, name));
}

function summarize(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
  return {
    min: Number(min.toFixed(1)),
    max: Number(max.toFixed(1)),
    promedio: Number(avg.toFixed(1)),
  };
}

const customers = generateCustomers(30);

console.log(`Expansion Builder - ${customers.length} clientes sintéticos generados (seed=${SEED})`);
console.table({
  activity_level: summarize(customers.map((c) => c.activity_level)),
  days_since_last_use: summarize(customers.map((c) => c.days_since_last_use)),
  module_count: summarize(customers.map((c) => c.current_modules.length)),
});
