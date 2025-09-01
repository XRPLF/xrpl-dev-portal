---
seo:
    description: 新しいMulti-Purpose Tokenを発行します。
labels:
 - Multi-Purpose Token, MPT
---

# MPTokenIssuanceCreate
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/MPTokenIssuanceCreate.cpp "ソース")

{% partial file="/@l10n/ja/docs/_snippets/mpts-disclaimer.md" /%}

`MPTokenIssuanceCreate`トランザクションは、[MPTokenIssuance](../../ledger-data/ledger-entry-types/mptokenissuance.md)オブジェクトを作成し、作成者アカウントの関連するディレクトリノードに追加します。このトランザクションは、変更不可として定義するトークンのフィールド(例：MPT Flags)を指定できる唯一の機会です。

トランザクションが成功すると、新しく作成されたトークンはトランザクションを実行したアカウント(作成者アカウント)が所有することになります。

`MPTokenIssuance`トランザクションのレスポンスを取得すると、トランザクションメタデータには常に`mpt_issuance_id`フィールドが含まれます。

## MPTokenIssuanceCreateのJSON例

この例では、トークンの発行者がトランザクションの送信者であることを前提としています。

```json
{
  "TransactionType": "MPTokenIssuanceCreate",
  "Account": "rajgkBmMxmz161r8bWYH7CQAFZP5bA9oSG",
  "AssetScale": 2,
  "TransferFee": 314,
  "MaximumAmount": "50000000",
  "Flags": 83659,
  "MPTokenMetadata": "FOO",
  "Fee": "10"
}
```

<!-- ## MPTokenIssuanceCreateのフィールド -->

{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド        | JSON型 | [内部の型][] | 説明 |
| :---------------- | :----- | :----------- | ---- |
| `TransactionType` | 文字列 | UInt16       | 新しいトランザクションタイプMPTokenIssuanceCreateを示します。 |
| `AssetScale`      | 数値   | UInt8        | (任意) 標準単位と対応する分数単位との間の桁数の差を表します。より正確には、AssetScaleは自然数(0, 1, 2, ...)で、1標準単位は対応する分数単位の10^(-scale)に等しくなります。分数単位が標準単位と等しい場合、AssetScaleは0となります。指定されない場合はデフォルトで0となります。 |
| `Flags`           | 数値   | UInt16       | このトランザクションのフラグを指定します。[MPTokenIssuanceCreateのフラグ](#mptokenissuancecreateのフラグ)をご覧ください。 |
| `TransferFee`     | 数値   | UInt16       | (任意) トークンの二次販売に対して発行者が請求する手数料を指定します(二次流通が許可されている場合)。このフィールドの有効な値は0から50,000までで、0.000%から50.000%までの転送レートを0.001刻みで設定できます。tfMPTCanTransferフラグが設定されていない場合、このフィールドは存在できません。存在する場合、トランザクションは失敗し、手数料が請求されます。 |
| `MaximumAmount`   | 文字列 | UInt64       | (任意) このトークンが発行される最大アセット量を10進数エンコードの文字列で指定します。指定されない場合、9,223,372,036,854,775,807(2^63-1)に設定されます。 |
| `MPTokenMetadata` | 文字列 | Blob         | この発行に関する任意のメタデータで、16進数形式で指定します。このフィールドの制限は1024バイトです。 |


## MPTokenIssuanceCreateのフラグ

MPTokenIssuanceCreateトランザクションでは、[`Flags`フィールド](../common-fields.md#Flagsフィールド)に以下の追加の値がサポートされています。

| フラグ名           | 16進数値     | 10進数値      | 説明 |
| :----------------- | :----------- | :------------ | ---- |
| `tfMPTCanLock`     | `0x00000002` | `2`           | 設定されている場合、MPTを個別およびグローバルにロックできることを示します。設定されていない場合、MPTはいかなる方法でもロックできません。 |
| `tfMPTRequireAuth` | `0x00000004` | `4`           | 設定されている場合、個々の保有者は承認が必要であることを示します。これにより発行者は自身のアセットを保有できる者を制限できます。 |
| `tfMPTCanEscrow`   | `0x00000008` | `8`           | 設定されている場合、個々の保有者が残高をエスクローに入れることができることを示します。 |
| `tfMPTCanTrade`    | `0x00000010` | `16`          | 設定されている場合、個々の保有者がXRP Ledger DEXを使用して残高を取引できることを示します。 |
| `tfMPTCanTransfer` | `0x00000020` | `32`          | 設定されている場合、トークンを発行者以外のアカウントに転送できることを示します。 |
| `tfMPTCanClawback` | `0x00000040` | `64`          | 設定されている場合、発行者がClawbackトランザクションを使用して個々の保有者から価値を回収できることを示します。 |

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
