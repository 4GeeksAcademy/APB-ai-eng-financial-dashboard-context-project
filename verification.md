# Verificaciones

| Afirmación original | Archivos revisados | Resultado | Corrección, si aplica |
|---|---|---|---|
| El dashboard representa el año 2024 completo. | `frontend/src/App.tsx`; `backend/app/routes.py` | Incorrecta | El encabezado está fijado en 2024, pero las fechas de los movimientos se generan según `date.today()`. Alinear el período mostrado con los datos. |
| El dashboard obtiene los datos de la API y no de los datos de muestra locales. | `frontend/src/App.tsx`; `frontend/src/lib/mock-data.ts` | Confirmada | No requiere corrección: la vista consulta `/api/metrics` y no usa el archivo de datos de muestra. |
| Ingresos, gastos y beneficio se calculan a partir de los movimientos recibidos. | `frontend/src/lib/financial-utils.ts`; `frontend/src/lib/financial-utils.test.ts` | Confirmada | No requiere corrección: los totales y el beneficio se calculan a partir de esos movimientos. |
| La API genera datos reproducibles y no los obtiene de una fuente persistente. | `backend/app/routes.py` | Parcial | La semilla fija hace repetibles los valores aleatorios, pero el año depende de `date.today()`. Para mantener las mismas fechas, fijar también el período; no se encontró uso de persistencia en estas rutas. |
| En Docker Compose, Vite reenvía las peticiones `/api` al backend. | `frontend/vite.config.ts`; `docker-compose.yml` | Confirmada | No requiere corrección: el proxy apunta a `http://backend:8000` y Compose define el servicio `backend`. |
