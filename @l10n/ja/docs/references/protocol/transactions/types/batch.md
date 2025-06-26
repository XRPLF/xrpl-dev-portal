---
html: batch.html
seo:
    description: 最大8つのトランザクションのバッチを作成・送信する。
labels:
  - Batch
  - Transactions
status: not_enabled
---
# Batch
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/Batch.cpp "Source")

`Batch`トランザクションは、最大8つのトランザクションを単一のバッチで送信します。各トランザクションは、4つのモードのいずれかでアトミックに実行されます。全て成功または全て失敗（All or Nothing）、一つのみ成功（Only One）、失敗まで継続（Until Failure）、および独立実行（Independent）。

## Batch JSONの例

以下の例は、ユーザーがDEX UIを使って取引する中でオファーを作成し、2番目のトランザクションがプラットフォーム手数料となっています。内部トランザクションは署名されておらず、関与するアカウントが1つのみのため、外部トランザクションに`BatchSigners`フィールドは不要です。

```json
{
  "TransactionType": "Batch",
  "Account": "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
  "Flags": "0x00010000",
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

### レジャー確認のサンプル

この例は、トランザクション確認後のレジャーの状態を示しています。
内部トランザクションが通常のトランザクションとしてコミットされていることに注意してください。

```json
[
  {
    "TransactionType": "Batch",
    "Account": "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
    "Flags": "0x00010000",
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
  },
  {
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
  },
  {
    "TransactionType": "Payment",
    "Flags": 1073741824,
    "Account": "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
    "Destination": "rDEXfrontEnd23E44wKL3S6dj9FaXv",
    "Amount": "1000",
    "Sequence": 5,
    "Fee": "0",
    "SigningPubKey": ""
  }
]
```

### レジャーのサンプル

この例は、トランザクション確認後のレジャーの状態を示しています。内部トランザクションが通常のトランザクションとしてコミットされ、外部トランザクションの検証済みバージョンには`RawTransactions`フィールドが含まれていないことに注意してください。

```json
[
  {
    "TransactionType": "Batch",
    "Account": "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
    "Flags": "1",
    "TxnIDs": [
      "7EB435C800D7DC10EAB2ADFDE02EE5667C0A63AA467F26F90FD4CBCD6903E15E",
      "EAE6B33078075A7BA958434691B896CCA4F532D618438DE6DDC7E3FB7A4A0AAB"
    ],
    "Sequence": 3,
    "Fee": "40",
    "SigningPubKey": "022D40673B44C82DEE1DDB8B9BB53DCCE4F97B27404DB850F068DD91D685E337EA",
    "TxnSignature": "3045022100EC5D367FAE2B461679AD446FBBE7BA260506579AF4ED5EFC3EC25F4DD1885B38022018C2327DB281743B12553C7A6DC0E45B07D3FC6983F261D7BCB474D89A0EC5B8"
  },
  {
    "TransactionType": "OfferCreate",
    "Account": "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
    "TakerGets": "6000000",
    "TakerPays": {
      "currency": "GKO",
      "issuer": "ruazs5h1qEsqpke88pcqnaseXdm6od2xc",
      "value": "2"
    },
    "BatchTxn": {
      "Account": "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
      "OuterSequence": 3,
      "BatchIndex": 0
    },
    "Sequence": 0,
    "Fee": "0",
    "SigningPubKey": "",
    "TxnSignature": ""
  },
  {
    "TransactionType": "Payment",
    "Account": "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
    "Destination": "rDEXfrontEnd23E44wKL3S6dj9FaXv",
    "Amount": "1000",
    "BatchTxn": {
      "Account": "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
      "OuterSequence": 3,
      "BatchIndex": 1
    },
    "Sequence": 0,
    "Fee": "0",
    "SigningPubKey": "",
    "TxnSignature": ""
  }
]
```

### Batchのフィールド

<!-- {% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%} -->

| フィールド       | JSONの型              | [内部の型][]        | 説明               |
|:----------------|:--------------------|:------------------|:-------------------|
| TransactionType | string              | UInt16            |                    |
| Account         | string              | STAccount         |                    |
| Fee             | string              | STAmount          | 手数料は基本手数料の2倍（手数料エスカレーションがない場合は合計20 drops）に、すべての内部トランザクションのトランザクション手数料の合計を加えたものです（マルチサインやAMMCreateなどの高い手数料も含む）。個々の内部トランザクションの手数料は、内部トランザクション自体ではなくここで支払われ、手数料エスカレーションがオーバーヘッドだけでなくトランザクションの総コストで計算されることを保証します。 |
| Flags           | number              | UInt32            | `Flags`フィールドはトランザクションのバッチモードを表します。`Batch`トランザクションでは正確に1つを指定する必要があります。[Batchのフラグ](#batchのフラグ)を参照してください。|
| RawTransactions | array               | STArray           | 適用されるトランザクションのリストを含みます。[RawTransactions](#rawtransactions)を参照してください。 |
| TxnIDs          | array               | Vector256         | `TxnIDs`は`RawTransactions`に含まれるすべてのトランザクションのトランザクションハッシュ/IDのリストを含みます。これは内部トランザクションの`Batch`トランザクション内でレジャーの一部として保存される唯一の部分です。内部トランザクション自体はレジャー上で独自のトランザクションであるためです。TxnIDsのハッシュは`RawTransactions`の生トランザクションと同じ順序である必要があります。 |
| BatchSigners    | array               | STArray           | _オプション_。`Batch`に複数のアカウントのトランザクションが含まれる場合のみ必要です。[BatchSigners](#batchsigners)を参照してください。 |

### Batchのフラグ

`Batch`型のトランザクションは、`Flags`フィールドで以下の追加値をサポートしています。

| フラグ名           | 16進値       | 10進値        | 説明                          |
|:-------------------|:-------------| ------------: |:------------------------------|
| `ALLORNOTHING`     | 0x00000001   | 1             | 全て成功または全て失敗。すべてのトランザクションが成功しなければ、どれも成功しません。 |
| `ONLYONE`          | 0x00000002   | 2             | 最初に成功したトランザクションのみが成功し、他のすべてのトランザクションは失敗するか実行されません。 |
| `UNTILFAILURE`     | 0x00000004   | 4             | 最初の失敗まですべてのトランザクションが処理され、最初の失敗後のすべてのトランザクションは処理されません。 |
| `INDEPENDENT`      | 0x00000008   | 8             | 失敗に関係なく、すべてのトランザクションが処理されます。 |

### RawTransactions

`RawTransactions`は実行されるトランザクションのリストを含みます。最大8つのトランザクションを含めることができます。これらのトランザクションは1つのアカウントまたは複数のアカウントからのものである可能性があります。

内部の各トランザクションは以下の要件を満たす必要があります。

- BatchTxnフィールドを含む必要があります。
- シーケンス番号を持ってはいけません。シーケンス番号値0を使用する必要があります。
- 手数料を持ってはいけません。手数料値"0"を使用する必要があります。
- 署名されてはいけません（グローバルトランザクションはすでにすべての関連当事者によって署名されています）。代わりに`SigningPubKey`および`TxnSignature`フィールドに空文字列（""）を持つ必要があります。

トランザクションは`tesSUCCESS`でない結果を受け取った場合、失敗と見なされます。

このフィールドは検証済みトランザクションには含まれず、すべてのトランザクションがレジャーの一部として個別に含まれるため、外部トランザクション署名の計算にも使用されません。

### BatchSigners

このフィールドはXRPLのマルチサインと同様に動作します。複数のアカウントのトランザクションがBatchトランザクションに含まれる場合のみ必要です。そうでなければ、通常のトランザクション署名が同じセキュリティ保証を提供します。

少なくとも1つの内部トランザクションを持つすべてのアカウント（該当する場合は外部アカウントを除く）は、BatchSignersフィールドを持つ必要があります。

| フィールド      | JSONの型              | [内部の型][]        | 説明               |
|:----------------|:--------------------|:------------------|:-------------------|
| Account         | string              | STAccount         | 少なくとも1つの内部トランザクションを持つアカウント。 |
| SigningPubKey   | string              | STBlob            | アカウントが単一署名で署名している場合に含まれます。 |
| Signature       | string              | STBlob            | アカウントが単一署名で署名している場合に含まれます。 |
| Signers         | array               | STArray           | アカウントがマルチサイン（単一署名の代わりに）で署名している場合にこのフィールドが含まれます。標準トランザクションマルチサインで使用されるSignersフィールドと同等に動作します。このフィールドはFlagsおよびTxnIDsフィールドの署名を保持します。 |

## BatchTxn

`BatchTxn`内部オブジェクトは、`Batch`トランザクションのすべての内部トランザクションに含める必要があります。
含めることで、以下の効果があります。

- 同一トランザクション間のハッシュ衝突を防ぎます（シーケンス番号が含まれていないため）。
- すべてのトランザクションがシーケンス番号を関連付けることを保証し、ID生成でそれを使用する作成されたレジャーオブジェクトが引き続き動作できるようにします。
- ユーザーがトランザクションを正しい順序でより簡単に整理できるようにします。

このオブジェクトに含まれるフィールドは以下の通りです。

| フィールド         | JSONの型           | [内部の型][]        | 説明             |
|:---------------------|:-----------------|:------------------|:-----------------|
| `Account`            | string           | AccountID         | 外部`Batch`トランザクションを送信するアカウント。 |
| `OuterSequence`      | number           | UInt32            | 外部`Batch`トランザクションのシーケンス番号。他の`Batch`トランザクションとのハッシュ衝突がないことを保証します。 |
| `Sequence`           | number           | UInt32            | _(オプション)_ 内部トランザクションのアカウントの次の利用可能なシーケンス番号。マルチアカウントBatchトランザクションでのみ含める必要があります。  |
| `BatchIndex`         | number           | UInt8             | 既存の`Batch`トランザクション内での内部トランザクションの（0から始まる）インデックス。最初の内部トランザクションはBatchIndex値0、2番目は1、以下同様です。同じ`Batch`トランザクション内の他の内部トランザクションとのハッシュ衝突がないことを保証し、すべてのトランザクションが正しい順序で配置されることを保証します。 |

## 複数アカウントでのBatch JSONの例

この例では、2人のユーザーがトークンをアトミックに交換しており、XRPをGKOと交換しています。内部トランザクションは依然として署名されていませんが、この`Batch`トランザクションには2つのアカウントの内部トランザクションがあるため、外部トランザクションに`BatchSigners`フィールドが必要です。

```json
{
  "TransactionType": "Batch",
  "Account": "rUser1fcu9RJa5W1ncAuEgLJF2oJC6",
  "Flags": "0x00010000",
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

#### レジャーレスポンスの例

```json
[
  {
    "TransactionType": "Batch",
    "Account": "rUser1fcu9RJa5W1ncAuEgLJF2oJC6",
    "Flags": "0x00010000",
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
  },
  {
    "TransactionType": "Payment",
    "Flags": 1073741824,
    "Account": "rUser1fcu9RJa5W1ncAuEgLJF2oJC6",
    "Destination": "rUser2fDds782Bd6eK15RDnGMtxf7m",
    "Amount": "6000000",
    "Sequence": 5,
    "Fee": "0",
    "SigningPubKey": ""
  },
  {
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
]
```
