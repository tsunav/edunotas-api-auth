/**
 * Servidor principal de la API de autenticación EduNotas.
 *
 * Este archivo:
 *   1. Configura Express (framework web para Node.js)
 *   2. Aplica middlewares globales (CORS, JSON parser, logs)
 *   3. Registra las rutas de la API
 *   4. Arranca el servidor en el puerto configurado
 *
 * Evidencia: GA7-220501096-AA5-EV01
 *
 * @autor Aprendiz SENA
 * @version 1.0
 */

const express = require('express');
const cors = require('cors');

// Importar las rutas
const rutasAuth = require('./rutas/rutasAuth');

// Crear la aplicación Express
const app = express();

// ============ MIDDLEWARES GLOBALES ============

// CORS: permite peticiones desde otros dominios (necesario para el frontend)
app.use(cors());

// Parser de JSON: permite que Express lea el body de peticiones JSON
app.use(express.json());

// Middleware de logs: imprime cada petición que llega
app.use((req, res, next) => {
    const fechaHora = new Date().toISOString();
    console.log(`[${fechaHora}] ${req.method} ${req.url}`);
    next();
});

// ============ RUTAS ============

// Ruta de prueba (health check)
app.get('/', (req, res) => {
    res.json({
        mensaje: '🎓 API de EduNotas funcionando correctamente',
        version: '1.0.0',
        endpoints: {
            registro: 'POST /api/auth/registro',
            login: 'POST /api/auth/login',
            verificar: 'GET  /api/auth/verificar'
        }
    });
});

// Registrar las rutas de autenticación bajo /api/auth
app.use('/api/auth', rutasAuth);

// ============ MANEJO DE ERRORES ============

// 404: ruta no encontrada
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        mensaje: `El endpoint ${req.method} ${req.url} no existe`
    });
});

// Manejador global de errores no capturados
app.use((error, req, res, next) => {
    console.error('Error no capturado:', error);
    res.status(500).json({
        error: 'Error interno del servidor',
        mensaje: error.message
    });
});

// ============ ARRANQUE DEL SERVIDOR ============

const PUERTO = process.env.PORT || 3000;

app.listen(PUERTO, () => {
    console.log('═══════════════════════════════════════════════════');
    console.log('  🎓 API EduNotas iniciada correctamente');
    console.log(`  🌐 URL: http://localhost:${PUERTO}`);
    console.log(`  📅 Fecha: ${new Date().toLocaleString()}`);
    console.log('═══════════════════════════════════════════════════');
});

module.exports = app;
