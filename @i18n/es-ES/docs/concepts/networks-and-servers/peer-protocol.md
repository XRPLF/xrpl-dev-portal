---
html: peer-protocol.html
parent: networks-and-servers.html
seo:
    description: El protocolo de pares especifica el lenguaje en el que los servidores rippled hablan entre sí.
labels:
  - Servidor principal
  - Blockchain
---
# Protocolo de pares

Los servidores en el XRP Ledger se comunican entre sí utilizando el protocolo de pares del XRP Ledger.

El protocolo de pares es el modo principal de comunicación entre servidores en el XRP Ledger. Toda la información sobre el comportamiento, progreso, y conectividad en el XRP Ledger pasa a través del protocolo de pares. Ejemplos de comunicación peer-to-peer incluyen todos los siguientes:

- Solicitar una conexión a otros servidores en la red peer-to-peer, o anunciar que hay huecos de conexión disponibles.
- Compartir transacciones candidatas con el resto de la red.
- Solicitar datos de ledger de ledgers históricos, o proporcionar esos datos.
- Proponer una conjunto de transacciones para el consenso, o compartir el resultado calculado de aplicar el conjunto de transacciones de consenso.

Para establecer una conexión peer-to-peer, un servidor se conecta a otro usando HTTPS y solicita una [actualización HTTP](https://tools.ietf.org/html/rfc7230#section-6.7) para cambiar al protocolo `XRPL/2.0` (anteriormente `RTXP/1.2`). (Para más información, consultar el artículo [Red de superposición](https://github.com/XRPLF/rippled/blob/96bbabbd2ece106779bb544aa0e4ce174e99fdf6/src/ripple/overlay/README.md#handshake) en el [repositorio `rippled`](https://github.com/ripple/rippled).)

## Descubrimiento de pares

El XRP Ledger utiliza el protocolo del "chismorreo" para ayudar a servidores a encontrar otros servidores para conectarse en la red XRP Ledger. Cuando un servidor se inicia, se reconecta a cualquier otro par al que se haya conectado anteriormente. Como alternativa, utiliza los [hubs públicos hardcodeados](https://github.com/XRPLF/rippled/blob/fa57859477441b60914e6239382c6fba286a0c26/src/ripple/overlay/impl/OverlayImpl.cpp#L518-L525). Después de que un servidor se conecte correctamente a un par, le pregunta a ese par por información de contacto (generalmente, dirección IP y puerto) de otros servidores XRP Ledger que también pueden estar buscando pares. El servidor puede conectarse entonces a esos servidores, y preguntarles por información de contacto de todavía más servidores a los que conectarse. A través de este proceso, el servior hace suficientes conexiones de pares para que pueda permanecer contectado con el resto de la red incluso si pierde la conexión con cualquier par en particular.

Normalmente, un servidor necesita conectarse a un hub público solo una vez, durante un corto período de tiempo, para encontrar otros pares. Después de hacerlo, el servidor puede o no permanecer conectado al hub, dependiendo de la estabilidad de su conexión de red, de lo ocupado que esté el hub y de cuántos otros pares de alta calidad encuentre el servidor. El servidor guarda las direcciones de estos otros pares para poder intentar reconectarse directamente a esos pares más tarde, después de una interrupción en la red o un reinicio. 

El [método peers][] muestra una lista de pares a los que tu servidor está actualmente conectado.

Para ciertos servidores de alto valor (tan importantes como [validadores](rippled-server-modes.md#modos-de-servidor-rippled)) puedes preferir no conectarte a pares no confiables a través del proceso de descubrimiento de pares. En este caso, puedes configurar tu servidor para usar solo [pares privados](#pares-privados).


## Puerto del protocolo de pares

Para participar en el XRP Ledger, los servidores `rippled` conectan con pares arbitrarios utilizando el protocolo de pares. (Todos los pares son como no confiables, a no ser que sean de tipo [clusterizado](clustering.md) con el servidor actual.)

Idealmente, el servidor debería poder enviar _y_ recibir conexiones en el puerto de pares. Debes [redireccionar el puerto utilizado por el protocolo de pares a través de tu firewall](../../infrastructure/configuration/peering/forward-ports-for-peering.md) para el servidor `rippled`.

IANA [ha asignado el puerto **2459**](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml?search=2459) para el protocolo de pares del XRP Ledger, pero para la compatibilidad con sistemas antiguos, el [fichero de configuración por defecto de `rippled`](https://github.com/XRPLF/rippled/blob/master/cfg/rippled-example.cfg) escucha las conexiones entrantes de pares con el **port 51235** en todas las interfaces de la red. Si ejecutas un servidor, puedes configurar qué puerto(s) escucha tu servidor utilizando el fichero `rippled.cfg`.

Ejemplo:

```
[port_peer]
port = 2459
ip = 0.0.0.0
protocol = peer
```

El puerto del protocolo de pares también sirve para [métodos especiales del puerto de pares](../../references/http-websocket-apis/peer-port-methods/index.md).

## Par de claves de nodo

Cuando un servidor se inicia por primera vez, genera un _par de claves de nodo_ para usarlo para identificarse en las comunicaciones del protocolo de pares. El servidor utiliza su clave para firmar todas sus comunicaciones del protocolo de pares. Esto hace posible identificar y verificar de manera confiable la integridad de los mensajes de otro servidor en la red peer-to-peer incluso si los mensajes de ese servidor están siendo transmitidos por pares no confiables.

El par de claves de nodo se guarda en la base de datos y se reutiliza cuando el servidor se reinicia. Si eliminas las bases de datos del servidor, crea un nuevo par de claves de nodo, lo que efectivamente le hace iniciar con una identidad diferente. Para reutilizar el mismo par de claves incluso si las bases de datos se eliminan, puedes configurar el servidor en el apartado `[node_seed]`. Para generar un valor adecuado para usar en el apartado `[node_seed]`, utiliza el [método validation_create][].

El par de claves de nodo también identifican otros servidores para propositos de [clustering](clustering.md) o [reservar huecos de pares](#pares-fijos-y-reservas-de-pares). Si tienes un cluster de servidores, debes configurar cada servidor en el cluster con un valor único en el apartado `[node_seed]`. Para más información de cómo configurar un cluster, ver [Servidores `rippled` clusterizados](../../infrastructure/configuration/peering/cluster-rippled-servers.md).


## Pares fijos y reservas de pares

Normalmente, un servidor `rippled` intenta mantener un número saludable de pares, y se conecta automáticamente a pares no confiables hasta un número máximo. Puedes configurar un servidor `rippled` para permanecer conectado a servidores de pares específicos de varias maneras:

- Utiliza **Pares fijos** para permanecer siempre conectado a pares específicos basado en sus direcciones IP. Esto solo funciona si los pares tienen direcciones IP fijas. Usa el apartado `[ips_fixed]` para configurar pares fijos. Esto es una parte necesaria para [clustering](clustering.md) o [pares privados](#pares-privados). Los pares fijos están definidos en el fichero de configuración, pero los cambios solo se aplican una vez se reinicia el servidor. Los pares fijos son más útiles para mantener servidores conectados si esos servidores son administrados por la misma persona u organización.
- Utiliza **Reservas de pares** para priorizar pares específicos. Si tu servidor tiene una reserva de pares para un par específico, entonces tu servidor siempre acepta peticiones de conexión desde ese par incluso si tu servidor está ya en su número máximo de pares conectados. (Esto puede causar que tu servidor _supere_ el número máximo de pares.) Identificas a un par reservado por su [par de claves de nodo](#par-de-claves-de-nodo), así puedes hacerlo incluso para pares con una direcciones IP dinamicas. Las reservas de pares son configurados a través de comandos de administrador y guardados en las bases de datos del servidor, por lo que se pueden ajustar mientras el servidor está online y son salvados durante los reinicios. Las reservas de pares más útiles para conectarse a servidor administrados por diferentes personas u organización. <!-- STYLE_OVERRIDE: prioritize -->

En los siguientes casos, un servidor `rippled` no se conecta a pares no confiables:

- Si el servidor es configurado como un [par privado](#pares-privados), se conecta _solo_ a sus pares fijos.
- Si el servidor esta ejecutando en [modo solitario][] no se conecta a _ningún_ par.


## Pares privados

Puedes configurar un servidor `rippled` para actuar como un servidor "privado" para mantener oculta su dirección IP del público  general. Esta puede ser una precaución útil contra ataques de denegación de servicio e intentos de intrusión en servidores `rippled` importantes como los validadores de confianza. Para participar en la red peer-to-peer, un servidor privado debe estar configurado para conectarse a al menos un servidor no privado, que transmita sus mensajes al resto de la red.

**Atención:** Si configuras un servidor privado sin ningún [par fijo](#pares-fijos-y-reservas-de-pares), el servidor no puede conectarse a la red, por lo que no puede conocer el estado de la red, transmitir transacciones o participar en el proceso de consenso.

Configurar un servidor como un servidor privado tiene varios efectos:

- El servidor no hace conexiones salientes a otros servidores en la red peer-to-peer a menos que se haya configurado explícitamente para conectarse a esos servidores.
- El servidor no acepta conexiones entrantes de otros servidores a menos que se haya configurado explícitamente para aceptar conexiones de esos servidores.
- El servidor pide a sus pares directos no revelar su dirección IP a comunicaciones no confiables, incluyendo a la [respuesta de la API del peer crawler](../../references/http-websocket-apis/peer-port-methods/peer-crawler.md). Esto no afecta a las comunicaciones confiables como el [método peers admin][peers method].

    Los servidores siempre piden a sus pares ocultar las direcciones IP de validadores, independientemente de la configuración del servidor privada. Esto ayuda a proteger validadores de ser sobrecargados por ataques de denegación de servicio.

    **Atención:** Es posible modificar el código fuente de un servidor para que ignore esta petición y comparta las direcciones IP de sus pares inmediatos de todos modos. Debes configurar tu servidor privado para que se conecte solo a servidores que sepas que no están modificados de esta manera.

### Pros y contras de las configuraciones de pares

Para ser parte del XRP Ledger, un servidor `rippled` debe estar conectado al resto de la red abierta peer-to-peer. A grandes rasgos, hay tres categorías de configuraciones para cómo un servidor `rippled` se conecta a la red:

- Usando **pares descubiertos**. El servidor se conecta a cualquier servidor no confiable que encuentre y permanece conectado siempre que esos servidores se comporten adecuadamente. (Por ejemplo, no solicitan demasiados datos, sus conexiones de red son estables y parecen estar siguiendo la misma [red](parallel-networks.md).) Esto es lo predeterminado.
- Como un **servidor privado utilizando proxies** ejecutado por la misma persona u organización. Los proxies son servidores stock `rippled` (también conectados a pares descubiertos) que mantienen una conexión de emparejamiento fija con el servidor privado.
- Como un **servidor privado utilizando hubs públicos**. Esto es similar a utilizar proxies, pero depende de terceros específicos.

Los pros y contras de cada configuración son los siguientes:


<table>
<thead><tr>
<th>Configuración</th> <th>Pros</th> <th>Contras</th>
</tr></thead>
<tbody>
<tr><th>Pares descubiertos</th>
  <td><ul>
    <li><p>La configuración más simple, con una carga de mantenimiento baja.</p></li>
    <li><p>Crea la oportunidad para una gran cantidad de conexiones directas de pares. Tener más pares directos tiene varios beneficios. Tu servidor puede <a href="ledger-history.html#recuperar-el-histórico">recuperar histórico</a> de múltiples pares en paralelo, tanto al sincronizar como al rellenar el histórico. Como no todos los pares mantienen el histórico completo, tener acceso a una gama más amplia de datos históricos.</p></li>
    <li><p>Reduce la posibilidad de desconexión de la red porque tu servidor puede reemplazar los pares desconectados con otros nuevos.</p></li>
  </ul></td>
  <td><ul>
    <li><p>No te permite seleccionar los pares de tu servidor, lo que significa que no tienes idea de si tus pares pueden decidir actuar maliciosamente. Aunque los servidores `rippled` están diseñados para protegerse contra pares maliciosos, siempre existe el riesgo de que los pares maliciosos puedan atacar fallos en el software para afectar a tu servidor.</p></li>
    <li><p>Los pares de tu servidor pueden desconectarse o cambiar a menudo.</p></li>
  </ul></td>
</tr>
<tr><th>Servidor privado utilizando proxies</th>
  <td><ul>
    <li><p>Configuración más segura y confiable cuando se implementa correctamente.</p></li>
    <li><p>Tan confiable y redundante como quieras hacerla.</p></li>
    <li><p>Puedes optimizar el rendimiento del servidor privado con <a href="clustering.html">clustering</a>.</p></li>
    <li><p>Te permite crear tantas conexiones directas de pares como desees. Tu servidor privado puede <a href="ledger-history.html#recuperar-el-histórico">obtener histórico</a> desde múltipes pares en paralelo. Dado que administras los pares, también puedes controlar cuanto histórico del ledger cada par puede mantener.</p></li>
  </ul></td>
  <td><ul>
    <li><p>Carga de mantenimiento y costos más altos debido a la ejecución de múltiples servidores.</p></li>
    <li><p>No elimina por completo la posibilidad de interrupciones en la conexión de pares. No importa cuántos proxies ejecutes, si todos existen en el mismo rack de servidores, entonces una interrupción de red o de luz puede afectar a todos ellos.</p></li>
  </ul></td>
</tr>
<tr><th>Servidor privado utilizando hubs públicos</th>
  <td><ul>
    <li><p>Carga de mantenimiento baja con una pequeña cantidad de configuración.</p></li>
    <li><p>Proporciona acceso a conexiones seguras a la red.</p></li>
    <li><p>En comparación con la conexión utilizando proxies, es menos probable que cause que tu servidor privado se desconecte de la red debido a una interrupción simultánea de pares.</p></li>
  </ul></td>
  <td><ul>
    <li><p>Depende de terceros con una alta reputación para mantenerse confiable.</p></li>
    <li>
      <p>Puede hacer que tu servidor se desconecte de la red si los hubs públicos en los que confías están demasiado ocupados. Debido a la naturaleza de los hubs públicos, son los más populares y es posible que no puedan mantener una conexión estable abierta para todos.</p>
      <p>Para evitar este problema, usa más hubs públicos; cuanto más, mejor. También puede ayudar usar hubs no predeterminados, que son menos propensos a estar ocupados.</p>
    </li>
  </ul></td>
</tr>
</tbody>
</table>

### Configurando un servidor privado

Para configurar tu servidor como un servidor privado, establece la opción `[peer_private]` a `1` en el fichero de configuración. Para intrudciones más detalladas, ver [Configurar un servidor privado](../../infrastructure/configuration/peering/configure-a-private-server.md).


## Ver también

- **Conceptos:**
    - [Consenso](../consensus-protocol/index.md)
    - [Redes paralelas](parallel-networks.md)
- **Tutoriales:**
    - [Cluster de servidores rippled](../../infrastructure/configuration/peering/cluster-rippled-servers.md)
    - [Configurar un servidor privado](../../infrastructure/configuration/peering/configure-a-private-server.md)
    - [Configurar el Peer Crawler](../../infrastructure/configuration/peering/configure-the-peer-crawler.md)
    - [Redireccionar puertos para pares](../../infrastructure/configuration/peering/forward-ports-for-peering.md)
    - [Conectarse manualmente a un par específico](../../infrastructure/configuration/peering/manually-connect-to-a-specific-peer.md)
    - [Establecer número máximo de pares](../../infrastructure/configuration/peering/set-max-number-of-peers.md)
    - [Utilizar la reserva de pares](../../infrastructure/configuration/peering/use-a-peer-reservation.md)
- **Referencias:**
    - [método peers][]
    - [método peer_reservations_add][]
    - [método peer_reservations_del][]
    - [método peer_reservations_list][]
    - [método connect][]
    - [método fetch_info][]
    - [Peer Crawler](../../references/http-websocket-apis/peer-port-methods/peer-crawler.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
