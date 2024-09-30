---
html: nftoken-authorized-minting.html
parent: non-fungible-tokens.html
seo:
    description: NFTのMintを他のアカウントに代行してもらうことができます。
labels:
 - 非代替性トークン, NFT
---
# NFT処理を他のアカウントに委任

各アカウントは、自分に代わってNFTをMintすることができる認可されたMinterを最大一人設定することができまます。認可Minter機能を利用することで、クリエイターは別のアカウントにNFTをMintさせることができ、より多くのNFTを作ることに集中することができます。

## 認可Minterの割り当て

認可Minterを`AccountSet`トランザクションで設定します。

```js
tx_json = {
  "TransactionType": "AccountSet",
  "Account": "rrE5EgHN4DfjXhR9USecudHm7UyhTYq6m",
  "NFTokenMinter": "r3riWB2TDWRmwmT7FRKdRHjqm6efYu4s9C",
  "SetFlag": xrpl.AccountSetAsfFlags.asfAuthorizedNFTokenMinter
}
```

`NFTokenMinter` 同じXRP Ledgerインスタンス上のアカウントのIDです。`asfAuthorizedNFTokenMinter`フラグは`NFTokenMinter`に指定するアカウントが`Account`の代理としてNFTをMintすることを許可します。

*注記*: `asfAuthorizedNFTokenMinter`フラグは`AccountSet`トランザクションでのみ使用されます。これは、トランザクションがAccountRoot上のNFTokenMinterフィールドの存在または値に影響を与えるかどうかを示します。実際、AccountRootには対応するフラグはありません。

## 認可Minterの割り当て解除

認可Minterを削除するには、`AccountSet`トランザクションを使用して、`asfAuthorizedNFTokenMinter`フラグをクリアしてください。

```js
tx_json = {
  "TransactionType": "AccountSet",
  "Account": "rrE5EgHN4DfjXhR9USecudHm7UyhTYq6m",
  "ClearFlag": xrpl.AccountSetAsfFlags.asfAuthorizedNFTokenMinter
}
```

## 他のアカウントのNFTをMintする

標準的な `NFTokenMint` トランザクションを使用して、別のアカウントのNFTをMintすることができます。違いは、`Issuer`フィールド、つまりNFTをMintするアカウントのIDを含める必要があることです。

```js
const transactionBlob = {
  "TransactionType": "NFTokenMint",
  "Account": "r3riWB2TDWRmwmT7FRKdRHjqm6efYu4s9C",
  "URI": xrpl.convertStringToHex("ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi"),
  "Flags": 8,
  "TransferFee": 5000,
  "NFTokenTaxon": 0,
  "Issuer": "rrE5EgHN4DfjXhR9USecudHm7UyhTYq6m", // 別アカウントでMintする際に必要
}
```

NFTの所有者がNFTを売却した場合、取引手数料（売却額に対する割合）が`Issuer`に指定したアカウントに送金されまれます。
