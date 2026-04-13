# SIS Gastos

Aplicacion web full stack para control de gastos personales con autenticacion, panel privado, CRUD de movimientos, consumo de API externa y soporte PWA.

## Descripcion

SIS Gastos es un proyecto dividido en frontend y backend:

- `app/`: interfaz construida con React + Vite
- `server/`: API REST con Express, JWT y MongoDB Atlas

El sistema permite registrar usuarios, iniciar sesion, gestionar gastos personales y visualizar un dashboard privado con una experiencia moderna, ligera y adaptable a movil.

## Caracteristicas principales

- Registro e inicio de sesion con JWT
- CRUD de gastos personales
- Validaciones en formularios de autenticacion y gastos
- Dashboard con resumen financiero
- Consumo de API externa con Axios
- Buscador y paginacion de personajes
- PWA instalable
- Despliegue independiente de frontend y backend

## Tecnologias

### Frontend

- React 19
- Vite 7
- React Router DOM
- Axios
- vite-plugin-pwa
- CSS personalizado

### Backend

- Node.js
- Express
- Mongoose
- MongoDB Atlas
- JSON Web Token
- bcryptjs
- cors
- dotenv

## Instalacion

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd api_react
```

### 2. Instalar dependencias del frontend

```bash
cd app
npm install
```

### 3. Instalar dependencias del backend

```bash
cd ../server
npm install
```

## Variables de entorno

### Frontend

Archivo sugerido: `app/.env`

```env
VITE_API_URL=http://localhost:4000/api
```

### Backend

Archivo sugerido: `server/.env`

```env
PORT=4000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/landing?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=coloca-una-clave-segura
CLIENT_URL=http://localhost:5173
CLIENT_URLS=http://localhost:5173
```

## Ejecucion

### Levantar el frontend

Desde `app/`:

```bash
npm run dev
```

Frontend local:

```txt
http://localhost:5173
```

### Levantar el backend

Desde `server/`:

```bash
npm run dev
```

Backend local:

```txt
http://localhost:4000
```

### Verificar salud de la API

```txt
http://localhost:4000/api/health
```

## Arquitectura / Encarpetado

```txt
api_react/
|-- app/
|   |-- public/
|   |   `-- img/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   `-- styles.css
|   |-- .env.example
|   |-- package.json
|   `-- vite.config.js
|-- server/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- utils/
|   |-- .env.example
|   |-- app.js
|   |-- server.js
|   `-- package.json
`-- README.md
```

## Screenshot de la interfaz grafica

![Captura de la interfaz](./app/public/img/chat.png)

## Flujo funcional

1. El usuario entra a la landing
2. Puede registrarse o iniciar sesion
3. Una vez autenticado accede al dashboard privado
4. Desde el panel puede crear, editar, listar y eliminar gastos
5. Tambien puede explorar una API publica con busqueda y paginacion

## Scripts utiles

### Frontend

Desde `app/`:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Backend

Desde `server/`:

```bash
npm run dev
npm run start
```

## Despliegue

### Frontend en Vercel

- Root Directory: `app`
- Framework: `Vite`
- Variable requerida:

```env
VITE_API_URL=https://tu-backend.vercel.app/api
```

### Backend en Vercel

- Root Directory: `server`
- Framework: `Other`
- Variables requeridas:

```env
MONGODB_URI=...
JWT_SECRET=...
CLIENT_URL=https://tu-frontend.vercel.app
CLIENT_URLS=https://tu-frontend.vercel.app,https://tu-frontend-preview.vercel.app
```

## Datos importantes del autor

- Nombre: Gian Franco Piedrahita
- Proyecto academico / personal orientado a control de gastos
- GitHub: `gianfrancopiedrahita15`
- Rol en el proyecto: desarrollo frontend, backend e integracion con MongoDB Atlas

## Notas importantes

- No subas archivos `.env` al repositorio
- Usa solo `.env.example` como plantilla
- Si el endpoint `/api/health` muestra `"database": "disconnected"`, el problema esta en MongoDB Atlas o en la `MONGODB_URI`
