---
html: parallel-networks.html
parent: networks-and-servers.html
seo:
    description: Entender cómo las redes de prueba (test) y cadenas ledger alternativas se relacionan con el XRP Ledger en producción.
labels:
  - Blockchain
---
# Redes paralelas

Existe una red peer-to-peer en producción del XRP Ledger, y todos los negocios que tienen lugar en el XRP Ledger ocurren dentro de la red de producción: la Mainnet.

Para ayudar a miembros de la comunidad del XRP Ledger a interactuar con la tecnología sin afectar nada a la Mainnet, hay redes alternativas, o altnets. Aquí hay un desglose de algunas altnets públicas:

| Red | Cadencia de actualización | Descripción                                      |
|:--------|:----------------|:-------------------------------------------------|
| Mainnet | Lanzamientos estables | _El_ [XRP Ledger](/about/), un libro contable criptográfico descentralizado impulsado por una red de servidores peer-to-peer y el hogar de [XRP](../../introduction/what-is-xrp.md). |
| Testnet | Lanzamientos estables | Una red de "universo alternativo" que actua como un campo de pruebas para el software construido en el XRP Ledger, sin impactar a los usuarios del XRP Ledger de producción y sin arriesgar dinero real. El [estado de enmienda](/resources/known-amendments.md) de Testnet está destinado a reflejar de cerca el de la Mainnet, aunque pueden ocurrir ligeras variaciones en el tiempo debido a la naturaleza impredecible de los sistemas descentralizados. |
| Devnet  | Lanzamientos Beta   | Una vista previa de las próximas atracciones, donde cambios inestables en el software principal de XRP Ledger se pueden probar. Los desarrolladores pueden utilizar esta altnet para interactuar y aprender sobre funcionalidades nuevas planficiadas para el XRP Ledger y enmiendas que no están habilitadas en la Mainnet. |
| [Hooks V3 Testnet](https://hooks-testnet-v3.xrpl-labs.com/) | [Servidor Hooks](https://github.com/XRPL-Labs/xrpld-hooks) | Una vista previa de la funcionalidad de smart contract en la cadena utilizando [hooks](https://xrpl-hooks.readme.io/). |
| Sidechain-Devnet | Lanzamientos Beta | Una sidechain para probar funcionalidades en puentes cross-chain. Devnet se trata como la cadena de bloqueo y esta sidechain es la cadena de emisión.<br>Soporte a la librería:<br>- [xrpl.js 2.12.0](https://www.npmjs.com/package/xrpl/v/2.12.0)<br>- [xrpl-py 2.4.0](https://pypi.org/project/xrpl-py/2.4.0/)<br>**Nota**: También puedes usar la herramienta de línea de comandos [`xbridge-cli`](https://github.com/XRPLF/xbridge-cli) para configurar un puente entre cadenas en tu máquina local. |

Cada altnet tiene su propia distribución separada de XRP de prueba, que se [regala gratis](/resources/dev-tools/xrp-faucets) a partes interesadas en experimentar con el XRP Ledger y desarrollar aplicaciones e integraciones. El XRP test no tiene valor en el mundo real y se pierde cuando la red se reinicia.

**Atención:** A diferencia de la Mainnet del XRP Ledger, las redes de prueba suelen ser _centralizadas_ y no hay garantías sobre la estabilidad y disponibilidad de estas redes. Han sido y siguen siendo utilizadas para probar diversas propiedades de la configuración del servidor, la topología de la red y el rendimiento de la red.


## Redes paralelas y consenso

El factor principal en determinar qué red sigue un servidor es su UNL configurado-la lista de validadores en los que confía para no colisionar. Cada servidor utiliza su UNL configurada para saber qué ledger aceptar como la verdad. Cuando diferentes grupos de consenso de instancias de `rippled` solo confían en otros miembros del mismo grupo, cada grupo continúa como una red paralela. Incluso si equipos maliciosos o malintencionados se conectan a ambas redes, el proceso de consenso evita la confusión siempre y cuando los miembros de cada red no estén configurados para confiar en miembros de otra red en exceso de su configuración de cuórum.

Ripple ejecuta los servidores principales en la Testnet y Devnet; también puedes [conectar tu propio servidor `rippled` para estas redes](../../infrastructure/configuration/connect-your-rippled-to-the-xrp-test-net.md). La Testnet y Devnet no utilizan conjuntos de validadores diversos y resistentes a la censura. Esto hace posible que Ripple reinicie la Testnet o Devnet en cualquier momento.


## Ver también

- **Herramientas:**
    - [XRP Testnet Faucet](/resources/dev-tools/xrp-faucets)
- **Conceptos:**
    - [Consenso](../consensus-protocol/index.md)
    - [Enmiendas](amendments.md)
- **Tutoriales:**
    - [Conectar tu `rippled` en laTestnet XRP](../../infrastructure/configuration/connect-your-rippled-to-the-xrp-test-net.md)
    - [Usar rippled en modo Stand-Alone](../../infrastructure/testing-and-auditing/index.md)
- **Referencias:**
    - [método server_info][]
    - [método consensus_info][]
    - [método validator_list_sites][]
    - [método validators][]
    - [Opciones modo Daemon](../../infrastructure/commandline-usage.md#daemon-mode-options)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
