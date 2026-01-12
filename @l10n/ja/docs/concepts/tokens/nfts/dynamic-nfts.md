---
seo:
  description: ダイナミックNFTを作成し、URIを変更して参照されるデータオブジェクトを更新するオプションを提供します。
labels:
  - 非代替性トークン, NFT
---

# ダイナミックNFT (dNFT)

標準的なNFTは変更不可能です。一部のユースケースでは、NFTの初回Mint後に参照されるデータオブジェクトを更新する機能が便利です。例えば、延期されたイベントのコンサートチケットを代替日に更新したり、スポーツ選手のバーチャルトレーディングカードを定期的に現在の統計情報に更新したりすることができます。ダイナミックNFT（dNFT）は、このようなユースケースに柔軟性を提供します。

## dNFTの作成

新しいNFTをミントする際に、`tfMutable`フラグ(`0x00000010`)を設定して、NFTの`URI`フィールドを更新する機能を有効にします。

## dNFTの変更

`NFTokenModify`トランザクションを使用して、dNFTの`URI`フィールドを更新します。発行者または許可された発行者の`Account`、dNFTの`Owner`(`Account`アドレスと異なる場合)、dNFTの`NFTokenID`、および新しいオブジェクトデータの`URI`を指定します。

### NFTokenModifyトランザクションの例

```json
{
  "TransactionType": "NFTokenModify",
  "Account": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
  "Owner": "rogue5HnPRSszD9CWGSUz8UGHMVwSSKF6",
  "Fee": "10",
  "Sequence": 33,
  "NFTokenID": "0008C350C182B4F213B82CCFA4C6F59AD76F0AFCFBDF04D5A048C0A300000007",
  "URI": "697066733A2F2F62616679626569636D6E73347A736F6C686C6976346C746D6E356B697062776373637134616C70736D6C6179696970666B73746B736D3472746B652F5665742E706E67"
}
```
