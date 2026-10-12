# Reglas de Backend

## Objetivo

Conservar contratos de API explícitos y que la generación de datos de prueba tenga límites de reproducibilidad claros.

## Justificación

Las rutas definen modelos Pydantic y usan `response_model`; las pruebas verifican respuestas, filtros y generación. Los movimientos se generan con semilla fija, pero el año depende de `date.today()` y `random.seed()` modifica el generador aleatorio global.

Fuentes: [routes.py](../../backend/app/routes.py), [test_routes.py](../../backend/tests/test_routes.py).

## Reglas

- Define modelos Pydantic y `response_model` para las respuestas de los endpoints.
- Al cambiar una respuesta, filtro o comportamiento observable, actualiza las pruebas de rutas correspondientes.
- Trata los movimientos de estas rutas como datos sintéticos; no los describas como persistidos.
- No asumas que la semilla fija garantiza las mismas fechas entre años: la generación usa la fecha actual. Si se requiere reproducibilidad temporal, fija también la fecha de referencia y evita modificar el generador aleatorio global.

## Ejemplos

### Correcto

Patrón usado por el endpoint de métricas: declarar el modelo esperado para la respuesta.

```python
@router.get("/api/metrics", response_model=list[FinancialMovement])
def get_metrics(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    category: Category | None = Query(default=None),
    operation_type: OperationType | None = Query(default=None),
) -> list[FinancialMovement]:
    movements = generate_mock_movements(seed=42)
    filtered = filter_movements(
        movements, start_date, end_date, category, operation_type
    )
    return ensure_chronological_order(filtered)
```

### Incorrecto

Este patrón aparece en la generación actual; no debe interpretarse como reproducibilidad permanente ni como aislamiento del estado aleatorio.

```python
if seed is not None:
    random.seed(seed)
today = date.today()
```

## Archivos relacionados

- [main.py](../../backend/app/main.py)
- [test_routes.py](../../backend/tests/test_routes.py)
- [requirements.txt](../../backend/requirements.txt)