---
html: amendments.html
parent: networks-and-servers.html
seo:
    description: Las enmiendas representan nuevas funcionalidades u otros cambios para el procesamiento de transacciones. Los validadores se coordinan a través del consenso para aplicar estas mejoras al XRP Ledger  de manera ordenada.
labels:
  - Blockchain
---
# Enmiendas

Las enmiendas representan nuevas funcionalidades u otros cambios en el procesamiento de transacciones. 

El sistema de enmiendas utiliza el proceso de consenso para aprobar cualquier cambio que afecte el procesamiento de transacciones en el XRP Ledger. Los cambios en el proceso de transacción completamente funcionales se introducen como enmiendas; luego, los validadores votan sobre estos cambios. Si una enmienda recibe más del 80% de apoyo durante dos semanas, la enmienda se aprueba y el cambio se aplica permanentemente a todas las versiones de ledgers subsiguientes. Deshabilitar una enmienda aprobada requiere una nueva enmienda para hacerlo.

**Nota:** Las correcciones de errores que cambian los procesos de transacción también requieren enmiendas.

<!-- TODO: Move this to an amendment tutorial.
Every amendment has a unique identifying hex value and a short name. The short name is for readability only; servers can use different names to describe the same amendement ID, and the names aren't guaranteed to be unique. The amendment ID should be the SHA-512Half hash of the amendment's short name.
-->

## Proceso de enmienda

El apartado [Código de contribución al XRP Ledger](/resources/contribute-code/index.md) describe el flujo de trabajo para desarrollar una enmienda desde una idea hasta su activación en el XRP Ledger.

Después de que el código para una enmienda se incluye en una versión de software o software release, el proceso para habilitarlo ocurre dentro de la red del XRP Ledger, que verifica el estado de las enmiendas en cada _flag_ ledger (generalmente cada 15 minutos).

Cada 256º ledger se llama **flag** ledger. El flag ledger no tiene contenidos especiales, pero el proceso de enmienda ocurre alrededor suyo.

1. **Flag Ledger -1:** Cuando los validadores `rippled` envían mensajes de validación, también envían sus votos sobre enmiendas.
2. **Flag Ledger:** Los servidores interpretan los votos de los validadores confiables.
3. **Flag Ledger +1:** Los servidores insertan la pseudo transacción `EnableAmendment` y marcan dependiendo de lo que piensan que ha pasado:
    * El flag (o marca) `tfGotMajority` significa que la enmienda tiene más del 80% del apoyo.
    * El flag (o marca) `tfLostMajority` significa que el apoyo de la enmienda ha descendido al 80% o menos.
    * Que no haya flag (o marca) significa que la enmienda está activada.

    **Nota:** Es posible para una enmienda perder el 80% del apoyo en el mismo ledger en el que alcanza el periodo de dos semanas para ser activada. En esos casos, una pseudo-transaccion `EnableAmendment` es añadida en ambos escenarios, pero la enmienda es activada finalmente. 

4. **Flag Ledger +2:** Enmiendas activadas aplican a transacciones en este ledger en adelante.


## Votación de enmienda

Cada versión de `rippled` es compilada con una lista de [enmiendas conocidas](/resources/known-amendments.md) y el código para implementar esas enmiendas. Los operadores de los validadores `rippled` configuran sus servidores para votar en cada enmienda y cambiarlo en cada momento. Si un operador no elige un voto, el servidor por defecto tiene un voto definido en el códido fuente.

**Nota:** El voto por defecto cambia entre las publicaciones del software. {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.8.1" %}Actualizado en: rippled 1.8.1{% /badge %}

Las enmiendas deben mantener dos semanas el apoyo de más del 80% de los validadores confiables para activarse. Si el apoyo baja por debajo del 80%, la enmienda es temporalmente rechazada , y el periodo de dos semanas se reinicia. Las enmiendas pueden ganar y perder una mayoría cualquier cantidad de veces antes de que se habiliten permanentemente.

Las enmiendas que hayan tenido su código fuente removido sin haberse activado on consideradas **vetadas** por la red.


## Servidores bloqueados por enmienda
<a id="amendment-blocked"></a>

El bloqueo por enmienda es una característica de seguridad para proteger la precisión de los datos del XRP Ledger. Cuando una enmienda se activa, los servidores ejecutando versiones anteriores de `rippled` sin el código fuente de la enmienda ya no consiguen entender las reglas de la red. En vez de adivinar y malinterpretar los datos del ledger, estos servidores se convierten en servidores **bloqueados por enmienda** y no pueden:

* Determinar la validez de un ledger.
* Enviar o procesar transacciones.
* Participar en el proceso de consenso.
* Votar sobre futuras enmiendas.

La configuración de votación de un servidor `rippled` no tiene impacto en convertirse en un servidor bloqueado por enmienda. Un servidor `rippled` siempre sigue las enmiendas activadas por el resto de la red, por lo que los bloqueos solo se basan en tener el código para entender los cambios de reglas. Esto significa que tu también te puedes convertir en alguien bloqueado por enmienda si conectas tu servidor a una red paralela con enmiendas activadas. Por ejemplo, La Devnet de XRP normalmente tiene enmiendas experimentales activadas. Si estás utilizando la última publicación o release en producción, tu servidor no tendrá ese código de esas enmiendas experimentales.

Puedes debloquear servidores bloqueados por enmienda actualizando a la última versión de `rippled`.

### Servidores Clio bloqueados por enmienda

Los servidores Clio pueden bloquearse por enmienda si se encuentran un tipo de campo desconocido mientras cargan los datos del ledger. Esto ocurre si el campo es más nuevo que la dependencia de `libxrpl` usada cuando se construye Clio. Para desbloquear tu servidor Clio, actualiza a la última release de Clio que se publicó con un `libxrpl` compatible.

## Retiro de enmiendas

Cuando las enmiendas son activadas, el código fuente de comportamientos previos a la enmienda permanece en `rippled`. Mientras hay casos de uso para mantener el código antiguo, como la reconstrucción de resultados de los ledgers para verificación, el seguimiento de enmiendas y código heredado agrega complejidad con el tiempo.

El [Estándar 11d de XRP Ledger](https://github.com/XRPLF/XRPL-Standards/discussions/19) define un proceso para retirar enmiendas antiguas y código asociado previo a la enmienda. Después de que una enmienda haya sido activada en Mainnet por dos años, puede ser retirado. Retirar una enmienda la convierte en parte del protocolo central incondicionalmente; ya no se sigue ni se trata como una enmienda, y todo el código anterior a la enmienda es eliminado.


## Ver también

- **Conceptos:**
    - [Consenso](../consensus-protocol/index.md)
- **Tutoriales:**
    - [Ejecutar rippled como un validador](../../infrastructure/configuration/server-modes/run-rippled-as-a-validator.md)
    - [Configurar votación de enmiendas](../../infrastructure/configuration/configure-amendment-voting.md)
    - [Contribuir al código del XRP Ledger](/resources/contribute-code/index.md)
- **Referencias:**
    - [Enmiendas conocidas](/resources/known-amendments.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
