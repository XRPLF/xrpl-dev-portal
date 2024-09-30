---
html: direct-xrp-payments.html
parent: payment-types.html
seo:
    title: Pagos directos en XRP
    description: Los pagos directos en XRP son la forma más rápida y sencilla de enviar valor en el XRP Ledger. Conoce ahora los conceptos básicos del ciclo de vida de pago directo en XRP.
labels:
  - XRP
  - Pagos
---
# Pagos directos en XRP

La base de cualquier sistema financiero es la transferencia de valor. El método más rápido y sencillo en el XRP Ledger es un pago directo en XRP de una cuenta a otra. A diferencia de otros métodos de pago que requieren múltiples transacciones para completarse, un pago directo en XRP se ejecuta en una sola transacción sin intermediarios, y típicamente se completa en 8 segundos o menos. Solo puedes hacer pagos directos cuando XRP es la moneda enviada y recibida.



## Ciclo de vida de pagos XRP directos

1. El remitente crea una [transacción Payment][], que define los parámetros del pago. La transacción es un pago directo en XRP si XRP es la divisa enviada y recibida.

2. El procesamiento de la transacción verifica los parámetros y circunstancias de la transacción; si la comprobación falla, el pago falla.

    - Todos los campos están formateados correctamente.
    - La dirección de envío es una cuenta activada en el XRP Ledger.
    - Todas las firmas proporcionadas son válidas para la dirección de envío.
    - La dirección de destino es diferente que la dirección de envío.
    - El remitente tiene suficiente XRP en balance para enviar el pago.

2. El procesamiento del pago comprueba la dirección de destino; si alguna comprobación falla, el pago falla.

    - Si la dirección de recepción está activada, el motor hace comprobaciones adicionales basados en sus configuraciones, como la autorización de depósito o [Deposit Authorization](../accounts/depositauth.md).
    - Si la dirección de recepción no está activada, comprueba si el pago enviará suficiente XRP para cumplir con el mínimo del requisito de la [reserva de cuenta](../accounts/reserves.md). Si la reserva se cumple, una nueva cuenta es creada para la dirección y el balance inicial es la cantidad recibida.

4. El ledger quita y acredita a las correspondientes cuentas.
    
    **Nota:** Al remitente también se le carga el [coste de transacción](../transactions/transaction-cost.md) en XRP.
    

## Ver también

- **Tutoriales:**
    - [Enviar XRP (Tutorial interactivo)](../../tutorials/how-tos/send-xrp.md)
    - [Monitorizar pagos entrantes con WebSocket](../../tutorials/http-websocket-apis/build-apps/monitor-incoming-payments-with-websocket.md)
- **Referencias:**
    - [Transacción Payment][]
    - [Resultados de Transaction](../../references/protocol/transactions/transaction-results/index.md)
    - [método account_info][] - para comprobar balances en XRP

{% raw-partial file="/docs/_snippets/common-links.md" /%}
