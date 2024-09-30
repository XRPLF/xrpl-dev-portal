---
html: negative-unl.html
parent: consensus.html
seo:
    description: Comprende cómo la UNL negativa mejora la resiliencia durante interrupciones parciales.
labels:
  - Blockchain
---
# UNL negativa

_Añadida por la [enmienda NegativeUNL](/resources/known-amendments.md#negativeunl)._

La _UNL negativa_ es una característica del [protocolo de consenso](index.md) del XRP Ledger que mejora la _viveza_, la habilidad de la red a seguir progresando hacia adelante durante una interrupción parcial. Utilizando la UNL negativa, los servidores ajustan sus UNLs efectivas en función de los validadores que están actualmente en línea y operativos, de modo que una nueva [versión ledger](../ledgers/index.md) puede ser declarada _validada_ incluso si varios validadores confiables están offline.

La UNL negativa no tiene impacto en cómo la red procesa los resultados de las transacciones o en los resultados de las transacciones, excepto que mejora la habilidad de la red para declarar resultados finales durante algunos tipos de interrupciones parciales.

## Transfondo

Cada servidor en el protocolo XRP Ledger tiene su propia UNL (Lista de Nodos Únicos), una lista de validadores en los que se confía para no colisionar, y cada servidor decide independientemente cuándo se valida una versión del ledger basándose en el consenso cuando suficientes de sus validadores confiables están de acuerdo en una nueva versión del ledger. (La configuración predeterminada utiliza una UNL recomendada, firmada por Ripple, que consiste en validadores que Ripple considera suficientemente únicos, confiables e independientes). El requisito del cuórum estándar es que al menos el 80% de los validadores confiables deben estar de acuerdo.

Si más del 20% de los validadores confiables se desconectan o no pueden comunicarse con el resto de la red, la red deja de validar nuevos ledgers porque no puede alcanzar un cuórum. Esta es una elección de diseño para garantizar que los resultados de las transacciones no puedan cambiarse después de que se declaren definitivos. Durante dicha situación, los servidores restantes seguirían en línea y podrían proporcionar datos de transacciones pasadas y tentativas, pero no podrían confirmar el resultado final, inmutable, de nuevas transacciones.

Sin embargo, esto significa que la red podría dejar de avanzar si algunos validadores ampliamente confiables se desconectaran. A partir del 6 de octubre de 2020, hay 34 validadores en la UNL recomendada de Ripple, por lo que la red dejaría de avanzar si 7 o más de ellos estuvieran desconectados. Además, si uno o dos validadores están desconectados por un período prolongado, la red tiene menos margen para el desacuerdo entre los validadores restantes, lo que puede hacer que tarde más en alcanzar un consenso.

## Resumen

No es razonable esperar que un conjunto diverso de validadores mantenga un tiempo de actividad del 100%: muchas cosas pueden hacer que un validador se vuelva temporalmente indisponible, como: mantenimiento de hardware, actualizaciones de software, problemas de conectividad a Internet, ataques dirigidos, errores humanos, fallos de hardware y circunstancias externas como desastres naturales.

La "UNL negativa" es una **lista de validadores de confianza que se cree que están desconectados o con mal funcionamiento**, según lo declarado por un consenso de los validadores restantes. Los validadores en la UNL negativa son ignorados para determinar si una nueva versión del ledger ha alcanzado un consenso.

Cuando un validador que está en la UNL negativa vuelve a estar en línea y envía votos de validación consistentes, los validadores restantes lo eliminan de la UNL negativa después de un tiempo corto.

En casos donde los validadores se desconecten uno o dos a la vez, los validadores restantes pueden usar la UNL negativa para ajustar gradualmente sus UNL efectivas, de modo que la red solo necesite el 80% de los validadores _en línea_ para alcanzar un cuórum. Para evitar que la red se fragmente, el cuórum tiene un mínimo estricto del 60% de los validadores _totales_.

Si más del 20% de los validadores de repente se desconectan todos a la vez, los servidores restantes no pueden alcanzar el quórum necesario para validar un nuevo ledger, por lo que no se podrían validar nuevos ledgers. Sin embargo, esos servidores aún pueden avanzar tentativamente a través de rondas de consenso sucesivas. Con el tiempo, los validadores restantes continuarían aplicando cambios a la UNL negativa a los ledgers tentativos y ajustarían sus UNL efectivas; eventualmente, si la situación persiste, la red podría reanudar la validación completa de ledgers utilizando la UNL negativa ajustado de las versiones de ledgers tentativas.

La UNL negativa no tiene efecto sobre el modo solitario o [stand-alone mode](../networks-and-servers/rippled-server-modes.md) porque el servidor no utiliza el consenso en el modo solitario.


## Cómo funciona

La UNL negativa está estrechamente ligada al [proceso de consenso](index.md) y está diseñada con salvaguardas para mantener la continuidad y confiabilidad de la red en situaciones adversas. Cuando todos los validadores confiables están funcionando normalmente, la UNL negativa no se utiliza y no tiene efecto. Cuando algunos validadores parecen estar desconectados o desincronizados, se aplican las reglas de la UNL negativa.

La UNL negativa está diseñada intencionalmente para cambiar a una velocidad lenta, para evitar desacuerdos basados en el tiempo sobre qué la UNL negativa debería aplicarse al proceso de consenso de una versión dada del ledger.


### Medición de fiabilidad

Cada servidor en la red tiene una UNL, la lista de validadores en los que confía para no colisionar. (Por defecto, la UNL exacta de un servidor se configura implícitamente en función de la lista de validadores recomendada que Ripple publica). Cada servidor sigue la _fiabilidad_ de sus validadores de confianza utilizando una métrica única: el porcentaje de los últimos 256 ledgers donde el voto de validación del validador coincidió con la vista de consenso del servidor. En otras palabras:

> Fiabilidad = V<sub>a</sub> ÷ 256

V<sub>a</sub> es el número total de votos de validación recibidos de un validador en los últimos 256 ledgers que coincidieron con la vista de consenso del servidor.

Esta métrica de fiabilidad mide la disponibilidad de un validador _y_ el comportamiento de ese validador. Un validador debería tener una puntuación de fiabilidad alta si está sincronizado con el resto de la red y sigue las mismas reglas de protocolo que el servidor que lo califica. La puntuación de fiabilidad de un validador puede verse afectada por cualquiera de las siguientes razones:

- Los votos de validación del validador no están llegando al servidor debido a una mala conectividad de red entre ellos.
- El validador deja de funcionar o se sobrecarga.
- El validador no sigue las mismas reglas de protocolo que el servidor, por diversas razones. Las posibilidades incluyen una mala configuración, errores de software, seguir intencionalmente una [red distinta](../networks-and-servers/parallel-networks.md), o un comportamiento malicioso.

Si la fiabilidad de un validador es **inferior al 50%**, es candidato para ser agregado al Negative UNL. Para ser eliminado de la UNL negativa, la fiabilidad de un validador debe ser **superior al 80%**.

Cada servidor, incluidos los validadores, calcula de forma independiente las puntuaciones de fiabilidad para todos sus validadores confiables. Diferentes servidores pueden llegar a diferentes conclusiones sobre la fiabilidad de un validador, ya sea porque los votos de ese validador llegaron a un servidor y no al otro, o porque desacordaban sobre ledgers específicos con más o menos frecuencia. Para añadir o eliminar un validador en la UNL negativa, se debe lograr un consenso de los validadores confiables sobre si un validador en particular está por encima o por debajo del umbral de fiabilidad.

**Consejo:** Los validadores siguen su propia fiabilidad, pero no proponen agregarse a la UNL negativa. La medida de fiabilidad de un validador por sí sola no puede tener en cuenta cuán exitosamente se propagan sus votos de validación a través de la red, por lo que es menos confiable que las mediciones de servidores externos.



### Modificación de la UNL negativa

Una versión del ledger se considera un _flag ledger_ si su índice de ledger o index es divisible entera por 256. La UNL negativa solo se puede modificar en flag ledgers. (Los flag ledgers ocurren una vez cada 15 minutos en la red principal, Mainnet, de XRP Ledger. Pueden estar más separados en redes de prueba (test) que tienen un volumen de transacciones bajo).

En cada flag ledger, se aplican todos los siguientes cambios:

1. Los cambios la UNL negativa que se programaron en el flag ledger anterior entran en vigencia para la siguiente versión del ledger. El proceso de consenso para validar este flag ledger en sí mismo no utiliza el cambio programado.

    **Nota:** Esto es uno de los únicos momentos en los que el estado de datos del ledger se modifica sin una [transacción](../transactions/index.md) o [pseudo-transacción](../../references/protocol/transactions/pseudo-transaction-types/pseudo-transaction-types.md).

2. Si la UNL negativa no está llena, cada servidor propone añadir **hasta 1** validador a la UNL negativa entre sus validadores confiables con una fiabilidad inferior al 50%.
3. Si la UNL negativa no está vacía, cada servidor propone eliminar **hasta 1** validador de la UNL negativa. Un servidor puede proponer eliminar un validador de la UNL negativa por dos motivos:
    - Califica a ese validador con una fiabilidad > 80%.
    - No tiene a ese validador en su UNL. (Si un validador deja de funcionar permanentemente, esta regla garantiza que se elimine de la UNL negativa en el ledger después de que se haya eliminado de las UNL configuradas de los servidores).
4. Si un cambio propuesto a la UNL negativa logra un consenso, el cambio se programa para entrar en vigencia en el siguiente flag ledger. Se puede programar hasta una adición y una eliminación de esta manera.

Las propuestas para agregar y eliminar validadores de la UNL negativa toman la forma de [pseudo-transacciones de UNLModify][]. El proceso de consenso determina si cada pseudo-transacción logra un consenso o se descarta, de la misma manera que otras [pseudo-transacciones](../../references/protocol/transactions/pseudo-transaction-types/pseudo-transaction-types.md). En otras palabras, para que un validador en particular se agregue o elimine a la UNL negativa, se debe lograr un consenso de servidores sobre el mismo cambio.

Los cambios programados y efectivos de la UNL negativa se rastrean en el [objeto NegativeUNL](../../references/protocol/ledger-data/ledger-entry-types/negativeunl.md) en los datos de estado del ledger.


### Límites de la UNL negativa

Para prevenir que la red se fragmente en dos o más subredes, la UNL negativa no puede reducir el requisito de cuórum a menos del 60% de las entradas de UNL _totales_. Para hacer cumplir esto, un servidor considera que la UNL negativa está "llena" si el número de validadores en la UNL negativa es del 25% (redondeado hacia abajo) del número de validadores en la UNL configurada del servidor. (El 25% se basa en el cálculo de que si se eliminan el 25% de los validadores, un consenso del 80% del 75% restante equivale al 60% del número original). Si un servidor considera que la UNL negativa está llena, no propondrá nuevas adiciones a la UNL negativa; pero, como siempre, el resultado final depende de lo que haga un consenso de validadores de confianza.


### Elección de múltiples validadores candidatos

Es posible que múltiples validadores sean candidatos para ser agregados a la UNL negativa, según el umbral de fiabilidad. Dado que como máximo se puede agregar un validador a la UNL negativa a la vez, los servidores deben elegir qué validador proponer agregar. Si hay múltiples candidatos, el servidor elige cuál proponer con el siguiente mecanismo:

1. Comienza con el hash del ledger de la versión anterior.
0. Toma la clave pública de cada validador candidato.
0. Cacula el valor de exclusión-o (XOR) del validador candidato y el hash del ledger padre.
0. Propón el validador con el resultado numéricamente más bajo de la operación XOR.

Si hay múltiples candidatos para ser eliminados de la UNL negativa en un flag ledger dado, los servidores utilizan el mismo mecanismo para elegir entre ellos.

Este mecanismo tiene varias propiedades útiles:

- Utiliza información que está fácilmente disponible para todos los servidores y se puede calcular rápidamente.
- La mayoría de los servidores eligen el mismo candidato incluso si calculan puntuaciones ligeramente diferentes para sus validadores de confianza. Esto se mantiene incluso si esos servidores discrepan sobre qué validador es _menos_ o _más_ confiable. Esto incluso se mantiene en muchos casos en los que los servidores discrepan sobre si algunos validadores están por encima o por debajo de los umbrales de fiabilidad. Por lo tanto, es probable que la red llegue a un consenso sobre qué validador agregar o eliminar.
- No siempre da los mismos resultados en cada versión del ledger. Si un cambio propuesto a la UNL negativa no logra un consenso, la red no queda atrapada con algunos servidores intentando y fallando en agregar o eliminar ese validador cada vez. La red puede intentar agregar o eliminar un candidato diferente de la UNL negativa en un flag ledger posterior.


### Filtrado de validaciones

Durante [el paso de validación del proceso de consenso](consensus-structure.md#validation), se desactivan los validadores en la UNL negativa del ledger padre. Cada servidor calcula una "UNL efectiva" que consiste en su UNL configurada con los validadores desactivados eliminados, y recalcula su cuórum. (El cuórum siempre es al menos el 80% de la UNL efectiva y al menos el 60% de la UNL configurada). Si un validador desactivado envía votos de validación, los servidores siguen esos votos para fines de cálculo de la medida de fiabilidad del validador desactivado, pero no utilizan esos votos para determinar si una versión del ledger ha alcanzado un consenso.

**Nota:** La UNL negativa ajusta el número _total_ de validadores de confianza a partir del cual se calcula el cuórum, no el cuórum directamente. El cuórum es un porcentaje pero el número de votos es un número entero, por lo que reducir el total de validadores de confianza no siempre cambia el número de votos requeridos para alcanzar un cuórum. Por ejemplo, si hay 15 validadores en total, el 80% es exactamente 12 validadores. Si reduces el total a 14 validadores, el 80% es 11.2 validadores, lo que significa que aún se requieren 12 validadores para alcanzar un cuórum.

La UNL negativa no tiene impacto en otras partes del proceso de consenso, como la elección de qué transacciones incluir en el conjunto de transacciones propuestas. Esos pasos siempre se basan en la UNL configurada, y los umbrales se basan en cuántos validadores de confianza están participando activamente en la ronda de consenso. Incluso un validador que esté en la UNL negativa puede participar en el proceso de consenso.

### Ejemplo

El siguiente ejemplo demuestra cómo afecta la UNL negativa al proceso de consenso:

1. Supón que la UNL de tu servidor consta de 38 validadores de confianza, por lo que un cuórum del 80% es al menos 31 de 38 validadores.

[{% inline-svg file="/docs/img/negative-unl-01.svg" /%}](/docs/img/negative-unl-01.svg "Diagrama: Caso normal: UNL negativa sin utilizar, el cuorum es 80% de los validadores configurados.")

2. Imagina que 2 de esos validadores, llamados MissingA y UnsteadyB, parecen haberse desconectado. (Ambos tienen puntuaciones de fiabilidad < 50%.) Durante el proceso de consenso para el ledger _N_, muchos de los validadores restantes proponen agregar a UnsteadyB en la UNL negativa. La moción pasa mediante un cuórum de al menos 31 de los validadores restantes, y el ledger _N_ se valida con UnsteadyB programado para ser desactivado.

[{% inline-svg file="/docs/img/negative-unl-02.svg" /%}](/docs/img/negative-unl-02.svg "Diagrama: UnsteadyB está programado para desactivarse.")


3. Para ledgers desde _N+1_ hasta _N+256_, el proceso de consenso continua sin cambios.

4. En el siguiente flag ledger, ledger _N+256_, UnsteadyB se mueve automáticamente de "programado" a la lista "desconectados" en el ledger. Además, dado que MissingA está todavía offline, un consenso de validadores programa a MissingA para ser desactivado en el siguiente flag ledger.

[{% inline-svg file="/docs/img/negative-unl-04.svg" /%}](/docs/img/negative-unl-04.svg "Diagrama: UnsteadyB se desactiva y MissingA es programado para ser desactivado, también.")

5. Para los ledgers _N+257_ a _N+512_, el cuorum es ahora 30 de 37 validadores.

6. UnsteadyB vuelve a estar online en el ledger _N+270_. Envía votos de validación que están de acuerdo con el resto de la red de los ledgers _N+270_ a _N+511_, dándole una puntuación de confiabilidad de > 80%.

[{% inline-svg file="/docs/img/negative-unl-06.svg" /%}](/docs/img/negative-unl-06.svg "Diagrama: UnsteadyB vuelve a estar online, pero sigue desactivado.")

7. En el siguiente flag ledger, _N+256_, MissingA se mueve automáticamente a la lista de desactivados, como estaba programado. Mientras tanto, un consenso de validadores programa que UnsteadyB sea eliminado de la UNL negativa, debido a su mejora en la puntuación de confianza.

[{% inline-svg file="/docs/img/negative-unl-07.svg" /%}](/docs/img/negative-unl-07.svg "Diagrama: MissingA está desactivado y UnsteadyB está programado para ser reactivado.")

8. Para los ledgers _N+513_ a _N+768_, el cuorum es 29 de 36 validadores. UnsteadyB continua enviando validaciones de manera estable mientras que MissingA continua offline.

9. En el flag ledger _N+768_, UnsteadyB es automáticamente eliminado de la lista de desactivados, como estaba programado.

[{% inline-svg file="/docs/img/negative-unl-09.svg" /%}](/docs/img/negative-unl-09.svg "Diagrama: UnsteadyB es eliminado de la lista de desactivados.")

10. Eventualmente, tú decides que MissingA es probable que no vuelva, así que lo eliminas de tu UNL. Tu servidor empieza a proponer eliminando a MissingA de la UNL negativa en cada flag ledger posterior.

[{% inline-svg file="/docs/img/negative-unl-10.svg" /%}](/docs/img/negative-unl-10.svg "Diagrama: Después de eliminar a MissingA de tu UNL, se propone eliminarlo de la UNL negativa también.")

11. A medida que los operadores de validadores eliminar a MissingA de sus UNLs, sus validadores también votan para eliminar MissingA de la UNL negativa. Cuando suficientes validadores lo han hecho, la propuesta de eliminar a MissingA consigue un consenso, y MissingA está programado para ser eliminado de la UNL negativa.

[{% inline-svg file="/docs/img/negative-unl-11.svg" /%}](/docs/img/negative-unl-11.svg "Diagrama: MissingA es eliminado de la UNL negativa.")


## Ver también

- **Conceptos:**
    - [Protocolo de consenso](index.md)
- **Tutoriales:**
    - [Conecta tu `rippled` a la red paralela](../../infrastructure/configuration/connect-your-rippled-to-the-xrp-test-net.md)
    - [Ejecuta `rippled` como validador](../../infrastructure/configuration/server-modes/run-rippled-as-a-validator.md)
- **Referencias:**
    - [Objeto NegativeUNL](../../references/protocol/ledger-data/ledger-entry-types/negativeunl.md)
    - [Pseudo-transacción UNLModify][]
    - [método ledger_entry][]
    - [método consensus_info][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
