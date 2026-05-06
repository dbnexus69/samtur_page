const Config = {
  currentSection: 'cards',
  
  render(data, user) {
    if (user.role !== 'admin') {
      return `
        <div class="card">
          <div class="card-body">
            <div class="empty-state">
              <p>No tiene acceso a este módulo</p>
            </div>
          </div>
        </div>
      `;
    }

    const sections = [
      { id: 'cards', label: 'Tarjetas' },
      { id: 'paymentMethods', label: 'Formas de Pago' },
      { id: 'documentTypes', label: 'Tipos de Documento' },
      { id: 'airlines', label: 'Aerolíneas' },
      { id: 'suppliers', label: 'Proveedores' },
      { id: 'routes', label: 'Rutas' },
      { id: 'baggage', label: 'Equipaje' }
    ];

    const currentData = data.config[this.currentSection] || [];

    return `
      <div class="card">
        <div class="config-tabs">
          ${sections.map(s => `
            <button class="config-tab ${this.currentSection === s.id ? 'active' : ''}" onclick="Config.switchSection('${s.id}')">
              ${s.label}
            </button>
          `).join('')}
        </div>
        <div class="card-header">
          <h2>${sections.find(s => s.id === this.currentSection)?.label || 'Configuración'}</h2>
          <button class="btn btn-primary" onclick="openModal('config-modal')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Nuevo
          </button>
        </div>
        <div class="card-body">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  ${this.getTableHeaders()}
                </tr>
              </thead>
              <tbody>
                ${currentData.length > 0 ? currentData.map(item => `
                  <tr>
                    ${this.getTableRows(item)}
                    <td>
                      <div class="table-actions">
                        <button class="btn btn-outline btn-sm" onclick="Config.editItem(${item.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="Config.deleteItem(${item.id})">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="5" class="text-center">No hay registros</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="modal-overlay" id="config-modal">
        <div class="modal">
          <div class="modal-header">
            <h2 id="config-modal-title">Nuevo Registro</h2>
            <button class="modal-close" onclick="closeModal('config-modal')">&times;</button>
          </div>
          <form id="config-form">
            <div class="modal-body">
              ${this.getFormFields()}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" onclick="closeModal('config-modal')">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  switchSection(section) {
    this.currentSection = section;
    app.renderModule();
  },

  getTableHeaders() {
    const headers = {
      cards: '<th>#</th><th>Banco</th><th>Tipo</th>',
      paymentMethods: '<th>#</th><th>Nombre</th>',
      documentTypes: '<th>#</th><th>Nombre</th>',
      airlines: '<th>#</th><th>Nombre</th><th>Código</th>',
      suppliers: '<th>#</th><th>Nombre</th><th>Tipo</th><th>Contacto</th>',
      routes: '<th>#</th><th>Origen</th><th>Destino</th><th>Duración</th>',
      baggage: '<th>#</th><th>Nombre</th><th>Peso Máximo</th>'
    };
    return headers[this.currentSection] || '<th>#</th><th>Nombre</th>';
  },

  getTableRows(item) {
    const rows = {
      cards: `<td>${item.id}</td><td>${item.bank}</td><td>${item.type}</td>`,
      paymentMethods: `<td>${item.id}</td><td>${item.name}</td>`,
      documentTypes: `<td>${item.id}</td><td>${item.name}</td>`,
      airlines: `<td>${item.id}</td><td>${item.name}</td><td>${item.code}</td>`,
      suppliers: `<td>${item.id}</td><td>${item.name}</td><td>${item.type}</td><td>${item.contact}</td>`,
      routes: `<td>${item.id}</td><td>${item.origin}</td><td>${item.destination}</td><td>${item.duration}</td>`,
      baggage: `<td>${item.id}</td><td>${item.name}</td><td>${item.maxWeight}</td>`
    };
    return rows[this.currentSection] || `<td>${item.id}</td><td>${item.name}</td>`;
  },

  getFormFields() {
    const fields = {
      cards: `
        <input type="hidden" id="config-id">
        <div class="form-group">
          <label for="config-bank">Banco</label>
          <input type="text" id="config-bank" required placeholder="Nombre del banco">
        </div>
        <div class="form-group">
          <label for="config-type">Tipo</label>
          <select id="config-type" required>
            <option value="Crédito">Crédito</option>
            <option value="Débito">Débito</option>
          </select>
        </div>
      `,
      paymentMethods: `
        <input type="hidden" id="config-id">
        <div class="form-group">
          <label for="config-name">Nombre</label>
          <input type="text" id="config-name" required placeholder="Nombre de la forma de pago">
        </div>
      `,
      documentTypes: `
        <input type="hidden" id="config-id">
        <div class="form-group">
          <label for="config-name">Nombre</label>
          <input type="text" id="config-name" required placeholder="Tipo de documento">
        </div>
      `,
      airlines: `
        <input type="hidden" id="config-id">
        <div class="form-group">
          <label for="config-name">Nombre</label>
          <input type="text" id="config-name" required placeholder="Nombre de la aerolinea">
        </div>
        <div class="form-group">
          <label for="config-code">Código IATA</label>
          <input type="text" id="config-code" required placeholder="Código de 2 letras">
        </div>
      `,
      suppliers: `
        <input type="hidden" id="config-id">
        <div class="form-group">
          <label for="config-name">Nombre</label>
          <input type="text" id="config-name" required placeholder="Nombre del proveedor">
        </div>
        <div class="form-group">
          <label for="config-type">Tipo</label>
          <select id="config-type" required>
            <option value="Hotel">Hotel</option>
            <option value="Operador">Operador</option>
            <option value="Aerolínea">Aerolínea</option>
          </select>
        </div>
        <div class="form-group">
          <label for="config-contact">Contacto</label>
          <input type="email" id="config-contact" required placeholder="correo@ejemplo.com">
        </div>
      `,
      routes: `
        <input type="hidden" id="config-id">
        <div class="form-group">
          <label for="config-origin">Origen</label>
          <input type="text" id="config-origin" required placeholder="Ciudad de origen">
        </div>
        <div class="form-group">
          <label for="config-destination">Destino</label>
          <input type="text" id="config-destination" required placeholder="Ciudad de destino">
        </div>
        <div class="form-group">
          <label for="config-duration">Duración Estimada</label>
          <input type="text" id="config-duration" required placeholder="Ej: 2h 30m">
        </div>
      `,
      baggage: `
        <input type="hidden" id="config-id">
        <div class="form-group">
          <label for="config-name">Nombre</label>
          <input type="text" id="config-name" required placeholder="Tipo de equipaje">
        </div>
        <div class="form-group">
          <label for="config-max-weight">Peso Máximo (kg)</label>
          <input type="text" id="config-max-weight" required placeholder="Ej: 23 kg">
        </div>
      `
    };
    return fields[this.currentSection] || '<div class="form-group"><label for="config-name">Nombre</label><input type="text" id="config-name" required></div>';
  },

  editItem(id) {
    const data = getData();
    const item = data.config[this.currentSection].find(i => i.id === id);
    if (!item) return;

    document.getElementById('config-modal-title').textContent = 'Editar Registro';
    document.getElementById('config-id').value = item.id;

    if (this.currentSection === 'cards') {
      document.getElementById('config-bank').value = item.bank;
      document.getElementById('config-type').value = item.type;
    } else if (this.currentSection === 'airlines') {
      document.getElementById('config-name').value = item.name;
      document.getElementById('config-code').value = item.code;
    } else if (this.currentSection === 'suppliers') {
      document.getElementById('config-name').value = item.name;
      document.getElementById('config-type').value = item.type;
      document.getElementById('config-contact').value = item.contact;
    } else if (this.currentSection === 'routes') {
      document.getElementById('config-origin').value = item.origin;
      document.getElementById('config-destination').value = item.destination;
      document.getElementById('config-duration').value = item.duration;
    } else if (this.currentSection === 'baggage') {
      document.getElementById('config-name').value = item.name;
      document.getElementById('config-max-weight').value = item.maxWeight;
    } else {
      document.getElementById('config-name').value = item.name;
    }
    
    openModal('config-modal');
  },

  deleteItem(id) {
    if (!confirm('¿Está seguro de eliminar este registro?')) return;
    
    const data = getData();
    data.config[this.currentSection] = data.config[this.currentSection].filter(i => i.id !== id);
    saveData(data);
    showNotification('Registro eliminado');
    app.refreshData();
  },

  saveItem(data) {
    const id = document.getElementById('config-id').value;
    let item = {};

    if (this.currentSection === 'cards') {
      item = {
        id: id ? parseInt(id) : generateId(data.config.cards),
        bank: document.getElementById('config-bank').value,
        type: document.getElementById('config-type').value
      };
    } else if (this.currentSection === 'airlines') {
      item = {
        id: id ? parseInt(id) : generateId(data.config.airlines),
        name: document.getElementById('config-name').value,
        code: document.getElementById('config-code').value
      };
    } else if (this.currentSection === 'suppliers') {
      item = {
        id: id ? parseInt(id) : generateId(data.config.suppliers),
        name: document.getElementById('config-name').value,
        type: document.getElementById('config-type').value,
        contact: document.getElementById('config-contact').value
      };
    } else if (this.currentSection === 'routes') {
      item = {
        id: id ? parseInt(id) : generateId(data.config.routes),
        origin: document.getElementById('config-origin').value,
        destination: document.getElementById('config-destination').value,
        duration: document.getElementById('config-duration').value
      };
    } else if (this.currentSection === 'baggage') {
      item = {
        id: id ? parseInt(id) : generateId(data.config.baggage),
        name: document.getElementById('config-name').value,
        maxWeight: document.getElementById('config-max-weight').value
      };
    } else {
      item = {
        id: id ? parseInt(id) : generateId(data.config[this.currentSection]),
        name: document.getElementById('config-name').value
      };
    }

    if (id) {
      const index = data.config[this.currentSection].findIndex(i => i.id === parseInt(id));
      if (index !== -1) {
        data.config[this.currentSection][index] = item;
      }
    } else {
      data.config[this.currentSection].push(item);
    }

    saveData(data);
    showNotification(id ? 'Registro actualizado' : 'Registro guardado');
    closeModal('config-modal');
    app.refreshData();
  },

  init(data) {
    const form = document.getElementById('config-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        Config.saveItem(data);
      });
    }
  }
};

window.Config = Config;