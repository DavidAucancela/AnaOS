# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Instalar dependencias primero (mejor cache de capas)
COPY package.json package-lock.json ./
RUN npm ci

# Copiar el resto del código
# VITE_API_BASE_URL debe estar disponible como variable de entorno en Railway
# al momento del build (Vite la reemplaza estáticamente en el bundle)
COPY . .
RUN npm run build

# ── Stage 2: Serve con Nginx ──────────────────────────────────────────────────
FROM nginx:alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
