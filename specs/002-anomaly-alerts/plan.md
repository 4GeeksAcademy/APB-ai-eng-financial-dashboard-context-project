## Backend

- Cambiar la referencia histórica por la media de los tres meses inmediatamente anteriores; omitir meses sin historial suficiente.
- Calcular la referencia antes de limitar los períodos mostrados por fechas.
- Restringir `threshold` a `0.1–1.0`, manteniendo `0.3` y la comparación estricta `>`.
- Conservar el contrato de respuesta existente y actualizar las pruebas de alertas.

## Frontend

- Consultar `/api/metrics/alerts` con umbral, agrupación mensual y fechas válidas de la funcionalidad 1.
- Cancelar peticiones obsoletas; conservar resultados ante fechas inválidas.
- Añadir debajo de los gráficos la tabla con encabezados exactos y el input numérico.
- Mostrar importes y porcentaje con los formateadores existentes, estados de carga/error y el mensaje literal cuando no haya alertas.

## Archivos Afectados

- [backend/app/routes.py](../../backend/app/routes.py).
- [backend/tests/test_routes.py](../../backend/tests/test_routes.py).
- [frontend/src/App.tsx](../../frontend/src/App.tsx).
- [frontend/src/lib/financial-types.ts](../../frontend/src/lib/financial-types.ts).
- Nuevo componente de tabla en [frontend/src/components/dashboard](../../frontend/src/components/dashboard).

## Orden Recomendado

1. Ajustar cálculo, filtro y validación backend.
2. Actualizar y ejecutar las pruebas de alertas.
3. Incorporar el tipo frontend y conectar las consultas.
4. Añadir tabla, umbral y estados.
5. Verificar los criterios de la spec.

## Verificación Básica

- Comprobar media móvil, historial insuficiente, igualdad al umbral y referencia fuera del rango.
- Verificar límites del umbral, filtros parciales, histórico y ausencia de anomalías.
- Ejecutar pruebas enfocadas con pytest, las pruebas financieras existentes con Vitest, lint y build.
- Revisar tabla, actualización del umbral y sincronización de fechas en navegador.

## Riesgo

Sí: modificar el cálculo cambia las alertas actuales y podría afectar otras agrupaciones del endpoint. En frontend, respuestas desordenadas podrían mostrar alertas de otro rango. Mantener intactos KPI, gráficos y filtros existentes limita el riesgo. Sin dependencias nuevas.