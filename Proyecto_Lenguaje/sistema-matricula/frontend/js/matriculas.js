// matriculas.js
const API_M = 'http://localhost:3002';

// Verificar sesión
const usuario = JSON.parse(localStorage.getItem('usuario'));
if (!usuario) {
  window.location.href = '../index.html';
} else {
  document.getElementById('usuarioNombre').textContent = usuario.nombre || 'Usuario';
}

async function cargarMatriculas() {
  const cont = document.getElementById('matriculasList');
  const rol = usuario.rol || usuario.tipo;

  // Si es alumno, ocultar formulario de creación
  if (rol === 'alumno') {
    const cardForm = document.querySelector('.card h3').parentNode;
    if (cardForm) cardForm.style.display = 'none';
    const mainGrid = document.querySelector('.main-content > div');
    if (mainGrid) mainGrid.style.gridTemplateColumns = '1fr';
  }

  try {
    const res = await fetch(`${API_M}/api/matriculas`);
    const data = await res.json();

    if (!data.exito) {
      cont.innerHTML = `<div class="alert alert-error">Error al cargar datos</div>`;
      return;
    }

    let matriculas = data.datos;

    if (rol === 'alumno') {
      // Filtrar por DNI del usuario logueado (si existe)
      // Nota: Idealmente el backend debería filtrar, pero lo hacemos aquí por rapidez
      if (usuario.dni) {
        matriculas = matriculas.filter(m => m.dni_alumno === usuario.dni);
      }
    }

    if (matriculas.length === 0) {
      cont.innerHTML = '<p style="color: var(--text-light);">No hay matrículas registradas.</p>';
      return;
    }

    cont.innerHTML = matriculas.map(m => `
      <div class="card" style="padding: 1rem; margin-bottom: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong style="color: var(--primary);">${m.codigo_matricula}</strong>
            <div style="font-size: 0.9rem; color: var(--text-light);">
              ${m.nombre_alumno || 'Alumno ID: ' + m.id_alumno}
            </div>
            <div style="font-size: 0.8rem; margin-top: 0.5rem;">
              Curso ID: ${m.id_curso || 'N/A'} | Sección ID: ${m.id_seccion || 'N/A'}
            </div>
          </div>
          <span style="background: #e2e8f0; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">
            ${m.estado_matricula}
          </span>
        </div>
      </div>
    `).join('');
  } catch (err) {
    cont.innerHTML = `<div class="alert alert-error">Error de conexión</div>`;
  }
}

async function crearMatricula(e) {
  e.preventDefault();

  // Validaciones básicas
  const idCurso = document.getElementById('id_curso').value;
  const idSeccion = document.getElementById('id_seccion').value;

  if (idCurso && idCurso <= 0) {
    alert('El ID del curso debe ser válido');
    return;
  }

  const payload = {
    // codigo_matricula se genera en backend ahora
    id_alumno: document.getElementById('id_alumno').value,
    nombre_alumno: document.getElementById('nombre_alumno').value,
    dni_alumno: document.getElementById('dni_alumno').value,
    id_curso: Number(idCurso) || null,
    id_seccion: Number(idSeccion) || null,
    anio_escolar: new Date().getFullYear()
  };

  try {
    const res = await fetch(`${API_M}/api/matriculas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.exito) {
      const form = document.getElementById('formMatricula');
      const msg = document.createElement('div');
      msg.className = 'alert alert-success';
      msg.textContent = 'Matrícula creada exitosamente: ' + data.datos.codigo_matricula;
      form.prepend(msg);
      setTimeout(() => msg.remove(), 3000);

      cargarMatriculas();
      form.reset();
    } else {
      const form = document.getElementById('formMatricula');
      const msg = document.createElement('div');
      msg.className = 'alert alert-error';
      msg.textContent = data.mensaje || 'Error al crear matrícula';
      form.prepend(msg);
      setTimeout(() => msg.remove(), 3000);
    }
  } catch (err) {
    console.error(err);
  }
}

const formMatricula = document.getElementById('formMatricula');
if (formMatricula) {
  formMatricula.addEventListener('submit', crearMatricula);
}
cargarMatriculas();
