---
html: consensus-principles-and-rules.html
parent: consensus.html
seo:
    description: Las reglas y principios del algoritmo de consenso que permite a los usuarios para transferir fondos (incluidas divisas fiat, divisas digitales y cualquier otra forma de valor) a través de fronteras nacionales igual de facil que enviar un correo electrónico.
labels:
  - Blockchain
---
# Los principios y reglas del consenso

El XRP Ledger es un sistema de pagos universal que permite a los usuarios transferir fondos a través de fronteras nacionales de la misma forma que se envía un correo electrónico. Como otras redes de pagos peer-to-peer como Bitcoin, el XRP Ledger permite transacciones de liquidación peer-to-peer a través de una red descentralizada de ordenadores. A diferencia de otros protocolos de divisas digitales, el XRP Ledger permite a los usuarios denominar sus transacciones con cualquier divisa que prefieran, incluyendo divisas fiat, divisas digitales y cualquier otra forma de valor, y XRP (el activo nativo del XRP Ledger).

La tencología del XRP Ledger permite liquidaciones casi en tiempo real (de tres a seis segundos) y contiene un exchange descentralizado, donde los pagos automáticamente usan las ordenes de intercambio de divisas más baratas para conectar divisas.

## Transfondo

### Mecánicas

Principalmente, el XRP Ledger es una base de datos compartida que registra información como cuentas, balances, y ofertas para comerciar con activos. Las instrucciones firmadas llamadas "transacciones" generan cambios como la creación de cuentas, generación de pagos, y comerciar activos.

Como sistema criptográfico, los dueños de cuentas del XRP Ledger son identificados como _identidades criptográficas_, las cuales corresponden a pares de claves públicas/privadas. Las transacciones son autorizadas por firmas criptográficas que coinciden con esas identidades. Cada servidor procesa cada transacción de acuerdo con las mismas reglas deterministas conocidas. Finalmente, el objetivo es para cada servidor en la red tener una copia completa de exactamente el estado del mismo ledger, sin necesidad de una única autoridad central que arbitre las transacciones.


### El problema del doble gasto

El problema del "doble gasto" es un desafío fundamental para cualquier sistema de pagos digital. El problema viene del requisito de que cuando el dinero es gastado en un sitio, no puede ser gastado en otro lugar. Generalmente, el problema ocurre cuando tiene dos transacciones cualesquiera de las cuales una es válida pero no ambas juntas.

Supongamos que Alice, Bob, y Charlie están usando un sistema de pagos, y Alice tiene un balance de 10$. Para que el sistema de pagos sea útil, Alice debe ser capaz de enviar sus 10$ a Bob, o a Charlie. Sin embargo, si Alice intenta enviar 10$ a Bob y también envía 10$ a Charlie al mismo tiempo, ahí es donde el problema del doble gasto aparece.

Si Alice puede enviar los "mismos" 10$ a ambos Charlie y Bob, el sistema de pagos dejará de ser útil. El sistema de pagos necesita una forma de elegir que transacción debería suceder y cual debería fallar, de una forma que todos los participantes estén de acuerdo en que transacción ha ocurrido. Cualquiera de esas transacciones son igual de válidas por si mismas. Sin embargo, los distintos participantes pueden tener una diferente visión de que transacción llegó antes en el sistema de pagos.

Convencionalmente, los sistemas de pagos resuelven el problema del doble gasto teniendo una autoridad central que rastrea y aprueba transaciones. Por ejemplo, un banco decide compensar un cheque en función del saldo disponible del emisor, del cual el banco es el único custodio. En tal sistema, todos los participantes siguen las deicisiones de la autoridad central.

Las tecnologías de contabilidad distribuida, como el XRP Ledger, no tiene una autoridad central. Estas tecnologías deben resolver el problema del doble gasto de alguna otra forma.


## Cómo funciona el consenso

### Simplificando el problema

Gran parte del problema del doble gasto puede ser resuelto por unas reglas bien conocidas como prohibir a una cuenta que gaste fondos que no tiene. De hecho, el problema del doble gasto se puede reducir a poner transacciones en orden.

Considerando el ejemplo de Alice intentando enviar los mismos 10$ a ambos Bob y Charlie. Si el pago se sabe que es el primero, entonces todo el mundo estará de acuerdo de que ella tiene los fondos para pagar a Bob. Si el pago a Charlie se sabe que es el segundo, entonces cualquiera estará de acuerdo de que ella no tiene esos fondos para Charlie porque el dinero ya ha sido enviado a Bob.

También podemos ordenar transacciones por reglas deterministas. Porque las transacciones son colecciones de información digital, es trivial par aun ordenador ordenarlas.

Esto sería suficiente para solventar el problema del doble gasto sin una autoridad central, pero requeriría tener cada transacción que ocurriese (para así poder ordenarlas) antes de poder estar seguros de los resultados de cualquier transacción. Obviamente, no es práctico. <!-- STYLE_OVERRIDE: obviously -->

Si pudiesemos recopilar transacciones en grupos y acordar esas agrupaciones, podríamos ordenar las transacciones de ese grupo. Siempre que cada participante esté de acuerdo en qué transacciones se procesarán como una unidad, pueden usar reglas deterministas para resolver el problema del doble gasto sin necesidad de una autoridad central. Cada uno de los participantes clasifica las transacciones y las aplica de forma determinista siguiendo las reglas conocidas. El XRP Ledger resuelve el problema del doble gasto exáctamente de esta manera.

El XRP Ledger permite que múltiples transacciones conflictivas estén en el grupo acordado. El grupo de transacciones es ejecutado de acuerdo a unas reglas deterministas, por lo que la transacción que ocurra primero según las reglas de clasificación tendrá éxito y la transacción conflictiva que ocurra en segundo lugar fallará.

### Reglas de consenso

La función principal del consenso es que los participantes en el proceso acuerden qué transacciones se procesarán como grupo para resolver el problema del doble gasto. Hay cuatro razones por las que este acuerdo es más fácil de conseguir de lo que cabría esperar:

1. Si no hay ninguna razón por la que una transacción debería no estar incluida en dicho grupo de transacciones, todos los participantes honestos aceptan incluirla. Si todos los participantes ya están de acuerdo, el consenso no tiene trabajo que hacer.
2. Si hay alguna razón por la que una transacción no debe incluirse en dicho grupo de transacciones, todos los participantes honestos estarán dispuestos a excluirla. Si la transacción todavía es válida, no hay razón para incluirla en la siguiente ronda, y todos deberían aceptar incluirla en ese momento.
3. Es extremadamente raro para un participante que le importe cómo las transacciones fueron agrupadas. El acuerdo es más fácil cuando la prioridad de cualquiera es llegar a un acuerdo y  sólo desafiarlo cuando hay intereses divergentes.
4. Las reglas deterministas pueden ser usadas incluso para formar agrupaciones, llegando a desacuerdos solo en los casos extremos. Por ejemplo, si hay dos transacciones conflictivas en una ronda, las reglas deterministas pueden ser utilizadas para determinar cuál se incluye en la siguiente ronda.

La principal prioridad de cada participante es la exactitud. Primero deben hacer cumplir las reglas para estar seguros de que nadie viola la integridad del ledger compartido. Por ejemplo, una transacción que no está correctamente firmada nunca debe ser procesada (incluso si otros participantes quieren que se procese). Sin embargo, la segunda prioridad de cada participante honesto es el llegar a un acuerdo. Una red con posibles gastos dobles no tiene ninguna utilidad, así que cada participante honesto valora el acuerdo por encima de la exactitud.

### Rondas de consenso

Una ronda de consenso es una intento de ponerse de acuerdo en un grupo de transacciones para que puedan ser procesadas. Una ronda de consenso empieza con cada participante que lo desea  tomando una posición inicial. Este es el conjunto de transacciones válidas que han visto.

Después, los participantes se "avalanzan" al consenso: Si una transacción particular no tiene apoyo mayoritario, los participantes concuerdan apartar esa transacción. Si una transacción en concreto sí tiene el apoyo mayoritario, los participantes concuerdan incluir esa transacción. Así leves mayorías rápidamente consiguen apoyo completo y leves minorías rápidamente consiguen rechazo universal en la ronda actual.

Para prevenir que el consenso se atasque cerca del 50% y para reducir el superposición requerida para una convergencia confiable, el umbral requerido para incluir una transacción incrementa con el tiempo. Inicialmente, los participantes continuan acordando incluir una transacción si el 50% o más del resto de participantes está de acuerdo. Si los participantes discrepan, ellos incrementan este umbral, primero a 60% y luego más mayor, hasta que todas las transacciones discutidas son eliminadas del conjunto actual. Cualquier transacción eliminada de este modo se apartan a la siguiente versión de un ledger.

Cuando un participante ve a una sobremayoría que está de acuerdo en el conjunto de transacciones que van a ser procesadas, declara que un consenso ha sido alcanzado.

### El consenso puede fallar

No es práctico desarrollar un algoritmo de consenso que nunca falla para alcanzar un consenso perfecto. Para entender el por qué, considera cómo finaliza el proceso de consenso. En algún momento, cada participante debe declarar que ha alcanzado consenso y que un grupo de transacciones conocido ha sido el resultado de  ese proceso. Esta declaración compromete al participante de que un particular grupo de transacciones como resultado de ese proceso de consenso.

Algún participante debe hacer esto primero o ningún participante podrá hacerlo nunca, y nunca llegarán a alcanzar consenso. Ahora, considera al participante que hace esto primero. Cuando este participante decide que el consenso ha finalizado, otros participantes no han llegado todavía a tomar esa decisión. Si fuesen incapaces de cambiar el conjunto acordado desde su punto de vista, ellos habrían decidido que el consenso se había alacanzado ya. Por lo que deben todavía ser capaces de cambiar el conjunto agregado.. <!-- STYLE_OVERRIDE: will -->

En otras palabras, para que el proceso de consenso pueda finalizar, algún participante debe declarar que el consenso se ha alcanzado en un conjunto de transacciones incluso aunque cualquier otro participante teóricamente puede todavía ser capaz de cambiar el conjunto acordado de transacciones.

Imagina un grupod e personas en una habitación intentando acordar qué puerta deberían utilizar para salir. No importa cuanto discutan los participantes, en algún momento, _alguien_ tiene que ser el primero en pasar por la puerta, incluso aunque las personas después de esta persona puede todavía cambiar su opinión y salir por otra puerta.

La probabilidad de este tipo de fallo puede ser muy baja, pero no se puede reducir a cero. El balance de ingeniería es tal que llevar esta probabilidad por debajo por debajo de uno entre mil hacer el consenso significamente más lento, y menos tolerable a fallos de endpoint o de red.

### Cómo maneja los fallos de consenso el XRP Ledger

Después de que una ronda de consenso se complete, cada participante aplica el conjunto de transacciones que cree que se ha agregado. Esto resulta en la contrucción de lo que ellos creen que será el próximo estado del ledger que debería ser.

Los participantes que también son validadores publican entonces una huella criptográfica para el siguiente ledger. Llamamos a esa huella un "voto de validación". Si la ronda de consenso ocurre, la gran mayoría de validadores honestos deberían publicar la misma huella.

Después, los participantes recolectan estos votos de validación. Con los votos de validación, pueden determinar si la ronda de consenso anterior resultó en una supermayoría de participantes acordando el conjunto de datos o no.

Luego, los participantes se encontrarán a si mismos en uno de estos tres casos, en orden de probabilidad:

1. Contruyeron el mismo ledger que la mayoría ha acordado. En este caso, pueden considerar que ese ledger está validado y se puede confiar en su contenido.
2. Construyeron un ledger diferente al acordado por la supermayoría. En este caso, deben construir y aceptar el ledger de la supermayoría. Esto suele indicar que han declarado conenso antes y otros participantes cambiaron después de eso. Deben "saltar" al ledger de la supermayoría para continuar la operación.
3. Si la supermayoría no está clara de las validaciones recibidas. En este caso, la ronda de consenso previa se ha malgastado y una nueva ronda debe ocurrir antes de que ningún ledger sea validado.

Por supuesto, el caso 1 es el más común. El caso 2 no daña a la red en absoluto. Un pequeño porcentaje de participantes podría caer en el caso 2 cada ronda, y la red podría funcionar sin problemas. Incluso esos participantes pueden reconocer que no han construido el mismo ledger que la supermayoría, por lo que saben que no reportarán sus resultados hasta el final cuando estén de acuerdo con la supermayoría.

El caso 3 resulta en la red perdiendo unos segundos en los que podría haber avanzado, pero esto es extremadamente raro. En este caso, la siguiente ronda de consenso es mucho menos probable que falle porque los desacuerdos están resueltos en el proceso de consenso y solo los descauerdos restantes pueden provocar un fallo.

En raras ocasiones, la red como conjunto falla para progresar hacia adelante por unos segundos. A cambio, los tiempos de confirmaciones de transacciones son bajos.

## Filosofía

Una forma de confiar es la habilidad del sistema de proveer resultados incluso en situaciones donde algunos componentes han fallado, algunos participante son maliciosos, y así. Mientras esto es importante, hay otra forma de confiar que es mucho más importante en los sistemas de pagos criptográficos - la habilidad de un sistema para producir resultados en los que se puede confiar. Eso ocurre, cuando un sistema nos reporta un resultado es confiable, debemo ser capaces de confiar en ese resultado.

Los sistemas del mundo real, sin embargo, se enfrentan a condiciones operacionales en que ambos tipos de confiabilidad puede ser comprometida. Esto incluye fallos de hardware, fallos de comunicación, incluso participantes deshonestos. Parte de la filosofía del diseño del XRP Ledger es detectar condiciones donde la confianza de resultados está dañada y hay que reportarlos, en vez de facilitar resultados en los que no se debe confiar.

El algoritmo de consenso del XRP Ledger provee una alternativa robusta a sistemas de prueba de trabajo (proof of work), sin consumir recursos computacionales innecesariamente. Los fallos bizantinos son posibles, y ocurren, pero la consecuencia son solo retrasos menores. En todos los casos, el algoritmo de consenso de XRP Ledger informa que los resultados son confiables solo cuando de hecho lo son.

## Ver también

- **Conceptos:**
    - [Consenso](index.md)
    - [Investigación del consenso](consensus-research.md)
    - [Vídeo del mecanismo de consenso del XRPL](https://www.youtube.com/watch?v=k6VqEkqRTmk&list=PLJQ55Tj1hIVZtJ_JdTvSum2qMTsedWkNi&index=2)
- **Tutoriales:**
    - [Envío de transacciones confiable](../transactions/reliable-transaction-submission.md)
    - [Ejecutar `rippled` como Validador](../../infrastructure/configuration/server-modes/run-rippled-as-a-validator.md)
- **Referencias:**
    - [Referencia del formato ledger](../../references/protocol/ledger-data/index.md)
    - [Referencia del formato de transacción](../../references/protocol/transactions/index.md)
    - [método consensus_info][]
    - [método validator_list_sites][]
    - [método validators][]
    - [método consensus_info][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
