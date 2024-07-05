---
html: autobridging.html
parent: decentralized-exchange.html
seo:
    description: El puente automático conecta automáticamente los libros de órdenes utilizando XRP como intermediario cuando reduce los costes.
labels:
  - XRP
  - Exchange Descentralizado
---
# Puente automático

Cualquier [Oferta](offers.md) en el [exchange descentralizado](index.md) del XRP Ledger que intercambie dos tokens podría potencialmente utilizar XRP como moneda intermediaria en un libro de órdenes sintético. Esto se debe al _puente automático_, que sirve para mejorar la liquidez en todos los pares de activos utilizando XRP cuando es más barato que intercambiar directamente. Esto funciona debido a la naturaleza de XRP como criptomoneda nativa del  XRP Ledger. La ejecución de la oferta puede utilizar una combinación de ofertas directas y ofertas auto-puenteadas para lograr la mejor tasa de cambio total.

Ejemplo: _Anita crea una oferta para vender GBP y comprar BRL. Ella podría encontrar que este mercado poco común tiene pocas ofertas. Hay una oferta con una buena tasa, pero tiene una cantidad insuficiente para satisfacer el intercambio de Anita. Sin embargo, tanto GBP como BRL tienen mercados activos y competitivos para XRP. El sistema de puente automático del XRP Ledger encuentra una forma de completar la oferta de Anita comprando XRP con GBP de un trader, luego vendiendo el XRP a otro trader para comprar BRL. Anita obtiene automáticamente la mejor tasa posible combinando la pequeña oferta en el mercado directo de GBP:BRL con las mejores tasas compuestas creadas emparejando las ofertas GBP:XRP y XRP:BRL._ <!-- SPELLING_IGNORE: gbp -->

El puente automático ocurre automáticamente en cualquier [transacción OfferCreate][]. Las [transacciones de Payment](../../../references/protocol/transactions/types/payment.md) _no_ usan auto-puente por defecto, pero path-finding pueden encontrar [rutas o paths](../fungible-tokens/paths.md) que tengan el mismo efecto.

## Ver también

- [Dev Blog: Introducción al Autopuente](https://xrpl.org/blog/2014/introducing-offer-autobridging.html) <!-- SPELLING_IGNORE: autobridging -->

- [Preferencia de oferta](offers.md#offer-preference)

- [Rutas de pago](../fungible-tokens/paths.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
