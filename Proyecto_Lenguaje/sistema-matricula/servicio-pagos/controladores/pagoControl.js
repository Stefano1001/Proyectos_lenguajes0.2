// controladores/pagoControl.js
const conexion = require('../db');

// Registrar pago
exports.registrarPago = (req, res) => {
  const { id_matricula, id_apoderado, monto_total, monto_pagado, numero_cuotas } = req.body;
  if (!id_matricula || !id_apoderado || !monto_total) {
    return res.status(400).json({ exito: false, mensaje: 'Faltan datos obligatorios' });
  }
  const consulta = `INSERT INTO pagos (id_matricula, id_apoderado, monto_total, monto_pagado, numero_cuotas, cuotas_pagadas, estado_pago)
                    VALUES (?, ?, ?, ?, ?, 0, 'pendiente')`;
  conexion.query(consulta, [id_matricula, id_apoderado, monto_total, monto_pagado || 0, numero_cuotas || 1], (error, result) => {
    if (error) return res.status(500).json({ exito: false, mensaje: 'Error al registrar pago' });
    return res.json({ exito: true, mensaje: 'Pago registrado', id_pago: result.insertId });
  });
};

// Listar pagos por apoderado
exports.listarPagosPorApoderado = (req, res) => {
  const { apoderadoId } = req.params;
  const consulta = `SELECT p.*, a.dni as dni_apoderado, a.telefono FROM pagos p
                    LEFT JOIN apoderados a ON p.id_apoderado = a.id_apoderado
                    WHERE p.id_apoderado = ? ORDER BY p.fecha_pago DESC`;
  conexion.query(consulta, [apoderadoId], (error, results) => {
    if (error) return res.status(500).json({ exito: false, mensaje: 'Error al listar pagos' });
    return res.json({ exito: true, datos: results });
  });
};

// Generar cuotas (divide monto_total en cuotas)
exports.generarCuotas = (req, res) => {
  const { id_pago } = req.body;
  if (!id_pago) return res.status(400).json({ exito: false, mensaje: 'Falta id_pago' });

  // Buscar pago
  conexion.query('SELECT * FROM pagos WHERE id_pago = ?', [id_pago], (err, rows) => {
    if (err) return res.status(500).json({ exito: false, mensaje: 'Error al consultar pago' });
    if (rows.length === 0) return res.status(404).json({ exito: false, mensaje: 'Pago no encontrado' });
    const pago = rows[0];
    const total = Number(pago.monto_total);
    const cuotas = Number(pago.numero_cuotas) || 1;
    const montoCuota = parseFloat((total / cuotas).toFixed(2));

    // Insertar cuotas
    const queries = [];
    for (let i = 1; i <= cuotas; i++) {
      queries.push(new Promise((resolve, reject) => {
        conexion.query(
          'INSERT INTO cuotas (id_pago, numero_cuota, monto_cuota, fecha_vencimiento, estado) VALUES (?, ?, ?, DATE_ADD(CURDATE(), INTERVAL ? MONTH), ?)',
          [id_pago, i, montoCuota, i - 1, 'pendiente'],
          (e, r) => e ? reject(e) : resolve(r)
        )
      }));
    }

    Promise.all(queries).then(() => {
      return res.json({ exito: true, mensaje: 'Cuotas generadas' });
    }).catch(() => {
      return res.status(500).json({ exito: false, mensaje: 'Error al generar cuotas' });
    });
  });
};

// Pagar cuota
exports.pagarCuota = (req, res) => {
  const { id_cuota } = req.params;
  const { fecha_pago } = req.body; // opcional
  conexion.query('SELECT * FROM cuotas WHERE id_cuota = ?', [id_cuota], (err, rows) => {
    if (err) return res.status(500).json({ exito: false, mensaje: 'Error al consultar cuota' });
    if (rows.length === 0) return res.status(404).json({ exito: false, mensaje: 'Cuota no encontrada' });
    const cuota = rows[0];
    if (cuota.estado === 'pagado') return res.status(400).json({ exito: false, mensaje: 'Cuota ya pagada' });

    conexion.query('UPDATE cuotas SET estado = ?, fecha_pago = ? WHERE id_cuota = ?', ['pagado', fecha_pago || new Date(), id_cuota], (e) => {
      if (e) return res.status(500).json({ exito: false, mensaje: 'Error al registrar pago de cuota' });
      // actualizar pago (cuotas_pagadas y monto_pagado)
      conexion.query('UPDATE pagos SET cuotas_pagadas = cuotas_pagadas + 1, monto_pagado = monto_pagado + ? WHERE id_pago = ?',
        [cuota.monto_cuota, cuota.id_pago], (err2) => {
          if (err2) return res.status(500).json({ exito: false, mensaje: 'Error al actualizar pago' });
          return res.json({ exito: true, mensaje: 'Cuota pagada correctamente' });
        });
    });
  });
};

// Listar cuotas por pago
exports.listarCuotasPorPago = (req, res) => {
  const { id_pago } = req.params;
  conexion.query('SELECT * FROM cuotas WHERE id_pago = ? ORDER BY numero_cuota', [id_pago], (err, rows) => {
    if (err) return res.status(500).json({ exito: false, mensaje: 'Error al listar cuotas' });
    return res.json({ exito: true, datos: rows });
  });
};
// Buscar pagos por DNI
exports.buscarPagos = (req, res) => {
  const { termino } = req.query; // DNI
  if (!termino) return res.status(400).json({ exito: false, mensaje: 'Falta término de búsqueda' });

  // Asumimos que buscamos por DNI en la tabla apoderados (o usuarios si se migró)
  // Dado que el usuario pidió eliminar apoderados, idealmente deberíamos haber migrado pagos a usuarios.
  // Por ahora, buscaremos en la tabla que tenga el DNI vinculado al pago.

  const consulta = `SELECT p.*, a.dni, a.nombre_completo FROM pagos p
                    LEFT JOIN apoderados a ON p.id_apoderado = a.id_apoderado
                    WHERE a.dni = ?`;

  conexion.query(consulta, [termino], (error, results) => {
    if (error) return res.status(500).json({ exito: false, mensaje: 'Error al buscar pagos' });
    return res.json({ exito: true, datos: results });
  });
};
