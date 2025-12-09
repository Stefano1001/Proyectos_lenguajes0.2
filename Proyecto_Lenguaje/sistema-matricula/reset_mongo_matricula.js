const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config(); // Cargar .env

// Esquema Mínimo para borrar
const MatriculaSchema = new mongoose.Schema({}, { strict: false });
const Matricula = mongoose.model('Matricula', MatriculaSchema);

async function resetMongo() {
    console.log('--- LIMPIANDO MATRÍCULAS EN MONGODB ---');
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sistema_matricula');
        console.log('✅ Conectado a MongoDB.');

        const result = await Matricula.deleteMany({});
        console.log(`✅ Colección de matrículas vaciada. ${result.deletedCount} registros eliminados.`);

        console.log('--- SINCRONIZACIÓN COMPLETA ---');

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

resetMongo();
