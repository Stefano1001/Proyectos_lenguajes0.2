const SERVICES = {
    auth: 'http://localhost:3001/api/auth',
    matricula: 'http://localhost:3003/api/matricula',
    cursos: 'http://localhost:3002/api/cursos'
};

async function auditoria() {
    console.log('🔍 INICIANDO AUDITORÍA DEL SISTEMA DE MATRÍCULA...\n');

    try {
        // PASO 1: LOGIN (Obtener Usuario)
        console.log('1️⃣  Autenticando usuario alumno1...');
        const resLogin = await fetch(`${SERVICES.auth}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo: 'alumno1@utp.edu.pe', clave: 'alumno123' })
        });
        const dataLogin = await resLogin.json();
        
        if (!dataLogin.exito) throw new Error('Fallo en Login');
        const usuario = dataLogin.usuario;
        console.log(`   ✅ Usuario autenticado: ${usuario.nombre} (ID: ${usuario.id})`);

        // Datos de prueba (IDs basados en el seed load_courses.js)
        // Taller de Programación (ID Curso aprox 21, Sec 301) - Lunes 08:00
        // Cálculo I (ID Curso aprox 22, Sec 303 Conflictiva) - Lunes 09:00 (Cruza)
        
        // Primero necesitamos buscar los IDs reales consultando cursos
        const resCursos = await fetch(`${SERVICES.cursos}?carrera=Ingeniería de Sistemas&ciclo=3`);
        const dataCursos = await resCursos.json();
        const cursoTaller = dataCursos.datos.find(c => c.nombre_curso === 'Taller de Programación');
        const cursoCalculo = dataCursos.datos.find(c => c.nombre_curso === 'Cálculo I');
        
        console.log(`   ℹ️  IDs Identificados: Taller=${cursoTaller.id_curso}, Cálculo=${cursoCalculo.id_curso}`);

        // Obtener secciones
        const resSecTaller = await fetch(`${SERVICES.cursos}/${cursoTaller.id_curso}/secciones`);
        const dataSecTaller = await resSecTaller.json();
        const secTaller = dataSecTaller.datos.find(s => s.nombre_seccion === 'SEC-301');

        const resSecCalculo = await fetch(`${SERVICES.cursos}/${cursoCalculo.id_curso}/secciones`);
        const dataSecCalculo = await resSecCalculo.json();
        const secCalculoConflict = dataSecCalculo.datos.find(s => s.nombre_seccion.includes('Conflicto'));

        // PASO 2: LIMPIEZA PREVIA (Baja por si acaso)
        await fetch(`${SERVICES.matricula}/baja`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario: usuario.id, id_curso: cursoTaller.id_curso, id_seccion: secTaller.id_seccion })
        });
        await fetch(`${SERVICES.matricula}/baja`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario: usuario.id, id_curso: cursoCalculo.id_curso, id_seccion: secCalculoConflict.id_seccion })
        });


        // PASO 3: INSCRIBIR CURSO A (Taller)
        console.log('\n2️⃣  Intentando inscribir Curso A (Taller - Lunes 08:00)...');
        const resInsc1 = await fetch(`${SERVICES.matricula}/inscribir`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_usuario: usuario.id,
                id_curso: cursoTaller.id_curso,
                id_seccion: secTaller.id_seccion,
                nombre_curso: 'Taller Programación',
                horario_seccion: secTaller.horario
            })
        });
        const dataInsc1 = await resInsc1.json();
        if (dataInsc1.exito) console.log('   ✅ Inscripción exitosa en Taller.');
        else console.log('   Warning: ' + dataInsc1.mensaje);


        // PASO 4: INTENTAR CURSO B (Cálculo - Conflicto)
        console.log('\n3️⃣  Intentando inscribir Curso B (Cálculo - Conflicto Lunes 09:00)...');
        console.log('   ⚠️  Se espera ERROR por Cruce.');
        const resInsc2 = await fetch(`${SERVICES.matricula}/inscribir`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_usuario: usuario.id,
                id_curso: cursoCalculo.id_curso,
                id_seccion: secCalculoConflict.id_seccion,
                nombre_curso: 'Cálculo I',
                horario_seccion: secCalculoConflict.horario
            })
        });
        const dataInsc2 = await resInsc2.json();
        
        if (!dataInsc2.exito && dataInsc2.mensaje.includes('Cruce')) {
            console.log(`   ✅ SISTEMA RESPONDIÓ CORRECTAMENTE: "${dataInsc2.mensaje}"`);
        } else {
            console.error('   ❌ FALLO AUDITORÍA: El sistema permitió el cruce o dio otro error: ' + JSON.stringify(dataInsc2));
        }

        // PASO 5: DAR DE BAJA CURSO A
        console.log('\n4️⃣  Dando de baja Curso A (Liberando horario)...');
        const resBaja = await fetch(`${SERVICES.matricula}/baja`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario: usuario.id, id_curso: cursoTaller.id_curso, id_seccion: secTaller.id_seccion })
        });
        const dataBaja = await resBaja.json();
        if (dataBaja.exito) console.log('   ✅ Curso retirado correctamente.');
        else console.error('   ❌ Falla al retirar curso: ' + dataBaja.mensaje);


        // PASO 6: RE-INTENTAR CURSO B (Ahora debería pasar)
        console.log('\n5️⃣  Re-intentando Curso B (Ahora sin conflicto)...');
        const resInsc3 = await fetch(`${SERVICES.matricula}/inscribir`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_usuario: usuario.id,
                id_curso: cursoCalculo.id_curso,
                id_seccion: secCalculoConflict.id_seccion,
                nombre_curso: 'Cálculo I',
                horario_seccion: secCalculoConflict.horario
            })
        });
        const dataInsc3 = await resInsc3.json();
        if (dataInsc3.exito) console.log('   ✅ Inscripción exitosa (Validación dinámica correcta).');
        else console.error('   ❌ Fallo: ' + dataInsc3.mensaje);

        console.log('\n🏁 AUDITORÍA COMPLETADA.');

    } catch (e) {
        console.error('\n❌ ERROR CRÍTICO EN AUDITORÍA:', e);
    }
}

auditoria();
