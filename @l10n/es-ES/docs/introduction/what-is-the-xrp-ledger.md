---
html: what-is-the-xrp-ledger.html
parent: introduction.html
seo:
    description: Aprende sobre la blockchain XRP Ledger (XRPL).
labels:
  - Blockchain
---
# ¿Qué es el XRP Ledger?

El XRP Ledger es una blockchain descentralizada que usa su propia moneda digital para procesar y registrar transacciones financieras.


## ¿Qué es una blockchain?

Una blockchain es una lista de registros en continuo creciemiento. La blockchain comienza con un bloque de datos.

![Un bloque de datos](/docs/img/introduction2-data-block.png)

Un grupo de nodos validadores confiables llega a un consenso de que los datos son válidos.

![Nodos validadores](/docs/img/introduction3-validators.png)

El bloque se identifica de forma única con un número hash criptográfico, muy elaborado, complejo, generado por un ordenador, que tiene 64 caracteres hexadecimales.

![Hash criptográfico](/docs/img/introduction4-hash.png)

El bloque también se identifica con una marca de tiempo (timestamp) con su hora de creación.

![Timestamp](/docs/img/introduction5-time-stamp.png)

Cada nodo validador obtiene su propia copia del bloque de datos. No existe una única autoridad central. Todas las copias son igualmente válidas.

![Validadores con copias válidas](/docs/img/introduction6-valid-copies.png)

Cada bloque contiene un puntero hash como enlace al bloque anterior. También tiene una marca de tiempo (timestamp), nuevos datos, y su propio número hash único.

![Puntero hash](/docs/img/introduction7-two-blocks.png)

Utilizando esta estructura, cada bloque tiene una posición clara en la cadena, enlazandose al bloque de datos anterior. Esto crea una cadena de bloques inmutable. Siempre puedes verificar toda la información actual en la cadena rastreando los bloques anteriores.

![Tres bloques de datos](/docs/img/introduction8-3-blocks.png)

Por diseño, las blockchains son resistentes a la modificación de datos. Cada nodo del libro contable (ledger) obtiene una copia exacta de la blockchain.

![Dos validadores con copias idénticas de la blockchain](/docs/img/introduction9-2-sets-of-3.png)

Esto crea un libro contable (ledger) abierto y distribuido que registra las transacciones entre partes de manera eficiente, verificable y permanente. 

Una vez registrados, los datos de cualquier bloque no se pueden modificar retroactivamente, a no ser que la mayoría de validadores se pongan de acuerdo en el cambio. Si es así, todo los bloques posteriores se modifican de la misma manera (un hecho muy raro y extremo).

### ¿Cómo funciona el proceso de consenso federado?

La mayoría de los servidores rippled en XRPL monitorean o proponen transacciones. Un importante subconjunto de servidores se ejecutan como validadores. Estos servidores confiables acumulan listas de nuevas transacciones en una nueva posible instancia del libro contable (ledger) (un nuevo bloque en la blokchain).

![Recopilación de transacciones](/docs/img/introduction17-gather-txns.png)

Los validadores comparten sus listas con el resto de validadores. Los validadores incorporan los cambios propuetos entre sí y distribuyen una nueva versión de la propuesta del libro contable (ledger).

![80% de consenso](/docs/img/introduction18-80-percent-consensus.png)

Cuando el 80% de los validadores acuerdan un conjunto de transacciones, crean una nueva instancia del libro contable (ledger) al final de la cadena y empiezan el proceso otra vez. Este proceso de consenso tarda entre 4 y 6 segundos. Puedes monitorizar cómo se crean las instancias del libro contable (ledger) en tiempo real visitando [https://livenet.xrpl.org/](https://livenet.xrpl.org/).

### ¿Qué redes están disponibles?

El XRPL está abierto a cualquiera que quiera configurar su propia instancia de servidor rippled y conectarse. El nodo puede monitorizar la red, realizar transacciones, o convertirse en validador. La red XRPL activa se denomina normalmente como _Mainnet_.

Para los desarrolladores o nuevos usuarios que quieran probar las características de XRPL sin invertir sus propios fondos, existen dos entornos para desarrolladores, _Testnet_ y _Devnet_. Los usuarios pueden crear una cuenta con 1.000 XRP (falsos) y conectarse a cualquiera de los entornos para interactuar con el XRPL.

Siguiente: [¿Qué es XRP?](what-is-xrp.md)
