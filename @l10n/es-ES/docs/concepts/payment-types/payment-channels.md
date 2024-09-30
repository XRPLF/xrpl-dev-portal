---
html: payment-channels.html
parent: payment-types.html
seo:
    description: Los canales de pago que activan pagos XRP asíncronos rápidos que pueden dividirse en incrementos muy pequeños y liquidarse más después.
labels:
  - Canales de pago
  - Smart Contracts
---
# Canales de pago

Los Canales de Pago son una función avanzada para enviar pagos de XRP "asíncronos" que pueden dividirse en incrementos muy pequeños y liquidarse más tarde.

El XRP para un canal de pago se reserva temporalmente. El remitente crea reclamaciones o _Claims_ contra el canal, que el destinatario verifica sin enviar una transacción al XRP Ledger o esperar a que se apruebe una nueva versión del ledger por [consenso](../consensus-protocol/index.md). (Este es un proceso _asíncrono_ porque ocurre separado del patrón habitual de obtener transacciones aprobadas por consenso). En cualquier momento, el destinatario puede _canjear_ una reclamación (Claim) para recibir una cantidad de XRP autorizada por esa _Claim_. Liquidar una _Claim_ de esta manera utiliza una transacción estándar del XRP Ledger, como parte del proceso de consenso habitual. Esta única transacción puede abarcar cualquier cantidad de transacciones garantizadas por _Claims_ más pequeñas.

Debido a que las reclamaciones pueden verificarse individualmente pero liquidarse en bloque más adelante, los canales de pago hacen posible realizar transacciones a una velocidad limitada solo por la capacidad de los participantes para crear y verificar las firmas digitales de esas Reclamaciones. Este límite se basa principalmente en la velocidad del hardware de los participantes y la complejidad de los algoritmos de firma. Para obtener la máxima velocidad, utiliza firmas Ed25519, que son más rápidas que las firmas ECDSA secp256k1 predeterminadas del XRP Ledger. La investigación ha [demostrado la capacidad de crear más de 100.000 firmas Ed25519 por segundo y verificar más de 70.000 por segundo](https://ed25519.cr.yp.to/ed25519-20110926.pdf) en hardware estándar en 2011.


## ¿Por qué usar canales de pago?

El proceso de usar un canal de pago siempre implica dos partes, un pagador y un beneficiario. El pagador es una persona o institución que utiliza el XRP Ledger y es cliente del beneficiario. El beneficiario es una persona o empresa que recibe XRP como pago por bienes o servicios.

Los Canales de Pago no especifican intrínsecamente nada sobre lo que puedes comprar y vender con ellos. Sin embargo, los tipos de bienes y servicios que son adecuados para los canales de pago son:

- Cosas que pueden transmitirse casi instantaneamente, como artículos digitales
- Cosas baratas, donde el coste de procesar una transacción es una parte no trivial del precio
- Cosas que normalmente se compran en bloque, donde la cantidad exacta deseada no se conoce de antemano


## Ciclo de vida de un canal de pago

El siguiente diagrama resume el ciclo de vida de un canal de pago:

[{% inline-svg file="/docs/img/paychan-flow.svg" /%}](/docs/img/paychan-flow.svg "Diagrama de flujo de un canal de pago")


## Ver también

- **Conceptos relacionados:**
    - [Escrow](escrow.md), una función similar para pagos XRP condicionales de mayor valor y menor velocidad.
- **Tutoriales y casos de uso:**
    - [Utilizar canales de pago](../../tutorials/how-tos/use-specialized-payment-types/use-payment-channels/index.md), un tutorial que guía a través del proceso de utilizar un canal de pago.
    - [Abrir un canal de pago para activar una red de intercambio](../../tutorials/how-tos/use-specialized-payment-types/use-payment-channels/open-a-payment-channel-to-enable-an-inter-exchange-network.md)
- **Referencias:**
    - [Método channel_authorize][]
    - [Método channel_verify][]
    - [Objeto PayChannel](../../references/protocol/ledger-data/ledger-entry-types/paychannel.md)
    - [Transacción PaymentChannelClaim][]
    - [Transacción PaymentChannelCreate][]
    - [Transacción PaymentChannelFund][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
