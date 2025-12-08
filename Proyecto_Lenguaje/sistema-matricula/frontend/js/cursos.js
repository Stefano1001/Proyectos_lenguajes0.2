// cursos.js
const API_C = 'http://localhost:3003';

// Verificar sesión
const usuario = JSON.parse(localStorage.getItem('usuario'));
if (!usuario) {
  window.location.href = '../index.html';
} else {
  document.getElementById('usuarioNombre').textContent = usuario.nombre || 'Usuario';
}

async function cargarCursos() {
  const cont = document.getElementById('cursosList');
  const rol = usuario.rol || usuario.tipo;

  // Si es alumno, ocultar formulario de creación
  if (rol === 'alumno') {
    const cardForm = document.getElementById('cardFormCurso');
    if (cardForm) cardForm.style.display = 'none';
    const mainGrid = document.querySelector('.main-content > div');
    if (mainGrid) mainGrid.style.gridTemplateColumns = '1fr';
  }

  try {
    const res = await fetch(`${API_C}/api/cursos`);
    const data = await res.json();

    if (!data.exito) {
      cont.innerHTML = `<div class="alert alert-error">Error al cargar datos</div>`;
      return;
    }

    if (data.datos.length === 0) {
      cont.innerHTML = '<p style="color: var(--text-light);">No hay cursos registrados.</p>';
      return;
    }

    cont.innerHTML = data.datos.map(c => `
      <div class="card" style="padding: 1rem; margin-bottom: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong style="color: var(--primary); font-size: 1.1rem;">${c.nombre_curso}</strong>
            <div style="font-size: 0.9rem; color: var(--text-light);">
              Ciclo: ${c.ciclo}
            </div>
          </div>
          <div style="font-size: 0.8rem; background: var(--background); padding: 0.25rem 0.5rem; border-radius: 4px;">
            ID: ${c.id_curso}
          </div>
        </div>
        <p style="margin-top: 0.5rem; font-size: 0.9rem;">${c.descripcion || 'Sin descripción'}</p>
      </div>
    `).join('');
  } catch (err) {
    cont.innerHTML = `<div class="alert alert-error">Error de conexión</div>`;
  }
}

async function crearCurso(e) {
  e.preventDefault();

  const payload = {
    nombre_curso: document.getElementById('nombre_curso').value,
    ciclo: Number(document.getElementById('ciclo').value),
    descripcion: document.getElementById('descripcion').value
  };

  try {
    const res = await fetch(`${API_C}/api/cursos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.exito) {
      const form = document.getElementById('formCurso');
      const msg = document.createElement('div');
      msg.className = 'alert alert-success';
      msg.textContent = 'Curso creado exitosamente';
      form.prepend(msg);
      setTimeout(() => msg.remove(), 3000);

      cargarCursos();
      form.reset();
    } else {
      const form = document.getElementById('formCurso');
      const msg = document.createElement('div');
      msg.className = 'alert alert-error';
      msg.textContent = data.mensaje || 'Error al crear curso';
      form.prepend(msg);
      setTimeout(() => msg.remove(), 3000);
    }
  } catch (err) {
    console.error(err);
  }
}

const formCurso = document.getElementById('formCurso');
if (formCurso) {
  formCurso.addEventListener('submit', crearCurso);
}
cargarCursos();
