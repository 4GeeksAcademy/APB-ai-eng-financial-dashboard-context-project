# Objetivo

Permitir consultar periodos concretos en el dashboard principal sin mostrar todo el historico.

## Usuario

Equipo de finanzas.

## Historia de usuario

Como integrante del equipo de finanzas, quiero seleccionar un rango de fechas para consultar la informacion financiera de ese periodo.

## Requisitos funcionales

- Mostrar dos inputs de fecha, inicio y fin, en la parte superior del dashboard.
- Filtrar los datos mostrados en la pagina segun las fechas seleccionadas, incluyendo los movimientos de las fechas de inicio y fin.
- Si solo se selecciona inicio, mostrar los datos desde esa fecha; si solo se selecciona fin, mostrar los datos hasta esa fecha. En ambos casos se incluye el dia seleccionado y no se muestra la advertencia de ausencia de fechas.
- Enviar las fechas en formato `YYYY-MM-DD`.
- Con ambos inputs vacios, mostrar todos los datos disponibles y la advertencia: "No se seleccionaron fechas, se muestra data histórica".
- Limitar las fechas seleccionables al rango del dataset, desde la mas antigua hasta la mas reciente.
- Mostrar ese rango cerca de los inputs como referencia.
- Si inicio es posterior a fin, indicar que el rango no es valido y no aplicarlo; conservar los datos mostrados hasta que se corrija.

## Criterios de aceptacion

1. La parte superior del dashboard muestra un input de fecha de inicio y otro de fecha de fin.
2. Al seleccionar un rango valido, los datos mostrados en la pagina corresponden a ese periodo, incluidos los movimientos de las fechas de inicio y fin.
3. Las fechas seleccionadas se envian en formato `YYYY-MM-DD`.
4. Cuando ambos inputs estan vacios, se muestran todos los datos disponibles.
5. La advertencia "No se seleccionaron fechas, se muestra data histórica" aparece solo cuando ambos inputs estan vacios.
6. Las fechas seleccionables estan comprendidas entre la mas antigua y la mas reciente del dataset, ambas incluidas.
7. Con solo inicio, se muestran los datos desde ese dia; con solo fin, se muestran hasta ese dia, incluido en ambos casos.
8. Las fechas mas antigua y mas reciente del dataset se muestran cerca de los inputs como referencia.
9. Si inicio es posterior a fin, se indica que el rango no es valido, no se aplica y se conservan los datos mostrados hasta que se corrija.

## Fuera del alcance

- Otros filtros distintos del rango de fechas.
- Cambios en los datos financieros o en las formulas de los indicadores.

## Casos de prueba

| Caso | Accion | Resultado esperado |
| --- | --- | --- |
| Inputs visibles | Abrir el dashboard principal. | Se muestran los inputs de fecha de inicio y fin en la parte superior. |
| Filtrado por periodo | Seleccionar un rango dentro de las fechas disponibles. | Los indicadores y graficos muestran solo informacion del periodo seleccionado. |
| Extremos incluidos | Seleccionar un rango con movimientos en las fechas de inicio y fin. | Los movimientos de ambos dias se incluyen en los indicadores y graficos. |
| Solo inicio | Seleccionar inicio y dejar fin vacio. | Se muestran los datos desde ese dia incluido, sin la advertencia de ausencia de fechas. |
| Solo fin | Seleccionar fin y dejar inicio vacio. | Se muestran los datos hasta ese dia incluido, sin la advertencia de ausencia de fechas. |
| Rango invertido | Seleccionar inicio posterior a fin, ambos dentro del rango disponible. | Se indica que el rango no es valido, no se aplica y se conservan los datos mostrados. |
| Formato de envio | Seleccionar fechas y consultar el periodo. | Las fechas se envian en formato `YYYY-MM-DD`. |
| Sin seleccion | Abrir el dashboard con ambos inputs vacios. | Se muestra todo el historico y la advertencia exacta: "No se seleccionaron fechas, se muestra data histórica". |
| Limpiar fechas | Borrar ambas fechas despues de consultar un periodo. | Se vuelve a mostrar todo el historico y la misma advertencia. |
| Limite inferior | Intentar seleccionar una fecha anterior a la mas antigua del dataset y luego seleccionar la mas antigua. | La fecha anterior no se admite y la fecha mas antigua si. |
| Limite superior | Intentar seleccionar una fecha posterior a la mas reciente del dataset y luego seleccionar la mas reciente. | La fecha posterior no se admite y la fecha mas reciente si. |
| Referencia del rango | Consultar las fechas mostradas cerca de los inputs. | Coinciden con la fecha mas antigua y la mas reciente del dataset. |