---
seo:
    description: 単一のMPT Issuanceを表し、Issuance自体に関連するデータを保持します。
labels:
  - Multi-Purpose Token, MPT, トークン
---
# MPTokenIssuance

{% partial file="/@l10n/ja/docs/_snippets/mpts-disclaimer.md" /%}

`MPTokenIssuance`オブジェクトは、単一のMPT Issuanceを表し、Issuance自体に関連するデータを保持します。このIssuanceは`MPTokenIssuanceCreate`トランザクションを使用して作成され、`MPTokenIssuanceDestroy`トランザクションによって破棄することができます。

{% amendment-disclaimer name="MPTokensV1_1" /%}

## MPTokenIssuance JSONの例

```json
{
  "name": "US Treasury Bill Token",
  "symbol": "USTBT",
  "issuer": "US Treasury",
  "issueDate": "2024-03-25",
  "maturityDate": "2025-03-25",
  "faceValue": 1000,
  "interestRate": 2.5,
  "interestFrequency": "Quarterly",
  "collateral": "US Government",
  "jurisdiction": "United States",
  "regulatoryCompliance": "SEC Regulations",
  "securityType": "Treasury Bill",
  "external_url": "https://example.com/t-bill-token-metadata.json"
}
```

## MPTokenIssuanceID

`MPTokenIssuance`オブジェクトのキーは、以下の値を順番に連結したものをSHA512-Halfした結果です。

- `MPTokenIssuance`スペースキー(0x007E)
- トランザクションシーケンス番号
- 発行者の`AccountID`

`MPTokenIssuanceID`は192ビットの整数で、以下の順に連結されます：

- トランザクションシーケンス番号
- 発行者のAccountID


## MPTokenIssuanceのフィールド

`MPTokenIssuance`オブジェクトには以下のフィールドがあります。

| フィールド名        | JSON型 | 内部型    | 説明 |
| :------------------ | :----- | :-------- | ---- |
| `LedgerEntryType`   | 数値   | UInt16    | 値0x007Eは文字列MPTokenIssuanceにマッピングされ、このオブジェクトがMulti-Purpose Token (MPT)を記述していることを示します。 |
| `Flags`             | 数値   | UInt32    | [MPTokenIssuanceのフラグ](#mptokenissuanceのフラグ)をご覧ください。 |
| `Issuer`            | 文字列 | AccountID | 特定の代替可能トークンの発行量とプロパティの両方を制御するアカウントのアドレス。 |
| `AssetScale`        | 数値   | UInt8     | 標準単位と対応する分数単位との間の桁数の差です。より正確には、AssetScaleは自然数(0、1、2、...)で、1標準単位は対応する分数単位の10^(-scale)に等しくなります。分数単位が標準単位と等しい場合、AssetScaleは0です。 |
| `MaximumAmount`     | 文字列 | UInt64    | この値は、非発行アカウントに配布できるMPTの最大数(つまり、発行可能な数)を指定する符号なし数値です。未指定の場合、この値は0x7FFFFFFFFFFFFFFFに設定されます。 |
| `OutstandingAmount` | 文字列 | UInt64    | すべてのトークン保有者に発行されたトークン量の合計を指定します。この値は、値が0の場合にLedger上で少ないスペースを占めるように、デフォルトタイプとしてLedgerに保存されます。この値は、発行者が非発行者アカウントにMPTを支払うたびに増加し、非発行者が発行アカウントにMPTを支払うたびに減少します。 |
| `TransferFee`       | 数値   | UInt16    | この値は、トークンの二次販売が許可されている場合に、発行者が課す手数料をベーシスポイントの10分の1単位で指定します。このフィールドの有効な値は0から50,000までです。値1は1/10ベーシスポイントまたは0.001%に相当し、0%から50%までの手数料設定を可能にします。50,000の`TransferFee`は50%に相当します。このフィールドのデフォルト値は0です。転送手数料の小数点以下は切り捨てられます。支払いが小さい場合、手数料は0に切り捨てられる可能性があります。発行者は、MPTの`AssetScale`が十分に大きいことを確認する必要があります。 |
| `MPTokenMetadata`   | 文字列 | Blob      | この発行に関する任意のメタデータで、16進数形式です。このフィールドの制限は1024バイトです。 |
| `PreviousTxnID`     | 文字列 | UInt256   | このオブジェクトを最後に変更したトランザクションのトランザクションID。 |
| `PreviousTxnLgrSeq` | 数値   | UInt32    | このオブジェクトを最後に変更したトランザクションを含むレジャーのシーケンス番号。 |
| `OwnerNode`         | 文字列 | UInt64    | このアイテムが参照されている所有者のディレクトリのページ。 |
| `Sequence`          | 数値   | UInt32    | 特定の送信者からの発行が、Issuanceが後で削除された場合でも一度しか存在できないことを保証するために使用される32ビットの符号なし整数。新しい発行が作成されるたびに、この値はアカウントの現在の`Sequence`番号と一致する必要があります。`Tickets`は通常の順序外でトランザクションを送信できるように、これらのルールから一部例外を設けています。`Tickets`は後で使用するために予約されたシーケンス番号を表します。トランザクションは通常のアカウントSequence番号の代わりに`Ticket`を使用できます。MPTを作成するトランザクションがレジャーに含まれるたびに、トランザクションが正常に実行されたか、tecクラスのエラーコードで失敗したかに関係なく、シーケンス番号(またはTicket)が使用されます。その他のトランザクションの失敗はレジャーに含まれないため、送信者のシーケンス番号は変更されません(また、他の影響もありません)。未確認のMPT作成トランザクションが同じIssuerとシーケンス番号を持つことは可能です。そのようなトランザクションは相互に排他的であり、検証済みレジャーに含まれるのは最大で1つだけです。(他のトランザクションは最終的に効果がありません。) |


### MPTokenIssuanceのフラグ

Flagsは`MPToken`オブジェクトに関連付けられたプロパティまたはその他のオプションです。`MPTokenIssuanceSet`トランザクションを介して変更可能な`lsfMPTLocked`を除き、これらのフラグは不変です。`MPTokenIssuanceCreate`トランザクション中にのみ設定でき、後で変更することはできません。

| フラグ名            | フラグ値     | 説明 |
| :------------------ | :----------- | ---- |
| `lsfMPTLocked`      | `0x00000001` | 設定されている場合、すべての残高がロックされていることを示します。 |
| `lsfMPTCanLock`     | `0x00000002` | 設定されている場合、発行者が個々の残高またはこのMPTのすべての残高をロックできることを示します。設定されていない場合、MPTはいかなる方法でもロックできません。 |
| `lsfMPTRequireAuth` | `0x00000004` | 設定されている場合、個々の保有者は承認を必要とすることを示します。これにより、発行者は自身の資産を保有できる人を制限できます。 |
| `lsfMPTCanEscrow`   | `0x00000008` | 設定されている場合、個々の保有者が残高をエスクローに入れることができることを示します。 |
| `lsfMPTCanTrade`    | `0x00000010` | 設定されている場合、個々の保有者がXRP Ledger DEXまたはAMMを使用して残高を取引できることを示します。 |
| `lsfMPTCanTransfer` | `0x00000020` | 設定されている場合、非発行者が保有するトークンを他のアカウントに転送できることを示します。設定されていない場合、非発行者が保有するトークンは発行者に返却する以外は転送できないことを示します。これにより、ストアクレジットなどのユースケースが可能になります。 |
| `lsfMPTCanClawback` | `0x00000040` | 設定されている場合、発行者が`Clawback`トランザクションを使用して個々の保有者から価値を回収できることを示します。 |

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
