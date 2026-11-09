# Objetivo

Identificar los periodos con incrementos inesperados del gasto en el dashboard principal.

## Usuario

Equipo de finanzas.

## Historia de usuario

Como integrante del equipo de finanzas, quiero consultar alertas de gasto y ajustar su umbral para identificar incrementos relevantes en el periodo seleccionado.

## Requisitos funcionales

- Mostrar debajo de los gráficos una tabla de periodos con incrementos de gasto que superen el umbral seleccionado.
- Cada periodo corresponde a un mes.
- Comparar el gasto registrado con la media móvil de los tres meses inmediatamente anteriores del dataset, aunque estén fuera del rango de fechas seleccionado. El filtro limita los periodos mostrados, no el historial de referencia.
- No evaluar un mes si no están disponibles los tres meses anteriores necesarios para calcular su media móvil.
- Generar una alerta solo cuando el incremento sea estrictamente superior al umbral; si es igual, no generar alerta.
- Mostrar cuatro columnas: Periodo, outcome registrado, M.movil 3 P. anteriores, incremento %.
- Permitir configurar el umbral mediante un input numérico entre 0.1 y 1.0, con valor inicial 0.3.
- Si no hay anomalías, mostrar exactamente: " No se encontraron anómalias materiales".
- Respetar el filtro de fechas de la funcionalidad 1; sin fechas seleccionadas, considerar el dataset completo.

## Criterios de aceptación

1. La tabla aparece debajo de los gráficos existentes.
2. Sus cuatro encabezados son exactamente: Periodo, outcome registrado, M.movil 3 P. anteriores, incremento %.
3. Cada periodo es un mes y solo se destaca si su incremento respecto a la media de los tres meses inmediatamente anteriores es estrictamente superior al umbral; un incremento igual no genera alerta.
4. Cada fila muestra el periodo, gasto registrado, media móvil e incremento expresado como porcentaje.
5. El usuario puede modificar el umbral mediante un input numérico que admite valores entre 0.1 y 1.0.
6. El umbral inicial es 0.3 y las alertas corresponden al valor seleccionado.
7. Si no se detectan anomalías, aparece exactamente: " No se encontraron anómalias materiales".
8. Las alertas respetan las fechas seleccionadas en la funcionalidad 1; sin selección, corresponden al dataset completo. La media de referencia puede usar los tres meses anteriores fuera del rango seleccionado.
9. Los meses sin los tres meses anteriores disponibles no se evalúan ni aparecen como alertas; si no quedan alertas, se muestra el mensaje de ausencia de anomalías.

## Fuera del alcance

- Alertas sobre indicadores distintos del gasto.
- Notificaciones fuera del dashboard.

## Casos de prueba

| Caso | Acción | Resultado esperado |
| --- | --- | --- |
| Ubicación y encabezados | Abrir el dashboard principal. | La tabla aparece debajo de los gráficos con los encabezados exactos: Periodo, outcome registrado, M.movil 3 P. anteriores, incremento %. |
| Umbral inicial | Abrir el dashboard sin modificar el umbral. | El input numérico muestra 0.3 y las alertas corresponden a ese valor. |
| Media móvil e incremento | Consultar un mes cuyo gasto sea 140 y cuyos tres meses inmediatamente anteriores tengan gastos de 90, 100 y 110, con umbral 0.3. | Se muestra una alerta mensual con gasto 140, media móvil 100 e incremento 40 %. |
| Umbral modificado | Cambiar el umbral de 0.3 a 0.5 para el periodo con incremento del 40 %. | El periodo deja de aparecer como alerta. |
| Límites del umbral | Introducir 0.1 y 1.0; después intentar introducir 0.09 y 1.01. | Los dos primeros valores se admiten; los valores fuera del rango no se aplican. |
| Sin anomalías | Consultar datos sin incrementos superiores al umbral seleccionado. | Se muestra exactamente: " No se encontraron anómalias materiales". |
| Fechas activas | Seleccionar un rango válido mediante el filtro de la funcionalidad 1. | Las alertas corresponden al rango seleccionado. |
| Dataset completo | Dejar vacías ambas fechas después de consultar un rango. | Las alertas corresponden al dataset completo y al umbral seleccionado. |
| Referencia fuera del rango | Seleccionar un mes completo con gasto 140 cuyos tres meses anteriores, fuera de la selección, tengan gastos de 90, 100 y 110; usar umbral 0.3. | El mes seleccionado aparece como alerta con media 100 e incremento 40 %, sin mostrar los meses de referencia como filas. |
| Historial insuficiente | Consultar un mes que no tenga los tres meses anteriores disponibles en el dataset. | Ese mes no se evalúa ni aparece como alerta; si no hay otras alertas, se muestra el mensaje de ausencia de anomalías. |
| Incremento igual al umbral | Consultar un mes con gasto 130, media de los tres meses anteriores de 100 y umbral 0.3. | El incremento del 30 % no genera alerta porque es igual al umbral. |