---
seo:
    description: Respuestas a preguntas frecuentes sobre el XRP Ledger, el ecosistema XRPL y la comunidad.
subtitle: Respuestas a tus preguntas XRPL
labels:
  - Blockchain
---
###### FAQ
# Respuestas a Tus Preguntas XRPL

<!--#{ Use H4s for questions and H2s for sections. This keeps the sidebar nav from getting too clustered and allows the faq filter to stylize things as an accordion. #}-->

#### ¿Es XRPL una blockchain privada, propiedad de Ripple?

No, el XRP Ledger es una blockchain pública y descentralizada. Cualquier cambio que impactase al proceso de las transacciones o al consenso necesita ser aprobado por al menos el 80%% de la red. Ripple es un contribuidor de la red, pero sus derechos son los mismos que los de otros contruibuidores. En términos de validación, hay más de 150 validadores en la red con más de 35 en la Lista de Nodos Únicos (ver [“¿Qué son las Listas de Nodos Únicos (UNLs en inglés)?” abajo](#what-are-unique-node-lists-unls)) — Ripple mantiene [solo 1](https://foundation.xrpl.org/2023/03/23/unl-update-march-2023/) de esos nodos.

#### ¿No es la Prueba de Trabajo (Proof of Work) el mejor mecanísmo de validación?

La Prueba de Trabajo (PoW en inglés) fue el primer mecanismo para resolver el problema del doble gasto sin requerir a un tercero de confianza. [El mecanismo de consenso del XRP Ledger](../docs/concepts/consensus-protocol/index.md) resuelve el mismo problema de una manera mucho más rápida, barata y energéticamente más eficiente.

#### ¿Cómo puede ser una blockchain sostenible?

Se sabe abiertamente que el consumo de energia de Bitcoin, a partir de 2021, es equivalente al utilizado por Argentina, mucha de la electricidad que usan los mineros de Bitcoin procede de fuentes contaminantes. El XRP Ledger confirma transacciones a través del mecanismo de “[consenso](../docs/concepts/consensus-protocol/index.md)” - el cual no desperdicia energía como lo hace la prueba de trabajo - y aprovecha las compensaciones de carbono para ser [una de la primeras blokchains verdaderamente neutral en carbono](https://ripple.com/ripple-press/ripple-leads-sustainability-agenda-to-achieve-carbon-neutrality-by-2030/).

#### ¿Pueden otras divisas que no sean XRP ser intercambiadas a través del XRPL?

Sí, el XRP Ledger fue creado específicamente para poder tokenizar activos arbitrarios, como el USD, EUR, petróleo, oro, puntos de fidelización, y más. Cualquier divisa puede ser emitida en el XRP Ledger. Esto se ilustra en la creciente comunidad que respalda una variedad de tokens cripto y fiat.

#### ¿No es XRPL solo para pagos?

Aunque XRPL inicialmente se desarrolló para casos de uso de pagos, tanto el libro mayor como el activo nativo digital XRP se han ido popularizando para un rango de casos de uso innovadores como los NFTs. Nuevas propuestas de estándares para un creador de mercados automatizado (en inglés, AMM), la enmienda de los "hooks" para la funcionalidad de contratos inteligentes, y puentes entre cadenas están siendo desarrollados.

## Validadores y Listas de Nodos Únicos

#### ¿Qué servicio brindan los validadores de transacciones?

Todos los nodos garantizan que las transacciones cumplen los requisitos del protocolo y, por lo tanto, son "válidas". El servicio que proveen los validadores de manera única es agrupar administrativamente las transacciones en unidades ordenadas, acordando uno de esos órdenes específicamente para prevenir el doble gasto. <!-- STYLE_OVERRIDE: therefore -->

Ver [Consenso](../docs/concepts/consensus-protocol/index.md) para más información sobre el proceso de consenso.


#### ¿Cuánto cuesta mantener un validador?

Mantener un validador no requiere de comisiones o XRP. Es comparable al gasto de ejecutar un servidor de correo electrónico en términos de uso de electricidad.


#### ¿Qué son Las Listas de Nodos Únicos (UNLs)?

Las UNLs son las listas de validadores que un participante determinado cree que no conspirarán para defraudarle. Cada operador de servidor puede elegir su propia UNL, generalmente basándose en un cojunto determinado proporcionado por un publicador de confianza. (La lista predeterminada de un publicador a veces es llamada UNL predeterminada, o _dUNL_.) <!-- STYLE_OVERRIDE: will --> <!-- SPELLING_IGNORE: dUNL -->


#### ¿Qué UNL debería escoger?

Dado que cualquiera puede montar un validador, la carga de elegir un conjunto confiable de validadores recae sobre los participantes. Actualmente, la XRP Ledger Foundation y Ripple publican listas predeterminadas recomendadas de valiadores de alta calidad, basadas en desesmpeño pasado, identidades comprobadas, y políticas de IT responsables. Sin embargo, cada participante de la red puede elegir qué validadores considera confiables y no necesita seguir a uno de los publicadores mencionados anteriormente.


#### Si Ripple recomienda la adopción de su UNL, ¿Esto no crea un sistema centralizado?

No. Cada participante elige directa o indirectamente su UNL. Si Ripple dejase de operar o actuase de manera maliciosa, los participantes pueden cambiar sus UNLs para usar una lista de un publicador diferente.


#### ¿Cuál es la estructura de incentivos para los validadores?

El principal incentivo para ejecutar un validador es preservar y proteger el funcionamiento estable y la evolución sensata de la red. Son los validadores quienes deciden la evolución del XRP Ledger, por lo que cualquier negocio que utilice o dependa del XRP Ledger tiene un incentivo inherente para garantizar la confiabilidad y estabilidad de la red. Los validadores también se ganan el respeto y la buena voluntad de la comunidad al contribuir de esta manera.

Si ejecutas un servidor XRP Ledger para participar en la red, el costo y el esfuerzo adicionales para ejecutar un validador son mínimos. Esto significa que no son necesarios incentivos adicionales, como las recompensas mineras en Bitcoin. Ripple evita pagar XRP como recompensa por operar un validador para que dichos incentivos no deformen el comportamiento de los validadores.

Para ver ejemplos de cómo los incentivos pueden distorsionar el comportamiento de validación, lee sobre [valor extraíble del minero (MEV en inglés)](https://arxiv.org/abs/1904.05234).


#### ¿Pueden las instituciones financieras establecer validadores de transacciones para ayudarlas a cumplir estándares y requisitos institucionales específicos?

No, las instituciones no pueden configurar políticas de validación personalizadas para elegir permitir algunas transacciones y rechazar otras. Los validadores siguen el protocolo o no. Si el software no sigue las reglas del protocolo, no funciona. Por lo tanto, no se recomienda que las instituciones busquen implementaciones personalizadas sin experiencia interna.


#### ¿Qué pasa si más del 20% de los nodos de la red no están de acuerdo con la mayoría? ¿Cómo se elige la versión final del ledger?

Normalmente, si hay una disputa sobre la validez de una transacción, esa transacción se pospone hasta que la mayoría pueda llegar a un acuerdo. Pero si más del 20% de la red no siguiera las mismas reglas de protocolo que la mayoría, la red se detendría temporalmente. Podría reanudarse cuando los participantes reconfiguren sus UNL en función de aquellos que quieran llegar a un consenso entre ellos. Se desea este retraso temporal en el procesamiento en lugar de duplicar el gasto.

En el proceso de determinar la versión autoritativa de un ledger, puede haber varias versiones internas temporales. Estas versiones internas ocurren naturalmente en sistemas distribuidos porque no todos los nodos reciben transacciones en el mismo orden. El comportamiento análogo en Bitcoin es cuando dos servidores ven cada uno una cadena más larga diferente porque dos bloques fueron extraídos aproximadamente al mismo tiempo.

Sin embargo, sólo puede haber una última versión del ledger _validated_ en un momento dado; otras versiones son irrelevantes e inofensivas.

Para obtener más información sobre cómo se comporta el mecanismo de consenso del XRP Ledger en situaciones adversas, consulta [Protecciones de consenso contra ataques y modos de fallo](../docs/concepts/consensus-protocol/consensus-protections.md).


#### ¿El XRP Ledger tiene un proceso formal para añadir validadores?

No, un proceso formal para agregar validadores no es compatible con XRP Ledger, porque es un sistema sin autoridad central.

Los publicadores de UNL predeterminados individuales establecen sus propias políticas sobre cuándo agregar o eliminar validadores de sus listas de recomendaciones.

Para recomendaciones y mejores prácticas, consulta [Ejecutar `rippled` como validador](../docs/infrastructure/configuration/server-modes/run-rippled-as-a-validator.md).


#### Si la dUNL tiene lmayor influencia en la red, ¿quiere decir que XRPL es centralizado?
Los validadores pueden optar por no utilizar la dUNL o cualquier UNL ampliamente utilizada. Cualquiera puede crear una nueva UNL en cualquier momento.

Puede haber varias UNL en uso en la misma red. Cada operador puede personalizar la UNL de su propio servidor o elegir seguir una lista recomendada diferente. Todos estos servidores todavía pueden ejecutar la misma cadena y llegar a un consenso entre sí.

Sin embargo, si tu UNL no coincide lo suficiente con las UNL utilizadas por otros, existe el riesgo de que su servidor se separe (fork) del resto de la red. Siempre que tu UNL tenga > 90 % de superposición con la utilizada por las personas con las que transaccionas, estás completamente a salvo de bifurcarte. Si tiene menos superposición, es posible que aún puedas seguir la misma cadena, pero las posibilidades de bifurcarte aumentan con una menor superposición, peor conectividad de red y la presencia de validadores maliciosos o poco confiables en tu UNL.


## Papel de XRP


#### ¿Cuál es el proposito de XRP?

XRP se creó como el activo nativo de XRP Ledger para potenciar una nueva generación de pagos digitales: más rápidos, más ecológicos y más baratos que cualquier activo digital anterior. También sirve para proteger el ledger del spam y para [conectar divisas](../docs/concepts/tokens/decentralized-exchange/autobridging.md) en el exchange descentralizado del XRP Ledger, cuando hacerlo es beneficioso para los usuarios. Con el tiempo, la comunidad XRP Ledger ha sido pionera en nuevos [casos de uso](/about/uses) para XRP, al igual que el propio XRP Ledger.


#### ¿Cómo responde el XRP Ledger al flood de transaciones?

El XRP Ledger está diseñado para establecer el [coste de transacción](../docs/concepts/transactions/transaction-cost.md) dinámicamente en función de la demanda como una medida antispam. El impacto de cualquier posible manipulación de XRP es minimizado a medida que la red crece, crece la capitalización y crece el volumen de transacciones.


#### ¿Qué ocurre con el lavado de dinero y la actividad económica sospechosa?

<!-- STYLE_OVERRIDE: regarding -->

La red XRP Ledger es una red abierta y todas las transacciones son públicamente visibles.

Ripple se compromete a monitorear e informar cualquier indicador AML en la red XRP Ledger, así como a informar actividades sospechosas a FinCEN, según corresponda.

[XRP Forensics / xrplorer](https://xrplorer.com/) mantiene una lista de asesoramiento para rastrear y minimizar el lavado de dinero, las estafas, el fraude y el uso ilícito del XRP Ledger. Los exchanges y otros proveedores de servicios pueden utilizar este servicio para prevenir y reaccionar ante delitos financieros.


## Consideraciones de seguridad


#### ¿Cuál es el proceso para revisar las contribuciones de código de terceros?

El proceso de contribución de código comienza cuando un desarrollador abre una [pull request](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) a un repositorio de código fuente como el [repositorio `rippled`](https://github.com/xrplf/rippled/), que contiene la implementación de referencia de Ripple del núcleo del servidor y del protocolo de XRP Ledger.

Este pull request activa pruebas unitarias y de integración automatizadas, así como revisiones de código por parte de varios desarrolladores que, por lo general, tienen experiencia significativa en el área de código a la que afecta al pull request.

Una vez que el pull request pasa las pruebas automatizadas y recibe la aprobación de los revisores, un [mantenedor del repositorio](https://opensource.guide/best-practices/) confiable puede prepararlo para su inclusión en la próxima versión beta.


#### ¿Ripple posee o controla el XRP Ledger o la red XRP Ledger?

No, Ripple no posee ni controla el XRP Ledger o la red XRP Ledger.

Ripple contribuye a una implementación de referencia del nucleo del servidor de XRP Ledger ([`rippled`](https://github.com/xrplf/rippled)) y emplea un equipo de ingenieros que contribuyen al código base de código abierto. Ripple publica periodicamente paquetes binarios precompilados. Cualquiera puede [descargar y compilar el software desde la fuente](../docs/infrastructure/installation/index.md).

Varias entidades publican listas de validadores recomndadados (UNLs). Desde julio de 2023, Ripple mantiene solo uno de los 35 validadores que están en la UNL por defecto.


#### ¿El XRP Ledger distingue entre el código base para la validación y el del software del usuario?

Sí. Hay varias [librerías de cliente para XRP Ledger](../docs/references/client-libraries.md) que están destinadas a desarrolladores de software de usuario. Estas librerias tienen distintos códigos base y repositorios del [núcleo del servidor XRP Ledger](../docs/concepts/networks-and-servers/index.md) que alimenta la red y valida las transacciones.
