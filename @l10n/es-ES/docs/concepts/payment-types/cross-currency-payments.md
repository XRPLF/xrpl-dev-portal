---
html: cross-currency-payments.html
parent: payment-types.html
seo:
    description: Los pagos entre divisas entregan atómicamente una moneda diferente a la que envían mediante la conversión a través de rutas y libros de pedidos.
labels:
  - Entre divisas
  - Pagos
---
# Pagos entre divisas

El XRP Ledger te permite realizar pagos entre divisas de XRP y tokens. Los pagos entre divisas dentro del XRP Ledger son complétamente atómicos, lo que quiere decir que el pago se ejecuta por completo o no se ejecuta en absoluto.

Por defecto, los pagos entre divisas entregan una cantidad fija a su destino a un coste variable para su origen. Los pagos entre divisas también pueden ser [pagos parciales](partial-payments.md) que entregan una cantidad variable dentro de un límite de envío establecido.


## Prerrequisitos

- Por definición, un pago entre divisas implica al menos dos monedas, lo que significa que al menos una fivisa involucrada debe ser un [token](../tokens/index.md) que no sea XRP.
- Debe existir al menos una ruta o [Path](../tokens/fungible-tokens/paths.md) entre el remitente y el receptor, y la liquidez total a lo largo de todas las rutas debe ser suficiente para ejecutar el pago. Los pagos entre divisas se convierten de una divisa a otra consumiendo ofertas u [Offers](../tokens/decentralized-exchange/offers.md) en el [exchange descentralizado](../tokens/decentralized-exchange/index.md) del XRP Ledger.


## Auto-puente

Los pagos entre divisas que intercambian un token por otro token pueden utilizar automáticamente XRP como puente entre los tokens, cuando esto reduce el coste del pago. Por ejemplo, un pago que envía de USD a MXN convierte automáticamente USD a XRP y luego XRP a MXN si hacerlo es más barato que convertir USD a MXN diréctamente. Operaciones más grandes pueden utilizar una combinación de conversiones directas (USD-MXN) y puentes automáticos (USD-XRP-MXN).

Para más información, ver auto-puente o [Auto-Bridging](../tokens/decentralized-exchange/autobridging.md).


## Ver también

- **Conceptos:**
    - [Tokens](../tokens/index.md)
    - [Exchange descentralizado](../tokens/decentralized-exchange/index.md)
    - [Paths](../tokens/fungible-tokens/paths.md)
- **References:**
    - [Tipos de transacciones de pago][Payment transaction]
    - [método path_find][]
    - [método ripple_path_find][]
    - [Interpretando metadatos de pagos entre divisas](../transactions/finality-of-results/look-up-transaction-results.md#token-payments)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
