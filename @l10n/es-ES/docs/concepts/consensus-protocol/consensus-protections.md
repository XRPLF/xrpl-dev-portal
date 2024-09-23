---
html: consensus-protections.html
parent: consensus.html
blurb: Aprende cómo el Protocolo de Consenso del XRP Ledger se protege contra varios problemas y ataques que pueden ocurrir en un sistema financiero descentralizado.
labels:
  - Blockchain
---
# Protecciones del consenso contra ataques y modos de fallo

El Protocolo de Consenso del XRP Ledger es un mecanismo de consenso _tolerante a fallos bizantinos_, lo que quiere decir que está diseñado para trabajar incluso si todo tipo de cosas salen mal: los participantes dependen de una red abierta poco confiable, y actores maliciosos pueden estar intentando controlar o interrumpir el sistema en un momento dado. Encima de eso, el conjunto de participantes en el Protocolo de Consenso del XRP Ledger no se conoce de antemano y puede cambiar con el tiempo.

Confirmar transacciones de una forma rápida mientras se mantiene las propiedades deseadas de la red es un desafío complejo, y  es imposible construir un sistema perfecto. El Protocolo de Conenso del XRP Ledger está diseñado para funcionar lo mejor posible en la mayoría de las situaciones, y para fallar elegántemente en aquellas que no es posible.

Esta página describe algunos de los desafíos que el Protocolo de Consenso del XRP LEdger se encuentra y cómo se enfrenta a ellos.

## Validadodes individuales con mal comportamiento

Los _validadores_ son servidores que contribuyen activamente al proceso de decidir cada nueva versión del ledger. Los validadores tienen una influencia sobre servidores configurados para confiar en ellos (incluso indiréctamente). El consenso continua incluso si algunos validadores se comportan mal, incluyendo una larga variedad de casos de fallo, tales como:

- No estar disponibles o sobrecargados.
- Estar parcialmente desconectados de la red, por lo que sus mensajes solo alcanzan a un subgrupo de participantes sin retraso.
- Comportarse intencionadamente para defraudar a otros o parar la red.
- Comportarse maliciosamente como resultado de la presión de factores externos, como amenzadas de un gobierno opresivo.
- Enviar accidentalmente mensajes confusos o malformados debido a un error o una software desactualizado.

En general, el consenso puede continuar sin problemas mientras solo un pequeño porcentaje (menos del 20%) de los validadores confiables tengan mal comportamiento en un mismo momento. (Para las matemáticas que hay detrás y los porcentajes exactos, ver la última [Investigración del consenso](consensus-research.md).)

Si más del 20% de los validadores son inalcanzables o no se comportan adecuadamente, la red falla al intentar consenso. Durante este tiempo, nuevas transacciones pueden ser tentativamente procesadas, pero las nuevas versiones del ledger no pueden ser validadas, así que los resultados finales de esas transacciones no son ciertos. En esta situación, se convierte en inmediatamente obvio que el XRP Ledger no se encuentra bien, lo que provocaría una intervención de participantes humanos que pueden decidir entre esperar, o reconfigurar el conjuntos de validadores confiables.

La única forma de confirmar una transacción inválida sería conseguir que el 80% de los validadores confiables aprueben la transacción y estén de acuerdo en el resultado exacto. (Las transacciones inválidas incluyen ese dinero gastado que ya ha sido gastado, o de otra forma estaría rompiendo las reglas de la red.) En otras palabras, una gran mayoría de los validadores confiables habrían _colisionado_. Con docenas de validadores confiables corriendo por diferentes personas y negocios en diferentes partes del mundo, esto es muy dificil de conseguir intencionadamente.


## Vulnerabilidades de software

Como con cualquier sistema de software, los bugs (o código intencionalmente malicioso) en la implementación del Protocolo de Consenso del XRP Ledger, los paquetes de software comúnmente implementados, o sus dependencias, son un problema que hay que tomarse seriamente. Incluso los bugs que causan que un servidor falle cuando ve valores de entrada cocinados pueden abusasrse para interrumpir el proceso de la red. Los desarrolladores del XRP Ledger toman precauciones para abordar esta amenaza en la referencia de implementaciones de software de XRP Ledger, incluyen:

- Un [código fuente open-source](https://github.com/XRPLF/rippled/), por lo que cualquier miembro del público puede revisar, compilar, e independientemente probar el software relevante.
- Un proceso de revisión de código exhaustivo y sólido para todos los cambios de los repositorios oficiales del XRP Ledger.
- Las firmas digitales de desarrolladores muy conocidos en todas las publicaciones y paquetes de software.
- Revisiones profesionales encargadas periodicamentes para detectar vulnerabilidades e inseguridades.
- Un [programa de recompensas de bugs](https://ripple.com/bug-bounty/) que premia a investigadores de seguridad que revelan responsablemente las vulnerabilidades.


## Ataques Sybil

Un _[ataque Sybil](https://en.wikipedia.org/wiki/Sybil_attack)_ es un intento de tomar el control de una red usando un gran número de identidades falsas. En el XRP Ledger, un ataque Sybil tomaría la forma de ejecutar un gran número de validadores, y luego convencer a otros de confiar en esos validadores. Este tipo de ataques son teóricamente posibles, pero sería muy dificil de hacer porque la intervención humana es necesaria para ser confiados por otros.

No importa cuantos servidores un atacante ejecuta, esos servidores no tienen voz ni voto sobre lo que los participantes existentes consideran validados a no ser que esos participantes decidan confiar en los validadores del atacante. Otros servidores solo  escuchan lo que los validadores que tienen configurados para confiar, ya sea por una lista de validodres o una configuración explícita. (Ver [requisitos de superposición de validador](#requisitos-de-superposición-del-validador) para un sumario de cómo una lista de validadores funciona.)

Esta confianza no ocurre automáticamente, para realizar un ataque Sybil exitosamente habría que añadirle el laborioso trabajo de convencer a personas y empresas de reconfigurar sus servidores XRP Ledger para confiar en los validadores del atacante. Incluso en el caso de que una entidad individual sea engañada haciendo eso, esto tendrá un impacto mínimo en otros que no han cambiado sus configuraciones.


## Ataque del 51%

Un "ataque de 51%" es un ataque en un sistema blockchain donde un bando controla más del 50% de todo el poder de minado o votación. (Técnicamente, el ataque está incorrectamente llamado porque _cualquier_ valor superior al 50% es suficiente.) El XRP Ledger no es vulnerable a un ataque del 51% porque no utiliza minería en su mecanismo de consenso. La analogía más cercana para el XRP Ledger es un [ataque Sybil](#ataques-sybil), el cuál sería complicado de realizar.


## Requisitos de superposición del validador

Para todos los participantes en el XRP Ledger se pongan de acuerdo en qué consideran como validado, deben empezar eligiendo un conjunto de validadores confiables que son muy parecidos a los conjuntos elegidos por los demás. En el peor escenario, menos del 90% de superposición podría causar que algunos participantes diverjan entre ellos. Por esa razón, existen listas firmadas de validadores recomendados, destinadas a incluir servidores bien mantenidos y confiables administrados por la industria y la comunidad.

Por defecto, los servidores XRP Ledger están configurados para utilizar sitios de listas de validadores mantenidas por la XRPL Foundation y Ripple. Los sitios proveen una lista de validadores recomendados (también conocidos como la _Lista de Nodos Únicos_ recomendada, o UNL), la cual se actualiza periódicamente. Los servidores configurados de esta forma confian en todos los validadores de la última versión de la lista, lo cual asegura un 100% de superposición con otros que usan la misma lista. La configuración por defecto incluye claves públicas para verificar la autenticidad de los contenidos de esos sitios. Los servidores de la red peer-to-peer XRP Ledger también comparten las actualizaciones firmadas de la lista entre ellos, reduciendo potenciales puntos de fallo.

Técnicamente, si ejecutas un servidor, puedes configurar tu propia lista o explicitamente elegir validadores en los que confiar de forma individual, pero esto no se recomienda. Si el conjunto de validadores que has elegido no tiene suficiente superposición con otros, tu servidor podría divergir del resto de la red, y podrías perder dinero por culpa del estado divergente de tu servidor.

Se está investigando un nuevo diseño del protocolo de consenso mejorado que permita listas de validadores más hetereogeneas. Para más información, ver la [Investigación del consenso](consensus-research.md) page.


## Ver también

- Para una descripción detallada del protocolo de consenso, ver [Consenso](index.md).
- Para una explicación del **diseño de decisiones y transfondo** detrás del protocolo de consenso, cer [Principios y reglas del consenso](consensus-principles-and-rules.md).
- Para **investigaciones academicas** explorando las propiedades y limitaciones del protocolo, ver [Investigación del consenso](consensus-research.md).
