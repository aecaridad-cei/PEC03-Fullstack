# Barberia J-M API REST (PEC03)

API REST para gestionar las citas de la barberia J-M usando Express, Mongoose y la base de datos de PEC02. El CRUD principal trabaja con citas y conserva la estructura de datos que ya usa la base de datos. Tambien se exponen consultas de usuarios, necesarios como clientes y barberos de una cita.

## Modelos

- **User**: `nombre`, `email`, `telefono`, `rol` (`cliente`, `barbero` o `admin`), `avatar`, `especialidad` y `fechaRegistro`.
- **Appointments**: `clienteId` y `barberoId` referencian a `User`; `servicio` guarda `nombre`, `precio` y `duracionMinutos`; tambien incluye `fecha`, `horaInicio`, `estado`, `notas` y `creadoEn`.

Los nombres y campos corresponden a los modelos de PEC02. Mongoose conserva las fechas `createdAt` y `updatedAt` por `timestamps`.

## Endpoints

Todas las respuestas se devuelven en JSON. Las respuestas de coleccion incluyen `success`, `count` y `data`; las de un elemento incluyen `success` y `data`.

| Metodo | Ruta | Funcion |
| --- | --- | --- |
| GET | `/` | Estado de la API y rutas disponibles |
| GET | `/api/appointments` | Listar citas |
| GET | `/api/appointments/:id` | Obtener una cita |
| POST | `/api/appointments` | Crear una cita |
| PUT | `/api/appointments/:id` | Actualizar una cita |
| DELETE | `/api/appointments/:id` | Eliminar una cita |
| GET | `/api/users` | Listar usuarios |
| GET | `/api/users/:id` | Obtener un usuario |

Las rutas no existentes responden `404`. Los IDs o datos que no cumplen el esquema responden `400`; los errores inesperados se procesan con el middleware central y se devuelven como JSON `500`.

### Ejemplo de cita

Para crear una cita, usa los `_id` reales de un cliente y un barbero consultados en `GET /api/users`.

```json
{
  "clienteId": "ID_DE_CLIENTE",
  "barberoId": "ID_DE_BARBERO",
  "servicio": {
    "nombre": "Corte clasico",
    "precio": 15,
    "duracionMinutos": 30
  },
  "fecha": "2026-12-01T00:00:00.000Z",
  "horaInicio": "10:00",
  "estado": "pendiente",
  "notas": "Primera visita",
  "creadoEn": "2026-11-25T00:00:00.000Z"
}
```

`estado` admite `pendiente`, `confirmada`, `completada` o `cancelada`.

## Instalacion y ejecucion local

Requiere Node.js y acceso a MongoDB Atlas.

1. Instala dependencias:

   ```sh
   npm install
   ```

2. Copia `.env.example` a `.env` y configura la cadena de conexion del mismo cluster/base de datos que PEC02:

   ```env
   MONGODB_URI=mongodb+srv://usuario:contrasena@cluster/base-de-datos?retryWrites=true&w=majority
   PORT=3000
   NODE_ENV=development
   ```

3. En Atlas, permite la IP de salida que corresponda y comprueba las credenciales de la base de datos.
4. Inicia el servidor:

   ```sh
   npm run dev
   ```

   La API queda disponible en `http://localhost:3000`.

No subas `.env` a GitHub. `.gitignore` ya excluye ese archivo y `.env.example` solo contiene valores de ejemplo.

## Pruebas

- `tests/requests.http`: peticiones para la extension REST Client de VS Code.
- `tests/Barberia-JM.postman.json`: coleccion importable en Postman o Thunder Client.

Antes de ejecutar `POST /api/appointments`, sustituye `clientId` y `barberId` por IDs reales de `GET /api/users`. La coleccion de Postman guarda el ID de la cita creada para usarlo en las peticiones de detalle, actualizacion y borrado. Esas tres peticiones modifican/eliminan el registro de prueba.

## Estructura

```mermaid
flowchart TD
    Client[Cliente HTTP / Postman] --> App[Express: index.js]
    App --> DB[Middleware de conexion: src/config/db.js]
    DB --> Routes[Rutas: src/routes]
    Routes --> Controllers[Controladores: src/controllers]
    Controllers --> Models[Modelos Mongoose: src/models]
    Models --> Atlas[(MongoDB Atlas de PEC02)]
    App --> NotFound[Middleware 404]
    App --> Errors[Middleware central 500 / errores]
```

## Despliegue en Vercel

1. Sube la carpeta `Barberia J-M` a un repositorio GitHub propio y conectalo como proyecto en Vercel. Selecciona esta carpeta como **Root Directory**.
2. En **Settings > Environment Variables**, configura `MONGODB_URI` con la URI privada de Atlas. No pegues la URI en el codigo ni en este README.
3. Despliega la rama principal. Vercel detecta Express desde el `index.js` de la raiz; este archivo exporta la aplicacion como `default`. No hace falta una funcion adicional en `api/` ni un `vercel.json` personalizado.
4. Prueba `https://<tu-proyecto>.vercel.app/`, `/api/users` y las rutas de citas. La API solo se conectara si Atlas permite la conexion de Vercel y la variable esta configurada en el entorno desplegado.

La URL final de Vercel y el enlace de GitHub dependen de las cuentas del estudiante y deben completarse despues de realizar el despliegue. No se incluyen URLs ficticias.
