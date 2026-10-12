# AGENTS.md

## Proyecto

Dashboard de métricas financieras con frontend React + TypeScript y API FastAPI. Docker Compose inicia ambos servicios para desarrollo.

## Stack y estructura

- `frontend/src/components/dashboard/`: componentes del dashboard.
- `frontend/src/lib/`: tipos, cálculos y pruebas de utilidades.
- `backend/app/`: aplicación FastAPI y rutas.
- `backend/tests/`: pruebas de API.

## Comandos

Desde la raíz, iniciar el proyecto:

```bash
docker compose up --build
```

Con los servicios iniciados, ejecutar las verificaciones:

```bash
docker compose exec backend pytest -q
docker compose exec frontend npm test
docker compose exec frontend npm run lint
docker compose exec frontend npm run build
```

## Convenciones

- Mantener los tipos del dominio en `frontend/src/lib/financial-types.ts` y los cálculos financieros en `frontend/src/lib/financial-utils.ts`, con pruebas en el archivo `.test.ts` correspondiente.
- Mantener el proxy de Vite para `/api` dirigido al servicio `backend` en Compose; no usar `localhost` como dirección entre contenedores.
- Definir modelos Pydantic y `response_model` para las respuestas de API, y actualizar las pruebas de rutas cuando cambien sus contratos o filtros.

## Reglas de dominio

- Un movimiento tiene fecha, importe, tipo de operación (`income` o `outcome`), categoría (`suppliers`, `sales`, `operational`, `administrative` u `others`) y tipo de negocio (`B2B` o `B2C`).
- Los KPI del frontend suman ingresos y gastos; `profit` es ingresos menos gastos y `profitPercent` es beneficio dividido por ingresos, expresado como porcentaje, o cero si no hay ingresos.
- La API genera datos sintéticos con semilla fija, pero asigna sus años usando la fecha actual. El período mostrado en `frontend/src/App.tsx` está fijado en 2024; mantener el período mostrado coherente con las fechas de los datos.

## Forma de trabajar

- Antes de trabajar en el frontend, lee `./.agents/rules/frontend.md`.
- Antes de trabajar en el backend, lee `./.agents/rules/backend.md`.
- Consulta las skills en `./.agents/skills` y la memoria en `./memory-bank` si esas rutas existen.
- Al cambiar cálculos, tipos o respuestas de API, revisa y actualiza sus pruebas correspondientes.
- No describas como persistentes los datos generados por las rutas revisadas: no se observa almacenamiento persistente en ese flujo.

## Límites

- Los endpoints revisados sirven datos sintéticos; no asumir que representan datos financieros persistidos.
- `depends_on` en Compose ordena el inicio de servicios, pero la configuración no incluye healthcheck del backend. El frontend hace una petición inicial sin reintento automático; considerar este comportamiento al cambiar el arranque o la carga de datos.
- No asumir capacidades o requisitos de autenticación, CI o despliegue que no estén documentados en el código revisado.

## Verificación

- Backend: `docker compose exec backend pytest -q` cubre rutas, filtros y generación de datos.
- Frontend: `docker compose exec frontend npm test` ejecuta Vitest; `npm run lint` y `npm run build` están definidos en `frontend/package.json`.
- Comprobación manual: verificar `http://localhost:8000/health`, `http://localhost:8000/api/metrics`, `http://localhost:5173/api/metrics` y que el dashboard cargue en `http://localhost:5173`.
- No afirmar que una prueba o comprobación se ejecutó si no se ejecutó.
