const Sales = {
  render(data, user) {
    return `
      <div class="card">
        <div class="sales-summary">
          <div class="summary-item">
            <div class="label">Total Ventas</div>
            <div class="value">${formatCurrency(data.sales.reduce((sum, s) => sum + s.total, 0))}</div>
          </div>
          <div class="summary-item">
            <div class="label">Pagado</div>
            <div class="value" style="color: var(--success);">${formatCurrency(data.sales.filter(s => s.status === 'pagado').reduce((sum, s) => sum + s.total, 0))}</div>
          </div>
          <div class="summary-item">
            <div class="label">Pendiente</div>
            <div class="value" style="color: var(--warning);">${formatCurrency(data.sales.filter(s => s.status === 'pendiente').reduce((sum, s) => sum + s.total, 0))}</div>
          </div>
        </div>
        <div class="card-header">
          <h2>Lista de Ventas</h2>
          <button class="btn btn-primary" onclick="openModal('sale-modal')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Nueva Venta
          </button>
        </div>
        <div class="card-body">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Cliente</th>
                  <th>Vendedor</th>
                  <th>Fecha</th>
                  <th>Valor</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody id="sales-table-body">
                ${data.sales.length > 0 ? data.sales.map(sale => `
                  <tr>
                    <td>${sale.id}</td>
                    <td>${sale.clientName}</td>
                    <td>${sale.vendorName}</td>
                    <td>${formatDate(sale.date)}</td>
                    <td>${formatCurrency(sale.total)}</td>
                    <td><span class="status-badge ${sale.status}">${sale.status === 'pagado' ? 'Pagado' : sale.status === 'abonado' ? 'Abonado' : 'Pendiente'}</span></td>
                    <td>
                      <div class="table-actions">
                        <button class="btn btn-outline btn-sm" onclick="Sales.viewSale(${sale.id})">Ver</button>
                        <button class="btn btn-outline btn-sm" onclick="Sales.editSale(${sale.id})">Editar</button>
                      </div>
                    </td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="7" class="text-center">No hay ventas registradas</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="modal-overlay" id="sale-modal">
        <div class="modal">
          <div class="modal-header">
            <h2 id="sale-modal-title">Nueva Venta</h2>
            <button class="modal-close" onclick="closeModal('sale-modal')">&times;</button>
          </div>
          <form id="sale-form">
            <div class="modal-body">
              <input type="hidden" id="sale-id">
              <div class="form-group">
                <label for="sale-client">Cliente</label>
                <select id="sale-client" required>
                  <option value="">Seleccionar cliente...</option>
                  ${data.clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label for="sale-total">Valor Total</label>
                <input type="number" id="sale-total" required min="0" step="1000" placeholder="0">
              </div>
              <div class="form-group">
                <label for="sale-payment">Forma de Pago</label>
                <select id="sale-payment" required>
                  <option value="">Seleccionar...</option>
                  ${data.config.paymentMethods.map(pm => `<option value="${pm.name}">${pm.name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label for="sale-status">Estado</label>
                <select id="sale-status" required>
                  <option value="pendiente">Pendiente</option>
                  <option value="abonado">Abonado</option>
                  <option value="pagado">Pagado</option>
                </select>
              </div>
              <div class="form-group">
                <label for="sale-observations">Observaciones</label>
                <textarea id="sale-observations" rows="3" placeholder="Detalles de la venta..."></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" onclick="closeModal('sale-modal')">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  init(data) {
    const form = document.getElementById('sale-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        Sales.saveSale(data);
      });
    }
  },

  viewSale(id) {
    const data = getData();
    const sale = data.sales.find(s => s.id === id);
    if (!sale) return;
    
    const client = data.clients.find(c => c.id === sale.clientId);
    alert(`Detalles de Venta #${sale.id}\n\nCliente: ${sale.clientName}\nVendedor: ${sale.vendorName}\nFecha: ${formatDate(sale.date)}\nValor: ${formatCurrency(sale.total)}\nEstado: ${sale.status}\nForma de Pago: ${sale.paymentMethod}\n\nObservaciones:\n${sale.observations || 'Sin observaciones'}`);
  },

  editSale(id) {
    const data = getData();
    const sale = data.sales.find(s => s.id === id);
    if (!sale) return;

    document.getElementById('sale-modal-title').textContent = 'Editar Venta';
    document.getElementById('sale-id').value = sale.id;
    document.getElementById('sale-client').value = sale.clientId;
    document.getElementById('sale-total').value = sale.total;
    document.getElementById('sale-payment').value = sale.paymentMethod || '';
    document.getElementById('sale-status').value = sale.status;
    document.getElementById('sale-observations').value = sale.observations || '';
    
    openModal('sale-modal');
  },

  saveSale(data) {
    const id = document.getElementById('sale-id').value;
    const clientId = parseInt(document.getElementById('sale-client').value);
    const client = data.clients.find(c => c.id === clientId);
    const total = parseInt(document.getElementById('sale-total').value);
    const paymentMethod = document.getElementById('sale-payment').value;
    const status = document.getElementById('sale-status').value;
    const observations = document.getElementById('sale-observations').value;

    if (!client) {
      showNotification('Debe seleccionar un cliente', 'error');
      return;
    }

    const currentUser = getCurrentUser();

    if (id) {
      const index = data.sales.findIndex(s => s.id === parseInt(id));
      if (index !== -1) {
        data.sales[index] = {
          ...data.sales[index],
          clientId,
          clientName: client.name,
          total,
          paymentMethod,
          status,
          observations
        };
      }
      showNotification('Venta actualizada');
    } else {
      const newSale = {
        id: generateId(data.sales),
        clientId,
        clientName: client.name,
        vendorId: currentUser.id,
        vendorName: currentUser.name,
        date: new Date().toISOString().split('T')[0],
        total,
        paymentMethod,
        status,
        observations
      };
      data.sales.push(newSale);
      showNotification('Venta registrada');
    }

    saveData(data);
    closeModal('sale-modal');
    app.refreshData();
  }
};

window.Sales = Sales;