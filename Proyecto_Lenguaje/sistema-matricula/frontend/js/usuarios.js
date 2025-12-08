// usuarios.js
const API = 'http://localhost:3001';

async function cargarUsuarios() {
  const cont = document.getElementById('usuariosList');

  try {
    const res = await fetch(`${API}/api/usuarios`);
    const data = await res.json();

    if (!data.exito) {
      cont.innerHTML = '<div class="alert alert-error">Error cargando usuarios</div>';
      return;
    }

    if (data.datos.length === 0) {
      cont.innerHTML = '<p class="text-center" style="padding: 1rem;">No hay usuarios registrados.</p>';
      return;
    }

    cont.innerHTML = data.datos.map(u => `
      <div class="card" style="padding: 1rem; margin-bottom: 1rem; border: 1px solid var(--border); box-shadow: none;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong style="color: var(--primary);">${u.nombre_completo}</strong>
                <div style="font-size: 0.9rem; color: var(--text-light);">${u.correo}</div>
                <span style="font-size: 0.75rem; background: var(--background); padding: 0.2rem 0.5rem; border-radius: 4px; text-transform: uppercase;">${u.tipo_usuario}</span>
            </div>
            <div>
                <button class="btn btn-danger" style="padding: 0.5rem;" onclick="eliminarUsuario(${u.id_usuario})" title="Eliminar">
                    🗑️
                </button>
            </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    cont.innerHTML = '<div class="alert alert-error">Error de conexión</div>';
  }
}

async function crearUsuario(e) {
  e.preventDefault();
  const nombre_completo = document.getElementById('nombre_completo').value;
  const correo = document.getElementById('correo').value;
  const clave = document.getElementById('clave').value;
  const tipo_usuario = document.getElementById('tipo_usuario').value;

  const btn = e.target.querySelector('button');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Creando...';

  try {
    const res = await fetch(`${API}/api/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre_completo, correo, clave, tipo_usuario })
    });
    const data = await res.json();

    if (data.exito) {
      // Show success message (simple alert for now, or custom toast)
      alert('Usuario creado exitosamente');
      cargarUsuarios();
      document.getElementById('formUsuario').reset();
    } else {
      alert(data.mensaje || 'Error al crear usuario');
    }
  } catch (err) {
    alert('Error de conexión');
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

async function eliminarUsuario(id) {
  if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

  try {
    await fetch(`${API}/api/usuarios/${id}`, { method: 'DELETE' });
    cargarUsuarios();
  } catch (err) {
    alert('Error al eliminar');
  }
}

document.getElementById('formUsuario').addEventListener('submit', crearUsuario);
cargarUsuarios();
