---
html: software-ecosystem.html
parent: introduction.html
seo:
    description: Obtén una descripción general de qué es el software XRP Ledger disponible y como funciona en conjunto.
labels:
  - Servidor central
---
# Ecosistema software

El XRP Ledger alberga un ecosistema profundo de varias capas de proyectos de software que impulsan y permiten el Internet del Valor. Es imposible listar cada proyecto, herramienta, y negocio que interactua con el XRP Ledger, asi que esta página solo lista algunas categorías y destaca algunos proyectos centrales que están documentados en este sitio web.
![El ecosistema XRPL](/docs/img/ecosystem-apps-and-services.svg)

## Niveles de stack

- [_Servidores Principales](#servidores-principales) forman la base del XRP Ledger, una red peer-to-peer que transmite y procesa transacciones en todo momento.

- [_Librerías de cliente_](#librerías-cliente) existen en software de alto nivel, donde se importan directamente al código del programa, y contiene métodos para acceder al XRP Ledger.

- [_Middleware_](#middleware) proporciona acceso indirecto a los datos del XRP Ledger. Las aplicaciones en esta capa suelen tener su propio almacenamiento y procesamiento de datos.

- [_Apps y servicios_](#apps-y-servicios) proporcionan interación con el XRP Ledger a nivel usuario, o proporcionan una base para aplicaciones y servicios de aun más alto nivel.


### Servidores principales

La red peer-to-peer en el corazón del XRP Ledger requiere de un servidor altamente confiable y eficiente para hacer cumplir las reglas de consenso y el procesamiento de las transacciones. La Fundación XRP Ledger publica una implementación de referencia de este software de sevidor, llamada [**`rippled`**](../concepts/networks-and-servers/index.md) (pronunciado en inglés como  "ripple-dee"). El servidor está disponible bajo [una licencia permisiva de código abierto](https://github.com/XRPLF/rippled/blob/develop/LICENSE.md), por lo que cualquiera puede inspeccionar y modificar su propia instancia del servidor, y volver a publicar con pocas restricciones.

![Servidores principales](/docs/img/ecosystem-peer-to-peer.svg)

Cada servidor central sincroniza con la misma red (a no ser que esté configurado para seguir una [red de test](../concepts/networks-and-servers/parallel-networks.md)) y tiene acceso a todas las comunicaciones a través de la red. Cada servidor de la red guarda una copia completa de lod datos de estado para todo el XRP Ledger, junto con transacciones recientes y un registro de los cambios que esas transacciones han realizado, y cada servidor procesa cada transacción independientemente mientras verifican que el resultado coincide con el resto de la red. Los servidores pueden ser configurados para mantener más [histórico del ledger](../concepts/networks-and-servers/ledger-history.md) y para participar en el proceso de consenso como un [validador](../concepts/networks-and-servers/rippled-server-modes.md#validators).

Los servidores Core exponen [APIs HTTP / WebSocket](../references/http-websocket-apis/index.md) para que los usuarios busquen datos, administren el servidor, y envíen transacciones. Algunos servidores también ofrecen APIs  HTTP / WebSocket pero no conectan directamente con la red peer-to-peer y no procesan transacciones ni participan en el consenso. Estos servidores, como servidores `rippled` ejecutan en modo Reporting y servidores Clio, que dependen de un servidor central en modo P2P para procesar las transacciones.


### Librerías cliente

Las librerias simplifican parte del trabajo básico de acceder al XRP Ledger, normalmente a través de las APIs HTTP / WebSocket. Convierten los datos en formas que son más familiares y convenientes para varios lenguajes de programación e incluyen implementaiones de operaciones básicas. 

![Librerías cliente](/docs/img/ecosystem-client-libraries.svg)

Una característica prinicpal de la mayoría de las librerías cliente es la firma de transacciones localmente, así los usuarios no tienen que enviar sus claves privadas a través de la red.

Muchos servicios middleware utilizan librerías cliente internamente.

Ver [Librerías Cliente](../references/client-libraries.md) para más información sobre las librerías cliente disponibles actualmente.


### Middleware

Los servicios middleware son programas que consumen las APIs del XRP Ledger por un lado y proporcionan sus propias APIs por el otro. Porporcionan una capa de abstracción para facilitar la creación de aplicaciones a mayor nivel proporcionando funcionalidades comunes como servicios.

![Middleware](/docs/img/ecosystem-middleware.svg)

A diferencia de las librerías cliente, en donde se crean instancias nuevas y se cierran con el programa que las importa, los servicios middleware generalmente permanecen ejecutándose indefinidamente y pueden tener sus propias bases de datos (bases de datos relacionales SQL o de otro tipo) y archivos de configuración. Algunos están disponibles como servicios en la nube con varios precios o limitaciones de uso.


### Apps y servicios

En lo alto del stack es donde suceden las cosas realmente interesantes. Las apps y servicios ofrecen una forma para que usuarios y dispositivos se conecten al XRP Ledger. Los servicios como los exchanges privados, los acuñadores de tokens, marketplaces, interfaces al exchanges descentralizado, y carteras brindan interfaces de usuario para comprar, vender y comerciar varios activos incluyendo XRP y tokens de todo tipo. Existen muchas otras posibilidades, incluyendo servicios adicionales en capas superiores.

![Apps y servicios](/docs/img/ecosystem-apps-and-services.svg)

Ver [Casos de uso](../use-cases/index.md) para más ejemplos que pueden ser construidos en o encima de esta capa.

{% raw-partial file="/docs/_snippets/common-links.md" /%}