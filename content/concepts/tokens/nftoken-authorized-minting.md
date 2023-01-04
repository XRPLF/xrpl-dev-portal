---
html: nftoken-authorized-minting.html
parent: non-fungible-tokens.html
blurb: You can assign another account to mint NFTs in your stead.
labels:
 - Non-fungible Tokens, NFTs
---

# Authorizing Another Account to Mint Your NFTs

Each account can have 0 or 1 authorized minter that can mint NFTs on its behalf. Combined with the brokered sales, creators would have the option of allowing other accounts to mint and sell NFTs for them, so that they can focus on making more NFTs. 

## Assigning an Authorized Minter

You set the authorized minter with an `AccountSet` transaction.

``` json
tx_json = {
  "TransactionType": "AccountSet",    
  "Account": "rrE5EgHN4DfjXhR9USecudHm7UyhTYq6m",
  "NFTokenMinter": "r3riWB2TDWRmwmT7FRKdRHjqm6efYu4s9C",
  "SetFlag": xrpl.AccountSetAsfFlags.asfAuthorizedNFTokenMinter
}
```

_NFTokenMinter_ is an account ID of an account on the same XRP Ledger instance. The `asfAuthorizedNFTokenMinter` flag authorizes the `NFTokenMinter` account to mint NFTs on behalf of the `Account`.

*Note*: The `asfAuthorizedNFTokenMinter` flag is used only in the `AccountSet` transaction. It indicates whether the transaction affects the presence or value of the NFTokenMinter field on an account root. Specifically, there is no corresponding flag on the AccountRoot.


## Minting an NFT for Another Account

You mint tokens for another account using the same `NFTokenMint` transaction you use for minting your own tokens. The difference is that you include the `Issuer` field, the account ID of the account for which you are minting the NFT.

```json
const transactionBlob = {
  "TransactionType": "NFTokenMint",
  "Account": "r3riWB2TDWRmwmT7FRKdRHjqm6efYu4s9C",
  "URI": xrpl.convertStringToHex("ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi"),
  "Flags": 8,
  "TransferFee": 5000,
  "NFTokenTaxon": 0
  "Issuer": "rrE5EgHN4DfjXhR9USecudHm7UyhTYq6m", // Needed when minting for another
                                                 // account.
}
```

When you or a broker sells the NFT, the TransferFee (percentage of sale) is credited to your issuing account.
