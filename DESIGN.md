---
name: Risk Builder
description: Sandbox interno de Clara para simular reglas de crédito sobre una cartera en vivo
colors:
  navy: "#16213E"
  teal: "#17A673"
  teal-tint: "rgba(23, 166, 115, 0.12)"
  bg: "#F7F8FA"
  white: "#FFFFFF"
  text-muted: "#5B6478"
  border: "#E1E4EA"
  amber: "#C87F0A"
  amber-tint: "rgba(200, 127, 10, 0.12)"
  red: "#C0392B"
  red-tint: "rgba(192, 57, 43, 0.12)"
typography:
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "32px"
    fontWeight: 700
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "22px"
    fontWeight: 700
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 500
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.03em"
rounded:
  sm: "8px"
  md: "10px"
  lg: "16px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "48px"
components:
  button-primary:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.navy}"
    rounded: "{rounded.md}"
    padding: "14px 26px"
  button-secondary:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.navy}"
    rounded: "{rounded.md}"
    padding: "14px 26px"
  card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.lg}"
  chip-ok:
    backgroundColor: "{colors.teal-tint}"
    textColor: "{colors.teal}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  chip-warning:
    backgroundColor: "{colors.amber-tint}"
    textColor: "{colors.amber}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  chip-danger:
    backgroundColor: "{colors.red-tint}"
    textColor: "{colors.red}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  nav-link-active:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
---

# Design System: Risk Builder

## Overview

**Creative North Star: "The Control Room"**

Risk Builder es una consola de mando calmada: los equipos de producto, riesgo, fraude y data science de Clara mueven palancas (las 6 reglas) y observan cómo la consecuencia se propaga de inmediato por una cartera completa — tasas de aprobación, cupo, pérdida esperada, y la decisión individual de cada empresa. Nada en el sistema compite por atención con esa consecuencia: el navy institucional ancla la estructura, el teal aparece solo para señalar "esto está bien" o "esto está activo", y el resto es blanco, gris y espacio.

Es una herramienta interna (modo Operate), no una pieza de marketing: no hay imágenes heroicas, ilustraciones ni texto persuasivo. El sistema se siente **preciso y sin fricción** — cada control responde de inmediato y sin ambigüedad, para que el usuario nunca dude si su ajuste ya se registró en las métricas o en el detalle de la empresa seleccionada.

**Key Characteristics:**
- Navy institucional como color dominante de estructura (sidebar, texto, títulos), nunca decorativo.
- Teal escaso: solo marca lo que está activo, aprobado, o es la acción principal.
- Plano con aire: casi sin sombra; el whitespace y el contraste tonal separan las superficies.
- Tipografía del sistema operativo (sin fuente de marca cargada) — refuerza que esto es una herramienta de trabajo, no una superficie de marca.
- Jerarquía servida por tamaño y peso, no por color: rojo/ámbar se reservan estrictamente para estados de riesgo.

## Colors

Paleta de tres roles funcionales sobre una base neutra casi monocromática: institucional (navy), señal (teal), y estado (ámbar/rojo), usados con extrema disciplina.

### Primary
- **Navy Institucional** (`#16213E`): color dominante de la interfaz — fondo del sidebar, texto principal, encabezados, avatar de perfil. Transmite que las decisiones que se toman aquí importan.

### Secondary
- **Teal Señal-Verde** (`#17A673`): el único acento de acción. Aparece en el ítem activo del menú, botones primarios, el thumb de los sliders, y el chip "ok"/aprobado. Su escasez es la señal: cuando algo es teal, es porque está bien o es la acción a tomar.
- **Teal Tenue** (`rgba(23, 166, 115, 0.12)`): fondo tinte de teal al 12% de opacidad — usado detrás del texto teal en chips, badges y el valor activo de los sliders, nunca como color sólido de fondo grande.

### Tertiary (estado)
- **Ámbar de Alerta** (`#C87F0A`) con su tinte (`rgba(200, 127, 10, 0.12)`): reservado para "en revisión" / señales intermedias — nunca para acción ni marca.
- **Rojo de Riesgo** (`#C0392B`) con su tinte (`rgba(192, 57, 43, 0.12)`): reservado para "rechazado" / alerta alta — el color de mayor peso semántico del sistema, por eso el más restringido.

### Neutral
- **Fondo de App** (`#F7F8FA`): el lienzo detrás de todas las tarjetas blancas; también el fondo de inputs y del riel de los sliders.
- **Blanco de Superficie** (`#FFFFFF`): todas las tarjetas, la topbar, los popups de estado activo del switch de idioma.
- **Texto Secundario** (`#5B6478`): labels, descripciones, texto de apoyo — nunca texto primario o accionable.
- **Borde/Divisor** (`#E1E4EA`): línea de 1px para separar topbar, inputs, encabezados de tabla y bloques del panel de detalle. No hay un segundo peso de borde en el sistema.

### Named Rules
**The Scarce Teal Rule.** El teal sólido nunca cubre más del ítem activo, un botón, o un ícono a la vez. Si dos elementos teal compiten por atención en la misma vista, uno de los dos está mal.

**The Tint-Over-Fill Rule.** Ningún estado (ok/alerta/riesgo) se comunica con relleno sólido de color sobre fondo grande — siempre es texto de color pleno sobre un tinte del mismo color al 12% de opacidad. Esto mantiene la densidad visual baja incluso cuando una tabla o panel muestra muchos estados a la vez.

## Typography

**Body/Display/Label Font:** system-ui (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`) — una sola familia para todo el sistema.

**Character:** No hay una fuente de marca cargada; la fuente nativa del sistema operativo del usuario es una decisión deliberada, coherente con "The Control Room" — esto es una herramienta de trabajo diario, no una superficie que necesita voz tipográfica propia.

### Hierarchy
- **Headline** (700, 32px): reservado para un título de página a escala hero si una superficie futura lo necesita; no está en uso en la página actual — el `<h1>` de la introducción se distilló a la escala `Title` (ver Do's and Don'ts) para funcionar como header de tarea compacto, no como hero.
- **Title** (700, 22px): encabezados de sección (`<h2>` de "Panel de reglas", "Resultados", "Cartera sintética") y el `<h1>` del header de tarea en la introducción. Una variante de 18px/700 se usa para el nombre de la empresa en el panel de detalle — mismo peso, un paso más pequeño para no competir con el título de sección.
- **Body** (500, 14px): la mayoría del texto de interfaz — labels de controles, valores de detalle, texto de tabla. El peso sube a 600-700 quirúrgicamente para lo que el usuario debe leer primero (nombre de empresa en fila activa, valores de métricas).
- **Label** (600, 12px, uppercase, letter-spacing 0.03em): encabezados de columna de tabla y cualquier texto de clasificación de máxima densidad.

### Named Rules
**The No-Decoration Rule.** Ningún texto usa itálica, subrayado, o una segunda familia tipográfica. La jerarquía se logra solo con tamaño, peso y color — nunca con adornos.

## Layout

Layout de aplicación de dos zonas: un sidebar de 240px (navy) y un área principal fluida a la derecha. Dentro del área principal, una topbar de 72px (blanco, borde inferior de 1px) antecede al contenido scrolleable.

El contenido vive dentro de un `.container` con `max-width: 1100px` centrado y `24px` de padding lateral. Cada sección (`.controls`, `.metrics`, `.companies`) se apila verticalmente con `padding-bottom` generoso (24–64px) que crece con la importancia visual de la sección.

Los datos se organizan en grids explícitos, nunca en flujo libre:
- Panel de reglas: grid de 2 columnas, `gap: 32px 40px` (colapsa a 1 columna bajo 640px).
- Resultados: grid de 6 columnas, `gap: 20px` (colapsa a 3 columnas bajo 1100px, 2 columnas bajo 640px).
- Cartera + detalle: grid `3fr 2fr`, `gap: 24px` (colapsa a 1 columna apilada bajo 900px). El panel de detalle es `position: sticky` (`top: 24px`) mientras las dos columnas están lado a lado, para que no quede un hueco vacío bajo un panel corto junto a una tabla larga; se vuelve estático (`position: static`) en el breakpoint apilado, donde ya no comparte alto con la tabla.

### Responsive: sidebar → menú hamburguesa (bajo 900px)
En desktop el sidebar es `position: sticky`, siempre visible — no colapsa nunca, ni con clic ni con ancho de pantalla, porque refuerza la filosofía "Control Room" (todo visible a la vez, sin estados ocultos) y en desktop 240px nunca es un ancho apretado.

Bajo 900px el sidebar pasa a `position: fixed` fuera de flujo, oculto por defecto (`transform: translateX(-100%)`, transición de 0.25s) y se revela como drawer de ancho completo (`.sidebar.open`) sobre un overlay semitransparente (`rgba(22, 33, 62, 0.4)`) que cierra el menú al hacer clic. Se abre con un botón hamburguesa (`.hamburger-btn`, tres barras navy, 40×40px) que aparece a la izquierda de la topbar junto a una marca compacta (`.mobile-brand`: mismo `.logo-mark` teal + "Risk Builder" en navy, ya que la topbar es blanca) — el sidebar completo, con su propio logo, deja de estar visible bajo este breakpoint. El drawer suma su propio botón de cierre (×) junto al logo. Cierra con: overlay, botón ×, Escape, o al elegir un link de navegación. Mientras está abierto, `body` recibe `overflow: hidden` para evitar el scroll del fondo.

### Named Rules
**The Grid-Not-Flow Rule.** Cualquier colección de datos relacionados (reglas, métricas, empresas) vive en un grid con columnas explícitas y un breakpoint de colapso definido — nunca en un flujo de texto libre.

## Elevation & Depth

Plano con aire: el sistema evita la sombra como mecanismo de jerarquía. Existe exactamente una sombra ambiental (`0 2px 8px rgba(22, 33, 62, 0.06)`) que separa las tarjetas blancas del fondo `#F7F8FA` — es casi imperceptible a propósito, y no comunica interactividad ni presionabilidad, solo "esto es una superficie distinta". Dos usos adicionales, más pequeños, cumplen roles puntuales: un realce de 1px bajo el pill activo del switch de idioma (`0 1px 3px rgba(22, 33, 62, 0.12)`), y un anillo de contorno de 1px alrededor del thumb de los sliders (`0 0 0 1px rgba(22, 33, 62, 0.15)`) — este último es un borde de precisión, no una sombra de profundidad.

### Shadow Vocabulary
- **card-ambient** (`box-shadow: 0 2px 8px rgba(22, 33, 62, 0.06)`): toda tarjeta blanca sobre el fondo de la app.
- **active-lift** (`box-shadow: 0 1px 3px rgba(22, 33, 62, 0.12)`): el segmento activo dentro de un control segmentado (switch de idioma).

### Named Rules
**The Flat-by-Default Rule.** Las superficies están en reposo plano. La única sombra del sistema existe para separar, no para jerarquizar — nunca se usa sombra para simular que un elemento "flota" sobre otro con intención de interacción.

## Shapes

Vocabulario de esquinas de cuatro pasos: `8px` (ítems de navegación), `10px` (botones, inputs, el marco del logo), `16px` (todas las tarjetas contenedoras — el radio "de marca" del sistema), y `999px` (pills: badges de estado, el valor activo de un slider, el switch de idioma). Un quinto valor, `12px`, aparece una sola vez en los tiles de highlight del panel de detalle — una variante menor del paso `md`, no un escalón nuevo del sistema.

No hay bordes decorativos: el único borde real es la línea divisoria de 1px (`#E1E4EA`) usada para separar bloques (topbar, encabezados de tabla, secciones del panel de detalle). El avatar de perfil es el único elemento circular (`border-radius: 50%`).

### Named Rules
**The Pill-Means-Status Rule.** El radio `999px` está reservado para elementos que comunican estado o selección activa (badges, chips, valor de slider, switch de idioma) — nunca se usa en un contenedor de contenido general.

## Components

### Buttons
- **Shape:** `10px` de radio (`rounded.md`).
- **Primary:** fondo teal sólido, texto navy (blanco sobre teal no cumple contraste WCAG AA), sin borde, `padding: 14px 26px`. Es la única acción de peso total permitida en una vista.
- **Secondary:** fondo `bg` (`#F7F8FA`), texto navy, borde de 1px (`#E1E4EA`, igual que un input) para que se lea como botón incluso sobre una tarjeta blanca — mismo radio y padding que el primario, para que el par se lea como un grupo de decisión, no como dos componentes distintos.
- **Hover:** `opacity: 0.9` en ambos — la única transición de estado en botones, deliberadamente sutil.

### Chips / Badges (`badge-pill`)
- **Style:** texto en color pleno sobre un tinte del mismo color al 12% de opacidad, radio `999px`, `padding: 3px 10px`, `font-size: 12px/600`.
- **Variantes:** `ok` (teal — aprobado, identidad sin alerta, buró disponible), `warning` (ámbar — en revisión, fraude medio, historial intermedio), `danger` (rojo — rechazado, fraude alto).
- **Uso:** siempre para valores discretos con connotación de riesgo; nunca para etiquetar contenido neutral. Un valor que alimenta la pérdida esperada pero no participa en ninguna de las 6 reglas activas (ej. variabilidad de flujo) no debe llevar color de riesgo — usa `.detail-stat` (texto `text-muted`, sin pill) para no implicar un veredicto que el sistema de reglas no está emitiendo.

### Cards / Containers
- **Corner Style:** `16px` (`rounded.lg`).
- **Background:** blanco sólido sobre el fondo `#F7F8FA` de la app.
- **Shadow Strategy:** `card-ambient` únicamente (ver Elevation & Depth).
- **Border:** ninguno — la sombra y el contraste de fondo son suficientes para definir el borde de la tarjeta.
- **Internal Padding:** varía por densidad de contenido: `40px 48px` para el header de tarea de la introducción, `40px` para el panel de reglas, `32px` para el panel de detalle, `24px` para las tarjetas de métrica, `0` cuando la tarjeta envuelve directamente una tabla con scroll propio.

### Inputs / Fields (Select)
- **Style:** borde de 1px (`#E1E4EA`), fondo blanco, radio `10px`, flecha inline en SVG (no fuente de íconos), `padding: 10px 14px`.
- **Focus:** el borde cambia a teal sólido — sin glow ni anillo adicional.

### Range Slider
- **Style:** riel de `6px` de alto, color de fondo `bg`, completamente redondeado; thumb circular de `18px` en teal sólido con un borde blanco de `3px` y un anillo de precisión de `1px` (`rgba(22, 33, 62, 0.15)`).
- **Valor actual:** se muestra en un chip pill teal-tint junto al label, actualizado en cada evento `input` — nunca solo al soltar.

### Navigation (Sidebar)
- **Style:** enlaces de `14px/500` en blanco al 65% de opacidad sobre navy; `padding: 10px 12px`, radio `8px`.
- **Hover:** blanco al 6% de opacidad de fondo, texto sube a blanco 100%.
- **Active:** fondo teal sólido, texto navy 100% (blanco sobre teal no cumple contraste WCAG AA) — el único uso de teal como relleno grande en todo el sistema, reservado exclusivamente para "dónde estoy".

### Table (Cartera sintética)
- **Header:** fondo `bg`, texto `label` (12px/600, uppercase, letter-spacing 0.03em, color `text-muted`), borde inferior de 1px.
- **Rows:** borde inferior de 1px (`#F0F1F4`, una variante aún más tenue del borde estándar); filas interactivas (`company-row`) muestran cursor pointer y un fondo teal-tint al 4% en hover, 12% cuando están seleccionadas — con el nombre de la empresa cambiando a teal en la fila activa.
- **Columnas (desktop, sobre 900px):** `table-layout: fixed` con anchos fijos por `colgroup` (Empresa 32%, Antigüedad 23%, Utilización 22%, Estado 23%), calibrados para que ningún encabezado ni badge de estado necesite envolverse y quepan sin scroll horizontal en el ancho de tarjeta típico (~617px). La columna Empresa es la única que envuelve a dos líneas cuando el nombre es largo — nunca se trunca ni obliga a desplazar la tabla. Si se agrega o quita una columna, hay que recalcular estos porcentajes.
- **Mobile (bajo 900px):** la tabla deja de ser tabla visualmente — `thead` se oculta, cada `tr.company-row` se convierte en una tarjeta con borde (radio `12px`), y cada `td` pasa a ser una fila `label: valor` usando `content: attr(data-label)` para reponer el encabezado perdido. Mismo patrón que resolvió el scroll horizontal en desktop (nunca truncar, nunca forzar scroll), solo que aquí el problema es ancho de viewport en vez de ancho de columna.
- **Selección en mobile (acordeón inline):** bajo 900px, `#company-detail` (la columna sticky de escritorio) se oculta por completo — tocar una fila expande su explicación directamente debajo, dentro de la misma tarjeta, en vez de navegar a un panel separado. Primer diseño fue "scroll automático hacia `#company-detail`"; se descartó porque el salto de posición se sentía ajeno al tocar, y comparar dos empresas exigía scrollear abajo-arriba-abajo repetidamente. El acordeón resuelve ambos: cero salto, y comparar es tap/tap/tap en el mismo lugar.
  - Cada `tr.company-row` va seguida de un `tr.company-detail-row` (misma tabla, `colspan="4"`), oculto vía `[hidden]` y con el contenido vacío hasta que se expande — `renderCompaniesTable()` solo llama a `buildCompanyDetailHTML()` para la fila con `id === selectedCompanyId`, así no se computan 30 explicaciones en cada render.
  - `selectCompanyRow` reutiliza `selectedCompanyId` para ambas cosas (fila activa en desktop, fila expandida en mobile) — no hay estado duplicado. Bajo 900px, tocar la fila ya expandida la colapsa (`selectedCompanyId = null`); en desktop no colapsa (la columna sticky siempre necesita alguna empresa seleccionada o el estado vacío).
  - **Indicador de expandir (`.expand-chevron`):** un chevron de 8px (borde en L rotado, sin SVG) junto al nombre de la empresa, visible solo bajo 900px. Apunta hacia abajo en reposo, se invierte y cambia a teal cuando la fila está activa — sin esto, nada en la tarjeta sugería que se podía tocar para ver más.
  - Como `renderCompaniesTable()` reemplaza el `innerHTML` completo del `tbody` en cada tap, `selectCompanyRow` termina con `.focus()` sobre la fila reseleccionada — si no, el foco de teclado se perdería en cada interacción, rompiendo la navegación por teclado del P0 original.

### Topbar Controls
- **Idioma:** la app es español-only; `.lang-label` es texto plano (`text-muted`, 13px/600) sin chrome de botón — nunca simular un control interactivo para una opción que no existe.
- **Perfil (`.profile-popover`):** al hacer clic en el avatar se abre una tarjeta `card`-like (radio `16px`, `card-ambient` shadow, `280px` de ancho) anclada bajo el avatar (`position: absolute`, `right: 0`). Contenido: avatar grande + "Prototipo personal de Alejandro Ordóñez" + una nota explícita de que no está conectado a ningún sistema real de Clara ni tiene autenticación. Esta redacción es deliberada, no cosmética: "Usuario interno" ambiguaba por una fracción de segundo si el prototipo tenía algún tipo de acceso real a sistemas de Clara — la copia actual lo niega sin dejar espacio a esa lectura. Cierra con clic afuera, Escape, o clic de nuevo en el avatar.

### Live Metrics Bar (`.live-metrics-bar`)
Franja con tres métricas clave (tasa de aprobación, cupo total, pérdida esperada) que vive dentro de la tarjeta de Panel de reglas, entre el `.section-heading` y `.controls-card` — no es un elemento de página aparte. Existe porque en mobile (una sola columna, seis controles apilados) mover un slider y ver su efecto en Resultados implicaba scrollear de ida y vuelta; esta franja trae el resultado al control en vez de mandar al usuario a buscarlo.

Primera versión usaba `position: fixed` + `IntersectionObserver` sobre `#controls`, anclada a toda la página. Se descartó por dos razones: competía visualmente con la topbar (ambas reclamando `top: 0` en el instante en que la barra aparecía), y `IntersectionObserver` es una de las piezas más difíciles de verificar remotamente (su entrega de eventos se limita agresivamente en pestañas sin foco, que es exactamente el entorno de prueba disponible aquí). La versión actual usa `position: sticky` — mismo mecanismo ya probado en el panel de detalle — dentro del flujo normal de `#controls`. Esto resuelve ambos problemas a la vez: nunca puede solaparse con la topbar porque, por orden del documento, la topbar ya salió de pantalla mucho antes de llegar a `#controls`; y desaparece en Resultados automáticamente porque deja de existir en el rango de scroll de su contenedor — sin JS, sin observer, sin condición de carrera.

Reutiliza `formatPercent`/`formatCurrency` dentro de `renderMetrics()`, así que nunca se desincroniza de las tarjetas de Resultados.

### Page Footer
Línea de atribución (`.page-footer`): "Construido por Alejandro Ordóñez tras nuestra conversación: prototipo exploratorio, no vinculado a datos reales de Clara." Cumple dos funciones: da contexto de autoría/procedencia que de otro modo la página no tiene, y refuerza el mismo encuadre de "prototipo personal" del popover de perfil — por eso es `position: fixed` (`bottom: 0`, fondo blanco, borde superior de 1px, texto `text-muted` 12px) en vez de vivir solo al final del documento: la aclaración de que esto no es un sistema real de Clara debe verse sin depender de que alguien haga scroll hasta el final. Bajo 900px pierde el offset de `left: 240px` (el sidebar ya no ocupa ese espacio en flujo). `.companies` compensa con `padding-bottom: 120px` para que el footer fijo nunca tape la última fila de la tabla. Vive fuera de `.intro` a propósito — la introducción se mantiene puramente funcional (Don't: "no copy persuasivo"); la atribución personal no es parte de la tarea, así que vive en el footer, no en el header de tarea.

### Metric / Stat Tile (Resultados, highlights del detalle)
- **Style:** las tarjetas de métrica son `card` estándar con `padding: 24px`; el label va arriba en `text-muted` 13px, el valor abajo en navy 26px/700. Los highlights dentro del panel de detalle (línea recomendada, confianza) usan la misma jerarquía pero en miniatura, sobre un fondo `bg` en vez de blanco, para diferenciarlos visualmente de una tarjeta de primer nivel.

## Do's and Don'ts

### Do:
- **Do** usar teal sólido únicamente para el ítem activo de navegación, botones primarios, y el thumb del slider — en cualquier otro lugar, usa el tinte al 12%.
- **Do** mantener el radio `16px` para toda tarjeta contenedora de primer nivel; reserva `999px` estrictamente para elementos de estado o selección.
- **Do** representar cada estado de riesgo (ok/alerta/rechazo) con el par texto-pleno + tinte-12%, nunca con relleno sólido de color.
- **Do** actualizar cualquier valor derivado (chip de slider, métricas, panel de detalle) en el evento `input`, no en `change` ni al soltar — la respuesta inmediata es el punto central de "Sala de Control".

### Don't:
- **Don't** introducir un segundo color de acento que compita con el teal por la acción primaria.
- **Don't** usar sombras más pesadas que `card-ambient` (`0 2px 8px rgba(22, 33, 62, 0.06)`) — rompe el sistema "plano con aire".
- **Don't** bajar el texto de body por debajo de `14px` ni el de label por debajo de `12px`, ni quitar el uppercase/letter-spacing de los labels — es lo que mantiene legible una interfaz densa en datos tabulares.
- **Don't** agregar imágenes heroicas, ilustraciones, o copy persuasivo — Risk Builder es una herramienta interna (modo Operate), no una superficie de marketing.
