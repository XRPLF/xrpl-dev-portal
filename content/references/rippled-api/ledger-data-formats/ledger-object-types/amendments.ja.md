# Amendments
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/impl/LedgerFormats.cpp#L110-L113 "Source")

`Amendments`オブジェクトタイプには、現在アクティブな[Amendment](amendments.html)のリストが含まれています。各レジャーバージョンには**最大で1つの** `Amendments`オブジェクトが含まれています。

## {{currentpage.name}}のJSONの例

```json
{
    "Majorities": [
        {
            "Majority": {
                "Amendment": "1562511F573A19AE9BD103B5D6B9E01B3B46805AEC5D3C4805C902B514399146",
                "CloseTime": 535589001
            }
        }
    ],
    "Amendments": [
        "42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE",
        "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373",
        "6781F8368C4771B83E8B821D88F580202BCB4228075297B19E4FDC5233F1EFDC",
        "740352F2412A9909880C23A559FCECEDA3BE2126FED62FC7660D628A06927F11"
    ],
    "Flags": 0,
    "LedgerEntryType": "Amendments",
    "index": "7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4"
}
```

## {{currentpage.name}}のフィールド

| 名前              | JSONの型 | [内部の型][] | 説明 |
|-------------------|-----------|-------------------|-------------|
| `Amendments`      | 配列     | STI_VECTOR256     | _（省略可）_ 現在有効なすべてのAmendmentの256ビット[Amendment ID](amendments.html#amendmentについて)からなる配列。省略されている場合は、有効なAmendmentがありません。 |
| `Majorities`      | 配列     | STI_ARRAY | _（省略可）_ 過半数の支持を得ているがまだ有効になっていないAmendmentのステータスを記述するオブジェクトの配列。省略されている場合は、過半数の支持を得ている保留中のAmendmentがありません。 |
| `Flags`           | 数値    | UInt32    | ブール値フラグのビットマップ。Amendmentオブジェクトタイプにはフラグが定義されていないため、この値は常に`0`です。 |
| `LedgerEntryType` | 文字列    | UInt16    |  値が `0x0066`（文字列`Amendments`にマッピング）の場合は、このオブジェクトがXRP Ledgerに対するAmendmentのステータスを記述していることを示します。 |

`Majorities`フィールドにメンバーが含まれている場合、各メンバーは`Majority`フィールドのみが含まれているオブジェクトです。このフィールドの内容は、以下のフィールドからなるネストオブジェクトです。

| 名前              | JSONの型 | [内部の型][] | 説明 |
|-------------------|-----------|-------------------|-------------|
| `Amendment`       | 文字列    | Hash256           | 保留中のAmendmentのAmendment ID。 |
| `CloseTime`       | 数値    | UInt32            | このAmendmentが最後に過半数の支持を得たレジャーバージョンの[`close_time`フィールド](ledger-header.html)。 |

[Amendmentプロセス](amendments.html#amendmentプロセス)では、80%以上のバリデータが新しいAmendmentを支持してバリデータのコンセンサスが得られると、`tfGotMajority`フラグを指定した[EnableAmendment][]疑似トランザクションを使用してこの新しいAmendmentが`Majorities`フィールドに追加されます。保留中のAmendmentの支持が80%を下回ると、`tfLostMajority`フラグが指定された[EnableAmendment][]疑似トランザクションによりそのAmendmentが`Majorities`配列から削除されます。Amendmentが`Majorities`フィールドに含まれている状態が2週間以上継続している場合、フラグが指定されていない[EnableAmendment][]疑似トランザクションによってそのAmendmentは`Majorities`から削除され、`Amendments`フィールドに恒久的に追加されます。

**注記:** 実際には、レジャー内のすべてのトランザクションは、その直前のレジャーバージョンで有効になっているAmendmentに基づいて処理されます。Amendmentが有効になったレジャーバージョンにトランザクションを適用する場合、このルールでは中間レジャーは変更されません。レジャーの閉鎖後、適用された新しいAmendmentにより定義される新しいルールが次のレジャーで使用されます。

## Amendment IDのフォーマット

`Amendments`オブジェクトIDは、`Amendments`スペースキー（`0x0066`）のハッシュのみです。つまり、レジャーの`Amendments`オブジェクトのIDは常に次の値になります:

```
7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4
```

（`Amendments`レジャーオブジェクトタイプのIDと、個々のAmendmentのAmendment IDを混同しないでください。）

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
