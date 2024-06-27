---
html: ledger_entry.html
parent: ledger-methods.html
seo:
    description: XRP Ledgerの1つのレジャーオブジェクトを生フォーマットで返します。
label:
  - ブロックチェーン
  - データ保持
---
# ledger_entry
[[ソース]](https://github.com/xrplf/rippled/blob/master/src/ripple/rpc/handlers/LedgerEntry.cpp "Source")

`ledger_entry`メソッドは、XRP Ledgerの1つのレジャーオブジェクトを生フォーマットで返します。取得可能な各種オブジェクトについては、[レジャーフォーマット][]をご覧ください。

## リクエストのフォーマット

このメソッドは複数の異なる種類のデータを取得することができます。以下に記載されている一般的なフィールドと特定のタイプのフィールドで構成される適切なパラメータを渡し、標準の[リクエストのフォーマット](../../api-conventions/request-formatting.md)に従うことで、取得するアイテムの種類を選択できます。(例えば、WebSocketリクエストは常に`command`フィールドとオプションで`id`フィールドを持ち、JSON-RPCリクエストは`method`フィールドと`params`フィールドを使います)。

{% raw-partial file="/@i18n/ja/docs/_snippets/no-cli-syntax.md" /%}

### 一般的なフィールド

| フィールド                | 型                     | 説明                   |
|:------------------------|:-----------------------|:----------------------|
| `binary`                | ブール値                 | _（省略可）_ `true`の場合、リクエストしたレジャーオブジェクトの内容がXRP Ledgerの[バイナリ形式](../../../protocol/binary-format.md)の16進数の文字列として返されます。それ以外の場合はデータがJSONフォーマットで返されます。デフォルトは`false`です。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.2.0" %}更新: rippled 1.2.0{% /badge %} |
| `ledger_hash`           | 文字列                  | _（省略可）_ 使用するレジャーバージョンの20バイトの16進数の文字列。（[レジャーの指定][]をご覧ください。 |
| `ledger_index`          | 文字列 または 符号なし整数 | _（省略可）_ 使用するレジャーの[レジャーインデックス][]、またはレジャーを自動的に選択するためのショートカット文字列("validated"や"closed"、"current"など)。（[レジャーの指定][]をご覧ください。 |

`generator`と`ledger`パラメータは非推奨であり、予告なく削除される可能性があります。

上記の一般的なフィールドに加えて、オブジェクトを取得するタイプを示すために、以下のフィールドのうち *正確に1つ* を指定する必要があります。有効なフィールドは以下のとおりです。

- [ledger\_entry](#ledger_entry)
  - [リクエストのフォーマット](#リクエストのフォーマット)
    - [一般的なフィールド](#一般的なフィールド)
    - [IDからレジャーオブジェクトを取得する](#idからレジャーオブジェクトを取得する)
    - [AccountRootオブジェクトを取得する](#accountrootオブジェクトを取得する)
    - [AMMオブジェクトを取得する](#ammオブジェクトを取得する)
    - [Bridgeオブジェクトを取得する](#bridgeオブジェクトを取得する)
    - [Directorynodeオブジェクトを取得する](#directorynodeオブジェクトを取得する)
    - [Offerオブジェクトを取得する](#offerオブジェクトを取得する)
    - [RippleStateオブジェクトを取得する](#ripplestateオブジェクトを取得する)
    - [Checkオブジェクトを取得する](#checkオブジェクトを取得する)
    - [Escrowオブジェクトを取得する](#escrowオブジェクトを取得する)
    - [Paychannelオブジェクトを取得する](#paychannelオブジェクトを取得する)
    - [DepositPreauthオブジェクトを取得する](#depositpreauthオブジェクトを取得する)
    - [Ticketオブジェクトを取得する](#ticketオブジェクトを取得する)
    - [Nft Pageを取得する](#nft-pageを取得する)
  - [レスポンスのフォーマット](#レスポンスのフォーマット)
  - [考えられるエラー](#考えられるエラー)

**注意:** リクエストでこれらの型固有のフィールドを1つ以上指定した場合、サーバはそのうちの1つだけの結果を取得します。サーバがどれを選択するかは定義されていないため、こうした指定方法は避けるべきです。


### IDからレジャーオブジェクトを取得する

ユニークな ID を使用して、任意のタイプのレジャーオブジェクトを取得します。

| フィールド | 型     | 説明                                                       |
|:---------|:-------|:----------------------------------------------------------|
| `index`  | 文字列  | レジャーから取得する1オブジェクトの[オブジェクトID](../../../protocol/ledger-data/common-fields.md)を、64文字(256ビット)の16進数の文字列。 |

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "command": "ledger_entry",
  "index": "7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4",
  "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "ledger_entry",
    "params": [
        {
            "index": "7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4",
            "ledger_index": "validated"
        }
    ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
rippled json ledger_entry '{ "index": "7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4", "ledger_index": "validated" }'
```
{% /tab %}

{% /tabs %}

[試してみる >](/resources/dev-tools/websocket-api-tool#ledger_entry-by-object-id)

{% admonition type="success" name="ヒント" %}
このタイプのリクエストは、レジャーデータにシングルトンオブジェクトが存在する場合、そのIDは常に同一であるため、任意のシングルトンオブジェクトを取得するために使用できます。たとえば

- [`Amendments`](../../../protocol/ledger-data/ledger-entry-types/amendments.md) - `7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4`
- [`FeeSettings`](../../../protocol/ledger-data/ledger-entry-types/feesettings.md) - `4BC50C9B0D8515D3EAAE1E74B29A95804346C491EE1A95BF25E4AAB854A6A651`
- [直近の`LedgerHashes`](../../../protocol/ledger-data/ledger-entry-types/ledgerhashes.md) - `B4979A36CDC7F3D3D5C31A4EAE2AC7D7209DDA877588B9AFC66799692AB0D66B`
- [`NegativeUNL`](../../../protocol/ledger-data/ledger-entry-types/negativeunl.md) - `2E8A59AA9D3B5B186B0B9E0F62E6C02587CA74A4D778938E957B6357D364B244`
{% /admonition %}



### AccountRootオブジェクトを取得する

アドレスから[AccountRootオブジェクト](../../../protocol/ledger-data/ledger-entry-types/accountroot.md)を取得します。これは[account_infoメソッド][]とほぼ同じです。

| フィールド       | 型                  | 説明                   |
|:----------- ---|:--------------------|:----------------------|
| `account_root` | 文字列 - [アドレス][] | 取得する[AccountRootオブジェクト](../../../protocol/ledger-data/ledger-entry-types/accountroot.md)の標準アドレス。 |

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "example_get_accountroot",
  "command": "ledger_entry",
  "account_root": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "ledger_entry",
    "params": [
        {
            "account_root": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "ledger_index": "validated"
        }
    ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
rippled json ledger_entry '{ "account_root": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59", "ledger_index": "validated" }'
```
{% /tab %}

{% /tabs %}

[試してみる >](/resources/dev-tools/websocket-api-tool#ledger_entry-accountroot)



### AMMオブジェクトを取得する

_([AMM amendment][])_

レジャーからAutomated Market-Maker(AMM)オブジェクトを取得します。これは[amm_infoメソッド][]と似ていますが、`ledger_entry`は保存されているレジャーエントリのみを返します。

| フィールド    | 型                    | 説明                   |
|:-------------|:---------------------|:----------------------|
| `amm`        | オブジェクトまたは文字列 | 取得する[AMM](../../../protocol/ledger-data/ledger-entry-types/amm.md)。文字列を指定する場合は、AMMの[オブジェクトID](../../../protocol/ledger-data/common-fields.md)を16進数で指定しなければなりません。オブジェクトを指定する場合は、`asset`と`asset2`のサブフィールドを含む必要があります。 |
| `amm.asset`  | オブジェクト           | このAMMのプールにある2つの資産のうちのひとつを、[金額なしの通貨オブジェクト](../../../protocol/data-types/currency-formats.md#金額なしでの通貨の指定)として指定します。 |
| `amm.asset2` | オブジェクト           | このAMMのプールにある2つの資産のうちのもうひとつを、[金額なしの通貨オブジェクト](../../../protocol/data-types/currency-formats.md#金額なしでの通貨の指定)として指定します。 |

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 3,
  "command": "ledger_entry",
  "amm": {
    "asset": {
      "currency": "XRP"
    },
    "asset2": {
      "currency" : "TST",
      "issuer" : "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
    }
  },
  "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "ledger_entry",
    "params": [
        {
          "amm": {
            "asset": {
              "currency": "XRP"
            },
            "asset2": {
              "currency" : "TST",
              "issuer" : "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
            }
          },
          "ledger_index": "validated"
        }
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
rippled json ledger_entry '{ "amm": { "asset": { "currency": "XRP" }, "asset2": { "currency" : "TST", "issuer" : "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd" } }, "ledger_index": "validated" }'
```
{% /tab %}

{% /tabs %}

[試してみる >](/resources/dev-tools/websocket-api-tool?server=wss%3A%2F%2Fs.devnet.rippletest.net%3A51233%2F#ledger_entry-amm)


### Bridgeオブジェクトを取得する

_([XChainBridge amendment][]が必要です　{% not-enabled /%})_

XRP Ledgerを他のブロックチェーンに接続する1つのクロスチェーンブリッジを表す[Bridgeエントリ](../../../protocol/ledger-data/ledger-entry-types/bridge.md)を取得します。

| フィールド    　   | 型         | 説明                   |
|:-----------------|:-----------|:----------------------|
| `bridge_account` | 文字列      | ブロックチェーン上で`XChainCreateBridge`トランザクションを送信したアカウント。 |
| `bridge`         | オブジェクト | 取得する[ブリッジ](../../../protocol/ledger-data/ledger-entry-types/bridge.md)。ドアアカウントと発行・ロックチェーンの資産の情報を含みます。 |


{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "example_get_bridge",
  "command": "ledger_entry",
  "bridge_account": "rnQAXXWoFNN6PEqwqsdTngCtFPCrmfuqFJ",
  "bridge": {
    "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "IssuingChainIssue": {
      "currency": "XRP"
    },
    "LockingChainDoor": "rnQAXXWoFNN6PEqwqsdTngCtFPCrmfuqFJ",
    "LockingChainIssue": {
      "currency": "XRP"
    }
  },
  "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "ledger_entry",
    "params": [
        {
            "bridge_account": "rnQAXXWoFNN6PEqwqsdTngCtFPCrmfuqFJ",
            "bridge": {
                "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
                "IssuingChainIssue": {
                    "currency": "XRP"
                },
                "LockingChainDoor": "rnQAXXWoFNN6PEqwqsdTngCtFPCrmfuqFJ",
                "LockingChainIssue": {
                    "currency": "XRP"
                }
            },
            "ledger_index": "validated"
        }
    ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
rippled json ledger_entry '{ "bridge_account": "rnQAXXWoFNN6PEqwqsdTngCtFPCrmfuqFJ", "bridge": { "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh", "IssuingChainIssue": { "currency": "XRP" }, "LockingChainDoor": "rnQAXXWoFNN6PEqwqsdTngCtFPCrmfuqFJ", "LockingChainIssue": { "currency": "XRP" } }, "ledger_index": "validated" }'
```
{% /tab %}

{% /tabs %}

[試してみよう! >](/resources/dev-tools/websocket-api-tool?server=wss%3A%2F%2Fs.devnet.rippletest.net%3A51233%2F#ledger_entry-bridge)



### DirectoryNodeオブジェクトを取得する

他のレジャーオブジェクトのリストを含む[DirectoryNode](../../../protocol/ledger-data/ledger-entry-types/directorynode.md)を取得します。文字列(DirectoryのオブジェクトID)またはオブジェクトを指定します。

| フィールド                | 型                         | 説明                   |
|:------------------------|:---------------------------|:----------------------|
| `directory`             | オブジェクト または 文字列     | 取得する[DirectoryNode](../../../protocol/ledger-data/ledger-entry-types/directorynode.md)。文字列の場合は、ディレクトリの[オブジェクトID](../../../protocol/ledger-data/common-fields.md)を16進数で指定します。オブジェクトの場合は、サブフィールドとして`dir_root`または`owner`が必要で、オプションとして`sub_index`サブフィールドを指定可能です。 |
| `directory.sub_index`   | 符号なし整数                 | _(省略可)_ 指定された場合、その"ページ"以降の[DirectoryNode](../../../protocol/ledger-data/ledger-entry-types/directorynode.md)にジャンプします。 |
| `directory.dir_root`    | 文字列                      | _(省略可)_ 取得するディレクトリを表す一意のインデックス。 |
| `directory.owner`       | 文字列                      | _(省略可)_ このディレクトリに関連付けられているアカウントの一意のアドレス。 |

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 3,
  "command": "ledger_entry",
  "directory": {
    "owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "sub_index": 0
  },
  "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "ledger_entry",
    "params": [
        {
            "directory": {
              "owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
              "sub_index": 0
            },
            "ledger_index": "validated"
        }
    ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
rippled json ledger_entry '{ "directory": { "owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "sub_index": 0 }, "ledger_index": "validated" }'
```
{% /tab %}

{% /tabs %}

[試してみる >](/resources/dev-tools/websocket-api-tool#ledger_entry-directorynode)



### Offerオブジェクトを取得する

通貨交換のオファーを定義した [Offer オブジェクト](../../../protocol/ledger-data/ledger-entry-types/offer.md) を取得します。文字列 (オファーの一意なインデックス) あるいはオブジェクトを指定します。

| フィールド                | 型                         | 説明                   |
|:------------------------|:---------------------------|:----------------------|
| `offer`                 | オブジェクトまたは 文字列      | 取得する[オファーオブジェクト](../../../protocol/ledger-data/ledger-entry-types/offer.md)。文字列の場合、オファーに対する[一意のオブジェクトID](../../../protocol/ledger-data/common-fields.md)を指定します。オブジェクトの場合、オファーを一意に識別するためのサブフィールド`account`と`seq`を指定します。 |
| `offer.account`         | 文字列 - [アドレス][]        | _(`offer`がオブジェクト形式で指定されている場合、必須)_ オファーを作成したアカウント。 |
| `offer.seq`             | 符号なし整数                 | _(`offer`がオブジェクト形式で指定されている場合、必須)_ オファーオブジェクトを作成したトランザクションの[シーケンス番号][]。 |

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "example_get_offer",
  "command": "ledger_entry",
  "offer": {
    "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "seq": 359
  },
  "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "ledger_entry",
  "params": [
    {
      "offer": {
        "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "seq": 359
      },
      "ledger_index": "validated"
    }
  ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
rippled json ledger_entry '{ "offer": { "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "seq": 359}, "ledger_index": "validated" }'
```
{% /tab %}

{% /tabs %}

[試してみる >](/resources/dev-tools/websocket-api-tool#ledger_entry-offer)



### RippleStateオブジェクトを取得する

2つのアカウント間の（XRP以外の）通貨残高を追跡する[RippleStateオブジェクト](../../../protocol/ledger-data/ledger-entry-types/ripplestate.md)を取得します。

| フィールド                | 型                         | 説明                   |
|:------------------------|:---------------------------|:----------------------|
| `ripple_state`          | オブジェクト                 | 取得するRippleState(trust line)オブジェクトを指定するオブジェクト。取得するRippleStateエントリを一意に指定するには、`accounts`と`currency`のサブフィールドが必要です。 |
| `ripple_state.accounts` | 配列                        | _(`ripple_state`が指定されている場合、必須)_ この[RippleStateオブジェクト](../../../protocol/ledger-data/ledger-entry-types/ripplestate.md)によってリンクされた2つのアカウントを長さ2の配列で指定します。 |
| `ripple_state.currency` | 文字列                      | _(`ripple_state`が指定されている場合、必須)_ 取得する[RippleStateオブジェクト](../../../protocol/ledger-data/ledger-entry-types/ripplestate.md)の[通貨コード][]を指定します。 |

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "example_get_ripplestate",
  "command": "ledger_entry",
  "ripple_state": {
    "accounts": [
      "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW"
    ],
    "currency": "USD"
  },
  "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "ledger_entry",
  "params": [{
    "ripple_state": {
      "accounts": [
        "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW"
      ],
      "currency": "USD"
    },
    "ledger_index": "validated"
  }]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
rippled json ledger_entry '{ "ripple_state": { "accounts": ["rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW"], "currency": "USD"}, "ledger_index": "validated" }'
```
{% /tab %}

{% /tabs %}

[試してみる >](/resources/dev-tools/websocket-api-tool#ledger_entry-ripplestate)



### Checkオブジェクトを取得する

[Checkオブジェクト](../../../protocol/ledger-data/ledger-entry-types/check.md)を取得します。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.0.0" %}新規: rippled 1.0.0{% /badge %}.

| フィールド | 型    | 説明                   |
|:---------|:------|:----------------------|
| `check`  | 文字列 | 取得する[Checkオブジェクト](../../../protocol/ledger-data/ledger-entry-types/check.md)の[オブジェクトID](../../../protocol/ledger-data/common-fields.md)。 |

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "example_get_check",
  "command": "ledger_entry",
  "check": "C4A46CCD8F096E994C4B0DEAB6CE98E722FC17D7944C28B95127C2659C47CBEB",
  "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "ledger_entry",
  "params": [{
    "check": "C4A46CCD8F096E994C4B0DEAB6CE98E722FC17D7944C28B95127C2659C47CBEB",
    "ledger_index": "validated"
  }]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
rippled json ledger_entry '{ "check": "C4A46CCD8F096E994C4B0DEAB6CE98E722FC17D7944C28B95127C2659C47CBEB", "ledger_index": "validated" }'
```
{% /tab %}

{% /tabs %}

[試してみる >](/resources/dev-tools/websocket-api-tool#ledger_entry-check)



### Escrowオブジェクトを取得する

[Escrowオブジェクト](../../../protocol/ledger-data/ledger-entry-types/escrow.md)を取得します。文字列(エスクローのオブジェクトID)またはオブジェクトとして指定します。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.0.0" %}新規: rippled 1.0.0{% /badge %}

| フィールド                | 型                         | 説明                   |
|:------------------------|:---------------------------|:----------------------|
| `escrow`                | オブジェクト または 文字列     | 取得する[Escrowオブジェクト](../../../protocol/ledger-data/ledger-entry-types/escrow.md)を指定します。文字列の場合は、エスクローの[オブジェクトID](../../../protocol/ledger-data/common-fields.md)を16進数で指定します。オブジェクトの場合、`owner`と`seq`サブフィールドを指定します。. |
| `escrow.owner`          | 文字列 - [アドレス][]        | _(`escrow`がオブジェクト形式で指定されている場合、必須)_ Escrowオブジェクトの所有者（送信者）。 |
| `escrow.seq`            | 符号なし整数                 | _(`escrow`がオブジェクト形式で指定されている場合、必須)_ エスクローオブジェクトを作成したトランザクションの[シーケンス番号][]。 |

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "example_get_escrow",
  "command": "ledger_entry",
  "escrow": {
    "owner": "rL4fPHi2FWGwRGRQSH7gBcxkuo2b9NTjKK",
    "seq": 126
  },
  "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "ledger_entry",
  "params": [{
    "escrow": {
      "owner": "rL4fPHi2FWGwRGRQSH7gBcxkuo2b9NTjKK",
      "seq": 126
    },
    "ledger_index": "validated"
  }]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
rippled json ledger_entry '{ "escrow": { "owner": "rL4fPHi2FWGwRGRQSH7gBcxkuo2b9NTjKK", "seq": 126 }, "ledger_index": "validated" }'
```
{% /tab %}

{% /tabs %}

[試してみる >](/resources/dev-tools/websocket-api-tool#ledger_entry-escrow)



### PayChannelオブジェクトを取得する

非同期決済用のXRPを保持する[PayChannelオブジェクト](../../../protocol/ledger-data/ledger-entry-types/paychannel.md)を取得します。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.0.0" %}新規: rippled 1.0.0{% /badge %}.

| フィールド          | 型     | 説明                                             |
|:------------------|:-------|:------------------------------------------------|
| `payment_channel` | 文字列  | 取得する[PayChannelオブジェクト](../../../protocol/ledger-data/ledger-entry-types/paychannel.md)の[オブジェクトID](../../../protocol/ledger-data/common-fields.md)。 |

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "example_get_paychannel",
  "command": "ledger_entry",
  "payment_channel": "C7F634794B79DB40E87179A9D1BF05D05797AE7E92DF8E93FD6656E8C4BE3AE7",
  "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "ledger_entry",
  "params": [{
    "payment_channel": "C7F634794B79DB40E87179A9D1BF05D05797AE7E92DF8E93FD6656E8C4BE3AE7",
    "ledger_index": "validated"
  }]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
rippled json ledger_entry '{ "payment_channel": "C7F634794B79DB40E87179A9D1BF05D05797AE7E92DF8E93FD6656E8C4BE3AE7", "ledger_index": "validated" }'
```
{% /tab %}

{% /tabs %}

[試してみる >](/resources/dev-tools/websocket-api-tool#ledger_entry-paychannel)


### DepositPreauthオブジェクトを取得する

[DepositPreauthオブジェクト](../../../protocol/ledger-data/ledger-entry-types/depositpreauth.md)を取得します。このオブジェクトは、[Deposit Authorization](../../../../concepts/accounts/depositauth.md)を必要とする口座への支払いの事前承認を記録します。文字列（DepositPreauthのオブジェクトID）またはオブジェクトとして指定します。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.1.0" %}新規: rippled 1.1.0{% /badge %}.

| フィールド                     | 型                     | 説明                    |
|:-----------------------------|:-----------------------|:-----------------------|
| `deposit_preauth`            | オブジェクト または 文字列 | 取得する[DepositPreauthオブジェクト](../../../protocol/ledger-data/ledger-entry-types/depositpreauth.md)を指定します。文字列の場合、DepositPreauthオブジェクトの[オブジェクトID](../../../protocol/ledger-data/common-fields.md)を16進数で指定します。オブジェクトの場合、`owner`と`authorized`のサブフィールドを指定します。 |
| `deposit_preauth.owner`      | 文字列 - [アドレス][]    | _(`deposit_preauth`がオブジェクト形式で指定されている場合、必須)_ 事前承認を行ったアカウント。 |
| `deposit_preauth.authorized` | 文字列 - [アドレス][]    | _(`deposit_preauth`がオブジェクト形式で指定されている場合、必須)_ 事前承認を受けたアカウント。 |

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "example_get_deposit_preauth",
  "command": "ledger_entry",
  "deposit_preauth": {
    "owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "authorized": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX"
  },
  "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "ledger_entry",
  "params": [{
    "deposit_preauth": {
      "owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "authorized": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX"
    },
    "ledger_index": "validated"
  }]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
rippled json ledger_entry '{ "deposit_preauth": { "owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "authorized": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX" }, "ledger_index": "validated" }'
```
{% /tab %}

{% /tabs %}

[試してみる >](/resources/dev-tools/websocket-api-tool#ledger_entry-depositpreauth)


### Ticketオブジェクトを取得する

将来の使用のために確保された[シーケンス番号][]を表す[Ticketオブジェクト](../../../protocol/ledger-data/ledger-entry-types/ticket.md)を取得します。文字列(TicketのオブジェクトID)またはオブジェクトを指定します。 _([TicketBatch amendment][]により追加されました。)_

| フィールド            | 型                     | 説明                   |
|:--------------------|:-----------------------|:----------------------|
| `ticket`            | オブジェクト または 文字列 | 取得する[Ticketオブジェクト](../../../protocol/ledger-data/ledger-entry-types/ticket.md)。文字列の場合、チケットの[オブジェクトID](../../../protocol/ledger-data/common-fields.md)を16進数で指定します。オブジェクトの場合、チケットエントリを一意に指定するために`account`と`ticket_seq`サブフィールドを指定します。 |
| `ticket.account`    | 文字列 - [アドレス][]    | _(`ticket`がオブジェクト形式で指定されている場合、必須)_ Ticketオブジェクトの所有者を指定します。 |
| `ticket.ticket_seq` | 数値                   | _(`ticket`がオブジェクト形式で指定されている場合、必須)_ 取得するTicketのTicketシーケンス番号を指定します。 |

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "example_get_ticket",
  "command": "ledger_entry",
  "ticket": {
    "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "ticket_seq": 389
  },
  "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "ledger_entry",
  "params": [{
    "ticket": {
      "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "ticket_seq": 389
    },
    "ledger_index": "validated"
  }]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
rippled json ledger_entry '{ "ticket": { "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "ticket_seq: 389 }, "ledger_index": "validated" }'
```
{% /tab %}

{% /tabs %}

[試してみる >](/resources/dev-tools/websocket-api-tool#ledger_entry-ticket)


### NFT Pageを取得する

NFT ページを生のレジャー形式で取得します。

| フィールド                | 型     | 説明                   |
|:------------------------|:-------|:----------------------|
| `nft_page`              | 文字列  | 取得する[NFTページ](../../../protocol/ledger-data/ledger-entry-types/nftokenpage.md)の[オブジェクトID](../../../protocol/ledger-data/common-fields.md)。 |

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": "example_get_nft_page",
    "command": "ledger_entry",
    "nft_page": "255DD86DDF59D778081A06D02701E9B2C9F4F01DFFFFFFFFFFFFFFFFFFFFFFFF",
    "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "ledger_entry",
  "params": [{
    "nft_page": "255DD86DDF59D778081A06D02701E9B2C9F4F01DFFFFFFFFFFFFFFFFFFFFFFFF",
    "ledger_index": "validated"
  }]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
rippled json ledger_entry '{ "nft_page": "255DD86DDF59D778081A06D02701E9B2C9F4F01DFFFFFFFFFFFFFFFFFFFFFFFF", "ledger_index": "validated" }'
```
{% /tab %}

{% /tabs %}

[試してみる >](/resources/dev-tools/websocket-api-tool#ledger_entry-nft-page)

## レスポンスのフォーマット

レスポンスは[標準フォーマット][]に従って、成功結果には以下のフィールドが含まれます。

| フィールド       | 型               | 説明                                      |
|:---------------|:-----------------|:-----------------------------------------|
| `index`        | 文字列            | [レジャーオブジェクト](../../../protocol/ledger-data/ledger-entry-types/index.md)の一意のID。 |
| `ledger_index` | 符号なし整数       | このデータを取得する際に使用したレジャーの [レジャーインデックス][]。 |
| `node`         | オブジェクト       | _(`"binary": true`が指定されている場合、省略)_ [レジャーフォーマット][]に基づいた、この元帳オブジェクトのデータを含むオブジェクト。 |
| `node_binary`  | 文字列            | _(`"binary": true`が指定されていない場合、省略)_ レジャーオブジェクトの[バイナリ形式](../../../protocol/binary-format.md)を16進数で表したもの。 |

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "example_get_accountroot",
  "result": {
    "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
    "ledger_hash": "31850E8E48E76D1064651DF39DF4E9542E8C90A9A9B629F4DE339EB3FA74F726",
    "ledger_index": 61966146,
    "node": {
      "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "AccountTxnID": "4E0AA11CBDD1760DE95B68DF2ABBE75C9698CEB548BEA9789053FCB3EBD444FB",
      "Balance": "424021949",
      "Domain": "6D64756F31332E636F6D",
      "EmailHash": "98B4375E1D753E5B91627516F6D70977",
      "Flags": 9568256,
      "LedgerEntryType": "AccountRoot",
      "MessageKey": "0000000000000000000000070000000300",
      "OwnerCount": 12,
      "PreviousTxnID": "4E0AA11CBDD1760DE95B68DF2ABBE75C9698CEB548BEA9789053FCB3EBD444FB",
      "PreviousTxnLgrSeq": 61965653,
      "RegularKey": "rD9iJmieYHn8jTtPjwwkW2Wm9sVDvPXLoJ",
      "Sequence": 385,
      "TransferRate": 4294967295,
      "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8"
    },
    "validated": true
  },
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
  "result": {
    "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
    "ledger_hash": "395946243EA36C5092AE58AF729D2875F659812409810A63096AC006C73E656E",
    "ledger_index": 61966165,
    "node": {
      "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "AccountTxnID": "4E0AA11CBDD1760DE95B68DF2ABBE75C9698CEB548BEA9789053FCB3EBD444FB",
      "Balance": "424021949",
      "Domain": "6D64756F31332E636F6D",
      "EmailHash": "98B4375E1D753E5B91627516F6D70977",
      "Flags": 9568256,
      "LedgerEntryType": "AccountRoot",
      "MessageKey": "0000000000000000000000070000000300",
      "OwnerCount": 12,
      "PreviousTxnID": "4E0AA11CBDD1760DE95B68DF2ABBE75C9698CEB548BEA9789053FCB3EBD444FB",
      "PreviousTxnLgrSeq": 61965653,
      "RegularKey": "rD9iJmieYHn8jTtPjwwkW2Wm9sVDvPXLoJ",
      "Sequence": 385,
      "TransferRate": 4294967295,
      "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8"
    },
    "status": "success",
    "validated": true
  }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```json
{
  "result": {
    "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
    "ledger_hash": "395946243EA36C5092AE58AF729D2875F659812409810A63096AC006C73E656E",
    "ledger_index": 61966165,
    "node": {
      "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "AccountTxnID": "4E0AA11CBDD1760DE95B68DF2ABBE75C9698CEB548BEA9789053FCB3EBD444FB",
      "Balance": "424021949",
      "Domain": "6D64756F31332E636F6D",
      "EmailHash": "98B4375E1D753E5B91627516F6D70977",
      "Flags": 9568256,
      "LedgerEntryType": "AccountRoot",
      "MessageKey": "0000000000000000000000070000000300",
      "OwnerCount": 12,
      "PreviousTxnID": "4E0AA11CBDD1760DE95B68DF2ABBE75C9698CEB548BEA9789053FCB3EBD444FB",
      "PreviousTxnLgrSeq": 61965653,
      "RegularKey": "rD9iJmieYHn8jTtPjwwkW2Wm9sVDvPXLoJ",
      "Sequence": 385,
      "TransferRate": 4294967295,
      "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8"
    },
    "status": "success",
    "validated": true
  }
}
```
{% /tab %}

{% /tabs %}


## 考えられるエラー

* いずれかの[汎用エラータイプ][]。
* `deprecatedFeature` - 削除されたフィールド（`generator`など）がリクエストに指定されていました。
* `entryNotFound` - リクエストされたレジャーオブジェクトはレジャーに存在しません。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバが保有していません。
* `malformedAddress` - リクエストの[アドレス][]フィールドが誤って指定されています。
* `malformedCurrency` - リクエストの[通貨コード][]フィールドが誤って指定されています。
* `malformedOwner` - リクエストの`escrow.owner`サブフィールドが誤って指定されています。
* `malformedRequest` - リクエストにフィールドが無効な組み合わせで指定されているか、1つ以上のフィールドの型が誤っています。
* `unknownOption` - リクエストに指定されたフィールドが、予期されるリクエストのフォーマットのいずれにも一致していません。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
