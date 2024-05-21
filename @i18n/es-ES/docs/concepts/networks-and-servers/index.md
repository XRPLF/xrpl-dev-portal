---
html: networks-and-servers.html
parent: concepts.html
seo:
    description: rippled es el servidor peer-to-peer principal que maneja el XRP Ledger.
metadata:
  indexPage: true
---
# Redes y servidores

Hay dos tipos principales de software de servidores que alimentan el XRP Ledger:

- El servidor principal, `rippled`, ejecuta la red peer-to-peer la cual procesa transacciones y alcanza un consenso en sus resultados.
- El servidor API, [Clio](the-clio-server.md), proporciona potentes interfaces para obtener o consultar datos desde el ledger.

Cualquiera puede ejecutar instancias de uno o ambos de estos tipos de servidores basado en sus necesidades.

## Razones por las que ejecutar tu propio servidor

Para casos de uso más livianos y servidores individuales, puedes depender de  [servidores públicos][]. Sin embargo, cuanto más serio sea tu uso del XRP Ledger, más importante será tener tu propia infraestructura.

Hay multitud de razones por las que quieres ejecutar tus propios servidores, pero la mayoría de ellas se pueden resumir en: puedes confiar en tu propio servidor, tienes control sobre la carga de trabajo, y no estás a merced de otros que decidan cuando y cómo puedes acceder. Por supuesto, debes tener tener unas buenas prácticas respecto a la seguridad de la red para proteger tu servidor de hackers maliciosos.

Necesitas confiar en el servidor que utilizas. Si te conectas a un servidor malicioso, hay muchas maneras en las que se pueda aprovechar de ti o hacerte perder dinero. Por ejemplo:

* Un servidor malicioso podría informar que has sido pagado cuando no se ha hecho el pago.
* Podría selectivamente mostrar u ocultar los caminos (o paths) de pago y las foertas de intercambio de divisas para garantizar su propio beneficio mientras no te ofrece la mejor oferta.
* Si le enviaste la clave secreta de tu dirección, esto podría generar transacciones arbitrarias en tu nombre e incluso transferir o destruir todo el dinero que la dirección posee.

Adicionalmente, ejecutar tu propio servidor te da [acceso de administrador](../../tutorials/http-websocket-apis/build-apps/get-started.md#admin-access), lo que te permite ejecutar comandos exclusivos de administrador y de carga intensa. Si utilizas un servidor compartido, debes preocuparte por los otros usuarios del mismo servidor compitiendo contra ti por el poder de computación del servidor. Muchos de los comandos en el API WebSocket puede poner mucha presión sobre el servidor, por lo que el servidor tiene la opción de reducir sus respuestas cuando lo necesite. Si compartes un servidor con otros, puede que no siempre consigas los mejores resultados posibles.

Finalmente, si ejecutas un servidor de validación, puedes utilizar un servidor común como proxy a la red pública mientras mantienes tu servidor de vaalidación en una red privada la cual es solo accesible desde el mundo exterior desde tu servidor común. Esto hace más difícil comprometer la integridad de tu servidor de validación.

## Características y temas del servidor

<!-- provided by the auto-generated table of children -->

{% raw-partial file="/docs/_snippets/common-links.md" /%}


{% child-pages /%}
