---
seo:
    description: XRPLのMulti-Purpose Tokenのオブジェクトについて説明します。
labels:
  - Multi-Purpose Token, MPT, トークン
---
# MPToken

{% partial file="/@l10n/ja/docs/_snippets/mpts-disclaimer.md" /%}

`MPTokenIssuanceID`.`MPToken`オブジェクトは、トークン発行者ではないアカウントが保有する複数のトークンを表します。MPTは通常の支払いやDEXトランザクションを通じて取得され、これらと同じタイプのトランザクションを使用してオプションで償還または交換することができます。MPTokenのオブジェクトキーは、スペースキー、保有者のアドレス、および`MPTokenIssuanceID`をハッシュ化することで生成されます。

{% amendment-disclaimer name="MPTokensV1_1" /%}

## MPToken JSONの例

```json
{
    "LedgerEntryType": "MPToken",
    "Account": "rajgkBmMxmz161r8bWYH7CQAFZP5bA9oSG",
    "MPTokenIssuanceID": "000004C463C52827307480341125DA0577DEFC38405B0E3E",
    "Flags": 0,
    "MPTAmount": "100000000",
    "OwnerNode": "1"
}
```

## MPTokenID

`MPTokenID`は、以下の値を順番に連結してSHA512-Halfを実行した結果です。

- `MPToken`スペースキー(0x0074)
- トークンの`MPTokenIssuanceID`
- トークン保有者の`AccountID`

## MPTokenのフィールド

`MPToken`オブジェクトには以下のフィールドがあります。

| フィールド名         | JSONの型 | 内部の型  | 説明 |
|:--------------------|:----------|:----------|:------------|
| `LedgerEntryType`   | 数値      | UInt16    | 値0x007Fは文字列`MPToken`にマッピングされ、このオブジェクトがMPTの個別アカウントの保有を表すことを示します。 |
| `Account`           | 文字列    | AccountID | MPTの所有者。 |
| `MPTokenIssuanceID` | 文字列    | UInt192   | `MPTokenIssuance`の識別子。 |
| `MPTAmount`         | 文字列    | UInt64    | この値は、所有者が現在保有しているトークンの正の数量を指定します。このフィールドの有効な値は0x0から0x7FFFFFFFFFFFFFFFの間です。 |
| `Flags`             | 数値      | UInt32    | (デフォルト) [MPTokenのフラグ](#mptokenのフラグ)をご覧ください。 |
| `PreviousTxnID`     | 文字列    | UInt256   | このオブジェクトを最後に変更したトランザクションのトランザクションID。 |
| `PreviousTxnLgrSeq` | 数値      | UInt32    | このオブジェクトを最後に変更したトランザクションを含むレジャーのシーケンス番号。 |
| `OwnerNode`         | 文字列    | UInt64    | (デフォルト) 所有者のディレクトリでこのアイテムが参照されているページ。 |


### MPTokenのフラグ

Flagsは`MPToken`オブジェクトに紐付けられたプロパティまたはその他のオプションです。

| フラグ名           | フラグ値     | 説明                                 |
|:-------------------|:-------------|:--------------------------------------------|
| `lsfMPTLocked`     | `0x00000001` | 有効な場合、このアカウントが所有するMPTが現在ロックされており、発行者への価値の送信以外のXRPトランザクションで使用できないことを示します |
| `lsfMPTAuthorized` | `0x00000002` | (ホワイトリストの場合のみ適用) 設定されている場合、発行者がそのMPTの保有者を承認したことを示します。このフラグは`MPTokenAuthorize`トランザクションを使用して設定できます。また、`tfMPTUnauthorize`フラグを指定した`MPTokenAuthorize`トランザクションを使用して「解除」することもできます。|

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
