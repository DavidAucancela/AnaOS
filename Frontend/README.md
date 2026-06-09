# AnaOS Frontend

Interfaz React 18 + TypeScript + Vite del sistema AnaOS.

## Stack

- **React 18** + React Router v6
- **TypeScript** + Vite
- **shadcn/ui** + Radix UI + Tailwind CSS
- **TanStack Query** — estado del servidor
- **React Hook Form** + Zod — formularios y validación
- **Recharts** — gráficos y analytics
- **Sonner** — notificaciones toast
- **Kushki** — pasarela de pagos

## Comandos

```bash
npm install
npm run dev       # Servidor de desarrollo (puerto 5173)
npm run build     # Build de producción (requiere VITE_API_BASE_URL)
npm run lint      # ESLint
npm run preview   # Preview del build de producción
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_API_BASE_URL` | URL base de la API (ej. `http://localhost:8081/api`) |

Sin esta variable, cae al fallback `http://localhost:5133/api`.

## Estructura de páginas

```
src/pages/
  Login.tsx               — Inicio de sesión
  Signup.tsx              — Registro de nueva cooperativa
  Dashboard.tsx           — Dashboard cooperativa (analytics reales)
  AdminDashboard.tsx      — Dashboard administrador (analytics globales)
  Agencias.tsx            — CRUD de agencias
  Socios.tsx              — CRUD de socios con búsqueda
  Usuarios.tsx            — Gestión de usuarios (admin)
  Cooperativas.tsx        — Lista de cooperativas (admin)
  Suscripciones.tsx       — Panel de suscripciones (admin)
  Payment.tsx             — Formulario de pago Kushki
  PaymentProfessional.tsx — Redirect al formulario con plan Professional
  PaymentEnterprise.tsx   — Redirect al formulario con plan Enterprise
  Profile.tsx             — Perfil del usuario
  VerifyEmail.tsx         — Redirect post-signup hacia pago o dashboard
```

## Auth y estado

- `AuthContext` (`src/contexts/AuthContext.tsx`) — usuario autenticado global
- `apiService` (`src/services/api.ts`) — cliente HTTP único, guarda JWT en `localStorage`
- `ProtectedRoute` — verifica autenticación y `allowedRoles` antes de renderizar
