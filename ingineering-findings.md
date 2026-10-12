# Hallazgos de ingeniería

Hallazgos y reglas derivados de la revisión estática del código. No se ejecutaron pruebas.

## Frontend

- **Hallazgo:** `App` obtiene los movimientos de `/api/metrics`, calcula KPI y datos mensuales mediante utilidades separadas, y presenta un error si falla la petición. La petición se realiza una sola vez al montar la vista. [frontend/src/App.tsx](frontend/src/App.tsx)
- **Regla:** mantener los cálculos financieros en utilidades separadas y cubiertos por pruebas. Si se cambia la carga de datos, contemplar reintentos o recuperación ante fallos temporales. [frontend/src/lib/financial-utils.ts](frontend/src/lib/financial-utils.ts), [frontend/src/lib/financial-utils.test.ts](frontend/src/lib/financial-utils.test.ts)

## Backend

- **Hallazgo:** las rutas generan movimientos sintéticos usando semilla fija, pero asignan años a partir de la fecha actual y llaman a `random.seed`, que modifica el estado global del generador aleatorio. [backend/app/routes.py](backend/app/routes.py)
- **Regla:** si se requiere reproducibilidad entre fechas, fijar también la fecha/período de referencia y evitar efectos globales innecesarios en el generador aleatorio. [backend/app/routes.py](backend/app/routes.py), [backend/tests/test_routes.py](backend/tests/test_routes.py)
- **Hallazgo:** los endpoints declaran modelos Pydantic y `response_model`; las pruebas verifican respuestas y filtros. [backend/app/routes.py](backend/app/routes.py), [backend/tests/test_routes.py](backend/tests/test_routes.py)
- **Regla:** conservar contratos de respuesta explícitos y actualizar las pruebas correspondientes al cambiar endpoints o filtros. [backend/app/routes.py](backend/app/routes.py), [backend/tests/test_routes.py](backend/tests/test_routes.py)

## Integración

- **Hallazgo:** Vite redirige `/api` a `http://backend:8000`, y Compose declara `depends_on`; no configura una comprobación de salud ni una espera de disponibilidad del backend. [frontend/vite.config.ts](frontend/vite.config.ts), [docker-compose.yml](docker-compose.yml)
- **Regla:** mantener `/api` y el destino de servicio `backend` para el tráfico entre contenedores. No asumir que `depends_on` significa que la API ya está lista; coordinar disponibilidad o permitir reintentar las solicitudes desde el frontend. [frontend/vite.config.ts](frontend/vite.config.ts), [docker-compose.yml](docker-compose.yml), [frontend/src/App.tsx](frontend/src/App.tsx)
- **Hallazgo:** el encabezado del dashboard indica `2024 - Full Year`, mientras que la API calcula las fechas en función de la fecha actual. [frontend/src/App.tsx](frontend/src/App.tsx), [backend/app/routes.py](backend/app/routes.py)
- **Regla:** hacer que el período mostrado coincida con el período consultado y devuelto por la API; mantenerlo fijo solo si también se fija la generación de datos a ese mismo período. [frontend/src/App.tsx](frontend/src/App.tsx), [backend/app/routes.py](backend/app/routes.py)
