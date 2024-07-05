---
html: checks.html
parent: payment-types.html
seo:
    description: Los cheques permiten a los usuarios a crear pagos diferidos que pueden ser cancelados o cobrados por los destinatarios deliberados.
labels:
  - Cheques
  - Pagos
  - Tokens
---
# Cheques


La función de Cheques permite a los usuarios crear pagos aplazados similares a cheques en papel. A diferencia de un depósito en garantía (escrow) o canal de pago (payment channel), los fondos no se reservan cuando se crea un cheque, por lo que el dinero solo se mueve cuando se cobra el cheque. Si el remitente no tiene los fondos en el momento en que se cobra un cheque, la transacción falla; los destinatarios pueden intentar nuevamente las transacciones fallidas hasta que el cheque expire.

Los Cheques del XRP Ledger pueden tener tiempos de vencimiento después de los cuales ya no pueden ser cobrados. Si el destinatario no cobra con éxito el Cheque antes de que expire, el Cheque ya no se podrá cobrar, pero el objeto permanece en el XRP Ledger hasta que alguien lo cancele. Cualquiera puede cancelar el Cheque después de que expire. Solo el remitente y el destinatario pueden cancelar el Cheque antes de que expire. El objeto del Cheque se elimina del ledger cuando el remitente cobra con éxito el cheque o alguien lo cancela.

## Casos de uso

- Los Cheques permiten a las personas intercambiar fondos utilizando un proceso familiar y aceptado por la industria bancaria.

- Si tu destinatario previsto utiliza autorización de deposito, [Deposit Authorization](../accounts/depositauth.md) para bloquear pagos directos de extraños, un cheque es una buena alternativa.

- Cobros de cheques flexibles. El destnatario puede canjear el Cheque entre un nínimo y un máximo.


## Ciclo de vida de un cheque

1. El remitente envía una [transacción CheckCreate][], que define:
    - El destinatario.
    - Una fecha de caducidad.
    - La cantidad máxima que se puede cargar de su cuenta.

2. Cuando una transacción es procesada, el XRP Ledger crea un objeto `Check`. El cheque puede ser cancelado por el destinatario o el remitente con una  [transacción CheckCancel][].

3. El destinatario envía una [transacción CheckCash][] que transfiere los fondos y destruye el objeto `Check`. Los destinatarios tienen dos opciones para cobrar los cheques:
    -  Cantidad exacta: Se especifica la cantidad exacta de dinero a cobrar que no puede exceder el máximo del cheque.
    - Cantidad flexible: Se especifica una cantidad mínima para cobrar y el XRP Ledger manda tanto como sea posible hasta el máximo del cheque. Si el remitente no tiene fondos para cumplir al menos el mínimo específicado, la transacción falla.

4. Si el cheque vence antes de que el destinatario lo cobre, el objeto `Check` permanece hasta que alguien lo cancele.



## Ver también

Para más información sobre Cheques en el XRP Ledger, ver:

- [Referencia transacción](../../references/protocol/transactions/types/index.md)
    - [CheckCreate][]
    - [CheckCash][]
    - [CheckCancel][]
- [Tutoriales de cheques](../../tutorials/how-tos/use-specialized-payment-types/use-checks/use-checks.md)
    - [Enviar un cheque](../../tutorials/how-tos/use-specialized-payment-types/use-checks/send-a-check.md)
    - [Buscar cheques por dirección del remitente](../../tutorials/how-tos/use-specialized-payment-types/use-checks/look-up-checks-by-sender.md)
    - [Buscar cheques por dirección del destinatario](../../tutorials/how-tos/use-specialized-payment-types/use-checks/look-up-checks-by-recipient.md)
    - [Canjear un cheque por la cantidad exacta](../../tutorials/how-tos/use-specialized-payment-types/use-checks/cash-a-check-for-an-exact-amount.md)
    - [Canjear un cheque por una cantidad flexible](../../tutorials/how-tos/use-specialized-payment-types/use-checks/cash-a-check-for-a-flexible-amount.md)
    - [Cancelar un cheque](../../tutorials/how-tos/use-specialized-payment-types/use-checks/cancel-a-check.md)
- [Enmienda Cheques][]

Para más información sobre funciones relacionadas, ver:

* [Autorización de deposito](../accounts/depositauth.md)
* [Escrow](escrow.md)
* [Tutorial de canales de pago](../../tutorials/how-tos/use-specialized-payment-types/use-payment-channels/index.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
