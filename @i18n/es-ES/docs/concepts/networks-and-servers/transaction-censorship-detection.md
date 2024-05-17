---
html: transaction-censorship-detection.html
parent: networks-and-servers.html
seo:
    description: El XRP Ledger proporciona un detector de censura de transacciones automatizado que está disponible en todos los servidores rippled.
labels:
  - Blockchain
---
# Detección de censura de transacciones

{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.2.0" %}Nuevo en: rippled 1.2.0{% /badge %}

El XRP Ledger está diseñado para ser resistente a la censura. En apoyo a este diseño, el XRP Ledger proporciona un detector automatizado de censura de transacciones que está disponible en todos los servidores `rippled`, permitiendo que todos los participantes vean si la censura está afectando a la red.

Mientras un servidor `rippled` está sincronizado con la red, el detector rastrea todas las transacciones que deberían haber sido aceptadas en la última ronda de [consensus](../consensus-protocol/index.md) e incluidas en el último ledger validado. El detector emite mensajes de registro de severidad creciente cuando ve transacciones que no han sido incluidas en un ledger validado después de varias rondas de consenso.



## ¿Cómo funciona?

A alto nivel, así es cómo el detector de censura de transacciones funciona:

1. El detector agrega todas las transacciones en la propuesta de consenso inicial del servidor al rastreador.

2. Al cierre de la ronda de consenso, el detector elimina todas las transacciones incluidas en el ledger validado resultante del rastreador.

3. El detector emite un [mensaje de advertencia](#ejemplo-de-mensaje-de-advertencia) en el registro para cualquier transacción que permanezca en el rastreador durante 15 ledgers, mostrándola como una transacción potencialmente censurada. La presencia de la transacción en el rastreador en este momento significa que no ha sido incluida en un ledger validado después de 15 rondas de consenso. Si la transacción permanece en el rastreador durante otros 15 ledgers, el detector emite otro mensaje de advertencia en el registro.

    Mientras la transacción permanezca en el rastreador, el detector continuará emitiendo un mensaje de advertencia en el registro cada 15 ledgers, hasta cinco mensajes de advertencia. Después del quinto mensaje de advertencia, el detector emite un [mensaje de error](#ejemplo-de-mensaje-de-error) final en el registro y luego deja de emitir mensajes de advertencia y error.

    Si ves estos mensajes en el registro de tu servidor rippled, debes investigar por qué otros servidores no están incluyendo la transacción, comenzando con la suposición de que la causa es más probable que sea un [falso positivo](#potenciales-falsos-positivos) (error inocente) que una censura maliciosa.

## Ejemplo de mensaje de advertencia

Esto es un ejemplo de mensaje de advertencia emitido por el detector de censura de transacciones de que la transacción E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7 permaneciese en el rastreador por 15 ledgers, desde el ledger 18851530 hasta el ledger 18851545.

```text
LedgerConsensus:WRN Potential Censorship: Eligible tx E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7, which we are tracking since ledger 18851530 has not been included as of ledger 18851545.
```


## Ejemplo de mensaje de error

Este es un ejemplo de mensaje de error emitido por el detector de censura de transacciones después de que la transacción E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7 permaneciese en el rastreador por 75 ledgers (5 conjuntos de 15 ledgers), desde el ledger 18851530 hasta el ledger 18851605.

```text
LedgerConsensus:ERR Potential Censorship: Eligible tx E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7, which we are tracking since ledger 18851530 has not been included as of ledger 18851605. Additional warnings suppressed.
```


## Potenciales falsos positivos

El detector de censura de transacciones puede emitir falsos positivos en ciertos escenarios. En este caso, un falso positivo significa que el detector ha marcado una transacción que ha permanecido en el rastreador durante 15 ledgers o más, pero por razones inocentes.

Aquí hay algunos escenarios que podrían causar que el detector emita mensajes de falsos positivos:

- Tu servidor está ejecutando una compilación con código diferente al resto de la red. Esto puede hacer que tu servidor aplique transacciones de manera diferente, lo que resulta en falsos positivos. Si bien este tipo de falsos positivos es poco probable en general, es crucial que ejecutes una versión compatible del servidor principal del XRP Ledger.

- Tu servidor está fuera de sincronización con la red y aún no lo ha notado.

- Los servidores en la red, incluido posiblemente tu propio servidor, tienen un error que les hace transmitir transacciones de manera inconsistente a otros servidores en la red.

    Actualmente, no se conocen errores que causen este comportamiento inesperado. Sin embargo, si ves el impacto de lo que sospechas que es un error, considera reportarlo al programa [Ripple Bug Bounty](https://ripple.com/bug-bounty/).


## Ver también

- **Conceptos:**
    - [Principio de consenso y reglas](../consensus-protocol/consensus-principles-and-rules.md)
    - [Cola de transacciones](../transactions/transaction-queue.md)
- **Tutoriales:**
    - [Envío confiable de transacciones](../transactions/reliable-transaction-submission.md)
    - [Entendiendo los mensajes de registro](../../infrastructure/troubleshooting/understanding-log-messages.md)
- **Referencias:**
    - [Resultados de transacciones](../../references/protocol/transactions/transaction-results/index.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
