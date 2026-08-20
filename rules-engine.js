// Motor de reglas: evalúa cada cliente contra las reglas activas del panel
// y agrega los resultados en las métricas de la cartera.

const REDUCED_VALUE_MULTIPLIER = 0.5; // penalización cuando se "reduce" el valor incremental estimado

// Supuesto simple de valor incremental mensual (USD) por módulo, ajustado
// por tamaño de empresa. Es una estimación de demo, no un dato real.
const MODULE_MONTHLY_VALUE = {
  contabilidad: 35,
  facturacion: 25,
  nomina: 55,
  pagos: 30,
  fiscal: 28,
};

const SIZE_MULTIPLIER = {
  micro: 1,
  pequena: 2,
  mediana: 4,
  grande: 8,
};

function getCurrentRules() {
  return {
    antiguedadMinima: Number(document.getElementById('antiguedad-minima').value),
    actividadMinima: Number(document.getElementById('actividad-minima').value),
    modulosMinimos: Number(document.getElementById('modulos-minimos').value),
    diasInactividadMaxima: Number(document.getElementById('dias-inactividad-maxima').value),
    accionAlertaSoporte: document.getElementById('accion-alerta-soporte').value,
    tratamientoDatosIncompletos: document.getElementById('tratamiento-datos-incompletos').value,
  };
}

// Qué tan lejos está un cliente de cruzar cada umbral configurado, para
// usarse como proxy de confianza: casos "al límite" son menos confiables
// que casos claramente dentro o fuera de rango.
function estimateConfidence(customer, rules) {
  const marginActividad = Math.abs(customer.activity_level - rules.actividadMinima) / 100;
  const marginInactividad = Math.abs(customer.days_since_last_use - rules.diasInactividadMaxima) / 90;
  const marginModulos = Math.abs(customer.current_modules.length - rules.modulosMinimos) / 5;
  const marginAntiguedad = Math.abs(customer.months_active - rules.antiguedadMinima) / 42;
  const avgMargin = (marginActividad + marginInactividad + marginModulos + marginAntiguedad) / 4;

  let confidence = 55 + avgMargin * 90;

  if (!customer.usage_data_available) confidence -= 15;
  if (customer.support_alert === 'alta') confidence -= 10;
  else if (customer.support_alert === 'media') confidence -= 5;

  return Math.max(45, Math.min(99, Math.round(confidence)));
}

function evaluateCustomer(customer, rules) {
  let status = 'prioritario';
  let valueMultiplier = 1;
  const reasons = [];

  const escalate = (level) => {
    if (level === 'no-listo') status = 'no-listo';
    else if (level === 'considerar' && status !== 'no-listo') status = 'considerar';
  };

  if (customer.months_active < rules.antiguedadMinima) {
    escalate('no-listo');
    reasons.push(`su antigüedad de ${customer.months_active} meses como cliente está por debajo del mínimo exigido de ${rules.antiguedadMinima} meses`);
  }

  if (customer.support_alert !== 'ninguna') {
    if (rules.accionAlertaSoporte === 'excluir') {
      escalate('no-listo');
      reasons.push(`presenta una alerta de soporte "${customer.support_alert}" y la regla activa excluye la cuenta automáticamente`);
    } else if (rules.accionAlertaSoporte === 'marcar-revisar') {
      escalate('considerar');
      reasons.push(`presenta una alerta de soporte "${customer.support_alert}" que requiere revisión del equipo de Customer Success antes de ofrecer un nuevo módulo`);
    } else if (rules.accionAlertaSoporte === 'bajar-prioridad') {
      escalate('considerar');
      reasons.push(`presenta una alerta de soporte "${customer.support_alert}", por lo que se baja su prioridad a "a considerar"`);
    } else if (rules.accionAlertaSoporte === 'reducir-valor') {
      valueMultiplier = Math.min(valueMultiplier, REDUCED_VALUE_MULTIPLIER);
      reasons.push(`presenta una alerta de soporte "${customer.support_alert}", por lo que se ajustó a la baja el valor incremental estimado`);
    }
  }

  if (!customer.usage_data_available) {
    if (rules.tratamientoDatosIncompletos === 'excluir') {
      escalate('no-listo');
      reasons.push('no cuenta con datos de uso reciente disponibles y la regla activa exige excluir estos casos');
    } else if (rules.tratamientoDatosIncompletos === 'solicitar-datos') {
      escalate('considerar');
      reasons.push('no cuenta con datos de uso reciente disponibles, por lo que se solicitará información adicional antes de ofrecer el módulo');
    } else if (rules.tratamientoDatosIncompletos === 'revision-manual') {
      escalate('considerar');
      reasons.push('no cuenta con datos de uso reciente disponibles y se marcó para revisión manual');
    } else if (rules.tratamientoDatosIncompletos === 'valor-reducido') {
      valueMultiplier = Math.min(valueMultiplier, REDUCED_VALUE_MULTIPLIER);
      reasons.push('no cuenta con datos de uso reciente disponibles, por lo que se estima con un valor incremental reducido');
    }
  }

  if (customer.activity_level < rules.actividadMinima) {
    escalate('considerar');
    reasons.push(`su actividad reciente (${customer.activity_level}%) está por debajo del mínimo requerido de ${rules.actividadMinima}%`);
  }

  if (customer.current_modules.length < rules.modulosMinimos) {
    escalate('considerar');
    reasons.push(`solo tiene ${customer.current_modules.length} módulo(s) contratado(s), por debajo del mínimo de ${rules.modulosMinimos} para considerar una nueva venta`);
  }

  if (customer.days_since_last_use > rules.diasInactividadMaxima) {
    escalate('no-listo');
    reasons.push(`registra ${customer.days_since_last_use} días desde su última actividad, por encima del máximo permitido de ${rules.diasInactividadMaxima} días`);
  }

  if (!customer.next_module) {
    escalate('no-listo');
    reasons.push('ya tiene contratados todos los módulos disponibles, por lo que no hay un siguiente módulo que ofrecer');
  }

  const incrementalValue = status !== 'no-listo' && customer.next_module
    ? Math.round(MODULE_MONTHLY_VALUE[customer.next_module] * SIZE_MULTIPLIER[customer.company_size] * valueMultiplier)
    : 0;

  const confidence = estimateConfidence(customer, rules);

  return { customer, status, incrementalValue, valueMultiplier, confidence, reasons };
}

// Construye 1 a 3 frases en lenguaje natural explicando la clasificación,
// a partir de las reglas que realmente se activaron para este cliente.
function generateExplanation(evaluation) {
  const { customer, status, reasons } = evaluation;
  const moduleLabel = customer.next_module ? MODULE_LABELS[customer.next_module] : null;

  const verdictPhrase = status === 'prioritario'
    ? `${customer.name} es prioritario para ofrecerle ${moduleLabel}`
    : status === 'considerar'
      ? `${customer.name} quedó "a considerar" para ofrecerle ${moduleLabel || 'un siguiente módulo'}`
      : `${customer.name} no está listo para una oferta de nuevo módulo`;

  if (reasons.length === 0) {
    return `${verdictPhrase} porque todas sus señales están dentro de los rangos definidos por las reglas activas: actividad reciente, módulos actuales, antigüedad y días de inactividad en rango saludable, sin alertas de soporte y con datos de uso disponibles.`;
  }

  let reasonSentence;
  if (reasons.length === 1) {
    reasonSentence = `${verdictPhrase} porque ${reasons[0]}.`;
  } else {
    const last = reasons[reasons.length - 1];
    const rest = reasons.slice(0, -1).join(', ');
    reasonSentence = `${verdictPhrase} porque ${rest}, y además ${last}.`;
  }

  let extra = '';
  if (status === 'prioritario' && evaluation.valueMultiplier < 1) {
    extra = ' El valor incremental estimado se ajustó a la baja como medida de precaución.';
  } else if (status === 'considerar') {
    extra = ' El equipo de Customer Success debe confirmar la oportunidad antes de contactar al cliente.';
  } else if (status === 'no-listo') {
    extra = ' No se recomienda ofrecer un nuevo módulo bajo las reglas activas.';
  }

  return reasonSentence + extra;
}

function evaluatePortfolio(customerList, rules) {
  return customerList.map((customer) => evaluateCustomer(customer, rules));
}

function computePortfolioMetrics(evaluations) {
  const total = evaluations.length;
  const priority = evaluations.filter((e) => e.status === 'prioritario');
  const consider = evaluations.filter((e) => e.status === 'considerar');
  const notReady = evaluations.filter((e) => e.status === 'no-listo');

  const totalIncrementalValue = priority.reduce((sum, e) => sum + e.incrementalValue, 0);
  const avgActivity = priority.length
    ? priority.reduce((sum, e) => sum + e.customer.activity_level, 0) / priority.length
    : 0;

  return {
    priorityRate: total ? (priority.length / total) * 100 : 0,
    priorityCount: priority.length,
    considerRate: total ? (consider.length / total) * 100 : 0,
    notReadyRate: total ? (notReady.length / total) * 100 : 0,
    totalIncrementalValue,
    avgActivity,
  };
}
