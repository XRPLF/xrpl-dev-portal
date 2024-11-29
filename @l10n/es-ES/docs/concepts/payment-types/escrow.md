---
html: escrow.html
parent: payment-types.html
seo:
    description: El Escrow retiene fondos hasta que las condiciones específicas se cumplan.
labels:
  - Escrow
---
# Escrow

Tradicionalmente, un escrow es un contrato entre dos partes para facilitar transacciones financieras. Un tercero imparcial recibe y retiene los fondos, y solo los libera al destinatario previsto cuando se cumplen las condiciones especificadas en el contrato. Este método asegura que ambas partes cumplan con sus obligaciones.

El XRP Ledger lleva el escrow un paso más allá, reemplazando al tercero con un sistema automatizado integrado en el ledger. Un escrow bloquea el XRP, que no puede ser utilizado o destruido hasta que se cumplan las condiciones.

## Tipos de escrow

El XRP Ledger soporta tres tipos de escrow:

- **Escrow basado en el tiempo:** Los fondos solo están disponibles después de que haya pasado cierta cantidad de tiempo.
- **Escrow condicional:** Este escrow se crea con una condición correspondiente y un cumplimiento. La condición sirve como un bloqueo en los fondos y no se liberará hasta que se proporcione la clave de cumplimiento correcta.
- **Escrow combinado:** Este escrow combina las características de un escrow basado en el tiempo y uno condicional. El escrow es completamente inaccesible hasta que pase el tiempo especificado, después de lo cual los fondos pueden ser liberados proporcionando el cumplimiento correcto.

## Ciclo de vida de un escrow

1. El remitente crea un escrow utilizando la transacción `EscrowCreate`. Esta transacción define:

    - Una cantidad de XRP para bloquear.
    - Las condiciones para liberar el XRP.
    - El destinatario del XRP.

2. Cuando se procesa la transacción, el XRP Ledger crea un objeto `Escrow` que retiene el XRP en el escrow.

3. El destinatario envía una transacción `EscrowFinish` para entregar el XRP. Si las condiciones se han cumplido, esto destruye el objeto `Escrow` y entrega el XRP al destinatario.

    **Nota:** Si el escrow tiene una fecha de caducidad y no se completa con éxito antes de este tiempo, el escrow se caduca. Un escrow caducado permanece en el ledger hasta que una transacción `EscrowCancel` lo cancele, destruyendo el objeto `Escrow` y devuelve el XRP al remitente.

## Estados del escrow

El siguiente diagrama muestra los estados por los que puede pasar un escrow:

[![El diagrama de estados muestra al escrow pasar desde  Retenido → Preparado/Condicionalmente preparado → Caducado](/docs/img/escrow-states.png)](/docs/img/escrow-states.png)

El diagrama muestra tres casos diferentes para tres posibles combinaciones de los escrows de tiempo "terminar trás" (campo `FinishAfter`), cripto-condición (campo `Condition`), y tiempo de caducidad (campo `CancelAfter`):

- **Escrow basado en el tiempo (izquierda):** Con solo un tiempo de finalización, el escrow se crea en el estado **Retenido**. Después de que haya pasado un tiempo especificado, se convierte en **Preparado** y cualquiera puede finalizarlo. Si el escrow tiene una fecha de caducidad y nadie finaliza el escrow antes de que el tiempo pase, entonces el escrow pasa a estar **Caducado**. En el estado de caducado, un escrow no puede finalizarse, y cualquiera puede cancelarlo. Si el escrow no tiene un campo `CancelAfter`, nunca caduca y nunca puede cancelarse.

- **Escrow combinado (centro):** Si el escrow especifica tanto como una criptocondición (campo `Condition`) _y_ una fecha "terminar tras" (campo `FinishAfter`), el escrow es **Retenido** hasta que la fecha "terminar-tras" ha pasado. Luego se convierte en **Condicionalmente preparado**, y puede finalizarlo si se suministra el cumplimiento correcto de la criptocondición. Si el escrow tiene una fecha de caducidad (campo `CancelAfter`), y nadie lo completa antes de que pase ese tiempo, entonces el escrow se convierte en **Caducado**. En el estado de caducado, un escrow no se puede finalizar, y cualquiera puede cancelarlo. Si el escrow no tiene un campo `CancelAfter`, nunca caducará y no podrá ser cancelado.

- **Escrow condicional (derecha):** Si el escrow especifica una criptocondición (campo `Condition`) y no por una fecha "terminar trás", el escrow se convierte en **Condicionalmente preparado** inmediatamente cuando se crea. Durante este tiempo, cualquiera puede finalizar el escrow, pero solo si suministran el cumplimiento correcto a la criptocondición. Si nadie finaliza el escrow antes de la fecha de caducidad (campo `CancelAfter`), el escrow se convierte en **Caducado**. (Un escrow sin una fecha de "finalizar-tras" _debe_ tener una fecha de caducidad.) En el estado de caducado, el escrow no puede ser finalizado, y cualquiera puede cancelarlo.


## Limitaciones

- El escrow solo funciona con XRP, no con tokens.
- Los costes pueden hacerlo poco práctico para cantidades pequeñas.
    - El escrow requiere de dos transacciones: una para crear el escrow, y una para finalizarlo o cancelarlo. Las criptocondiciones incurren en un [coste de transacción](../transactions/transaction-cost.md) mayor al usual.
    - Mientras que el escrow no se completa, el remitente es responsable del [requisito de reserva](../accounts/reserves.md) del objeto del `Escrow`.
- No puedes crear un escrow con valores de fechas pasados.
- Las liberaciones y caducidad se resuelven en [tiempos de cierre de ledgers](../ledgers/ledger-close-times.md). En la práctica, los tiempos de liberaciones o caducidad pueden variar en 5 segundos respecto a los cierres de ledgers.
- El único tipo de criptocondición aceptado es PREIMAGE-SHA-256.


## Coste de la transacción EscrowFinish

Cuando uses criptocondiciones, la transacción EscrowFinish debe pagar un [mayor coste de transacción](../transactions/transaction-cost.md#special-transaction-costs) por la carga de procesamiento involucrada en la verificación de la criptocondición introducida.

El coste de transacción adicional requerido es proporcional al tamaño de la condición introducida. Si la transacción es multi-firma o [multi-signed](../accounts/multi-signing.md), el coste de la multi-firma es añadido al coste de la introducción de la condición.

Actualmente, un EscrowFinish con introducción requiere un mínimo de coste de transacción de **330 [drops de XRP](../../references/protocol/data-types/basic-data-types.md#specifying-currency-amounts) más 10 drops por cada 16 bytes del tamaño de la introducción**.

**Nota:** La fórmula de arriba está basada en la asunción de que el coste de referencia de la transacción es 10 drops de XRP.

Si el [coste de votar](../consensus-protocol/fee-voting.md) cambia el valor de `reference_fee`, la fórmula escala basado en el nuevo coste de referencia. La fórmula general de una transacción EscrowFinish con un crypto-cumplimiento es como sigue:

```
reference_fee * (signer_count + 33 + (fulfillment_bytes / 16))
```



## Ver también

Para más información sobre Escrow en el XRP Ledger, consulta lo siguiente:

- [Tutoriales Escrow](../../tutorials/how-tos/use-specialized-payment-types/use-escrows/index.md)
- [Referencia de transacciones](../../references/protocol/transactions/index.md)
    - [Transacción EscrowCreate][]
    - [Transacción EscrowFinish][]
    - [Transacción EscrowCancel][]
- [Referencia Ledger](../../references/protocol/ledger-data/index.md)
    - [Objeto Escrow](../../references/protocol/ledger-data/ledger-entry-types/escrow.md)


Para más información sobre el bloqueo de 55 mil millones de Ripple, consulta [Ripple's Insights Blog](https://ripple.com/insights/ripple-to-place-55-billion-xrp-in-escrow-to-ensure-certainty-into-total-xrp-supply/).

{% raw-partial file="/docs/_snippets/common-links.md" /%}
