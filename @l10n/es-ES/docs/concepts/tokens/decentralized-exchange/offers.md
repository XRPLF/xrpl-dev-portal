---
html: offers.html
parent: decentralized-exchange.html
seo:
    description: Las ofertas son la forma de órdenes de comercio de divisas del XRP Ledger. Comprende su ciclo de vida y propiedades.
labels:
  - Exchange Descentralizado
---
# Ofertas

En el [exchange descentralizado](index.md) del XRP Ledger, las órdenes de intercambio se llaman "Ofertas". Las Ofertas pueden intercambiar XRP con [tokens](../index.md), o tokens por otros tokens, incluyendo tokens con el mismo código de moneda pero diferentes emisores. (Los tokens con el mismo código pero diferentes emisores también a veces pueden intercambiarse a través de [rippling](../fungible-tokens/rippling.md).)

- Para crear una Oferta, envía una [transacción OfferCreate][].
- Las Ofertas que no se completan totalmente inmediatamente se convierten en [objetos Offer](../../../references/protocol/ledger-data/ledger-entry-types/offer.md) en los datos del ledger. Ofertas posteriores o Pagos pueden consumir el objeto Oferta desde el ledger.
- [Pagos entre divisas](../../payment-types/cross-currency-payments.md) consumen Ofertas para proveer liquidez, nunca crean objetos de Oferta en el ledger.

## Ciclo de vida para una Oferta

Una [transacción OfferCreate][] es una instrucción para realizar un intercambio, ya sea entre dos tokens, o un token y XRP. Cada transacción de este tipo contiene una cantidad de compra (`TakerPays`) y una cantidad de venta (`TakerGets`). Cuando se procesa la transacción, consume automáticamente Ofertas coincidentes o cruzadas en la medida de lo posible. Si eso no llena completamente la nueva Oferta, entonces el resto se convierte en un objeto de Oferta en el ledger.

El objeto de Oferta espera en el ledger hasta que otras Ofertas o pagos entre divisas lo consumen completamente. La cuenta que colocó la Oferta se llama el _propietario_ de la Oferta. Puedes cancelar tus propias Ofertas en cualquier momento, usando la [transacción OfferCancel][] dedicada, o como opción de la [transacción OfferCreate][].

Mientras tengas una Oferta en el ledger, se aparta parte de tu XRP hacia la [reserva de propietario](../../accounts/reserves.md). Cuando se elimina la Oferta, por cualquier motivo, ese XRP se libera nuevamente.

### Variaciones

- **Compra vs. Venta**: Por defecto, las Ofertas son Ofertas de "compra" y se consideran completamente llenas cuando has adquirido la cantidad total de "compra" (`TakerPays`). (Puedes gastar menos de lo esperado mientras recibes la cantidad especificada.) En contraste, una Oferta de "venta" solo se considera completamente llena cuando has gastado la cantidad total de "venta" (`TakerGets`). (Puedes recibir más de lo esperado mientras gastas la cantidad especificada.) Esto solo es relevante si la Oferta se ejecuta _inicialmente_ a un tipo de cambio mejor que el solicitado: después de que la Oferta se coloca en el ledger, solo se ejecuta _exactamente_ al tipo de cambio solicitado.
- Una Oferta **Inmediata o Cancelar** no se coloca en el ledger, por lo que solo intercambia hasta la cantidad que coincide con Ofertas existentes en el momento en que se procesa la transacción.
- Una Oferta **Completar o Cancelar** no se coloca en el ledger, _y_ se cancela si la cantidad total no se completa cuando se ejecuta inicialmente. Esto es similar a "Inmediata o Cancelar", excepto que _no puede_ completarse parcialmente.
- Una Oferta **Pasiva** no consume Ofertas coincidentes que tengan el mismo tipo de cambio (en la otra dirección), y en su lugar se coloca directamente en el ledger. Puedes usar esto para crear un peg exacto entre dos activos. Las Ofertas Pasivas aún consumen otras Ofertas que tienen un tipo de cambio _mejor_ en la otra dirección.


### Requisitos de financiación

Cuando intentas realizar una Oferta, la transacción se rechaza como "no financiada" si no tienes al menos parte del activo que la operación vendería. Más específicamente:

**Para vender un token,** debes:

- Tener una cantidad positiva de ese token, _o_
- Ser el emisor del token.

Sin embargo, no necesitas tener la cantidad completa especificada en la Oferta. Colocar una Oferta no bloquea tus fondos, por lo que puedes colocar múltiples Ofertas para vender los mismos tokens (o XRP), o colocar una Oferta y esperar obtener suficientes tokens o XRP para financiarla completamente más adelante.

**Para vender XRP**, debes tener suficiente XRP para cumplir con todos los [requisitos de reserva](../../accounts/reserves.md), incluida la reserva para que el objeto de Oferta se coloque en el ledger y para la trust line para mantener el token que estás comprando. Mientras tengas XRP restante después de apartar la cantidad de reserva, puedes colocar la Oferta.

Cuando otra Oferta coincide con la tuya, ambas Ofertas se ejecutan en la medida en que los fondos de sus propietarios lo permitan en ese momento. Si hay Ofertas coincidentes y te quedas sin fondos antes de que la tuya se finalice por completo, el resto de tu Oferta se cancela. Una Oferta no puede hacer que tu saldo de un token sea negativo, a menos que seas el emisor de ese token. (Si eres el emisor, puedes usar Ofertas para emitir nuevos tokens hasta el monto total especificado en tus Ofertas; los tokens que emites se representan como saldos negativos desde tu perspectiva.)

Si colocas una Oferta que cruza alguna de tus propias Ofertas que existen en el ledger, las Ofertas antiguas cruzadas se cancelan automáticamente independientemente de las cantidades involucradas.

Es posible que una Oferta se vuelva temporal o permanentemente _no financiada_ en los siguientes casos:

- Si el propietario ya no tiene ningún activo de venta.
    - La Oferta se vuelve financiada nuevamente cuando el propietario obtiene más de ese activo.
- Si el activo en venta es un token en una [trust line congelada](../fungible-tokens/freezes.md).
    - La Oferta se vuelve financiada nuevamente cuando la trust line ya no está congelada.
- Si la Oferta necesita crear una nueva trust line, pero el dueño no tiene suficiente XRP para el aumento de la [reserva](../../accounts/reserves.md). (Ver [Ofertas y confianza](#offers-and-trust).)
    - La oferta vuelve a estar financiada cuando el propietario obtiene más XRP, o los requisitos de reserva disminuyen.
- Si la Oferta ha expirado. (Ver [Expiración de ofertas](#offer-expiration).)

Una Oferta no financiada permanece en el ledger hasta que una transacción la elimine. Las formas en que una Oferta puede ser eliminada del ledger incluyen:

- Una Oferta coincidente o [Pago entre divisas](../../payment-types/cross-currency-payments.md) que consuman completamente la Oferta.
- El propietario cancela explicitamente la Oferta.
- El propietario cancela implícitamente la Oferta enviando una nueva Oferta que la cruza.
- La Oferta es encontrada sin financiar o expirada durante el procesamiento de la transacción. Normalmente esto significa que otra Oferta intentó consumirla y no pudo hacerlo.
    - Esto incluye casos donde la cantidad restante puede ser pagada mediante la Oferta redondeada a cero.

### Seguimiento de ofertas no financiadas

Seguir el estado de financiación de todas las Ofertas puede ser computacionalmente exigente. En particular, las direcciones que están operando activamente pueden tener un gran número de Ofertas abiertas. Un solo balance puede afectar el estado de financiación de muchas Ofertas. Debido a esto, el XRP Ledger no encuentra y elimina _proactivamente_ Ofertas no financiadas o expiradas.

Una aplicación de cliente puede seguir localmente el estado de financiación de las Ofertas. Para hacerlo, primero recupera un libro de órdenes utilizando el [método book_offers][] y verifica el campo `taker_gets_funded` de las Ofertas. Luego, [suscríbete](../../../references/http-websocket-apis/public-api-methods/subscription-methods/subscribe.md) al flujo de `transactions` y observa los metadatos de transacción para ver qué Ofertas se modifican.


## Ofertas y confianza

Los valores límite de las [trust lines](../fungible-tokens/index.md) no afectan a las Ofertas. En otras palabras, puedes usar una Oferta para adquirir más de la cantidad máxima en la que confías en un emisor.

Sin embargo, mantener tokens aún requiere una trust line con el emisor. Cuando una Oferta se consume, automáticamente crea cualquier trust line necesaria, estableciendo sus límites en 0. Debido a que [las trust lines aumentan la reserva que una cuenta debe mantener](../../accounts/reserves.md), cualquier Oferta que requiera una nueva trust line también requiere que la dirección tenga suficiente XRP para cumplir con la reserva de esa trust line.

Los límites de la trust line te protegen de recibir más de un token como pago de lo que deseas. Las Ofertas pueden superar esos límites porque son una declaración explícita de cuánto del token deseas.


## Preferencia de Oferta

Las Ofertas existentes se agrupan por tipo de cambio, que se mide como la relación entre `TakerGets` y `TakerPays`. Las Ofertas con un tipo de cambio más alto se toman preferentemente. (Es decir, la persona que acepta la oferta recibe tanto como sea posible por la cantidad de moneda que paga). Las Ofertas con el mismo tipo de cambio se toman en función de cuál se colocó primero.

Cuando las Ofertas se ejecutan en el mismo bloque del ledger, el orden en que se ejecutan se determina por el [orden canónico](https://github.com/XRPLF/rippled/blob/release/src/ripple/app/misc/CanonicalTXSet.cpp "Código fuente: Ordenación de transacciones") en el que las transacciones fueron [aplicadas en el ledger](https://github.com/XRPLF/rippled/blob/5425a90f160711e46b2c1f1c93d68e5941e4bfb6/src/ripple/app/consensus/LedgerConsensus.cpp#L1435-L1538 "Código fuente: Aplicando transacciones"). Este comportamiento está diseñado para ser determinista, eficiente y difícil de manipular.


## Caducidad de la oferta

Cuando colocas una Oferta, puedes opcionalmente añadirle un tiempo de caducidad. Por defecto, las Ofertas no caducan. No puedes crear una nueva Oferta que ya esté caducada.

Los tiempos de caducidad se especifican hasta el segundo, pero el momento exacto en el que una Oferta caduca en el mundo real es menos preciso. Una Oferta caduca si tiene una hora de caducidad que es _anterior o igual al_ momento de cierre del ledger anterior. De lo contrario, la Oferta aún puede ejecutarse, incluso si el momento real es posterior a la caducidad de la Oferta. En otras palabras, una Oferta sigue "activa" si su hora de caducidad es posterior al momento de cierre del último ledger validado, independientemente de lo que diga tu reloj.

Esto es una consecuencia de cómo la red alcanza un acuerdo. Para que toda la red peer-to-peer alcance un consenso, todos los servidores deben estar de acuerdo en qué Ofertas han caducado al ejecutar transacciones. Los servidores individuales pueden tener pequeñas diferencias en su configuración interna de reloj, por lo que podrían no llegar a las mismas conclusiones sobre qué Ofertas han caducado si cada uno usara el tiempo "actual". El momento de cierre de un ledger no se conoce hasta después de que las transacciones en ese ledger se hayan ejecutado, por lo que los servidores utilizan el momento oficial de cierre del ledger _anterior_ en su lugar. Los [tiempos de cierre de los ledgers se redondean](../../ledgers/ledger-close-times.md), lo que aumenta aún más la diferencia potencial entre el tiempo real y el tiempo utilizado para determinar si una Oferta ha caducado.

**Nota:** Las Ofertas caducadas permanecen en los datos del ledger hasta que una transacción las elimine. Hasta entonces, pueden continuar apareciendo en los datos recuperados a través de la API (por ejemplo, utilizando el [método ledger_entry][]). Las transacciones eliminan automáticamente cualquier Oferta caducada y no financiada que encuentren, generalmente mientras ejecutan Ofertas o pagos de monedas cruzadas que las hubieran igualado o cancelado. La reserva del propietario asociada con una Oferta solo vuelve a estar disponible cuando la Oferta se elimina realmente.


## Ver también

- **Conceptos:**
    - [Tokens](../index.md)
    - [Paths](../fungible-tokens/paths.md)
- **Referencias:**
    - [método account_offers][]
    - [método book_offers][]
    - [transacción OfferCreate][]
    - [transacción OfferCancel][]
    - [Objeto Offer](../../../references/protocol/ledger-data/ledger-entry-types/offer.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
