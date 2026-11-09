## Backend

- [X] T1--- Ajustar el cálculo de alertas en `backend/app/routes.py` para usar la media de los tres meses inmediatamente anteriores, omitir meses sin historial suficiente y calcular la referencia antes de limitar los periodos mostrados por fechas, conservando el contrato de respuesta.
- [X] T2--- Restringir `threshold` a valores entre 0.1 y 1.0, mantener el valor predeterminado 0.3 y generar alertas solo cuando el incremento sea estrictamente superior al umbral.
- [X] T3--- Actualizar y ejecutar las pruebas de alertas en `backend/tests/test_routes.py` para comprobar media móvil, historial insuficiente, igualdad al umbral, límites del umbral y referencia fuera del rango seleccionado. Resultado: 18 pruebas de alertas pasaron.

## Frontend

- [X] T4--- Incorporar en `frontend/src/lib/financial-types.ts` el tipo correspondiente al contrato de respuesta de alertas existente.
- [X] T5--- Conectar en `frontend/src/App.tsx` la consulta de `/api/metrics/alerts` con umbral, agrupación mensual y fechas válidas de la funcionalidad 1; cancelar peticiones obsoletas y conservar resultados ante fechas inválidas.
- [X] T6--- Crear e integrar debajo de los gráficos un componente de tabla con los cuatro encabezados exactos del spec, el input numérico de umbral entre 0.1 y 1.0 con valor inicial 0.3, los formateadores existentes, estados de carga/error y el mensaje literal cuando no haya alertas.

## Verificación

- [X] T7--- Ejecutar las pruebas enfocadas de alertas con pytest, las pruebas financieras existentes con Vitest, lint y build del frontend; registrar los resultados sin añadir dependencias ni configuración de testing. Resultado: 21 pruebas backend y 6 frontend pasaron; lint y build correctos.
- [] T8--- Verificar uno por uno los criterios de aceptación y los casos de prueba de `spec.md`, incluida la tabla en navegador, actualización del umbral, filtros parciales, dataset completo, sincronización de fechas y ausencia de anomalías; comprobar que KPI, gráficos y filtros existentes se mantienen intactos. Verificados calculos y filtros mediante pruebas, API activa a traves del proxy, parametros de la consulta frontend y renderizado estatico de la tabla. Pendiente interaccion visual, cambios rapidos y presentacion responsive en navegador real: no hay navegador ni automatizacion instalados en el entorno.