---
category: 2023
date: 2023-05-17
labels:
    - Developer Reflections
theme:
    markdown:
        editPage:
            hide: true
---
# Developer Reflections: Edge

This week on Developer Reflections, we’re proud to highlight [Edge](https://edge.app/), a cryptocurrency platform designed to simplify the management of digital assets. Edge—which is live on Mainnet—enables users to store, send, receive, and exchange a wide range of cryptocurrencies while maintaining control over their private keys. The app prioritizes privacy, accessibility and self-custody, making it easy for both beginners and experienced users to interact with the crypto economy. Edge offers features such as automatic encrypted backups, seamless account creation without complex seed phrases, encrypted password recovery, built in 2FA protection and more.

<!-- BREAK -->

Edge was built using multiple open source technologies, including React Native, Redux, ethers.js, Xrpl.js, etc. The development team behind Edge hopes to make self-custody of digital assets intuitive and accessible, enabling users to interact with crypto and DeFi transactions.

![Screenshot: Edge](/blog/img/dev-reflections-edge.png)

## Why the XRP Ledger?

The XRP Ledger is a decentralized, open-source blockchain platform primarily designed for fast and cost-effective cross-border payments. The Edge team opted to build on the XRP Ledger for a few reasons:

* Edge was among the first multi-asset wallets to support XRP, complete with swap functionality, and wanted to capitalize on this existing integration to help continue expanding the app's features.

* Low fees: the XRP Ledger boasts incredibly low transaction fees, often just a fraction of a cent. This is highly advantageous for applications that prioritize minimizing costs, such as those involving micropayments or remittance services.

* A vibrant and active developer community supports and contributes to the XRP Ledger, offering comprehensive documentation and tools to assist developers in building on the platform. This robust support network makes it easier for newcomers to get started and develop top-quality applications.

Specific design considerations taken into account when building on the XRP Ledger included scalability, open source, community and support, interoperability, and integration with APIs and libraries. Since launch, Edge has seen an average of 60k-160k MAUs and over 3 million active accounts and will be building out wallet support for stablecoins on the XRPL in an upcoming release.


Want to be featured in the Developer Reflections series? [Submit your project](https://xrpl.org/contribute.html#xrpl-blog) today, and join the [developer Discord channel](https://discord.gg/sfX3ERAMjH) to connect with other members of the XRP Ledger community.

