const Login = {
  render() {
    return `
      <div class="login-container">
        <div class="login-card">
          <div class="login-logo">
            <h1>Samtour</h1>
            <p>Agencia de Viajes</p>
          </div>
          <form id="login-form">
            <div class="form-group">
              <label for="email">Correo electrónico</label>
              <input type="email" id="email" name="email" required placeholder="correo@ejemplo.com">
            </div>
            <div class="form-group">
              <label for="password">Contraseña</label>
              <input type="password" id="password" name="password" required placeholder="••••••••">
            </div>
            <button type="submit" class="btn btn-primary btn-block">Iniciar Sesión</button>
          </form>
          <div style="margin-top: 24px; padding: 16px; background: var(--gray-50); border-radius: var(--radius); font-size: 12px;">
            <strong>Cuentas demo:</strong><br>
            Admin: admin@samtour.com / admin123<br>
            Vendedor: juan@samtour.com / vendor123
          </div>
        </div>
      </div>
    `;
  },

  init(app) {
    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      app.login(email, password);
    });
  }
};