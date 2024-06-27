---
html: ripplestate.html
parent: ledger-entry-types.html
seo:
    description: 2つのアカウントをリンクし、それらのアカウント間の特定の通貨の残高を追跡します。トラストラインのコンセプトは、このオブジェクトタイプを抽象化することです。
labels:
  - トークン
---
# RippleState
[[ソース]](https://github.com/XRPLF/rippled/blob/5d2d88209f1732a0f8d592012094e345cbe3e675/src/ripple/protocol/impl/LedgerFormats.cpp#L70 "Source")

`RippleState`のレジャーエントリは、2つのアカウント間の[トラストライン](../../../../concepts/tokens/fungible-tokens/index.md)を表します。各アカウントは限度額やその他の設定を変更できますが、残高は共通の値です。完全にデフォルトのトラストラインは、存在しないトラストラインと同じとみなされ、自動的に削除されます。

## 高位vs低位アカウント

`RippleState`エントリは、任意のアカウントペアに対して1通貨につき1つだけです。XRP Ledgerではどのアカウントも特権を持たないため、`RippleState`エントリはアカウントアドレスを数値順にソートし、正規の形式を保証します。[デコード](../../../../concepts/accounts/addresses.md#アドレスのエンコード)したときに数値が小さい方のアドレスが"低位アカウント(low account)"、もう一方が"高位アカウント(high account)"とみなされます。トラストラインの純残高は、低位アカウント基準で保存されます。

トラストラインの残高の["issuer"](../../../../concepts/tokens/fungible-tokens/index.md)は、残高がプラスかマイナスかによって異なります。もし`RippleState`エントリが正の残高を示していれば、高位アカウントが発行者です。残高がマイナスの場合、低位アカウントが発行者です。多くの場合、発行者の限度額は0に設定され、もう一方のアカウントの限度額はプラスに設定されていますが、限度額既存の残高に影響を与えることなく変更される可能性があるため、これは信頼できません。


## {% $frontmatter.seo.title %}のJSONの例

```json
{
  "Balance": {
    "currency": "USD",
    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
    "value": "-10"
  },
  "Flags": 393216,
  "HighLimit": {
    "currency": "USD",
    "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "value": "110"
  },
  "HighNode": "0000000000000000",
  "LedgerEntryType": "RippleState",
  "LowLimit": {
    "currency": "USD",
    "issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
    "value": "0"
  },
  "LowNode": "0000000000000000",
  "PreviousTxnID": "E3FE6EA3D48F0C2B639448020EA4F03D4F4F8FFDB243A852A0F59177921B4879",
  "PreviousTxnLgrSeq": 14090896,
  "index": "9CA88CDEDFF9252B3DE183CE35B038F57282BC9503CDFA1923EF9A95DF0D6F7B"
}
```

## {% $frontmatter.seo.title %}のフィールド

[共通フィールド][]に加えて、{% $frontmatter.seo.title %}エントリは以下のフィールドを使用します。

| 名前                 | JSONの型   | [内部の型][]  | 必須? | 説明 |
|:--------------------|:-----------|:------------|:------|:----|
| `Balance`           | オブジェクト | Amount      | はい   | 低位アカウントからみたトラストラインの残高。残高がマイナスの場合、低位アカウントから高位アカウントに対して通貨が発行されています。この場合のイシュアーは常に中立値[ACCOUNT_ONE](../../../../concepts/accounts/addresses.md#特別なアドレス)に設定されます。 |
| `Flags`             | 数値        | UInt32      | はい   | このオブジェクトに対して有効になっているブールオプションのビットマップ。 |
| `HighLimit`         | オブジェクト | Amount      | はい   | 高位アカウントがトラストラインに設定した限度額。`issuer`は、この限度額を設定した高位アカウントのアドレスです。 |
| `HighNode`          | 文字列      | UInt64      | はい   | （一部の履歴レジャーでは省略されます）高位アカウントの所有者ディレクトリが複数ページで構成されている場合に、このオブジェクトにリンクしているページを示すヒントです。 |
| `HighQualityIn`     | 数値       | UInt32       | いいえ | （省略可）暗黙の比率（HighQualityIn:1,000,000,000）で整数として高位アカウントにより設定された着信品質。値が0の場合は10億または額面価格と同等です。 |
| `HighQualityOut`    | 数値       | UInt32       | いいえ | （省略可）暗黙の比率（HighQualityOut:1,000,000,000）で整数として高位アカウントにより設定された発信品質。値が0の場合は10億または額面価格と同等です。 |
| `LedgerEntryType`   | 文字列      | UInt16      | はい   | 値`0x0072`が文字列`RippleState`にマッピングされている場合は、このオブジェクトがRippleStateオブジェクトであることを示します。 |
| `LowLimit`          | オブジェクト | Amount      | はい   | 低位アカウントがトラストラインに設定した限度額。`issuer`は、この限度額を設定した低位アカウントのアドレスです。 |
| `LowNode`           | 文字列      | UInt64      | はい   | （一部の履歴レジャーでは省略されます）低位アカウントの所有者ディレクトリが複数ページで構成されている場合に、このオブジェクトにリンクしているページを示すヒントです。 |
| `LowQualityIn`      | 数値       | UInt32       | いいえ | （省略可）暗黙の比率（LowQualityIn:1,000,000,000）で整数として低位アカウントにより設定された着信品質。値が0の場合は10億または額面価格と同等です。 |
| `LowQualityOut`     | 数値       | UInt32       | いいえ | （省略可）暗黙の比率（LowQualityOut:1,000,000,000）で整数として低位アカウントにより設定された発信品質。値が0の場合は10億または額面価格と同等です。 |
| `PreviousTxnID`     | 文字列     | Hash256      | はい   | 最後にこのオブジェクトを変更したトランザクションの識別用ハッシュ。 |
| `PreviousTxnLgrSeq` | 数値       | UInt32       | はい   | 最後にこのオブジェクトを変更したトランザクションが記録された[レジャーインデックス][]。 |

## RippleStateのフラグ

`RippleState`エントリは以下のフラグを`Flags`フィールドに設定することができます。

| フラグ名           | 16進数値       | 10進数値 | 対応する[TrustSetフラグ](../../transactions/types/trustset.md#trustsetのフラグ) | 説明 | 
|-------------------|--------------|----------|-------------|------------------------|
| `lsfAMMNode`      | `0x01000000` | 16777216 | (なし)  | このトラストラインがAMMアカウントに紐づくことを表します。 |
| `lsfLowReserve`   | `0x00010000` | 65536    | （なし） | このRippleStateオブジェクトは[低位アカウント所有者の準備金に資金を供給します](#所有者の準備金への資金供給)。 |
| `lsfHighReserve`  | `0x00020000` | 131072   | （なし） | このRippleStateオブジェクトは[高位アカウント所有者の準備金に資金を供給します](#所有者の準備金への資金供給)。 |
| `lsfLowAuth`      | `0x00040000` | 262144   | `tfSetAuth` | 低位アカウントにより、高位アカウントが低位アカウントのイシュアンスを保有することが承認されています。 |
| `lsfHighAuth`     | `0x00080000` | 524288   | `tfSetAuth` | 高位アカウントにより、低位アカウントが高位アカウントのイシュアンスを保有することが承認されています。 |
| `lsfLowNoRipple`  | `0x00100000` | 1048576  | `tfSetNoRipple` | 低位アカウントで、このトラストラインから、同じアカウントのNoRippleフラグが設定されている他のトラストラインへの[Ripplingが無効化されています](../../../../concepts/tokens/fungible-tokens/rippling.md)。 |
| `lsfHighNoRipple` | `0x00200000` | 2097152   | `tfSetNoRipple` | 高位アカウントで、このトラストラインから、同じアカウントのNoRippleフラグが設定されている他のトラストラインへの[Ripplingが無効化されています](../../../../concepts/tokens/fungible-tokens/rippling.md)。 |
| `lsfLowFreeze`    | `0x00400000` | 4194304  | `tfSetFreeze` | 低位アカウントがトラストラインを凍結しており、高位アカウントから資産を移動できません。 |
| `lsfHighFreeze`   | `0x00800000` | 8388608  | `tfSetFreeze` | 高位アカウントがトラストラインを凍結しており、低位アカウントから資産を移動できません。 |

トラストラインによって接続された2つのアカウントは、[TrustSetトランザクション][]を使用して、それぞれの設定を変更することができます。


## {% $frontmatter.seo.title %}の準備金
<a id="contributing-to-the-owner-reserve"></a>

`RippleState`エントリは、接続するアカウントの一方または両方の[所有者準備金](../../../../concepts/accounts/reserves.md#所有者準備金)の対象の1つとしてカウントされます。一般的なケースでは、トークンの所有者は準備金を支払う必要があり、トークンの発行者は準備金を支払いません。

特に、そのアカウントがトラストラインをデフォルト以外の状態に変更した場合、そのエントリはアカウントの準備金にカウントされます。`lsfLowReserve`フラグと`lsfHighReserve`フラグは、どのアカウントが所有者の準備金に責任を持つかを示します。プロトコルはトラストラインを変更すると自動的にこれらのフラグを設定します。

トラストラインのデフォルト以外の状態に反映される値は以下の通りです。

| 高位アカウントに責任がある場合の条件 | 低位アカウントに責任がある場合の条件 |
|-----------------------|----------------------|
| `Balance`がマイナスである（高位アカウントが通貨を保有している） | `Balance`がプラスである（低位アカウントが通貨を保有している） |
| `HighLimit`が`0`ではない | `LowLimit`が`0`ではない |
| `LowQualityIn`が`0`でも`1000000000`でもない | `HighQualityIn`が`0`でも`1000000000`でもない |
| `LowQualityOut`が`0`でも `1000000000`でもない | `HighQualityOut`が`0`でも`1000000000`でもない |
| `lsfHighNoRipple`フラグがデフォルト状態ではない | `lsfLowNoRipple`フラグがデフォルト状態ではない |
| `lsfHighFreeze`フラグが有効である | `lsfLowFreeze`フラグが有効である |

**`lsfLowAuth`**フラグと **`lsfHighAuth`**フラグは無効にできないため、デフォルト状態に不利に作用することはありません。

2つのNoRippleフラグのデフォルト状態は、対応するAccountRootオブジェクトの[lsfDefaultRippleフラグ](accountroot.md#accountrootのフラグ)の状態によって異なります。DefaultRippleが無効の場合（デフォルト）、アカウントのすべてのトラストラインのlsfNoRippleフラグはデフォルトで _有効_ となります。アカウントがDefaultRippleを有効にすると、アカウントのトラストラインのlsfNoRippleフラグはデフォルトで _無効_ となります（Ripplingが有効になります）。

**注記:** `rippled`バージョン0.27.3（2015年3月10日）にてDefaultRippleフラグが導入される前は、すべてのトラストラインはデフォルトで両方のNoRippleフラグが無効になっていました（Ripplingは有効）。

XRP Ledgerは遅延評価を使用して所有者準備金を計算しています。つまり、アカウントがDefaultRippleフラグを変更してそのすべてのトラストラインのデフォルト状態を変更しても、変更後しばらくの間はアカウントの準備金が同じ状態で維持されます。アカウントがトラストラインを変更すると、プロトコルは個々のトラストラインがデフォルト状態にあるか否かや、所有者準備金への資金供給の必要性を再評価します。

## RippleState IDのフォーマット

RippleStateオブジェクトのIDは、以下の値がこの順序で連結されている[SHA-512ハーフ][]です。

* RippleStateスペースキー（`0x0072`）
* 低位アカウントのAccountID
* 高位アカウントのAccountID
* トラストラインの160ビットの通貨コード

{% raw-partial file="/docs/_snippets/common-links.md" /%}
