# Estado del proyecto

Resumen basado en revisión del código. La suite backend pasó: 17 pruebas. El perfil de 1.000 generaciones bajó de 4,74 s a 1,44 s bajo `cProfile`; es una medición orientativa con el coste del profiler incluido. No se ejecutaron verificaciones frontend.

## Lo que funciona según el código

- El frontend solicita `GET /api/metrics`, calcula totales de ingresos y gastos, beneficio, porcentaje de beneficio y agregados mensuales; muestra KPI y gráficos. [frontend/src/App.tsx](../frontend/src/App.tsx), [frontend/src/lib/financial-utils.ts](../frontend/src/lib/financial-utils.ts)
- El backend expone `/health` y endpoints de movimientos, filtros, facets, resúmenes, categorías, comparaciones, alertas y datos B2B/B2C. Las respuestas usan modelos Pydantic. [backend/app/routes.py](../backend/app/routes.py)
- Existen pruebas escritas para generación, filtros y endpoints del backend y para cálculos del frontend. Esto no confirma que se hayan ejecutado o que pasen. [backend/tests/test_routes.py](../backend/tests/test_routes.py), [frontend/src/lib/financial-utils.test.ts](../frontend/src/lib/financial-utils.test.ts)

## Limitaciones actuales comprobables

- El frontend solicita `/api/metrics` sin filtros, aunque la API admite filtros de fecha, categoría y tipo de operación. [frontend/src/App.tsx](../frontend/src/App.tsx), [backend/app/routes.py](../backend/app/routes.py)
- El encabezado del dashboard está fijado en 2024, mientras que las fechas de los movimientos generados dependen de la fecha actual. El período mostrado puede no coincidir con los datos. [frontend/src/App.tsx](../frontend/src/App.tsx), [backend/app/routes.py](../backend/app/routes.py)
- Los movimientos son sintéticos; en las rutas revisadas no se observa persistencia. [backend/app/routes.py](../backend/app/routes.py)
- El frontend hace una petición inicial sin reintento automático; Compose ordena los servicios con `depends_on`, pero no declara un healthcheck del backend. [frontend/src/App.tsx](../frontend/src/App.tsx), [docker-compose.yml](../docker-compose.yml)
- La generación usa un generador aleatorio local y cachea resultados por semilla y fecha, sin compartir modelos mutables entre llamadas; las fechas siguen variando según `date.today()`. [backend/app/routes.py](../backend/app/routes.py)

## Próximos pasos sugeridos

1. Conectar el frontend a los filtros de fecha que ya soporta la API y actualizar el período del encabezado para reflejar los datos mostrados.
2. Mejorar la recuperación ante fallos de conexión inicial, mediante reintento o coordinación de disponibilidad del backend.
3. Si se necesita reproducibilidad entre fechas, fijar también la fecha de referencia. El procedimiento de perfilado está documentado en [verification.md](../verification.md).
4. Añadir pruebas para los nuevos flujos de filtrado del frontend y ejecutar las verificaciones existentes: `docker compose exec backend pytest -q`, `docker compose exec frontend npm test`, `docker compose exec frontend npm run lint` y `docker compose exec frontend npm run build`.
