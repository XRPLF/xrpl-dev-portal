---
html: xrpl-sidechains.html
parent: concepts.html
seo:
    description: An XRPL sidechain is an independent ledger with its own consensus algorithm, transaction types, and rules.
labels:
  - Blockchain
  - Interoperability
---
# XRPL Sidechains

_(Requires the [XChainBridge amendment][] {% not-enabled /%})_

A sidechain is an independent ledger with its own consensus algorithm, transaction types, rules, and nodes. It acts as its own blockchain, running parallel to the mainchain (XRP Ledger), enabling value to move between the two without compromising the speed, efficiency, and throughput of the mainchain.

Sidechains can customize the XRP Ledger protocol to the needs of a specific use case or project and run it as its own blockchain. Some examples include:

* Adding a smart contract layer. See: [Xahau](https://xahau.network/)
* Adding Ethereum Virtual Machine (EVM) compatibility. See: [EVM Sidechain](https://opensource.ripple.com/docs/evm-sidechain/intro-to-evm-sidechain/).
* Building your own algorithmic stable coin with customised ledger types and transaction rules.
* Building permissioned or nearly permissionless, centralized or largely decentralized ledgers whose assets can be traded on the Mainnet [decentralized exchange](../tokens/decentralized-exchange/index.md).


**Notes:**

  - Sidechains use their own validators and require a separate UNL from the mainchain `rippled` UNL.
  - Nodes on the mainchain and sidechain have no knowledge of each other.


## Legal FAQs

### What is a Sidechain?

A sidechain is a separate blockchain that links the XRPL Mainnet chain (the “Mainchain”) to a sidechain (each a “Sidechain”), allowing for cross-chain exchanges of assets and information.


### What are Witness Servers?

“Witness Servers” validate transfers between “door wallets” that connect the Mainchain to each Sidechain.  A series of decentralized entities and individuals will operate Witness Servers.


### Are there risks associated with operating a Witness Server?

There are certain risks associated with operating a Witness Server for a Sidechain, including the following:

_Regulatory Considerations_:  Operating a Witness Server carries some regulatory risk.  A few risks are identified below, some of which pertain to regulatory regimes that only apply to projects that serve those located in the U.S.  U.S. regimes are identified here because they are commonly considered some of the strictest regulatory regimes in the world.

The regulatory regime in the U.S. concerning the operation of a “money transmitting business” requiring federal registration as a money service business (“MSB”) and state money transmitter licenses (“MTLs”) is unclear as it pertains to operating Witness Servers.  The Witness Servers are intended to be operated by a series of decentralized entities and persons.  Despite this intention, if a regulator determined that there was “centralized” control of the Witness Servers by a particular entity or coordinated group, it may deem such activity to be money transmission.  The U.S. Treasury Department recently issued a report identifying a series of factors it would consider when determining whether a particular project is “decentralized.”  See [2023 DeFi Illicit Finance Risk Assessment](https://home.treasury.gov/news/press-releases/jy1391).  This recent regulatory guidance is important because it indicates that the U.S. Treasury recognizes that certain projects may be “decentralized” and if the operation of the Witness Servers is “decentralized” it may not be considered a “money transmitting business.”

While U.S. crypto regulations have consistently remained among the most stringent and aggressively enforced, other jurisdictions also  have regulation and laws relating to the transfer of “money” and other value.  For example, in March of 2022, U.K. regulatory authorities published a series of documentary guidance regarding crypto and decentralized finance.  See [Financial Stability in Focus: Cryptoassets and Decentralized Finance](https://www.bankofengland.co.uk/financial-stability-in-focus/2022/march-2022).  More recently, in June of 2023, the E.U. formally adopted a regulatory framework which in part imposes codified rules and regulations pertaining to decentralized crypto platforms.  See [Markets in Crypto-Assets Regulation](https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica).  For those considering operating a Witness Server, it is critical to stay informed and compliant with the specific requirements of each jurisdiction involved to effectively manage associated risks.

_Technology and Network Security_:  Those intending to run a Witness Server should be familiar with the technical and security aspects of doing so.  Before agreeing to run a Witness Server, one should fully understand the functionality, potential vulnerabilities, and necessary technological and security measures involved.

_Civil Liability_:  Operating a Witness Server, like participating in any blockchain project, carries an unspecified level of civil liability risk.  There has been an influx of plaintiffs’ lawsuits in the U.S. and other jurisdictions, and it is difficult to evaluate what theories a particular plaintiffs’ attorney may implement in a civil lawsuit.  Regardless of any real or perceived civil liability risk, it should be noted that even a frivolous lawsuit could take time and money to respond.


### Should I seek independent advice before agreeing to operate a Witness Server?

Yes.  Any party considering running a Witness Server should seek independent legal and tax advice from experienced professionals.  Please note, that as the Witness Servers must mutually attest to confirm cross-chain transfers, they may be understood to operate as a common enterprise - as it is defined by US regulators.  In a common enterprise, joint and several liability may apply, meaning that each Witness Server could be held individually responsible for all liability or damages incurred.  Given the evolving regulatory landscape, it’s critical to consult with a legal professional who can help navigate the complex and changing global regulatory landscape associated with the expectations and obligations of running a Witness Server.  As with any blockchain project, please do your own research.  These FAQs are just general guidance and are not legal or tax advice.


### Who should not run a Witness Server?

You should not run a Witness Server if you are not experienced (or do not have access to experienced support) in blockchain, MSB and MTL regulations, and other applicable regulations and laws.  You should also not operate a Witness Server if you are not an experienced person or entity with technical and compliance expertise.  Few individuals are qualified and experienced enough to operate Witness Servers on their own.  You should also not operate a Witness Server if you have not sought and obtained independent legal and tax advice.


### Are these FAQs comprehensive and conclusive advice?

No. These FAQs are intended to provide general guidance and do not constitute technical, financial, or legal advice.  These FAQs should not be used as a substitute for professional advice tailored to one’s specific circumstances.  The blockchain and digital asset landscape is complex and constantly changing, which necessitates staying updated and seeking expert advice.  It is recommended that those engaging with a Sidechain regularly check official resources such as governmental and regulatory body websites.  Nonetheless, consulting with legal professionals who specialize in blockchain, and cryptocurrency is the most reliable way to get accurate and personalized advice.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
