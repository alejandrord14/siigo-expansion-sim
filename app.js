document.querySelectorAll('input[type="range"]').forEach((slider) => {
  const valueLabel = document.getElementById(`${slider.id}-value`);
  const suffix = slider.dataset.suffix || '';

  const updateValue = () => {
    valueLabel.textContent = `${slider.value}${suffix}`;
  };

  slider.addEventListener('input', updateValue);
  updateValue();
});

let selectedCustomerId = null;

function formatCurrency(value) {
  return `$${value.toLocaleString('en-US')}`;
}

function supportAlertBadgeClass(level) {
  if (level === 'alta') return 'badge-danger';
  if (level === 'media') return 'badge-warning';
  return 'badge-ok';
}

function statusBadgeClass(status) {
  if (status === 'prioritario') return 'badge-ok';
  if (status === 'considerar') return 'badge-warning';
  return 'badge-danger';
}

const STATUS_LABELS = {
  prioritario: 'Prioritario',
  considerar: 'A considerar',
  'no-listo': 'No listo',
};

function buildCustomerDetailHTML(customer, evaluation, rules) {
  const explanation = generateExplanation(evaluation);

  const moduleChipClass = customer.next_module ? 'badge-ok' : 'badge-warning';
  const moduleChipLabel = customer.next_module ? MODULE_LABELS[customer.next_module] : 'Ninguno (todos contratados)';
  const activityChipClass = customer.activity_level >= rules.actividadMinima ? 'badge-ok' : 'badge-warning';
  const moduleCountChipClass = customer.current_modules.length >= rules.modulosMinimos ? 'badge-ok' : 'badge-warning';
  const usageDataChipClass = customer.usage_data_available ? 'badge-ok' : 'badge-warning';

  return `
    <div class="detail-header">
      <h3>${customer.name}</h3>
      <span class="badge-pill ${statusBadgeClass(evaluation.status)}">${STATUS_LABELS[evaluation.status]}</span>
    </div>

    <div class="detail-highlights">
      <div class="detail-highlight">
        <span class="detail-label">Valor incremental estimado (mensual)</span>
        <span class="detail-highlight-value">${formatCurrency(evaluation.incrementalValue)}</span>
      </div>
      <div class="detail-highlight">
        <span class="detail-label">Nivel de confianza</span>
        <span class="detail-highlight-value">${evaluation.confidence}%</span>
      </div>
    </div>

    <div class="detail-chips">
      <span class="badge-pill ${moduleChipClass}">Módulo sugerido: ${moduleChipLabel}</span>
      <span class="badge-pill ${activityChipClass}">Actividad reciente: ${customer.activity_level}%</span>
      <span class="badge-pill ${moduleCountChipClass}">Módulos actuales: ${customer.current_modules.length}/5</span>
      <span class="badge-pill ${supportAlertBadgeClass(customer.support_alert)}">Alerta de soporte: ${customer.support_alert}</span>
      <span class="badge-pill ${usageDataChipClass}">Datos de uso: ${customer.usage_data_available ? 'disponible' : 'no disponible'}</span>
      <span class="detail-stat" title="Información de contexto; no forma parte de las 6 reglas activas ni cambia la clasificación">País: ${customer.country} · Tamaño: ${SIZE_LABELS[customer.company_size]} · Variabilidad de uso: ${customer.usage_variability}%</span>
    </div>

    <div class="detail-explanation">
      <span class="detail-label">Razón explicable</span>
      <p>${explanation}</p>
    </div>
  `;
}

function renderCustomerDetail(id) {
  const detail = document.getElementById('company-detail');
  if (!detail || typeof customers === 'undefined' || typeof getCurrentRules === 'undefined') return;

  const customer = customers.find((c) => c.id === id);

  if (!customer) {
    detail.innerHTML = `
      <div class="detail-empty">
        <p>Selecciona un cliente de la lista para ver su detalle.</p>
      </div>
    `;
    return;
  }

  const rules = getCurrentRules();
  const evaluation = evaluateCustomer(customer, rules);
  detail.innerHTML = buildCustomerDetailHTML(customer, evaluation, rules);
}

const STATUS_ORDER = ['prioritario', 'considerar', 'no-listo'];

let statusFilter = 'todos';
let sortColumn = null;
let sortDirection = 'asc';

function renderCustomersTable() {
  const tbody = document.getElementById('companies-tbody');
  if (!tbody || typeof customers === 'undefined' || typeof getCurrentRules === 'undefined') return;

  const rules = getCurrentRules();
  let evaluations = evaluatePortfolio(customers, rules);

  if (statusFilter !== 'todos') {
    evaluations = evaluations.filter(({ status }) => status === statusFilter);
  }

  if (sortColumn) {
    const direction = sortDirection === 'asc' ? 1 : -1;
    evaluations = [...evaluations].sort((a, b) => {
      if (sortColumn === 'name') {
        return a.customer.name.localeCompare(b.customer.name) * direction;
      }
      const valueA = sortColumn === 'status' ? STATUS_ORDER.indexOf(a.status) : a.customer[sortColumn];
      const valueB = sortColumn === 'status' ? STATUS_ORDER.indexOf(b.status) : b.customer[sortColumn];
      return (valueA - valueB) * direction;
    });
  }

  tbody.innerHTML = evaluations.map((evaluation) => {
    const c = evaluation.customer;
    const status = evaluation.status;
    const isSelected = c.id === selectedCustomerId;

    return `
      <tr
        data-id="${c.id}"
        class="company-row${isSelected ? ' active' : ''}"
        tabindex="0"
        aria-selected="${isSelected}"
        aria-expanded="${isSelected}"
        aria-controls="company-detail-row-${c.id}"
      >
        <td class="company-name" data-label="Cliente"><span class="company-name-text">${c.name}<span class="expand-chevron" aria-hidden="true"></span></span></td>
        <td data-label="Antigüedad">${c.months_active} m</td>
        <td data-label="Actividad">${c.activity_level}%</td>
        <td data-label="Estado"><span class="badge-pill ${statusBadgeClass(status)}">${STATUS_LABELS[status]}</span></td>
      </tr>
      <tr class="company-detail-row" id="company-detail-row-${c.id}"${isSelected ? '' : ' hidden'}>
        <td colspan="4">${isSelected ? buildCustomerDetailHTML(c, evaluation, rules) : ''}</td>
      </tr>
    `;
  }).join('');

  updateSortIndicators();
}

function updateSortIndicators() {
  document.querySelectorAll('.th-sort').forEach((button) => {
    const indicator = button.querySelector('.sort-indicator');
    if (button.dataset.sort === sortColumn) {
      button.setAttribute('aria-sort', sortDirection === 'asc' ? 'ascending' : 'descending');
      indicator.textContent = sortDirection === 'asc' ? '▲' : '▼';
    } else {
      button.removeAttribute('aria-sort');
      indicator.textContent = '';
    }
  });
}

function selectCustomerRow(row) {
  const id = Number(row.dataset.id);
  const isMobile = window.matchMedia('(max-width: 900px)').matches;

  if (isMobile && selectedCustomerId === id) {
    selectedCustomerId = null;
  } else {
    selectedCustomerId = id;
  }

  renderCustomersTable();
  renderCustomerDetail(selectedCustomerId);

  document.querySelector(`.company-row[data-id="${id}"]`)?.focus();
}

const customersTbody = document.getElementById('companies-tbody');
if (customersTbody) {
  customersTbody.addEventListener('click', (event) => {
    const row = event.target.closest('.company-row');
    if (row) selectCustomerRow(row);
  });

  customersTbody.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const row = event.target.closest('.company-row');
    if (!row) return;
    event.preventDefault();
    selectCustomerRow(row);
  });
}

const statusFilterSelect = document.getElementById('status-filter');
if (statusFilterSelect) {
  statusFilterSelect.addEventListener('change', (event) => {
    statusFilter = event.target.value;
    renderCustomersTable();
  });
}

document.querySelectorAll('.th-sort').forEach((button) => {
  button.addEventListener('click', () => {
    const column = button.dataset.sort;
    if (sortColumn === column) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column;
      sortDirection = 'asc';
    }
    renderCustomersTable();
  });
});

renderCustomersTable();
renderCustomerDetail(selectedCustomerId);

function formatPercent(value) {
  return `${value.toFixed(1)}%`;
}

function renderMetrics() {
  if (typeof customers === 'undefined' || typeof getCurrentRules === 'undefined') return;

  const rules = getCurrentRules();
  const evaluations = evaluatePortfolio(customers, rules);
  const metrics = computePortfolioMetrics(evaluations);

  document.getElementById('metric-priority-rate').textContent = formatPercent(metrics.priorityRate);
  document.getElementById('metric-incremental-value').textContent = `${formatCurrency(Math.round(metrics.totalIncrementalValue))}/mes`;
  document.getElementById('metric-priority-count').textContent = String(metrics.priorityCount);
  document.getElementById('metric-consider-rate').textContent = formatPercent(metrics.considerRate);
  document.getElementById('metric-notready-rate').textContent = formatPercent(metrics.notReadyRate);
  document.getElementById('metric-avg-activity').textContent = formatPercent(metrics.avgActivity);

  document.getElementById('live-metric-priority').textContent = formatPercent(metrics.priorityRate);
  document.getElementById('live-metric-count').textContent = String(metrics.priorityCount);
  document.getElementById('live-metric-value').textContent = `${formatCurrency(Math.round(metrics.totalIncrementalValue))}/mes`;
}

function refreshFromRules() {
  renderMetrics();
  renderCustomersTable();
  renderCustomerDetail(selectedCustomerId);
}

const ruleControls = document.querySelectorAll('#controls input, #controls select');
const defaultRuleValues = new Map();

ruleControls.forEach((control) => {
  defaultRuleValues.set(control.id, control.value);
  control.addEventListener('input', refreshFromRules);
});

const resetRulesBtn = document.getElementById('reset-rules-btn');
if (resetRulesBtn) {
  resetRulesBtn.addEventListener('click', () => {
    ruleControls.forEach((control) => {
      control.value = defaultRuleValues.get(control.id);
      control.dispatchEvent(new Event('input', { bubbles: true }));
    });
  });
}

renderMetrics();

const navSections = Array.from(document.querySelectorAll('main section[id]'));
const sidebarNavLinks = document.querySelectorAll('.sidebar-nav a');

function updateActiveNavLink() {
  if (!navSections.length) return;

  const scrollTrigger = 96;
  let activeId = navSections[0].id;

  navSections.forEach((section) => {
    if (section.getBoundingClientRect().top - scrollTrigger <= 0) {
      activeId = section.id;
    }
  });

  sidebarNavLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
  });
}

if (navSections.length && sidebarNavLinks.length) {
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      updateActiveNavLink();
      scrollTicking = false;
    });
  });
  updateActiveNavLink();
}

const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarClose = document.getElementById('sidebar-close');
const sidebarOverlay = document.getElementById('sidebar-overlay');

function closeSidebar() {
  if (!sidebar) return;
  sidebar.classList.remove('open');
  sidebarOverlay?.classList.remove('visible');
  sidebarToggle?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-open');
}

function openSidebar() {
  if (!sidebar) return;
  sidebar.classList.add('open');
  sidebarOverlay?.classList.add('visible');
  sidebarToggle?.setAttribute('aria-expanded', 'true');
  document.body.classList.add('nav-open');
}

if (sidebar && sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    if (sidebar.classList.contains('open')) closeSidebar();
    else openSidebar();
  });

  sidebarClose?.addEventListener('click', closeSidebar);
  sidebarOverlay?.addEventListener('click', closeSidebar);

  sidebarNavLinks.forEach((link) => {
    link.addEventListener('click', closeSidebar);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeSidebar();
  });
}

function setupPopover(btn, popover) {
  if (!btn || !popover) return;

  const close = () => {
    popover.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  };
  const open = () => {
    popover.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
  };

  btn.addEventListener('click', (event) => {
    event.stopPropagation();
    if (popover.hidden) open();
    else close();
  });

  document.addEventListener('click', (event) => {
    if (!popover.hidden && !popover.contains(event.target)) close();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
}

setupPopover(document.getElementById('profile-btn'), document.getElementById('profile-popover'));
setupPopover(document.getElementById('help-btn'), document.getElementById('help-popover'));
