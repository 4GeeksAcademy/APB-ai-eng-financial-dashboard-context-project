# Estado del proyecto

## Alertas de anomalias: implementacion y verificacion

- T1-T7 completadas en `specs/002-anomaly-alerts/task.md`: media movil mensual, historial fuera del rango consultado, validacion de umbral, pruebas backend, tipo frontend, consulta cancelable y tabla con control numerico.
- Verificacion ejecutada: 21 pruebas backend enfocadas en alertas y fechas y 6 pruebas frontend de calculos pasaron; lint y build correctos. Las 18 pruebas de alertas tambien pasaron durante T3. Advertencia existente de deprecacion de Starlette/httpx, sin fallos.
- Verificacion adicional: renderizado estatico con cuatro encabezados exactos, importes, porcentaje, umbral y estados. API activa a traves del proxy contrastada contra el dataset: con umbral 0.1 devuelve 3 alertas historicas; los filtros parciales y completos conservan correctamente la referencia.
- T8 pendiente de interaccion visual, cambios rapidos y presentacion responsive en navegador real: no hay navegador ni automatizacion instalados en el entorno. No se afirma verificacion visual completa.

## Filtro de fechas: implementacion y verificacion

- T1-T6 completadas en `specs/001-date-search/task.md`: contrato facets, peticiones filtradas con cancelacion, inputs con limites, validacion, advertencia y periodo dinamico. Sin cambios backend ni dependencias nuevas.
- Verificacion ejecutada: 3 pruebas backend de fechas/facets y 6 pruebas frontend de calculos pasaron; lint y build frontend correctos.
- Comprobacion adicional ejecutada sin archivos de prueba nuevos: API a traves del proxy, historico (360 movimientos), filtros parciales, rango inclusivo, un solo dia, formato ISO, limites, rango invertido y cancelacion. El renderizado estatico de la cabecera confirma inputs, etiquetas, min/max, referencia de fechas, periodo y aviso accesible.
- T7 permanece pendiente: no se verifico la interaccion visual, limpieza de inputs ni cambios rapidos en un navegador real porque el entorno no dispone de navegador o automatizacion instalados. Las protecciones de estado se revisaron en codigo.
- Las limitaciones historicas de carga sin filtros y periodo fijo descritas mas abajo han quedado resueltas por esta implementacion.

Resumen historico previo al filtro de fechas: la suite backend pasó con 17 pruebas. El perfil de 1.000 generaciones bajó de 4,74 s a 1,44 s bajo `cProfile`; es una medición orientativa con el coste del profiler incluido. En aquella revision no se ejecutaron verificaciones frontend.

## Skills y cambios recientes

- Skill aplicada: `python-performance-optimization`. Se midió la generación antes de optimizar; el generador usa un `Random` local, la caché está limitada por fecha y semilla, y cada llamada recibe modelos independientes. También se eliminaron ordenaciones redundantes tras filtros que preservan el orden. [backend/app/routes.py](../backend/app/routes.py)
- Verificación: `docker compose run --rm backend pytest -q` pasó con 17 pruebas. El perfil de 1.000 llamadas pasó de 4,74 s a 1,44 s bajo `cProfile`; es una medición orientativa, no una garantía de latencia de producción. `git diff --check` no reportó errores.
- Skill del ecosistema elegida y creada: [financial-dashboard-workflow](../.agents/skills/financial-dashboard-workflow/SKILL.md). Complementa las skills existentes de rendimiento Python, accesibilidad y React con reglas transversales del dominio financiero.
- Motivo: los cambios del dashboard suelen cruzar cálculos, tipos frontend, modelos y respuestas FastAPI, período mostrado y pruebas. La skill fija ese flujo y las invariantes financieras sin imponer cambios de diseño ni duplicar las instrucciones generales de `AGENTS.md`.

## Lo que funciona según el código

- El frontend solicita `GET /api/metrics`, calcula totales de ingresos y gastos, beneficio, porcentaje de beneficio y agregados mensuales; muestra KPI y gráficos. [frontend/src/App.tsx](../frontend/src/App.tsx), [frontend/src/lib/financial-utils.ts](../frontend/src/lib/financial-utils.ts)
- El backend expone `/health` y endpoints de movimientos, filtros, facets, resúmenes, categorías, comparaciones, alertas y datos B2B/B2C. Las respuestas usan modelos Pydantic. [backend/app/routes.py](../backend/app/routes.py)
- Existen pruebas escritas para generación, filtros y endpoints del backend y para cálculos del frontend. Esto no confirma que se hayan ejecutado o que pasen. [backend/tests/test_routes.py](../backend/tests/test_routes.py), [frontend/src/lib/financial-utils.test.ts](../frontend/src/lib/financial-utils.test.ts)

## Limitaciones actuales comprobables

- El frontend usa filtros de fecha; los filtros de categoria y tipo de operacion siguen disponibles solo en la API dentro del flujo revisado. [frontend/src/App.tsx](../frontend/src/App.tsx), [backend/app/routes.py](../backend/app/routes.py)
- El encabezado muestra el periodo consultado; las fechas de los movimientos sinteticos dependen de la fecha actual. [frontend/src/App.tsx](../frontend/src/App.tsx), [backend/app/routes.py](../backend/app/routes.py)
- Los movimientos son sintéticos; en las rutas revisadas no se observa persistencia. [backend/app/routes.py](../backend/app/routes.py)
- El frontend hace una petición inicial sin reintento automático; Compose ordena los servicios con `depends_on`, pero no declara un healthcheck del backend. [frontend/src/App.tsx](../frontend/src/App.tsx), [docker-compose.yml](../docker-compose.yml)
- La generación usa un generador aleatorio local y cachea resultados por semilla y fecha, sin compartir modelos mutables entre llamadas; las fechas siguen variando según `date.today()`. [backend/app/routes.py](../backend/app/routes.py)

## Próximos pasos sugeridos

1. Completar la comprobacion en navegador real del filtro de fechas, incluida la limpieza de inputs y los cambios rapidos de seleccion.
2. Mejorar la recuperación ante fallos de conexión inicial, mediante reintento o coordinación de disponibilidad del backend.
3. Si se necesita reproducibilidad entre fechas, fijar también la fecha de referencia. El procedimiento de perfilado está documentado en [verification.md](../verification.md).
4. No se incorporaron pruebas nuevas en esta implementacion; los resultados de las verificaciones enfocadas ejecutadas se detallan al principio de este documento.
