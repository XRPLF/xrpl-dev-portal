---
html: the-clio-server.html
parent: networks-and-servers.html
seo:
    description: Clio es un servidor XRP Ledger optimizado para llamadas API.
---
# El servidor Clio

Clio es un servidor API del XRP Ledger optimizado para llamadas de WebSocket o HTTP API para datos del ledger validados.

Un servidor Clio no se conecta a la red peer-to-peer. En su lugar, extrae datos de un servidor `rippled` especifico que está conectado a la red P2P. Al manejar las llamadas API de manera eficiente, los servidores Clio pueden ayudar a reducir la carga en los servidores `rippled` que se ejecutan en modo P2P.

Clio almacena datos históricos del ledger y transacciones validadas en un formato eficiente de espacio, utilizando hasta 4 veces menos espacio que `rippled`. Clio utiliza Cassandra o ScyllaDB, lo que permite una capacidad de lectura escalable. Multiples servidores Clio pueden compartir acceso al mismo conjunto de datos, lo que le permite construir un clúster altamente disponible de servidores Clio sin necesidad de almacenamiento o cálculo de datos redundantes o computación

Clio requiere acceso a un servidor `rippled`, que pueda ejecutarse en la misma máquina que Clio o por separado.

Mientras que Clio ofrece las [APIs HTTP / WebSocket](../../references/http-websocket-apis/index.md) completas, por defecto, solo devuelve datos validados. Para cualquier solicitud que requiera acceso a la red P2P, Clio reenvía automáticamente la solicitud al servidor `rippled` en la red P2P y devuelve la respuesta.

## ¿Por qué debería ejecutar un servidor Clio?

Hay multitud de razones por las que podrías querer ejecutar tu propio servidor Clio, pero la mayoría se pueden resumir en: carga reducida en el/los servidor(es) `rippled` conectado(s) a la red P2P, menor uso de memoria y sobrecarga de almacenamiento, escalabilidad horizontal más fácil y mayor rendimiento para las solicitudes API. 

* Carga reducida en el/los servidor(es) `rippled` - Un servidor Clio no se conecta a la red peer-to-peer. Utiliza gRPC para obtener datos validados de uno o más servidores `rippled` de confianza que están conectados a la red P2P. Por lo tanto, un servidor Clio maneja las solicitudes de manera más eficiente y reduce la carga en los servidores `rippled` que se ejecutan en modo P2P.

* Menor uso de memoria y sobrecarga de almacenamiento - Clio utiliza Cassandra como base de datos y almacena datos en un formato eficiente en espacio, utilizando hasta 4 veces menos espacio que `rippled`.

* Escalabilidad horizontal más fácil - Múltiples servidores Clio pueden compartir acceso al mismo conjunto de datos, lo que le permite construir un clúster altamente disponible de servidores Clio.

* Mayor rendimiento para las solicitudes API - Un servidor Clio extrae datos validados de uno o más servidores `rippled` confiables y almacena estos datos de manera eficiente. Por lo tanto, maneja las llamadas API de manera eficiente, lo que resulta en un mayor rendimiento y, en algunos casos, una latencia más baja también.


## ¿Cómo funciona un servidor Clio?

[{% inline-svg file="/docs/img/clio-basic-architecture.svg" /%}](/docs/img/clio-basic-architecture.svg "Figura 1: ¿Cómo funciona un servidor Clio?")

Cuando un servidor Clio almacena datos del ledger validados, como metadatos de transacciones, estados de cuentas y encabezados de ledger, en un almacén de datos persistente.

Cuando un servidor Clio recibe una solicitud API, busca datos en estos almacenes de datos. Para solicitudes que requieren datos de la red P2P, el servidor Clio reenvía la solicitud a un servidor P2P y luego pasa la respuesta de vuelta al cliente.

Clio **siempre** reenvía a `rippled` si alguna de las siguientes condiciones es verdadera:

- `ledger_index` está establecido a `current` o `closed`.
- `accounts`, `queue` o `full` están establecidos en `true` para la API de `ledger`.
- `queue` está establecido en `true` para la API de `account_info`.
- El método solicitado de API (`"command"`) es `submit`, `submit_multisigned`, `fee`, `ledger_closed`, `ledger_current`, `ripple_path_find`, `manifest`, `channel_authorize` o `channel_verify`.

## Ver también

- [Código fuente Clio](https://github.com/XRPLF/clio)
- **Tutoriales:**
    - [Instalar servidor Clio en Ubuntu](../../infrastructure/installation/install-clio-on-ubuntu.md)
