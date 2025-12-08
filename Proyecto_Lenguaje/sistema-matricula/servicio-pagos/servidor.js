// servidor.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const puerto = process.env.PORT || 3005;

app.use(cors());
app.use(bodyParser.json());

require('./db');

const pagoControl = require('./controladores/pagoControl');

app.post('/api/pagos', pagoControl.registrarPago);
app.get('/api/pagos/apoderado/:apoderadoId', pagoControl.listarPagosPorApoderado);
app.post('/api/pagos/generar-cuotas', pagoControl.generarCuotas);
app.get('/api/cuotas/:id_pago', pagoControl.listarCuotasPorPago);
app.get('/api/cuotas/:id_pago', pagoControl.listarCuotasPorPago);
app.post('/api/cuotas/:id_cuota/pagar', pagoControl.pagarCuota);
app.get('/api/pagos/buscar', pagoControl.buscarPagos);

app.listen(puerto, () => {
  console.log(`Servicio de Pagos funcionando en http://localhost:${puerto}`);
});
