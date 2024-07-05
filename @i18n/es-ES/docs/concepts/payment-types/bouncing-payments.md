---
html: bouncing-payments.html
parent: payment-types.html
seo:
    description: Cuando el propósito de un pago no esté claro, devuélvelo al remitente.
labels:
  - Tokens
---
# Devolver pagos

Cuando una de tus direcciones recibe un pago cuyo propósito no está claro, te recomendamos que intentes devolver el dinero a su remitente. Si bien esto requiere más trabajo que quedarse con el dinero, demuestra buena fe hacia los clientes. Puedes hacer que un operador rechace los pagos manualmente o crear un sistema para hacerlo automáticamente.

El primer requisito para devolver pagos es [monitorizar de manera robusta los pagos entrantes](robustly-monitoring-for-payments.md). ¡No querrás devolver accidentalmente a un cliente más de lo que te ha enviado! (Esto es particularmente importante si tu proceso de devolución está automatizado.) Usuarios maliciosos pueden tomar ventaja de una integración inocente al enviar [pagos parciales](partial-payments.md#exploit-de-pagos-parciales).

En segundo lugar, deberías enviar los pagos devueltos como Pagos Parciales (partial payments). Dado que terceras partes pueden manipular el coste de los caminos entre direcciones, los Pagos Parciales te permiten desprenderte de la cantidad completa sin preocuparte por los tipos de cambio dentro del XRP Ledger. Deberías publicar tu política de devolución de pagos como parte de tus términos de uso. Envía el pago devuelto desde una dirección operacional o una dirección de reserva.

Para enviar un Pago Parcial, activa el [flag `tfPartialPayment`](../../references/protocol/transactions/types/payment.md#flags-de-pago) en la transacción. Introduce la cantidad en el campo `Amount` con la cantidad que recibiste y omite el campo `SendMax`. Deberías utilizar el valor `SourceTag` del pago entrante como el `DestinationTag` de tu pago de devolución.

Para prevenir que dos sistemas estén devolviendo pagos uno al otro indefinidamente, puedes establecer un nuevo Source Tag para el pago de devolución saliente. Si recibes un pago inesperado cuyo Destination Tag coincide con el Source Tag de una devolución que enviaste, no lo rechaces nuevamente.
