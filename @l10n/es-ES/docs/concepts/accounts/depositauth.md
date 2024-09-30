---
html: depositauth.html
parent: accounts.html
seo:
    description: La configuración DepositAuth le permite a una cuenta bloquear pagos entrantes por defecto.
labels:
  - Pagos
  - Seguridad
---
# Autorización para depositar

_(Añadido por la [enmienda DepositAuth][].)_

La Autorización para depositar es una configuración opcional de la [cuenta](index.md) en el XRP Ledger. Si se activa, La Autorización para depositar, bloquea todas las transferencias de desconocidos, incluidas las transferencias de XRP o [tokens](../tokens/index.md). Una cuenta con Autorización para depositar solo puede recibir valor de dos maneras:

- Desde cuentas que tiene [preautorizadas](#preautorización).
- Enviando una transacción para recibir los fondos. Por ejemplo, una cuenta con Autorización para depositar puede finalizar un [Escrow](../payment-types/escrow.md) que fue iniciado por un desconocido.

Por defecto, las cuentas nuevas tienen DepositAuth desactivado y pueden recibir XRP de cualquiera.

## Trasfondo

Las regulaciones y licencias para servicios financieros pueden requerir a un negocio o entidad que deba conocer al remitente de todas las transacciones que recibe. Esto presenta un desafio en un sistema descentralizado como el XRP Ledger donde participantes son identificados con pseudónimos que son libremente generados y el comportamiento predeterminado es que cualquier dirección puede pagar a otra.

La marca (flag) de Deposit Authorization introduce una opción para aquellos que utilizan el XRP Ledger para cumplir con las regulaciones sin cambiar la naturaleza fundamental del ledger descentralizado. Con La Autorización para depositar activada, una cuenta solo puede recibir fondos explícitamente aprobados enviando una transacción. El dueño de la uenta utilizando Deposit Authorization puede realizar la diligencia necesaria para identificar al remitente de cualquier fondo _antes_ de enviar la transacción que cuasa que la cuenta reciba el dinero.

Cuando tienes la opción Deposit Authorization activada, puedes recibir dinero de [Checks](/resources/known-amendments.md#checks), [Escrow](../payment-types/escrow.md), y [Payment Channels](/resources/known-amendments.md#paychan). En esas transacciones de tipo "dos pasos", primero el origen manda una transacción para autorizar los fondos, después el destinatario manda una transacción que autoriza recibir esos fondos.

Para recibir dinero de [transacciones Payment][] cuando tienes la opción Deposit Authorization activada, debes [preautorizar](#preautorización) los remitentes de esos Payments. _(Añadido por la [enmienda DepositPreauth][].)_

## Uso recomendado

Para conseguir un efecto total de Deposit Authorization, Ripple recomienda además hacer lo siguiente:

- Siempre mantener un balance en XRP superior al mínimo del [requisito de reserva](reserves.md).
- Mantener la marca (flag) Default Ripple en su estado por defecto (desactivada). No actives [rippling](../tokens/fungible-tokens/rippling.md) en ninguna trust lines. Cuando envíes [transacciones TrustSet][], siempre utiliza el [flag `tfSetNoRipple`](../../references/protocol/transactions/types/trustset.md).
- No crees [Offers](../../references/protocol/transactions/types/offercreate.md). Es imposible conocer de antemano que ofertas coincidentes serán utilizadas para ejecutar dicha operación. <!-- STYLE_OVERRIDE: will -->

## Precisión en la semántica

Una cuenta con Deposit Authorization activado:

- **No puede** ser destinatario de [transacciones Payment][], con **las siguientes excepciones**:
    - Si el destinatario tiene [preautorizado](#preautorización) al remitente del pago. _(Añadido con la [enmienda DepositPreauth][])_
    - Si el balance XRP de la cuenta es igual o inferior al [requisito de reserva](reserves.md) de la cuenta, puede ser el destinatario de un pago XRP cuya cantidad `Amount` es igual o menor que el mínimo de reserva de la cuenta (actualmente 10 XRP). Esto es para prevenir a una cuenta de quedarse "atascada" no siendo posible enviar transacciones ni tampoco recibir XRP. La reserva de la cuenta del propietario no importa en este caso.
- Puede recibir XRP de [transacciones PaymentChannelClaim][] **únicamente en los siguientes casos**:
    - El remitente de la transacción PaymentChannelClaim es el destino del canal de pago (payment channel).
    - El destino de la transacción del PaymentChannelClaim tiene [preautorizado](#preautorización) al remitente del PaymentChannelClaim. _(Añadido en la [enmienda DepositPreauth][])_
- Puede recibir XRP de [transacciones EscrowFinish][] **únicamente en los siguientes casos**:
    - El remitente de una transacción EscrowFinish es el destino de un escrow.
    - El destino de una transacción EscrowFinish tiene [preautorizado](#preautorización) al remitente de un EscrowFinish. _(Añadido en la [enmienda DepositPreauth][])_
- **Puede** recibir XRP o tokens enviando una transacción [CheckCash][]. _(Añadido por la [enmienda Checks][].)_
- **Puede** recibir XRP o tokens enviando [transacciones OfferCreate][].
    - Si la cuenta envía una transacción OfferCreate que no está completamente ejecutada in mediatamente, **puede** recibir el resto del XRP o token solicitado después cuando la oferta sea consumida por otras transacciones [Payment][] y [OfferCreate][] de la cuenta.
- Si la cuenta ha creado cualquier línea de confianza (trust lines) sin la marca [No Ripple flag](../tokens/fungible-tokens/rippling.md) activada, o ha activado el flag Default Ripple y emitido una moneda, la cuenta **puede** recibir los tokens de esas trust lines en [transacciones Payment][] como resultado del rippling. No puede ser el destino de esas transacciones.
- En general, una cuenta en el XRP Ledger **no puede** recibir divisas no-XRP en el XRP Ledger mientras que lo siguiente sea cierto. (Esta regla no es específica del flag DepositAuth.)
    - La cuenta no ha creado trust lines con límites distintos a cero.
    - La cuenta no ha emitido tokens en trust lines creadas por otros.
    - La cuenta no ha generado ninguna oferta.

La siguiente tabla resume cuando un tipo de transacción puede depositar dinero con DepositAuth activado o desactivado:

{% partial file="/docs/_snippets/depositauth-semantics-table.md" /%}



## Activar o desactivar Deposit Authorization

Una cuenta puede activar la autorización de depositar enviando una [transacción AccountSet][] con el campo `SetFlag` con el valor de `asfDepositAuth` (9). La cuenta puede desactivar la autorización de depositar enviando una [transacción AccountSet][] con el campo `ClearFlag` con el valor de `asfDepositAuth` (9). Para más información sobre flags en AccountSet, consultar [AccountSet flags](../../references/protocol/transactions/types/accountset.md).

## Comprobar cuando una cuenta tiene DepositAuth activado

Para ver cuando una cuenta tiene Deposit Authorization activado, utiliza el [método account_info][] para mirar en la cuenta. Compara el valor de los campos `Flags` (en el objeto `result.account_data`) con los [bitwise flags definidos para un objeto de ledger AccountRoot ](../../references/protocol/ledger-data/ledger-entry-types/accountroot.md).

Si el resultado de los valores  bitwise `Flags` Y el valor del flag `lsfDepositAuth` (`0x01000000`) es distinto a cero, entonces la cuenta tiene el DepositAuth activado. Si el resultado es cero, entonces la cuenta tiene DepositAuth desactivado.

## Preautorización

_(Añadido por la [enmienda DepositPreauth][].)_

Las cuentas con DepositAuth activado pueden _preautorizar_ ciertos remitentes, para permitir pagos desde esos remitentes sean realizados aunque DepositAuth esté activado. Eseto permite a remitentes específicos enviar directamente fondos sin que el que vaya recibirlos tenga que tomar una acción para cada transacción individualmente. La preautorización no es obligatoria para usar DepositAuth, pero puede hacer ciertas opereaciones más sencillas.

La preautorización es agnóstica en cuanto a divisas. No puede preautorizar cuentas para solo una moneda específicamente.

Para preautorizar a un remitente en particular, envía una [transacción DepositPreauth][] con la dirección de otra cuenta para preautorizar en el campo `Authorize`. Para revocar la preautorización, facilita la dirección de la otra cuenta en el campo `Unauthorize`. Especifica tu propia dirección en el campo `Account` como de normal. Puedes preautorizar o desautorizar cuentas incluso si acutalmente no tienes activado DepositAuth; el estado preautorización que seleccionas para otras cuentas se guarda, pero no tiene efecto a no ser que actives DepositAuth. Una cuenta no puede preautorizarse a si misma. Las preautorizaciones son unidireccionales, y no tienen efecto en pagos que van en la otra dirección.

Preautorizar otra cuenta añade un [objeto DepositPreauth](../../references/protocol/ledger-data/ledger-entry-types/depositpreauth.md) al ledger, el cual incrementa la [reserva del propietario](reserves.md#owner-reserves) de la cuenta que provee la autorización. Su la cuenta revoca la preautorización, elimina el objeto y hace decrecer las reservas del propietario.

Una vez que la transacción DepositPreauth ha sido procesada, la cuenta autorizada puede enviar fondos a tu cuenta, incluso si tienes DepositAuth activado, usando cualquiera de los siguientes tipos de transacción:

- [Payment][]
- [EscrowFinish][]
- [PaymentChannelClaim][]

Las preautorización no tiene efecto sobre las otras formas de enviar dinero a una cuenta con DepositAuth activado. Ver [Precisión en la semántica](#precise-semantics) para las reglas exactas.

### Comprobar la autorización

Puedes utilizar el [método deposit_authorized][] para ver si una cuenta esta autorizada para despositar en otra cuenta. Este método comprueba dos cosas: <!-- STYLE_OVERRIDE: is authorized to -->

- Si la cuenta de destino requiere de Deposit Authorization. (Si no requiere de autorización, todas las cuentas de origen son consideradas autorizadas.)
- Si la cuenta de origen es preautorizada para enviar dinero al destino.


## Ver también

- La referencia [transación DepositPreauth][].
- El [tipo de objeto del ledger DepositPreauth](../../references/protocol/ledger-data/ledger-entry-types/depositpreauth.md).
- El [método deposit_authorized][] de la [API `rippled`](../../references/http-websocket-apis/index.md).
- La característica [Authorized Trust Lines](../tokens/fungible-tokens/authorized-trust-lines.md) (`RequireAuth` flag) limita que contrapartes pueden poseer divisas no-XRP en la cuenta.
- El flag `DisallowXRP` indica que una cuenta no puede recibir XRP. Es una protencción más suave que Deposit Authorization, y no la aplica el XRP Ledger. (Las aplicaciones cliente deberían respetar este flag o al menos avisar de ello.)
- El flag `RequireDest` indica que una cuenta solo puede recibir cantidades de divisas si se especifica un [Destination Tag](../transactions/source-and-destination-tags.md). Esto protege a usuarios de olvidar incluir el propósito del pago, pero no protege a los destinatarios de remitentes desconocidos que pueden añadir destination tags arbitrarios.
- [Pagos parciales](../payment-types/partial-payments.md) provee una forma para que cuentas puedan devolver pagos no deseados restando los [costes de transferencia](../tokens/transfer-fees.md) y los ratios de exchanges de la cantidad enviada en lugar de sumarlos a la cantidad enviada.
<!--{# TODO: Add link to "check for authorization" tutorial DOC-1684 #}-->


[enmienda DepositPreauth]: /resources/known-amendments.md#depositpreauth

{% raw-partial file="/docs/_snippets/common-links.md" /%}
