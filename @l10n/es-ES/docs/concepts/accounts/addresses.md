---
html: addresses.html
parent: accounts.html
seo:
    description: Las direcciones identifican de manera única las cuentas del XRP Ledger, utilizando el formato base58.
labels:
  - Cuentas
---
# Direcciones

{% partial file="/docs/_snippets/data_types/address.md" /%}

Cualquier dirección válida puede [convertirse en una cuenta en el XRP Ledger](index.md#creacion-de-cuentas) al recibir fondos. Puedes utilizar una cuenta que no ha recibido fondos para representar una [clave normal, regular key en inglés](cryptographic-keys.md) o ser miembro de una [lista de firmantes](multi-signing.md). Solo una cuenta que ha recibido fondos puede ser el remitente de una transacción.

Crear una dirección válida es una tarea estríctamente matemática que empieza con el par de claves. Puedes generar un par de claves y calcular su dirección completamente offline sin comunicarte con el XRP Ledger o con cualquier otra entidad. La conversión desde una clave pública a una dirección implica una función hash unidireccional, por lo que es posible confirmar que esa clave pública coincide con una dirección pero es imposible derivar la clave pública únicamente a partir de la dirección. (Esta es parte de la razón por la que las transacciones firmadas incluyen la clave pública _y_ la dirección del remitente.)


## Direcciones especiales

Algunas direcciones tienen un significado especial, o usos históricos, en el XRP Ledger. En muchos casos, se tratan de direcciones "black hole" o agujero negro, lo que significa que la dirección no se deriva de una clave secreta conocida. Como es efectivamente imposible adivinar una clave secreta a partir de una sola dirección, cualquier XRP que posean direcciones black hole estarán perdidos para siempre.


| Dirección                     | Nombre | Significado | ¿Black Hole? |
|-------------------------------|--------|-------------|--------------|
| `rrrrrrrrrrrrrrrrrrrrrhoLvTp` | ACCOUNT\_ZERO | Una dirección que es la codificación en [base58][] en el XRP Ledger del valor `0`. En comunicaciones peer-to-peer, `rippled` utiliza esta dirección como el emisor de XRP. | Sí |
| `rrrrrrrrrrrrrrrrrrrrBZbvji`  | ACCOUNT\_ONE | Una dirección que es la codificación en [base58][] en el XRP Ledger del valor `1`. En el ledger, las [entradas RippleState](../../references/protocol/ledger-data/ledger-entry-types/ripplestate.md) utilizan esta dirección como marcador de posición para el emisor de un balance de una trust line. | Sí |
| `rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh` | La cuenta génesis | Cuando `rippled` inicia un nuevo ledger génesis desde el principio (por ejemplo, en modo solitario), esta cuenta contiene todo el XRP. Esta cuenta es generada con el valor semilla `masterpassphrase` el cual está [hard-coded](https://github.com/XRPLF/rippled/blob/94ed5b3a53077d815ad0dd65d490c8d37a147361/src/ripple/app/ledger/Ledger.cpp#L184). | No |
| `rrrrrrrrrrrrrrrrrNAMEtxvNvQ` | black hole de reserva de nombre de Ripple | En el pasado, Ripple pedía a los usuarios enviar XRP a esta cuenta para reservar nombres Ripple.| Sí |
| `rrrrrrrrrrrrrrrrrrrn5RM1rHd` | Dirección NaN | Versiones previas de [ripple-lib](https://github.com/XRPLF/xrpl.js) generaban esta dirección cuando se codificaba el valor [NaN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN) utilizan el formato de codificación [base58][] del XRP Ledger. | Sí |


## Codificación de una dirección

**Consejo:** ¡Estos detalles técnicos son solo relevantse para personas que crean librerias de software de bajo nivel para la compatibilidad con el XRP Ledger!

[[Fuente]](https://github.com/XRPLF/rippled/blob/35fa20a110e3d43ffc1e9e664fc9017b6f2747ae/src/ripple/protocol/impl/AccountID.cpp#L109-L140 "Fuente")

Las direcciones XRP Ledger están codificadas utilizando [base58][] con el _diccionario_ `rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz`. Como el XRP Ledger codifica varios tipos de claves con base58, antepone los datos codificados con un-byte de "prefijo de tipo" (también conocido como "prefijo de versión") para distinguirlos. El prefijo de tipo hace que las direcciones normalmente comiencen con diferentes letras en formato base58.

El siguiente diagrama muestra la relación entre las claves y las direcciones:

[{% inline-svg file="/docs/img/address-encoding.svg" /%}](/docs/img/address-encoding.svg "Clave pública maestra + Prefijo Tipo →  ID de cuenta + Checksum → Dirección")

La fórmula para calcular direcciones XRP Ledger desde una clave pública es la siguiente. Para ver el código de ejemplo completo, consulta [`encode_address.js`](https://github.com/XRPLF/xrpl-dev-portal/blob/master/content/_code-samples/address_encoding/js/encode_address.js). Para el proceso de derivar la clave pública desde una passphrase a un valor semilla, consulta [Derivación de clave](cryptographic-keys.md#key-derivation).

1. Importa los algoritmos necesarios: SHA-256, RIPEMD160, y base58. Configura el diccionario para base58.

        ```
        'use strict';
        const assert = require('assert');
        const crypto = require('crypto');
        const R_B58_DICT = 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz';
        const base58 = require('base-x')(R_B58_DICT);

        assert(crypto.getHashes().includes('sha256'));
        assert(crypto.getHashes().includes('ripemd160'));
        ```

2. Empieza con una clave pública 33-byte ECDSA secp256k1, o una clave pública 32-byte Ed25519. Para claves Ed25519, prefija la clave con el byte `0xED`.

        ```
        const pubkey_hex =
          'ED9434799226374926EDA3B54B1B461B4ABF7237962EAE18528FEA67595397FA32';
        const pubkey = Buffer.from(pubkey_hex, 'hex');
        assert(pubkey.length == 33);
        ```

3. Calcula el hash [RIPEMD160](https://en.wikipedia.org/wiki/RIPEMD) del hash SHA-256 de la clave pùblica. Este valor es el ID de cuenta o "Account ID".

        ```
        const pubkey_inner_hash = crypto.createHash('sha256').update(pubkey);
        const pubkey_outer_hash = crypto.createHash('ripemd160');
        pubkey_outer_hash.update(pubkey_inner_hash.digest());
        const account_id = pubkey_outer_hash.digest();
        ```

4. Calcula el hash SHA-256 hash del hash SHA-256 del Account ID; toma los 4 primeros bytes. Este valor es el "checksum".

        ```
        const address_type_prefix = Buffer.from([0x00]);
        const payload = Buffer.concat([address_type_prefix, account_id]);
        const chksum_hash1 = crypto.createHash('sha256').update(payload).digest();
        const chksum_hash2 = crypto.createHash('sha256').update(chksum_hash1).digest();
        const checksum =  chksum_hash2.slice(0,4);
        ```

5. Concatena el payload y el checksum. Calcula el valor base58 del buffer concatenado. El resultado es la dirección.

        ```
        const dataToEncode = Buffer.concat([payload, checksum]);
        const address = base58.encode(dataToEncode);
        console.log(address);
        // rDTXLQ7ZKZVKz33zJbHjgVShjsBnqMBhmN
        ```

{% raw-partial file="/docs/_snippets/common-links.md" /%}
