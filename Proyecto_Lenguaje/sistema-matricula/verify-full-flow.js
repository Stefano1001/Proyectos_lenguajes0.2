const axios = require('axios');

const API_USUARIOS = 'http://127.0.0.1:3001/api';
const API_MATRICULAS = 'http://127.0.0.1:3002/api';
const API_CURSOS = 'http://127.0.0.1:3003/api';

async function verificarFlujo() {
    console.log('🚀 Iniciando verificación completa del sistema...\n');

    try {
        // 1. Registro de Alumno
        const dni = 'TEST' + Math.floor(Math.random() * 10000);
        const correo = `test${Math.floor(Math.random() * 10000)}@correo.com`;
        console.log(`1. Registrando alumno (DNI: ${dni})...`);

        const regRes = await axios.post(`${API_USUARIOS}/registro`, {
            nombre_completo: 'Alumno Test',
            dni,
            ciclo: 1,
            genero: 'Masculino',
            correo,
            clave: '123456'
        });

        if (regRes.data.exito) {
            console.log('✅ Registro exitoso en MySQL y MongoDB.');
        } else {
            console.error('❌ Falló el registro:', regRes.data.mensaje);
            return;
        }

        // 2. Login
        console.log('\n2. Iniciando sesión...');
        const loginRes = await axios.post(`${API_USUARIOS}/login`, {
            correo,
            clave: '123456'
        });

        if (loginRes.data.exito) {
            console.log('✅ Login exitoso. Datos:', loginRes.data.datos);
        } else {
            console.error('❌ Falló el login');
            return;
        }

        // 3. Listar Cursos (Ciclo 1)
        console.log('\n3. Listando cursos...');
        const cursosRes = await axios.get(`${API_CURSOS}/cursos`);
        const cursos = cursosRes.data.datos;
        console.log(`✅ Se encontraron ${cursos.length} cursos.`);

        const cursoCiclo1 = cursos.find(c => c.ciclo === 1);
        if (cursoCiclo1) {
            console.log(`   Curso seleccionado: ${cursoCiclo1.nombre_curso} (ID: ${cursoCiclo1.id_curso})`);
        } else {
            console.error('❌ No se encontraron cursos del ciclo 1.');
            return;
        }

        // 4. Crear Matrícula (Simulando lo que hace el frontend)
        console.log('\n4. Creando matrícula...');
        // Necesitamos el ID de alumno de MongoDB. 
        // En el flujo real, el frontend lo tendría o lo buscaría.
        // Vamos a buscar el alumno en MongoDB por DNI para obtener su _id
        const alumnosRes = await axios.get(`${API_MATRICULAS}/alumnos`);
        const alumnoMongo = alumnosRes.data.datos.find(a => a.dni === dni);

        if (!alumnoMongo) {
            console.error('❌ El alumno no se creó en MongoDB (Fallo de sincronización).');
            return;
        }
        console.log(`   Alumno en MongoDB encontrado: ${alumnoMongo.nombre_completo} (ID: ${alumnoMongo._id}, Código: ${alumnoMongo.codigo_alumno})`);

        const matRes = await axios.post(`${API_MATRICULAS}/matriculas`, {
            id_alumno: alumnoMongo._id,
            nombre_alumno: alumnoMongo.nombre_completo,
            dni_alumno: dni,
            id_curso: cursoCiclo1.id_curso,
            anio_escolar: 2024
        });

        if (matRes.data.exito) {
            console.log(`✅ Matrícula creada exitosamente. Código: ${matRes.data.datos.codigo_matricula}`);
        } else {
            console.error('❌ Falló la matrícula:', matRes.data.mensaje);
        }

    } catch (error) {
        console.error('❌ Error fatal en la prueba:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        } else {
            console.error('   Stack:', error.stack);
        }
    }
}

verificarFlujo();
