const App = {
  currentRoute: '/',
  user: null,
  data: null,

  init() {
    this.data = getData();
    this.user = getCurrentUser();
    
    if (!this.user) {
      this.renderLogin();
    } else {
      this.renderApp();
      this.navigate(window.location.hash || '#/');
    }

    window.addEventListener('hashchange', () => {
      this.navigate(window.location.hash);
    });
  },

  navigate(hash) {
    const route = hash.replace('#', '') || '/';
    
    if (!this.user && route !== '/login') {
      this.renderLogin();
      return;
    }

    if (!this.user) {
      this.renderLogin();
      return;
    }

    const permissions = this.user.role === 'admin' 
      ? ['/', '/sales', '/clients', '/flights', '/users', '/config']
      : ['/', '/sales', '/clients', '/flights'];

    if (!permissions.includes(route)) {
      this.navigate('#/');
      return;
    }

    this.currentRoute = route;
    this.renderMain();
    this.renderModule();
  },

  login(email, password) {
    const user = this.data.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      showNotification('Credenciales incorrectas', 'error');
      return false;
    }

    if (user.status === 'inactive') {
      showNotification('Usuario inactivo', 'error');
      return false;
    }

    this.user = user;
    setCurrentUser(user);
    this.renderApp();
    this.navigate('#/');
    showNotification(`Bienvenido, ${user.name}`);
    return true;
  },

  logout() {
    this.user = null;
    setCurrentUser(null);
    this.renderLogin();
    window.location.hash = '';
    showNotification('Sesión cerrada');
  },

  renderLogin() {
    const app = document.getElementById('app');
    app.innerHTML = Login.render();
    Login.init(this);
  },

  renderApp() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="app-container">
        ${this.renderSidebar()}
        <main class="main-content">
          ${this.renderHeader()}
          <div class="content" id="module-content"></div>
        </main>
      </div>
    `;
  },

  renderSidebar() {
    const permissions = this.user.role === 'admin'
      ? [
          { route: '/', icon: 'dashboard', label: 'Dashboard' },
          { route: '/sales', icon: 'sales', label: 'Ventas' },
          { route: '/clients', icon: 'clients', label: 'Clientes' },
          { route: '/flights', icon: 'flights', label: 'Control de Vuelos' },
          { route: '/users', icon: 'users', label: 'Usuarios' },
          { route: '/config', icon: 'config', label: 'Configuración' }
        ]
      : [
          { route: '/', icon: 'dashboard', label: 'Dashboard' },
          { route: '/sales', icon: 'sales', label: 'Ventas' },
          { route: '/clients', icon: 'clients', label: 'Clientes' },
          { route: '/flights', icon: 'flights', label: 'Control de Vuelos' }
        ];

    return `
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-logo">Samtour</div>
        </div>
        <nav class="sidebar-nav">
          ${permissions.map(item => `
            <a href="#${item.route}" class="nav-item ${this.currentRoute === item.route ? 'active' : ''}" data-route="${item.route}">
              ${this.getIcon(item.icon)}
              <span>${item.label}</span>
            </a>
          `).join('')}
        </nav>
        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">${getInitials(this.user.name)}</div>
            <div class="user-details">
              <div class="user-name">${this.user.name}</div>
              <div class="user-role">${this.user.role === 'admin' ? 'Administrador' : 'Vendedor'}</div>
            </div>
            <button class="logout-btn" onclick="app.logout()">
              ${this.getIcon('logout')}
            </button>
          </div>
        </div>
      </aside>
    `;
  },

  renderHeader() {
    return `
      <header class="header">
        <div class="breadcrumb">
          <span>Samtour</span>
          <span>/</span>
          <strong>${getPageTitle(this.currentRoute)}</strong>
        </div>
        <div class="header-actions">
          <span>${new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </header>
    `;
  },

  renderMain() {
    document.getElementById('module-content').innerHTML = '';
    document.querySelector('.sidebar').outerHTML = this.renderSidebar();
    document.querySelector('.header').outerHTML = this.renderHeader();
  },

  renderModule() {
    const content = document.getElementById('module-content');
    
    switch (this.currentRoute) {
      case '/':
        content.innerHTML = Dashboard.render(this.data, this.user);
        setTimeout(() => {
          const stats = Dashboard.calculateStats(this.data);
          const categories = Dashboard.getServicesByCategory(this.data);
          Dashboard.initCharts(stats, categories);
        }, 150);
        break;
      case '/sales':
        content.innerHTML = Sales.render(this.data, this.user);
        Sales.init(this.data);
        break;
      case '/clients':
        content.innerHTML = Clients.render(this.data, this.user);
        Clients.init(this.data);
        break;
      case '/flights':
        content.innerHTML = Flights.render(this.data, this.user);
        break;
      case '/users':
        content.innerHTML = Users.render(this.data, this.user);
        Users.init(this.data);
        break;
      case '/config':
        content.innerHTML = Config.render(this.data, this.user);
        Config.init(this.data);
        break;
    }
  },

  getIcon(name) {
    const icons = {
      dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
      sales: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',
      clients: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
      flights: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L2 22"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',
      users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>',
      config: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
      logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>'
    };
    return icons[name] || '';
  },

  refreshData() {
    this.data = getData();
    this.renderModule();
  }
};

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

window.app = App;

const chartGlobal = typeof Chart !== 'undefined' ? Chart : null;

window.addEventListener('DOMContentLoaded', () => app.init());