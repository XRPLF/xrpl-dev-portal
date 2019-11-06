# RippleState
[[ソース]<br>](https://github.com/ripple/rippled/blob/5d2d88209f1732a0f8d592012094e345cbe3e675/src/ripple/protocol/impl/LedgerFormats.cpp#L70 "Source")

`RippleState`オブジェクトタイプは、1つの通貨で2つのアカウントを接続します。概念的には`RippleState`オブジェクトは、アカウント間の2つの _トラストライン_ を表し、各アカウント側から1つずつ確立されます。各アカウントの`RippleState`オブジェクト設定は、各アカウント側で変更できますが、残高については単一の値を両アカウント間で共有します。完全にデフォルト状態のトラストラインは、存在しないトラストラインと同様に見なされます。このため`rippled` は、プロパティがすべてデフォルトである`RippleState`オブジェクトを削除します。

XRP Ledgerではどのアカウントにも権限がないため、`RippleState`オブジェクトはアカウントアドレスを数値順にソートし、正規の形式になるようにします。数値順の低いアドレスは「低位アカウント」と見なされ、数値順の高いアドレスは「高位アカウント」と見なされます。

## {{currentpage.name}} JSONの例

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

## {{currentpage.name}}フィールド

`RippleState`オブジェクトのフィールドは次のとおりです。

| 名前            | JSONの型 | 内部の型 | 説明 |
|-----------------|-----------|---------------|-------------|
| `LedgerEntryType` | 文字列    | UInt16 | 値`0x0072`が文字列`RippleState`にマッピングされている場合は、このオブジェクトがRippleStateオブジェクトであることを示します。 |
| `Flags`           | 数値    | UInt32 | このオブジェクトに対して有効になっているブールオプションのビットマップ。 |
| `Balance`         | オブジェクト    | Amount | 低位アカウントからみたトラストラインの残高。残高がマイナスの場合、低位アカウントから高位アカウントに対して通貨が発行されています。この場合のイシュアーは常に中立値[ACCOUNT_ONE](accounts.html#特別なアドレス)に設定されます。 |
| `LowLimit`        | オブジェクト    | Amount | 低位アカウントがトラストラインに設定した限度額。`issuer`は、この限度額を設定した低位アカウントのアドレスです。 |
| `HighLimit`       | オブジェクト    | Amount | 高位アカウントがトラストラインに設定した限度額。`issuer`は、この限度額を設定した高位アカウントのアドレスです。 |
| `PreviousTxnID`   | 文字列    | Hash256 | 最後にこのオブジェクトを変更したトランザクションの識別用ハッシュ。 |
| `PreviousTxnLgrSeq` | 数値  | UInt32 | 最後にこのオブジェクトを変更したトランザクションが記録された[レジャーインデックス][]。 |
| `LowNode`         | 文字列    | UInt64 | （一部の履歴レジャーでは省略されます）低位アカウントの所有者ディレクトリが複数ページで構成されている場合に、このオブジェクトにリンクしているページを示すヒントです。 |
| `HighNode`        | 文字列    | UInt64 | （一部の履歴レジャーでは省略されます）高位アカウントの所有者ディレクトリが複数ページで構成されている場合に、このオブジェクトにリンクしているページを示すヒントです。 |
| `LowQualityIn`    | 数値    | UInt32 | （省略可）暗黙の比率（LowQualityIn:1,000,000,000）で整数として低位アカウントにより設定された着信品質。値が0の場合は10億または額面価格と同等です。 |
| `LowQualityOut`   | 数値    | UInt32 | （省略可）暗黙の比率（LowQualityOut:1,000,000,000）で整数として低位アカウントにより設定された発信品質。値が0の場合は10億または額面価格と同等です。 |
| `HighQualityIn`   | 数値    | UInt32 | （省略可）暗黙の比率（HighQualityIn:1,000,000,000）で整数として高位アカウントにより設定された着信品質。値が0の場合は10億または額面価格と同等です。 |
| `HighQualityOut`  | 数値    | UInt32 | （省略可）暗黙の比率（HighQualityOut:1,000,000,000）で整数として高位アカウントにより設定された発信品質。値が0の場合は10億または額面価格と同等です。 |

## RippleStateのフラグ

トラストラインに対して有効化または無効化できる各種オプションがあります。これらのオプションを変更するには、[TrustSetトランザクション][]を使用します。レジャーではフラグはバイナリ値として表され、これらのバイナリ値はビットOR演算と組み合わせることができます。レジャーでのフラグのビット値は、トランザクションでこれらのフラグを有効または無効にするために使用する値とは異なります。レジャーのフラグには、 _lsf_ で始まる名前が付いています。

RippleStateオブジェクトには以下のフラグ値を指定できます。

| フラグ名 | 16進数値 | 10進数値 | 説明 | 対応する[TrustSetフラグ](trustset.html#trustsetのフラグ) |
|-----------|-----------|---------------|-------------|------------------------|
| lsfLowReserve | 0x00010000 | 65536 | このRippleStateオブジェクトは[低位アカウント所有者の準備金に資金を供給します](#所有者の準備金への資金供給)。 | （なし） |
| lsfHighReserve | 0x00020000 |131072 | このRippleStateオブジェクトは[高位アカウント所有者の準備金に資金を供給します](#所有者の準備金への資金供給)。 | （なし） |
| lsfLowAuth | 0x00040000 | 262144 | 低位アカウントにより、高位アカウントが低位アカウントのイシュアンスを保有することが承認されています。 | tfSetAuth |
| lsfHighAuth | 0x00080000 | 524288 |  高位アカウントにより、低位アカウントが高位アカウントのイシュアンスを保有することが承認されています。 | tfSetAuth |
| lsfLowNoRipple | 0x00100000 | 1048576 | 低位アカウントで、このトラストラインから、同じアカウントのNoRippleフラグが設定されている他のトラストラインへの[Ripplingが無効化されています](rippling.html)。 | tfSetNoRipple |
| lsfHighNoRipple | 0x00200000 | 2097152 | 高位アカウントで、このトラストラインから、同じアカウントのNoRippleフラグが設定されている他のトラストラインへの[Ripplingが無効化されています](rippling.html)。 | tfSetNoRipple |
| lsfLowFreeze | 0x00400000 | 4194304 | 低位アカウントがトラストラインを凍結しており、高位アカウントから資産を移動できません。 | tfSetFreeze |
| lsfHighFreeze | 0x00800000 | 8388608 | 高位アカウントがトラストラインを凍結しており、低位アカウントから資産を移動できません。 | tfSetFreeze |

## 所有者の準備金への資金供給

アカウントがトラストラインをデフォルト以外の状態に変更した場合、そのトラストラインはアカウントの[所有者準備金](reserves.html#所有者準備金)に反映されます。RippleStateオブジェクトの`lsfLowReserve`フラグと`lsfHighReserve`フラグは、いずれのアカウントが所有者準備金に責任があるかを示します。`rippled`サーバーは、トラストラインの変更時にこれらのフラグを自動的に設定します。

トラストラインのデフォルト以外の状態に反映される値は以下の通りです。

| 高位アカウントに責任がある場合の条件 | 低位アカウントに責任がある場合の条件 |
|-----------------------|----------------------|
| `Balance` がマイナスである（高位アカウントが通貨を保有している） | `Balance` がプラスである（低位アカウントが通貨を保有している） |
| `HighLimit` が `0` ではない | `LowLimit` が `0` ではない |
| `LowQualityIn` が`0`でも `1000000000` でもない | `HighQualityIn` が`0`でも `1000000000` でもない |
| `LowQualityOut` が`0`でも `1000000000` でもない | `HighQualityOut` が`0`でも `1000000000` でもない |
| **lsfHighNoRipple**フラグがデフォルト状態ではない | **lsfLowNoRipple**フラグがデフォルト状態ではない |
| **lsfHighFreeze**フラグが有効である | **lsfLowFreeze**フラグが有効である |

**lsfLowAuth**フラグと**lsfHighAuth**フラグは無効にできないため、デフォルト状態に不利に作用することはありません。

2つのNoRippleフラグのデフォルト状態は、対応するAccountRootオブジェクトの[lsfDefaultRippleフラグ](accountroot.html#accountrootのフラグ)の状態によって異なります。DefaultRippleが無効の場合（デフォルト）、アカウントのすべてのトラストラインのlsfNoRippleフラグはデフォルトで _有効_ となります。アカウントがDefaultRippleを有効にすると、アカウントのトラストラインのlsfNoRippleフラグはデフォルトで _無効_ となります（Ripplingが有効になります）。

**注記:** `rippled`バージョン0.27.3（2015年3月10日）にてDefaultRippleフラグが導入される前は、すべてのトラストラインはデフォルトで両方のNoRippleフラグが無効になっていました（Ripplingは有効）。

`rippled`は遅延評価を使用して所有者準備金を計算しています。つまり、アカウントがDefaultRippleフラグを変更してそのすべてのトラストラインのデフォルト状態を変更しても、変更後しばらくの間はアカウントの準備金が同じ状態で維持されます。アカウントがトラストラインを変更すると、`rippled`は個々のトラストラインがデフォルト状態にあるか否かや、所有者準備金への資金供給の必要性を再評価します。

## RippleState IDのフォーマット

RippleStateオブジェクトのIDは、以下の値がこの順序で連結されている[SHA-512ハーフ][]です。

* RippleStateスペースキー（`0x0072`）
* 低位アカウントのAccountID
* 高位アカウントのAccountID
* トラストラインの160ビットの通貨コード

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
