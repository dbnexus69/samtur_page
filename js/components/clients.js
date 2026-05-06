const Clients = {
  render(data, user) {
    return `
      <div class="card">
        <div class="card-header">
          <h2>Lista de Clientes</h2>
          <button class="btn btn-primary" onclick="openModal('client-modal')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Nuevo Cliente
          </button>
        </div>
        <div class="card-body">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre Completo</th>
                  <th>Tipo Doc</th>
                  <th>Número Doc</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${data.clients.length > 0 ? data.clients.map(client => `
                  <tr>
                    <td>${client.id}</td>
                    <td>${client.name}</td>
                    <td>${client.docType}</td>
                    <td>${client.docNumber}</td>
                    <td>${client.phone}</td>
                    <td>${client.email}</td>
                    <td>${formatDate(client.registrationDate)}</td>
                    <td>
                      <div class="table-actions">
                        <button class="btn btn-outline btn-sm" onclick="Clients.viewClient(${client.id})">Ver</button>
                        <button class="btn btn-outline btn-sm" onclick="Clients.editClient(${client.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="Clients.deleteClient(${client.id})">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="8" class="text-center">No hay clientes registrados</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="modal-overlay" id="client-modal">
        <div class="modal">
          <div class="modal-header">
            <h2 id="client-modal-title">Nuevo Cliente</h2>
            <button class="modal-close" onclick="closeModal('client-modal')">&times;</button>
          </div>
          <form id="client-form">
            <div class="modal-body">
              <input type="hidden" id="client-id">
              <div class="form-group">
                <label for="client-name">Nombre Completo</label>
                <input type="text" id="client-name" required placeholder="Nombre completo">
              </div>
              <div class="form-group">
                <label for="client-doc-type">Tipo de Documento</label>
                <select id="client-doc-type" required>
                  <option value="">Seleccionar...</option>
                  ${data.config.documentTypes.map(dt => `<option value="${dt.name}">${dt.name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label for="client-doc-number">Número de Documento</label>
                <input type="text" id="client-doc-number" required placeholder="Número de documento">
              </div>
              <div class="form-group">
                <label for="client-phone">Teléfono</label>
                <input type="tel" id="client-phone" required placeholder="3001234567">
              </div>
              <div class="form-group">
                <label for="client-email">Correo Electrónico</label>
                <input type="email" id="client-email" required placeholder="correo@ejemplo.com">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" onclick="closeModal('client-modal')">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
      </div>

      <div class="modal-overlay" id="client-detail-modal">
        <div class="modal" style="max-width: 600px;">
          <div class="modal-header">
            <h2>Detalle del Cliente</h2>
            <button class="modal-close" onclick="closeModal('client-detail-modal')">&times;</button>
          </div>
          <div class="modal-body" id="client-detail-content"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" onclick="closeModal('client-detail-modal')">Cerrar</button>
          </div>
        </div>
      </div>
    `;
  },

  viewClient(id) {
    const data = getData();
    const client = data.clients.find(c => c.id === id);
    if (!client) return;

    const clientSales = data.sales.filter(s => s.clientId === id);
    const content = document.getElementById('client-detail-content');
    
    content.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h3 style="margin-bottom: 16px;">Información del Cliente</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div><strong>Nombre:</strong> ${client.name}</div>
          <div><strong>Tipo Doc:</strong> ${client.docType}</div>
          <div><strong>Número:</strong> ${client.docNumber}</div>
          <div><strong>Teléfono:</strong> ${client.phone}</div>
          <div><strong>Correo:</strong> ${client.email}</div>
          <div><strong>Registro:</strong> ${formatDate(client.registrationDate)}</div>
        </div>
      </div>
      <div>
        <h3 style="margin-bottom: 16px;">Historial de Compras (${clientSales.length})</h3>
        ${clientSales.length > 0 ? `
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Valor</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                ${clientSales.map(sale => `
                  <tr>
                    <td>${sale.id}</td>
                    <td>${formatDate(sale.date)}</td>
                    <td>${formatCurrency(sale.total)}</td>
                    <td><span class="status-badge ${sale.status}">${sale.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : '<p>No hay compras registradas</p>'}
      </div>
    `;
    
    openModal('client-detail-modal');
  },

  editClient(id) {
    const data = getData();
    const client = data.clients.find(c => c.id === id);
    if (!client) return;

    document.getElementById('client-modal-title').textContent = 'Editar Cliente';
    document.getElementById('client-id').value = client.id;
    document.getElementById('client-name').value = client.name;
    document.getElementById('client-doc-type').value = client.docType;
    document.getElementById('client-doc-number').value = client.docNumber;
    document.getElementById('client-phone').value = client.phone;
    document.getElementById('client-email').value = client.email;
    
    openModal('client-modal');
  },

  deleteClient(id) {
    if (!confirm('¿Está seguro de eliminar este cliente?')) return;
    
    const data = getData();
    data.clients = data.clients.filter(c => c.id !== id);
    saveData(data);
    showNotification('Cliente eliminado');
    app.refreshData();
  },

  init(data) {
    const form = document.getElementById('client-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        Clients.saveClient(data);
      });
    }
  }
};

window.Clients = Clients;