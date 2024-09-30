---
html: ledger-history.html
parent: networks-and-servers.html
seo:
    description: Los servidores rippled almacenan una cantidad variable de transacciones e historial del estado localmente.
labels:
  - Retención de datos
  - Blockchain
  - Servidor principal
---
# Histórico del ledger

El [proceso de consenso](../consensus-protocol/index.md) crea una cadena de [versiones de ledgers validados](../ledgers/index.md), cada uno derivado del anterior aplicando un conjunto de [transacciones](../transactions/index.md). Cada [servidor `rippled`](index.md) almacena versiones de ledgers y el historial de transacciones locálmente. La cantidad de histórico de transacciones que un servidor almacena depende de cuanto tiempo ese servidor ha estado online y cuanto histórico está configurado para recuperar y mantener.

Los servidores en la red peer-to-peer XRP Ledger comparten transacciones y otros datos entre sí como parte del proceso de consenso. Cada servidor construye de forma independiente una nueva versión del ledger y compara los resultados con sus validadores de confianza para asegurar la consistencia. (Si un consenso de validadores de confianza no está de acuerdo con los resultados de un servidor, ese servidor recupera los datos necesarios de sus pares para lograr consistencia.) Los servidores pueden descargar datos más antiguos de sus pares para completar huecos en su historial disponible. La estructura del ledger utiliza [hashes](../../references/protocol/data-types/basic-data-types.md#hashes) criptográficos de los datos para que cualquier servidor pueda verificar la integridad y consistencia de los datos.

## Bases de datos

Los servidores mantienen datos del estado del ledger y transacciones en un almacén de clave-valor llamada almacén del ledger o _ledger store_. Además, `rippled` mantiene algunos archivos de base de datos SQLite para un acceso más flexible a cosas como el historial de transacciones y para rastrear ciertos cambios de configuración.

Normalmente, es seguro eliminar todos los archivos de base de datos de un servidor `rippled` cuando ese servidor no está en funcionamiento. (Es posible que quieras hacer esto, por ejemplo, si cambias la configuración de almacenamiento del servidor o si estás cambiando de una red de prueba a la red de producción).

## Historial disponible

Por diseño, todos los datos y transacciones en el XRP Ledger son públicos y cualquiera puede buscar o consultar cualquier cosa. Sin embargo, tu servidor solo puede buscar datos que tenga disponibles localmente. Si intentas buscar una versión del ledger o una transacción que tu servidor no tenga disponible, tu servidor responderá que no puede encontrar esos datos. Otros servidores que tengan el historial necesario pueden responder con éxito a la misma consulta. Si tienes un negocio que utiliza datos del XRP Ledger, debes tener cuidado de cuánto historial tiene disponible tu servidor.

El [método server_info][] reporta cuántas versiones del ledger tiene disponibles en el campo `complete_ledgers`.

## Recuperar el histórico

Cuando un servidor del XRP Ledger se inicia, su primera prioridad es obtener una copia completa del último ledger validado. A partir de ahí, se mantiene al día con los avances en el progreso del ledger. El servidor completa cualquier agujero en su historial del ledger que ocurra después de sincronizar y puede rellenar el historial desde antes de que se sincronizara. (Los huecos en el historial del ledger pueden ocurrir si un servidor temporalmente se vuelve demasiado ocupado para mantenerse al día con la red, pierde su conexión de red u experimenta otros problemas temporales).Cuando descarga el historial del ledger, el servidor solicita los datos faltantes a sus [servidores pares](peer-protocol.md), y verifica la integridad de los datos utilizando [hashes][Hash] criptográficos.

Rellenar el histórico es uno de las prioridades más bajas del servidor, por lo que puede llevar mucho tiempo completar el historíal faltante, especialmente si el servidor está ocupado o si las especificaciones del hardware y la red no son lo suficientemente buenas. Para recomendaciones en especificaciones de hardware, ver [Planificación de capacidad](../../infrastructure/installation/capacity-planning.md). Completar el histórico también requiere que al menos uno de los pares directos del servidor tenga el histórico en cuestión. Para más información de cómo administrar las conexiones peer-to-peer de tu servidor, consulta [Configurar Peering](../../infrastructure/configuration/peering/index.md).

El XRP Ledger identifica datos (en varios niveles diferentes) mediante un hash único de sus contenidos. Los datos de estado del XRP Ledger contienen un resumen breve del histórico del ledger, en forma de [tipos de objeto LedgerHashes](../../references/protocol/ledger-data/ledger-entry-types/ledgerhashes.md). Los serivodres usan los objetos LedgerHashes para conocer qué versiones del ledger hay que buscar, y confirmar que los datos del ledger que recibe son correctos y completos.


<a id="with-advisory-deletion"></a><!-- old anchor to this area -->
### Rellenar
{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.6.0" %}Actualizado en: rippled 1.6.0{% /badge %}

La cantidad de histórico que un servidor intenta descargar depende de su configuración. El servidor automáticamente intenta rellenar los huecos descargando el histórico hasta **el ledger más antiguo que está actualmente disponible**. Pues utilizar el campo `[ledger_history]` para hacer al servidor rellenar el histórico más allá de ese punto. Sin embargo, el servidor nunca descarga ledgers que estuviesen programados para su [eliminación](../../infrastructure/configuration/data-retention/online-deletion.md).

El campo `[ledger_history]` define el número mínimo de ledgers que se acumulan antes del ledger actual validado. Utiliza el valor especial `full` para descargar el [histórico completo](#full-history) de la red. Si especificas un número de ledgers, debe ser igual o mayor que el campo `online_deletion`; no puedes utilizar `[ledger_history]` para hacer al servidor descargar _menos_ histórico. Para reducir la cantidad de histórico que un servidor almacena, cambia el ajuste [online deletion](../../infrastructure/configuration/data-retention/online-deletion.md). <!-- STYLE_OVERRIDE: a number of -->



## Histórico completo

Algunos servidores en la red XRP Ledger están configurados como servidores "full-history". Estos servidores, los cuales requieren sifnificativamente más espacio de disco que otros servidores de seguimiento, almacenan todo el histórico disponible XRP Ledger y **no usan la opción online deletion**.

La XRP Ledger Foundation proporciona acceso a un cojunto de servidores full history operados por miembros de la comunidad (ver [xrplcluster.com](https://xrplcluster.com) para más detalles).
Ripple también proporciona un conjunto de servidores full-history públicos como un servicio público en `s2.ripple.com`. <!-- SPELLING_IGNORE: xrplcluster -->

Los proveedores de servidores Full History se reservan el derecho de bloquear acceso a aquellos que abusen de los rescursos, o generen una carga desproporcionada a los sistemas.

**Consejo:** A diferencia de algunas redes de criptomonedas, los servidores en el XRP Ledger no necesitan un full history para conocer el estado actual y mantenerse a día con las transacciones actuales.

Para instrucciones de cómo configurar un servidor full history, consultar [Configurar Full History](../../infrastructure/configuration/data-retention/configure-full-history.md).

## Fragmentación del historial

Una alternativa para almacenar todo el histórico completo del XRP Ledger en una única máquina cara es configurar muchos servidores para que cada uno almacene una parte del histórico completo del ledger. La función [Fragmentación del histórico](../../infrastructure/configuration/data-retention/history-sharding.md) hace esto posible, almacenando rangos del histórico del ledger en áreas de almacenamiento separadas llamadas almacenes de fragmentación o _shard store_. Cuando un servidor par solicita datos específicos (como se describe en [fetching history](#recuperar-el-histórico) arriba), un servidor puede responder usando datos de su ledger store o shard store.

Online deletion **no** borra desde un shard store. Sin embargo, si configuras online deletion para mantener al menos 32768 versiones de ledger en el ledger store de tu servidor, tu servidor puede copiar shards completos desde el ledger store al shard store antes de borrarlos automáticamente del ledger store.

Para más información, ver [Configurar History Sharding](../../infrastructure/configuration/data-retention/configure-history-sharding.md).


## Ver también

- **Conceptos:**
    - [Ledgers](../ledgers/index.md)
    - [Consenso](../consensus-protocol/index.md)
- **Tutoriales:**
    - [Configurar `rippled`](../../infrastructure/configuration/index.md)
        - [Configurar Online Deletion](../../infrastructure/configuration/data-retention/configure-online-deletion.md)
        - [Configurar Advisory Deletion](../../infrastructure/configuration/data-retention/configure-advisory-deletion.md)
        - [Configurar History Sharding](../../infrastructure/configuration/data-retention/configure-history-sharding.md)
        - [Configurar Full History](../../infrastructure/configuration/data-retention/configure-full-history.md)
- **Referencias:**
    - [método ledger][]
    - [método server_info][]
    - [método ledger_request][]
    - [método can_delete][]
    - [método ledger_cleaner][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
