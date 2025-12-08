const { spawn } = require('child_process');
const path = require('path');

const services = [
    'servicio-usuarios',
    'servicio-matriculas',
    'servicio-cursos',
    'servicio-profesores',
    'servicio-pagos'
];

console.log('🚀 Iniciando todos los servicios...');

services.forEach(service => {
    const servicePath = path.join(__dirname, service);
    console.log(`👉 Iniciando ${service}...`);

    const child = spawn('npm', ['start'], {
        cwd: servicePath,
        shell: true,
        stdio: 'inherit'
    });

    child.on('error', (err) => {
        console.error(`❌ Error al iniciar ${service}:`, err);
    });
});
