const mysql = require('mysql2/promise');
const keys = require('./keys');

const pool = mysql.createPool({
    host: keys.database.mysql.host,
    user: keys.database.mysql.user,
    password: keys.database.mysql.password,
    database: keys.database.mysql.name,
    port: keys.database.mysql.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('✅ Conectado a MySQL (Usuarios)');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error conectando a MySQL:', err.message);
    });

module.exports = pool;
