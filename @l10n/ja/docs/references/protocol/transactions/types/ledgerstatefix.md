---
seo:
    description: XRP Ledgerの状態データの破損を修復します。
labels:
    - Utilities
    - Troubleshooting
    - Other Transactions
requiredAmendment: fixNFTokenPageLinks
txIcon: other
---
# LedgerStateFix
{% source-link path="src/libxrpl/tx/transactors/system/LedgerStateFix.cpp" /%}

レジャー上のデータに生じた特定の破損を修復するトランザクションです。エラー状態や破損の種類に応じた個別の修復モードが用意されています。

{% amendment-disclaimer name="fixNFTokenPageLinks" /%}


## {% $frontmatter.seo.title %} JSONの例

```json
{
   "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
   "Fee" : "2000000",
   "LedgerFixType" : 1,
   "Owner" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
   "Sequence" : 2,
   "TransactionType" : "LedgerStateFix"
}
```

{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド      | JSONの型             | [内部の型][]      | 必須？ | 説明 |
|:----------------|:---------------------|:------------------|:-------|:-----|
| `LedgerFixType` | 数値                 | UInt16            | はい   | 適用する修復の種類。指定可能な値については[LedgerFixType](#ledgerfixtype)をご覧ください。現時点で唯一の種類は`1`で、単一アカウントのNFTokenディレクトリを修復します。 |
| `Owner`         | 文字列 - [アドレス][] | AccountID         | いいえ | _（`LedgerFixType`が`1`の場合は必須）_ 修復対象のNFTokenディレクトリを所有するアカウント。トランザクションの送信者との関係は不要です。 |


## LedgerFixType

`LedgerStateFix`トランザクションは、まれで特定の問題に対する限定的な解決策です。以下に説明する特定の種類のレジャー破損の修復にのみ使用できます。

### タイプ1

次の条件によって発生した、NFTディレクトリの破損:

- ディレクトリに少なくとも2つのNFTokenページが存在していた。
- 最後から2番目のページが32個のNFTokenを保持しており、完全に埋まっていた。
- ディレクトリの最後のページにNFTokenが1つしか含まれていなかった。
- トランザクションによって最後のページから残っていた最後のトークンが削除され、ディレクトリがそのページを削除した。

これらの条件が満たされた場合、NFTokenディレクトリのページリンクが正しく更新されず、追加のNFTokenのために新しい最終ページが作成された際にディレクトリに穴が生じていました。

[fixNFTokenPageLinks amendment][]により、この種のレジャー破損が新たに発生することはなくなります。


## 特別なトランザクションコスト

`LedgerStateFix`トランザクションはまれにしか使われず、計算負荷が高くなる可能性があるため、このトランザクションは1アイテム分の[所有者準備金](../../../../concepts/accounts/reserves.md)（現在は{% $env.PUBLIC_OWNER_RESERVE %}）以上に相当する特別な[トランザクションコスト][]を支払う必要があります。

トランザクションコストは、トランザクションが検証済みレジャーに含まれた場合、トランザクションが失敗したとしても常に適用されます。（[エラーケース](#エラーケース)をご覧ください。）トランザクションが失敗した場合に高額なトランザクションコストを支払う可能性を大幅に減らすには、`fail_hard`を有効にして[トランザクションを送信](../../../http-websocket-apis/public-api-methods/transaction-methods/submit.md)してください。


## エラーケース

すべてのトランザクションで発生する可能性のあるエラーに加えて、{% $frontmatter.seo.title %}トランザクションでは次の[トランザクション結果コード](../transaction-results/index.md)が発生する可能性があります。

| エラーコード                 | 説明 |
|:-----------------------------|:-----|
| `tecFAILED_PROCESSING`       | トランザクションによる修復の適用に失敗しました。たとえば、破損していないNFTディレクトリを修復しようとした場合です。 |
| `tecOBJECT_NOT_FOUND`        | トランザクションで指定されたレジャーエントリが存在しません。たとえば、NFTを1つも保有していないアカウントのNFTディレクトリを修復しようとした場合です。 |
| `tefINVALID_LEDGER_FIX_TYPE` | トランザクションで指定された[`LedgerFixType`](#ledgerfixtype)の値が無効です。現時点で有効な種類は`1`のみです。 |

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
