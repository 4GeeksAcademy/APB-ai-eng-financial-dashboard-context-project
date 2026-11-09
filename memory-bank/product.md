# Resumen del producto

## Filtro de fechas

- El dashboard permite seleccionar inicio y fin dentro del rango del dataset, visible junto a los inputs. Admite filtros parciales e incluye ambos extremos.
- Con ambas fechas vacias muestra todo el historico y la advertencia "No se seleccionaron fechas, se muestra data histórica". Un rango invertido muestra un aviso y conserva el resultado anterior.
- El periodo del encabezado refleja la consulta cargada, en lugar de un anio fijo. Los KPI y graficos reutilizan los calculos existentes.

## Descripción verificada

Dashboard web de métricas financieras. El frontend obtiene movimientos desde una API FastAPI y presenta indicadores de ingresos, gastos, beneficio y porcentaje de beneficio, junto con gráficos mensuales de ingresos frente a gastos y de porcentaje de beneficio. Los indicadores y agregaciones mensuales se calculan en el frontend.

La API genera movimientos sintéticos con una semilla fija. En las rutas revisadas no se observa almacenamiento persistente.

## Alcance visible en el código

- El frontend solicita `GET /api/metrics` y usa sus movimientos para mostrar el dashboard.
- El backend también expone endpoints de salud, filtros y resúmenes; que existan en la API no implica que la interfaz actual los use.
- Las fechas generadas dependen de la fecha actual y el encabezado muestra el periodo consultado.

## No especificado

El proyecto no identifica explícitamente usuarios objetivo, procesos de negocio ni integraciones con sistemas financieros externos. No describir los datos sintéticos como datos reales o persistidos.

## Referencias

- [Frontend y carga del dashboard](../frontend/src/App.tsx)
- [Cálculos e indicadores](../frontend/src/lib/financial-utils.ts)
- [Generación de datos y endpoints](../backend/app/routes.py)
