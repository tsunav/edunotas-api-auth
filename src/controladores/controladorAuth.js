/**
 * Controlador de autenticación.
 *
 * Los controladores reciben las peticiones HTTP, delegan la lógica
 * al servicio y devuelven la respuesta apropiada.
 *
 * @autor Aprendiz SENA
 */

const servicioAuth = require('../servicios/servicioAuth');
const { validarDatosRegistro, esCorreoValido } = require('../utilidades/validaciones');

/**
 * POST /api/auth/registro
 * Registra un nuevo usuario.
 *
 * Body esperado:
 * {
 *   "nombre": "María Pérez",
 *   "correo": "maria@edunotas.com",
 *   "password": "MiContrasena123",
 *   "rol": "docente"    (opcional, por defecto "docente")
 * }
 */
async function registrar(req, res) {
    try {
        const datos = req.body;

        // Validar los datos entrantes
        const validacion = validarDatosRegistro(datos);
        if (!validacion.valido) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Datos inválidos',
                errores: validacion.errores
            });
        }

        // Registrar el usuario a través del servicio
        const usuarioCreado = await servicioAuth.registrarUsuario(datos);

        // Respuesta exitosa
        return res.status(201).json({
            exito: true,
            mensaje: 'Usuario registrado exitosamente',
            usuario: usuarioCreado
        });

    } catch (error) {
        // Si el error es por correo duplicado, devolver 409 (Conflict)
        if (error.codigo === 'CORREO_DUPLICADO') {
            return res.status(409).json({
                exito: false,
                mensaje: error.message
            });
        }

        // Cualquier otro error
        console.error('Error en registro:', error);
        return res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            detalle: error.message
        });
    }
}

/**
 * POST /api/auth/login
 * Autentica un usuario y devuelve un token JWT.
 *
 * Body esperado:
 * {
 *   "correo": "admin@edunotas.com",
 *   "password": "Admin123!"
 * }
 *
 * Respuesta exitosa:
 * {
 *   "exito": true,
 *   "mensaje": "Autenticación satisfactoria",
 *   "token": "eyJhbGciOi...",
 *   "usuario": { id, nombre, correo, rol }
 * }
 *
 * Respuesta error:
 * {
 *   "exito": false,
 *   "mensaje": "Error en la autenticación"
 * }
 */
async function login(req, res) {
    try {
        const { correo, password } = req.body;

        // Validaciones básicas
        if (!correo || !password) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El correo y la contraseña son obligatorios'
            });
        }

        if (!esCorreoValido(correo)) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El formato del correo no es válido'
            });
        }

        // Autenticar
        const resultado = await servicioAuth.autenticarUsuario(correo, password);

        return res.status(200).json({
            exito: true,
            mensaje: 'Autenticación satisfactoria',
            token: resultado.token,
            usuario: resultado.usuario
        });

    } catch (error) {
        // Credenciales incorrectas → 401 Unauthorized
        if (error.codigo === 'CREDENCIALES_INVALIDAS') {
            return res.status(401).json({
                exito: false,
                mensaje: 'Error en la autenticación: credenciales incorrectas'
            });
        }

        console.error('Error en login:', error);
        return res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            detalle: error.message
        });
    }
}

/**
 * GET /api/auth/verificar
 * Verifica que el token JWT enviado sea válido.
 *
 * Requiere el header: Authorization: Bearer <token>
 */
async function verificar(req, res) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                exito: false,
                mensaje: 'Token no proporcionado'
            });
        }

        // Extraer el token del header
        const token = authHeader.substring(7);

        // Verificar y decodificar
        const payload = servicioAuth.verificarToken(token);

        return res.status(200).json({
            exito: true,
            mensaje: 'Token válido',
            usuario: payload
        });

    } catch (error) {
        return res.status(401).json({
            exito: false,
            mensaje: 'Token inválido o expirado'
        });
    }
}

/**
 * GET /api/auth/usuarios
 * Lista todos los usuarios registrados (solo para propósitos de prueba).
 */
async function listarUsuarios(req, res) {
    const usuarios = servicioAuth.listarUsuarios();
    return res.status(200).json({
        exito: true,
        total: usuarios.length,
        usuarios
    });
}

module.exports = {
    registrar,
    login,
    verificar,
    listarUsuarios,
};
