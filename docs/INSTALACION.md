# 🚀 Guía rápida de instalación y prueba

## Paso 1 — Verificar Node.js

Abre PowerShell o cmd:

```powershell
node -v
npm -v
```

Debe aparecer una versión 18 o superior. Si no lo tienes:
- Descarga desde: https://nodejs.org/es

## Paso 2 — Instalar dependencias

Desde la carpeta del proyecto:

```powershell
cd NOMBRE_APELLIDO_AA5_EV01
npm install
```

Esto crea la carpeta `node_modules/` con todas las librerías necesarias.

## Paso 3 — Ejecutar el servidor

```powershell
npm start
```

Debe aparecer:

```
🎓 API EduNotas iniciada correctamente
🌐 URL: http://localhost:3000
```

## Paso 4 — Probar la API

### Opción A: con el navegador

Abre: `http://localhost:3000/`

Debe responder con un JSON de bienvenida.

### Opción B: con curl

**Registrar:**
```bash
curl -X POST http://localhost:3000/api/auth/registro ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre\":\"Ana\",\"correo\":\"ana@test.com\",\"password\":\"MiClave123\"}"
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"correo\":\"admin@edunotas.com\",\"password\":\"Admin123!\"}"
```

### Opción C: con Postman (recomendado)

1. Abre Postman
2. Click en **Import**
3. Selecciona `postman/EduNotas-Auth.postman_collection.json`
4. Ya tienes 6 requests listos para probar

## ❓ Problemas comunes

### `Port 3000 is already in use`
Otro programa está usando el puerto. Cámbialo:
```powershell
$env:PORT=3001; npm start
```

### `Cannot find module 'express'`
No corriste `npm install`. Hazlo desde la carpeta correcta.

### El comando `npm` no se reconoce
Node.js no está instalado o no está en el PATH. Reinstala Node.js.

## 🛑 Detener el servidor

Presiona **Ctrl + C** en la terminal donde está corriendo.
