document.querySelectorAll('input[type="range"]').forEach((slider) => {
  const valueLabel = document.getElementById(`${slider.id}-value`);
  const suffix = slider.dataset.suffix || '';

  const updateValue = () => {
    valueLabel.textContent = `${slider.value}${suffix}`;
  };

  slider.addEventListener('input', updateValue);
  updateValue();
});

let selectedCompanyId = null;

function formatCurrency(value) {
  return `$${value.toLocaleString('en-US')}`;
}

function fraudBadgeClass(level) {
  if (level === 'alta') return 'badge-danger';
  if (level === 'media') return 'badge-warning';
  return 'badge-ok';
}

function identityBadgeClass(signal) {
  return signal === 'alerta' ? 'badge-warning' : 'badge-ok';
}

function statusBadgeClass(status) {
  if (status === 'aprobado') return 'badge-ok';
  if (status === 'revision') return 'badge-warning';
  return 'badge-danger';
}

const STATUS_LABELS = {
  aprobado: 'Aprobado',
  revision: 'En revisión',
  rechazado: 'Rechazado',
};

function buildCompanyDetailHTML(company, evaluation, rules) {
  const explanation = generateExplanation(evaluation);

  const utilizationChipClass = company.utilization > rules.utilizacionMaxima ? 'badge-warning' : 'badge-ok';
  const paymentChipClass = company.payment_history >= 80 ? 'badge-ok' : company.payment_history >= 60 ? 'badge-warning' : 'badge-danger';
  const bureauChipClass = company.bureau_available ? 'badge-ok' : 'badge-warning';

  return `
    <div class="detail-header">
      <h3>${company.name}</h3>
      <span class="badge-pill ${statusBadgeClass(evaluation.status)}">${STATUS_LABELS[evaluation.status]}</span>
    </div>

    <div class="detail-highlights">
      <div class="detail-highlight">
        <span class="detail-label">Línea de crédito recomendada</span>
        <span class="detail-highlight-value">${formatCurrency(evaluation.limit)}</span>
      </div>
      <div class="detail-highlight">
        <span class="detail-label">Nivel de confianza</span>
        <span class="detail-highlight-value">${evaluation.confidence}%</span>
      </div>
    </div>

    <div class="detail-chips">
      <span class="badge-pill ${utilizationChipClass}">Utilización: ${company.utilization}%</span>
      <span class="badge-pill ${paymentChipClass}">Historial de pago: ${company.payment_history}</span>
      <span class="badge-pill ${identityBadgeClass(company.identity_signal)}">Identidad: ${company.identity_signal}</span>
      <span class="badge-pill ${fraudBadgeClass(company.fraud_alert)}">Fraude: ${company.fraud_alert}</span>
      <span class="badge-pill ${bureauChipClass}">Buró: ${company.bureau_available ? 'disponible' : 'no disponible'}</span>
      <span class="detail-stat" title="Contribuye a la pérdida esperada; no forma parte de las 6 reglas activas ni cambia el estado de la solicitud">Variabilidad de flujo: ${company.flow_variability}%</span>
    </div>

    <div class="detail-explanation">
      <span class="detail-label">Razón explicable</span>
      <p>${explanation}</p>
    </div>
  `;
}

function renderCompanyDetail(id) {
  const detail = document.getElementById('company-detail');
  if (!detail || typeof companies === 'undefined' || typeof getCurrentRules === 'undefined') return;

  const company = companies.find((c) => c.id === id);

  if (!company) {
    detail.innerHTML = `
      <div class="detail-empty">
        <p>Selecciona una empresa de la lista para ver su detalle.</p>
      </div>
    `;
    return;
  }

  const rules = getCurrentRules();
  const evaluation = evaluateCompany(company, rules);
  detail.innerHTML = buildCompanyDetailHTML(company, evaluation, rules);
}

const STATUS_ORDER = ['aprobado', 'revision', 'rechazado'];

let statusFilter = 'todos';
let sortColumn = null;
let sortDirection = 'asc';

function renderCompaniesTable() {
  const tbody = document.getElementById('companies-tbody');
  if (!tbody || typeof companies === 'undefined' || typeof getCurrentRules === 'undefined') return;

  const rules = getCurrentRules();
  let evaluations = evaluatePortfolio(companies, rules);

  if (statusFilter !== 'todos') {
    evaluations = evaluations.filter(({ status }) => status === statusFilter);
  }

  if (sortColumn) {
    const direction = sortDirection === 'asc' ? 1 : -1;
    evaluations = [...evaluations].sort((a, b) => {
      if (sortColumn === 'name') {
        return a.company.name.localeCompare(b.company.name) * direction;
      }
      const valueA = sortColumn === 'status' ? STATUS_ORDER.indexOf(a.status) : a.company[sortColumn];
      const valueB = sortColumn === 'status' ? STATUS_ORDER.indexOf(b.status) : b.company[sortColumn];
      return (valueA - valueB) * direction;
    });
  }

  tbody.innerHTML = evaluations.map((evaluation) => {
    const c = evaluation.company;
    const status = evaluation.status;
    const isSelected = c.id === selectedCompanyId;

    return `
      <tr
        data-id="${c.id}"
        class="company-row${isSelected ? ' active' : ''}"
        tabindex="0"
        aria-selected="${isSelected}"
        aria-expanded="${isSelected}"
        aria-controls="company-detail-row-${c.id}"
      >
        <td class="company-name" data-label="Empresa"><span class="company-name-text">${c.name}<span class="expand-chevron" aria-hidden="true"></span></span></td>
        <td data-label="Antigüedad">${c.months_active} m</td>
        <td data-label="Utilización">${c.utilization}%</td>
        <td data-label="Estado"><span class="badge-pill ${statusBadgeClass(status)}">${STATUS_LABELS[status]}</span></td>
      </tr>
      <tr class="company-detail-row" id="company-detail-row-${c.id}"${isSelected ? '' : ' hidden'}>
        <td colspan="4">${isSelected ? buildCompanyDetailHTML(c, evaluation, rules) : ''}</td>
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

function selectCompanyRow(row) {
  const id = Number(row.dataset.id);
  const isMobile = window.matchMedia('(max-width: 900px)').matches;

  if (isMobile && selectedCompanyId === id) {
    selectedCompanyId = null;
  } else {
    selectedCompanyId = id;
  }

  renderCompaniesTable();
  renderCompanyDetail(selectedCompanyId);

  document.querySelector(`.company-row[data-id="${id}"]`)?.focus();
}

const companiesTbody = document.getElementById('companies-tbody');
if (companiesTbody) {
  companiesTbody.addEventListener('click', (event) => {
    const row = event.target.closest('.company-row');
    if (row) selectCompanyRow(row);
  });

  companiesTbody.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const row = event.target.closest('.company-row');
    if (!row) return;
    event.preventDefault();
    selectCompanyRow(row);
  });
}

const statusFilterSelect = document.getElementById('status-filter');
if (statusFilterSelect) {
  statusFilterSelect.addEventListener('change', (event) => {
    statusFilter = event.target.value;
    renderCompaniesTable();
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
    renderCompaniesTable();
  });
});

renderCompaniesTable();
renderCompanyDetail(selectedCompanyId);

function formatPercent(value) {
  return `${value.toFixed(1)}%`;
}

function renderMetrics() {
  if (typeof companies === 'undefined' || typeof getCurrentRules === 'undefined') return;

  const rules = getCurrentRules();
  const evaluations = evaluatePortfolio(companies, rules);
  const metrics = computePortfolioMetrics(evaluations);

  document.getElementById('metric-approval-rate').textContent = formatPercent(metrics.approvalRate);
  document.getElementById('metric-total-limit').textContent = formatCurrency(Math.round(metrics.totalLimit));
  document.getElementById('metric-expected-loss').textContent = formatCurrency(Math.round(metrics.expectedLoss));
  document.getElementById('metric-review-rate').textContent = formatPercent(metrics.reviewRate);
  document.getElementById('metric-reject-rate').textContent = formatPercent(metrics.rejectRate);
  document.getElementById('metric-avg-utilization').textContent = formatPercent(metrics.avgUtilization);

  document.getElementById('live-metric-approval').textContent = formatPercent(metrics.approvalRate);
  document.getElementById('live-metric-limit').textContent = formatCurrency(Math.round(metrics.totalLimit));
  document.getElementById('live-metric-loss').textContent = formatCurrency(Math.round(metrics.expectedLoss));
}

function refreshFromRules() {
  renderMetrics();
  renderCompaniesTable();
  renderCompanyDetail(selectedCompanyId);
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

const profileBtn = document.getElementById('profile-btn');
const profilePopover = document.getElementById('profile-popover');

function closeProfilePopover() {
  if (!profilePopover) return;
  profilePopover.hidden = true;
  profileBtn?.setAttribute('aria-expanded', 'false');
}

function openProfilePopover() {
  if (!profilePopover) return;
  profilePopover.hidden = false;
  profileBtn?.setAttribute('aria-expanded', 'true');
}

if (profileBtn && profilePopover) {
  profileBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    if (profilePopover.hidden) openProfilePopover();
    else closeProfilePopover();
  });

  document.addEventListener('click', (event) => {
    if (!profilePopover.hidden && !profilePopover.contains(event.target)) {
      closeProfilePopover();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeProfilePopover();
  });
}
