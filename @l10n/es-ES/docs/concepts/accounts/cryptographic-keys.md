---
html: cryptographic-keys.html
parent: accounts.html
seo:
    description: Utiliza las claves criptográficas para aprobar transacciones para que el XRP Ledger pueda ejecutarlas.
labels:
  - Smart Contracts
  - Seguridad
---
# Claves criptográficas

En el XRP Ledger, una firma digital _autoriza_ a una [transacción](../transactions/index.md) a hacer un grupo específico de acciones. Solo las transacciones firmadas pueden ser enviadas a la red y ser incluidas en un ledger validado.

Para realizar una firma digital, utilizas un par de claves criptográficas asociadas con la cuenta de envío de la transacción. Un par de claves se puede generar utilizando cualquiera de los [algoritmos de firma criptorgráfica](#algoritmos-de-firma) soportados por el XRP Ledger. Un par de claves puede ser utilizado como [par de claves maestras](#par-de-claves-maestras), [par de claves normales](#par-de-claves-normales) o un miembro de una [lista de firmantes](multi-signing.md), sin importar qué algoritmo se ha utilizado para generarlo.

**Atención:** Es importante mantener una seguridad adecuada sobre tus claves criptográficas. Las firmas digitales son la única forma de autorizar transacciones en el XRP Ledger, y no hay administrador privilegiado que pueda deshacer o revertir cualquier transacción tras haber sido aplicadas. Si alguien más conoce la semilla o la clave privada de tu cuenta del XRP Ledger, esa persona puede crear firmas digitales para autorizar cualquier transacción al igual que tú.

## Generación de claves

Muchas [librerías de cliente](../../references/client-libraries.md) y aplicaciones pueden generar un par de claves adecuadas para usar con el XRP Ledger. Sin embargo, solo deberías utilizar los pares de claves que fueron generados en dispositivos y software en los que confías. Las aplicaciones comprometidas pueden exponer tu secreto a usuarios maliciosos que pueden enviar transacciones desde tu cuenta luego.


## Componentes de clave

Un par de claves criptográficas es una **clave privada** y una **clave pública** que están conectadas matemáticamente a través de un proceso de derivación de claves. Cada clave es un número; la clave privada debería elegirse usando una fuente de aleatoriedad fuerte. El [algoritmo de firma criptográfica](#algoritmos-de-firma) define el proceso de derivación de claves y establece restricciones en los números que pueden ser claves criptográficas.

Al tratar con el XRP Ledger, también puedes utilizar algunos valores relacionados como passphrase, semilla, ID de cuenta, y dirección.

[{% inline-svg file="/docs/img/cryptographic-keys.svg" /%}](/docs/img/cryptographic-keys.svg "Diagrama: Passphrase → Semilla → Clave privada → Clave pública → ID de cuenta ←→ Dirección")
_Figura: Una vista simplificada de la relación entre los valores de clave criptográfica._

La passphrase, semilla, y la clave privada son **secretos**: si conoces alguno de estos valores para una cuenta, puedes generar firmas válidas y tienes el control total sobre la cuenta. Si tienes una cuenta, se **muy cuidadoso** con la información secreta de tu cuenta. Si no tienes estos secretos, no puedes usar tu cuenta. Si alguien más tiene acceso a ellos, puede tener el control de tu cuenta.

La clave pública, el ID de cuenta, y dirección son información pública. Puede haber situaciones en las que puedes conservar la clave pública para ti mismo, pero en algún momento necesites publicarla como parte de una transacción para que el XRP Ledger pueda verificar la firma y el proceso de la transacción.

Para más detalles técnicos y como la derivación de clave funciona, ver [Derivación de claves](#derivación-de-claves).

### Passphrase

Puedes, opcionalmente, usar una passphrase u algún otro valor de entrada como forma de elegir una semilla o una clave privada. Esto es menos seguro que elegir la semilla o la clave privada desde la aleatoriedad, pero hay algunos casos excepcionales dónde quieras hacer esto. (Por ejemplo, en 2018 "XRPuzzler" regaló XRP a la primera persona [en resolver un puzzle](https://bitcoinexchangeguide.com/cryptographic-puzzle-creator-xrpuzzler-offers-137-xrp-reward-to-anyone-who-can-solve-it/); él utilizó la solución del puzzle como la passphrase para la cuenta que tenía el premio en XRP.)  <!-- SPELLING_IGNORE: xrpuzzler -->

La passphrase es información secreta, por lo que debes protegerla con mucho cuidado. Cualquiera que conozca la passphrase de la dirección tiene control total efectivo sobre la cuenta.

### Semilla 

Un valor _semilla_ es un valor compacto que se utiliza para [derivar](#derivación-de-claves) las claves privada y pública actual de una cuenta. En la respuesta de un [método wallet_propose][], las `master_key`, `master_seed`, y `master_seed_hex` todas representan el mismo valor semilla, en varios formatos. Cualquiera de esos formatos puede ser utilizado para firmar transacciones. A pesar de tener el prefijo `master_`, las claves que esta semilla representa no necesariamente representan las claves maestras de una cuenta; puedes usar un par de claves como una clave normal o un miembro de una lista de firmantes.

El valor semilla es una información secreta, por lo que debes que protegerla con mucho cuidado. Cualquiera que conozca el valor semilla de una dirección tiene control total sobre la dirección.

### Clave privada

La _clave privada_ es un valor utilizado para crear una firma digital. La mayoría de software XRP Ledger no muestra explicitamente la clave privada, y [deriva la clave privada](#derivación-de-claves) desde el valor semilla cuando es necesario. Es técnicamente posible guardar la clave privada en vez de la semilla para usarla con el fin de firmar transacciones directamente, pero no es algo común.

Como la semilla, la clave privada es información secreta, por lo que debes protegerla con mucho cuidado. Cualquiera que conozca la clave privada de la dirección tiene control total sobre la dirección.

### Clave pública

La _clave pública_ es un valor utilizado para verificar la autenticidad de una firma digital. La clave pública se deriva de una clave privada como parte de la derivación de clave. En la respuesta de un [método wallet_propose][], ambas, la `public_key` y `public_key_hex` representan el mismo valor de clave pública.

Las transacciones en el XRP Ledger deben incluir las claves públicas para que la red pueda verificar las firmas de las transacciones. La clave pública no se puede utilizar para crear firmas válidas, así que es seguro compartirla públicamente.


### ID de cuenta y dirección

El **ID de cuenta** es el identificador principal para una [cuenta](index.md) o para un par de claves. Se deriva de la clave pública. En el protocolo XRP Ledger, el ID de cuenta es un dato binario de 20 bytes. La mayoría de las APIs XRP Ledger representan la  Account ID como una dirección, en uno de dos formatos:

- Una "dirección clásica" escribe una ID de cuenta en [base58][] con un checksum. En una respuesta del [método wallet_propose][], este es el valor `account_id`.
- Una "dirección-X" combina una ID de cuenta _y_ un [Tag de destino](../transactions/source-and-destination-tags.md) y escribe el valor combinado en [base58][] con un checksum.

El checksum en ambos formatos está ahi para que los resultados con pequeños cambios resulte en una dirección inválida, en lugar de cambiarla para que haga referencia a una cuenta diferente, pero aún potencialmente válida. De esta forma, si cometes un error tipográfico u ocurre un error de tranmisión, no enviarás dinero al lugar equivocado.

Es importante saber que no todos los IDs de cuenta (o direcciones) se refieren a cuentas en el ledger. Derivar claves y direcciones es una operación puramente matemática. Para que una cuenta tenga un registro en el XRP Ledger, es necesario [recibir un pago en XRP](index.md#creating-accounts) que cumpla su [requisito de reservas](reserves.md). Una cuenta no puede enviar ninguna transacción hasta que se haya recibido fondos.

Incluso si una ID de cuenta o dirección no se refiere a una cuenta con fodos, _puedes_ usar ese ID de cuenta o la dirección para representar un [par de claves](#par-de-claves-normales) o un [miembro de una lista de firmantes](multi-signing.md).

### Tipo de clave

El XRP Ledger soporta más de un [algoritmo de firma criptográfica](#algoritmos-de-firma). Cualquier par de claves determinado es únicamente válida para un algoritmo de firma criptográfica específico. Algunas claves privadas pueden técnicamente ser claves válidas para más de un algoritmo, pero esas claves privadas tendrían distintas claves públicas para cada algoritmo, y no deberías reutilizar las claves privadas.

El campo `key_type` en el [método wallet_propose][] se refiere al algoritmo de firma criptográfica que se utilizará.


## Par de claves maestras

El par de claves maestras consiste en una clave privada y una clave publica. La dirección de una cuenta es derivada del par de claves maestras, por lo que están intrinsecamente relacionadas. No puedes cambiar o eliminar el par de claves maestras, pero puedes desactivarlo.

El [metodo wallet_propose][] es una forma de generar el par de claves maestras. La respuesta de este método muestra la semilla de la cuenta, dirección, y la clave pública maestra juntos. Para ver otros métodos para configurar pares de claves maestras, consultar [Firma segura](../transactions/secure-signing.md).

**Atención:** Si un actor malicioso conoce tu clave privada maestra (o semilla), tendrá control completo sobre tu cuenta, a no ser que tu par de claves maestras se inhabilite. Puedes tomar todo tu dinero de la cuenta posee y causar un daño irreparable. ¡Trata tus valores secretos con cuidado!

Dado que cambiar el par de claves maestras es imposible, debes cuidarlo en proporción al valor de lo que posea. Una buena práctica es [guardar tu par de claves maestras offline](../../tutorials/how-tos/manage-account-settings/offline-account-setup.md) y configurar un par de claves normales para firmar transacciones en tu cuenta. Al mantener el par de claves maestras activadas pero offline, puedes estar razonablemente seguro de que nadie puede acceder a él a través de Internet, pero aun así deberías encontrarlo en caso de una emergencia.

Mantener tu par de claves maestras offline significa no colocar tu información secreta (passphrase, semilla, or clave privada) en cualquier sitio en que los actores maliciosos puedan tener acceso a él. En general, esto quiere decir que no está al alcance de un programa inofrmático que interactúe con Internet. Por ejemplo, puedes guardarlo en un equipo que no se conecta nunca a Internet, en un trozo de papel guardado en una caja fuerte, o tenerla completamente memorizada. (Memorizarla tiene algunos puntos inconvenientes, incluido ser imposible pasar la clave una vez muerto.)



### Permisos especiales

**Solo** el par de claves maestras pueden autorizar transacciones para hacer ciertas cosas:

- Enviar la primera transacción de una cuenta, porque las cuentas no se pueden inicializar de otra manera que [autorizando transacciones](../transactions/index.md#authorizing-transactions).

- Deshabilitar el par de claves maestras.

- Renunciar permanentemente a la posibilidad de [congelar](../tokens/fungible-tokens/freezes.md#no-freeze).

- Enviar una [transacción de reestablecimiento de clave](../transactions/transaction-cost.md#key-reset-transaction) especial con una transacción de 0 XRP de coste.

Una clave normal o [multi-firma](multi-signing.md) puede hacer cualquier otra cosa igual que el par de claves maestras. En particular, una vez has deshabilitado el par de claves maestras, puedes volver a habilitarlo utilizando un par de claves normales o multi firma. También puedes [eliminar una cuenta](deleting-accounts.md) si cumple con los requisitos para su eliminación.


## Par de claves normales

Una cuenta XRP Ledger puede autorizar un par de claves secundario, conocido como _par de claves normales_. Tras hacerlo, puedes utilizar cualquiera, el [par de claves maestras](#par-de-claves-maestras) o el par de claves normales para autorizar transacciones. Puedes eliminar o reemplazar tu par de claves normales en cualquier momento sin cambiar el resto de la cuenta.

Un par de claves normales pueden autorizar la mayoría de tipos de transacciones que una par de claves maestras puede, con [ciertas excepciones](#pemrisos-especiales). Por ejemplo, un par de claves nomales _puede_ autorizar una transacción para cambiar el par de claves normales.

Una buena práctica de seguridad es guardar tu clave privada maestra en algun sitio offline, y usar un par de claves normales la mayor parte del tiempo. Como precaución, puedes cambiar el par de claves normales regularmente. Si un usuario malicioso descubre tu clave privada normal, puedes tomar el par de claves maestras de tu escondite offline y usarlo para cambiar o eliminar el par de claves normales. De este modo, puedes volver a retomar el control de la cuenta. Incluso si no eres demasiado rápido para parar al usuario malicioso de robar tu dinero, al menos no tendrás necesidad de moverte a una nueva cuenta y tener que recrear tu configuración y relaciones desde el principio.

El par de claves normales tiene el mismo formato que el par de claves maestras. Las generas de la misma forma (por ejemplo, usando el [método wallet_propose][]). La única diferencia es que el par de claves normales es que el par no está intrínsicamente vinculado a la cuenta para la que firma transacciones. Es posible (pero no es buena idea) utilizar el par de claves maestras de una cuenta como lel par de claves normales para otra cuenta.

La [transacción SetRegularKey][] asigna o cambia el par de claves normales de una cuenta. Para un tutorial de asignación o cambio de un par de claves normales, ver [Asignar par de claves normales](../../tutorials/how-tos/manage-account-settings/assign-a-regular-key-pair.md).


## Algorítmos de firma

Los pares de claves criptográficas están siempre atadas a un algorítmo de firma específico, el cual define la relación matemática entre la clave secreta y la clave pública. Los algorítmos de firma criptográficos tienen la propiedad de, dado el estado actual de las técnicas de criptografía, es "fácil" utilizar una clave secreta para clacular la clave pública coincidente, pero es imposible calcular la clave secreta vinculante partiendo de la clave pública. <!-- STYLE_OVERRIDE: easy -->

El XRP Ledger soporta los siguientes algoritmos de firma criptográfica:

| Tipo de clave  | Algoritmo | Descripción |
|-------------|-----------|---|
| `secp256k1` | [ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm) usando la curva eliptica [secp256k1](https://en.bitcoin.it/wiki/Secp256k1) | Este es el mismo esquema que utiliza Bitcoin. El XRP Ledger utiliza este tipo de claves por defecto. |
| `ed25519`   | [EdDSA](https://tools.ietf.org/html/rfc8032) usando la curva elíptica [Ed25519](https://ed25519.cr.yp.to/) | Este es un algoritmo más novedoso que tiene mejor rendimiento y otras propiedades convenientes. Como las claves públicas Ed25519 son un byte menos que las claves secp256k1, `rippled` prefija las claves públicas Ed25519 con el byte `0xED` así ambos tipos de claves públicas son de 33 bytes. |

Cuando generas un par de claves con el [método wallet_propose][], puedes especificar el `key_type` para elegir que tipo de algorítmo criptográfico se utiliza para derivar las claves. Si has generado un tipo de clave disitnto al de por defecto, debes especificar también el `key_type` cuando firmas transacciones.

Los tipos de pares de claves admitidos pueden utilizarse indistintatemente en todo el XRP Ledger como pares de claves maestras, pares de claves normales, y miembros de listas de firmantes. El proceso de  [derivación de una dirección](addresses.md#address-encoding) es el mismo para pares de claves secp256k1 y Ed25519.


### Algoritmos futuros

En el futuro, es posible que el XRP Ledger necesite nuevos algoritmos de firma criptográficos para mantenerse al día con el desarrollo en criptográfia. Por ejemplo, si los ordenadores cuánticos utilizasen el [algoritmo de Shor](https://en.wikipedia.org/wiki/Shor's_algorithm) (o algo similar) no tardarán en romper la curva elíptica criptográfica, los desarrolladores XRP Ledger pueden añadir un algoritmo criptográfico que no es facil de romper. A mediados de 2020, no existe un algoritmo de firma "resistente a la cuántica" y los ordenadores cuánticos no son lo suficientemente prácticos para ser una amenaza, por lo que no hay planes inmediatos para añadir algoritmos específicos. <!-- STYLE_OVERRIDE: will, easily -->


## Derivación de claves

El proceso de derivar un par de claves depende del algoritmo de firma. En todos los casos, las claves son generadas desde un valor _seed_ (semilla) que es de 16 bytes (128 bits) de longitud. El valor semilla puede ser totalmente aleatorio (recomendado) o puede ser derivado de una passphrase específica tomando el [hash SHA-512][Hash] y manteniendo los primeros 16 bytes (como [SHA-512Half][], pero manteniendo solo 128 bits en vez de los 256 bits de la salida).

### Código de ejemplo

Los procesos de derivación de claves descritos aquí están implementados en múltiples lugares y lenguajes de programación:

- En C++ en el código base de `rippled`:
    - [Definición de semilla](https://github.com/XRPLF/rippled/blob/develop/src/ripple/protocol/Seed.h)
    - [Derivación de clave general & Ed25519](https://github.com/XRPLF/rippled/blob/develop/src/ripple/protocol/impl/SecretKey.cpp)
    - [Derivación de clave secp256k1](https://github.com/XRPLF/rippled/blob/develop/src/ripple/protocol/impl/SecretKey.cpp)
- En Python 3 en {% repo-link path="_code-samples/key-derivation/py/key_derivation.py" %}esta sección de códigos de ejemplo del repositorio{% /repo-link %}.
- En JavaScript en el paquete [`ripple-keypairs`](https://github.com/XRPLF/xrpl.js/tree/main/packages/ripple-keypairs).

### Derivación de clave Ed25519
[[Fuente]](https://github.com/XRPLF/rippled/blob/fc7ecd672a3b9748bfea52ce65996e324553c05f/src/ripple/protocol/impl/SecretKey.cpp#L203 "Fuente")

[{% inline-svg file="/docs/img/key-derivation-ed25519.svg" /%}](/docs/img/key-derivation-ed25519.svg "Passphrase → Semilla → Clave secreta → Prefijo + Clave pública")

1. Calcular el [SHA-512Half][] del valor de la semilla. El resultado es la clave secreta de 32-byte.

    **Consejo:** Todos los números 32-byte son válidos como claves secretas Ed25519. Sin embargo, Sin embargo, solo los números elegidos aleatoriamente son suficientemente seguros para ser usados como claves secretas.

2. Para calcular una clave pública Ed25519, utiliza la derivación estandar de clave pública para [Ed25519](https://ed25519.cr.yp.to/software.html) para derivar una clave pública de 32-byte.

    **Atención:** Como con cualquier algoritmo criptográfico, utiliza una implementación estandar, reconocida y públicamente auditada cuando sea posible. Por ejemplo, [OpenSSL](https://www.openssl.org/) tiene implementaciones de las funciones principales para Ed25519 y secp256k1.

3. Prefija el byte `0xED` en la clave pública 32-byte para indicar que es una clave pública Ed25519, resultando en 33 bytes.

    Si estás impementando código para firmar transacciones, elimina el prefijo `0xED` y utiliza la clave 32-byte para el proceso de firma actual.

4. Cuando serializas una clave pública de cuenta a [base58][], utiliza el prefijo de la clave pública de cuenta `0x23`.

    Las claves efímeras de validador no pueden ser Ed25519.

### Derivación de clave secp256k1
[[Fuente]](https://github.com/XRPLF/rippled/blob/develop/src/ripple/protocol/impl/SecretKey.cpp "Fuente")

[{% inline-svg file="/docs/img/key-derivation-secp256k1.svg" /%}](/docs/img/key-derivation-secp256k1.svg "Passphrase → Semilla → Par de claves inicial (Root Key Pair) → Par de claves intermedias → Par de claves maestras")

La derivación de claves de cuentas XRP Ledger secp256k1 involucra más pasos que con la derivación de clave Ed25519 por el siguiente par de razones:

- No todos los números 32-byte son válidos para claves secretas secp256k1.
- La implementación de referencia en XRP Ledger tiene un marco incompleto y no usado para derivar una familia de claves públicas desde un valor semilla único inicial.

Los pasos para derivar par de claves de cuenta XRP Ledger secp256k1 desde un valor semilla es como sigue:

1. Calcular un par de claves iniciales (root key pair) a partir del valor semilla, como sigue:

    1. Concatenar lo siguiente en orden, para un total de 20 bytes:
        - El valor semilla  (16 bytes)
        - El valor "sequencia root" (4 bytes), como un entero big-endian no asignado. Utiliza 0 como un valor inicial para la secuencia root.

    2. Calcular el [SHA-512Half][] del valor concatenado ( semilla+secuencia root).

    3. Si el resultado no es una clave secreta válida secp256k1, incrementa la secuencia root en 1 y vuelve a empezar. [[Fuente]](https://github.com/XRPLF/rippled/blob/fc7ecd672a3b9748bfea52ce65996e324553c05f/src/ripple/crypto/impl/GenerateDeterministicKey.cpp#L103 "Fuente")

        Una clave válida secp256k1 debe no ser cero, y debe ser numericamente menor que _secp256k1 group order_. El orden grupo secp256k1 es un valor constante `0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141`.

    4. Con una clave secreta secp256k1 válida, utiliza la derivación de clave pública ECDSA estandar con la curva secp256k1 para derivar la clave pública inicial (root). (Como siempre para algoritmos critográficos, utiliza una implementación auditada públicamente, conocida y estandar cuando sea posible. Por ejemplo, [OpenSSL](https://www.openssl.org/) tiene implementaciones para funciones principales de Ed25519 y secp256k1.)

    **Consejo:** Los validadores utilizan este par de claves iniciales (root). Si estás calculando un par de claves para un validador, puedes parar aquí. Para disntiguir entre estos dos tipos de claves públicas, la serialización para claves públicas de validador [base58][] usa el prefijo `0x1c`.

2. Convierte la clave pública inicial (root) a su forma comprimida de 33-byte.

    La forma no comprimida de cualquier clave pública ECDSA consiste en un par de enteros de 32-byte: una coordinada X, y una coordinada Y. La forma comprimida es la coordinada X y un prefijo de one-byte: `0x02` si la coordinada Y es par, o `0x03` si la coordinada Y es impar.

    Puedes convertir una clave pública sin comprimir a la forma comprimida desde la herramienta de línea de comandos `openssl`. Por ejemplo, si la clave pública está en el fichero `ec-pub.pem`, puedes sacar el formato comprimido de esta manera:

        ```
        $ openssl ec -in ec-pub.pem -pubin -text -noout -conv_form compressed
        ```

3. Deriva un "par de claves intermedio" desde la clave pública ráiz comprimida, así:

    1. Concatena lo siguiente en orden, para un total de 41 bytes:
        - La clave pública comprimida (33 bytes)
        - `0x00000000000000000000000000000000` (4 bytes de ceros). (Este valor estaba pensado para derivar diferentes números de la misma familia, pero en la práctica solo el valor 0 es utilizado.)
        - Una valor "secuencia clave" (4 bytes), como un entero no asignado big-endian. Utiliza 0 como valor inicial para la secuencia clave.

    2. Calcula el [SHA-512Half][] del valor concatenado.

    3. Si el resultado noes euna clave secreta válida secp256k1, incrementa la secuencia clave en 1 y reiniciala derivación de la cuenta desde el par de claves intermedio de la cuenta.

    4. Con una clave secreta secp256k1 válida, utiliza la derivación de clave pública ECDSA estandar con la curva secp256k1 para derivar la clave pública intermedia. (Como siempre con los algoritmos criptográficos, utiliza una implementación públicamente auditada, conocida y estandar cuando sea posible. Por ejemplo, [OpenSSL](https://www.openssl.org/) tiene implementaciones de las funciones principales Ed25519 y secp256k1.)

4. Deriva el par de claves públicas añadiendo la clave pública intermedia a la clave pública inicial (root). De manera similar, deriva la clave secreta añadiendo la clave secreta intermedia a la clave secreta inicial (root).

    - Una clave secreta ECDSA es un número entero muy largo, por lo que puedes calcular la suma de dos números secretos sumando el módulo el orden de grupo secp256k1.

    - Una clave pública ECDSA es un punto de la curva elíptica, por lo que necesitarás matemática de curva elíptica para sumar los puntos.

5. Convierte la clave pública maestra asu forma comprimida de 33-byte, como antes.

6. Cuando serialices la clave pública de la cuenta a su formato  [base58][], utiliza el prefijo de la clave pública de la cuenta, `0x23`.

    Ver [Codificación de dirección](addresses.md#address-encoding) para información y códigos de ejemplo para convertir de una clave pública de cuenta a su dirección.


## Ver también

- **Conceptos:**
    - [Direcciones de emisión y operacionales](account-types.md)
- **Tutoriales:**
    - [Asignación de par de claves normales](../../tutorials/how-tos/manage-account-settings/assign-a-regular-key-pair.md)
    - [Cambiar o eliminar par de claves normales](../../tutorials/how-tos/manage-account-settings/change-or-remove-a-regular-key-pair.md)
- **Referencias:**
    - [Transacción SetRegularKey][]
    - [Objeto de ledger AccountRoot](../../references/protocol/ledger-data/ledger-entry-types/accountroot.md)
    - [método wallet_propose][]
    - [método account_info][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
