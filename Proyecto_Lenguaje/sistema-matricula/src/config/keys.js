const dotenv = require('dotenv');
const path = require('path');

// Cargar .env desde la raíz
dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
    server: {
        port: process.env.PORT || 3000
    },
    database: {
        mysql: {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'Rodri123',
            name: process.env.DB_NAME || 'sistema_usuarios',
            port: process.env.DB_PORT || 3306
        },
        postgres: {
            host: process.env.PG_HOST || 'localhost',
            user: process.env.PG_USER || 'postgres',
            password: process.env.PG_PASSWORD || 'Rodri123',
            name: process.env.PG_DATABASE || 'sistema_academico',
            port: process.env.PG_PORT || 5432
        },
        mongo: {
            uri: process.env.MONGO_URI || 'mongodb://localhost:27017/sistema_matricula'
        }
    }
};
