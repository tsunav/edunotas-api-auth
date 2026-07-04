/**
 * Servicio de autenticación.
 *
 * Encapsula la lógica de:
 *   - Registro de nuevos usuarios
 *   - Login (verificación de credenciales)
 *   - Generación y verificación de tokens JWT
 *   - Hash de contraseñas con bcrypt
 *
 * ⚠️ IMPORTANTE: En este ejercicio los usuarios se almacenan en memoria
 * (array de JavaScript). En un proyecto real se guardarían en una BD.
 *
 * @autor Aprendiz SENA
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecreto, jwtExpiracion, bcryptRondas } = require('../utilidades/configuracion');

// ============ "BASE DE DATOS" EN MEMORIA ============

/**
 * Lista de usuarios en memoria.
 * Cada usuario tiene: id, nombre, correo, passwordHash, rol, fechaRegistro
 *
 * Ya hay un usuario admin creado por defecto para probar.
 */
const usuarios = [
    {
        id: 1,
        nombre: 'Administrador',
        correo: 'admin@edunotas.com',
        // Hash de "Admin123!" pre-generado con bcrypt
        passwordHash: '$2a$10$mVwaqYkD.wU7XcfEYq6XmuT7z0j5j8QqQVwFAJ.O5x9oB.Y0J8Rma',
        rol: 'admin',
        fechaRegistro: new Date('2026-01-01').toISOString()
    }
];

// Contador para IDs autoincrementales
let siguienteId = 2;

// ============ FUNCIONES DEL SERVICIO ============

/**
 * Registra un nuevo usuario.
 *
 * Pasos:
 *   1. Verificar que el correo no esté ya registrado
 *   2. Hashear la contraseña con bcrypt (nunca guardar texto plano)
 *   3. Guardar el usuario en la lista
 *
 * @param {object} datos - { nombre, correo, password, rol }
 * @returns {object} usuario creado (sin la contraseña)
 * @throws {Error} si el correo ya existe
 */
async function registrarUsuario(datos) {
    const { nombre, correo, password, rol = 'docente' } = datos;

    // 1. Verificar que el correo no exista
    const existente = usuarios.find(u => u.correo.toLowerCase() === correo.toLowerCase());
    if (existente) {
        const error = new Error('Ya existe un usuario con ese correo');
        error.codigo = 'CORREO_DUPLICADO';
        throw error;
    }

    // 2. Hashear la contraseña con bcrypt
    // NUNCA guardes contraseñas en texto plano en la BD
    const passwordHash = await bcrypt.hash(password, bcryptRondas);

    // 3. Crear el usuario
    const nuevoUsuario = {
        id: siguienteId++,
        nombre: nombre.trim(),
        correo: correo.toLowerCase().trim(),
        passwordHash,
        rol,
        fechaRegistro: new Date().toISOString()
    };

    usuarios.push(nuevoUsuario);

    // Devolver el usuario SIN el passwordHash (nunca exponer hashes)
    return sinPassword(nuevoUsuario);
}

/**
 * Autentica un usuario con correo y contraseña.
 *
 * Pasos:
 *   1. Buscar el usuario por correo
 *   2. Comparar la contraseña con el hash guardado (bcrypt.compare)
 *   3. Generar un token JWT si es correcto
 *
 * @param {string} correo
 * @param {string} password
 * @returns {object} { token, usuario } o error
 */
async function autenticarUsuario(correo, password) {
    // 1. Buscar por correo (insensible a mayúsculas)
    const usuario = usuarios.find(u => u.correo.toLowerCase() === correo.toLowerCase());

    if (!usuario) {
        const error = new Error('Correo o contraseña incorrectos');
        error.codigo = 'CREDENCIALES_INVALIDAS';
        throw error;
    }

    // 2. Comparar contraseña con el hash
    const passwordCorrecta = await bcrypt.compare(password, usuario.passwordHash);

    if (!passwordCorrecta) {
        const error = new Error('Correo o contraseña incorrectos');
        error.codigo = 'CREDENCIALES_INVALIDAS';
        throw error;
    }

    // 3. Generar el token JWT con los datos del usuario
    const token = generarToken(usuario);

    return {
        token,
        usuario: sinPassword(usuario)
    };
}

/**
 * Genera un token JWT firmado con la clave secreta.
 *
 * @param {object} usuario - usuario a incluir en el token
 * @returns {string} token JWT
 */
function generarToken(usuario) {
    const payload = {
        id: usuario.id,
        correo: usuario.correo,
        rol: usuario.rol
    };

    return jwt.sign(payload, jwtSecreto, {
        expiresIn: jwtExpiracion
    });
}

/**
 * Verifica y decodifica un token JWT.
 *
 * @param {string} token - token a verificar
 * @returns {object} payload decodificado
 * @throws {Error} si el token es inválido o expiró
 */
function verificarToken(token) {
    return jwt.verify(token, jwtSecreto);
}

/**
 * Devuelve una copia del usuario sin el campo passwordHash.
 * Esto evita exponer hashes en las respuestas de la API.
 */
function sinPassword(usuario) {
    const { passwordHash, ...usuarioSinPass } = usuario;
    return usuarioSinPass;
}

/**
 * Lista todos los usuarios (útil para pruebas).
 */
function listarUsuarios() {
    return usuarios.map(sinPassword);
}

module.exports = {
    registrarUsuario,
    autenticarUsuario,
    verificarToken,
    listarUsuarios,
};
