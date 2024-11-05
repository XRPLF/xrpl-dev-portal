---
html: rippled-server-modes.html
parent: networks-and-servers.html
seo:
    description: Aprende sobre los modos de servidor rippled, incluyendo servidores stock, servidores validadores y servidores que se ejecutan en modo solitario.
labels:
  - Servidor principal
---
# Modos de servidor rippled

El software del servidor `rippled` puede ejecutarse en varios modos dependiendo de su configuración, incluyendo:

- [**Modo P2P**](#modo-p2p) - Este es el modo principal del servidor: sigue la red peer-to-peer, procesa transacciones, y mantiene cierta cantidad de [histórico del ledger](ledger-history.md). Este modo se puede configurar para alguno o todos los siguientes roles:
    - [**Validador**](#validadores) - Ayuda a asegurar la red participando en el consenso.
    - [**Servidor API**](#servidores-api) - Proporciona [acceso API](../../tutorials/http-websocket-apis/build-apps/get-started.md) para leer datos del ledger compartido, enviar transacciones, y mirar la actividad en el ledger. Opcionalmente, puede ser un [**servidor full history**](#servidores-full-history), el cual guarda un registro completo de transacciones y el histórico del ledger.
    - [**Servidor hub**](#hubs-públicos) - Transmite mensajes entre muchos otros miembros de la red peer-to-peer.
- [**Modo Reporting**](#modo-reporting) - Un modo especializado para servir consultas API desde una base de datos relacional. No participa en la red peer-to-peer, por lo que necesitas ejecutar un servidor en modo P2P y conectarle el servidor modo reporting usando una conexión gRPC de confianza. 
- [**Modo solitario**](#modo-solitario) - Un modo offline para pruebas. No se conecta a la red peer-to-peer ni usa consenso.

Tambien puedes ejecutar el ejecutable `rippled` como una aplicación cliente para acceder [APIs `rippled`](../../references/http-websocket-apis/index.md) localmente. (Dos instancias del mismo binario pueden ejecutarse uno al lado del otro en este caso; uno como un servidor, y el otro ejecutándose brevemente como cliente y luego apagarlo.)

Para más información sobre los comandos que ejecutar `rippled` en cada uno de estos modos, ver la [Referencia de línea de comandos](../../infrastructure/commandline-usage.md).


## Modo P2P

El Modo P2P es el modo principal y predeterminado del servidor `rippled`, y puede manejar casi cualquier cosa que desees que haga tu servidor. Estos servidores forman una red peer-to-peer que procesa transacciones y mantiene el estado compartido del XRP Ledger. Si deseas enviar transacciones, leer datos del ledger o participar de otra manera en la red, tus solicitudes deben pasar por un servidor en Modo P2P en algún momento.

Los servidores en Modo P2P también pueden configurarse para proporcionar funcionalidades adicionales. Un servidor ejecutando en Modo P2P con un archivo de configuración mínimamente modificado también se llama un servidor de stock o _stock server_. Otras configuraciones incluyen:

- [Validador](#validadores)
- [Servidor API](#servidores-api)
- [Hubs públicos](#hubs-publicos)

Los servidores Modo P2P se conecta a [Mainnet](parallel-networks.md) por defecto.


### Servidores API

Todos los servidores en Modo P2P proporcionan [APIs](../../references/http-websocket-apis/index.md) para propósitos como enviar transacciones, verificar balances y configuraciones, y administrar el servidor. Si consultas el XRP Ledger para obtener datos o enviar transacciones para uso comercial, puede ser útil [ejecutar tu propio servidor](index.md#razones-por-las-que-ejecutar-tu-propio-servidor).

#### Servidores Full History

A diferencia de algunas otras blockchains, el XRP Ledger no requiere que los servidores tengan un historial completo de transacciones para conocer el estado actual y procesar nuevas transacciones. Como operador de servidor, tú decides cuánto [histórico del ledger](ledger-history.md)  almacenar en un momento dado. Sin embargo, un servidor en Modo P2P solo puede responder a solicitudes de API utilizando el historial del ledger que tiene disponible localmente. Por ejemplo, si conservas seis meses de historial, tu servidor no puede describir el resultado de una transacción de hace un año. Los servidores API con histórico completo o [full history](ledger-history.md#full-history) pueden informar de todas las transacciones y balances desde el inicio del XRP Ledger.


### Hubs públicos

Un servidor hub es un servidor en Modo P2P con muchas [conexiones del protocolo de pares](peer-protocol.md) a otros servidores. Los servidores hub, especialmente los _hubs públicos_ que permiten conexiones desde Internet abierto, ayudan a la red del XRP Ledger a mantener una conectividad eficiente. Los hubs públicos exitosos encarnan las siguientes características:

- Buen ancho de banda.

- Conexiones con muchos pares confiables.

- Capacidad para transmitir mensajes de maneja confiable.

Para configurar tu servidor como un hub, aumenta el número máximo de pares permitidos y asegúrate de haber [redireccionado los puertos apropiados](../../infrastructure/configuration/peering/forward-ports-for-peering.md) a través de tu firewall y enrutador de NAT (traducción de dirección de red) según corresponda.

### Validadores

La robustez del XRP Ledger depende de una red interconectada de _validadores_ que confían mutuamente en algunos otros validadores para _no colisionar_. Además de procesar cada transacción y calcular el estado del ledger exactamente como otros servidores en Modo P2P, los validadores participan activamente en el [protocolo de consenso](../consensus-protocol/index.md). Si tú o tu organización dependen del XRP Ledger, es de tu interés contribuir al proceso de consenso ejecutando _un_ servidor como validador.

La validación utiliza solo una pequeña cantidad de recursos informáticos, pero no hay mucho beneficio para una sola entidad u organización en ejecutar varios validadores porque hacerlo no proporciona más protecciones contra las colisiones. Cada validador se identifica con un par de claves criptográficas único que debe ser gestionado cuidadosamente; múltiples validadores no deben compartir un par de claves. Por estas razones, la validación está desactivada de forma predeterminada.

Puedes habilitar de forma segura la validación en un servidor que también se utiliza para otros fines; este tipo de configuración se llama un _servidor multiuso_. Alternativamente, puedes ejecutar un _validador dedicado_ que no realice otras tareas, posiblemente en un [cluster](clustering.md) con otros servidores `rippled` en Modo P2P.

Para más información sobre como ejecutar un validador, ver [Ejecutar `rippled` como un validador](../../infrastructure/configuration/server-modes/run-rippled-as-a-validator.md).


## Modo reporting


El modo reporting es un modo especializado para servir solicitudes API de manera más eficiente. En este modo, el servidor obtiene los datos del ledger validados más recientes a través de [gRPC](../../infrastructure/configuration/configure-grpc.md) desde un servidor `rippled` separado en Modo P2P, luego carga esos datos en una base de datos relacional ([PostgreSQL](https://www.postgresql.org/)). El servidor en modo reporting no participa directamente en la red peer-to-peer, aunque puede reenviar solicitudes como el envío de transacciones al servidor en Modo P2P que utiliza.

Varios servidores en modo reporting pueden compartir acceso a una base de datos PostgreSQL y a un clúster [Apache Cassandra](https://cassandra.apache.org/) para servir una gran cantidad de historial sin que cada servidor necesite una copia redundante de todos los datos. Los servidores en modo reporting proporcionan estos datos a través de las mismas [`rippled` APIs](../../references/http-websocket-apis/index.md) con algunos cambios leves para adaptarse a las diferencias en cómo almacenan los datos subyacentes.

Especialmente, los servidores en modo reporting no informan sobre datos pendientes de validación del ledger o transacciones no validadas. Esta limitación es relevante para ciertos casos de uso que dependen de un acceso rápido a datos en flujo, como realizar arbitraje en el [exchange descentralizado](../tokens/decentralized-exchange/index.md).

<!-- TODO: link setup steps for Reporting Mode when those are ready -->


## Modo solitario

En el modo solitario, el servidor opera sin conectarse a la red y sin participar en el proceso de consenso. Sin el proceso de consenso, debes avanzar manualmente el ledger y no se hace ninguna distinción entre "cerrado" y "validado" ledgers. Sin embargo, el servidor sigue proporcionando acceso a la API y procesa transacciones de la misma manera. Esto te permite:

- [Probar los efectos de enmiendas](../../infrastructure/testing-and-auditing/test-amendments.md) antes de que esas enmiendas hayan entrado en efecto en toda la red descentralizada.
- [Crear un nuevo ledger génesis](../../infrastructure/testing-and-auditing/start-a-new-genesis-ledger-in-stand-alone-mode.md) desde el inicio.
- [Cargar una versión de ledger existente](../../infrastructure/testing-and-auditing/load-a-saved-ledger-in-stand-alone-mode.md) desde el disco, luego reproducir transacciones específicas para recrear sus resultados y probar otras posibilidades.


## Ver también

- **Tutoriales:**
    - [Configurar `rippled`](../../infrastructure/configuration/index.md)
    - [Usar rippled en modo solitario](../../infrastructure/testing-and-auditing/index.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
