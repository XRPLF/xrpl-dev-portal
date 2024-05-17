---
html: tickets.html
parent: accounts.html
seo:
    description: Envía transacciones en un orden no secuencial.
labels:
  - Cuentas
  - Enviar transacciones
---
# Tickets

_(Añadido por la [enmienda TicketBatch][].)_

Un Ticket en el XRP Ledger es una forma de reservar un [número secuencia][Sequence Number] para una transacción que no se envía de inmediato. Los tickets permiten que transacciones sean enviadas fuera del orden de secuencia normal. Un caso de uso de esto es permitir [transacciones multi-signed](multi-signing.md) donde tomará un tiempo recolectar las firmas necesarias: mientras se recogen las firmas para una transacción que utiliza un Ticket, puedes enviar otras transacciones.

## Transfondo

Las [transacciones](../transactions/index.md) tienen números de secuencia para que una transacción determinada no pueda ejecutarse más que una vez. Los números de secuencia también se aseguran de que la transacción dada sea única: si envías la misma cantidad de dinero a la misma persona varias veces, el número de secuencia es un detalle que se garantiza que será diferente cada vez. Finalmente, los números de secuencia brindan una una forma felegante de ordenar las transacciones de forma consistente, incluso si algunas de ellas llegan desordenadas cuando se envían desordenadas a través de la red.

Sin embargo, hay situaciones donde los números de secuencia son demasiado limitantes. Por ejemplo:

- Dos o más usuarios comparten acceso a una cuenta, cada una con la habilidad de enviar transacciones independientemente. Si esos usuarios intentan enviar transacciones al mismo tiempo sin coordinarse primero, cada uno de ellos puede utilizar el mismo número de secuencia para diferentes transacciones, y sólo uno lo conseguirá.
- Puede que quieras preparar y firmar una transacción por adelantado, luego guardarla en algún sitio seguro para que se pueda ejecutar en algún momento del futuro si ciertos eventos ocurren. Sin embargo, si quieres continuar usando la cuenta de forma normal mientras tanto, no sabes que número de secuencia apartar para la transacción. <!-- STYLE_OVERRIDE: will -->
- Cuando [múltiples personas deben firmar una transacción](multi-signing.md) para hacerla válida, puede ser dificil planificar más de una transacción a la vez. Si numeras las transacciones con números de secuencia separados, no puedes enviar transacciones numeradas más tarde hasta que todo el mundo haya firmado las transacciones anteriores; pero si usas el mismo número de secuencia para cada transacción pendiente, solo una de ellas podrá ocurrir.

Los Tickets facilitan una solución para todos estos problemas apartando números de secuencia que se pueden uitlizar más adelante, fuera de su orden normal, pero aún así no más de una vez cada uno.


## Los tickets son números de secuencia reservados

Un Ticket es un registro de que se ha apartado un número de secuencia para utilizar más adelante. Una cuenta envía primero una [transacción TicketCreate][] para apartar una o más números de secuencia como Tickets; esto deja un registro en los [datos de estado del ledger](../ledgers/index.md), en la forma de un [objeto Ticket][], para cada número de secuencia reservado.

Los Tickets están numerados usando los números de secuencia que han sido apartado para crearlos. Por ejemplo, si un número de secuencia de cuenta actual es 101 y has creado 3 Tickets, esos Tickets tienen los números de secuencia de Ticket 102, 103, y 104. Haciendo esto se incrementa el número de secuencia de la cuenta a 105.

[{% inline-svg file="/docs/img/ticket-creation.svg" /%}](/docs/img/ticket-creation.svg "Diagrama: Creación de tres tickets")

Más tarde, puedes enviar una transacción utilizando un Ticket específico en vez de un número de secuencia; haciendo eso eliminas el Ticket correspondiente de los datos de estado del ledger y no cambia el número de secuencia normal de tu cuenta. También puedes todavía enviar transacciones utilizando el números de secuencia normal sin utilizar Tickets. Puedes utilizar cualquiera de tus Tickets disponibles en cualquier orden en cualquier momento, pero cada Ticket puede utilizarse solo una vez.

[{% inline-svg file="/docs/img/ticket-usage.svg" /%}](/docs/img/ticket-usage.svg "Diagrama: Usando el ticket 103.")

Continuando con el ejemplo anterior, puedes enviar una transacción utilizando el número de secuencia 105 o cualquiera de los tres Tickets que has creado. Si envías una transacción utilizando el Ticket 103, esto eliminará el Ticket 103 del ledger. Tu próxima transacción despues de esa puede uitlizar el número de secuencia 105, el Ticket 102, o el Ticket 104.

**Atención:** Cada Ticket cuenta como un objeto separado para la [reserva de propietario](reserves.md), así que debes apartar 2 XRP por cada Ticket. (El XRP vuelve a estar disponible una vez que se haya utilizado el Ticket.) Este coste puede subir rápidamente si creas un grán número de Tickets a la vez.

Como con los números de secuencia, enviar una transacción consume el Ticket _si y solo si_ la transacción es confirmada por [consenso](../consensus-protocol/index.md). Sin embargo, las transacciones que fallan en hacer lo que intentaban pueden ser confirmadas por el consenso con los [códigos de resultado de clase`tec`](../../references/protocol/transactions/transaction-results/tec-codes.md).

Para conocer qué Tickets tiene una cuenta disponibles, utiliza los [métodos account_objects][].

## Limitaciones

Cualquier cuenta puede crear y utilizar Tickets en cualquier tipo de transacciones. Sin embargo, puede haber algunas restricciones:

- Cada Ticket puede ser utilizado solo una vez. Es posible tener múltiples transacciones diferentes candidatas que podrían usar el mismo Ticket Secuencia, pero solo uno de esos candidatos será validado por el consenso.
- Una cuenta no puede tener más de 250 Tickets en el ledger a la vez. No puedes crear más de 250 Tickets a la vez, tampoco.
- _Puedes_ usar un Ticket para crear más Tickets. Si lo haces, el Ticket utilizado no cuenta para el número total de Tickets que puedes tener a la vez.
- Cada Ticket cuenta para la [reserva de propietario](reserves.md), por lo que debes apartar 2 XRP por cada Ticket que no has usado todavía. El XRP vuelve a estar disponible para ti despues de utilizar el Ticket.
- Dentro de un ledger individual, las transacciones que usan Tickets se ejecutan después que otras transacciones desde el mismo remitente. Si una cuenta tiene múltiples transacciones utilizando Tickets en la misma versión del ledger, esos Tickets se ejecutan en orden desde el Ticket con la secuencia más baja hasta la más alta. (Para más información, ver la documentación del [orden canónico](../consensus-protocol/consensus-structure.md#calculate-and-share-validations) del consenso.)
- Para "cancelar" un Ticket, usa el Ticket para [realizar una operación no operativa](../transactions/finality-of-results/canceling-a-transaction.md) [transacción AccountSet][]. Esto elimina el Ticket y tu no tienes que cumplir con los requisitos de reserva.

## Ver también


- **Conceptos:**
    - [Multi-Signing](multi-signing.md)
- **Tutoriales:**
    - [Usar Tickets](../../tutorials/how-tos/manage-account-settings/use-tickets.md)
- **Referencias:**
    - [Transacción TicketCreate][]
    - [Campos comunes de una transacción](../../references/protocol/transactions/common-fields.md)
    - [Objeto Ticket](../../references/protocol/ledger-data/ledger-entry-types/ticket.md)
    - [Método account_objects ][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
