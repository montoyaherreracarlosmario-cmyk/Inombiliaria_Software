# Habitat Capital

Gestión de inmuebles (casas y apartamentos) y contratos de arriendo / compraventa.
Migración del prototipo HTML/JS (que guardaba todo en `localStorage`) a:

| Capa | Tecnología | Despliegue |
|---|---|---|
| `frontend/` | Next.js 16 (React 19, App Router, TypeScript) | Vercel |
| `backend/` | NestJS 11 + Mongoose | Render |
| Base de datos | MongoDB | MongoDB Atlas |

## Cómo funciona

- `GET /api/inmuebles` · `GET /api/inmuebles/:id`: listado y detalle.
- `POST /api/inmuebles/:id/firmas`: guarda el contrato redactado y genera el enlace de firma.
- `GET /api/firmas/:token`: contrato pendiente (lo abre quien recibe el link, en `/firma/:token`).
- `POST /api/firmas/:token/firmar`: firma y actualiza el inmueble (contrato vigente, vencimiento, estado, valor).
- `GET /api/health`: chequeo de salud para Render.
- Al arrancar con la colección vacía se cargan los 7 inmuebles de ejemplo (`SEED=false` lo desactiva).

## Desarrollo local

```bash
# 1) Backend
cd backend
cp .env.example .env        # pon tu MONGODB_URI
npm install
npm run start:dev           # http://localhost:3001/api

# 2) Frontend (otra terminal)
cd frontend
cp .env.example .env.local  # NEXT_PUBLIC_API_URL=http://localhost:3001/api
npm install
npm run dev                 # http://localhost:3000
```

## Despliegue

### 1. MongoDB Atlas
1. Crea un cluster gratuito (M0) y un usuario de base de datos.
2. *Network Access*: permite `0.0.0.0/0` (Render usa IPs variables en el plan gratis).
3. Copia la cadena `mongodb+srv://...` e indica el nombre de la base antes del `?`, por ejemplo `.../habitat-capital?retryWrites=true&w=majority`.

### 2. Backend en Render
1. Sube este repositorio a GitHub.
2. En Render: **New → Blueprint** y elige el repo (usa `render.yaml`), o **New → Web Service** con:
   Root Directory `backend`, Build `npm ci --include=dev && npm run build`, Start `npm run start:prod`.
3. Variables de entorno:
   - `MONGODB_URI`: la cadena de Atlas.
   - `FRONTEND_URL`: la URL de Vercel (se rellena en el paso 3; luego redeploy). Admite varias separadas por coma.
4. Verifica `https://TU-API.onrender.com/api/health`.

### 3. Frontend en Vercel
1. **Add New → Project**, importa el repo y pon **Root Directory** = `frontend` (Framework: Next.js, automático).
2. Variable de entorno: `NEXT_PUBLIC_API_URL=https://TU-API.onrender.com/api`.
3. Deploy. Copia la URL resultante en `FRONTEND_URL` de Render.

> El plan gratis de Render duerme el servicio tras 15 min sin uso: la primera carga puede tardar ~1 minuto
> (la app muestra un aviso). `NEXT_PUBLIC_API_URL` se incorpora al compilar: si la cambias, vuelve a desplegar en Vercel.

## Qué cambió respecto al prototipo
- Los datos viven en MongoDB (colecciones `inmuebles` y `firmas`) en vez de `localStorage`.
- El botón "Enviar link para firma" ahora genera un enlace real (`/firma/:token`) con una página pública para firmar;
  "Simular firma" sigue disponible en el formulario.
- Misma interfaz, estilos, modo oscuro, animaciones, vista previa en vivo e impresión a PDF.
