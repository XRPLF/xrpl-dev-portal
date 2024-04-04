---
html: account-types.html
parent: accounts.html
seo:
    description: Los negocios que envían transacciones en el XRP Ledger automáticamente, deben configurar direcciones separadas para diferentes propósitos para minimizar el riesgo.
labels:
  - Tokens
  - Seguridad
---
# Tipos de cuenta

{% partial file="/docs/_snippets/issuing-and-operational-addresses-intro.md" /%}


## Ciclo de vida de los fondos

Cuando un emisor de tokens sigue esta separacion de roles, los fondos tienden a fluir en direcciones específicas, como se muetra en el siguiente diagrama:

[{% inline-svg file="/docs/img/issued-currency-funds-flow.svg" /%}](/docs/img/issued-currency-funds-flow.svg "Diagrama: Los fondos fluyen desde la dirección emisora hasta las direcciones de reserva, a direcciones operacionales, hacia las direcciones de clientes y socios, y finalmente de regreso a la dirección emisora.")

La dirección emisora crea tokens enviando pagos a direcciones de reserva. Esos tokens tienen un valor negativo desde la perspectiva de la dirección emisora, ya que (a menudo) representan obligaciones. Los mismos tokens tienen valor positivo desde la otras perspectivas, incluyendo desde la perspectiva de las direcciones de reserva.

Las direcciones de reserva, que son operadas por personas reales, envían esos tokens a direcciones operacionales. Este paso permite que la dirección emisora sea utilizada lo menos posible después de este punto, mientras tienen al menos algunos tokens disponibles en espera.

Las direcciones operacionales, las cuales son operadas por sistemas automatizados, envían pagos a otras contrapartes, como proveedores de liquidez, socios y otros clientes. Esas contrapartes pueden enviar fondos libremente entre ellas varias veces.

Como siempre, los pagos con tokens deben moverse a través de líneas de confianza (trust lines) del emisor.

Eventualmente, alguien envía tokens de vuelta al emisor. Esto destruye esos tokens, reduciendo las obligaciones del emisor con el XRP Ledger. Si el token es una stablecoin, esto es el primer paso para canjear los tokens por los activos correspondientes fuera del ledger.


## Dirección emisora

La dirección emisora es como una caja fuerte. Los socios, clientes y direcciones operacionales crean, líneas de confianza (trust lines) a la dirección emisora, pero esta dirección envía la menor cantidad de transacciones posibles. Periodícamente, un operador humano crea y firma una transacción desde la dirección emisora para recargar los balances de una dirección operacional o de reserva. Idealmente, la clave secreta utilizada para firmar esas transacciones nunca debería ser accesible desde ningun equipo conectado a Internet.

A diferencia de una caja fuerte, la dirección emisora puede recibir pagos directamente de clientes o socios. Como todas las transacciones en el XRP Ledger son públicas, los sistemas automatizados pueden observar los pagos a la dirección emisora sin necseisdad de una clave secreta.

### Dirección emisora comprometida

Si un actor malicioso descubre la clave secreta de la dirección emisora de una institución, ese actor puede crear nuevos tokens y enviarlos a usuarios o intercambiarlos en el exchange descentralizado. Esto puede hacer hacer a un emisor de stablecoin insolvente. Puede resultar dificil para la institución financiera distinguir los tokens obtenidos legítimanente y canjearlos de manera justa. Si una institución pierde el control de la dirección emisora, la institución debe crear una nueva dirección emisora, y todos los usuarios que tenían una trust line a la dirección emisora antigua, deben crear un nueva trust line a la nueva dirección.

### Múltiples direcciones de emisión

Una institución financiera puede emitir más de un token en el XRP Ledger desde una única dirección de emisión. Sin embargo, hay algunas configuraciones que se aplican por igual a todos los tokens (fungibles) emitidos desde una dirección, incluido el porcentaje de [comisiones de transferencia](../tokens/transfer-fees.md) y el estado [congelación global](../tokens/fungible-tokens/freezes.md). Si la intitución financiera quiere la flexibilidad de manejar las configuraciones de distinta manera para cada token, la institución debe tener múltiples direcciones emisoras.


## Direcciones operacionales

Una dirección operacional es como una caja registradora. Realiza pagos en nombre de la institución para transferir tokens a clientes y socios. Para firmar transacciones automáticamente, la clave secreta para una dirección operacional debe ser alacenada en un servidor que está conectado a Internet. (La clave secreta puede estar almacenada encriptada, pero el servidor debe desencriptarla para firmar las transacciones.) Clientes y socios no crean ni deben crear trust lines a direcciones operacionales.

Cada dirección operacional tiene un balance limitado de tokens y XRP. Cuando el balance de una dirección operacional disminuye, la institución financiera la recarga enviando un pago desde la dirección emisora o desde la dirección de reserva.

### Direciones operacionales comprometidas

Si un actor malicioso descubre la clave secreta detrás de una dirección operacional, la institución financiera sólo puede perder tanto como esa dirección operacional contiene. La institución puede cambiar a una nueva dirección operacional sin que los clientes y socios tengan que realizar ninguna acción.


## Direcciones de reserva

Otro paso opcional que una institución puede equilibrar el riesgo y la convivencia es utilizada como "direcciones de reserva"  como paso intermedio entre la dirección emisora y las direcciones operativas. La institución puede financiar direcciones XRP Ledger adicionales como direcciones de reserva, cuyas claves no están disponibles para los servidores siempre en línea, sino que confian a diferentes usuarios confiables.

Cuando una dirección operacional se está quedando sin fondos (ya sea tokens o XRP), un usuario confiable pueed utilizar su dirección de reserva para recargar el balance de una dirección operacional. Cuando una dirección de reserva se queda sin fondos, la institución puede usar la dirección emisora para enviar más fondos a la dirección de reserva en una sola transacción, y la dirección de reserva puede distribuir esos fondos entre sí si es necesario. Esto mejora la seguridad de la dirección emisora, permitíendole hacer menos transacciones, sin dejar demasiado dinero en un único sistema automatizado.

Como con las direcciones operacionales, una direccion de reserva debe tener una relación contable con la dirección emisora, y no con los clientes o socios. Todas las precauciones que aplican a las direcciones operacionales también aplican a las direcciones de reserva.

### Dirección de reserva comprometida

Si una dirección de reserva se ve comprometida, las consecuencias son similares a las de una dirección operacional. Un actor malintencionado puede robar cualquier saldo que posea la dirección de reserva, y la institución financiera puede cambiar a una nueva dirección de reserva sin que los clientes y socios realicen ninguna acción.


## Ver también

- **Conceptos:**
    - [Cuentas](index.md)
    - [Claves criptográficas](cryptographic-keys.md)
- **Tutoriales:**
    - [Asignar par de claves regulares](../../tutorials/how-tos/manage-account-settings/assign-a-regular-key-pair.md)
    - [Cambiar o eliminar par de claves regulares](../../tutorials/how-tos/manage-account-settings/change-or-remove-a-regular-key-pair.md)
- **Referencias:**
    - [metodo account_info][]
    - [Transacción SetRegularKey][]
    - [Objeto AccountRoot](../../references/protocol/ledger-data/ledger-entry-types/accountroot.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
