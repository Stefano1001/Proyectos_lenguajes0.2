// login.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formLogin');
  const alerta = document.getElementById('alerta');

  // Check if already logged in
  if (Auth.getUser()) {
    window.location.href = 'vistas/menu.html';
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const correo = document.getElementById('correo').value;
    const clave = document.getElementById('clave').value;
    const btnSubmit = form.querySelector('button[type="submit"]');
    const originalBtnText = btnSubmit.innerHTML;

    // UI Loading State
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<span>Verificando...</span>';
    alerta.innerHTML = '';

    try {
      // Note: Adjust port if your backend runs on a different one (e.g. 3001, 3000)
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, clave })
      });

      const data = await res.json();

      if (data.exito) {
        // Success
        Auth.login(data.datos);

        alerta.innerHTML = `
                    <div class="alert alert-success">
                        <span>¡Bienvenido! Redirigiendo...</span>
                    </div>
                `;

        setTimeout(() => {
          window.location.href = 'vistas/menu.html';
        }, 1000);

      } else {
        // Error from server
        throw new Error(data.mensaje || 'Credenciales incorrectas');
      }

    } catch (err) {
      console.error(err);
      alerta.innerHTML = `
                <div class="alert alert-error">
                    <span>${err.message || 'Error de conexión con el servidor'}</span>
                </div>
            `;
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = originalBtnText;
    }
  });
});