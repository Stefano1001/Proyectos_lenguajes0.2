// db.js
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const conexionBD = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Rodri123',
  database: process.env.DB_NAME || 'sistema_usuarios',
  port: process.env.DB_PORT || 3306
});

conexionBD.connect((err) => {
  if (err) {
    console.error('Error al conectar con MySQL (Usuarios):', err);
    return;
  }
  console.log('Conectado a MySQL - sistema_usuarios');
});

module.exports = conexionBD;