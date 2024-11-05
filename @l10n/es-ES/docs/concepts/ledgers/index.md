---
html: ledgers.html
parent: concepts.html
seo:
    description: Los libros contables o ledgers son la estructura de datos que contiene datos en la red compartida de XRP Ledger. Una cadena de ledgers registra el historial de transacciones y cambios de estado.
labels:
  - Blockchain
  - Retención de datos
---
# Ledgers

El XRP Ledger es un libro contable global compartido que está abierto para todos. Participantes individuales pueden confiar en la la integridad del ledger sin tener que confiar en una única institución para manejarlo. El protocolo XRP Ledger logra esto mediante la gestión de la base de datos de contabilidad que solo puede ser actualizada de acuerdo a unas reglas específicas. Cada servidor en la reed peer-to-peer guarda una copia completa de la base de datos del ledger o libro contable, y la red distribuye transacciones candidatas, las cuales se incluyen en bloques de acuerdo al [proceso de consenso](../consensus-protocol/index.md).

[{% inline-svg file="/docs/img/ledger-changes.svg" /%}](/docs/img/ledger-changes.svg "Diagrama: Cada ledger es el resultado de aplicar transacciones a la anterior versión del ledger.")

El ledger global compartido consiste en una serie de bloques, llamadas versiones del ledger o simplemente _ledgers_. Cada versión del ledger tiene un índice o [Ledger Index][] el cual identifica el orden correcto de los ledgers. Cada ledger cerrado es permanente y también tiene un único valor hash que lo identifica.

En cualquier momento, cada servidor XRP Ledger tiene un ledger _abierto_ en progreso, un número de ledgers _cerrados_ pendientes, y un histórico de ledgers _validados_ que son inmutables.

Una versión del ledger consta de varias partes:

[{% inline-svg file="/docs/img/anatomy-of-a-ledger-simplified.svg" /%}](/docs/img/anatomy-of-a-ledger-simplified.svg "Diagrama: Un ledger tiene transacciones, un arbol de estado, y una cabecera con la hora de cierre y la información de validación")

* Una **cabecera** - El índice del ledger o [Ledger Index][], hashes de sus otros contenidos, y otros metadatos.
* Un **arbol de transacciones** - Las [transacciones](../../references/protocol/transactions/index.md) que se aplicaron al ledger anterior para hacer este.
* Un **arbol de estado** - Todos los datos en el ledger, como [entradas del ledger](../../references/protocol/ledger-data/ledger-entry-types/index.md): balances, configuraciones, y demás.



## Ver también

- Para más información sobre las cabeceras de ledger, IDs de objetos del ledger, y tipos de objetos del ledger, ver [Formatos de datos del ledger](../../references/protocol/ledger-data/index.md)
- Para información de cómo los servidores rastrean el historial de cambios del estado del ledger, ver [Historia del ledger](../networks-and-servers/ledger-history.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
