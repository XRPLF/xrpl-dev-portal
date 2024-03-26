---
category: 2022
date: 2022-11-15
labels:
    - Developer Reflections
theme:
    markdown:
        editPage:
            hide: true
---
# Developer Reflections: CryptoIso20022 Interop

We’re excited to be reigniting Developer Reflections, and kicking off this week we’re proud to highlight [CryptoIso20022 Interop](https://github.com/radynamics/CryptoIso20022Interop), which enables interoperability between ISO 20022 file formats and cryptocurrency payments to facilitate sending and processing received crypto payments within existing financial software's ISO 20022 capabilities. In other words, CryptoIso20022 Interop is a product to simplify accounting workflows for small to medium-sized enterprizes. 

<!-- BREAK -->

Currently, users in accounting have to export payment instructions in ISO 20022 formats. CryptoIso20022 Interop automates the transformation of fiat payments into crypto payments and executes them. The component is compatible with existing functionality in accounting software, and brings real-time payments to a process that currently takes days. Using standard file formats, your enterprise financial software doesn’t need to implement any cryptocurrency functionality at all to benefit from its advantages.

As a payer, you can also import pain.001 XML files exported from your financial software and transform payment instructions into cryptocurrency payments. For every transaction you wish to send using cryptocurrency, you must define a cryptocurrency address (receiver wallet) for a given IBAN or proprietary account number.

As a payee you can fetch received cryptocurrency payments from your wallet and transform received payments into the camt.054 XML format for your financial software.

![Screenshot: Payment Detail](/blog/img/cryptoiso20022-payment-detail.png)

![Screenshot: Balances](/blog/img/cryptoiso20022-balances.png)

![Screenshot: Send Payments](/blog/img/cryptoiso20022-send-payments.png)

Built on the XRP Ledger Mainnet using [xrpl4j](https://github.com/XRPLF/xrpl4j), CryptoIso20022 Interop only needs a connection to the XRP Ledger, without any other backend software. What’s more, no registration/software account is needed. 

CryptoIso20022 Interop chose the XRP Ledger for its speed, transaction costs and sustainability. 

To learn more about CryptoIso20022 Interop, visit <https://github.com/radynamics/CryptoIso20022Interop>.
