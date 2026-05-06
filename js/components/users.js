const Users = {
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

    return `
      <div class="card">
        <div class="card-header">
          <h2>Usuarios del Sistema</h2>
          <button class="btn btn-primary" onclick="openModal('user-modal')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Nuevo Usuario
          </button>
        </div>
        <div class="card-body">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${data.users.length > 0 ? data.users.map(u => `
                  <tr>
                    <td>${u.id}</td>
                    <td>${u.name}</td>
                    <td>${u.email}</td>
                    <td>${u.role === 'admin' ? 'Administrador' : 'Vendedor'}</td>
                    <td><span class="status-badge ${u.status}">${u.status === 'active' ? 'Activo' : 'Inactivo'}</span></td>
                    <td>
                      <div class="table-actions">
                        <button class="btn btn-outline btn-sm" onclick="Users.editUser(${u.id})">Editar</button>
                        <button class="btn btn-outline btn-sm" onclick="Users.toggleStatus(${u.id})">${u.status === 'active' ? 'Desactivar' : 'Activar'}</button>
                      </div>
                    </td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="6" class="text-center">No hay usuarios registrados</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="modal-overlay" id="user-modal">
        <div class="modal">
          <div class="modal-header">
            <h2 id="user-modal-title">Nuevo Usuario</h2>
            <button class="modal-close" onclick="closeModal('user-modal')">&times;</button>
          </div>
          <form id="user-form">
            <div class="modal-body">
              <input type="hidden" id="user-id">
              <div class="form-group">
                <label for="user-name">Nombre Completo</label>
                <input type="text" id="user-name" required placeholder="Nombre completo">
              </div>
              <div class="form-group">
                <label for="user-email">Correo Electrónico</label>
                <input type="email" id="user-email" required placeholder="correo@ejemplo.com">
              </div>
              <div class="form-group">
                <label for="user-password">Contraseña</label>
                <input type="password" id="user-password" required placeholder="Contraseña">
              </div>
              <div class="form-group">
                <label for="user-role">Rol</label>
                <select id="user-role" required>
                  <option value="vendor">Vendedor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" onclick="closeModal('user-modal')">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  editUser(id) {
    const data = getData();
    const user = data.users.find(u => u.id === id);
    if (!user) return;

    document.getElementById('user-modal-title').textContent = 'Editar Usuario';
    document.getElementById('user-id').value = user.id;
    document.getElementById('user-name').value = user.name;
    document.getElementById('user-email').value = user.email;
    document.getElementById('user-password').value = user.password;
    document.getElementById('user-role').value = user.role;
    
    openModal('user-modal');
  },

  toggleStatus(id) {
    const data = getData();
    const user = data.users.find(u => u.id === id);
    if (!user) return;

    if (user.id === getCurrentUser().id) {
      showNotification('No puedes desactivar tu propio usuario', 'error');
      return;
    }

    user.status = user.status === 'active' ? 'inactive' : 'active';
    saveData(data);
    showNotification(`Usuario ${user.status === 'active' ? 'activado' : 'desactivado'}`);
    app.refreshData();
  },

  init(data) {
    const form = document.getElementById('user-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        Users.saveUser(data);
      });
    }
  }
};

window.Users = Users;