---
seo:
    description: Create NFTs with the option of changing the URI to update its referenced data object.
labels:
  - Non-fungible Tokens, NFTs
---

# Dynamic Non-Fungible Tokens (dNFTs)

Standard NFTs are immutable. Some use cases would benefit from the capability to update the referenced data object after the initial minting of an NFT. For example, a concert ticket for a postponed event could be updated with an alternate date, or a virtual trading card for an athlete could be periodically updated with current statistics. Dynamic Non-Fungible Tokens (dNFTs) provide the flexibility required for these use cases.

## Creating a dNFT

When minting a new NFT, set the `tfMutable` flag (`0x00000010`) to enable the ability to update the NFT's `URI` field.

## Modifying a dNFT

Use the `NFTokenModify` transaction to update the URI field of a dNFT. Provide the `Account` of the issuer or an authorized minter, the `Owner` of the dNFT, the `NFTokenID`, and the `URI` to the new object data.

### Sample NFTokenModify Transaction

```json
{
  "TransactionType": "NFTokenModify",
  "Account": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
  "Owner": "rogue5HnPRSszD9CWGSUz8UGHMVwSSKF6",
  "Fee": "10",
  "Sequence": 33,
  "NFTokenID": “0008C350C182B4F213B82CCFA4C6F59AD76F0AFCFBDF04D5A048C0A300000007",
  "URI": "697066733A2F2F62616679626569636D6E73347A736F6C686C6976346C746D6E356B697062776373637134616C70736D6C6179696970666B73746B736D3472746B652F5665742E706E67",
  }
```