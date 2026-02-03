# XRP Ledger Transaction Tester

Una aplicación web interactiva para probar transacciones en XRP Ledger usando redes de prueba (Testnet/Devnet). Permite crear wallets, solicitar XRP del faucet, enviar transacciones Payment y consultar balances en tiempo real.

## Características

- 🔌 Conexión a Testnet y Devnet vía WebSocket
- 👛 Generación automática de wallets de prueba
- 💰 Solicitud de XRP gratuito desde faucets
- 📤 Envío de transacciones Payment
- 🔍 Consulta de balances y transacciones por hash
- 📊 Historial de transacciones de la sesión
- 🌙 Modo oscuro/claro

## Cómo usar

1. Abre `index.html` en tu navegador
2. Selecciona la red (Testnet o Devnet)
3. Haz clic en "Conectar" para establecer conexión WebSocket
4. Genera un wallet de prueba o usa uno existente
5. Solicita XRP del faucet para financiar tu wallet
6. Envía transacciones de prueba y monitorea los resultados

## Tecnologías

- HTML5, CSS3, JavaScript vanilla
- xrpl.js library (vía CDN)
- WebSocket API para conexión en tiempo real
- Responsive design

## Propósito Educativo

Esta herramienta está diseñada para desarrolladores que quieren aprender y experimentar con el XRP Ledger sin riesgo, usando redes de prueba con fondos no reales.
