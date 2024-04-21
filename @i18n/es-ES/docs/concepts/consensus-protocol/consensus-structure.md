---
html: consensus-structure.html
parent: consensus.html
seo:
    description: Entender el rol del consenso en el XRP Ledger.
labels:
  - Blockchain
---
# Estructura de consenso

Escrito por Dave Cohen, David Schwartz, y Arthur Britto._

Este artículo proporciona una visión a alto nivel del XRP Ledger, la información que almacena, y cómo las [transacciones](../../references/protocol/transactions/index.md) dan como resultado cambios en el ledger.

Al crear aplicaciones en el XRP Ledger, es importante entender el proceso, para no sorprenderse por el comportamiento de las APIs de XRP Ledger y sus efectos.


## Introducción

La red peer-to-peer XRP Ledger proporciona un libro de contabilidad (ledger) compartido a nivel mundial, que brinda información autorizada a aplicaciones sobre el estado de su contenido. Este estado de la información incluye:

- Configuración de cada [cuenta](../accounts/index.md)
- Balances de XRP y [tokens](../tokens/index.md)
- Ofertas en el exchange distribuido
- Configuraciones de red, como los [costes de transacción](../transactions/transaction-cost.md) y las cantidades de [reserva](../accounts/reserves.md)
- Una marca de tiempo (timestamp)

Para una descripción técnica completa de todos los datos que se incluyen en una versión de un ledger, ver la [Referencia de formato de ledger](../../references/protocol/ledger-data/index.md).

[{% inline-svg file="/docs/img/anatomy-of-a-ledger-complete.svg" /%}](/docs/img/anatomy-of-a-ledger-complete.svg "Figura 1: Elementos del XRP Ledger")

_Figura 1: Elementos del XRP Ledger_

El XRP Ledger tiene una nueva versión de un ledger cada ciertos segundos. Cuando la red acuerda el contenido de una nueva versión del ledger, la versión del ledger es _validado_, y sus contenidos no se pueden cambiar nunca. Las versiones validadadas de ledgers que precedieron forman el histórico del ledger. Incluso el ledger validado más reciente es parte del histórico, ya que representa el estado de la red hasta hace poco tiempo. En la actualidad, la red está evaluando transacciones que pueden aplicarse y finalizarse en la próxima versión del ledger. Mientras la evaluación está ocurriendo, la red tiene versiones de ledger que aun no están validadas.

[{% inline-svg file="/docs/img/ledger-history.svg" /%}](/docs/img/ledger-history.svg "Figura 2: Histórico del XRP Ledger")

_Figure 2: Histórico del XRP Ledger_

Una versión de ledger tiene dos identificadores. Un identificador es su _ledger index_ o índice del ledger. Las versiones de ledger son numeradas incrementalmente. Por ejemplo, si la versión del ledger actual tiene un ledger index de 100, el previo tiene un ledger index 99 y el siguiente ledger tendrá index 101. El otro identificador es un _ledger hash_, el cual es una huella digital de los contenidos del ledger.

A medida que los servidores proponen trnsacciones para aplicar en el ledger, pueden crear varias versiones del ledger con contenidos ligeramente diferentes. Estas versiones candidatas del ledger tienen el mismo ledger index pero diferentes ledger hashes. De los muchas candidatas, solo una puede ser validada. Todas las otras versiones ledger candidatas son descartadas. Por lo tanto, hay exactamente un ledger hash validado para cada ledger index en el histórico.

Los cambios a nivel de usuario son el resultado de transacciones. Ejemplos de [transacciones](../../references/protocol/transactions/index.md) incluyen pagos, cambios de la configuración de cuenta o trust lines, y ofertas para intercambiar. Cada transacción autoriza uno o más cambios en el ledger, y está firmada criptográficmente por el dueño de la cuenta. Las transacciones son la única manera para autorizar cambios de una cuenta, o para cambiar algo más en el ledger.

Cada versión del ledger también contiene un conjunto de transacciones y metadata sobre esas transacciones. Las transacciones que incluye son solo aquellas que han sido aplicadas para la anterior versión del ledger para crear la nueva versión del ledger. Los metadatos o metadata se registran a los mismos efectos en el estado del dato del ledger.

[{% inline-svg file="/docs/img/ledger-changes.svg" /%}](/docs/img/ledger-changes.svg "Figura 3: Transacciones aplicadas a la versión del ledger")

_Figure 3: Transacciones aplicadas a la versión del ledger_

El conjunto de transacciones incluidas en una instancia ledger se guardan en ese ledger y permite auditorías de la historia del XRP Ledger. Si un balance de cuenta es diferente en un ledger N+1 respecto al ledger N, entonces el ledger N+1 contiene las transacciones responsables del cambio.

Las transacciones que aparecen en un ledger validado pueden haber logrado cambiar el ledger, o pueden haberse procesado sin haber realizado la acción requerida. Las transacciones exitosas tienen el [código resultado](../../references/protocol/transactions/transaction-results/index.md) **`tesSUCCESS`**  el cual indica los cambios solicitados para aplicar en el ledger. Las transacciones fallidas en el ledger tienen el código de resultado de clase **`tec`**.<a href="#footnote_1" id="from_footnote_1"><sup>1</sup></a>

Todas las transacciones incluidas en un ledger destruyen algo de XRP como un [coste de transacción](../transactions/transaction-cost.md), sin importar si tenían un código **`tes`** o **`tec`**. La cantidad exacta de XRP destruido es definido por las instrucciones de transacción firmadas.

Hay otras clases de códigos de resultado además de **`tes`** y **`tec`**. Cualquier otras clases de códigos de resultados indican fallos provisionales devueltos por las llamadas API. Solo los códigos **`tes`** y **`tec`** aparecen en los ledgers. Las transacciones que no aparecen incluidas en ledger no pueden tener efecto en el estado del ledger (incluyendo balances XRP), pero transacciones que son provisionalmente fallidas pueden acabar sucediendo.

Cuando se trabaja con [APIs del XRP Ledger](../../references/http-websocket-apis/index.md), las aplicaciones deben distinguir entre transacciones candidatas propuestas para la inclusión en un ledger y transacciones validadas que están incluidas en un ledger. Solo los resultados de transacciones encontrados en un ledger validado son inmutables. Una transacción candidata puede eventualmente estar incluida en un leger validado, o puede que no.

Importante: Algunas [APIs `rippled`](../../references/http-websocket-apis/index.md) proporcionan resultados provisionales, basados en transacciones candidatas <a href="#footnote_2" id="from_footnote_2"><sup>2</sup></a>. Las aplicaciones nunca deben  basarse en resultados provisionales para determinar el resultado final de una transacción. La única forma de conocer si finalmente una transacción se ha realizado correctamente, es comprobar el estado de la transacción hasta que esté en un ledger validado y además tenga el código de resultado `tesSUCCESS`. Si la transacción está en un ledger validado con otro código de resultado, ha fallado. Si el ledger especificado en [`LastLedgerSequence`](../../references/protocol/transactions/common-fields.md) en una transacción ha sido validado, pero la transacción no aparece en ese ledger o en alguno anterior, entonces esa transacción ha fallado y nunca aparecerá en ningún ledger. Un resultado es definitivo solo para transacciones en un ledger validado o nunca podrán aparecer por las restricciones de `LastLedgerSequence` explicadas más adelante en este documento.

## El protocolo XRP Ledger – Consenso y validación

La red peer-to-peer XRP Ledger consiste en muchos servidores independientes XRP Ledger (normalmente ejecutando [`rippled`](../networks-and-servers/index.md)) que aceptan y procesan transacciones. Las aplicaciones cliente firman y envían transacciones a servidores XRP Ledger, que transmiten estas transacciones candidatas a través de la red de procesamiento. Ejemplos de aplicaciones cliente incluyen carteras web y móvil, conexiones con instituciones financieras, y plataformas de trading electrónicas.

[{% inline-svg file="/docs/img/xrp-ledger-network.svg" /%}](/docs/img/xrp-ledger-network.svg "Figura 4: Participantes en el Protocolo XRP Ledger")

_Figura 4: Participantes en el Protocolo XRP Ledger_

Los servidores que reciben, transmiten y procesan transacciones pueden ser servidores de seguimiento o validadores. Las funciones principales de los servidores de seguimiento incluyen distribución de transacciones de clientes y responder a consultas sobre el ledger. Los servidores de validación realizan las mismas funciones que los servidores de seguimiento y también contribuyen a avanzar en el histórico del ledger. <a href="#footnote_3" id="from_footnote_3"><sup>3</sup></a>.

Cuando se aceptan transacciones enviadas por aplicaciones de cliente, cada servidor de seguimiento utiliza el último ledger validado como punto de inicio. Las transacciones aceptadas son candidatas. Los servidores envían sus transacciones candidatas a sus pares, permitiendo a las transacciones candidatas propagarse a través de la red. Idealmente, cada transacción candidata debería ser conocida por todos los servidores, permitiendo a cada uno considerar el mismo conjunto de transacciones a aplicar al último ledger validado. Sin embargo, como las transacciones tardan tiempo en propagarse, los servidores no trabajan con el mismo conjunto de transacciones candidatas todas las veces. Para tener en cuenta esto, el XRP Ledger utiliza un proceso llamado consenso para asegurar que las mismas transacciones son procesadas y los ledger validados son consistentes a través de la red peer-to-peer XRP Ledger.

### Consenso

Los servidores de la red comparten información sobre transacciones candidatas. A través del proceso de consenso, los validadores agregan en un subconjunto de transacciones candidatas para ser consideradas en el siguiente ledger. El consenso es un proceso iterativo en el cual los servidores transmiten propuestas, o conjuntos de transacciones candidatas. Los servidores comunican y actualizan las propuestas hasta que haya supermayoría <a href="#footnote_4" id="from_footnote_4"><sup>4</sup></a> de los validadores elegidos que acuerdan el mismo conjuntos de transacciones candidatas.

Durante el consenso, cada servidor evalúa propuestas de un específico grupo de servidores, conocidos como validadores confiables por ese servidor, o _Unique Node List (UNL)_.<a href="#footnote_5" id="from_footnote_5"><sup>5</sup></a> Los validadores confiables representan un subconjunto de la red la cual, en conjunto, es "confiable" para no confabular en un intento de defraudar al servidor que evalúa las propuestas. Esta definición de "confianza" no requiere que se confie en cada validador individual elegido. Más bien, los validadores son elegidos en base a la expectativa de que no confabularán en un esfuerzo coordinado para falsificar los datos transmitidos en la red <a href="#footnote_6" id="from_footnote_6"><sup>6</sup></a>. <!-- STYLE_OVERRIDE: will -->

[{% inline-svg file="/docs/img/consensus-rounds.svg" /%}](/docs/img/consensus-rounds.svg "Figura 5: Los validadores proponen y revisar conjuntos de transacciones")

_Figura 5: Validadores proponen y revisan conjuntos de transacciones — Al comienzo del consenso, los validadores pueden tener un conjunto distinto de transacciones. En siguientes rondas, los servidores modificarán sus propuestas para coincidir con las propuestas de sus validadores confiables. Este proceso determina qué transacciones deberían aplicar a la versión del ledger que se está actualmente debatiendo, y cuales deberían posponerse para próximas versiones del ledger._

Las transacciones candidatas que no están incluidas en la propuesta acordada siguen siendo transacciones candidatas. Pueden ser consideradas otra vez en la nueva versión del ledger. Normalmente, una transacción que ha sido omitida en una versión del ledger se incluye en la siguiente versión del ledger.

En algunas circunstancias, una transacción puede fallar para conseguir alcanzar consenso indefinidamente. Una de esas circunstancias es si la red incrementa el [coste de transacción](../transactions/transaction-cost.md) requerido a un valor superior al que proporciona la transacción. La transacción podría ser exitosa si las comisiones se reducen en algún momento futuro. Para asegurar que una transacción tenga éxito o falle dentro de una limitada cantidad de tiempo, las transacciones se pueden preparar para caducar si no son procesadas por un determinado ledger index. Para más información, ver [Envío de transacciones confiables](../transactions/reliable-transaction-submission.md).

### Validación

La validación es la segunda etapa del proceso de consenso general, que verifica que los servidores tienen los mismos resultados y declara la versión final del ledger. En raras ocasiones, la primera etapa del [consenso puede fallar](consensus-principles-and-rules.md#consensus-can-fail); la validación proporciona una confirmación posterior para que los servidores puedan reconocer esto y actuar en consecuencia.

La validación puede dividirse en aproximadamente dos partes:

- Calcular la versión de ledger resultante del conjunto de transacciones acordado.
- Comparar resultados y declarar validada la versión del ledger si suficientes validadores confiables están de acuerdo.

Cada servidor en la red realiza una validación separada y local.


#### Calcular y compartir validaciones

Cuando el proceso de consenso se completa, cada servidor independientemente computa un nuevo ledger a partir del conjunto de transacciones acordado. Cada servidor calcula los resultados siguiendo las mismas reglas, las cuales pueden ser resumidas de la siguiente manera:

1. Empezar con el ledger validado anterior.

2. Colocar el conjunto de transacciones acordado en _orden canónico_ para que cada servidor la procese de la misma forma.

    [Orden canónico](https://github.com/XRPLF/rippled/blob/8429dd67e60ba360da591bfa905b58a35638fda1/src/ripple/app/misc/CanonicalTXSet.cpp#L25-L36) no es el orden de cómo las transacciones fueron recibidas, porque los servidores pueden recibir las mismas transacciones en diferente orden. Para prevenir a los participantes de competir sobre el orden de las trnasacciones, el orden canónico es difícil de manipular.

3. Procesar cada transacción según sus instrucciones, en orden. Actualizar el estado del dato del ledger en consecuencia.

    Si la transacción no puede ser ejecutada exitósamente, incluye la transacción con un [código de resultado de clase `tec`](../../references/protocol/transactions/transaction-results/tec-codes.md).<a href="#footnote_1" id="from_footnote_1"><sup>1</sup></a>

    Para ciertos fallos de transacciones "recuperables", se mueve la transacción al final del orden canónico para volver a intentarla después de que se hayan ejecutado otras transacciones del mismo ledger.

4. Actualizar la cabecera del ledger con el apropiado metadata.

    Esto incluye datos tales como el ledger index o índice del ledger, el hash identificativo del ledger previo validado (el "padre" de este), la hora de cierre aproximada de esta versión del ledger, y los hashes criptográficos de los contenidos de este ledger.

5. Calcular el hash identificativo de la nueva versión del ledger.

[{% inline-svg file="/docs/img/consensus-calculate-validation.svg" /%}](/docs/img/consensus-calculate-validation.svg "Figura 7: Un servidor XRP Ledger calcula la validación de un ledger")

_Figura 7: Un servidor XRP Ledger calcula la validación de un ledger — Cada servidor aplica transacciones acordadas por el anterior ledger validado. Los validadores envían sus resultados a toda la red._

#### Comparar resultados

Cada validador transmite sus resultados en forma de un mensaje firmado que contiene el hash de la versión de ledger calculada. Estos mensajes, llamados _validaciones_, permiten a cada servidor comparar el ledger que calculó con el de sus pares.

[{% inline-svg file="/docs/img/consensus-declare-validation.svg" /%}](/docs/img/consensus-declare-validation.svg "Figura 8: El ledger es validado cuando la supermayoría de pares calcula el mismo resultado")

_Figura 8: El ledger es validado cuando la supermayoría de pares calcula el mismo resultado - Cada servidor compara su su ledger calculado con los hashes recibidos de sus validadores elegidos. Si no hay acuerdo, el servidor debe recaluclar o recuperar el ledger correcto._

Los servidores de la red reconocen una instancia ledger como validada cuando una supermayoría de pares han firmado y difundido el mismo hash de validación <a href="#footnote_7" id="from_footnote_7"><sup>7</sup></a>. Más adelante, las transacciones son aplicadas a este ahora ledger validado y actualizado con el ledger index N+1.

En casos donde el servidor se encuentra en una minoría, habiendo generado un ledger que difiere de sus pares, el servidor ignora el ledger que ha generado <a href="#footnote_8" id="from_footnote_8"><sup>8</sup></a>. Regenera el ledger correcto, o recupera el ledger correcto según sea necesario.

Si la red no logra un acuerdo de supermayoría sobre las validaciones, esto implica que el volumen de transacciones era muy alto o la latencia de la red es demasiado grande para que el proceso de consenso para producir propuestas consistentes. En este caso, los servidores repiten el proceso de consenso con una nueva versión del ledger. A medida que pasa el tiempo desde el consenso comenzó, es cada vez más probable que la mayoría de los servidores haya recibido el mismo conjunto de transacciones candidatas, ya que cada ronda de consenso reduce el desacuerdo. El XRP Ledger ajusta dinámicamente los [costes de transacciones](../transactions/transaction-cost.md) y el tiempo de espera para el consenso en respuesta a estas condiciones.

Una vez que alcanzan supermayoría en el acuerdo de las validaciones, los servidores trabajan con el nuevo ledger validado, ledger index N+1. El consenso y el proceso de validación se repite <a href="#footnote_9" id="from_footnote_9"><sup>9</sup></a>, considerando transacciones candidatas que no fueron incluidas en la última ronda junto con nuevas transacciones presentadas mientras tanto.


## Conclusiones claves

Las transacciones enviadas al XRP Ledger no son procesadas inmediatamente. Durante un periodo de tiempo, cada transacciones permanece como candidata.

El ciclo de vida de una sola transacción es el siguiente:

- Una transacción es creada y firmada por un dueño de una cuenta.
- La transacción es enviada a la red.
    - Transacciones mal formadas podrán ser rechazadas inmediatamente.
    - Transacciones bien formadas pueden ser provisionalmente exitosas, y luego fallar.
    - Transacciones bien formadas pueden provisionalmente fallar, y luego fallar.
- Durante el consenso, la transacción es incluida en el ledger.
    - El resultado de un consenso exitoso es un ledger validado.
    - Si una ronda de consenso falla, el proceso de consenso se repita hasta que es exitoso.
- El ledger validado incluye la transacción y esta afecta al estado del ledger.

Las aplicaciones deben solo confiar en información de ledgers validados, no en resultados provisionales de transacciones candidatas. Algunas [APIs de `rippled`](../../references/http-websocket-apis/index.md) devuelven inicialmente unos resultados provisionales para las transacciones. Los resultados de una transacción se convierten en inmutables solo si la transacción es incluida en un ledger validado, o la transacción incluye `LastLedgerSequence` y no aparece en ningún ledger validado con ese ledger index o menor.

Buenas prácticas para aplicaciones enviando transsacciones incluyen:

- Utilizar el parámetro `LastLedgerSequence` para asegurar que las transacciones se validen o fallen de forma determinista y rápida.
- Comprobar los resultados de transacciones en ledgers validados.
    - Hasta que el ledger que contiene la transacción es validado, o haya pasado `LastLedgerSequence`, los resultados son provisionales.
    - Transacciones con el código resultado **`tesSUCCESS`** y `"validated": true` se han realizado correctamente de forma inmutable.
    - Transacciones con otro código resultado y `"validated": true` han fallado de forma inmutable.
    - Transacciones que no aparecen en ningún ledger validado, incluido el ledger validado identificado por el `LastLedgerSequence` de la transacción ha fallado de forma inmutable.
        - Tener cuidado de usar un servidor con un histórico de ledger continuo para detectar este caso <a href="#footnote_10" id="from_footnote_10"><sup>10</sup></a>.
    - Puede ser necesario comprobar el estado de una transacción repetidamente hasta que el identificado por `LastLedgerSequence` es validado.

## Ver también

- **Conceptos:**
    - [Investigación del consenso](consensus-research.md)
    - [El mecanismo del consenso (YouTube)](https://www.youtube.com/watch?v=k6VqEkqRTmk&list=PLJQ55Tj1hIVZtJ_JdTvSum2qMTsedWkNi&index=2)
- **Tutoriales:**
    - [Envío de transacciones de forma correcta](../transactions/reliable-transaction-submission.md)
    - [Ejecutar `rippled` como un validator](../../infrastructure/configuration/server-modes/run-rippled-as-a-validator.md)
- **Referencias:**
    - [Referencia del fromato del ledger](../../references/protocol/ledger-data/index.md)
    - [Referencia del formato de la transacción](../../references/protocol/transactions/index.md)
    - [método consensus_info][]
    - [método validator_list_sites][]
    - [método validators][]





## Pies de notas

<a href="#from_footnote_1" id="footnote_1"><sup>1</sup></a> – Transacciones con [códigos de resultado **tec**](../../references/protocol/transactions/transaction-results/tec-codes.md) no proporcionan la acción solicitada, pero tienen efecto en el ledger. Para prevenir el abuso de la red y pagar por el coste de distribución de la transacción, destruyen el XRP del [coste de la transacción](../transactions/transaction-cost.md). Para no bloquear otras transacciones enviadas por el mismo remitente al mismo tiempo, se incrementa el [sequence number](../../references/protocol/data-types/basic-data-types.md#account-sequence) de la cuenta emisora. Transacciones con el tipo resultado `tec` a veces también realizan mantenimiento como borrar objetos caducados u ofertas de mercado sin fondos.

<a href="#from_footnote_2" id="footnote_2"><sup>2</sup></a> – Por ejemplo, consideramos un escenario donde Alice tiene 100$, y envía todo a Bob. Si una aplicación primero envía esa transacción de pago, entonces inmediatamente tras comprobar el balance de Alice, la API devuelve 0$. Este valor está basado en el resultado provisional de una transacción candidata. Hay circunstancias en las cuales el pago falla y el balance de Alice se mantiene a 100$ (o, debido a otras transacciones, se convierte en otra cantidad). El único método para conocer con certeza que el pago de Alice a Bob ha ocurrido es comprobar el estado de la tranacción hasta que está en el ledger validado y además el código de resultado es **`tesSUCCESS`**. Si la transacción está en un ledger validado con cualquier otro código resultado, el pago ha fallado.

<a href="#from_footnote_3" id="footnote_3"><sup>3</sup></a> – Hablando estríctamente, los validadores son un subconjunto de servidores de seguimiento. Proporcionan las mismas características y adicionalmente envían mensajes de "validación". Los servidores de seguimiento pueden clasificarse según si mantienen el histórico del ledger parcial o completo.

<a href="#from_footnote_4" id="footnote_4"><sup>4</sup></a> – Transacciones que fallan en pasar la ronda de consenso cuando el porcentaje de pares que reconoce la transacción cae por debajo del umbral. Cada ronda es un proceso iterativo. Al principio de la primera ronda, al menos el 50% de pares deben estar de acuerdo. El umbral final para la ronda de consenso es un 80% de acuerdo. Estos valores específicos estan sujetos a cambio.

<a href="#from_footnote_5" id="footnote_5"><sup>5</sup></a> – Cada servidor define su propios validadores confiables, pero la consistencia de la red depende en diferentes servidores eligiendo listas que tienen un mayor grado de superposición. Por esta razón, Ripple publica una lista de validadores recomendados.

<a href="#from_footnote_6" id="footnote_6"><sup>6</sup></a> – Si las propuestas de  todos los validadores fueron evaluadas, en lugar de exclusivamente por los validadores elegidos para no confabular, un atacante malicioso podría ejecutar más validadores para ganar poder desproporcionado sobre el proceso de validación, así podrían introducir transacciones inválidas u omitir transacciones válidas de las propuestas. La lista de validadores elegida [defiende de ataques Sybil](consensus-protections.md#ataques-sybil).

<a href="#from_footnote_7" id="footnote_7"><sup>7</sup></a> – El umbral de supermayoría, a partir de noviembre del 2014, requiere que al menos el 80% de pares deben estar de acuerdo en un ledger para ser validado. Est el mismo porcentaje necesario para una ronda de consenso. Ambos umbrales están sujetos a cambio y no necesitan ser iguales.

<a href="#from_footnote_8" id="footnote_8"><sup>8</sup></a> – En la práctica, el servidor detecta que está en una minoría antes de recibir las validaciones de todos los pares. Lo sabe cuando recibe validaciones no coincidentes de más del 20% de pares que su validación no puede alcanzar el 80% del umbral. En ese momento, puede empezar a recalcular su ledger.

<a href="#from_footnote_9" id="footnote_9"><sup>9</sup></a> – En la práctica, el XRP Ledger corre más eficientemente empezando una nueva ronda de consenso al mismo timepo, antes de que la validación se haya completado.

<a href="#from_footnote_10" id="footnote_10"><sup>10</sup></a> – Un servidor `rippled` puede responder a las peticiones API incluso sin tener un histórico del ledger completo. Interrupciones en el servicio o en la conectividad de la red puede llevar a ledgers perdidos, o a lagunas, en el histórico del ledger del servidor. Con el tiempo, si se configura así, `rippled` llena los vacíos en su histórico. Cuando prueba transacciones perdidas, es importante verificar contra un servidor con ledgers completos continuos desde que la transacción que se ha enviado hasta su `LastLedgerSequence`. Utiliza el [método server_info][] para determinar qué ledgers están disponibles para un servidor en partícular.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
