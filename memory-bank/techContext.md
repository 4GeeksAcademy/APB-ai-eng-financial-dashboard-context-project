# Contexto técnico

## Stack

- **Frontend:** React 19 y TypeScript 6 con Vite 8; Tailwind CSS, Recharts, Vitest y ESLint. Scripts y dependencias: [frontend/package.json](../frontend/package.json).
- **Backend:** FastAPI y Uvicorn; modelos Pydantic, pytest y debugpy. Dependencias: [backend/requirements.txt](../backend/requirements.txt). La imagen usa Python 3.13: [backend/Dockerfile](../backend/Dockerfile).
- **Desarrollo local:** Docker Compose inicia los servicios `frontend` y `backend`: [docker-compose.yml](../docker-compose.yml).

## Estructura principal

- `frontend/src/components/dashboard/`: cabecera, KPI y gráficos.
- `frontend/src/lib/`: tipos del dominio, cálculos financieros y sus pruebas.
- `backend/app/`: aplicación FastAPI y endpoints.
- `backend/tests/`: pruebas de endpoints y filtros.

## Comunicación

- Vite publica el frontend en el puerto `5173` y redirige `/api` a `http://backend:8000`; dentro de Compose se usa el nombre del servicio, no `localhost`. [frontend/vite.config.ts](../frontend/vite.config.ts), [docker-compose.yml](../docker-compose.yml)
- El backend publica el puerto `8000`; el contenedor también expone `5678` para debugpy. [backend/Dockerfile](../backend/Dockerfile), [docker-compose.yml](../docker-compose.yml)
- El frontend solicita `/api/metrics` usando `VITE_API_BASE_URL` si está definido; por defecto usa la ruta relativa y el proxy de Vite. [frontend/src/App.tsx](../frontend/src/App.tsx)
- La API incluye `/health`, `/api/metrics` y rutas adicionales para facets, resúmenes, categorías, comparaciones, alertas y segmentación B2B/B2C. `/api/metrics` admite filtros de fecha, categoría y tipo de operación. [backend/app/routes.py](../backend/app/routes.py)
- Aunque el backend admite filtros, el dashboard actual solicita `/api/metrics` sin parámetros. [frontend/src/App.tsx](../frontend/src/App.tsx)

## Dominio y datos

- Un movimiento tiene fecha, importe, tipo (`income` o `outcome`), categoría y tipo de negocio (`B2B` o `B2C`). Los tipos están en [frontend/src/lib/financial-types.ts](../frontend/src/lib/financial-types.ts) y los modelos de API en [backend/app/routes.py](../backend/app/routes.py).
- El frontend calcula ingresos y gastos totales, beneficio (`ingresos - gastos`) y porcentaje de beneficio (`beneficio / ingresos`, o `0` si no hay ingresos); también agrupa movimientos por mes. [frontend/src/lib/financial-utils.ts](../frontend/src/lib/financial-utils.ts)
- El backend genera movimientos sintéticos con semilla fija. El año se asigna usando la fecha actual y la generación llama a `random.seed`, que modifica el estado aleatorio global. En las rutas revisadas no aparece almacenamiento persistente. [backend/app/routes.py](../backend/app/routes.py)

## Comandos y verificaciones

Desde la raíz:

```bash
docker compose up --build
docker compose exec backend pytest -q
docker compose exec frontend npm test
docker compose exec frontend npm run lint
docker compose exec frontend npm run build
```

Los scripts frontend están definidos en [frontend/package.json](../frontend/package.json); los tests cubren rutas y filtros del backend ([backend/tests/test_routes.py](../backend/tests/test_routes.py)) y cálculos frontend ([frontend/src/lib/financial-utils.test.ts](../frontend/src/lib/financial-utils.test.ts)). Estos comandos describen verificaciones disponibles; no implica que se hayan ejecutado.

## Límites y riesgos conocidos

- El encabezado del dashboard está fijado en 2024, pero las fechas de los datos dependen de la fecha actual; el período mostrado puede no coincidir con los datos. [frontend/src/App.tsx](../frontend/src/App.tsx), [backend/app/routes.py](../backend/app/routes.py)
- Compose usa `depends_on` sin healthcheck del backend, mientras el frontend hace una petición inicial sin reintento automático. [docker-compose.yml](../docker-compose.yml), [frontend/src/App.tsx](../frontend/src/App.tsx)
- No asumir persistencia, autenticación ni integraciones externas a partir del flujo revisado.
