// Motor de reglas: evalúa cada empresa contra las reglas activas del panel
// y agrega los resultados en las métricas de cartera.

const LGD = 0.45; // pérdida dada la mora, supuesto estándar (45%)
const BASE_LIMIT_MULTIPLIER = 0.5; // cupo = 50% del ingreso mensual declarado
const REDUCED_LIMIT_MULTIPLIER = 0.5; // penalización cuando se "reduce línea"

function getCurrentRules() {
  return {
    utilizacionMaxima: Number(document.getElementById('utilizacion-maxima').value),
    diasMora: Number(document.getElementById('dias-mora').value),
    concentracionGasto: Number(document.getElementById('concentracion-gasto').value),
    antiguedadMinima: Number(document.getElementById('antiguedad-minima').value),
    accionFraude: document.getElementById('accion-fraude').value,
    tratamientoInfoIncompleta: document.getElementById('info-incompleta').value,
  };
}

// Combina las señales de riesgo de una empresa en una probabilidad de
// incumplimiento (PD) aproximada, entre 2% y 32%.
function estimatePd(company) {
  const riskScore =
    0.25 * (1 - company.payment_history / 100) +
    0.20 * (company.days_late / 38) +
    0.15 * (company.utilization / 100) +
    0.15 * (company.concentration / 100) +
    0.10 * (company.flow_variability / 50) +
    0.10 * (company.fraud_alert === 'alta' ? 1 : company.fraud_alert === 'media' ? 0.5 : 0) +
    0.05 * (company.identity_signal === 'alerta' ? 1 : 0);

  return 0.02 + riskScore * 0.30;
}

// Qué tan lejos está una empresa de cruzar cada umbral configurado, para
// usarse como proxy de confianza: casos "al límite" son menos confiables
// que casos claramente dentro o fuera de rango.
function estimateConfidence(company, rules) {
  const marginUtilizacion = Math.abs(company.utilization - rules.utilizacionMaxima) / 100;
  const marginMora = Math.abs(company.days_late - rules.diasMora) / 90;
  const marginConcentracion = Math.abs(company.concentration - rules.concentracionGasto) / 100;
  const marginAntiguedad = Math.abs(company.months_active - rules.antiguedadMinima) / 42;
  const avgMargin = (marginUtilizacion + marginMora + marginConcentracion + marginAntiguedad) / 4;

  let confidence = 55 + avgMargin * 90;

  if (!company.bureau_available) confidence -= 15;
  if (company.identity_signal === 'alerta') confidence -= 10;
  if (company.fraud_alert === 'alta') confidence -= 10;
  else if (company.fraud_alert === 'media') confidence -= 5;

  return Math.max(45, Math.min(99, Math.round(confidence)));
}

function evaluateCompany(company, rules) {
  let status = 'aprobado';
  let limitMultiplier = 1;
  const reasons = [];

  const escalate = (level) => {
    if (level === 'rechazado') status = 'rechazado';
    else if (level === 'revision' && status !== 'rechazado') status = 'revision';
  };

  if (company.months_active < rules.antiguedadMinima) {
    escalate('rechazado');
    reasons.push(`su antigüedad de ${company.months_active} meses está por debajo del mínimo exigido de ${rules.antiguedadMinima} meses`);
  }

  if (company.fraud_alert !== 'ninguna') {
    if (rules.accionFraude === 'bloquear') {
      escalate('rechazado');
      reasons.push(`presenta una alerta de fraude "${company.fraud_alert}" y la regla activa bloquea la cuenta automáticamente`);
    } else if (rules.accionFraude === 'verificacion') {
      escalate('revision');
      reasons.push(`presenta una alerta de fraude "${company.fraud_alert}" que requiere verificación adicional antes de aprobar`);
    } else if (rules.accionFraude === 'revision') {
      escalate('revision');
      reasons.push(`presenta una alerta de fraude "${company.fraud_alert}" marcada para revisión manual`);
    } else if (rules.accionFraude === 'reducir') {
      limitMultiplier = Math.min(limitMultiplier, REDUCED_LIMIT_MULTIPLIER);
      reasons.push(`presenta una alerta de fraude "${company.fraud_alert}", por lo que se redujo la línea de crédito recomendada`);
    }
  }

  if (!company.bureau_available) {
    if (rules.tratamientoInfoIncompleta === 'rechazar') {
      escalate('rechazado');
      reasons.push('no cuenta con información de buró disponible y la regla activa exige rechazar estos casos');
    } else if (rules.tratamientoInfoIncompleta === 'solicitar-info') {
      escalate('revision');
      reasons.push('no cuenta con información de buró disponible, por lo que se solicitará información adicional');
    } else if (rules.tratamientoInfoIncompleta === 'revision-manual') {
      escalate('revision');
      reasons.push('no cuenta con información de buró disponible y se marcó para revisión manual');
    } else if (rules.tratamientoInfoIncompleta === 'limite-reducido') {
      limitMultiplier = Math.min(limitMultiplier, REDUCED_LIMIT_MULTIPLIER);
      reasons.push('no cuenta con información de buró disponible, por lo que se aprueba con un límite reducido');
    }
  }

  if (company.utilization > rules.utilizacionMaxima) {
    escalate('revision');
    reasons.push(`su utilización actual (${company.utilization}%) supera el máximo permitido de ${rules.utilizacionMaxima}%`);
  }

  if (company.concentration > rules.concentracionGasto) {
    escalate('revision');
    reasons.push(`concentra ${company.concentration}% de su gasto en una sola fuente, por encima del límite de ${rules.concentracionGasto}%`);
  }

  if (company.days_late > rules.diasMora) {
    escalate('rechazado');
    reasons.push(`registra ${company.days_late} días de mora, por encima del máximo permitido de ${rules.diasMora} días`);
  }

  const limit = status === 'rechazado'
    ? 0
    : Math.round(company.monthly_revenue * BASE_LIMIT_MULTIPLIER * limitMultiplier);

  const pd = estimatePd(company);
  const exposure = status === 'aprobado' ? limit * (company.utilization / 100) : 0;
  const expectedLoss = exposure * pd * LGD;
  const confidence = estimateConfidence(company, rules);

  return { company, status, limit, limitMultiplier, pd, expectedLoss, confidence, reasons };
}

// Construye 1 a 3 frases en lenguaje natural explicando la decisión,
// a partir de las reglas que realmente se activaron para esta empresa.
function generateExplanation(evaluation) {
  const { company, status, reasons } = evaluation;

  const verdictPhrase = status === 'aprobado'
    ? `${company.name} fue aprobada`
    : status === 'revision'
      ? `${company.name} fue marcada para revisión manual`
      : `${company.name} fue rechazada`;

  if (reasons.length === 0) {
    return `${verdictPhrase} porque todas sus señales de riesgo están dentro de los límites definidos por las reglas activas: utilización, mora, concentración y antigüedad en rango saludable, sin alertas de fraude o identidad, y con información de buró disponible.`;
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
  if (status === 'aprobado' && evaluation.limitMultiplier < 1) {
    extra = ' La línea recomendada se ajustó a la baja como medida de mitigación.';
  } else if (status === 'revision') {
    extra = ' Un analista debe confirmar la decisión antes de habilitar cualquier línea de crédito.';
  } else if (status === 'rechazado') {
    extra = ' No se recomienda asignar línea de crédito bajo las reglas activas.';
  }

  return reasonSentence + extra;
}

function evaluatePortfolio(companyList, rules) {
  return companyList.map((company) => evaluateCompany(company, rules));
}

function computePortfolioMetrics(evaluations) {
  const total = evaluations.length;
  const approved = evaluations.filter((e) => e.status === 'aprobado');
  const inReview = evaluations.filter((e) => e.status === 'revision');
  const rejected = evaluations.filter((e) => e.status === 'rechazado');

  const totalLimit = approved.reduce((sum, e) => sum + e.limit, 0);
  const totalExpectedLoss = evaluations.reduce((sum, e) => sum + e.expectedLoss, 0);
  const avgUtilization = approved.length
    ? approved.reduce((sum, e) => sum + e.company.utilization, 0) / approved.length
    : 0;

  return {
    approvalRate: total ? (approved.length / total) * 100 : 0,
    reviewRate: total ? (inReview.length / total) * 100 : 0,
    rejectRate: total ? (rejected.length / total) * 100 : 0,
    totalLimit,
    expectedLoss: totalExpectedLoss,
    avgUtilization,
  };
}
