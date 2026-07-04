/**
 * Middleware para autenticar peticiones.
 *
 * Este middleware verifica que la petición traiga un token JWT válido
 * en el header Authorization. Si es válido, agrega el usuario decodificado
 * a req.usuario y llama a next(). Si no, devuelve 401.
 *
 * Uso: aplicar a rutas privadas.
 *   router.get('/perfil', autenticar, (req, res) => { ... });
 *
 * @autor Aprendiz SENA
 */

const { verificarToken } = require('../servicios/servicioAuth');

function autenticar(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                exito: false,
                mensaje: 'Debes proporcionar un token de autenticación'
            });
        }

        const token = authHeader.substring(7);
        const payload = verificarToken(token);

        // Adjuntar el usuario decodificado a la petición
        req.usuario = payload;
        next();

    } catch (error) {
        return res.status(401).json({
            exito: false,
            mensaje: 'Token inválido o expirado'
        });
    }
}

module.exports = autenticar;
