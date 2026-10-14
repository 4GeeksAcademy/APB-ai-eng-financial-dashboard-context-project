---
name: financial-dashboard-workflow
description: Aplica al crear o modificar movimientos financieros, KPI, filtros, agregaciones o endpoints que alimentan el dashboard. Mantiene coherentes las reglas financieras, los contratos entre FastAPI y React y sus pruebas.
---

# Flujo de trabajo del dashboard financiero

## Cuándo usarla

Usa esta skill cuando una tarea cambie movimientos, tipos del dominio, KPI, cálculos, filtros, agregaciones o respuestas de API consumidas por el dashboard. No la uses para cambios de estilo o consultas sin cambios funcionales.

## Reglas del dominio

- Un movimiento contiene fecha, importe, tipo de operación (`income` o `outcome`), categoría (`suppliers`, `sales`, `operational`, `administrative` u `others`) y tipo de negocio (`B2B` o `B2C`).
- Los ingresos y gastos se suman por tipo de operación. El beneficio es `ingresos - gastos`; el porcentaje es `beneficio / ingresos * 100`, o `0` si no hay ingresos.
- Los movimientos del backend son sintéticos. No describas estos datos como reales o persistidos.
- La fecha de los datos depende de la fecha actual; no presupongas que una semilla fija implica fechas iguales entre años. Si cambias la generación, conserva la clave de caché por semilla y fecha y no compartas modelos mutables entre respuestas.

## Procedimiento

1. Identifica si el cambio pertenece al frontend, al backend o a ambos; lee las reglas aplicables en `.agents/rules/` y consulta el código y las pruebas existentes.
2. Conserva los tipos del dominio en `frontend/src/lib/financial-types.ts` y los cálculos en `frontend/src/lib/financial-utils.ts`. Evita duplicar fórmulas en componentes.
3. Para cambios de contrato API, actualiza el modelo Pydantic, el `response_model` y las pruebas de rutas. Actualiza el tipo frontend si la respuesta consumida cambia.
4. Para cambios de cálculo o agregación, añade o ajusta pruebas de casos normales y límites, incluyendo ausencia de ingresos cuando afecte `profitPercent`.
5. Mantén el período mostrado coherente con las fechas recibidas. Conserva la ruta relativa `/api`; en Docker Compose el proxy apunta al servicio `backend`, no a `localhost`.
6. Actualiza los archivos pertinentes de `memory-bank/` solo cuando cambie el comportamiento, la arquitectura o el estado verificado. No afirmes que ejecutaste pruebas si no las ejecutaste.
7. Ejecuta las verificaciones enfocadas y, si el cambio afecta el contrato o las reglas financieras, las suites correspondientes.

## Verificación

Desde la raíz del proyecto, usa según el alcance:

```bash
docker compose exec backend pytest -q
docker compose exec frontend npm test
docker compose exec frontend npm run lint
docker compose exec frontend npm run build
```

Si los servicios no están en ejecución, inicia Compose o ejecuta la verificación equivalente en un contenedor temporal. Indica qué comandos se ejecutaron y cualquier limitación.

## Criterio de aceptación

- Las reglas financieras y los tipos coinciden entre API y frontend.
- Los filtros y agregaciones conservan el contrato esperado y tienen pruebas pertinentes.
- El período visible corresponde a las fechas devueltas.
- La documentación describe únicamente comportamiento comprobado.
- El cambio queda limitado a los archivos necesarios para la tarea.
