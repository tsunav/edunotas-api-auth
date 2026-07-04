/**
 * Rutas de autenticación.
 *
 * Define los endpoints HTTP y los conecta con las funciones del controlador.
 *
 * Todas estas rutas están prefijadas con /api/auth (ver servidor.js)
 *
 * @autor Aprendiz SENA
 */

const express = require('express');
const router = express.Router();
const controlador = require('../controladores/controladorAuth');

// POST /api/auth/registro → registrar un nuevo usuario
router.post('/registro', controlador.registrar);

// POST /api/auth/login → autenticarse
router.post('/login', controlador.login);

// GET /api/auth/verificar → validar token
router.get('/verificar', controlador.verificar);

// GET /api/auth/usuarios → listar (solo para pruebas)
router.get('/usuarios', controlador.listarUsuarios);

module.exports = router;
