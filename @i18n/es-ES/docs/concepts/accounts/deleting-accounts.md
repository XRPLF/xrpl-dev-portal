---
html: deleting-accounts.html
parent: accounts.html
blurb: Acerca de eliminar una cuenta XRP Ledger.
labels:
  - Cuentas
---
# Eliminar Cuentas

El dueño de una cuenta puede enviar una [transacción AccountDelete][] para eliminar la cuenta y las entradas relativas del ledger, enviando la mayoría del XRP en balance restante a otra cuenta. Para evitar la creación y eliminación de cuentas sin sentido, eliminar una cuenta requiere quemar una cantidad superior a la usual utilizada como [coste de transacción](../transactions/transaction-cost.md).

Algún tipo de entradas asociadas al ledger bloquean a una cuenta de ser eliminada. Por ejemplo, el emisor de un token fungible no puede ser borrad mientras cualquiera teng un saldo distinto a cero de ese token como balance.

Una vez una cuenta ha sido eliminada, puede ser recreada en el eldger a través de un método normal de [creación de cuentas](index.md#creating-accounts). Una cuenta que ha sido eliminada y re-creada no es diferente de una cuenta que ha sido creada por primera vez.

## Requisitos

Para ser eliminada, una cuenta debe cumplir los siguientes requisitos:

- El número de `Sequence` de la cuenta más 256 debe ser menor que el [Índice del ledger][] actual.
- La cuenta no debe estar enlazada a de los siguientes tipos de [entradas del ledger](../../references/protocol/ledger-data/ledger-entry-types/index.md) (como remitente o destinatario):
    - `Escrow`
    - `PayChannel`
    - `RippleState`
    - `Check`
- La cuenta debe tener menos de 1000 objetos en el ledger.
- La transacción debe pagar un [coste de transacción][] especial igual al menos a la [reserva de propietario](reserves.md) de un artículo (actualmente 2 XRP).

## Coste de eliminación

**Atención:** El coste de transacción de la [transacción AccountDelete][] siempre aplica cuando la transacción está incluida en un ledger validado, incluso si la transacción falla porque la cuenta no reune los requisitos para ser eliminada. Para reducir las posibilidades de pagar un coste de transacción alto si la cuenta no puede ser eliminada, utiliza la opción `fail_hard` cuando envíes una transacción AccountDelete.

A diferencia de Bitcoin y muchas otras criptomonedas, cada nueva versión de la cadena del ledger público de XRP Ledger contiene el estado completo del ledger, lo cual incrementa en tamaño con cada cuenta nueva. Por esa razón, no deberías crear nuevas cuentas XRP Ledger si no tienes necesidad. Puedes recuperar parte de los 10 XRP de la cuenta [reserva](reserves.md) eliminado la cuenta, pero destruirás por lo menos 2 XRP haciéndolo.

Instituciones que reciben y envían valor en nombre de muchos usuarios pueden utilizar [**Source Tags** y **Destination Tags**](../transactions/source-and-destination-tags.md) para distinguir pagos desde y para sus clientes usando una (o un puñado) de cuentas en el XRP Ledger.

<!--{# common link defs #}-->
{% raw-partial file="/docs/_snippets/common-links.md" /%}
