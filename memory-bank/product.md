# Resumen del producto

## Descripción verificada

Dashboard web de métricas financieras. El frontend obtiene movimientos desde una API FastAPI y presenta indicadores de ingresos, gastos, beneficio y porcentaje de beneficio, junto con gráficos mensuales de ingresos frente a gastos y de porcentaje de beneficio. Los indicadores y agregaciones mensuales se calculan en el frontend.

La API genera movimientos sintéticos con una semilla fija. En las rutas revisadas no se observa almacenamiento persistente.

## Alcance visible en el código

- El frontend solicita `GET /api/metrics` y usa sus movimientos para mostrar el dashboard.
- El backend también expone endpoints de salud, filtros y resúmenes; que existan en la API no implica que la interfaz actual los use.
- Las fechas generadas dependen de la fecha actual, aunque el encabezado del dashboard está fijado en 2024.

## No especificado

El proyecto no identifica explícitamente usuarios objetivo, procesos de negocio ni integraciones con sistemas financieros externos. No describir los datos sintéticos como datos reales o persistidos.

## Referencias

- [Frontend y carga del dashboard](../frontend/src/App.tsx)
- [Cálculos e indicadores](../frontend/src/lib/financial-utils.ts)
- [Generación de datos y endpoints](../backend/app/routes.py)
