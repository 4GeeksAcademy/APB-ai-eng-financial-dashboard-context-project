## Frontend

- [X] T1--- Definir en `frontend/src/lib/financial-types.ts` el tipo de respuesta de `/api/metrics/facets`, incluidos `min_date` y `max_date`.
- [X] T2--- Adaptar la carga en `frontend/src/App.tsx` para consultar facets y metricas por fechas, sin reutilizar la respuesta de otro rango ni permitir que respuestas antiguas sobrescriban la seleccion vigente; conservar los estados de carga y error.
- [X] T3--- Incorporar en `frontend/src/components/dashboard/dashboard-header.tsx` los inputs etiquetados de inicio y fin, conectados al estado de `App.tsx`, con limites del dataset y el rango disponible visible cerca de ellos.
- [X] T4--- Validar las fechas y el rango antes de consultar: enviar solo fechas informadas en formato `YYYY-MM-DD`, admitir un unico extremo y, si inicio es posterior a fin, mostrar aviso sin aplicar el rango ni sustituir los datos anteriores.
- [X] T5--- Actualizar KPI y graficos reutilizando `computeFinancialDashboard`, mostrar historico y la advertencia exacta del spec solo con ambos inputs vacios y sustituir el periodo fijo por el correspondiente a los datos mostrados.

## Verificacion

- [X] T6--- Ejecutar las pruebas existentes de filtros y facets del backend y de calculos del frontend, ademas de lint y build del frontend; registrar los resultados sin incorporar herramientas nuevas. Resultado: 3 pruebas backend y 6 frontend pasaron; lint y build correctos.
- [] T7--- Verificar todos los criterios de aceptacion y casos de prueba de `spec.md`, incluidos los extremos inclusivos, filtros parciales, limpieza de fechas, limites y referencia del dataset, rango invertido y advertencia exacta; comprobar tambien cambios rapidos de fechas y coherencia entre periodo, KPI y graficos. Comprobados API, validacion, envio de parametros, cancelacion y renderizado de controles. Pendiente interaccion y comprobacion visual en navegador real: no hay navegador ni automatizacion instalados en el entorno.