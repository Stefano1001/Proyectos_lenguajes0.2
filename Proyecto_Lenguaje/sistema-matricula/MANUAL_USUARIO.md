# 📘 Manual de Usuario - Sistema de Matrícula UTP v2.0

Bienvenido al Sistema de Matrícula Microservicios. Este documento detalla cómo utilizar las nuevas funcionalidades del sistema.

## 🏗️ Arquitectura del Sistema
El sistema se ha particionado en múltiples servicios para modularidad:
- **Puerto 3000**: Frontend (Interfaz Web)
- **Puerto 3001**: Auth (Login y Usuarios)
- **Puerto 3002**: Cursos (Académico)
- **Puerto 3003**: Matrícula y Reportes
- **Puerto 3004**: Pagos (Facturación)

---

## 🚀 Inicio Rápido (Credenciales de Prueba)

### 👨‍🎓 Alumnos
| Rol | Usuario | Contraseña | DNI | Situación |
| :--- | :--- | :--- | :--- | :--- |
| **Alumno Top** | `alumno1@utp.edu.pe` | `alumno123` | `12345678` | ✅ Habilitado (Paga y Matricula rápido) |
| **Alumno Deudor** | `alumno2@utp.edu.pe` | `alumno123` | `87654321` | 🔴 Debe Pago (Apoderado debe pagar) |

### 👨‍👩‍👦 Apoderados
| Rol | Usuario | Contraseña | Funcionalidad |
| :--- | :--- | :--- | :--- |
| **Apoderado** | `padre@gmail.com` | `padre123` | Busca alumnos por DNI y paga matrículas |

---

## 📖 Guía de Uso

### 1. 🎓 Portal del Alumno
1.  **Ingreso**: Usa tu correo institucional y contraseña.
2.  **Dashboard (Semáforo)**:
    *   🔴 **Pago Pendiente**: Debes pagar la matrícula primero.
    *   🟡 **Turno de Espera**: Debes esperar a la fecha/hora indicada (basada en tu promedio).
    *   🟢 **¡Ya puedes matricularte!**: Tienes luz verde.
3.  **Realizar Pagos**:
    *   Ve a la sección **"Pagos"** en el menú lateral.
    *   Verás tu historial de transacciones.
    *   Si tienes deuda, el sistema te permitirá pagar con un clic (Simulación S/ 500).
4.  **Matrícula**:
    *   Clic en **"Iniciar Inscripción"**.
    *   Verás la lista de cursos disponibles para tu carrera y ciclo.
    *   Clic en "Inscribir". El sistema validará **Cruces de Horario** y **Vacantes** en tiempo real.
5.  **Reportes**:
    *   Clic en **"Mi Horario"** para descargar tu **Constancia de Matrícula en PDF** oficial.

### 2. 👨‍👩‍👦 Portal del Apoderado
1.  Ingresa con tu correo de apoderado.
2.  **Búsqueda por DNI**:
    *   Ingresa el DNI del estudiante (ej: `87654321`).
    *   El sistema te mostrará el estado actual del alumno.
3.  **Gestión**:
    *   Si el alumno debe matrícula, aparecerá el botón **"Pagar Matrícula"**.
    *   Si ya está habilitado, podrás ver el detalle.

### 3. 👨‍🏫 Portal del Profesor
*   Accede manualmente a `http://localhost:3000/profesor.html`.
*   Podrás ver tus secciones asignadas y gestionar el ingreso de notas.

---

## 🛠️ Solución de Problemas
*   **Error de Conexión**: Asegúrate de que `server.js` esté corriendo y que veas los mensajes de "Servicio corriendo en -> http://localhost:XXXX" para los 5 servicios.
*   **Base de Datos**: Si es la primera vez, ejecuta `node setup_databases.js` para crear las tablas y datos de prueba.

---
*Desarrollado por el Equipo de Arquitectura de Software - UTP*
