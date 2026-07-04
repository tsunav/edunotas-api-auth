/**
 * Configuración centralizada de la aplicación.
 *
 * En una aplicación real, estos valores vendrían de variables de entorno.
 * Para este ejercicio se dejan explícitos para facilitar la lectura.
 *
 * @autor Aprendiz SENA
 */

module.exports = {
    // Clave secreta para firmar los tokens JWT
    // ⚠️ En producción, cámbiala por una cadena aleatoria y NO la subas al repositorio
    jwtSecreto: 'edunotas-clave-super-secreta-2026',

    // Tiempo de expiración del token
    jwtExpiracion: '24h',

    // Cantidad de rondas de hash para bcrypt (10 es un buen valor por defecto)
    bcryptRondas: 10,

    // Requisitos de contraseña
    minCaracteresPassword: 8,
};
