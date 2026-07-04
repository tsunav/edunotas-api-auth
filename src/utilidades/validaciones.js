/**
 * Utilidades de validación de datos.
 *
 * @autor Aprendiz SENA
 */

const { minCaracteresPassword } = require('./configuracion');

/**
 * Valida el formato de un correo electrónico.
 *
 * @param {string} correo - correo a validar
 * @returns {boolean} true si es válido
 */
function esCorreoValido(correo) {
    if (!correo || typeof correo !== 'string') return false;
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(correo);
}

/**
 * Valida que una contraseña cumpla los requisitos mínimos.
 *
 * @param {string} password - contraseña a validar
 * @returns {object} { valida: boolean, mensaje: string }
 */
function validarPassword(password) {
    if (!password || typeof password !== 'string') {
        return { valida: false, mensaje: 'La contraseña es obligatoria' };
    }

    if (password.length < minCaracteresPassword) {
        return {
            valida: false,
            mensaje: `La contraseña debe tener al menos ${minCaracteresPassword} caracteres`
        };
    }

    // Verificar que tenga al menos una letra y un número
    const tieneLetra = /[a-zA-Z]/.test(password);
    const tieneNumero = /[0-9]/.test(password);

    if (!tieneLetra || !tieneNumero) {
        return {
            valida: false,
            mensaje: 'La contraseña debe contener al menos una letra y un número'
        };
    }

    return { valida: true, mensaje: 'Contraseña válida' };
}

/**
 * Valida los datos completos para un registro.
 *
 * @param {object} datos - datos del usuario a registrar
 * @returns {object} { valido: boolean, errores: object }
 */
function validarDatosRegistro(datos) {
    const errores = {};

    if (!datos.nombre || datos.nombre.trim().length < 3) {
        errores.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!esCorreoValido(datos.correo)) {
        errores.correo = 'El correo no tiene un formato válido';
    }

    const validacionPass = validarPassword(datos.password);
    if (!validacionPass.valida) {
        errores.password = validacionPass.mensaje;
    }

    return {
        valido: Object.keys(errores).length === 0,
        errores
    };
}

module.exports = {
    esCorreoValido,
    validarPassword,
    validarDatosRegistro,
};
