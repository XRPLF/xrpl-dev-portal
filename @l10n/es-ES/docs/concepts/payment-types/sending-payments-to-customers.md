---
html: sending-payments-to-customers.html
parent: payment-types.html
seo:
    description: Construye los pagos con cuidado para frustrar a los actores maliciosos.
labels:
  - Tokens
---
# Enviar pagos a clientes

Cuando construyes un sistema automatizado para enviar pagos al XRP Ledger para tus clientes, debes asegurarte de que construyes los pagos cuidadosamente. Los actores maliciosos están constantemente tratando de encontrar formas de engañar a un sistema para que les pague más dinero del que debería.

Generalmente, al enviar stablecoins, utilizas una [transacción Payment][]. Algunos detalles son diferentes dependiendo de si estás emitiendo tokens por primera vez o transfiriéndolos desde una cartera activa a un cliente. Cosas a tener en cuenta incluyen:

- Siempre especifica tu dirección emisora como el emisor del token. De lo contrario, podrías usar accidentalmente rutas (paths) que entreguen la misma divisa emitida por otras direcciones.
- Antes de enviar un pago al XRP Ledger, comprueba el coste del pago. Un pago desde tu dirección operacional a un cliente no debe costar más que la cantidad de destino más cualquier coste de transferencia que hayas establecido.
- Cuando emites nuevos tokens desde tu dirección emisora, debes omitir el campo `SendMax`. De lo contrario, los usuarios malintencionados pueden configurar sus ajustes para que emitas la cantidad completa de `SendMax` en lugar de solo la `Amount` de destino prevista.
- Cuando envías tokens _desde una cartera caliente_, debes especificar `SendMax` si tienes un coste de transferencia distinto de cero. En este caso, establece el campo `SendMax` en la cantidad especificada en el campo `Amount` más el coste de transferencia. (Puede que desees redondear ligeramente hacia arriba, en caso de que la precisión de tus cálculos no coincida exactamente con la del XRP Ledger). Por ejemplo, si envías una transacción cuyo campo `Amount` especifica 99.47 USD, y tu coste de transferencia es del 0.25%, deberías establecer el campo `SendMax` en 124.3375, o 124.34 USD si redondeas hacia arriba.
- Omitir el campo `Paths`. Este campo es innecesario cuando se envía directamente desde el emisor, o desde una cartera caliente siempre y cuando los tokens que se envían y los que se reciben tengan el mismo código de divisa y emisor, es decir, sean la misma stablecoin. El campo `Paths` está destinado a [Pagos entre divisas](cross-currency-payments.md) y a pagos multi-salto (rippling) más largos. Si realizas una búsqueda de rutas (paths) de manera ingenua y adjuntas las rutas a tu transacción, tu pago puede tomar un camino indirecto más costoso en lugar de fallar si el camino directo no está disponible; los usuarios malintencionados incluso pueden configurar esto.
- Si recibes un código de resultado `tecPATH_DRY`, esto suele indicar que el cliente no tiene configurada la línea de confianza (trustline) necesaria, o que los ajustes de rippling de tu emisor no están configurados correctamente.

Para un tutorial detallado sobre cómo emitir un token en el XRP Ledger, ya sea una stablecoin u otro tipo, visita [Emitir un token fungible](../../tutorials/how-tos/use-tokens/issue-a-fungible-token.md).

{% raw-partial file="/docs/_snippets/common-links.md" /%}
