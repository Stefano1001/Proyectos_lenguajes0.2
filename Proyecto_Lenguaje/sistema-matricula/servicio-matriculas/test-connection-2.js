const mongoose = require('mongoose');
const uri = 'mongodb://127.0.0.1:27017/sistema_matricula?family=4';

console.log('Intentando conectar a:', uri);

mongoose.connect(uri)
    .then(() => {
        console.log('✅ Conectado a MongoDB exitosamente');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error al conectar:', err);
        process.exit(1);
    });
