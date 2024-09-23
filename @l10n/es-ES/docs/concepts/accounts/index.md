---
html: accounts.html
parent: concepts.html
seo:
    description: Aprende sobre cuentas en el XRP Ledger. AccouLas cuentas pueden enviar transacciones y almacenar XRP.
labels:
  - Cuentas
  - Pagos
---
# Cuentas

Una "Cuenta" en el XRP Ledger representa a un titular de XRP y a un emisor de [transacciones](../../references/protocol/transactions/index.md).

Una cuenta consiste en una dirección, un balance en XRP, un número de secuencia y un historial de sus transacciones. Para poder enviar transacciones, el dueño también necesita uno o más pares de claves criptográficas asociadas con la cuenta.


## Estructura de la cuenta

 Los elementos principales de una cuenta son:

- Una **cuenta** identificable, como `rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn`.
- Un **balance en XRP**. Parte de este XRP se aparte para la [Reserva](reserves.md).
- Un **número de secuencia**, el cual ayuda a asegurar que cualquier transacción que esta cuenta envíe se aplique en el orden correcto y solo una vez. Para ejecutar una transacción, el número de secuencia de la transacción y el número de secuencia de su remitente deben coincidir. Después, como parte de la aplicación de la transacción, el número de secuencia de la cuenta incrementa en 1. (Ver también: [Tipos de datos básicos: Secuencia de cuenta](../../references/protocol/data-types/basic-data-types.md#account-sequence).)
- Un **histórico de transacciones** que afectaron a la cuenta y sus balances.
- Una o más maneras de [autorizar transacciones](../transactions/index.md#authorizing-transactions), posiblemente incluyendo:
    - Un par de claves maestras intrínseco a la cuenta. (Esto puedes desactivarse pero no cambiarse.)
    - Una par de claves "normales" ("regular" en inglés) que se pueden rotar.
    - Una lista de firmantes para [multi-firma](multi-signing.md). (Almacenado por separado de los datos principales de la cuenta.)

Los datos principales de una cuenta se guardan en una entrada del ledger [AccountRoot](../../references/protocol/ledger-data/ledger-entry-types/accountroot.md). Una cuenta puede ser también el dueña (o parcialmente dueña) de varios otros tipos de entradas del ledger.

**Consejo:** Una "Cuenta" en el XRP Ledger está en algún lugar entre el uso financiero (como una "cuenta bancaria") y el uso informático (como una "cuenta UNIX"). Las monedas y activos no XRP no se guardan en una cuenta del XRP Ledger en sí misma; cada uno de estos activos se almacena en una relación contable llamada "Línea de confianza" (trust line en inglés) que conecta a dos partes.


## Creación de cuentas

No hay una transacción dedicada a "crear una cuenta". La [transacción Payment][] automáticamente crea una nueva cuenta si el pago envía suficiente XRP a una dirección matemáticamente válida que aún no tiene una cuenta. Esto se llama _finnaciar_ una cuenta, y crea una [entrada AccountRoot](../../references/protocol/ledger-data/ledger-entry-types/accountroot.md) en el ledger. No hay otra transacción que cree una cuenta.

**Atención:** Financiar una cuenta **no te da** privilegios especiales sobre esa cuenta. Quien tenga la clave secreta correspondiente a la dirección de la cuenta tiene control total sobre la cuenta y todo el XRP que contiene.  Para algunas direcciones, es posible que nadie tenga la clave secreta, en este caso la cuenta es un agujero negro [black hole](addresses.md#special-addresses) y el XRP se pierde para siempre.

La forma típica de obtener una cuenta en el XRP Ledger es la siguiente:

1. Genera un par de claves desde una fuente de fuerte aleatoriedad y calcula la dirección de ese par de claves.

2. Hacer que alguien que ya tenga una cuenta en el XRP Ledger envíe XRP a la dirección que generaste.

    - Por ejemplo, puedes comprar XRP en un exchange privado, después retirar el XRP del exchange a la dirección que especificaste.

        **Atención:** La primera vez que recibes XRP en tu propia dirección del XRP Ledger, debes pagar la [reserva de la cuenta](reserves.md) (actualmente 10 XRP), lo que bloquea esa cantidad de XRP indefinidamente. En contraste, los exchanges privados suelen almacenar todo el XRP de los clientes en unas pocas cuentas del XRP Ledger compartidas, así los clientes no tienen que pagar la reserva de cuentas individuales en el exchange. Antes de retirar XRP, considera si pagar el precio de tener tu propia cuenta en el XRP Ledger merece la pena.



## Ver también

- **Conceptos:**
    - [Reservas](reserves.md)
    - [Claves criptográficas](cryptographic-keys.md)
    - [Cuentas emisoras y operacionales](account-types.md)
- **Referencias:**
    - [Método account_info][]
    - [Método wallet_propose][]
    - [Transacción AccountSet][]
    - [Transacción Payment][]
    - [Objeto AccountRoot](../../references/protocol/ledger-data/ledger-entry-types/accountroot.md)
- **Tutoriales:**
    - [Administrar configuración de la cuenta (Categoría)](../../tutorials/how-tos/manage-account-settings/index.md)
    - [Monitorizar pagos entrantes con WebSocket](../../tutorials/http-websocket-apis/build-apps/monitor-incoming-payments-with-websocket.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
