# AnaOS — Sistema de Gestión para Cooperativas

Plataforma SaaS multi-tenant para la gestión integral de cooperativas de ahorro y crédito. Permite administrar agencias, socios, cuentas, usuarios y suscripciones, con un dashboard de analytics en tiempo real.

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | ASP.NET Core 9 · EF Core · Npgsql |
| Frontend | React 18 · TypeScript · Vite |
| Base de datos | PostgreSQL 16 |
| UI | shadcn/ui · Tailwind CSS · Recharts |
| Auth | JWT (SHA-256) |
| Pagos | Kushki |
| Deploy | Railway (Docker) |

## Estructura del repositorio

```
AnaOSProject/       — Backend ASP.NET Core 9 (raíz del repo)
  Controllers/      — Endpoints REST
  Services/         — Lógica de negocio
  Repositories/     — Acceso a datos (EF Core)
  Models/           — Entidades y DTOs
  Interfaces/       — Contratos de servicio/repositorio
  Custom/           — JWT, hashing, middleware
Frontend/           — React 18 + TypeScript + Vite
  src/
    pages/          — Páginas de la aplicación
    components/     — Componentes reutilizables
    services/       — Cliente HTTP (api.ts)
    contexts/       — AuthContext, AppContext
database/           — Scripts SQL de referencia
scripts/            — Scripts de utilidad
```

## Levantar el entorno local

> Requisito: Docker Desktop corriendo.

### 1. Base de datos

```bash
docker run -d --name anaos-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_DB=AnaOSDB \
  -p 5435:5432 \
  postgres:16-alpine
```

### 2. Backend

```bash
cd AnaOSProject
docker build -t anaos-backend .
docker run -d --name anaos-backend \
  -e "ConnectionStrings__DefaultConnection=Host=host.docker.internal;Port=5435;Database=AnaOSDB;Username=postgres;Password=admin" \
  -e JWT_KEY="dev-secret-key-1234567890-abcdefgh" \
  -e PORT=8081 \
  -p 8081:8081 \
  anaos-backend
```

API disponible en: `http://localhost:8081/api`  
Health check: `GET /api/PlanSuscripcion`

### 3. Frontend

```bash
cd Frontend
npm install
VITE_API_BASE_URL=http://localhost:8081/api npm run dev -- --port 5174
```

Frontend disponible en: `http://localhost:5174`

> **Nota:** Si el puerto 5173 está ocupado por otro proyecto, usar 5174 u otro libre.

## Variables de entorno

### Backend

| Variable | Descripción |
|---|---|
| `ConnectionStrings__DefaultConnection` | Cadena de conexión Npgsql (dev local — sin SSL) |
| `DATABASE_URL` | URL PostgreSQL estilo Railway (fuerza SSL — solo producción) |
| `JWT_KEY` | Clave de firma JWT |
| `PORT` | Puerto HTTP (default: 8080) |
| `ALLOWED_ORIGINS` | Orígenes CORS adicionales separados por coma |

### Frontend

| Variable | Descripción |
|---|---|
| `VITE_API_BASE_URL` | URL base de la API (ej. `https://api.railway.app/api`) |

## Datos de prueba

Para insertar datos de prueba en un entorno local limpio:

```bash
# Crear usuario administrador (contraseña: Admin1234)
docker exec anaos-postgres psql -U postgres -d AnaOSDB -c "
INSERT INTO usuarios (nombres, apellidos, correo, contrasena_hash, rol)
VALUES ('Admin', 'AnaOS', 'admin@anaos.com',
  '60fe74406e7f353ed979f350f2fbb6a2e8690a5fa7d1b0c32983d1d8b3f95f67', 'Administrador');"
```

### Credenciales de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | `admin@anaos.com` | `Admin1234` |
| Cooperativa (Tungurahua) | `jorge.salazar@cooptungurahua.fin.ec` | `Coop1234` |
| Cooperativa (Semillas) | `ana.lema@semillasdelprogreso.coop` | `Coop1234` |
| Cooperativa (Futuro Andino) | `carlos.vera@futuroandino.coop` | `Coop1234` |
| UsuarioCooperativa | `maria.cardenas@cooptungurahua.fin.ec` | `User1234` |

## Módulos implementados

| Módulo | Backend | Frontend |
|---|---|---|
| Autenticación (login / signup / reset) | Completo | Completo |
| Cooperativas | Completo | Completo |
| Agencias | Completo | Completo |
| Usuarios y roles | Completo | Completo |
| Socios (CRUD + búsqueda) | Completo | Completo |
| Cuentas | Completo | — (sin página frontend) |
| Planes de suscripción | Completo | Completo |
| Suscripciones | Completo | Completo |
| Analytics cooperativa | Completo | Completo |
| Analytics admin | Completo | Completo |
| Pago Kushki | Completo | Básico + Professional + Enterprise |

## Arquitectura del backend

```
Controllers → Services → Repositories → EF Core DbContext → PostgreSQL
```

Cada entidad sigue el patrón:
`I<Entidad>Repository` / `I<Entidad>Service` → implementaciones → `BaseRepository<T>` / `BaseService<T>`

### Roles de usuario

| Rol | Acceso |
|---|---|
| `Administrador` | Admin global de la plataforma (sin cooperativa) |
| `Gerente` | Gestor AnaOS (sin cooperativa) |
| `Cooperativa` | Dueño/gerente de una cooperativa |
| `UsuarioCooperativa` | Empleado dentro de una cooperativa |

### Autenticación

- Contraseñas hasheadas con SHA-256 (hex lowercase)
- JWT con claims: `idUsuario`, `email`, `role`, `idCooperativa`
- Expiración: 60 minutos
- Middleware `RoleAuthorizationMiddleware` inyecta claims en `HttpContext.Items`

### Convención de respuesta API

```json
{ "isSuccess": true, "message": "...", "data": ... }
```

## Despliegue en Railway

Ambos servicios se despliegan por separado con Docker multi-stage.

- **Backend:** SDK 9.0 → runtime ASP.NET 9.0. Health check: `GET /api/PlanSuscripcion`.
- **Frontend:** Node 20 → Nginx alpine. `VITE_API_BASE_URL` debe configurarse como variable de build en Railway. `nginx.conf` usa `envsubst` para inyectar el `PORT` dinámico.

### Signup completo

`POST /api/Acceso/RegistroCompleto` crea atómicamente:
1. Cooperativa
2. Agencia "Matriz"
3. Usuario con rol `Cooperativa`

Los archivos (logo, nombramiento) se envían como base64 y se almacenan como `byte[]` en la BD.

## Comandos útiles

```bash
# Ver logs del backend
docker logs -f anaos-backend

# Conectarse a la BD
docker exec -it anaos-postgres psql -U postgres -d AnaOSDB

# Rebuild completo
docker rm -f anaos-backend && cd AnaOSProject && docker build -t anaos-backend . && docker run -d ...

# Lint frontend
cd Frontend && npm run lint
```
