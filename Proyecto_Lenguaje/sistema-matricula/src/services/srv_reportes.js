const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const mongoose = require('mongoose');

// Necesitamos acceder al modelo de Matrícula
const Matricula = mongoose.model('Matricula');

router.get('/horario/:id_usuario', async (req, res) => {
    try {
        const matricula = await Matricula.findOne({ id_usuario: req.params.id_usuario });

        if (!matricula || matricula.cursos.length === 0) {
            return res.status(404).send('No tienes matrícula registrada (Sin cursos).');
        }

        // Crear PDF
        const doc = new PDFDocument();

        // Configurar respuesta HTTP para descarga
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=horario_matricula.pdf');

        doc.pipe(res);

        // Encabezado Corporativo
        doc.rect(0, 0, 612, 80).fill('#D71920'); // Cabecera Roja
        doc.fillColor('white').fontSize(24).text('UTP', 50, 25, { align: 'left' });
        doc.fontSize(10).text('Universidad Tecnológica del Perú', 50, 50);
        doc.fontSize(16).text('CONSTANCIA DE MATRÍCULA', 0, 35, { align: 'right', width: 562 });

        doc.fillColor('black').moveDown(4);

        // Datos del Alumno
        doc.fontSize(12).font('Helvetica-Bold').text(`Código Estudiante: U2024${matricula.id_usuario}`);
        doc.font('Helvetica').text(`Periodo Académico: 2024 - Ciclo 1`);
        doc.text(`Fecha y Hora de Emisión: ${new Date().toLocaleString()}`);
        doc.moveDown();

        // Dibujar Tabla
        const tableTop = 200;
        const itemHeight = 30;

        // Cabecera de Tabla
        doc.font('Helvetica-Bold');
        doc.text('Curso', 50, tableTop);
        doc.text('Sección', 300, tableTop);
        doc.text('Horario', 400, tableTop);

        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

        let y = tableTop + 30;
        doc.font('Helvetica');

        matricula.cursos.forEach((curso) => {
            doc.text(curso.nombre_curso, 50, y);
            doc.text(curso.id_seccion.toString(), 300, y);

            let horarioTexto = '';
            curso.horario.forEach(h => {
                horarioTexto += `${h.dia} ${h.inicio}-${h.fin}\n`;
            });
            doc.text(horarioTexto, 400, y, { width: 150 });

            y += itemHeight + (curso.horario.length * 10);
            doc.moveTo(50, y - 5).lineTo(550, y - 5).strokeColor('#aaaaaa').stroke();
        });

        // Pie de Página
        doc.fontSize(10).text('Este documento es una constancia oficial generada por el sistema.', 50, 700, { align: 'center', color: 'grey' });

        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al generar PDF');
    }
});

module.exports = router;
