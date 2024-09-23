---
html: crypto-wallets.html
parent: intro-to-xrpl.html
seo:
    description: Las carteras brindan una forma conveniente de administrar tu XRP en el XRP Ledger.
labels:
  - Blockchain
---
# Carteras cripto

Las carteras cripto brindan una forma de administrar tu cuenta y tus fondos en el XRP Ledger. Hay muchas carteras para elegir. Al final, elegir la cartera adecuada se reduce a tus necesidades y a tus gustos al trabajar con XRP.


## Carteras con custodia vs carteras sin custodia

Un factor importante cuando se elige una cartera es si se desea que sea una cartera con custodia o sin custodia.

Una cartera con custodia significa que un tercero tiene tus fondos, normalmente en una cuenta que ellos manejan en el XRP Ledger. Una cartera con custodia puede considerarse como un banco, donde confias que otra entidad mantenga tu dinero seguro. Muchos exchanges centralizados ofrecen carteras con custodia, por lo que cuando creas una cuenta con ellos y usas su app, técnicamente no tienes una cuenta en el libro contable (ledger).

Para los pagos del día a día, esto puede ser preferible, ya que este tipo de carteras son fáciles de usar: si te olvidas de tu contraseña, puedes resetearla. Además, si no tienes una cuenta propia en el XRP Ledger, el requisito de tener una reserva en la cuenta no te aplica. El custodio actua como intermediario ante cualquier problema que encuentres en el XRP Ledger, y puede ofrecerte asistencia si no estás seguro de como hacer algo.

![Carteras con custodia vs carteras sin custodia](/docs/img/introduction15-custodial-non-custodial.png)

Una cartera sin custodia, como [Xaman](https://Xaman.app/), es aquella donde tienes las claves secretas (secret keys) de tu cuenta. Esto significa que eres el último reponsable de la administración de la seguridad de tu cuenta.

**Atención:** Si pierdes tus claves, perderás el acceso a tu cuenta del XRP Ledger y no hay opciones de recupereación.

Las carteras sin custodia te permiten tener más libertad. Como estás interactuando directamente con el XRP LEdger, puedes manejar cualquier tipo de transacción que tu quieras sin que nadie restrinja tus opciones. Si el libro contable (ledger) lo permite, lo puedes hacer. Las carteras sin custodia no requieren confiar tu dinero a una institución, lo que permite alejarte de los factores del mercado fuera de tu control.

Tanto los usuarios de carteras con custodia como los usuarios de carteras sin custodia deben protegerse de usuarios malintencionados que podrían intentar robar tus fondos. Con una cartera con custodia, debes administrar tu nombre de usuario y contraseña en la app o en el sitio web; en una cartera sin custodia, tienes que administrar las claves secretas (secrect keys) de tu cuenta en el libro contable (ledger). En ambos casos, las prácticas de seguridad propias del proveedor de la cartera también son importantes para protegerte de vulnerabilidades como ataques a la cadena de suministro, donde un atacante carga código malicioso en la cartera a través de actualizaciones o dependencias. Sin embargo, las carteras con custodia pueden ser un objetivo mayor para los atacantes, ya que tienen acceso inmediato a los fondos de múltiples usuarios.


## Carteras de software vs Carteras de hardware

Otro factor decisivo a la hora de elegir una cartera es elegir entre una cartera de hardware o de software.

Las carteras de hardware son dispositivos físicos que almacenan tus claves privadas/secretas. El beneficio principal de usar carteras de hardware es que puedes proteger tu información desconectándola de Internet cuando no se esté usando; Las carteras de hardware aíslan totalmente sus claves de ordenadores y teléfonos inteligentes más faciles de hackear.

![Carteras de Hardware vs. Software](/docs/img/introduction16-hardware-software.png)

Las carteras de software por el otro lado, son completamente digitales. Mientras esto las hace mucho más fáciles, también las convierte en el método menos seguro de los dos, pero generalmente vienen con funciones adicionales para mejorar la experiencia. Como última instancia, la decisión entre las dos dependerá de tu nivel de comidad y de lo importante que sea para ti la facilidad de uso.


## Crear tu propia cartera

El XRP Ledger es un proyecto de código abierto con librerías de cliente y métodos API disponibles públicamente. Si bien técnicamente se puede interactuar con el ledger utilizando herramientas HTTP/WebSocket, no es práctico para el uso del día a día. Puedes crear tu propia cartera para interactuar con el ledger, pero necesitarás entender exáctamente cómo funcionan las cuentas, transacciones y el ledger juntas antes de comprometerte con esta opción.


Siguiente: [Transacciones y peticiones](transactions-and-requests.md)
