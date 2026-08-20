// Generador de empresas sintéticas para simular una cartera de crédito.

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
// (utilización, mora, concentración, variabilidad).
function skewLow(min, max, n = 2) {
  return min + Math.pow(rng(), n) * (max - min);
}

// Sesga hacia el máximo: útil para variables donde "alto es mejor"
// (historial de pago).
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

const COMPANY_NAMES = [
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

function pickIdentitySignal() {
  return rng() < 0.07 ? 'alerta' : 'ok';
}

function pickFraudAlert() {
  const roll = rng();
  if (roll < 0.02) return 'alta';
  if (roll < 0.10) return 'media';
  return 'ninguna';
}

function pickBureauAvailable() {
  return rng() < 0.88;
}

function generateCompany(id, name) {
  return {
    id,
    name,
    months_active: Math.round(randRange(2, 42)),
    monthly_revenue: Math.round(randRange(3000, 63000)),
    flow_variability: Number(skewLow(5, 50, 2).toFixed(1)),
    utilization: Number(skewLow(15, 95, 2).toFixed(1)),
    payment_history: Number(skewHigh(45, 100, 2).toFixed(1)),
    days_late: Math.round(skewLow(0, 38, 2.5)),
    concentration: Number(skewLow(15, 85, 2).toFixed(1)),
    identity_signal: pickIdentitySignal(),
    fraud_alert: pickFraudAlert(),
    bureau_available: pickBureauAvailable(),
  };
}

function generateCompanies(count = 30) {
  const names = shuffle(COMPANY_NAMES).slice(0, count);
  return names.map((name, index) => generateCompany(index + 1, name));
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

const companies = generateCompanies(30);

console.log(`Risk Builder - ${companies.length} empresas sintéticas generadas (seed=${SEED})`);
console.table({
  utilization: summarize(companies.map((c) => c.utilization)),
  days_late: summarize(companies.map((c) => c.days_late)),
  concentration: summarize(companies.map((c) => c.concentration)),
});
