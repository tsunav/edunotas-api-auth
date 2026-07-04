# EduNotas — API de Autenticación

**Evidencia:** GA7-220501096-AA5-EV01
**Programa:** Análisis y Desarrollo de Software (SENA)
**Tecnología:** Node.js + Express + JWT + bcrypt

## 📖 Descripción

Servicio web (API REST) para el **registro y el inicio de sesión** de usuarios del sistema **EduNotas**.

El servicio recibe un correo y una contraseña, valida las credenciales y devuelve un mensaje de autenticación satisfactoria (con un token JWT) o un error si las credenciales son incorrectas.

## ✨ Características

- ✅ Endpoint de **registro** con validación de datos
- ✅ Endpoint de **login** con verificación de contraseña
- ✅ **Hash de contraseñas** con bcrypt (nunca se guardan en texto plano)
- ✅ Generación de **tokens JWT** para autenticación
- ✅ Endpoint para **verificar tokens** en peticiones protegidas
- ✅ Validaciones de correo (regex) y contraseña
- ✅ Manejo de errores con códigos HTTP apropiados
- ✅ CORS habilitado para consumo desde el frontend
- ✅ Middleware para proteger rutas privadas

## 🏗️ Estructura del proyecto

```
NOMBRE_APELLIDO_AA5_EV01/
├── package.json
├── src/
│   ├── servidor.js                    ← Punto de entrada
│   ├── controladores/
│   │   └── controladorAuth.js         ← Recibe peticiones HTTP
│   ├── servicios/
│   │   └── servicioAuth.js            ← Lógica de autenticación
│   ├── rutas/
│   │   └── rutasAuth.js               ← Definición de endpoints
│   ├── middleware/
│   │   └── autenticar.js              ← Protege rutas privadas
│   └── utilidades/
│       ├── configuracion.js
│       └── validaciones.js
├── postman/
│   └── EduNotas-Auth.postman_collection.json
└── docs/
    └── INSTALACION.md
```

## ⚙️ Requisitos

- **Node.js 18** o superior (verifica con `node -v`)
- **npm** (viene con Node.js)

## 🚀 Cómo ejecutar

### 1. Instalar dependencias

```bash
cd NOMBRE_APELLIDO_AA5_EV01
npm install
```

Esto instala:
- **express**: framework web para Node.js
- **cors**: para permitir peticiones desde otros dominios
- **bcryptjs**: para hashear contraseñas
- **jsonwebtoken**: para generar tokens JWT

### 2. Ejecutar el servidor

```bash
npm start
```

Verás:

```
═══════════════════════════════════════════════════
  🎓 API EduNotas iniciada correctamente
  🌐 URL: http://localhost:3000
═══════════════════════════════════════════════════
```

### 3. Probar

Abre `http://localhost:3000/` en tu navegador. Debe responder con un JSON:

```json
{
  "mensaje": "🎓 API de EduNotas funcionando correctamente",
  "version": "1.0.0"
}
```

## 📡 Endpoints de la API

### `POST /api/auth/registro` — Registrar usuario

**Body:**
```json
{
  "nombre": "María Pérez",
  "correo": "maria@edunotas.com",
  "password": "MiClave123",
  "rol": "docente"
}
```

**Respuesta exitosa (201):**
```json
{
  "exito": true,
  "mensaje": "Usuario registrado exitosamente",
  "usuario": {
    "id": 2,
    "nombre": "María Pérez",
    "correo": "maria@edunotas.com",
    "rol": "docente",
    "fechaRegistro": "2026-07-03T21:45:00.000Z"
  }
}
```

**Respuesta con error (400 o 409):**
```json
{
  "exito": false,
  "mensaje": "Datos inválidos",
  "errores": {
    "correo": "El correo no tiene un formato válido"
  }
}
```

### `POST /api/auth/login` — Iniciar sesión

**Body:**
```json
{
  "correo": "admin@edunotas.com",
  "password": "Admin123!"
}
```

**Respuesta exitosa (200):**
```json
{
  "exito": true,
  "mensaje": "Autenticación satisfactoria",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nombre": "Administrador",
    "correo": "admin@edunotas.com",
    "rol": "admin"
  }
}
```

**Respuesta con error (401):**
```json
{
  "exito": false,
  "mensaje": "Error en la autenticación: credenciales incorrectas"
}
```

### `GET /api/auth/verificar` — Validar token

**Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta:**
```json
{
  "exito": true,
  "mensaje": "Token válido",
  "usuario": { "id": 1, "correo": "admin@edunotas.com", "rol": "admin" }
}
```

### `GET /api/auth/usuarios` — Listar usuarios (solo pruebas)

## 🧪 Probar con Postman

El proyecto incluye una colección lista para importar:

1. Abre Postman
2. Click en **Import**
3. Selecciona `postman/EduNotas-Auth.postman_collection.json`
4. Ejecuta las peticiones en orden

## 🔑 Credenciales de prueba

Al arrancar hay un usuario pre-creado:

- **Correo:** `admin@edunotas.com`
- **Contraseña:** `Admin123!`

## 🎨 Estándares de codificación

- **Archivos:** camelCase (`servicioAuth.js`, `controladorAuth.js`)
- **Funciones:** camelCase con verbos (`registrarUsuario`, `autenticarUsuario`)
- **Variables:** camelCase (`nombreUsuario`, `passwordHash`)
- **Constantes:** UPPER_SNAKE_CASE (`PUERTO`)
- **Rutas HTTP:** minúsculas en español (`/registro`, `/login`)
- **Respuestas JSON:** camelCase (`exito`, `mensaje`, `usuario`)

## 🔒 Seguridad implementada

| Práctica | Descripción |
|---|---|
| bcrypt | Las contraseñas se hashean con salt (10 rondas) |
| JWT | Los tokens se firman con una clave secreta y expiran en 24h |
| Validación de entrada | Todo dato entrante se valida antes de procesar |
| No exposición de hashes | Los `passwordHash` nunca se devuelven al cliente |
| CORS controlado | Se puede restringir origen en producción |

## ⚠️ Nota

Este proyecto usa una "base de datos" en memoria (array de JavaScript) para simplicidad didáctica. En un proyecto real se conectaría a MySQL/PostgreSQL/MongoDB.

## 🔗 Repositorio

Ver `REPOSITORIO.txt` para el enlace al repositorio Git.
# 11111
