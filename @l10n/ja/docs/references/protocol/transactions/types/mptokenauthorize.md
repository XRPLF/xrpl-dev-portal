---
seo:
    description: アカウントが特定のMPTの残高を保持することを許可します。
labels:
 - Multi-Purpose Token, MPT
---

# MPTokenAuthorize
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/MPTokenAuthorize.cpp "ソース")

{% partial file="/@l10n/ja/docs/_snippets/mpts-disclaimer.md" /%}

このトランザクションは、アカウントが特定のMPT発行の残高を保持することを可能にします。トランザクションが成功すると、保有者アカウントが所有する初期残高がゼロの新しい`MPToken`オブジェクトが作成されます。

発行者が`MPTokenIssuance`に`lsfMPTRequireAuth`(ホワイトリスト形式)を設定している場合、発行者も保有者に許可を与えるために`MPTokenAuthorize`トランザクションを送信する必要があります。`lsfMPTRequireAuth`が設定されていない状態で発行者がこのトランザクションを送信しようとすると、失敗します。

<!-- ## MPTokenAuthorizeのフィールド -->

{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド          | JSON型              | [内部の型][]      | 説明                |
|:--------------------|:--------------------|:------------------|:-------------------|
| `Account`           | 文字列              | `AccountID`       | このアドレスはMPTの発行者または潜在的な保有者のいずれかを示すことができます。 |
| `TransactionType`   | オブジェクト        | `UInt16`          | 新しいトランザクションタイプMPTokenAuthorizeを示します。整数値は29です。 |
| `MPTokenIssuanceID` | 文字列              | `UIn192`         | 対象となるMPTのIDを示します。 |
| `Holder`            | 文字列              | `AccountID`       | (任意) 発行者が承認したい保有者のアドレスを指定します。承認/ホワイトリストにのみ使用され、保有者が送信する場合は空である必要があります。 |
| `Flags`             | 数値                | `UInt32`          | [MPTokenAuthorizeのフラグ](#mptokenauthorizeのフラグ)をご覧ください。 |


### MPTokenAuthorizeのフラグ

MPTokenAuthorizeタイプのトランザクションは、Flagsフィールドにおいて以下の追加の値をサポートします。

| フラグ名           | 16進数値     | 10進数値     | 説明                         |
|:-------------------|:-------------|:-------------|:----------------------------|
| `tfMPTUnauthorize` | `0x00000001` | 1            | 保有者が送信する場合に設定すると、保有者が`MPToken`の保持を望まなくなったことを示し、その結果`MPToken`は削除されます。保有者の`MPToken`の残高がゼロでない状態でこのフラグを設定しようとすると、トランザクションは失敗します。一方、発行者が送信する場合に設定すると、発行者が保有者の承認を取り消したい（アローリストにのみ適用）ことを意味し、`MPToken`の`lsfMPTAuthorized`フラグが解除されます。 |

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
