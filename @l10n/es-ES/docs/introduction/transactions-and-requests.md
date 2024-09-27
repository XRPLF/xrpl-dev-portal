---
html: txn-and-requests.html
parent: intro-to-xrpl.html
seo:
    description: Todas las interacciones con el ledger son transacciones o solicitudes.
labels:
  - Blockchain
---

## Transacciones y solicitudes

La mayoría de interacciones con el XRP Ledger implican enviar una transacción que realiza cambios en el ledger o enviar una solicitud de información al ledger. También puedes subscribirte para monitorear constantemente notificaciones de interés.

## ¿Cómo funcionan las transacciones?

Utiliza las transacciones para realizar cambios en el ledger, como transferir XRP y otros tokens entre cuentas; acuñar (minting) y quemar (burn) NFTs; y crear, aceptar y cancelar ofertas. Para ejecutar una transacción, envías un comando al XRP Ledger y esperas la confirmación de que la transacción se ha completado. El formato de sintaxis del comando es el mismo para cada transacción.

- Siempre debes proporcionar el _TransactionType_ y la dirección pública de la _Account_ que realiza la transacción.

- Dos campos obligatorios son la _Fee_ (comisión) de la transacción y el siguiente número de la  _Sequence_ (secuencia) para las transacciones de la cuenta. Estos campos se pueden completar automáticamente.

- Las transacciones también pueden tener campos obligatorios específicos del tipo de transacción. Por ejemplo, una transacción _Payment_ requiere un valor (cantidad) _Amount_ (en _drops_, o millonésimas de un XRP) y una dirección pública _Destination_ (destino) donde los fondos son acreditados.

Aquí hay un ejemplo de transacción en formato JSON. Esta transacción transfiere 1 XRP de la cuenta _rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn_ a la cuenta destino _ra5nK24KXen9AHvsdFTKHSANinZseWnPcX_.

```json
{
  "TransactionType": "Payment",
  "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Amount": "1000000",
  "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX"
}
```

Hay campos opcionales disponibles para todas las transacciones, con campos adicionales disponibles para transacciones específicas. Puedes incluir tantos campos opcionales como necsites, pero no es necesario incluir todos los campos en cada transacción.

Puedes enviar la transacción al ledger como un comando de JavaScript, Python, línea de comandos, o cualquier servicio compatible. Los servidores rippled proponen las transacciones al XRPL. 

![Transacciones propuestas](/docs/img/introduction17-gather-txns.png)

Cuando el 80% de los validadores aprueban un conjunto actual de transacciones propuestas, se registran como parte del ledger permanente. Los servidores rippled devuelven los resultados de la transacción que enviaste.

Para más información sobre Transacciones, ver [Transacciones](../concepts/transactions/index.md).

## ¿Cómo funcionan las solicitudes?

Las solicitudes son utilizadas para obtener información del ledger, pero no realizan cambios en el ledger. La información está disponible para cualquiera que quiera consultarla, por lo que no hay necesidad de iniciar sesión con la información de tu cuenta.

Los campos que envías pueden variar según el tipo de información que solicitas. Normalmente tienen varios campos opcionales, pero solo unos pocos son campos obligatorios.

Cuando envías tu solicitud, puede ser procesada por un servidor rippled o por un servidor Clio, un servidor dedicado para responder solicitudes.

![Servidor Clio](/docs/img/introduction19-clio.png)

Los servidores Clio quitan parte de la carga a los servidores rippled en el XRPL para mejorar la velocidad de procesamiento y la confiabilidad.

Esto es un ejemplo de solicitud en formato JSON. Esta solicitud obtiene la información de la cuenta actual para el número de cuenta que facilitas.

```json
{
  "command": "account_info",
  "account": "rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn"
}
```

La solicitud devuelve una gran cantidad de información. Aquí hay un ejemplo de respuesta para la información de la cuenta solicitada en formato JSON.

```json
{
    "result": {
        "account_data": {
            "Account": "rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn",
            "Balance": "999999999960",
            "Flags": 8388608,
            "LedgerEntryType": "AccountRoot",
            "OwnerCount": 0,
            "PreviousTxnID": "4294BEBE5B569A18C0A2702387C9B1E7146DC3A5850C1E87204951C6FDAA4C42",
            "PreviousTxnLgrSeq": 3,
            "Sequence": 6,
            "index": "92FA6A9FC8EA6018D5D16532D7795C91BFB0831355BDFDA177E86C8BF997985F"
        },
        "ledger_current_index": 4,
        "queue_data": {
            "auth_change_queued": true,
            "highest_sequence": 10,
            "lowest_sequence": 6,
            "max_spend_drops_total": "500",
            "transactions": [
                {
                    "auth_change": false,
                    "fee": "100",
                    "fee_level": "2560",
                    "max_spend_drops": "100",
                    "seq": 6
                },
                ... (recortado por la longitud) ...
                {
                    "LastLedgerSequence": 10,
                    "auth_change": true,
                    "fee": "100",
                    "fee_level": "2560",
                    "max_spend_drops": "100",
                    "seq": 10
                }
            ],
            "txn_count": 5
        },
        "status": "success",
        "validated": false
    }
}
```
Para obtener información sobre los campos de un registro de información de una cuenta, ver [Cuentas](../concepts/accounts/index.md).

Siguiente: [Ecosistema de software](software-ecosystem.md)
