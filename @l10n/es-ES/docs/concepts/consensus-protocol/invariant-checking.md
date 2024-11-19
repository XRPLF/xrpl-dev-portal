---
html: invariant-checking.html
parent: consensus.html
seo:
    description: Entender qué es la verificación invariantes, por qué existe, cómo funciona, y qué comprobaciones de invariantes están activas.
labels:
  - Blockchain
  - Seguridad
---
# Comprobación de invariantes

La comprobación de invariantes es una característica de seguridad del XRP Ledger. Consiste en un conjunto de comprobaciones, separadas del procesamiento normal de transacciones, que garantiza que ciertas _invariantes_ se mantienen ciertas en todas las transacciones.

Como muchas características de seguridad, todos esperamos que la comprobación de invariantes nunca necesite hacer nada. Sin embargo, puede ser útil entender las invariantes del XRP Ledger porque definen los límites estrictos del procesamiento de transacciones en el XRP Ledger, y reconocer el problema en el improbable caso que una transacción falle porque ha violado una comprobación de invariantes.

Las invariantes no deberían activarse, pero aseguran la integridad del XRP Ledger contra errores aún por descubrir o incluso creados.


## Por qué existe

- El código fuente del XRP Ledger es complejo y extenso; hay un potencial alto de que el código se ejecute incorrectamente.
- El coste de la ejecutar incorrectamente una transacción es alto y no es aceptable bajo ningún estándar.

Específicamente, la ejecución de transacciones incorrectas podría crear datos inválidos o corruptos que luego hagan que servidores en la red fallen consistentemente en un estado "imposible" que pudiese detener toda la red.

El procesamiento de transacciones incorrectas socavaría el valor de confianza en el XRP Ledger. Las comprobación de invariantes proporciona valor a todo el XRP Ledger porque agrega la característica de confiabilidad.



## Cómo funciona

El comprobador de invariantes es una segunda capa de código que se ejecuta automáticamente en tiempo real después de cada transacción. Antes de que los resultados de la transacción se confirmen en el ledger, el comprobador de invariantes examina esos cambios en busca de corrección. Si los resultados de la transacción rompieran una de las reglas estrictas del XRP Ledger, el comprobador de invariantes rechazará la transacción. Las transacciones que son rechazadas de esta manera tienen el código de resultado `tecINVARIANT_FAILED` y se incluyen en el ledger sin efectos.

Para incluir la transacción en el ledger con un código de clase `tec`, es necesario realizar algún procesamiento mínimo. Si este procesamiento mínimo aún rompe un invariante, la transacción falla con el código `tefINVARIANT_FAILED` en su lugar, y no se incluye en el ledger en absoluto.


## Invariantes activas

El XRP Ledger comprueba todas las siguientes invariantes en cada transación:

[[Fuente]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L92 "Fuente")

- [Comprobación de coste de transacción](#comprobación-de-coste-de-transacción)

[[Fuente]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L118 "Fuente")

- [XRP no creado](#xrp-no-creado)

[[Fuente]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L146 "Fuente")

- [Account Roots no eliminadas](#account-roots-no-eliminadas)

[[Fuente]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L173 "Fuente")

- [Comprobaciones de balance XRP](#comprobaciones-de-balance-XRP)

[[Fuente]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L197 "Fuente")

- [Coincidencia de tipos de entradas ledger](#coincidencia-de-tipos-de-entradas-de-ledger)

[[Fuente]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L224 "Fuente")

- [No XRP Trust Lines](#no-xrp-trust-lines)

[[Fuente]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L251 "Fuente")

- [No malas ofertas](#no-malas-ofertas)

[[Fuente]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L275 "Fuente")

- [No escrow cero](#no-escrow-cero)

[[Fuente]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L300 "Fuente")

- [Nueva Account Root válida](#nueva-account-root-válida)


### Comprobación de coste de transacción

- **Condicion(es) invariantes:**
    - La cantidad de [coste de transacción](../transactions/transaction-cost.md) nunca debe ser negativa, ni tampoco más grande que la especificada en el coste de la transacción.


### XRP no creado

- **Condicion(es) invariantes:**
    - Una transacción no debe crear XRP y solo debería destruir el XRP del [coste de transacción](../transactions/transaction-cost.md).


### Account Roots no eliminadas

- **Condicion(es) invariantes:**
    - Una [cuenta](../accounts/index.md) no puede ser eliminada del ledger excepto por una [transacción AccountDelete][].
    - Una transacción AccountDelete exitosa siempre borra exactamente 1 cuenta.


### Comprobaciones de balance XRP

- **Condicion(es) invariantes:**
    - El balance de XRP de una cuenta debe ser de tipo XRP, y no puede ser menor a 0 o más de 100 mil millones XRP exactamente.


### Coincidencia de tipos de entrada de ledger

- **Condicion(es) invariantes:**
    - Las entradas de los ledgers modificados deberían coincidir en tipo y las entradas añadidas deben ser de un [tipo válido](../../references/protocol/ledger-data/ledger-entry-types/index.md).


### No XRP Trust Lines

- **Condicion(es) invariantes:**
    - [Trust lines](../tokens/fungible-tokens/index.md) o líneas de confianza utilizando XRP no están permitidas.


### No malas ofertas

- **Condicion(es) invariantes:**
    - Las [ofertas](../../references/protocol/ledger-data/ledger-entry-types/offer.md) deben ser de cantidades no negativas y no pueden ser de XRP para XRP.


### No escrow cero

- **Condicion(es) invariantes:**
    - Una entrada [escrow](../../references/protocol/ledger-data/ledger-entry-types/escrow.md) debe contener más de 0 XRP y menos que 100 mil millones de XRP.


### Nueva Account Root válida

- **Condicion(es) invariantes:**
    - Una nueva [account root](../../references/protocol/ledger-data/ledger-entry-types/accountroot.md) debe ser la consecuencia de un pago.
    - Una nueva account root debe tener la correcta [secuencia](../../references/protocol/data-types/basic-data-types.md#account-sequence) de inicio.
    - Una transacción no debe crear más de una nueva [cuenta](../accounts/index.md).

### ValidNFTokenPage

- **Condicion(es) invariantes:**
    - El número de NFTs acuñados o quemados solo puede ser cambiado por transacciones `NFTokenMint` o `NFTokenBurn`.
    - Una transacción NFTokenMint exitosa debe incrementar el número de NFTs.
    - Una transacción NFTokenMint fallida no puede cambiar el número de NFTs acuñados.
    - Una transacción NFTokenMint no puede cambiar el número de NFTs quemados.
    - Una transacción NFTokenBurn debe incrementar el número de NFTs quemados.
    - Una transacción NFTokenBurn no debe cambiar el número de NFTs quemados.
    - Una transacción NFTokenBurn no puede cambiar el número de NFTs acuñados.

### NFTokenCountTracking

- **Condicion(es) invariantes:**
    - La página está correctamente asociada al dueño.
    - La página está correctamente ordenada entre el siguiente y el anterior enlace.
    - La página contiene un número válido de NFTs.
    - Los NFTs en esta página no pertenecen a una página anterior o posterior.
    - Los NFTs están correctamente ordenados en la página.
    - Cada URI, si está presente, no está vacío.

## Ver también

- **Blog:**
    - [Protegiendo el ledger: Comprobación de invariantes](https://xrpl.org/blog/2017/invariant-checking.html)

- **Repositorio:**
    - [Invariant Check.h](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h)
    - [Invariant Check.cpp](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.cpp)
    - [Parámetros del sistema](https://github.com/XRPLF/rippled/blob/develop/src/ripple/protocol/SystemParameters.h#L43)
    - [Cantidad XRP](https://github.com/XRPLF/rippled/blob/develop/src/ripple/basics/XRPAmount.h#L244)
    - [Formatos de ledger](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/protocol/LedgerFormats.h#L36-L94)


- **Otros:**
    - [Trust Lines autorizadas](../tokens/fungible-tokens/authorized-trust-lines.md)
    - [Calculando cambios de balance para una transacción](https://xrpl.org/blog/2015/calculating-balance-changes-for-a-transaction.html#calculating-balance-changes-for-a-transaction)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
