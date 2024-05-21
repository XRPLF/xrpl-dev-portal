---
html: decentralized-identifiers.html
parent: accounts.html
seo:
    description: Los identificadores decentralizados permiten identidades digitales decentralizadas verificables.
status: not_enabled
labels:
  - DID
---
# Identificadores descentralizados

_(REquiere de la [enmienda DID][] {% not-enabled /%})_

Un identificador descentralizado (DID) es un nuevo tipo de identificador definido por el World Wide Web Consortium (W3C) que permite identidades digitales verificables. Los DIDs están completamente bajo el control del dueño del DID, independientemente de cualquier registro centralizado, proveedor de identidad, o autoridad certificada.

Los principios clave de un DID son:

- **Descentralizacion:** No hay una agencia emisora central que controla el DID, lo que permite al propietario actualizar, resolver o desactivarlo.

- **Criptográficamente verificable:** Los DIDs son verificados a través de pruebas criptográficas, lo que los hace a prueba de manipulaciones y seguros.

- **Interoperabilidad:** Los DIDs están abiertos a cualquier solución que reconozca el estandar W3C DID. Esto quiere decir que un DID puede ser utilizado para autenticar y establecer confianza en varias transacciones digitales e interacciones.

**Nota:** La implementación de DIDs en el XRP Ledger cumple con los requisitos de la [especificación DID v1.0](https://www.w3.org/TR/did-core/).


## Cómo funciona

1. El dueño de una cuenta XRPL genera un DID que es controlado por la cuenta.
2. El DID se asocia a un documento DID definido por la especificaciones W3C.
3. El DID es usado para las siguientes tareas digitales como:
    - Firmar documentos digitales.
    - Realizar transacciones en linea seguras.
    - Iniciar sesión en sitios web.
4. El verificador resuelve el DID a su docuemnto para verificar la identidad del sujeto.


## Documentos DID

Los documentos DID contienen la información necesaria para verificar criptográficamente la identidad del sujeto descrito por el documento DID. El sujeto puede ser una persona, organización, o cosa. Por ejemplo, un documento DID podría contener claves criptográficas públicas que el sujeto DID puede utilizar para autenticarse y demostrar su asociación con el DID.

**Nota:** Los documentos DID suelen serializarse en una representación JSON o JSON-LD.

En el XRP Ledger, hay numerosas formas de asociar un DID a un documento DID:

1. Almacenar una referencia al documento en el campo `URI` del objeto `DID`, que apunta al documento almacenado en otra red de almacenamiento descentralizado, como es IPFS o STORJ.
2. Almacenar un documento DID mínimo en el campo `DIDDocument` del objeto `DID`.
3. Utilizar un documento DID _implicito_ generado  a partir del DID y otra información pública disponible.
    **Nota:** Los casos de uso más simples pueden solo necesitar firmas y rokens de autorización simples. En casos donde no haya un documento DID explicitamente en el ledger, un documento implicito es utilizado en su lugar. Por ejemplo, el documento DID de `did:xrpl:1:0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020` habilita solo la clave única `0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020` para autorizar cambios en el documento DID o firmar credenciales en nombre del DID.


### Ejemplo de documento DID XRPL

```json
{
    "@context": "https://w3id.org/did/v1",
    "id": "did:xrpl:1:rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "publicKey": [
        {
            "id": "did:xrpl:1:rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn#keys-1",
            "type": ["CryptographicKey", "EcdsaKoblitzPublicKey"],
            "curve": "secp256k1",
            "expires": 15674657,
            "publicKeyHex": "04f42987b7faee8b95e2c3a3345224f00e00dfc67ba882..."
        }
    ]
}
```

Para aprender más sobre las propiedades principales de un documento DID, ver: [Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/#core-properties).


## Precauciones de privacidad y seguridad

- Quien controla las claves privadas de la cuenta XRPL, controla el DID y las referencias al documento DID a la que resuelve. Asegúrate de que tus claves privadas no se comprometan.
- Puedes incluir cualquier contenido en un documento DID, pero deberías limitarlo a métodos de verificación y puntos de servicio. Como los DIDs en XRPL pueden ser resueltos por cualquiera, no deberías introducir ninguna información personal.
- IPFS permite a cualquiera almacenar contenido en los nodos de una red distribuida. Un error común es que cualquiera puede editar ese contenido; sin embargo, la capacidad de direccionamiento del contenido de IPFS significa que cualquier contenido editado tendrá una dirección diferente a la original. Mientras que cualquier entidad puede copiar un documento DID anclado a los campos `DIDDocument` o `URI` de una cuenta XRPL, no pueden cambiar el documento en sí a menos que controlen la clave privada que creó el objeto `DID`.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
