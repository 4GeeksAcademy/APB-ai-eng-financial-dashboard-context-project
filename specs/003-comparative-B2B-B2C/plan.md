## Backend

- Ampliar `/api/metrics/facets` con filtros opcionales de negocio, operación y fechas para obtener categorías de ingreso por grupo y período.
- Conservar el comportamiento sin filtros y los límites globales del dataset; admitir categorías vacías sin errores.
- Reutilizar `/categories/top` para el ranking y `/summary` para los ingresos totales de cada grupo. No necesitan nuevos campos.
- Actualizar las pruebas de facetas, ingresos y filtros por negocio.

## Frontend

- Añadir la página y navegación interna con React, conservando el estado del dashboard principal.
- Mantener fechas propias, inicialmente vacías, reutilizando controles y validación existentes.
- Consultar facetas, ranking y resumen para B2B y B2C; cancelar peticiones obsoletas y conservar resultados ante rangos inválidos.
- Mostrar tablas con hasta cinco categorías y calcular porcentajes sobre el ingreso completo del grupo.
- Añadir el gráfico comparativo con Recharts y reutilizar los formateadores actuales.

## Archivos Afectados

- [backend/app/routes.py](../../backend/app/routes.py) y [backend/tests/test_routes.py](../../backend/tests/test_routes.py).
- [frontend/src/App.tsx](../../frontend/src/App.tsx).
- [frontend/src/lib/financial-types.ts](../../frontend/src/lib/financial-types.ts).
- [frontend/src/lib/financial-utils.ts](../../frontend/src/lib/financial-utils.ts) y [sus pruebas](../../frontend/src/lib/financial-utils.test.ts).
- [frontend/src/components/dashboard/dashboard-header.tsx](../../frontend/src/components/dashboard/dashboard-header.tsx): adaptar la cabecera para ambas vistas.
- Nuevos componentes de página, tablas y gráfico comparativo.

## Orden Recomendado

1. Ajustar facetas y verificar compatibilidad.
2. Incorporar tipos y cálculos.
3. Añadir navegación y fechas independientes.
4. Conectar consultas, tablas y gráfico.
5. Verificar los criterios de aceptación.

## Verificación Básica

- Pruebas enfocadas con pytest y Vitest: grupos separados, porcentajes, filtros, menos de cinco categorías y grupos sin ingresos.
- Ejecutar lint y build.
- Comprobar navegación, independencia de fechas y coherencia de tablas y gráfico en navegador.

## Riesgo

Sí: cambiar facetas podría afectar al filtro principal; cambiar la navegación podría reiniciar sus datos y fechas. Preservar el contrato sin filtros y el estado del dashboard limita esas regresiones. Sin dependencias nuevas.