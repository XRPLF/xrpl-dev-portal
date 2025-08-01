---
html: ledger-header.html
parent: ledger-data-formats.html
seo:
    description: レジャーバージョンの内容を記述する一意のヘッダーです。
labels:
  - データ保持
  - ブロックチェーン
---
# レジャーヘッダー
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/ledger/ReadView.h#L71 "Source")

すべてのレジャーバージョンには、その内容を記述する一意のヘッダーが含まれています。[ledgerメソッド][]を使用してレジャーのヘッダー情報を検索できます。レジャーヘッダーの内容を以下に示します。

| フィールド | JSONの型 | [内部の型][] | 説明   |
|:-----------------------------|:----------|:------------------|:--------------|
| `ledger_index` | 文字列 | UInt32 | レジャーの[レジャーインデックス][レジャーインデックス]。APIメソッドの中には、この番号を引用符で囲んだ整数として表示するメソッドと、ネイティブJSON数値として表示するメソッドがあります。 |
| `ledger_hash` | 文字列 | UInt256 | このレジャーバージョンの[SHA-512Half][]。これは、このレジャーとそのすべての内容の一意のIDとして機能します。 |
| `account_hash` | 文字列 | UInt256 | このレジャーの状態ツリー情報の[SHA-512Half][]。 |
| `close_time` | 数値 | UInt32 | このレジャーバージョンが閉鎖されたおおよその時刻。Rippleエポック（2000-01-01 00:00:00）以降の経過秒数として示されます。この値は、`close_time_resolution`に基づいて丸められます。 |
| `closed` | ブール値 | ブール値 | `true`の場合、このレジャーバージョンはこれ以上新しいトランザクションを受け入れません。（ただし、このレジャーバージョンが未検証の場合は、一連の異なるトランザクションが記録されている別のレジャーバージョンに置き換えられることがあります。） |
| `parent_hash` | 文字列 | UInt256 | このバージョンの直前のレジャーバージョンの`ledger_hash`値。直前のレジャーインデックスの異なるバージョンが存在している場合、これはレジャーの生成元を示します。 |
| `total_coins` | 文字列 | UInt64 | レジャーのアカウントが保有するXRPの[XRPのdrop数][]の合計。トランザクション手数料により消却されたXRPは除外されます。一部のアカウントは、そのキーを知っている人がいない「ブラックホール」アカウントであるため、流通している実際のXRPの量はこれよりも少なくなります。 |
| `transaction_hash` | 文字列 | UInt256 | このレジャーに記録されているトランザクションの[SHA-512Half][]。 |
| `close_time_resolution` | 数値 | Uint8 | `close_time`を丸めるときの最大秒数を示す範囲[2,120]内の整数。 |
| [`closeFlags`](#closeフラグ) | （省略） | UInt8 | このレジャーの閉鎖に関連するフラグのビットマップ。 |


## レジャーインデックス
{% partial file="/@l10n/ja/docs/_snippets/data_types/ledger_index.md" /%}



## closeフラグ

レジャーでは1つのフラグだけがcloseFlagsとして設定されています（**sLCF_NoConsensusTime**（値`1`））。このフラグが有効な場合、バリデータによってレジャーの閉鎖時刻が異なります。ただし、作成しているレジャーは同一のものであるため、バリデータは閉鎖時刻について「合意をしないことに合意する」とした上でコンセンサスを宣言しました。この場合、コンセンサスレジャーバージョンの`close_time`の値は直前のバージョンの1秒後です。（この場合、正式な閉鎖時刻がありませんが、実際の閉鎖時刻はおそらく指定されている`close_time`の3～6秒後です。）

`closeFlags`フィールドはレジャーのJSON表現には含まれていませんが、レジャーのバイナリ表現には含まれており、レジャーのハッシュを判別するフィールドの1つです。


## 関連項目

レジャーの基本的な説明については、[レジャー](../../../concepts/ledgers/index.md)をご覧ください。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
