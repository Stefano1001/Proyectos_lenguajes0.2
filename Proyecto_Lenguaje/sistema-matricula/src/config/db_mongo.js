const mongoose = require('mongoose');
const keys = require('./keys');

const mongoURI = keys.database.mongo.uri;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('✅ Conectado a MongoDB (Matrículas)');
    } catch (err) {
        console.error('❌ Error conectando a MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
