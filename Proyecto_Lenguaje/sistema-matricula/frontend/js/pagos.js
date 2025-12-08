// pagos.js
const API_P = 'http://localhost:3005';

// Verificar sesión
const usuario = JSON.parse(localStorage.getItem('usuario'));
if (!usuario) {
  window.location.href = '../index.html';
} else {
  document.getElementById('usuarioNombre').textContent = usuario.nombre || 'Usuario';
}

// Pre-llenar búsqueda si es alumno
if ((usuario.rol === 'alumno' || usuario.tipo === 'alumno') && usuario.dni) {
  document.getElementById('termino').value = usuario.dni;
  buscarPagos(usuario.dni);
}

document.getElementById('formBusqueda').addEventListener('submit', (e) => {
  e.preventDefault();
  const termino = document.getElementById('termino').value;
  buscarPagos(termino);
});

async function buscarPagos(termino) {
  const cont = document.getElementById('resultados');
  cont.innerHTML = '<p style="text-align: center;">Buscando...</p>';

  try {
    const res = await fetch(`${API_P}/api/pagos/buscar?termino=${termino}`);
    const data = await res.json();

    if (!data.exito) {
      cont.innerHTML = `<div class="alert alert-error">${data.mensaje || 'Error al buscar'}</div>`;
      return;
    }

    if (data.datos.length === 0) {
      cont.innerHTML = '<p style="text-align: center; color: var(--text-light);">No se encontraron pagos para este DNI.</p>';
      return;
    }

    cont.innerHTML = data.datos.map(p => `
      <div class="card" style="padding: 1rem; margin-bottom: 1rem; border-left: 4px solid var(--primary);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <strong style="font-size: 1.1rem;">Pago #${p.id_pago}</strong>
            <div style="color: var(--text-light); font-size: 0.9rem;">
              Matrícula ID: ${p.id_matricula}
            </div>
            <div style="margin-top: 0.5rem;">
              Monto Total: <strong>S/ ${p.monto_total}</strong>
            </div>
          </div>
          <div style="text-align: right;">
            <span style="background: ${p.estado_pago === 'completo' ? '#dcfce7' : '#fef9c3'}; color: ${p.estado_pago === 'completo' ? '#166534' : '#854d0e'}; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600;">
              ${p.estado_pago.toUpperCase()}
            </span>
            <div style="font-size: 0.8rem; margin-top: 0.5rem; color: var(--text-light);">
              Pagado: S/ ${p.monto_pagado}
            </div>
          </div>
        </div>
      </div>
    `).join('');

  } catch (err) {
    cont.innerHTML = `<div class="alert alert-error">Error de conexión con servicio de pagos</div>`;
    console.error(err);
  }
}
