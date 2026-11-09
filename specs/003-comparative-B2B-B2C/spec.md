# Objetivo

Comparar el rendimiento de ingresos de las líneas de negocio B2B y B2C.

## Usuario

Equipo de finanzas.

## Historia de usuario

Como integrante del equipo de finanzas, quiero comparar los ingresos y sus principales categorías en B2B y B2C para conocer el rendimiento de ambas líneas en un periodo concreto.

## Requisitos funcionales

- Disponer de una nueva página de comparativa en el dashboard.
- Mostrar dos secciones en paralelo, una para B2B y otra para B2C.
- Cada sección muestra una tabla con hasta cinco categorías con ingresos en su grupo y periodo, ordenadas por ingreso de mayor a menor. Si existen menos de cinco, mostrar únicamente las disponibles, sin añadir filas artificiales; si no hay ingresos, la tabla no contiene filas de categorías y el total del grupo es cero.
- Cada fila muestra nombre de categoría, total de ingresos y porcentaje sobre el total de ingresos del grupo en el periodo consultado.
- Debajo de ambas secciones, mostrar un único gráfico que compare el total de ingresos de B2B con el de B2C.
- Permitir filtrar ambas tablas y el gráfico por un mismo rango de fechas, enviadas en formato `YYYY-MM-DD`. La comparativa tiene un rango propio, inicialmente vacío, que no hereda ni modifica el del dashboard principal.
- Con ambas fechas vacías, considerar todo el histórico. Con solo inicio, considerar los datos desde ese día; con solo fin, hasta ese día. Ambos extremos son inclusivos. Si inicio es posterior a fin, mostrar un aviso, no aplicar el rango y conservar los resultados anteriores hasta corregirlo.
- Obtener de las facetas las categorías de ingreso disponibles para cada grupo y para el mismo rango consultado; sin fechas, considerar el histórico completo. Las categorías sin ingresos en ese periodo no aparecen en las tablas.

## Criterios de aceptación

1. El usuario puede acceder desde el dashboard a una nueva página de comparativa B2B vs B2C.
2. La página muestra dos secciones en paralelo, identificadas como B2B y B2C.
3. Cada tabla muestra hasta cinco categorías con ingresos de su grupo y periodo, de mayor a menor ingreso, con nombre y total por categoría. Si hay menos, muestra solo esas; sin ingresos, no muestra filas de categorías y el total del grupo es cero.
4. Cada fila muestra el porcentaje de ingresos de la categoría respecto al total de ingresos de su grupo para el mismo periodo, no respecto a la suma de las filas visibles.
5. Un único gráfico debajo de ambas secciones compara los ingresos totales de B2B y B2C para el periodo consultado.
6. El usuario puede seleccionar un rango propio de la comparativa, inicialmente vacío e independiente del dashboard principal; las fechas se envían en formato `YYYY-MM-DD`.
7. El rango seleccionado se aplica a ambas tablas, sus porcentajes y el gráfico comparativo.
8. Las categorías disponibles corresponden a las facetas de ingresos de cada grupo y del rango consultado, o del histórico completo si no hay fechas. Las categorías sin ingresos en ese periodo no aparecen en las tablas.
9. Ambas fechas vacías muestran el histórico; una sola fecha aplica el límite informado, con extremos inclusivos. Un inicio posterior al fin muestra un aviso y conserva los resultados anteriores sin aplicar el rango inválido.

## Fuera del alcance

- Comparativas de gastos, beneficio o alertas.
- Filtros adicionales al rango de fechas.

## Casos de prueba

| Caso | Acción | Resultado esperado |
| --- | --- | --- |
| Acceso y distribución | Acceder a la comparativa desde el dashboard. | Se abre la nueva página con las secciones B2B y B2C en paralelo. |
| Principales categorías | Consultar un grupo con al menos cinco categorías de ingreso. | Su tabla muestra las cinco de mayor ingreso, ordenadas de mayor a menor, con nombre y total por categoría. |
| Separación de grupos | Consultar ambas tablas. | Cada tabla contiene únicamente los ingresos correspondientes a su línea de negocio. |
| Porcentaje del grupo | Consultar una categoría con ingresos de 200 y un total de ingresos del grupo de 1000 en el periodo. | La fila muestra un 20 %, independientemente de la suma de las filas visibles. |
| Gráfico comparativo | Consultar un periodo con ingresos totales B2B de 1000 y B2C de 600. | Un único gráfico debajo de ambas secciones representa esos totales, no solo las categorías visibles. |
| Formato e independencia de fechas | Abrir la comparativa con un rango activo en el dashboard principal y seleccionar fechas en la nueva página. | La comparativa comienza sin fechas, envía su selección en formato `YYYY-MM-DD` y no modifica el rango del dashboard principal. |
| Filtrado compartido | Cambiar el rango de fechas de la comparativa. | Ambas tablas, los porcentajes y el gráfico corresponden al nuevo periodo. |
| Categorías de facetas | Comparar las categorías disponibles de cada grupo con sus facetas de ingresos para el mismo rango. | Las categorías corresponden al grupo y periodo consultados; las que no tienen ingresos en ese periodo no aparecen en la tabla. |
| Menos de cinco categorías | Consultar un grupo con solo dos categorías con ingresos en el periodo. | Su tabla muestra dos filas, sin añadir categorías artificiales. |
| Grupo sin ingresos | Consultar un grupo sin ingresos en el periodo. | Su tabla no muestra filas de categorías y el gráfico representa un total cero para ese grupo. |
| Histórico completo | Dejar ambas fechas vacías después de consultar un rango. | Ambas tablas, porcentajes, categorías disponibles y gráfico corresponden al histórico completo. |
| Una sola fecha y extremos | Consultar primero solo con inicio y después solo con fin, con movimientos en los días seleccionados. | Se consideran los datos desde o hasta el día informado, incluidos los movimientos de ese día. |
| Rango inválido | Seleccionar una fecha de inicio posterior a la de fin. | Se muestra un aviso y se conservan las tablas y el gráfico anteriores sin aplicar el rango inválido. |