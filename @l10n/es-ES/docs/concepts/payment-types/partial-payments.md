---
html: partial-payments.html
parent: payment-types.html
seo:
    description: Los pagos parciales restan costes a la cantidad enviada, entregando una cantidad flexible. Los pagos parciales son útiles para devolver pagos no deseados sin incurrir en costes adicionales.
labels:
  - Pagos
  - Seguridad
---
# Pagos parciales

El remitente de cualquier [transacción de pago][] puede habilitar el [flag de"Partial Payment"](../../references/protocol/transactions/types/payment.md#payment-flags) y enviar un pago que entregue menos de lo que indica el campo `Amount`. Al procesar cualquier Pago, utiliza el campo de metadatos `delivered_amount`, no el campo `Amount`. El `delivered_amount` es la cantidad que un pago realmente entregó.

Si un Pago no habilita el flag de Pago Parcial, el campo `Amount` de una [transacción Payment][] en el XRP Ledger especifica la cantidad a entregar después de cobrar por tasas de cambio y [costes de transferencia](../tokens/transfer-fees.md). El flag de Pago Parcial ([`tfPartialPayment`](../../references/protocol/transactions/types/payment.md#payment-flags)) permite que un pago tenga éxito al reducir la cantidad recibida en lugar de aumentar la cantidad enviada. Los pagos parciales son útiles para [devolver pagos](bouncing-payments.md) sin incurrir en costos adicionales para uno mismo.

La cantidad de XRP utilizada para el [coste de transacción](../transactions/transaction-cost.md) siempre se deduce de la cuenta del remitente, independientemente del tipo de transacción. Este coste de transacción, o comisión, no se incluye en la `Amount`.

Los pagos parciales se pueden utilizar para explotar integraciones ingenuas con el XRP Ledger para robar dinero de exchanges y gateways. La sección [Explotación de Pagos Parciales](#exploit-de-pagos-parciales) de este documento describe cómo funciona esta explotación y cómo puedes evitarla.

## Semántica

### Sin pagos parciales

Al enviar un Pago que no utiliza el flag de Pago Parcial, el campo `Amount` de la transacción especifica la cantidad exacta a entregar, y el campo `SendMax` especifica la cantidad máxima y la divisa a enviar. Si un pago no puede entregar la cantidad completa de `Amount` sin exceder el parámetro `SendMax`, o si la cantidad completa no se puede entregar por cualquier otro motivo, la transacción falla. Si el campo `SendMax` se omite de las instrucciones de la transacción, se considera igual a la `Amount`. En este caso, el pago solo puede tener éxito si la cantidad total de las tarifas es 0.

En otras palabras:

```
Cantidad + (costes) = (cantidad enviada) ≤ SendMax
```

En esta fórmula, "costes" o fees se refiere a [costes de transferencia](../tokens/transfer-fees.md) y tipos de cambio de las divisas. La "cantidad enviada" y la cantidad enviada (`Amount`) pueden estar denominadas en distintas divisas y convertirse por la consumición de Ofertas en el exchange descentralizado del XRP Ledger.

**Nota:** El campo `Fee` de la transacción se refiere al [coste de transacción](../transactions/transaction-cost.md) en XRP, que se destruye para enviar la transacción a la red. El coste de transacción exacto especificado se carga siempr al remitente y se separa completamente de los cálculos de costes para cualquier tipo de pago.

### Con pagos parciales

Cuando se envía un Pago que tiene habilitado el flag de Pago Parcial, el campo `Amount` de la transacción especifica una cantidad máxima a entregar. Los pagos parciales pueden tener éxito al enviar _parte_ del valor previsto a pesar de limitaciones que incluyen costes, falta de liquidez, falta de espacio en las líneas de confianza (trustlines) de la cuenta receptora, u otras razones.

El campo opcional `DeliverMin` especifica una cantidad mínima a entregar. El campo `SendMax` funciona de la misma manera que con los pagos no parciales. La transacción de pago parcial tiene éxito si entrega cualquier cantidad igual o mayor que el campo `DeliverMin` sin exceder la cantidad `SendMax`. Si el campo `DeliverMin` no está especificado, un pago parcial puede tener éxito al entregar cualquier cantidad positiva.

En otras palabras:

```
Cantidad ≥ (Cantidad enviada) = SendMax - (Costes) ≥ DeliverMin > 0
```

### Limitaciones de los pagos parciales

Los pagos parciales tienen las siguientes limitaciones:

- Un pago parcial no puede proporcionar el XRP para crear una dirección; en este caso se devuelve el [código de resultado][] `telNO_DST_PARTIAL`.
- Pagos directoss de XRP a XRP no pueden ser pagos parciales; este caso devuelve el [código de resultado][] `temBAD_SEND_XRP_PARTIAL`.
    - Sin embargo, los pagos entre divisas que involucran a XRP como una de las divisas _pueden_ ser pagos parciales.

[código de resultado]: ../../references/protocol/transactions/transaction-results/index.md

### El campo `delivered_amount`

Para ayudar a entender cuánto entregó realmente un pago parcial, los metadatos de una transacción de Pago exitosa incluyen un campo `delivered_amount`. Este campo describe la cantidad realmente entregada, en el [mismo formato](../../references/protocol/data-types/basic-data-types.md#specifying-currency-amounts) que el campo `Amount`.

Para pagos no parciales, el campo `delivered_amount` de los metadatos de la transacción es igual al campo `Amount` de la transacción. Cuando un pago entrega [tokens](../tokens/index.md), el campo `delivered_amount` puede ser ligeramente diferente al campo `Amount` debido al redondeo.

La cantidad entregada **no está disponible** para transacciones que cumplen **ambos** de los siguientes criterios:

- Es un pago parcial
- Está incluido en un ledger validado anterior al 20 de enero de 2014

Si ambas condiciones son verdaderas, entonces `delivered_amount` contiene el valor del string `unavailable` en lugar de una cantidad real. Si esto ocurre, solo puedes determinar la cantidad entregada real leyendo los `AffectedNodes` en los metadatos de la transacción. Si la transacción entregó tokens y el `issuer` del `Amount` es la misma cuenta que la dirección `Destination`, la cantidad entregada puede dividirse entre varios miembros de `AffectedNodes` que representan líneas de confianza (trustlines) con distintas contrapartes.

Puedes encontrar el campo `delivered_amount` en los siguientes lugares:

| API | Método | Campo |
|-----|--------|-------|
| [JSON-RPC / WebSocket][] | [método account_tx][] | `result.transactions` miembros del array `meta.delivered_amount` |
| [JSON-RPC / WebSocket][] | [método tx][] | `result.meta.delivered_amount` |
| [JSON-RPC / WebSocket][] | [método transaction_entry][] | `result.metadata.delivered_amount` |
| [JSON-RPC / WebSocket][] | [método ledger][] (con las transacciones ampliadas) | `result.ledger.transactions` miembros del array `metaData.delivered_amount` |
| [WebSocket][] | [subscripciones Transaction](../../references/http-websocket-apis/public-api-methods/subscription-methods/subscribe.md#transaction-streams) | Mensajes de subscripción de `meta.delivered_amount` |
| ripple-lib v1.x | método `getTransaction` | `outcome.deliveredAmount` |
| ripple-lib v1.x | método `getTransactions` | miembros del array `outcome.deliveredAmount` |

[WebSocket]: ../../references/http-websocket-apis/index.md
[JSON-RPC / WebSocket]: ../../references/http-websocket-apis/index.md

## Exploit de pagos parciales

Si la integración de una institución financiera con el XRP Ledger asume que el campo `Amount` de un Pago es siempre la cantidad completa entregada, actores maliciosos podrían aprovechar esa suposición para robar dinero de la institución. Este exploit puede utilizarse contra pasarelas, exchanges o comerciantes siempre que el software de esas instituciones no procese los pagos parciales correctamente.

**La forma correcta de procesar las transacciones de Pago entrantes es utilizar [el campo `delivered_amount` de los metadatos](#the-delivered_amount-field),** no el campo `Amount`. De este modo, una institución nunca se equivocará sobre cuanto recibe _realmente_.


### Pasos del escenario del Exploit

Para realizar un exploit a una institución financiera vulnerable, un actor malicioso puede hacer lo siguiente:

1. El actor malicioso envía una transacción de Pago a la institución. Esta transacción tiene un campo  `Amount` grande y tiene el flag de **`tfPartialPayment`** activado.
2. El pago parcial tiene éxito (código de resultado `tesSUCCESS`) pero en realidad entrega una cantidad muy pequeña de la divisa especificada.
3. La institución vulnerable lee el campo `Amount` sin mirar el campo `Flags` o el campo de metadatos `delivered_amount`.
4. La institutución vulnerable acredita al actor malicioso en un sistema externo, como el propio ledger de la institución, por el `Amount` completo, a pesar de recibir solo un `delivered_amount` pequeño en el XRP Ledger.
5. El actor malicioso retira tanto saldo como sea posible antes de que la institución vulnerable note la discrepancia.
    - Los actores maliciosos suelen preferir convertir el saldo a otra criptomoneda como Bitcoin, porque las transacciones de blockchain suelen ser irreversibles. Con un retiro a un sistema de moneda fiduciaria, la institución financiera podría revertir o cancelar la transacción varios días después de que se ejecute inicialmente.
    - En el caso de un exchange, el actor malicioso también puede retirar un saldo de XRP directamente de nuevo al XRP Ledger.

En el caso de un comerciante, el orden de las operaciones es ligeramente diferente, pero el concepto es el mismo:

1. El actor malicioso solicita comprar una gran cantidad de bienes o servicios.
2. El comerciante vulnerable factura al actor malicioso por el precio de esos bienes o servicios.
3. El actor malicioso envía una transacción de Pago al comerciante. Esta transacción tiene un campo `Amount` grande y tiene el flag **`tfPartialPayment`** activado.
4. El pago parcial tiene éxito (código de resultado `tesSUCCESS`) pero entrega solo una cantidad muy pequeña de la divisa especificada.
5. El comerciante vulnerable lee el campo `Amount` de la transacción sin mirar el campo `Flags` o el campo de los metadatos `delivered_amount`.
6. El comerciante vulnerable trata la factura como pagada y proporciona los bienes o servicios al actor malicioso, a pesar de recibir solo una mucho menor `delivered_amount` en el XRP Ledger.
7. El actor malicioso utiliza, revende, o se marcha con los bienes y servicios antes de que el comerciantes note la discrepancia.

### Mitigaciones adicionales

Utilizar [el campo `delivered_amount`](#the-delivered_amount-field) al procesar transacciones entrantes es suficiente para evitar este exploit. Aún así, prácticas de negocio proactivas adicionales también pueden evitar o mitigar la probabilidad de esta o exploits similares. Por ejemplo:

- Añade chequeos adicionales a la lógica de tu negocio para procesar los retiros. Nunca proceses un retiro si el balance total que tienes en el XRP Ledger no coincide con tus activos y obligaciones esperados.
- Sigue las directrices "Know Your Customer" y verifica estrictamente las identidades de tus clientes. Puede que reconozcas y bloquees usuarios maliciosos de antemano, o emprender acciones legales contra el actor malicioso que genera exploits a tu sistema.


## Ver también

- **Herramientas:**
    - [Remitente de la transacción](/resources/dev-tools/tx-sender)
- **Conceptos:**
    - [Transacciones](../transactions/index.md)
- **Tutoriales:**
    - [Buscar resultados de transacciones](../transactions/finality-of-results/look-up-transaction-results.md)
    - [Monitorear pagos recibidos con WebSocket](../../tutorials/http-websocket-apis/build-apps/monitor-incoming-payments-with-websocket.md)
    - [Usar tipos de pagos especializados](../../tutorials/how-tos/use-specialized-payment-types/index.md)
    - [Listar XRP en un Exchange](../../use-cases/defi/list-xrp-as-an-exchange.md)
- **Referencias:**
    - [Transacción de Pago][]
    - [Metadatos de transacción](../../references/protocol/transactions/metadata.md)
    - [método account_tx][]
    - [método tx][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
