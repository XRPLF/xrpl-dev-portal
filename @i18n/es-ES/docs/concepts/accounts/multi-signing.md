---
html: multi-signing.html
parent: accounts.html
seo:
    description: Utiliza la firma múltiple para mayor seguridad enviando transacciones.
labels:
  - Smart Contracts
  - Seguridad
---
# Multi-Signing

La firma múltiple o multi-signing en el XRP Ledger es un método para [autorizar transacciones](../transactions/index.md#authorizing-transactions) para el XRP Ledger usando una combinación de múltiples claves secretas. Puedes tener cualquier combinación de métodos de autorización activados para tu dirección, incluido el multi-signing, un [par de claves maestras](cryptographic-keys.md#par-de-claves-maestras), y un [par de claves normales](cryptographic-keys.md#par-de-claves-normales). (El único requisito es que _al menos un_ método debe estar activado.)

Los beneficios del multi-signing incluyen:

- Puedes requerir claves de distintos dispositivos, por lo que un actor malicioso deberá comprometer múltiples dispositivos para enviar transacciones en tu nombre.
- Puedes compartir la custodia de una cuenta entre varias personas, cada una de las cuales tiene una de las varias claves necesarias para enviar transacciones desde esa dirección.
- Puedes delegar el poder de enviar transacciones desde una dirección a un grupo de personas, puedes controlar tu dirección si no estás disponible o no puedes firmar normalmente.

## Las listas de firmantes

Antes de poder hacer multi-sign, debes crear una lista de direcciones que pueden firmar por ti.

La [transacción SignerListSet][] define una _lista de firmantes_, un conjunto de direcciones que pueden autorizar una transacción desde tu dirección. Puedes incluir de 1 a 32 direcciones en la lista de firmantes. La lista no puede incluir tu dirección y no se puede duplicar las entradas. Puedes controlar cuantas firmas son necesarias, en que combinaciones, utilizando las opciones _Signer Weight_ (Peso de firmante) y _Quorum_ en la lista.

_(Actualizado por la [enmienda ExpandedSignerList][].)_

### Peso del firmante

Asignas un peso a cada firmantes de la lista. El peso representa la autoridad del firmante relativa a otros firmantes de la lista. Mientras más alto el valor, más autoridad. Los pesos individuales no pueden exceder 2<sup>16</sup>-1.

### Cuórum

El valor cuórum de una lista es una peso mínimo total requerido para autorizar la transacción. El cuórum debe ser mayor a 0 pero menor o igual a la suma de los valores de los pesos en la lista de firmantes: lo que significa, que debe ser posible conseguir un cuórum con los pesos de firmante dados.

### Localizador de cartera
<!-- STYLE_OVERRIDE: wallet -->

También puedes añadir hasta 256 bits de datos arbitrarios para cada entrada por firmante de la lista. Estos datos no son necessarios o usados por la red, pero pueden ser utilizados por smart contracts u otras aplicaciones para identificar o confirmar otros datos sobre los firmantes.

_(Añadido en la [enmienda ExpandedSignerList][].)_


### Ejemplos uitilzando Signer Weight y Quorum

Los pesos y el cuórum te permiten establecer un nivel apropiado de supervisión para cada transacción, en función de la confianza relativa y la autoridad relegada a los responsables que administran la cuenta.

Para un caso de uso de una cuenta compartida, deberías crear una lista con un cuórum de 1, luego dar a todos los participantes un peso de 1. Una sola aprobación de uno de los participantes es necesario para aprobar una transacción.

Para una cuenta muy importante, puedes configurar un cuórum de 3, con 3 partiicpantes que tienen un peso de 1. Todos los participantes deben estar de acuerdo y aprobar su transacción.

Otra cuenta también podría tener un cuórum de 3. Asignas a tu CEO un peso de 3, 3 vicepresidentes un peso de 2 a cada uno, y 3 directores un peso de 1 a cada uno. Para aprobar una transacción en esta cuenta se requiere la aprobación de los 3 directores (peso total de 3), 1 vicepresidente y 1 director (peso total de 3), 2 vicepresidentes (peso total de 4), o del CEO (peso total de 3). <!-- STYLE_OVERRIDE: vice -->

En cada uno de los tres ejemplos anteriores, deshabilitarías la clave maestra sin configurar la clave normal, así la única forma de [autorizar transactiones](../transactions/index.md#authorizing-transactions) es el multi-signing.

Podría darse el caso donde crees una lista de multi firma como "plan de respaldo". El dueño de la cuenta normalmente usa la clave normal para sus transacciones (no una clave multi-signing). Por seguridad, el propietario añade una lista de firmantes que contiene a 3 amigos, los tres con un peso de 1, y un cuórum de 3. Si el propietario de la cuenta perdiese la clave privada, puede pedir a sus amigos que multi firmen una transacción para reemplazar la clave normal.


## Mandar transacciones Multi-Signed

Para enviar transacciones multi-signed de forma satisfactoria, debes de hacer todo lo siguiente:

* La dirección que envía la transacción (especificada en el campo `Account`) debe tener un [objeto `SignerList` en el ledger ](../../references/protocol/ledger-data/ledger-entry-types/signerlist.md). Para instrucciones de cómo hacer esto, ver [Set Up Multi-Signing](../../tutorials/how-tos/manage-account-settings/set-up-multi-signing.md).
* La transacción debe incluir el campo `SigningPubKey` como un valor vacío.
* La transacción debe incluir el [campo `Signers`](../../references/protocol/transactions/common-fields.md#signers-field) conteniendo un array de firmas.
* Las firmas presentadas en el array `Signers` debe coincidir con los firmantes definidos en la `SignerList`.
* Para las firmas presentadas, el peso total asociado con esos firmantes debe ser igual o mayor al cuórum de la `SignerList`.
* El [coste de transacción](../transactions/transaction-cost.md) (especificado en el campo `Fee`) debe ser al menos (N+1) veces el coste de una transacción normal, donde N es el número de firmas presentadas.
* Todos los campos de la transacción deben ser definidos antes de recolectar las firmas. No puedes [auto-rellenar](../../references/protocol/transactions/common-fields.md#auto-fillable-fields) los campos.
* Si se presenta en forma binaria, el array de `Signers` debe estar ordenado en base al valor números de las direcciones de los firmantes, con el valor menor, primero . (Si se envía como JSON, el [método submit_multisigned][] se ocupa de ello automáticamente.)

## Ver también

- **Tutoriales:**
    - [Configurar Multi-Signing](../../tutorials/how-tos/manage-account-settings/set-up-multi-signing.md)
    - [Envíar una transacción Multi-Signed](../../tutorials/how-tos/manage-account-settings/send-a-multi-signed-transaction.md)
- **Conceptos:**
    - [Claves criptográficas](cryptographic-keys.md)
    - [Coste de transacción especial para transacciones Multi-signed](../transactions/transaction-cost.md#special-transaction-costs)
- **Referencias:**
    - [Transacción SignerListSet][]
    - [Objeto SignerList](../../references/protocol/ledger-data/ledger-entry-types/signerlist.md)
    - [método sign_for][]
    - [método submit_multisigned][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
