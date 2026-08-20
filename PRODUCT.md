# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

static HTML/CSS/JS (no framework, no build step; vanilla JS across `app.js`, `companies.js`, `rules-engine.js`)

## Users

Equipos internos de Clara (fintech mexicana): producto, credit risk, fraud operations, y data science. Usan Risk Builder para simular cómo distintas reglas de crédito modificarían la aprobación, utilización, riesgo y experiencia del cliente antes de llevarlas a producción.

## Product Purpose

Risk Builder es un sandbox de simulación: permite ajustar reglas de crédito (utilización máxima, días de mora, concentración de gasto, antigüedad mínima, acción ante fraude, tratamiento de info incompleta) y ver de inmediato cómo esas reglas afectarían una cartera de empresas. Es puramente exploratorio — no publica ni exporta reglas a producción; lo que ocurre después de una simulación (implementar la regla) sucede manualmente en otro sistema, fuera de esta herramienta.

## Positioning

A diferencia de discutir cambios de reglas en una hoja de cálculo o en reuniones entre equipos, Risk Builder muestra el impacto de una regla en tiempo real sobre una cartera completa, con una decisión explicable por empresa (aprobado/revisión/rechazado, línea recomendada, nivel de confianza, y el razonamiento en lenguaje natural detrás de esa decisión).

## Operating Context

Flujo típico: un usuario ajusta uno o más de los 6 controles del panel de reglas → las métricas de cartera (tasa de aprobación, cupo total, pérdida esperada, % en revisión, utilización promedio) se recalculan en vivo → el usuario selecciona una empresa de la cartera sintética para ver el detalle de su decisión individual y por qué se tomó. El objetivo es que distintos equipos (producto, riesgo, fraude, data science) puedan explorar juntos el mismo escenario y alinearse antes de que una regla se lleve a producción.

## Capabilities and Constraints

- Motor de reglas en el cliente (`rules-engine.js`) que evalúa cada empresa contra las 6 reglas activas y determina estado, línea de crédito recomendada, nivel de confianza, y explicación dinámica.
- Cartera de 30 empresas sintéticas generadas de forma determinística (semilla fija) para que los resultados sean comparables entre sesiones — nunca datos reales de Clara. Esto es una decisión durable: la herramienta se queda siempre con datos sintéticos, no se conectará a datos reales o anonimizados de la cartera de Clara.
- Sin backend ni persistencia: todo el cálculo ocurre en el navegador: recargar la página resetea cualquier ajuste a los valores por defecto.
- Sin acción de "publicar" o "exportar" reglas: es intencionalmente un sandbox de solo exploración/decisión, no un punto de despliegue a producción.
- La herramienta es español-only: el selector ES/EN se retiró (nunca hubo build de inglés) y quedó una etiqueta "ES" estática, no interactiva. El ícono de perfil abre un popover informativo (rol genérico + aclaración de que no hay cuentas ni autenticación real) — no es un login ni un menú de cuenta funcional.
- Responsive: por debajo de 900px el sidebar se convierte en un menú hamburguesa (drawer deslizable con overlay); la tabla de cartera pasa de columnas fijas a tarjetas apiladas por empresa. En desktop el sidebar permanece siempre visible, sin colapsar.

## Brand Commitments

- Nombre del producto: "Risk Builder".
- Paleta de marca: navy `#16213E`, teal `#17A673`, fondo `#F7F8FA`, tarjetas blancas redondeadas.
- Favicon (`favicon.svg` + `favicon.png` de respaldo) e imagen Open Graph (`og-image.png`, 1200×630) generados a partir de estos mismos tokens: la marca "RB" en teal/navy es la única identidad visual, no hay logo de Clara en ningún asset.

## Evidence on Hand

Ninguna. Todos los nombres de empresas, montos, e indicadores de riesgo son sintéticos y generados por la propia herramienta (`companies.js`). No hay datos reales de Clara, testimonios, casos de estudio, ni benchmarks — trabajo futuro no debe fabricarlos ni presentarlos como reales.

## Product Principles

1. Todo ajuste de reglas debe reflejarse de inmediato en las métricas de cartera y en el detalle de la empresa seleccionada — nunca requerir un paso manual de "recalcular".
2. Cada decisión individual (aprobado/revisión/rechazado) debe venir acompañada de una razón explicable en lenguaje natural, generada a partir de las reglas que realmente se activaron para esa empresa — nunca un texto genérico o fijo.
3. Los datos son siempre sintéticos y deterministas: la reproducibilidad entre sesiones importa más que el realismo estadístico perfecto.
4. La herramienta es un espacio de alineación entre equipos (producto, riesgo, fraude, data science), no un sistema de aprobación real — no debe implicar que una decisión aquí tiene efecto en producción.
