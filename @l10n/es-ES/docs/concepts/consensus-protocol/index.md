---
html: consensus.html
parent: concepts.html
seo:
    description: El consenso es cómo los nuevos bloques de transacciones son confirmados por la blockchain XRP Ledger.
labels:
  - Blockchain
top_nav_grouping: Popular Pages
---
# El protocolo de consenso

Este tema explica cómo el XRP Ledger descentralizado confirma nuevas transacciones y nuevas versiones de ledgers, creando una blockchain.

El consenso es la propiedad más importante de cualquier sistema de pagos descentralizado. En sistemas de pagos centralizados tradicionales, un administrador autorizado tiene la última palabra en cómo los pagos deben ocurrir. En sistemas descentralizados, por definición, no hay un administrador para hacerlo. En cambio, los sistemas descentralizados como el XRP Ledger definen un conjunto de reglas que todos los participantes siguen, así cada participante puede estar de acuerdo en la misma exacta serie de eventos y sus resultados en cualquier momento. A este conjunto de reglas les llamamos un _protocolo de consenso_.


## Propiedades del protocolo de consenso

El XRP Ledger utiliza el protocolo de consenso de una forma diferente a todos los activos digitales anteriores. Este protocolo, conocido como el Protocolo de Consenso de XRP Ledger, está diseñado para tener las siguientes propiedades importantes:

- Todos los que utilizan el XRP Ledger pueden ponerse de acuerdo en el último estado, y qué operaciones se han producido y en qué orden.
- Todas las transacciones válidas son procesadas sin necesidad de un operador central o sin tener un único punto de fallo.
- El ledger puede progresar incluso si algunos participantes se incorporan, se marchan o tienen un comportamiento inapropiado.
- Si demasiados participantes son incontactables o se comportan inadecuadamente, la red fallará a la hora de progresar en vez de divergir o confirmar transacciones inválidas.
- Confirmar transacciones no requiere un uso de recursos competitivos o malgastados, como en muchos otros sistemas blockchains.

Estas propiedades se resumen a veces en los siguientes principios, en orden de prioridad: **Correción, Acuerdo, Progreso**.

Este protocolo sigue evolucionando, al igual que nuestro conocimiento de sus límites y posibles casos de fallo. Para investigaciones academicas del protocolo en sí, ver [Investigación del consenso](consensus-research.md).

## Trasfondo

Los protocolos de consenso son una solución al _problema del doble gasto_: el desafío de prevenir a alguien de gastar con éxito dos veces el mismo dinero digital. La parte más dificil de este problema es poner las transacciones en orden: sin una autoridad central, puede ser dificil resolver disputas sobre qué transacciones van primero cuando dos o más transacciones mutuamente excluyentes se envían al mismo tiempo. Para un análisis del problema del doble gasto, cómo el Protocolo de Consenso XRP Ledger resuelve este problema, las concesiones y limitaciones involucradas, ver [Principios y reglas del consenso](consensus-principles-and-rules.md).


## Histórico del ledger

El XRP Ledger procesa transacciones en bloques llamadados "versiones del ledger", o "ledgers" abreviado. Cada versión del ledger contiene tres partes:

- El estado actual de todos los balances y objetos guardados en el ledger.
- El conjunto de transacciones que han sido aplicadas en el ledger anterior para dar como resultado este.
- Metadatos sobre la versión actual del ledger, como el índice del ledger, un [hash criptográfico](https://en.wikipedia.org/wiki/Cryptographic_hash_function) que identifica de forma única su contenido, e información sobre el ledger parental que se usó como base para construir este.

[{% inline-svg file="/docs/img/anatomy-of-a-ledger-simplified.svg" /%}](/docs/img/anatomy-of-a-ledger-simplified.svg "Figura 1: Anatomía de una versión de un ledger, que incluye transacciones, estado, y metadatos")

Cada versión del ledger está numerado por un _ledger index_ o índice ledger y se basa en una versión anterior del ledger cuyo índice es uno menos, y se remonta hasta el punto de partida llamado el _ledger génesis_ con un índice ledger 1.[¹](#footnote-1) Como Bitcoin y otras tecnologías blockchain, esto forma el histórico público de todas las transacciones y sus resultados. A diferencia de otras tecnologías blockchain, cada nuevo "bloque" en el XRP Ledger contiene la totalidad del estado actual, por lo que no tienes que recopilar toda el histórico completo para conocer qué esta pasando ahora.[²](#footnote-2)

El objetivo principal del Protocolo de Consenso del XRP Ledger es acordar un conjunto de transacciones para añadir la nueva siguiente versión del ledger, aplicarlos en un orden bien definido, y después confirmar con todo el mundo para tener los mismos resultados. Cuando esto ocurre satisfactoriamente, una versión del ledger es considerado _validado_, y definitivo. A partir de aquí, el proceso continua construyendo la siguiente versión del ledger.


## Validación basada en la confianza

El principio básico detrás del mecanismo de consenso del XRP Ledger es que un poco de confianza ayuda mucho. Cada participante en la red elige un conjunto de _validadores_, servidores [configurados específicamente para participar activamente en el consenso](../../infrastructure/configuration/server-modes/run-rippled-as-a-validator.md), gestionados por diferentes equipos que se espera que se comporten honestamente la mayor parte del tiempo según el protocolo. Aún más importante, el conjunto de validadores elegidos no deberían confabular entre sí para infringir las reglas de la misma manera. Esta lista se llama _Lísta Única de Nodos_, o UNL.

A medida que la red avanza, cada servidor escucha a sus validadores de confianza[³](#footnote-3); siempre y cuando un porcentaje lo suficientemente grande de ellos esté de acuerdo en que un conjunto de transacciones debería ocurrir y que un ledger dado es el resultado, el servidor declara un consenso. Si no están de acuerdo, los validadores modifican sus propuestas para que coincidan más con las de otros validadores en los que confían, repitiendo el proceso en varias rondas hasta alcanzar un consenso.

[{% inline-svg file="/docs/img/consensus-rounds.svg" /%}](/docs/img/consensus-rounds.svg "Figura 2: Rondas de consenso. Los validadores revisan sus propuestas para coincidir con otros validadores en los que confían")

Esta bien si una pequeña porción de los validadores no funciona correctamente todo el tiempo. Siempre que menos del 20% de los  validadores de confianza fallen, el consenso puede continuar sin impedimentos; y confirman una transacción inválida requeriría que más del 80% de los validadodres de confianza se confabulasen. Si más del 20% o menos del 80% de los validadores confiables fallan, la red para de progresar.

Para una exploración de cómo el Protocolo de Consenso del XRP Ledger responde a varios desafíos, ataques, y casos de fallo, ver [Protecciones del Consenso contra Ataques y Modos de Fallo](consensus-protections.md).


----

## Pies de página

1. <a id="footnote-1"></a> Debido a un percance ocurrido al inicio de la historia de XRP Ledger, [se perdieron los ledgers del 1 al 32569](http://web.archive.org/web/20171211225452/https://forum.ripple.com/viewtopic.php?f=2&t=3613). (Esta pérdida representa aproximadamente la primera semana de la historia del ledger.) Por lo tanto, el ledger #32570 es el ledger más antiguo disponible. Porque el estado del XRP Ledger se guarda en cada versión de cada ledger, el ledger puede continuar sin la historia perdida. Las nuevas redes de prueba seguirán empezando con el índice del ledger 1.

2. <a id="footnote-2"></a> En Bitcoin, el estado actual a veces se llama conjunto de "UTXOs" (salidas de transacción no gastadas). A diferencia que el XRP Ledger, un servidor Bitcoin debe descargar el histórico completo de transacciones para conocer el conjunto completo de UTXOs y procesar nuevas transacciones. Desde 2018, ha habido varias propuestas para modificar el mecanismo de consenso de Bitcoin para periódicamente resumir las últimas UTXOs para que los nuevos servidores no necesiten hacerlo. Ethereum utiliza un enfoque similar al del XRP Ledger, con un resumen del estado actual (conocido como _state root_) en cada bloque, pero la sincronización tarda más en Ethereum porque almacena más información en su estado de datos. <!-- SPELLING_IGNORE: utxos -->

3. <a id="footnote-3"></a> Un servidor no necesita una conexión directa con sus validadores de confianza para escucharlos. La red peer-to-peer del XRP Ledger utiliza un _protocolo de cotilleo_ donde los servidores se identifican entre ellos con una clave pública y transmiten mensajes firmados digitalmente por otros.
