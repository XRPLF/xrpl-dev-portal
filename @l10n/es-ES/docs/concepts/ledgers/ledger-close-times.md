---
html: ledger-close-times.html
parent: ledgers.html
seo:
    description: Cómo el XRP Ledger calcula el valor de tiempo de cierre para cada versión del ledger.
labels:
  - Blockchain
---
# Tiempos de cierre del ledger

La hora exacta en la que la versión del ledger se ha cerrado se queda guardada en el campo `close_time` de la cabecera del ledger o [ledger header](../../references/protocol/ledger-data/ledger-header.md). Para hacer más facil a la red llegar a un consenso en un tiempo de cierre exacto, este valor es redondeado a un número de segundos basado en el momento de resolución del cierre, actualmente 10 segundos. Si redondear causase a un tiempo de cierre ser igual que (o anterior) a su ledger padre, el ledger hijo tendrá su tiempo de cierre igual al tiempo de cierre del ledger padre más 1. Esto garantiza que los tiempos de cierre de los ledgers validados son estríctamente incrementales. <!-- STYLE_OVERRIDE: a number of -->

Dado que las nuevas versiones de ledgers se suelen cerrar cada 3 a 5 segundos, estas reglas resultan en un patrón laxo donde el tiempo de cierre de los ledgers termina en :00, :01, :02, :10, :11, :20, :21, y demás. Los tiempos terminados en 2 son menos comunes y los tiempos terminados en 3 son muy raros, pero ambos pueden ocurrir aleatoriamente cuando más ledgers aleatoriamente cierran en ventanas de 10 segundos.

Generalmente hablando, el ledger no puede realizar medidas basadas en el tiempo que la resolución del tiempo de cierre. Por ejemplo, para comprobar si un objeto ha pasado su fecha de caducidad, se utiliza la regla para compararlo con el tiempo de cierre del ledger padre. (El tiempo de cierre de un ledger no es conocido todavía cuando está ejecutando transacciones para introducir en ese ledger.) Esto quiere decir que, por ejemplo, un [Escrow](../payment-types/escrow.md) podría finalizar satisfactoriamente en un momento de la vida real que es 10 segundos después de la caducidad basada en el tiempo especificado en el objeto del Escrow.

### Ejemplo

Los siguientes ejemplos muestran el comportamiento de redondeo en los tiempos de cierre del ledger, desde la perspectiva de un validador por ejemplo, siguiendo un ledger con el tiempo de cierre **12:00:00**:

**Ronda actual de consenso**

1. Un validador observa que eran las **12:00:03** cuando el ledger cierra y entra en consenso. El validador incluye este tiempo de cierre en sus propuestas.
2. El validador observa que la mayoría de otros validadores (en su UNL) propusieron un tiempo de cierre de 12:00:02, y otro ha propuesto un tiempo de cierre de 12:00:03. Esto cambia su tiempo de cierre propuesto para que coincida con el del consenso de **12:00:02**.
3. El validador redondea su valor al intervalo de tiempo de cierre más cercano, resultando en **12:00:00**.
4. Como 12:00:00 no es mayor que el tiempo de cierre del ledger anterior, el validador ajusta el tiempo de cierre para ser exactamente 1 segundo después del tiempo de cierre del anterior ledger. El resultado es un tiempo de cierre ajustado a **12:00:01**.
5. El validador construye el ledger con estos detalles, calcula el hash resultante, y confirma en el paso de validación lo que otros hicieron del mismo modo.

Los servidores que no validan hacen todos los mismos pasos, exceptuando que no proponen sus tiempos de cierre registrados al resto de la red.

**Siguiente ronda de consenso**

1. El siguiente ledger entra en consenso a las **12:00:04** de acuerdo con la mayoría de los validadores.
2. Esto vuelve a redondear hacia abajo otra vez, a un tiempo de cierre de **12:00:00**.
3. Como no es mayor al anterior tiempo de cierre del ledger anterior de las 12:00:01, el tiempo de cierre ajustado es **12:00:02**.

**La siguiente ronda después de esa**

1. El siguiente ledger entra en consenso a las **12:00:05** de acuerdo con la mayoría de validadores.
2. Esto se redondea hacia arriba, según la resolución de tiempo de cierre, a las **12:00:10**.
3. Como el valor es mayor que el tiempo de cierre del ledger anterior, no necesita ser ajustado. **12:00:10** se convierte en la hora de cierre oficial.
