## Backend

- [X] T1--- Ampliar `/api/metrics/facets` en `backend/app/routes.py` con filtros opcionales de negocio, operación y fechas, conservando el comportamiento sin filtros y los límites globales del dataset, y admitiendo categorías vacías sin errores.
- [X] T2--- Actualizar y ejecutar las pruebas de `backend/tests/test_routes.py` para verificar facetas de ingresos por grupo y periodo, compatibilidad sin filtros, categorías vacías y los filtros por negocio y fechas de los rankings y resúmenes existentes. Resultado: 13 pruebas enfocadas pasaron.

## Frontend

- [X] T3--- Incorporar los tipos de ranking, resumen y comparativa en `frontend/src/lib/financial-types.ts`, y los cálculos necesarios en `frontend/src/lib/financial-utils.ts`: ingresos completos por grupo y porcentajes por categoría sobre ese total, con total cero para grupos sin ingresos.
- [X] T4--- Añadir en `frontend/src/App.tsx` la navegación interna hacia la nueva página de comparativa, conservando el estado del dashboard principal, y adaptar `dashboard-header.tsx` para ambas vistas.
- [X] T5--- Conectar en la página comparativa las consultas de facetas, `/api/metrics/categories/top` y `/api/metrics/summary` para B2B y B2C con operación de ingreso y fechas propias inicialmente vacías; reutilizar controles y validación, admitir histórico y filtros parciales inclusivos, cancelar peticiones obsoletas y conservar resultados ante rangos inválidos sin alterar las fechas del dashboard principal.
- [X] T6--- Crear e integrar las dos secciones paralelas con tablas de hasta cinco categorías con ingresos, ordenadas de mayor a menor, mostrando nombre, importe y porcentaje; usar las facetas del grupo y periodo, no añadir filas artificiales y colocar debajo un único gráfico Recharts de ingresos totales B2B vs B2C, reutilizando los formateadores existentes.

## Verificación

- [X] T7--- Ajustar las pruebas de cálculos en `frontend/src/lib/financial-utils.test.ts` y ejecutar las pruebas enfocadas con pytest y Vitest para grupos separados, porcentajes, filtros, menos de cinco categorías y grupos sin ingresos; ejecutar lint y build, registrando los resultados sin añadir herramientas ni dependencias. Resultado: 15 pruebas backend y 22 frontend pasaron; lint y build correctos.
- [] T8--- Verificar uno por uno los criterios de aceptación y casos de prueba de `spec.md`, incluida la navegación en navegador, independencia de fechas y coherencia de categorías, tablas, porcentajes y gráfico; comprobar que el filtro y el estado del dashboard principal se conservan. Comprobados calculos, facetas, filtros, consulta frontend real contra API activa, cancelacion y renderizado estatico de tablas/controles. Pendiente interaccion, navegacion, conservacion de estado y visualizacion del grafico en navegador real: no hay navegador ni automatizacion instalados en el entorno.