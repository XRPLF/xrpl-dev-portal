---
seo:
    description: 最大8件のトランザクションをまとめて作成・送信し、それらがアトミックに成功または失敗するようにします。
labels:
    - Transaction Sending
    - Other Transactions
requiredAmendment: BatchV1_1
status: not_enabled
txIcon: other
---
# Batch
{% source-link path="src/libxrpl/tx/transactors/system/Batch.cpp" /%}

最大8件のトランザクションを単一の[バッチ](../../../../concepts/transactions/batch-transactions.md)として送信します。バッチ内のトランザクションは、4つのモード(全て成功または全て失敗（All or Nothing）、一つのみ成功（Only One）、失敗まで継続（Until Failure）、および独立実行（Independent）)のいずれかでアトミックに実行されます。

{% amendment-disclaimer name="BatchV1_1" /%}


## {% $frontmatter.seo.title %} JSONの例

### 単一アカウントの場合

この例では、ユーザーがDEX UIを使って取引する中でオファーを作成し、2番目のトランザクションでプラットフォーム手数料を支払っています。内部トランザクションは署名されておらず、関与するアカウントが1つのみのため、外部トランザクションに`BatchSigners`フィールドは不要です。

```json
{
  "TransactionType": "Batch",
  "Account": "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
  "Flags": 65536,
  "RawTransactions": [
    {
      "RawTransaction": {
        "TransactionType": "OfferCreate",
        "Flags": 1073741824,
        "Account": "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
        "TakerGets": "6000000",
        "TakerPays": {
          "currency": "GKO",
          "issuer": "ruazs5h1qEsqpke88pcqnaseXdm6od2xc",
          "value": "2"
        },
        "Sequence": 4,
        "Fee": "0",
        "SigningPubKey": ""
      }
    },
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Flags": 1073741824,
        "Account": "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
        "Destination": "rDEXfrontEnd23E44wKL3S6dj9FaXv",
        "Amount": "1000",
        "Sequence": 5,
        "Fee": "0",
        "SigningPubKey": ""
      }
    }
  ],
  "Sequence": 3,
  "Fee": "40",
  "SigningPubKey": "022D40673B44C82DEE1DDB8B9BB53DCCE4F97B27404DB850F068DD91D685E337EA",
  "TxnSignature": "3045022100EC5D367FAE2B461679AD446FBBE7BA260506579AF4ED5EFC3EC25F4DD1885B38022018C2327DB281743B12553C7A6DC0E45B07D3FC6983F261D7BCB474D89A0EC5B8"
}
```

### 複数アカウントの場合

この例では、2人のユーザーがトークン（XRPとGKO）をアトミックに交換しています。

```json
{
  "TransactionType": "Batch",
  "Account": "rUser1fcu9RJa5W1ncAuEgLJF2oJC6",
  "Flags": 65536,
  "RawTransactions": [
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Flags": 1073741824,
        "Account": "rUser1fcu9RJa5W1ncAuEgLJF2oJC6",
        "Destination": "rUser2fDds782Bd6eK15RDnGMtxf7m",
        "Amount": "6000000",
        "Sequence": 5,
        "Fee": "0",
        "SigningPubKey": ""
      }
    },
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Flags": 1073741824,
        "Account": "rUser2fDds782Bd6eK15RDnGMtxf7m",
        "Destination": "rUser1fcu9RJa5W1ncAuEgLJF2oJC6",
        "Amount": {
          "currency": "GKO",
          "issuer": "ruazs5h1qEsqpke88pcqnaseXdm6od2xc",
          "value": "2"
        },
        "Sequence": 20,
        "Fee": "0",
        "SigningPubKey": ""
      }
    }
  ],
  "BatchSigners": [
    {
      "BatchSigner": {
        "Account": "rUser2fDds782Bd6eK15RDnGMtxf7m",
        "SigningPubKey": "03C6AE25CD44323D52D28D7DE95598E6ABF953EECC9ABF767F13C21D421C034FAB",
        "TxnSignature": "304502210083DF12FA60E2E743643889195DC42C10F62F0DE0A362330C32BBEC4D3881EECD022010579A01E052C4E587E70E5601D2F3846984DB9B16B9EBA05BAD7B51F912B899"
      }
    }
  ],
  "Sequence": 4,
  "Fee": "60",
  "SigningPubKey": "03072BBE5F93D4906FC31A690A2C269F2B9A56D60DA9C2C6C0D88FB51B644C6F94",
  "TxnSignature": "30440220702ABC11419AD4940969CC32EB4D1BFDBFCA651F064F30D6E1646D74FBFC493902204E5B451B447B0F69904127F04FE71634BD825A8970B9467871DA89EEC4B021F8"
}
```

{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド          | JSONの型 | [内部の型][] | 必須？ | 説明                                                         |
| :---------------- | :--------- | :--------- | :----- | :----------------------------------------------------------- |
| `Flags`           | 数値       | UInt32     | はい     | このトランザクションのビットフラグです。トランザクションのバッチモードを表すために、正確に1つ指定する必要があります。[Batchのフラグ](#batchのフラグ)をご覧ください。 |
| `RawTransactions` | 配列       | Array      | はい     | 適用するトランザクションのリストです。[RawTransactions](#rawtransactions)をご覧ください。 |
| `BatchSigners`    | 配列       | Array      | いいえ    | 複数アカウントの`Batch`トランザクションを承認する署名です。          |

### RawTransactions

`RawTransactions`には、適用される内部トランザクションのリストが含まれます。最小**2**件、最大**8**件のトランザクションを含める必要があります。これらのトランザクションは、単一のアカウントからでも、複数のアカウントからでも構いません。

各内部トランザクションは以下の条件を満たす必要があります。

- `tfInnerBatchTxn` (10進数値: `1073741824`、または16進数値: `0x40000000`) フラグを含める必要があります。
- `Fee`の値が`"0"`である必要があります。
- 署名されていてはなりません（グローバルトランザクションはすべての関係者によってすでに署名されています）。代わりに、`SigningPubKey`には空の文字列 (`""`) を指定し、`TxnSignature`フィールドは省略する必要があります。
- `TicketSequence`または`Sequence`のいずれかに、ゼロより大きい値を含める必要があります。

{% admonition type="warning" name="注意" %}
`Batch`トランザクションは、一部またはすべての _内部_ トランザクションが失敗した場合でも、外部トランザクションの結果として`tesSUCCESS`を返します。内部トランザクションが成功したことを確認するには、各トランザクションをそのハッシュで検索し、それぞれの結果とメタデータを確認してください。詳細は、[メタデータ](../../../../concepts/transactions/batch-transactions.md#メタデータ)および[Batchトランザクションの結果を確認する](../../../../tutorials/best-practices/transaction-sending/send-a-single-account-batch-transaction.md#6-check-batch-transaction-result)をご覧ください。
{% /admonition %}

### BatchSigners

このフィールドは、XRPLにおけるマルチシグ機能と同様の仕組みで動作します。複数のアカウントのトランザクションが`Batch`トランザクションに含まれている場合にのみ必要で、それ以外の場合は通常のトランザクション署名で同じセキュリティが保証されます。必要な場合、このフィールドには、外部トランザクションに署名するアカウントを除き、内部トランザクションが含まれるすべてのアカウントの署名を含める必要があります。エントリは`Account`の昇順にソートされ、かつ一意である必要があります。

| フィールド        | JSONの型 | [内部の型][] | 必須？ | 説明                                                         |
| :-------------- | :--------- | :--------- | :----- | :----------------------------------------------------------- |
| `Account`       | 文字列     | AccountID  | はい     | 少なくとも1つの内部トランザクションを持つアカウント。                |
| `SigningPubKey` | 文字列     | Blob       | いいえ    | このトランザクションの署名に使用された秘密鍵に対応する公開鍵の16進数表現。 |
| `TxnSignature`  | 文字列     | Blob       | いいえ    | このトランザクションが、それが由来するとされるアカウントからのものであることを検証する署名。 |
| `Signers`       | 配列       | Array      | いいえ    | このトランザクションを承認するマルチシグを表すオブジェクトの配列。         |

{% admonition type="info" name="注記" %}
`BatchSigners`エントリのアカウントが単一署名で承認する場合は、`SigningPubKey`と`TxnSignature`のみを含めます。マルチシグを使用するアカウントは、代わりに`Signers`フィールドを使用します。
{% /admonition %}


## Batchのフラグ

`Batch`タイプのトランザクションは、[`Flags`フィールド](../common-fields.md#flagsフィールド)に追加の値をサポートしており、以下のとおりです。

| フラグ名          | 16進数値   | 10進数値 | 説明                               |
| :--------------- | :--------- | :------- | :--------------------------------- |
| `tfAllOrNothing` | `0x00010000` | 65536    | すべてのトランザクションが成功しなければ、バッチ全体が失敗します。 |
| `tfOnlyOne`      | `0x00020000` | 131072   | 最初に成功したトランザクションのみ適用され、それ以降はすべて失敗またはスキップされます。 |
| `tfUntilFailure` | `0x00040000` | 262144   | 最初の失敗が発生するまで、すべてのトランザクションが順に適用されます。失敗以降のトランザクションはスキップされます。 |
| `tfIndependent`  | `0x00080000` | 524288   | 各トランザクションは、成功・失敗に関係なくすべて適用されます。 |

## 特殊なトランザクションコスト

`Batch`トランザクションの[トランザクションコスト][]は、標準的なトランザクションよりも高くなります。手数料は以下の合計として計算されます。

- {% $env.PUBLIC_BASE_FEE %} * 2。
- 外部トランザクションの署名1つにつき、追加で{% $env.PUBLIC_BASE_FEE %}。
- すべての内部トランザクションの手数料の合計。


## エラーケース

すべてのトランザクションで発生する可能性のあるエラーに加えて、{% $frontmatter.seo.title %}トランザクションでは、次の[トランザクション結果コード](../transaction-results/index.md)が発生する可能性があります。

| エラーコード | 説明 |
|:-----------|:------------|
| `tefBAD_AUTH` | `BatchSigners`エントリが疑似アカウントを参照しています。疑似アカウントはトランザクションに署名できません。 |
| `temARRAY_EMPTY` | `RawTransactions`フィールドのトランザクションが2件未満です。バッチには少なくとも2件の内部トランザクションを含める必要があります。 |
| `temARRAY_TOO_LARGE` | `RawTransactions`のエントリが8件を超えているか、`BatchSigners`の署名が24件を超えています。 |
| `temBAD_FEE` | 内部トランザクションのいずれかの`Fee`が`0`より大きくなっています。 |
| `temBAD_REGKEY` | 内部トランザクションのいずれかの`SigningPubKey`が空ではありません。 |
| `temBAD_SIGNATURE` | 内部トランザクションのいずれかに`TxnSignature`フィールドが含まれています。 |
| `temBAD_SIGNER` | <li>内部トランザクションのいずれかに`Signers`フィールドが含まれています。</li><li>`BatchSigners`フィールドに、外部トランザクションに署名するアカウントの署名が含まれています。</li><li>`BatchSigners`フィールドに重複する署名者が含まれています。</li><li>`BatchSigners`フィールドが`Account`の昇順に厳密にソートされていません。</li><li>`BatchSigners`フィールドに、内部トランザクションを持たないアカウントの署名が含まれています。</li><li>`BatchSigners`フィールドに、内部トランザクションを持つアカウントの署名が含まれていません。</li> |
| `temINVALID_FLAG` | <li>`Flags`フィールドに、サポートされている[バッチモード](#batchのフラグ)のいずれか1つが正確に設定されていません。</li><li>内部トランザクションのいずれかに`tfInnerBatchTxn`フラグが設定されていません。</li> |
| `temINVALID_INNER_BATCH` | `RawTransactions`フィールドに、`Batch`など、無効化されているか不正な`TransactionType`が含まれています。現在無効化されているトランザクションは次のとおりです: `LoanBrokerCoverClawback`、`LoanBrokerCoverDeposit`、`LoanBrokerCoverWithdraw`、`LoanBrokerDelete`、`LoanBrokerSet`、`LoanDelete`、`LoanManage`、`LoanPay`、`LoanSet`、`VaultCreate`、`VaultSet`、`VaultDelete`、`VaultDeposit`、`VaultWithdraw`、`VaultClawback`。 |
| `temREDUNDANT` | `RawTransactions`フィールドに重複するトランザクションが含まれています。 |
| `temSEQ_AND_TICKET` | 内部トランザクションのいずれかに、`TicketSequence`と0以外の`Sequence`の両方が設定されているか、どちらも設定されていません。いずれか一方のみが必要です。 |

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
