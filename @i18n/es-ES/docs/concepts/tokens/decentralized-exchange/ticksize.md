---
html: ticksize.html
parent: decentralized-exchange.html
seo:
    description: Los emisores pueden establecer tamaños de ticks personalizados para las monedas para reducir la rotación de libros de pedidos por diferencias minúsculas en los tipos de cambio.
labels:
  - Exchange Descentralizado
  - Tokens
---
# Tamaño de Tick

Cuando se coloca una Oferta en un libro de órdenes, su tasa de cambio se trunca en base a los valores de `TickSize` establecidos por los emisores de las monedas involucradas en la Oferta. Cuando se negocia XRP y un token, se aplica el `TickSize` del emisor del token. Cuando se negocian dos tokens, la Oferta utiliza el valor de `TickSize` más pequeño (es decir, el que tiene menos dígitos significativos). Si ninguno de los tokens tiene un `TickSize` establecido, se aplica el comportamiento predeterminado.

El valor de `TickSize` trunca la cantidad de _dígitos significativos_ en la tasa de cambio de una oferta cuando se coloca en un libro de órdenes. Los emisores pueden establecer `TickSize` como un número entero de `3` a `15` usando una [transacción AccountSet][]. La tasa de cambio se representa como dígitos significativos y un exponente; el `TickSize` no afecta al exponente. Esto permite que el XRP Ledger represente tasas de cambio entre activos que varían considerablemente en valor (por ejemplo, una moneda altamente inflada en comparación con un activo raro). Cuanto menor sea el `TickSize` que establezca un emisor, mayor será el incremento que los traders deben ofrecer para considerarse una tasa de cambio más alta que las Ofertas existentes.

El `TickSize` no afecta a la parte de una Oferta que se puede ejecutar inmediatamente. (Por esa razón, las transacciones OfferCreate con `tfImmediateOrCancel` no se ven afectadas por los valores de `TickSize`.) Si la Oferta no puede ejecutarse completamente, el motor de procesamiento de transacciones calcula la tasa de cambio y la trunca en base a `TickSize`. Luego, el motor redondea la cantidad restante de la Oferta desde el lado "menos importante" para que coincida con la tasa de cambio truncada. Para una transacción OfferCreate predeterminada (una Oferta de "compra"), la cantidad de `TakerPays` (la cantidad que se compra) se redondea. Si se activa la bandera `tfSell` (una Oferta de "venta"), la cantidad de `TakerGets` (la cantidad que se vende) se redondea.

Cuando un emisor habilita, deshabilita o cambia el `TickSize`, las Ofertas que se colocaron bajo la configuración anterior no se ven afectadas.

## Ver también

- [Dev Blog: Introducción a la enmienda TickSize](https://xrpl.org/blog/2017/ticksize-voting.html#ticksize-amendment-overview)
- **Referencias:**
    - [transacción AccountSet][]
    - [método book_offers][]
    - [transacción OfferCreate][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
