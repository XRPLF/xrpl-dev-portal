# wallet_propose
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/WalletPropose.cpp "Source")

`wallet_propose`メソッドを使用して、キーペアとXRP Ledgerアドレスを生成します。このコマンドは単にキーとアドレス値を生成し、XRP Ledger自体には何ら影響しません。レジャー上で資金供給済みのアドレスになるには、そのアドレスで、[必要準備金](reserves.html)を満たすのに十分なXRPの[Paymentトランザクションを受け取る](accounts.html#アカウントの作成)必要があります。

*`wallet_propose`要求は、権限のないユーザーは実行できない[adminメソッド](admin-rippled-methods.html)です。*(このコマンドは、アカウントの機密情報を求めてネットワーク上の伝送情報をスニッフィングする人々から守るためにadminコマンドとされています。adminコマンドは通常、外部ネットワーク上で伝送されることはありません。）

[更新: rippled 0.31.0][新規: rippled 0.31.0]

### 要求フォーマット

要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket（キータイプあり）*

```
{
    "command": "wallet_propose",
    "seed": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
    "key_type": "secp256k1"
}
```

*WebSocket（キータイプなし）*

```
{
    "command": "wallet_propose",
    "passphrase": "masterpassphrase"
}
```

*JSON-RPC（キータイプあり）*

```
{
    "method": "wallet_propose",
    "params": [
        {
            "seed": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
            "key_type": "secp256k1"
        }
    ]
}
```

*JSON-RPC（キータイプなし）*

```
{
    "method": "wallet_propose",
    "params": [
        {
            "passphrase": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb"
        }
    ]
}
```

*コマンドライン*

```
#Syntax: wallet_propose [passphrase]
rippled wallet_propose masterpassphrase
```

<!-- MULTICODE_BLOCK_END -->

要求には以下のパラメーターを含めることができます。

| `Field`      | 型   | 説明                                          |
|:-------------|:-------|:-----------------------------------------------------|
| `key_type`   | 文字列 | このキーペアに使用する楕円曲線アルゴリズム。有効な値は`ed25519`と`secp256k1`（すべて小文字）です。デフォルトは`secp256k1`です。 |
| `passphrase` | 文字列 |  _（省略可能）_ このシード値からキーペアとアドレスを生成します。この値は、[16進数][]、XRP Ledgerの[base58][]フォーマット、[RFC-1751][]、または任意の文字列でフォーマットできます。`seed`または`seed_hex`とともに使用することはできません。 |
| `seed`       | 文字列 |  _（省略可能）_ このシード値からXRP Ledgerの[base58][]エンコードフォーマットでキーペアとアドレスを生成します。`passphrase`または`seed_hex`とともに使用することはできません。 |
| `seed_hex`   | 文字列 |  _（省略可能）_ このシード値から[16進数][]形式でキーペアとアドレスを生成します。`passphrase`または`seed`とともに使用することはできません。 |

以下のフィールドのうち**1つ**を指定する必要があります。`passphrase`、`seed`、または`seed_hex`。3つすべてを省略すると、`rippled`によってランダムシードが使用されます。

**注記:** [Ed25519](https://ed25519.cr.yp.to/)のサポートは実験的な機能です。このコマンドのコマンドラインバージョンではEd25519キーを生成できません。

#### シードの指定

ほとんどの場合、強力な乱数ソースから生成されたシード値を使用する必要があります。あるアドレスのシード値を知っている人は、[そのアドレスで署名されたトランザクションを送信する](transaction-basics.html#取引の承認)すべての権限を持っています。一般的に、ランダムシードの生成には、このコマンドにパラメーターを指定しないで実行する方法が適しています。

以下の場合には、既知のシードを指定します。

* アドレスに関連するシードのみを知っていて、アドレスを再計算する
* `rippled`の機能をテストする

シードは、以下のどのフォーマットでも指定できます。

* XRP Ledgerの[base58][]フォーマットのシークレットキー文字列。例: `snoPBrXtMeMyMHUVTgbuqAfg1SUTb`。
* [RFC-1751][]フォーマット文字列（secp256k1キーペアのみ）。例: `I IRE BOND BOW TRIO LAID SEAT GOAL HEN IBIS IBIS DARE`。
* 128ビットの[16進数][]文字列。例: `DEDCE9CE67B451D852FD4E846FCDE31C`。
* シード値として使用する任意の文字列。例: `masterpassphrase`。

[RFC-1751]: https://tools.ietf.org/html/rfc1751
[16進数]: https://en.wikipedia.org/wiki/Hexadecimal

### 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id": 2,
  "status": "success",
  "type": "response",
  "result": {
    "account_id": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "key_type": "secp256k1",
    "master_key": "I IRE BOND BOW TRIO LAID SEAT GOAL HEN IBIS IBIS DARE",
    "master_seed": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
    "master_seed_hex": "DEDCE9CE67B451D852FD4E846FCDE31C",
    "public_key": "aBQG8RQAzjs1eTKFEAQXr2gS4utcDiEC9wmi7pfUPTi27VCahwgw",
    "public_key_hex": "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020"
  }
}
```

*JSON-RPC*

```
{
    "result": {
        "account_id": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
        "key_type": "secp256k1",
        "master_key": "I IRE BOND BOW TRIO LAID SEAT GOAL HEN IBIS IBIS DARE",
        "master_seed": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
        "master_seed_hex": "DEDCE9CE67B451D852FD4E846FCDE31C",
        "public_key": "aBQG8RQAzjs1eTKFEAQXr2gS4utcDiEC9wmi7pfUPTi27VCahwgw",
        "public_key_hex": "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
        "status": "success"
    }
}
```

*コマンドライン*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "account_id" : "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
      "key_type" : "secp256k1",
      "master_key" : "I IRE BOND BOW TRIO LAID SEAT GOAL HEN IBIS IBIS DARE",
      "master_seed" : "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
      "master_seed_hex" : "DEDCE9CE67B451D852FD4E846FCDE31C",
      "public_key" : "aBQG8RQAzjs1eTKFEAQXr2gS4utcDiEC9wmi7pfUPTi27VCahwgw",
      "public_key_hex" : "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
      "status" : "success"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

応答は[標準フォーマット][]に従い、正常に終了した場合、新しい（可能性がある）アカウントについての重要な各種情報を含みます。以下のフィールドを含みます。

| `Field`           | 型   | 説明                                     |
|:------------------|:-------|:------------------------------------------------|
| `master_seed`     | 文字列 | これはキーペアの秘密鍵です。このアカウントに関するその他のあらゆる情報が、マスターシードからXRP Ledgerの[base58][]エンコード文字列フォーマットで引き出されます。通常、このフォーマットのキーを使用してトランザクションに署名します。 |
| `master_seed_hex` | 文字列 | 16進数形式のマスターシード。単純で広く支持されている秘密鍵表示法。トランザクションの署名に使用できます。 |
| `master_key`      | 文字列 | [RFC 1751](http://tools.ietf.org/html/rfc1751)フォーマットのマスターシード。覚えやすく書き留めやすい秘密鍵。トランザクションの署名に使用できます。 |
| `account_id`      | 文字列 | XRP Ledgerの[base58][]フォーマットで作成されたアカウントの[アドレス][]。これは公開鍵ではありませんが、公開鍵を2回ハッシュ化したものです。チェックサムも持っているため、タイプミスした場合はほぼ間違いなく無効なアドレスとみなされ、有効だが異なるアドレスとはみなされません。これはXRP LedgerのアカウントのプライマリIDです。支払いを受けるときにこれを人に伝えたり、トランザクションにおいて、自身や、支払先、委託先識別するのに使用します。[マルチ署名のリスト](multi-signing.html)でもこれを使用して、他の署名者を識別します。 |
| `public_key`      | 文字列 | XRP Ledgerの[base58][]エンコード文字列フォーマットで作成された、キーペアの公開鍵。`master_seed`から生成されます。 |
| `public_key_hex`  | 文字列 | これは16進数で作成されたキーペアの公開鍵です。`master_seed`から生成されます。トランザクションの署名を検証する場合、`rippled`にはこの公開鍵が必要です。そのため、署名されたトランザクションのフォーマットの`SigningPubKey`フィールドには公開鍵が入力されています。 |
| `warning`         | 文字列 | （削除される可能性あり）要求にシード値を指定した場合、このフィールドに安全でない可能性があるという警告が表示されます。[新規: rippled 0.32.0][] |

このメソッドを使用してキーペアを生成し、アカウントのレギュラーキーペアとして使用することもできます。アカウントにレギュラーキーペアを割り当てて、それを使用してほとんどのトランザクションに署名し、マスターキーペアをできるだけオフラインにしておくことも可能です。

レギュラーキーペアとして使用するほかに、マルチ署名のリスト（SignerList）のメンバーとして使用することもできます。

マスターキーペアとレギュラーキーペアの詳細は、[暗号鍵](cryptographic-keys.html)を参照してください。

マルチ署名の詳細は、[マルチ署名](multi-signing.html)を参照してください。


### 考えられるエラー

* いずれかの[汎用エラータイプ][]。
* `invalidParams` - 1つ以上のフィールドが不正に指定されています。
* `badSeed` - 要求には、空の文字列やXRP Ledgerアドレスに似た文字列などの許可されないシード値が（`passphrase`、`seed`、または`seed_hex`フィールド内に）指定されています。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
