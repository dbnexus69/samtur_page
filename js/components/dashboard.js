const Dashboard = {
  render(data, user) {
    const stats = this.calculateStats(data);
    const servicesByCategory = this.getServicesByCategory(data);

    return `
      <div class="dashboard-container">
        ${this.renderHeader()}
        ${this.renderKPIs(stats, servicesByCategory)}
        ${this.renderCharts(stats, servicesByCategory)}
      </div>

      <style>
        .dashboard-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--white);
          padding: 16px 24px;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
        }

        .date-range-picker {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .date-range-picker input {
          padding: 8px 12px;
          border: 1px solid var(--gray-300);
          border-radius: var(--radius);
          font-size: 13px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
        }

        .kpi-card {
          background: var(--white);
          padding: 20px;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          position: relative;
          overflow: hidden;
        }

        .kpi-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
        }

        .kpi-card.operations::before { background: var(--kpi-operations); }
        .kpi-card.documental::before { background: var(--kpi-documental); }
        .kpi-card.ingresos::before { background: var(--kpi-ingresos); }
        .kpi-card.pendientes::before { background: var(--kpi-pendientes); }
        .kpi-card.proveedores::before { background: var(--kpi-proveedores); }

        .kpi-label {
          font-size: 12px;
          color: var(--gray-500);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .kpi-value {
          font-size: 24px;
          font-weight: 700;
        }

        .kpi-card.operations .kpi-value { color: var(--kpi-operations); }
        .kpi-card.documental .kpi-value { color: var(--kpi-documental); }
        .kpi-card.ingresos .kpi-value { color: var(--kpi-ingresos); }
        .kpi-card.pendientes .kpi-value { color: var(--kpi-pendientes); }
        .kpi-card.proveedores .kpi-value { color: var(--kpi-proveedores); }

        .kpi-subtitle {
          font-size: 11px;
          color: var(--gray-400);
          margin-top: 4px;
        }

        .kpi-detail {
          font-size: 11px;
          color: var(--gray-400);
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid var(--gray-100);
        }

        .charts-row {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .chart-card {
          background: var(--white);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
        }

        .chart-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--gray-100);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chart-header h3 {
          font-size: 16px;
          font-weight: 600;
        }

        .chart-body {
          padding: 24px;
          height: 300px;
        }

        .distribution-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .distribution-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .distribution-header {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
        }

        .distribution-bar {
          height: 8px;
          background: var(--gray-100);
          border-radius: 4px;
          overflow: hidden;
        }

        .distribution-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .legend-items {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--gray-100);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 3px;
        }

        @media (max-width: 1400px) {
          .kpi-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 1024px) {
          .kpi-grid { grid-template-columns: repeat(2, 1fr); }
          .charts-row { grid-template-columns: 1fr; }
        }
      </style>
    `;
  },

  renderHeader() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const dateFrom = firstDay.toISOString().split('T')[0];
    const dateTo = today.toISOString().split('T')[0];

    return `
      <div class="dashboard-header">
        <div class="date-range-picker">
          <span style="font-weight: 600; font-size: 14px;">Panel de Control</span>
          <input type="date" value="${dateFrom}" id="date-from">
          <span>-</span>
          <input type="date" value="${dateTo}" id="date-to">
        </div>
        <div class="header-actions">
          <button class="btn btn-outline btn-sm" onclick="Dashboard.exportData()" title="Exportar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
          <button class="btn btn-outline btn-sm" onclick="Dashboard.refreshData()" title="Actualizar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
          </button>
        </div>
      </div>
    `;
  },

  renderKPIs(stats, servicesByCategory) {
    return `
      <div class="kpi-grid">
        <div class="kpi-card operations">
          <div class="kpi-label">OPERACIONES</div>
          <div class="kpi-value">${stats.totalFlights}</div>
          <div class="kpi-subtitle">Vuelos Vendidos</div>
          <div class="kpi-detail">
            <span style="color: var(--kpi-operations);">Nacionales: ${stats.nationalFlights}</span> | 
            <span style="color: var(--gray-400);">Intl: ${stats.internationalFlights}</span>
          </div>
        </div>

        <div class="kpi-card documental">
          <div class="kpi-label">GESTION DOCUMENTAL</div>
          <div class="kpi-value">${stats.totalOrders}</div>
          <div class="kpi-subtitle">Ordenes Generadas</div>
          <div class="kpi-detail">
            ${this.renderCategoryBadges(servicesByCategory)}
          </div>
        </div>

        <div class="kpi-card ingresos">
          <div class="kpi-label">INGRESOS BRUTOS</div>
          <div class="kpi-value">${formatCurrency(stats.totalIngresos)}</div>
          <div class="kpi-subtitle">T.A. Ingresada</div>
          <div class="kpi-detail">
            <span style="color: var(--kpi-ingresos);">+${formatCurrency(stats.monthIngresos)}</span> este mes
          </div>
        </div>

        <div class="kpi-card pendientes">
          <div class="kpi-label">PENDIENTES</div>
          <div class="kpi-value">${formatCurrency(stats.totalPendiente)}</div>
          <div class="kpi-subtitle">T.A. Pendiente</div>
          <div class="kpi-detail">${stats.pendienteCount} transacciones</div>
        </div>

        <div class="kpi-card proveedores">
          <div class="kpi-label">PROVEEDORES</div>
          <div class="kpi-value">${formatCurrency(stats.totalProveedores)}</div>
          <div class="kpi-subtitle">Total Proveedores</div>
          <div class="kpi-detail">${stats.supplierCount} activos</div>
        </div>
      </div>
    `;
  },

  renderCategoryBadges(categories) {
    const colors = ['#06b6d4', '#8b5cf6', '#ec4899', '#f97316', '#22c55e'];
    const names = ['Hoteles', 'Planes', 'Seguros', 'Tiquetes', 'Traslados'];
    return categories.map(function(cat, i) { 
      return '<span style="color: ' + (colors[i] || '#666') + '; margin-right: 8px;">' + names[i] + ': ' + cat.count + '</span>';
    }).join(' | ');
  },

  renderCharts(stats, servicesByCategory) {
    return `
      <div class="charts-row">
        <div class="chart-card">
          <div class="chart-header">
            <h3>Distribucion por Categoria</h3>
            <select style="padding: 6px 12px; border: 1px solid var(--gray-200); border-radius: 4px; font-size: 13px;">
              <option>Por Ingresos</option>
            </select>
          </div>
          <div class="chart-body">
            <canvas id="categoryChart"></canvas>
          </div>
          <div style="padding: 0 24px 24px;">
            <div class="distribution-list">
              ${this.renderDistributionList(servicesByCategory, stats.totalIngresos)}
            </div>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h3>Estado de Cartera</h3>
          </div>
          <div class="chart-body">
            <canvas id="carteraChart"></canvas>
          </div>
          <div style="padding: 0 24px 24px;">
            <div class="legend-items">
              <div class="legend-item">
                <span class="legend-color" style="background: var(--success);"></span>
                <span>Pagado</span>
                <span style="font-weight: 600;">${formatCurrency(stats.pagado)}</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: var(--primary);"></span>
                <span>Abonado</span>
                <span style="font-weight: 600;">${formatCurrency(stats.abonado)}</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: var(--warning);"></span>
                <span>Pendiente</span>
                <span style="font-weight: 600;">${formatCurrency(stats.pendiente)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderDistributionList(categories, total) {
    var colors = ['#06b6d4', '#8b5cf6', '#ec4899', '#f97316', '#22c55e'];
    var names = ['Hoteles', 'Planes', 'Seguros', 'Tiquetes', 'Traslados'];
    var values = categories.map(function(c) { return c.total; });

    return categories.map(function(cat, i) {
      var percentage = total > 0 ? Math.round((values[i] / total) * 100) : 0;
      return '<div class="distribution-item"><div class="distribution-header"><span>' + names[i] + '</span><span><strong>' + formatCurrency(values[i]) + '</strong> (' + percentage + '%)</span></div><div class="distribution-bar"><div class="distribution-fill" style="width: ' + percentage + '%; background: ' + colors[i] + ';"></div></div></div>';
    }).join('');
  },

  calculateStats(data) {
    var ventas = data.sales || [];
    var flights = data.flights || [];
    var suppliers = data.config ? data.config.suppliers : [];

    var totalVentas = ventas.reduce(function(sum, s) { return sum + (s.total || 0); }, 0);
    
    var monthVentas = ventas.filter(function(s) {
      var fecha = new Date(s.date);
      var now = new Date();
      return fecha.getMonth() === now.getMonth() && fecha.getFullYear() === now.getFullYear();
    });
    var monthIngresos = monthVentas.reduce(function(sum, s) { return sum + (s.total || 0); }, 0);

    var flightsIda = flights.filter(function(f) { return f.type === 'ida'; });
    var nationalFlights = flightsIda.filter(function(f) { 
      return f.route.indexOf('BOG') > -1 || f.route.indexOf('MDE') > -1 || f.route.indexOf('CTG') > -1 || f.route.indexOf('CAL') > -1;
    }).length;
    var internationalFlights = flightsIda.length - nationalFlights;

    var pendiente = ventas.filter(function(s) { return s.status === 'pendiente'; });
    var pendienteTotal = pendiente.reduce(function(sum, s) { return sum + (s.total || 0); }, 0);
    
    var abonado = ventas.filter(function(s) { return s.status === 'abonado'; });
    var abonadoTotal = abonado.reduce(function(sum, s) { return sum + (s.total || 0); }, 0);
    
    var pagado = ventas.filter(function(s) { return s.status === 'pagado'; });
    var pagadoTotal = pagado.reduce(function(sum, s) { return sum + (s.total || 0); }, 0);

    return {
      totalFlights: flightsIda.length,
      nationalFlights: nationalFlights,
      internationalFlights: internationalFlights,
      totalOrders: ventas.length + flights.length,
      totalIngresos: totalVentas,
      monthIngresos: monthIngresos,
      totalPendiente: pendienteTotal,
      PendienteCount: pendiente.length,
      supplierCount: suppliers.length,
      totalProveedores: Math.round(totalVentas * 0.75),
      Pendiente: pendienteTotal,
      abonado: abonadoTotal,
      pagado: pagadoTotal
    };
  },

  getServicesByCategory(data) {
    var ventas = data.sales || [];
    var total = ventas.reduce(function(s, v) { return s + v.total; }, 0);
    return [
      { name: 'Hoteles', count: Math.round(ventas.length * 0.35), total: Math.round(total * 0.35) },
      { name: 'Planes', count: Math.round(ventas.length * 0.25), total: Math.round(total * 0.25) },
      { name: 'Seguros', count: Math.round(ventas.length * 0.15), total: Math.round(total * 0.10) },
      { name: 'Tiquetes', count: Math.round(ventas.length * 0.20), total: Math.round(total * 0.25) },
      { name: 'Traslados', count: Math.round(ventas.length * 0.05), total: Math.round(total * 0.05) }
    ];
  },

  initCharts(stats, categories) {
    var self = this;
    setTimeout(function() {
      self.renderCategoryChart(categories);
      self.renderCarteraChart(stats);
    }, 100);
  },

  renderCategoryChart(categories) {
    var canvas = document.getElementById('categoryChart');
    if (!canvas || typeof Chart === 'undefined') return;

    var ctx = canvas.getContext('2d');
    var colors = ['#06b6d4', '#8b5cf6', '#ec4899', '#f97316', '#22c55e'];
    var labels = ['Hoteles', 'Planes', 'Seguros', 'Tiquetes', 'Traslados'];
    var values = categories.map(function(c) { return c.total; });

    try {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: colors,
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          cutout: '65%'
        }
      });
    } catch(e) { console.log('Chart error:', e); }
  },

  renderCarteraChart(stats) {
    var canvas = document.getElementById('carteraChart');
    if (!canvas || typeof Chart === 'undefined') return;

    var ctx = canvas.getContext('2d');

    try {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Pagado', 'Abonado', 'Pendiente'],
          datasets: [{
            data: [stats.pagado, stats.abonado, stats.Pendiente],
            backgroundColor: ['#22c55e', '#2563eb', '#f59e0b'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          cutout: '65%'
        }
      });
    } catch(e) { console.log('Chart error:', e); }
  },

  refreshData() {
    showNotification('Datos actualizados');
    app.refreshData();
  },

  exportData() {
    showNotification('Exportando datos...');
  }
};

window.Dashboard = Dashboard;