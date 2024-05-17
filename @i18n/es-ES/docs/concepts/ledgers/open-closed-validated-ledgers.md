---
html: open-closed-validated-ledgers.html
parent: ledgers.html
seo:
    description: Los objetos del ledger tienen uno de los tres estados — abierto, cerrado, o validado.
labels:
  - Blockchain
---
# Ledgers abiertos, cerrados, y validados

El servidor `rippled` hace una distinción entre versiones de ledgers que están _abiertas_, _cerradas_, y _validadas_. Un servidor tiene un ledger abierto, cualquier número de ledgers cerrados pero no validados, y un historial inmutable de ledgers validados. La siguiente tabla resume las diferencias:

| Tipo de ledger:                     | Abierto                        | Cerrado                                     | Validado |
|:---------------------------------|:----------------------------|:-------------------------------------------|:--|
| **Propósito:**                     | Espacio de trabajo temporal         | Próximo estado propuesto                        | Estado previo confirmado |
| **Número usado:**                 | 1                           | Cualquier número, normalmente 0 o 1             | Uno por ledger index, crece con el tiempo |
| **¿Pueden los contenidos cambiar?**         | Sí                         | No, pero el ledger completo se podría reemplazar | Nunca |
| **Transacciones se aplican en:** | El orden que son recibidas | Orden canónico                            | Orden canónino |

No intuitivamente, el XRP Ledger nunca "cierra" un ledger abierto para convertirlo en un ledger cerrado. En cambio, el servidor descarta el ledger abierto, crea un nuevo ledger cerrado aplicando transacciones encima de los ledgers cerrados previos, entonces crea un nuevo ledger abierto utilizando el último ledger cerrado como base. Esto es una consecuencia de [cómo el consenso resuelve el problema del doble gasto](../consensus-protocol/consensus-principles-and-rules.md#simplificando-el-problema).

Para un ledger abierto, los servidores aplican transacciones en el orden en el que esas transacciones aparecen, pero diferentes servidores puede que vean transacciones en diferentes órdenes. Como no hay un vigilante del tiempo para decidir qué transacción fue actualmente la primera, los servidores pueden no estar de acuerdo en el orden exacto de las transacciones que fueron enviadas casi al mismo tiempo. Por lo tanto, el proceso para calcular una versión de ledger cerrado que es elegible para [validación](../consensus-protocol/consensus-structure.md#validación) es diferente que el proceso de construir un ledger abierto con transacciones propuestas en su orden de llegada. Para crear un ledger "cerrado", cada servidor XRP Ledger comienza con un cojunto de transacciones y una versión anterior de ledger, o "padre". El servidores pone las transacciones en orden canónico, después las aplica al anterior ledger en ese orden. El orden canónico está diseñado para ser determinístico y eficiente, pero dificil de manipular, para incrementar la dificultad de adelantarse (o front-running) a las Ofertas en el [exchange descentralizado](../tokens/decentralized-exchange/index.md).

Por lo tanto, un ledger abierto es solo utilizado como un espacio de trabajo temporal, lo cual es una de las principales razones por las cuales  [los resultados tentativos pueden variar de los resultados finales](../transactions/finality-of-results/index.md) en las transacciones.
