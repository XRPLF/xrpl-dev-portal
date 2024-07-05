---
html: decentralized-exchange.html
parent: tokens.html
metadata:
  indexPage: true
seo:
    description: El XRP Ledger contiene un exchange completamente funcional donde los usuarios pueden intercambiar tokens por XRP o entre sí.
targets:
  - en
---
# Exchange descentralizado

El XRP Ledger posiblemente tenga el _exchange descentralizado_ más antiguo del mundo (a veces abreviado como "DEX"), operando de manera continua desde el lanzamiento del XRP Ledger en 2012. Este exchange permite a los usuarios comprar y vender [tokens](../index.md) por XRP u otros tokens, con [costes](../../transactions/fees.md) mínimos cargados a la red misma (no pagados a ninguna parte).

**Atención**: Cualquiera puede [emitir un token](../../../tutorials/how-tos/use-tokens/issue-a-fungible-token.md) con el código de moneda o símbolo de ticker que desee y venderlo en el exchange descentralizado. Siempre realiza una debida diligencia antes de comprar un token y presta atención al emisor. De lo contrario, podrías entregar algo de valor y recibir tokens sin valor a cambio.

## Estructura

El exchange descentralizado del XRP Ledger consta de un número ilimitado de pares de divisas, rastreados según la demanda cuando los usuarios realizan intercambios. Un par de divisas puede consistir en XRP y un token o dos tokens diferentes; los tokens siempre se identifican por la combinación de un emisor y un código de moneda. Es posible comerciar entre dos tokens con el mismo código de moneda y diferentes emisores, o el mismo emisor y diferentes códigos de moneda. <!-- STYLE_OVERRIDE: limited number -->

Como con todos los cambios en el XRP Ledger, necesitas enviar una [transacción](../../transactions/index.md) para realizar un intercambio. Un intercambio en el XRP Ledger se conoce como Oferta u [Offer](offers.md). Una Oferta es efectivamente una [_Orden límite_](https://en.wikipedia.org/wiki/Order_(exchange)#Limit_order) para comprar o vender una cantidad específica de una moneda (XRP o un token) por una cantidad específica de otra. Cuando la red ejecuta una Oferta, si hay otras Ofertas coincidentes para el mismo par de divisas, estas se consumen comenzando con la mejor tasa de cambio primero.

Una Oferta puede llenarse completamente o parcialmente; si no se llena completamente de inmediato, se convierte en un objeto de Oferta pasiva en el ledger para la cantidad restante. Más adelante, otras Ofertas o [pagos entre divisas](../../payment-types/cross-currency-payments.md) pueden coincidir y consumir la Oferta. Debido a esto, las Ofertas pueden ejecutarse a un mejor precio que el solicitado inicialmente, o exactamente al tipo de cambio indicado más tarde (excepto por diferencias menores para tener en cuenta el redondeo).

Las Ofertas pueden cancelarse manual o automáticamente después de ser colocadas. Para obtener detalles sobre esto y otras propiedades de las Ofertas, consulta [Ofertas](offers.md).

Al comerciar con dos tokens, el [puente automático](autobridging.md) mejora las tasas de cambio y la liquidez al intercambiar automáticamente token por XRP y XRP por token cuando hacerlo es más barato que intercambiar directamente token por token.

### Ejemplo de intercambio

[{% inline-svg file="/docs/img/decentralized-exchange-example-trade.svg" /%}](/docs/img/decentralized-exchange-example-trade.svg "Diagrama: Oferta parcialmente completada para comprar un token con XRP.")

El diagrama anterior muestra un ejemplo de intercambio en el exchange descentralizado. En este ejemplo, un trader llamado Tran coloca una Oferta para comprar 100 tokens con el código de moneda FOO emitido por un negocio ficticio llamado WayGate. (Por brevedad, "FOO.WayGate" se refiere a estos tokens.) Tran especifica que está dispuesto a gastar hasta 1000 XRP en total. Cuando la transacción de Tran es procesada, ocurren las siguientes cosas:

1. La red calcula la tasa de cambio de la Oferta de Tran, dividiendo la cantidad a comprar por la cantidad a pagar.
0. La red encuentra el libro de órdenes para el reverso de la Oferta de Tran: en este caso, eso significa el libro de órdenes para vender FOO.WayGate y comprar XRP. Este libro de órdenes ya tiene varias Ofertas existentes de otros traders para diferentes cantidades y tasas de cambio.
0. La Oferta de Tran "consume" Ofertas coincidentes, comenzando con la mejor tasa de cambio y trabajando hacia abajo, hasta que la Oferta de Tran se haya llenado por completo o no haya más Ofertas cuya tasa de cambio sea igual o mejor que la tasa especificada en la Oferta de Tran. En este ejemplo, solo hay disponibles 22 FOO.WayGate a la tasa solicitada o mejor. Las Ofertas consumidas se eliminan del libro de órdenes.
0. Tran recibe la cantidad de FOO.WayGate que el intercambio pudo adquirir, de los varios traders que previamente habían colocado órdenes para venderlo. Estos tokens van a la [trust line](../fungible-tokens/index.md) de Tran a WayGate para FOO. (Si Tran no tenía esa trust line previamente, se crea automáticamente una).
0. A cambio, esos traders reciben XRP de Tran de acuerdo con sus tasas de cambio declaradas.
0. La red calcula el resto de la Oferta de Tran: dado que la Oferta original era para comprar 100 FOO.WayGate y hasta ahora Tran ha recibido 22, el resto es de 78 FOO.WayGate. Usando la tasa de cambio original, eso significa que el resto de la Oferta de Tran ahora es comprar 78 FOO.WayGate por 780 XRP.
0. El "resto" resultante se coloca en el libro de órdenes para intercambios en la misma dirección que la de Tran: vendiendo XRP y comprando FOO.WayGate.

Las transacciones posteriores, incluidas aquellas ejecutadas inmediatamente después de las de Tran en el _mismo_ ledger, utilizan los libros de órdenes actualizados para sus intercambios, por lo que pueden consumir parte o toda la Oferta de Tran hasta que se llene por completo o Tran la cancele.

**Nota**: El orden canónico en el que las transacciones se ejecutan cuando se cierra y valida un ledger no es el mismo que el orden en el que se enviaron esas transacciones. Cuando varias transacciones afectan al mismo libro de órdenes en el mismo ledger, los resultados finales de esas transacciones pueden ser muy diferentes a los resultados tentativos calculados en el momento del envío de la transacción. Para obtener más detalles sobre cuándo los resultados de las transacciones son o no finales, consulta [Finalidad de resultados](../../transactions/finality-of-results/index.md).


## Limitaciones

El exchange descentralizado está diseñado con las siguientes limitaciones:

Debido a que los intercambios se ejecutan solo cada vez que se cierra un nuevo ledger (aproximadamente cada 3-5 segundos), el XRP Ledger no es adecuado para el [trading de alta frecuencia](https://en.wikipedia.org/wiki/High-frequency_trading). El orden en el que las transacciones se ejecutan dentro de un ledger está diseñado para ser impredecible, para desalentar el [front-running](https://en.wikipedia.org/wiki/Front_running).

El XRP Ledger no representa nativamente conceptos como órdenes de mercado, órdenes de stop o trading con apalancamiento. Algunos de estos pueden ser posibles con el uso creativo de tokens personalizados y propiedades de Oferta.

Como sistema descentralizado, el XRP Ledger no tiene información sobre las personas y organizaciones reales detrás de las [cuentas](../../accounts/index.md) involucradas en el trading. El Ledger en sí no puede implementar restricciones sobre quién puede o no puede participar en el trading, y los usuarios y emisores deben tener cuidado de seguir todas las leyes relevantes para regular el trading de tokens que representan varios tipos de activos subyacentes. Funciones como [congelamientos](../fungible-tokens/freezes.md) y [trust lines autorizadas](../fungible-tokens/authorized-trust-lines.md) están destinadas a ayudar a los emisores a cumplir con las leyes y regulaciones relevantes.

## Ver también

- **Conceptos:**
    - Ver [Ofetas](offers.md) para obtener detalles sobre cómo funcionan los intercambios en el XRP Ledger.
    - Ver [Tokens](../index.md) para obtener una descripción general de cómo se pueden representar diversos tipos de valor en el XRP Ledger.
- **Referencias:**
    - [método account_offers][] para buscar Ofertas creadas por una cuenta
    - [método book_offers][] para buscar Ofertas de compra o venta según un par de divisas dado
    - [transacción OfferCreate][] para crear una Oferta nueva o reemplazar una Oferta existente
    - [transacción OfferCancel][] para cancelar una Oferta existente
    - [objeto Offer][] para la estructura de datos de las Ofertas pasivas en el ledger
    - [objeto DirectoryNode][] para la estructura de datos que sigue todas las Ofertas para un par de divisas y tarifa de intercambio dados.

{% raw-partial file="/docs/_snippets/common-links.md" /%}


{% child-pages /%}
