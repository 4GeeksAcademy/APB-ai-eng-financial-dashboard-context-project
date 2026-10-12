# Reglas de Frontend

## Objetivo

Mantener la carga y presentación de métricas alineadas con la API y con las reglas financieras del proyecto.

## Justificación

`App.tsx` obtiene los movimientos desde `/api/metrics` y delega los cálculos a `financial-utils.ts`. El período del encabezado está fijado en 2024, mientras que el backend determina las fechas usando la fecha actual. Compose solo ordena el inicio de los servicios y el frontend no reintenta automáticamente si falla la primera petición.

Fuentes: [App.tsx](../../frontend/src/App.tsx), [financial-utils.ts](../../frontend/src/lib/financial-utils.ts), [financial-utils.test.ts](../../frontend/src/lib/financial-utils.test.ts), [routes.py](../../backend/app/routes.py), [docker-compose.yml](../../docker-compose.yml).

## Reglas

- Solicita los datos por `/api`; en Compose, Vite los redirige al servicio `backend`. No uses `localhost` como dirección entre contenedores.
- Mantén los cálculos financieros en `financial-utils.ts` y actualiza las pruebas correspondientes cuando cambie su comportamiento.
- Haz que el período mostrado coincida con las fechas recibidas; no fijes un año en la interfaz si la API genera otro período.
- Conserva estados de carga y error. No supongas que `depends_on` significa que el backend ya está listo; contempla recuperación o reintento si cambia el flujo de carga.

## Ejemplos

### Correcto

Patrón usado por `App.tsx`: consultar la ruta relativa y delegar los cálculos a las utilidades.

```tsx
const response = await fetch(`${API_BASE_URL}/api/metrics`);
if (!response.ok) throw new Error(`Failed to fetch financial data: ${response.status}`);
const movements: FinancialMovement[] = await response.json();
setMetrics(computeKPIs(movements));
setMonthlyData(computeMonthlyData(movements));
```

### Incorrecto

Este rótulo existe en `App.tsx`, pero no coincide necesariamente con las fechas generadas por la API.

```tsx
<DashboardHeader period="2024 - Full Year" />
```

## Archivos relacionados

- [vite.config.ts](../../frontend/vite.config.ts)
- [financial-types.ts](../../frontend/src/lib/financial-types.ts)
- [financial-utils.test.ts](../../frontend/src/lib/financial-utils.test.ts)