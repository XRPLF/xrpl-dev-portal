---
seo:
    description: 最大8件のトランザクションをまとめて作成・送信し、それらがすべて成功するか、すべて失敗するようにアトミックに処理されるようにします。
labels:
  - Batch
  - Transaction Sending
status: not_enabled
---
# Batch
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/Batch.cpp "Source")

`Batch`トランザクションは、最大8つのトランザクションを単一のバッチで送信します。各トランザクションは、4つのモード(全て成功または全て失敗（All or Nothing）、一つのみ成功（Only One）、失敗まで継続（Until Failure）、および独立実行（Independent）)のいずれかでアトミックに実行されます。

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
| `Flags`           | 数値       | UInt32     | はい     | このトランザクションのビットフラグです。トランザクションのバッチモードを表すために、正確に1つ指定する必要があります。[バッチのフラグ](#バッチのフラグ)をご覧ください。 |
| `RawTransactions` | 配列       | Array      | はい     | 適用するトランザクションのリストです。                             |
| `BatchSigners`    | 配列       | Array      | いいえ    | 複数アカウントの`Batch`トランザクションを承認する署名です。          |

### RawTransactions

`RawTransactions` には、適用される**内部トランザクションのリスト**が含まれます。最大8つのトランザクションを含めることができます。単一のアカウントからでも、複数のアカウントからでも構いません。

各内部トランザクションは以下の条件を満たす必要があります。

* `tfInnerBatchTxn` (10進数値: `1073741824`、または16進数値: `0x40000000`) フラグを含める必要があります。
* `Fee` の値が `"0"` である必要があります。
* 署名されていてはなりません（グローバルトランザクションはすべての関係者によってすでに署名されています）。代わりに、`SigningPubKey` には空の文字列 (`""`) を含み、`TxnSignature` フィールドは省略する必要があります。
* `TicketSequence` または `Sequence` の値がゼロより大きい必要があります。

### BatchSigners

このフィールドは、XRPLにおけるマルチシグ機能と同様の仕組みで動作します。複数のアカウントのトランザクションが`Batch`トランザクションに含まれている場合にのみ必要で、それ以外の場合は通常のトランザクション署名で同じセキュリティが保証されます。

| フィールド        | JSONの型 | [内部の型][] | 必須？ | 説明                                                         |
| :-------------- | :--------- | :--------- | :----- | :----------------------------------------------------------- |
| `Account`       | 文字列     | AccountID  | はい     | 少なくとも1つの内部トランザクションを持つアカウント。                |
| `SigningPubKey` | 文字列     | Blob       | いいえ    | このトランザクションの署名に使用された秘密鍵に対応する公開鍵の16進数表現。 |
| `TxnSignature`  | 文字列     | Blob       | いいえ    | このトランザクションが、それが由来するとされるアカウントからのものであることを検証する署名。 |
| `Signers`       | 配列       | Array      | いいえ    | このトランザクションを承認するマルチシグを表すオブジェクトの配列。         |

{% admonition type="info" name="Note" %}
`Batch`トランザクションを送信するアカウントが単一署名を使用する場合、`Flags`フィールドと内部トランザクションのハッシュに署名します。この場合、含まれるのは`SigningPubKey`と`TxnSignature`のみです。一方で、複数署名を使用する場合は代わりに`Signers`フィールドが使用され、そこに`Flags`フィールドおよび内部トランザクションのハッシュに対する署名が格納されます。
{% /admonition %}


## バッチのフラグ

`Batch`タイプのトランザクションは、[`Flags`フィールド](../common-fields.md#flags-field)に追加の値をサポートしており、以下のとおりです。

| フラグ名          | 16進数値   | 10進数値 | 説明                               |
| :--------------- | :--------- | :------- | :--------------------------------- |
| `tfAllOrNothing` | `0x00010000` | 65536    | すべてのトランザクションが成功しなければ、バッチ全体が失敗します。 |
| `tfOnlyOne`      | `0x00020000` | 131072   | 最初に成功したトランザクションのみ適用され、それ以降はすべて失敗またはスキップされます。 |
| `tfUntilFailure` | `0x00040000` | 262144   | 最初の失敗が発生するまで、すべてのトランザクションが順に適用されます。失敗以降のトランザクションはスキップされます。 |
| `tfIndependent`  | `0x00080000` | 524288   | 各トランザクションは、成功・失敗に関係なくすべて適用されます。 |

トランザクションは`tesSUCCESS`を結果として返す場合、成功とみなされます。


## エラーケース

| エラーコード                | 説明                                       |
|:--------------------------|:--------------------------------------------------|
| `temINVALID_INNER_BATCH`  | 内部トランザクションの形式が不正です。              |
| `temSEQ_AND_TICKET`       | トランザクションに`TicketSequence`フィールドと、0以外の`Sequence`フィールドの両方が含まれています。両方を同時に指定することはできませんが、いずれか一方は必須です。 |

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
