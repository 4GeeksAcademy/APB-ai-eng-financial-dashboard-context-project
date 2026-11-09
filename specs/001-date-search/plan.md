## Backend

Sin cambios: `/api/metrics` ya admite fechas opcionales e inclusivas; `/api/metrics/facets` proporciona el rango disponible.

## Frontend

- Consultar facets y mostrar dos inputs de fecha limitados al dataset, con el rango disponible como referencia.
- Enviar únicamente las fechas informadas en formato `YYYY-MM-DD`.
- Adaptar `fetchFinancialData`: su caché actual no distingue rangos. Evitar también que respuestas antiguas sobrescriban selecciones recientes.
- Validar el rango antes de consultar; si está invertido, mostrar aviso y conservar los datos anteriores.
- Mostrar histórico y advertencia exacta con ambas fechas vacías; admitir filtros parciales sin advertencia.
- Reutilizar `computeFinancialDashboard` para actualizar KPI y gráficos. Sustituir el período fijo por el correspondiente a los datos mostrados.

## Archivos Afectados

- [frontend/src/lib/financial-types.ts](../../frontend/src/lib/financial-types.ts): tipo de respuesta de facets.
- [frontend/src/App.tsx](../../frontend/src/App.tsx): selección, peticiones, validación y estados.
- [frontend/src/components/dashboard/dashboard-header.tsx](../../frontend/src/components/dashboard/dashboard-header.tsx): inputs y referencias de fechas.

## Orden Recomendado

1. Tipar facets y adaptar la carga de datos.
2. Conectar inputs, límites y validación.
3. Ajustar advertencias y período visible.
4. Verificar el comportamiento.

## Verificación Básica

- Recorrer los casos de prueba de la [spec](spec.md).
- Ejecutar las pruebas existentes de filtros y facets del backend y de cálculos del frontend.
- Ejecutar lint y build del frontend.
- Comprobar cambios rápidos de fechas y conservación de datos ante rango inválido.

## Riesgo

Sí, acotado a la carga del dashboard: caché incorrecta, respuestas desordenadas o pérdida de estados de carga/error. No se modificarían fórmulas, contratos API ni otros filtros. Sin librerías ni frameworks nuevos.