---
html: reserves.html
parent: accounts.html
seo:
    description: Las cuentas XRP Ledger exigen una reserva de XRP para reducir el spam en la información del ledger.
labels:
  - Comisiones
  - Cuentas
top_nav_grouping: Páginas populares
---
# Reservas

El XRP Ledger aplica un _requisito de reserva_, en XRP, para proteger el ledger global compartido de crecer excesivamente como resultado del spam o del uso malicioso. El objetivo es limitar el crecimiento del ledger para coincida con las mejoras tecnológicas de tal forma que un equipo basico actual pueda siempre tener el ledger actual en RAM.

Para tener una cuenta, una dirección debe tener una cantidad mínima de XRP en el ledger global compartido. Para financiar una nueva dirección, debes recibir el suficiente XRP en la dirección para coincidir con el requisito de reserva. No puedes enviar el XRP reservado a otros, pero puedes recuperar parte del XRP si [eliminas la cuenta](deleting-accounts.md).

El requisito de reserva cambia de tanto en tanto debido al proceso de [Votación de fees](../consensus-protocol/fee-voting.md), donde los validadores pueden estar de acuerdo con nuevas configuraciones de reservas.

## Reserva base y reserva de propietario

Los requisito de reserva consta de dos partes:

* La **reserva base** es la cantidad mínima de XRP que es necesaria para cada dirección en el ledger.
* La **reserva de propietario** es un incremento del requisito de reserva por cada objeto que la dirección posee en el ledger. El coste por artículo se le conoce como _reserva incremental_.

Los requerimientos de reserva actuales en Mainnet son:

- Reserva base: **10 XRP**
- Reserva de propietario: **2 XRP** por artículo

Reservas en otras redes pueden variar.

## Reservas de propietario

Muchos objetos en el ledger (entradas en el ledger) pertenecen a una cuenta en particular. Normalmente, el propietario es una cuenta que ha creado el objeto. Cada objeto aumenta el requisito de reserva total en la reserva de propietario. Cuando los objetos son eliminados del ledger, ya no cuentan para el requisito de reserva.

Los objetos que cuentan para el requisito de de reserva de su propietario son: [Cheques](../payment-types/checks.md), [Preatutorizaciones para depositar](depositauth.md#preauthorization), [Escrows](../payment-types/escrow.md), [Ofertas NFT](../tokens/nfts/trading.md), [Páginas NFT](../tokens/nfts/index.md), [Ofertas](../../references/protocol/ledger-data/ledger-entry-types/offer.md), [Canales de pago](../payment-types/payment-channels.md), [Listas de firmantes](multi-signing.md), [Tickets](tickets.md), y [Trust Lines](../tokens/fungible-tokens/index.md).

Algunos casos especiales:

- Non-Fungible Tokens (NFTs) están agrupados en páginas que contienen hasta 32 NFTs en cada una, y la reserva de propietario aplica por página más que por NFT. Debido al mecanismo para dividir y combinar páginas, la cantidad de NFTs almacenados por página puede variar. Ver también: [Reserva para objetos NFTokenPage](../../references/protocol/ledger-data/ledger-entry-types/nftokenpage.md#nftokenpage-reserve).
- Trust lines (entradas `RippleState`) son compartidas entre dos cuentas. La reserva del propietario puede aplicar a una o ambas. La mayoría de veces, el poseedor del token debe una reserva y el emisor no. Ver también: [RippleState: Contribuyendo a las reservas de propietario](../../references/protocol/ledger-data/ledger-entry-types/ripplestate.md#contributing-to-the-owner-reserve).
- Listas de firmantes creadas antes de la [enmienda MultiSignReserve][] activada en abril de 2019 cuentacon múltiples objetos. Ver también: [Listas de firmantes y reservas](../../references/protocol/ledger-data/ledger-entry-types/signerlist.md#signer-lists-and-reserves).
- Un [Directorio de propietario](../../references/protocol/ledger-data/ledger-entry-types/directorynode.md) es una entrada del ledger que lista todos los objetos relacionados a una cuenta, incluyendo toods los objetos que la cuenta posee. Sin embargo, el directorio del propietario en sí no cuenta para la reserva.

### Buscando las reservas

Las aplicaciones pueden buscar los valores de las reservas base e incremental actuales utilizando el [método server_info][] o el [método server_state][]:

| Método                  | Unidades             | Campo de reserva base               | Campo de reserva incremental       |
|-------------------------|----------------------|-------------------------------------|------------------------------------|
| [método server_info][]  | Decimal XRP          | `validated_ledger.reserve_base_xrp` | `validated_ledger.reserve_inc_xrp` |
| [método server_state][] | Drops enteros de XRP | `validated_ledger.reserve_base`     | `validated_ledger.reserve_inc`     |

Para determinar las reservas de propietario de una cuenta, hay que multiplicar la reserva incremental por el número de objetos que la cuenta posee. Para mirar el número de objetos que una cuenta posee, llama al [método account_info][] y toma `account_data.OwnerCount`.

Para calcular el requisito total de direcciones, multiplica `OwnerCount` por `reserve_inc_xrp`, y luego suma `reserve_base_xrp`. [Aquí tienes una demostración](../../tutorials/python/build-apps/build-a-desktop-wallet-in-python.md#codeblock-17) del cálculo en Python.


## Quedarse por debajo del requisito de reserva

Durante el procesamiento de transacciones, el [coste de transacción](../transactions/transaction-cost.md) destruye parte del XRP del saldo de la dirección que envía la transacción. Esto puede causar que una dirección XRP se quede por debajo del requisito de reserva. Puedes incluso destruir _todo_ tu XRP de esta forma.

Cuando tu cuenta posee menos XRP XRP que el requisito actual de reserva, no puedes enviar XRP a otros, o crear nuevos objetos que incremente el requisito de reserva de la cuenta. Aun así, la cuenta continua existiendo en el ledger y puedes enviar transacciones que no hagan esas cosas, siempre que tengas suficiente XRP para pagar el coste de transacción. Puedes volver a superar el requisito de reserva recibiendo suficiente XRP, o si el requisito de reserva decrece debajo de la cantidad que tiene.

**Consejo:** Si tu dirección está debajo del requisito de reserva, puedes enviar unas [transacciones OfferCreate][] para aadquirir más XRP y volver a superar el requisito de reeerva. Sin embargo, dado que no puedes crear una [entrada en el ledger Offer](../../references/protocol/ledger-data/ledger-entry-types/offer.md) cuando estás por debajo de la reserva, esta transacción puede consumir solo Offers que ya esté en el libro de ordenes.


## Cambiar los requisitos de reserva

El XRP Ledger tiene un mecanismo para ajustar los requisitos de reserva. Estos ajustes pueden considerar, por ejemplo, cambios a largo plazo del valor de XRP, mejoras en la capacidad del hardware de los equipos convencionales, o una eficiencia incrementada en la implementación del software del servidor. Cualquier cambio tiene que ser aprobado por un proceso de consenso. Ver [Votación de fee](../consensus-protocol/fee-voting.md) para más información.

## Ver también

- [método account_objects][]
- [Objeto AccountRoot][]
- [Votación de Fee](../consensus-protocol/fee-voting.md)
- [Pseudo-transacción SetFee][]
- [Tutorial: Calcular y mostrar los requisitos de reserva (Python)](../../tutorials/python/build-apps/build-a-desktop-wallet-in-python.md#3-display-an-account)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
