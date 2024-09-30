---
html: automated-market-makers.html
parent: decentralized-exchange.html
seo:
    title: ¿Qué es un Automated Market Maker (AMM)?
    description: Los Automated Market Makers (AMMs) son una parte esencial de las criptomonedas, proveen liquidez entre dos pares de activos. Aprende más sobre AMMs y el XRP Ledger.
labels:
  - XRP
  - Exchange Descentralizado
  - AMM
---
# ¿Qué es un Automated Market Maker (AMM)?

_(Requiere la [enmienda AMM][] XLS-30)_

Los Creadores de Mercado Automatizados o Automated Market Maker (AMMs) son contratos inteligentes que proporcionan liquidez en el exchange descentralizado del XRP Ledger. Cada AMM posee un pool de dos activos y permite a los usuarios intercambiar entre ellos a una tasa de cambio establecida por una fórmula.

Para cualquier par de activos dado, puede haber hasta un AMM en el ledger. Cualquiera puede crear el AMM para un par de activos si aún no existe, o depositar en un AMM existente. Aquellos que depositan activos en un AMM se llaman proveedores de liquidez o _liquidity providers_ (LPs) y reciben "Tokens LP" del AMM. Los Tokens LP permiten a los proveedores de liquidez:

- Canjear sus Tokens LP por una parte de los activos en el pool del AMM, incluidas las tarifas recolectadas.
- Votar para cambiar la configuración de tarifas del AMM. Los votos están ponderados en función de cuántos Tokens LP poseen los votantes.
- Pujar con algunos de sus Tokens LP para recibir un descuento temporal en las tarifas de intercambio del AMM.

Cuando el flujo de fondos entre los dos activos en un pool es relativamente activo y equilibrado, las tarifas proporcionan una fuente de ingresos pasivos para los proveedores de liquidez. Sin embargo, cuando el precio relativo entre los activos cambia, los proveedores de liquidez pueden sufrir una pérdida en el [riesgo de divisa](https://www.investopedia.com/terms/c/currencyrisk.asp).

## ¿Cómo funciona el AMM?

Un AMM posee dos activos diferentes: como máximo, uno de estos puede ser XRP, y uno o ambos pueden ser [tokens](../index.md). Los tokens con diferentes emisores se consideran activos diferentes para este propósito. Esto significa que puede haber un AMM para dos tokens con el mismo código de moneda pero diferentes emisores ("FOO emitido por WayGate" es diferente de "FOO emitido por StableFoo"), o el mismo emisor pero diferentes códigos de moneda. El orden no importa; el AMM para FOO.WayGate a XRP es el mismo que para XRP a FOO.WayGate.

Cuando los usuarios desean comerciar en el exchange descentralizado, sus [Ofertas](offers.md) y [Pagos entre divisas](../../payment-types/cross-currency-payments.md) pueden utilizar automáticamente los AMMs para completar el intercambio. Una sola transacción podría ejecutarse mediante la coincidencia de Ofertas, AMMs o una combinación de ambos, dependiendo de lo que sea más económico.

Un AMM establece su tasa de cambio en función del saldo de activos en el pool. Cuando intercambias contra un AMM, la tasa de cambio se ajusta según cuánto tu intercambio desequilibre el saldo de activos que el AMM posee. A medida que su suministro de un activo disminuye, el precio de ese activo sube; a medida que su suministro de un activo aumenta, el precio de ese activo baja. Un AMM ofrece tasas de cambio generalmente mejores cuando tiene cantidades más grandes en general en su pool. Esto se debe a que cualquier intercambio dado causa un cambio más pequeño en el equilibrio de los activos del AMM. Cuanto más desequilibre un intercambio el suministro de los dos activos del AMM, más extrema se vuelve la tasa de cambio.

El AMM también cobra una tarifa de intercambio porcentual además de la tasa de cambio.

El XRP Ledger implementa un AMM de _media geométrica_ con un parámetro de peso de 0.5, por lo que funciona como un creador de mercado de _producto constante_. Para obtener una explicación detallada de la fórmula AMM de _producto constante_ y la economía de los AMMs en general, consulta [Introducción a los Automated Market Makers de Kris Machowski](https://www.machow.ski/posts/an_introduction_to_automated_market_makers/).

### Restricciones sobre los activos

Para evitar el mal uso, se aplican algunas restricciones a los activos utilizados en un AMM. Si intentas crear un AMM con un activo que no cumple con estas restricciones, la transacción falla. Las reglas son las siguientes:

- El activo no debe ser un Token LP de otro AMM.
- Si el activo es un token cuyo emisor utiliza [Authorized Trust Lines](../fungible-tokens/authorized-trust-lines.md), el creador del AMM debe estar autorizado para poseer esos tokens. Solo los usuarios cuyas líneas de confianza (trustlines) estén autorizadas pueden depositar ese token en el AMM o retirarlo; sin embargo, los usuarios aún pueden depositar o retirar el otro activo.
- Si la [enmienda Clawback][] está habilitada, el emisor del token no debe haber habilitado la capacidad de recuperar sus tokens.


## Tokens LP
<!-- TODO: add diagrams showcasing flow of funds -->
Quien crea el AMM se convierte en el primer proveedor de liquidez y recibe Tokens LP que representan el 100% de la propiedad de los activos en el pool del AMM. Pueden canjear algunos o todos esos Tokens LP para retirar activos del AMM en proporción a las cantidades actualmente allí. (Las proporciones cambian con el tiempo a medida que las personas comercian contra el AMM). El AMM no cobra una tarifa al retirar ambos activos.

Por ejemplo, si creaste un AMM con 5 ETH y 5 USD, y luego alguien cambió 1.26 USD por 1 ETH, el pool ahora tiene 4 ETH y 6.26 USD en él. Puedes gastar la mitad de tus Tokens LP para retirar 2 ETH y 3.13 USD.

Cualquiera puede depositar activos en un AMM existente. Cuando se hace, se reciben nuevos Tokens LP según lo que depositaron. La cantidad que un proveedor de liquidez puede retirar de un AMM se basa en la proporción de los Tokens LP del AMM que poseen en comparación con el número total de Tokens LP pendientes.

Los Tokens LP son como otros tokens en el XRP Ledger, por lo que puedes usarlos en muchos [tipos de pagos](../../payment-types/index.md) o intercambiarlos en el exchange descentralizado. (Para recibir Tokens LP como pago, debes configurar una [trust line](../fungible-tokens/index.md) con un límite distinto de cero con la cuenta del AMM como emisor). Sin embargo, _solo_ puedes enviar Tokens LP directamente al AMM (canjeándolos) usando el tipo de transacción [AMMWithdraw][], no a través de otros tipos de pagos. Del mismo modo, solo puedes enviar activos al pool del AMM a través del tipo de transacción [AMMDeposit][].

El AMM está diseñado de manera que el pool de activos de un AMM esté vacío si y solo si el AMM no tiene Tokens LP pendientes. Esta situación solo puede ocurrir como resultado de una transacción [AMMWithdraw][]; cuando ocurre, el AMM se elimina automáticamente.

### Códigos de moneda de Tokens LP

Los Tokens LP utilizan un tipo especial de código de moneda en el formato hexadecimal de 160 bits ["no estándar"](../../../references/protocol/data-types/currency-formats.md#nonstandard-currency-codes). Estos códigos tienen los primeros 8 bits `0x03`. El resto del código es un hash SHA-512, truncado a los primeros 152 bits, de los códigos de moneda de los dos activos y sus emisores. (Los activos se colocan en un "orden canónico" con el par de moneda+emisor numéricamente inferior primero). Como resultado, los Tokens LP para un par de activos dado de un AMM tienen un código de moneda predecible y consistente.


## Tarifas de intercambio

Las tarifas de intercambio son una fuente de ingresos pasivos para los proveedores de liquidez, y compensan el riesgo cambiario de permitir que otros intercambien activos del pool. Las tarifas de intercambio se pagan al AMM, no directamente a los proveedores de liquidez, pero estos se benefician porque sus Tokens LP se pueden canjear por un porcentaje del pool del AMM.

Los proveedores de liquidez pueden votar para establecer la tarifa del 0% al 1%, en incrementos de 0.001%. Los proveedores de liquidez tienen un incentivo para establecer las tarifas de intercambio a una tasa adecuada: si las tarifas son demasiado altas, los intercambios usarán libros de pedidos para obtener una mejor tasa; si las tarifas son demasiado bajas, los proveedores de liquidez no obtienen ningún beneficio por contribuir al pool. <!-- STYLE_OVERRIDE: will --> Cada AMM da a sus proveedores de liquidez el poder de votar sobre sus tarifas, en proporción a la cantidad de Tokens LP que poseen esos proveedores de liquidez.

Para votar, un proveedor de liquidez envía una [transacción AMMVote][]. Cada vez que alguien realiza una nueva votación, el AMM recalcula su tarifa para ser un promedio de las últimas votaciones ponderadas por la cantidad de Tokens LP que poseen esos votantes. Se pueden contar hasta 8 votos de proveedores de liquidez de esta manera; si más proveedores de liquidez intentan votar, solo se contarán los 8 mejores votos (por la mayor cantidad de Tokens LP que poseen). Aunque la participación de los proveedores de liquidez en Tokens LP puede cambiar rápidamente por muchas razones (como el comercio de esos tokens usando [Ofertas](offers.md)), las tarifas de intercambio solo se recalculan cuando alguien realiza una nueva votación (incluso si esa votación no está entre los 8 mejores).

### Slot de subasta

A diferencia de cualquier Automated Market Maker anterior, el diseño de AMM del XRP Ledger tiene un _slot de subasta_ en la que un proveedor de liquidez puede pujar para obtener un descuento en la tarifa de intercambio durante un período de 24 horas. La oferta debe pagarse en Tokens LP, que se devuelven al AMM. No más de una cuenta puede tener el slot de subasta al mismo tiempo, pero el ofertante puede nombrar hasta 4 cuentas adicionales para también recibir el descuento. No hay una oferta mínima, pero si el slot está ocupado actualmente, debes superar al titular actual del slot para desplazarlos. Si alguien te desplaza, recuperas parte de tu oferta según el tiempo restante. Mientras mantengas un slot de subasta activo, pagas una tarifa de intercambio con descuento igual a 1/10 (una décima parte) de la tarifa de intercambio normal al realizar operaciones contra ese AMM.

Con cualquier AMM, cuando el precio de sus activos cambia significativamente en los mercados externos, los traders pueden usar arbitraje para obtener beneficios del AMM, lo que resulta en una pérdida para los proveedores de liquidez. El mecanismo de subasta tiene como objetivo devolver más de ese valor a los proveedores de liquidez y llevar los precios del AMM más rápidamente de vuelta al equilibrio con los mercados externos.


## Representación en el Ledger

En los datos de estado del ledger, un AMM consiste en múltiples [entradas de ledger](../../../references/protocol/ledger-data/ledger-entry-types/index.md):

- Una [entrada AMM][] que describe el creador de mercado automatizado en sí mismo.

- Una [entrada AccountRoot][] especial que emite Tokens LP del AMM, y tiene XRP del AMM (si lo tiene).

    La dirección de esta AccountRoot se elige de forma algo aleatoria cuando se crea el AMM, y es diferente si el AMM se elimina y se vuelve a crear. Esto puede prevenir que las personas financien la cuenta AMM con XRP excesivo por adelantado.

- Las [Trust lines](../fungible-tokens/index.md) a la cuenta especial AMM para los tokens en el pool del AMM.

Estas entradas de ledger no son propiedad de ninguna cuenta, por lo que el [requisito de reserva](../../accounts/reserves.md) no se aplica a ellas. Sin embargo, para prevenir el spam, la transacción para crear un AMM tiene un [coste de transacción](../../transactions/transaction-cost.md) especial que requiere que el remitente queme una cantidad de XRP mayor de lo habitual.


## Eliminación

Un AMM se elimina cuando una [transacción AMMWithdraw][] retira todos los activos de su pool. Esto solo ocurre canjeando todos los Tokens LP pendientes del AMM. La eliminación del AMM incluye la eliminación de todas las entradas del ledger asociadas con él, como:

- AMM
- AccountRoot
- Trust lines para los Tokens LP del AMM. Estas trust lines tendrían un saldo de 0 pero pueden tener otros detalles como el límite, establecido en un valor no predeterminado.
- Las Trust lines para los tokens que estaban en el pool del AMM.

Si hay más de 512 trust lines enlazadas a la cuenta del AMM cuando se eliminase, el proceso de retiro tiene éxito y elimina tantas trust lines como puede, pero deja el AMM en el ledger sin activos en su pool.

Mientras un AMM no tenga activos en su pool, cualquiera puede eliminarlo enviando una [transacción AMMDelete][]; si el número restante de líneas de confianza sigue siendo mayor que el límite, pueden ser necesarias múltiples transacciones AMMDelete para eliminar completamente el AMM. Alternativamente, cualquier persona puede realizar un [depósito especial](../../../references/protocol/transactions/types/ammdeposit.md#empty-amm-special-case) para financiar el AMM como si fuera nuevo. 

No hay reembolso o incentivo para eliminar un AMM vacío.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
