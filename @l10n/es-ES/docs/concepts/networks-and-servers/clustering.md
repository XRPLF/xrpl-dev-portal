---
html: clustering.html
parent: networks-and-servers.html
seo:
    description: Ejecuta servidores xrpld en un cluster para compartir la carga criptográfica entre ellos.
labels:
  - Servidor principal
---
# Clustering

Si estás ejecutando varios servidores `xrpld` en un único datacenter, puedes configurar esos servidores dentro de un cluster para maximizar la eficiencia. Ejecutar tus servidores `xrpld` en un cluster proporciona los siguientes beneficios:

- Los servidores `xrpld` clusterizados comparten el trabajo critográfico. Si un servidor ha verificado la autenticidad del mensaje, los otros servidores en el cluster confian en él y no lo vuelven a verificar.
- Los servidores clusterizados comparten información sobre pares y clientes API que están comportandose mal o abusando de la red. Esto dificulta atacar todos los servidores del cluster a la vez.
- Los servidores clusterizados siempre propagan las transacciones a través del cluster, incluso si la transacción no cumple con el coste de transacción actual basada en la carga en alguno de ellos.

Si estás ejecutando un validador como un [par privado](peer-protocol.md#pares-privados), Ripple recomienda utilizar un cluster de servidores `xrpld` como servidores proxy.

## Ver también

- **Tutoriales:**
    - [Cluster de servidores `xrpld`](../../infrastructure/configuration/peering/cluster-xrpld-servers.md)
    - [Ejecutar xrpld como validador](../../infrastructure/configuration/server-modes/run-xrpld-as-a-validator.md)
- **Referencias:**
    - [método peers][]
    - [método connect][]
    - [Peer Crawler](../../references/http-websocket-apis/peer-port-methods/peer-crawler.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
