---
html: ledger-structure.html
parent: ledgers.html
seo:
    description: Un vistazo más cercano a los elementos de un bloque de ledger individual.
---
# La estructura del ledger

El XRP Ledger es una blockchain, lo que quiere decir que consiste en un histórico de bloques de datos consecutivos. Un bloque en la blockchain XRP Ledger se denomina una _versión del ledger_ o _ledger_ abreviado.

El protocolo de consenso toma la última versión del ledger como punto de partida, forma un acuerdo entre los validadores sobre un conjunto de transacciones para aplicar a continuación, después confirma que todo el mundo obtuvo los mismos resultados aplicando esas transacciones. Cuando esto ocurre satisfactoriamente, el resultado es una nueva versión de un ledger _validado_. Desde aquí, el proceso se repite para construir la próxima versión del ledger.

Cada versión del ledger contiene _datos de estado_, un _conjunto de transacciones_, y una _cabecera_ que contiene metadatos.

[{% inline-svg file="/docs/img/ledger.svg" /%}](/docs/img/ledger.svg "Diagrama: Un ledger está formado por una cabecera, un conjunto de transacciones, y datos de estado.")


## Estado de datos

[{% inline-svg file="/docs/img/ledger-state-data.svg" /%}](/docs/img/ledger-state-data.svg "Diagrama: Los datos de estado de un ledger, en forma de varios objetos los cuales a veces están unidos como en un grafo.")

Los _datos de estado_ representan una fotografía de todas las cuentas, balances, configuraciones, y otra información de esta versión del ledger. Cuando un servidor se conecta a la red, una de las primeras cosas que hace es descargar un conjunto completo de los datos de estado actuales para poder procesar nuevas transacciones y responder consultas sobre el estado actual. Como cada servidor de la red tiene una copia completa de los datos del estado, todos los datos son públicos y cada copia es igualmente válida.

Los datos de estado consisten en objetos individuales llamados _entradas de ledger_, almacenados en un formato de árbol. Cada entrada del ledger tiene un ID único 256-bit que puedes usar para buscar en el árbol de estado.

## Conjunto de transacciones

[{% inline-svg file="/docs/img/ledger-transaction-set.svg" /%}](/docs/img/ledger-transaction-set.svg "Diagrama: Un conjunto de transacciones del ledger, un grupo de transacciones organizado en orden canónico.")

Cada cambio realizado en el ledger es el resultado de una transacción. Cada versión del ledger contiene un _conjunto de transacciones_ que es un grupo de transacciones que se han aplicado recientemente en un orden específico. Si tomas los datos de estado de la versión anterior del ledger y aplicas este conjunto de transacciones del ledger encima de él, obtienes los datos de estado de este ledger como resultado.

Cada transacción en el conjunto del ledger tiene ambas de la siguientes partes:

- _Instrucciones de la transaccion_ mostrando lo que el remitente le pidió hacer.
- _Metadatos de la transacción_ mostrando exáctamente cómo la transacción debe ser procesada y cómo afecta a los datos de estado del ledger.


## Cabecera del ledger

La _cabecera del ledger_ es un bloque de datos que resume la versión del ledger. Como la portada de un informe, identifica de forma única la versión del ledger, enumera sus contenidos, y muestra la hora en la que se creó, junto con algunas otras notas. La cabecera del ledger contiene la siguiente información:

<!-- Note: the alt text for the diagrams is intentionally empty because any caption would be redundant with the text. -->

- [{% inline-svg file="/docs/img/ledger-index-icon.svg" /%}](/docs/img/ledger-index-icon.svg "") El _ledger index_, o índice del ledger identifica la posición del ledger en la cadena. Se construye en el ledger con un índice             restando uno, hasta llegar hasta el punto de inicio llamado como el _genesis ledger_. Esto forma un histórico público con todas las trnasacciones y resultados.
- [{% inline-svg file="/docs/img/ledger-hash-icon.svg" /%}](/docs/img/ledger-hash-icon.svg "") El _ledger hash_, que identifica de manera única los contenidos del ledger. El hash es calculado de manera que si cambia algún detalle, la versión del ledger cambia, el hash es completamente diferente, lo que lo convierte también en un checksum que muestra que ninguno de los datos en el ledger se ha perdido, modificado, o corrompido.
- [{% inline-svg file="/docs/img/ledger-parent-icon.svg" /%}](/docs/img/ledger-parent-icon.svg "") El _parent ledger hash_ o el hash del ledger padre. Una versión del ledger es definida en gran parte por la diferencia con el _parent ledger_ que viene antes de el, por lo que la cabecera también contiene el hash único para su ledger padre.
- [{% inline-svg file="/docs/img/ledger-timestamp-icon.svg" /%}](/docs/img/ledger-timestamp-icon.svg "") El _close time_ u hora de cierre, la timestamp que marca cuando se finalizaron los contenidos del ledger. Este número se redondea por un número de segundos, generalmente 10.
- [{% inline-svg file="/docs/img/ledger-state-data-hash-icon.svg" /%}](/docs/img/ledger-state-data-hash-icon.svg "") Un _hash de datos del estado_ el cual actua de checksum para los datos del estado.
- [{% inline-svg file="/docs/img/ledger-tx-set-hash-icon.svg" /%}](/docs/img/ledger-tx-set-hash-icon.svg "") Un _hash del conjunto de transacciones_ el cual actua como checksum de los datos del conjuntos de transacciones.
- [{% inline-svg file="/docs/img/ledger-notes-icon.svg" /%}](/docs/img/ledger-notes-icon.svg "") Algunas otras notas como la cantidad total de XRP en existencia y la cantidad que se redondeó la hora de cierre.

Un conjunto de transacciones y los datos de estado son ilimitados en espacio, pero la cabecera del ledger siempre es de un tamaño fijo. Para los datos exactos y el formato binario de una cabecera del ledger, ver [Cabecera del leder](../../references/protocol/ledger-data/ledger-header.md).


## Estado de validación

[{% inline-svg file="/docs/img/ledger-validated-mark.svg" /%}](/docs/img/ledger-validated-mark.svg "Diagrama: Un estado de validación de un ledger, el cual es añadido encima del ledger y no es parte del ledger en sí.")

Cuando un consenso de la Lista de Nodos Únicos de un servidor está de acuerdo en los contenidos de una versión del ledger, esa versión del ledger es marcada como validada e inmutable. Los contenidos del ledger solo pueden cambiar mediante transacciones posteriores que creen una nueva versión del ledger, continuando la cadena.

Cuando una versión del ledger es creada por primera vez, no está todavía validada. Debido a las diferencias en cuanto llegan las transacciones a diferentes servidores, la red puede construir y proponer múltiples versiones diferentes del ledger para ser el siguiente en la cadena. El [protocolo de consenso](../consensus-protocol/index.md) decide cual de ellas se valida. (Las transacciones candidatas que no estén en la versión del ledger validado pueden generalmente incluirse en el conjunto de transacciones la siguiente versión del ledger en su lugar.)


## ¿Índice del ledger o Hash del ledger?

Hay dos formas diferentes de identificar la versión del ledger: Su _ledger index_ o índice del ledger y su _ledger hash_ o hash del ledger. Estos dos campos identifican un ledger, pero tienen propósitos distintos. El índice del ledger te informa de la posición del ledger en la cadena, y el hash del ledger refleja los contenidos del ledger.

Ledgers de diferentes cadenas pueden tener el mismo índice ledger pero distintos hashes. Además, al tratar con versiones del ledger no validadas, puede haber múltiples ledgers candidatos con el mismo índice pero contenidos diferentes y, por lo tanto, hashes diferentes.

Dos ledgers con el mismo hash ledger son siempre completamente idénticos.
