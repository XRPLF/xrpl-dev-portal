---
html: robustly-monitoring-for-payments.html
parent: payment-types.html
seo:
    description: Recomendaciones para monitorizar pagos entrantes de una variedad e posibles irregularidades.
labels:
  - Tokens
---
# Monitoreo robusto de pagos

Para verificar robustamente los pagos entrantes, los emisores deberían hacer lo siguiente:

* Mantener un registro de la transacción y el ledger más recientemente procesados. De esta manera, si pierdes temporalmente la conectividad, sabrás hasta dónde retroceder.
* Verificar el código de resultado de cada pago entrante. Algunos pagos ingresan al ledger para cobrar una tarifa contra el spam, incluso si fallan. Solo las transacciones con el código de resultado `tesSUCCESS` pueden cambiar saldos que no sean de XRP. Solo las transacciones de un ledger validado son definitivas.
* Mirar los [pagos parciales](partial-payments.md). Los pagos con el flag de pago parcial activado pueden ser condierados "exitosos" si se entrega cualquier cantidad distinta a cero, incluso cantidades minúsculas.
    * Comprobar la transacción en busca del [campo `delivered_amount`](partial-payments.md#el-campo-delivered_amount). Si está presente, el campo indica cuanto dinero _realmente_ se envió a la dirección `Destination`.
    * En xrpl.js, puedes usar el [método `xrpl.getBalanceChanges()`](https://js.xrpl.org/modules.html#getBalanceChanges) para ver cuánto recibió cada dirección. En algunos casos, esto puede dividirse en varias partes en diferentes líneas de confianza (trustlines).
* Algunas transacciones cambian tus balances sin ser pagos directos hacia o desde una de tus direcciones.

Para simplificar las cosas para tus clientes, te recomendamos aceptar pagos tanto en tu dirección operacional como en tus direcciones de emisoras.

Como precaución adicional, te recomendamos comparar los balances de tus direcciones emisoras con los fondos de garantía en tu sistema de contabilidad interna en cada nueva versión del ledger del XRP Ledger. Los saldos negativos de la dirección emisora deben coincidir con los activos que has asignado al XRP Ledger fuera de la red. Si ambos no coinciden, deberías suspender el procesamiento de pagos hacia y desde el XRP Ledger hasta que hayas resuelto la discrepancia.

* Utiliza el método `gateway_balances` para comprobar tus balances.
* Si tienes un coste de transferencia (transfer fee) establecido, entonces tus obligaciones dentro del XRP Ledger disminuyen ligeramente cada vez que otras direcciones del XRP Ledger transfieran tus tokens entre sí.

Para más detalles en cómo se leen los detalles de transacciones entrantes, visita [Buscar resultados de transacciones](../transactions/finality-of-results/look-up-transaction-results.md).
