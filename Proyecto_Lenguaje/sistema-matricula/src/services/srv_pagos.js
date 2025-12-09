const express = require('express');
const router = express.Router();
const pool = require('../config/db_mysql');
const mongoose = require('mongoose');

// Definir esquema de Pagos en Mongo (inline para simplicidad)
const PagoSchema = new mongoose.Schema({
    id_usuario: Number,
    monto: Number,
    concepto: String,
    fecha: { type: Date, default: Date.now },
    metodo: String
});
const Pago = mongoose.model('Pago', PagoSchema);

// REALIZAR PAGO
router.post('/pagar-matricula', async (req, res) => {
    const { id_usuario, monto } = req.body;

    try {
        // 1. Registrar en MongoDB (Historial)
        const nuevoPago = new Pago({
            id_usuario,
            monto: monto || 500.00,
            concepto: 'MATRICULA_2024_1',
            metodo: 'TARJETA'
        });
        await nuevoPago.save();

        // 2. Actualizar estado en MySQL
        await pool.query('UPDATE usuarios SET estado_pago_matricula = TRUE WHERE id_usuario = ?', [id_usuario]);

        res.json({ exito: true, mensaje: 'Pago realizado con éxito. Ya puedes verificar tu turno.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ exito: false, mensaje: 'Error al procesar el pago' });
    }
});

// OBTENER HISTORIAL DE PAGOS
router.get('/historial/:id_usuario', async (req, res) => {
    try {
        const pagos = await Pago.find({ id_usuario: req.params.id_usuario }).sort({ fecha: -1 });
        res.json({ exito: true, datos: pagos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ exito: false, mensaje: 'Error al obtener historial' });
    }
});

module.exports = router;
