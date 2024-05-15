---
html: witness-servers.html
parent: xrpl-sidechains.html
seo:
    description: A witness server is a light-weight server that witnesses and signs transactions between the XRP Ledger and another chain.
status: not_enabled
labels:
  - Blockchain
  - Interoperability
---
# Witness Servers
[[Source]](https://github.com/seelabs/xbridge_witness "Source")

_(Requires the [XChainBridge amendment][] {% not-enabled /%})_

A _witness server_ acts as a neutral witness for transactions between a locking chain and an issuing chain. It listens to the door accounts on both sides of a bridge and signs attestations that confirm a transaction occurred. They are essentially acting as an oracle to “prove” that value was locked or burned on a source account, which allows the recipient to then claim (via minting or unlocking) the equivalent funds on the destination account.

The bridge between the locking chain and the issuing chain includes the following information in its configuration: 

* Witness servers that monitor transactions on the bridge. You can choose one or more witness servers. 
* Fee for witness servers for their service.

Anyone can run a witness server. However, the burden is on the participants of the issuing chain to evaluate the reliability of witness servers. If you run a witness server, you must also run a `rippled` node and sync it to the chain the witness server needs access to.

**Note:** Issuing chains may choose to configure a bridge with only one witness server initially and run the witness server itself. This strategy is helpful in the initial period, when the issuing chain hasn't established itself yet in the marketplace.


## Witness Server Configuration

The witness server takes a JSON configuration file, specified using the `--conf` command-line argument.


### Example Configuration JSON

```json
{
  "LockingChain": {
    "Endpoint": {
      "Host": "127.0.0.1",
      "Port": 6005
    },
    "TxnSubmit": {
      "ShouldSubmit": true,
      "SigningKeySeed": "shUe3eSgGK4e6xMFuCakZnxsMN1uk",
      "SigningKeyType": "ed25519",
      "SubmittingAccount": "rpFp36UHW6FpEcZjZqq5jSJWY6UCj3k4Es"
    },
    "RewardAccount": "rpFp36UHW6FpEcZjZqq5jSJWY6UCj3k4Es"
  },
  "IssuingChain": {
    "Endpoint": {
      "Host": "127.0.0.1",
      "Port": 6007
    },
    "TxnSubmit": {
      "ShouldSubmit": true,
      "SigningKeySeed": "shUe3eSgGK4e6xMFuCakZnxsMN1uk",
      "SigningKeyType": "ed25519",
      "SubmittingAccount": "rpFp36UHW6FpEcZjZqq5jSJWY6UCj3k4Es"
    },
    "RewardAccount": "rpFp36UHW6FpEcZjZqq5jSJWY6UCj3k4Es"
  },
  "RPCEndpoint": {
    "Host": "127.0.0.1",
    "Port": 6010
  },
  "DBDir": "/var/lib/witness/witness01/db",
  "LogFile": "/var/log/witness/witness01.log",
  "SigningKeySeed": "spkHEwDKeChm8PAFApLkF1E2sDs6t",
  "SigningKeyType": "ed25519",
  "XChainBridge": {
    "LockingChainDoor": "r3nCVTbZGGYoWvZ58BcxDmiMUU7ChMa1eC",
    "LockingChainIssue": {
      "currency": "XRP"
    },
    "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "IssuingChainIssue": {
      "currency": "XRP"
    }
  },
  "Admin": {
    "Username": "username01",
    "Password": "password01"
  }
}
```


### Configuration Fields

| Field Name       | JSON Type      | Required? | Description |
|------------------|----------------|-----------|-------------|
| `Admin`          | Object         | No        | The `Username` and `Password` fields (as strings) for privileged requests to the witness server. **Note:** Both or none of the admin fields must be set. |
| [`IssuingChain`](#issuingchain-and-lockingchain-fields) | Object         | Yes       | The parameters for interacting with the issuing chain. |
| [`LockingChain`](#issuingchain-and-lockingchain-fields) | Object         | Yes       | The parameters for interacting with the locking chain. |
| `RPCEndpoint`    | Object         | Yes       | The endpoint for RPC requests to the witness server. |
| `LogFile`        | String         | Yes       | The location of the log file. | 
| `LogLevel`       | String         | Yes       | The level of logs to store in the log file. The options are `All`, `Trace`, `Debug`, `Info`, `Warning`, `Error`, `Fatal`, `Disabled`, and `None`. |
| `DBDir`          | String         | Yes       | The location of the directory where the databases are stored. |
| `SigningKeySeed` | String         | Yes       | The seed that the witness server should use to sign its attestations. |
| `SigningKeyType` | String         | Yes       | The algorithm used to encode the `SigningKeySeed`. The options are `secp256k1` and `ed25519`. |
| [`XChainBridge`](#xchainbridge-fields) | XChainBridge   | Yes       | The bridge that the witness server is monitoring. |


#### IssuingChain and LockingChain Fields

| Field Name      | JSON Type | Required? | Description |
|-----------------|-----------|-----------|-------------|
| `Endpoint`      | Object    | Yes       | The websocket endpoint of a `rippled` node synced with the chain. **Note:** The same person needs to control the `rippled` node and witness server. |
| `TxnSubmit`     | Object    | Yes       | The parameters for transaction submission on the chain. |
| `RewardAccount` | String    | Yes       | The account that should receive the witness's share of the `SignatureReward` on the chain. |


#### Endpoint Fields

| Field Name | JSON Type | Required? | Description |
|------------|-----------|-----------|-------------|
| `Host`     | String    | Yes       | The IP address of the `rippled` node. **Note:** This accepts an IPv4 address or URL. |
| `Port`     | String    | Yes       | The port used for the websocket endpoint. |


#### RPCEndpoint Fields

| Field Name | JSON Type | Required? | Description |
|------------|-----------|-----------|-------------|
| `Host`     | String    | Yes       | The IP address of the witness server for RPC requests. **Note:** This accepts an IPv4 address or URL. |
| `Port`     | String    | Yes       | The port used for the websocket endpoint. |


#### TxnSubmit Fields

| Field Name          | JSON Type | Required? | Description |
|---------------------|-----------|-----------|-------------|
| `ShouldSubmit`      | Boolean   | Yes       | A boolean indicating whether or not the witness server should submit transactions on the locking chain. |
| `SigningKeySeed`    | String    | No        | The seed that the witness server should use to sign its transactions on the locking chain. This is required if `ShouldSubmit` is `true`. |
| `SigningKeyType`    | String    | No        | The algorithm used to encode the `SigningKeySeed`. The options are `secp256k1` and `ed25519`. This is required if `ShouldSubmit` is `true`. |
| `SubmittingAccount` | String    | No        | The account from which the `XChainAddClaimAttestation` and `XChainAddAccountCreateAttestation` transactions should be sent. This is required if `ShouldSubmit` is `true`. |


#### XChainBridge Fields

| Field               | JSON Type | [Internal Type][] | Required? | Description     |
|:--------------------|:----------|:------------------|:----------|:----------------|
| `IssuingChainDoor`  | String    | Account           | Yes       | The door account on the issuing chain. For an XRP-XRP bridge, this must be the genesis account (the account that is created when the network is first started, which contains all of the XRP). |
| `IssuingChainIssue` | Issue     | Issue             | Yes       | The asset that is minted and burned on the issuing chain. For an IOU-IOU bridge, the issuer of the asset must be the door account on the issuing chain, to avoid supply issues. |
| `LockingChainDoor`  | String    | Account           | Yes       | The door account on the locking chain. |
| `LockingChainIssue` | Issue     | Issue             | Yes       | The asset that is locked and unlocked on the locking chain. |


## Witness Server FAQs

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
