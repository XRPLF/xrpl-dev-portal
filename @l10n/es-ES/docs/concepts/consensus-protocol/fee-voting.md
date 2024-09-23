---
html: fee-voting.html
parent: consensus.html
seo:
    description: Cómo los validadores votan las comisiones o fees (coste de transacción y requisitos de reserva).
labels:
  - Fees
  - XRP
---
# Votación de comisiones o fees

Los validadores pueden votar por cambiar los [costes de transacción](../transactions/transaction-cost.md) básicos como los [requisitos de reserva](../accounts/reserves.md). Si las preferencias en la configuración de un validador son diferentes a los ajustes actuales de la red, el validador expresa sus preferencias a la red periódicamente. Si un cuórum de validadores está de acuerdo en un cambio, pueden aplicar un cambio que se haga efectivo a partir de entonces. Los validadores pueden hacer esto por varias razones, especialmente para adaptarse a cambios en el valor de XRP a largo plazo.

Los operadores de [validadores `rippled`](../../infrastructure/configuration/server-modes/run-rippled-as-a-validator.md) pueden configurar sus preferencias para el coste de transacción y los requisitos de reserva en el apartado de `[voting]` del fichero `rippled.cfg`.

**Atención:** Los requisitos insuficientes, en caso de ser adoptados por un consenso de validadores confiables, podrían exponer a la red peer-to-peer XRP Ledger a ataques de denegación de servicio.

Los parámetros que puedes configurar son los siguientes:

| Parámetro | Descripción | Valor recomendado |
|-----------|-------------|-------------------|
| `reference_fee` | Cantidad de XRP, en _drops_ (1 XRP = 1 millón de drops.), que debe ser destruido para enviar la transacción de referencia, la transacción más barata posible. El coste de una transacción real es un múltiplo de ese valor, escalado dinámicamente basado en la carga de de los servidores individuales. | `10` (0.00001 XRP) |
| `account_reserve` | Cantidad mínima de XRP, en _drops_, que una cuenta debe tener en reserva. Esta es la cantidad más pequeña que se puede enviar para financiar una nueva cuenta en el ledger. | `10000000` (10 XRP) |
| `owner_reserve` | XRP de más, en _drops_, que se debe poseer en una dirección por _cada_ objeto que posees en el ledger. | `2000000` (2 XRP) |

## Proceso de votación

Cada 256º ledger  se denomina un "flag" ledger. (Un flag ledger se define de manera que el `ledger_index` [modulo](https://en.wikipedia.org/wiki/Modulo_operation) `256` es igual a `0`.) En el ledger inmediatamente antes del flag ledger, cada validador cuyas preferencias de reserva de cuenta o coste de transacción son diferentes a la configuración actual de la red distribuye un mensaje de "voto" junto con su validación del ledger, indicando los valores que prefiere ese validador.

En el propio flag ledger en sí, no ocurre nada, pero los validadores reciben y toman nota de los votos de los otros validadores en los que confían.

Después de contar los votos de otros validadores, cada validador intenta llegar a un acuerdo entre sus propias preferencias y las preferencias de la mayoría de validadores en los que confía. (Por ejemplo, si un validador quiere aumentar el coste de transacción mínima de 10 a 100, pero la mayoría de los validadores solo quiere aumentarla de 10 a 20, el validador decide aumentar el coste de transacción a 20. Sin embargo, el validador nunca estará de acuerdo en un valor menor a 10 o superior a 100.) Si es posible llegar a un compromiso, el validador inserta una [pseudo  transacción SetFee](../../references/protocol/transactions/pseudo-transaction-types/setfee.md) en su propuesta para el ledger siguiente al flag ledger. Otros validaodres que quieran el mismo cambio, insertan la misma pseudo-transacción SetFee en sus propuestas para el mismo ledger. (Los validadores cuyas preferencias coincidan con las existentes en la red no hacen nada.) Si una pseudo-transacción SetFee sobrevive al proceso de consenso para ser incluida en un ledger validado, entonces el nuevo coste de transacción y configuración de reservas indicados por la pseudo transacción SetFee toman efecto empezando por el siguiente ledger.

En resumen:

* **Flag ledger -1**: Los validadores emiten sus votos.
* **Flag ledger**: Los validadores cuentan sus votos y deciden qué SetFee incluir, si hay alguna.
* **Flag ledger +1**: Los validadores incluyen una pseudo-transacción SetFee pseudo-transaction en sus ledgers propuestos.
* **Flag ledger +2**: La nueva configuración toma efecto, si la pseudo-transacción alcanza consenso.

## Valores máximos de comisiones o fees

Los valores máximos posibles para las comisiones están limitadas por los tipos de datos internos almacenados en el [objeto de ledger FeeSettings](../../references/protocol/ledger-data/ledger-entry-types/feesettings.md). Los valores son los siguientes:

| Parámetro | Valor máximo (drops) | Valor máximo (XRP)
|-----------|-----------------------|----|
| `reference_fee` | 2<sup>64</sup> | (Más XRP del que nunca ha existido.) |
| `account_reserve` | 2<sup>32</sup> drops | Aproximadamente 4294 XRP |
| `owner_reserve` | 2<sup>32</sup> drops | Aproximadamente 4294 XRP |


## Ver también

- **Conceptos:**
    - [Enmiendas](../networks-and-servers/amendments.md)
    - [Coste de transacción](../transactions/transaction-cost.md)
    - [Reservas](../accounts/reserves.md)
    - [Cola de transacción](../transactions/transaction-queue.md)
- **Tutoriales:**
    - [Configurar `rippled`](../../infrastructure/configuration/index.md)
- **Referencias:**
    - [Método fee][]
    - [Método server_info][]
    - [Objeto FeeSettings](../../references/protocol/ledger-data/ledger-entry-types/feesettings.md)
    - [Pseudo-transacción SetFee][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
