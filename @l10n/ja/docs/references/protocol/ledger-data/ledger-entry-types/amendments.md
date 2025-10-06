---
seo:
    description: 有効化されているAmendmentと保留中のAmendmentのステータスを持つシングルトンオブジェクトです。
labels:
    - ブロックチェーン
---
# Amendments
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/LedgerFormats.cpp#L110-L113 "Source")

`Amendments`オブジェクトタイプには、現在アクティブな[Amendment](../../../../concepts/networks-and-servers/amendments.md)のリストが含まれています。各レジャーバージョンには**最大で1つの**`Amendments`オブジェクトが含まれています。

## {% $frontmatter.seo.title %}のJSONの例

```json
{
    "Amendments": [
        "42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE",
        "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373",
        // (... Long list of enabled amendment IDs ...)
        "03BDC0099C4E14163ADA272C1B6F6FABB448CC3E51F522F978041E4B57D9158C",
        "35291ADD2D79EB6991343BDA0912269C817D0F094B02226C1C14AD2858962ED4"
    ],
    "Flags": 0,
    "LedgerEntryType": "Amendments",
    "Majorities": [
        {
            "Majority": {
                "Amendment": "7BB62DC13EC72B775091E9C71BF8CF97E122647693B50C5E87A80DFD6FCFAC50",
                "CloseTime": 779561310
            }
        },
        {
            "Majority": {
                "Amendment": "755C971C29971C9F20C6F080F2ED96F87884E40AD19554A5EBECDCEC8A1F77FE",
                "CloseTime": 779561310
            }
        }
    ],
    "index": "7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4"
}
```

<!-- Note: At time of writing (2024-10-15) fixPreviousTxnID is the most recently enabled amendment, which means that the last time the Amendments entry changed was when it became enabled. Amendments' changes don't apply until the next ledger, so fixPreviousTxnID was not in effect at the time. The PreviousTxnID and PreviousTxnLgrSeq fields will be added to the Amendments entry the next time any amendment gains supermajority support. -->

## {% $frontmatter.seo.title %}のフィールド

[共通フィールド][]に加えて、{% $frontmatter.seo.title %}エントリは以下のフィールドを使用します。

| 名前                | JSONの型 | [内部の型][] | 必須？ | 説明 |
|---------------------|----------|--------------|--------|------|
| `Amendments`        | 配列     | VECTOR256    | いいえ | _（省略可）_ 現在有効なすべてのAmendmentの256ビット[Amendment ID](../../../../concepts/networks-and-servers/amendments.md)からなる配列。省略されている場合は、有効なAmendmentがありません。 |
| `Flags`             | 数値     | UInt32       | はい   | ブール値フラグのビットマップ。Amendmentオブジェクトタイプにはフラグが定義されていないため、この値は常に`0`です。 |
| `LedgerEntryType`   | 文字列   | UInt16       | はい   |  値が`0x0066`（文字列`Amendments`にマッピング）の場合は、このオブジェクトがXRP **Ledgerに対するAmendmentのステータスを記述していることを示します**。 |
| `Majorities`        | 配列     | Array      | いいえ | _（省略可）_ 過半数の支持を得ているがまだ有効になっていないAmendmentのステータスを記述するオブジェクトの配列。省略されている場合は、過半数の支持を得ている保留中のAmendmentがありません。 |
| `PreviousTxnID`     | 文字列   | UInt256      | いいえ | このエントリを最後に変更したトランザクションの識別ハッシュ。{% amendment-disclaimer name="fixPreviousTxnID" /%} |
| `PreviousTxnLgrSeq` | 数値     | UInt32       | いいえ | このエントリを最後に変更したトランザクションが含まれる[レジャーインデックス](../ledger-header.md)。{% amendment-disclaimer name="fixPreviousTxnID" /%} |

`Majorities`フィールドにメンバーが含まれている場合、各メンバーは`Majority`フィールドのみが含まれているオブジェクトです。このフィールドの内容は、以下のフィールドからなるネストオブジェクトです。

| 名前              | JSONの型 | [内部の型][] | 説明 |
|-------------------|----------|--------------|-------------|
| `Amendment`       | 文字列   | UInt256      | 保留中のAmendmentのAmendment ID。 |
| `CloseTime`       | 数値     | UInt32       | このAmendmentが最後に過半数の支持を得たレジャーバージョンの[`close_time`フィールド](../ledger-header.md)。 |

[Amendmentプロセス](../../../../concepts/networks-and-servers/amendments.md#amendmentプロセス)では、80%以上のバリデータが新しいAmendmentを支持してバリデータのコンセンサスが得られると、`tfGotMajority`フラグを指定した[EnableAmendment][]疑似トランザクションを使用してこの新しいAmendmentが`Majorities`フィールドに追加されます。保留中のAmendmentの支持が80%を下回ると、`tfLostMajority`フラグが指定された[EnableAmendment][]疑似トランザクションによりそのAmendmentが`Majorities`配列から削除されます。Amendmentが`Majorities`フィールドに含まれている状態が2週間以上継続している場合、フラグが指定されていない[EnableAmendment][]疑似トランザクションによってそのAmendmentは`Majorities`から削除され、`Amendments`フィールドに恒久的に追加されます。

{% admonition type="info" name="注記" %}実際には、レジャー内のすべてのトランザクションは、その直前のレジャーバージョンで有効になっているAmendmentに基づいて処理されます。Amendmentが有効になったレジャーバージョンにトランザクションを適用する場合、このルールでは中間レジャーは変更されません。レジャーの閉鎖後、適用された新しいAmendmentにより定義される新しいルールが次のレジャーで使用されます。{% /admonition %}

## {% $frontmatter.seo.title %}のフラグ

{% code-page-name /%}エントリに定義されているフラグはありません。


## {% $frontmatter.seo.title %}の準備金

{% code-page-name /%}エントリは準備金が不要です。


## Amendment IDのフォーマット

`Amendments`オブジェクトIDは、`Amendments`スペースキー（`0x0066`）のハッシュのみです。つまり、レジャーの`Amendments`オブジェクトのIDは常に次の値になります:

```
7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4
```

（`Amendments`レジャーオブジェクトタイプのIDと、個々のAmendmentのAmendment IDを混同しないでください。）

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
