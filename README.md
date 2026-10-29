# Truex Trade Backend

Backend API para la plataforma Truex Trade desarrollado con **Node.js**, **Express** y **Mongoose** (MongoDB).

## 🚀 Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- Conexión a MongoDB (Cluster Atlas o local)

---

## 📦 Instalación

1. Clona el repositorio y navega a la carpeta del proyecto:
   ```bash
   cd truex-trade-backend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

---

## ⚙️ Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (o utiliza como referencia el archivo [`.env.example`](file:///c:/Users/USUARIO/Desktop/truex/truex-trade-backend/.env.example)):

```env
PORT=5000
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.r79rn7k.mongodb.net/truex?appName=Cluster0
FRONTEND_URL=https://truextrade.vercel.app
JWT_SECRET=una_cadena_larga_y_aleatoria
JWT_EXPIRES_IN=7d
```

---

## 🛠️ Scripts Disponibles

- **Modo Desarrollo (con recarga automática):**
  ```bash
  npm run dev
  ```
- **Modo Producción:**
  ```bash
  npm start
  ```

---

## 📁 Estructura del Proyecto

```text
truex-trade-backend/
├── src/
│   ├── config/
│   │   └── db.js            # Conexión a MongoDB con Mongoose
│   ├── controllers/
│   │   └── auth.controller.js  # Registro, login y perfil
│   ├── middlewares/
│   │   └── auth.middleware.js  # Verificación del token JWT
│   ├── models/
│   │   └── Usuario.js       # Esquema de usuario con hash de contraseña
│   ├── routes/
│   │   └── auth.routes.js   # Rutas /api/auth
│   ├── app.js               # Configuración de Express, CORS y middlewares base
│   └── server.js            # Punto de entrada y levantamiento del servidor HTTP
├── .env                     # Variables de entorno locales (ignorado por Git)
├── .env.example             # Plantilla de variables de entorno
├── .gitignore
├── package.json
└── README.md
```

---

## 🌐 Endpoints Iniciales

- `GET /` - Verifica que el backend esté operativo.
- `GET /api/health` - Estado de salud del servicio (uptime y timestamp).

## 🔐 Autenticación

| Método | Endpoint             | Descripción                          | Acceso        |
| ------ | -------------------- | ------------------------------------ | ------------- |
| `POST` | `/api/auth/register` | Crea la cuenta y devuelve JWT        | Público       |
| `POST` | `/api/auth/login`    | Inicia sesión y devuelve JWT         | Público       |
| `GET`  | `/api/auth/me`       | Perfil del usuario autenticado       | Bearer token  |

**Registro** (`POST /api/auth/register`):

```json
{
  "nombre": "David Garcia",
  "username": "davidgx",
  "email": "demo@truex.app",
  "password": "truex1234",
  "ubicacion": "Pasto, Nariño"
}
```

**Login** (`POST /api/auth/login`):

```json
{
  "email": "demo@truex.app",
  "password": "truex1234"
}
```

Ambos responden:

```json
{
  "token": "<jwt>",
  "user": {
    "id": "<id>",
    "nombre": "David Garcia",
    "username": "davidgx",
    "email": "demo@truex.app",
    "avatar": "",
    "verificado": false,
    "ubicacion": "Pasto, Nariño",
    "stats": { "publicaciones": 0, "intercambios": 0, "calificacion": 0 }
  }
}
```

Los errores usan `{ "mensaje": "..." }`, compatible con el frontend.

## 🔌 Conexión con el frontend

En `TruexTradeFronted` crea un archivo `.env` con:

```env
VITE_API_URL=http://localhost:5000/api
```

Sin esa variable el frontend usa sus mocks locales de `localStorage`.
