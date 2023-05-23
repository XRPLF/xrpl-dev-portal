---
html: ledgers.html
parent: payment-system-basics.html
blurb: XRP Ledgerは、rippledによって内部データベースに保持されている一連の個別レジャー（レジャーバージョン）で構成されています。これらのレジャーの構造と内容について説明します。
labels:
  - ブロックチェーン
  - データ保持
---
# レジャー

XRP Ledgerは完全にオープンな共有グローバルレジャーです。個々の参加者はこのレジャーを管理する個々の機関を信頼しなくても、レジャーの整合性を信頼できます。`rippled`サーバーソフトウェアは、非常に特殊なルールによってのみ更新可能なレジャーデータベースを管理することにより、これを実現しています。各`rippled`インスタンスはレジャーの完全なコピーを保持し、`rippled`サーバーからなるピアツーピアネットワークはトランザクション候補を各サーバーに配信します。コンセンサスプロセスによって、レジャーの新しいバージョンに適用されるトランザクションが決定します。関連項目: [コンセンサスプロセス](consensus.html)。

![図: 各レジャーは、その前のレジャーバージョンにトランザクションを適用して生成されます。](img/ledger-changes.ja.png)

この共有グローバルレジャーは、実際には`rippled`の内部データベースに保持されている一連の個別レジャー（レジャーバージョン）です。各レジャーバージョンには、レジャーの生成順を示す[レジャーインデックス][]が付いています。各閉鎖済みレジャーバージョンにも、レジャーの内容を示す識別用ハッシュ値があります。`rippled`インスタンスには常に、1つの処理中の「現行」オープンレジャー、コンセンサスにより承認されていないいくつかの閉鎖済みレジャー、およびコンセンサスによる検証済みの任意の数の履歴レジャーがあります。検証済みレジャーだけが、その内容が正確で変更できません。

1つのレジャーバージョンはさまざまな要素で構成されています:

![図: レジャーにはトランザクション、状態ツリー、閉鎖時刻、検証情報を含むヘッダーが含まれています。](img/anatomy-of-a-ledger-simplified.ja.png)

* **ヘッダー** - [レジャーインデックス][]、レジャーのその他のコンテンツのハッシュ、その他のメタデータ。
* **トランザクションツリー** - このレジャーの作成時に、直前のレジャーに適用された[トランザクション](transaction-formats.html)。トランザクションは、レジャーの変更を可能にする _唯一の_ 手段です。
* **状態ツリー** - このバージョンのレジャーの設定、残高、オブジェクトを含むすべての[レジャーオブジェクト](ledger-object-types.html)。


## ツリーの形式

レジャーの状態ツリーは、その名前のとおりツリー型データ構造です。状態ツリーの各オブジェクトは256ビットのオブジェクトIDで識別されます。JSONではレジャーオブジェクトのIDは`index`フィールドです。このフィールドには64文字の16進数文字列が含まれています（例: `"193C591BF62482468422313F9D3274B5927CA80B4DD3707E42015DD609E39C94"`）。状態ツリーの各オブジェクトには、オブジェクトの検索に使用できるIDが設定されています。各トランザクションには、トランザクションツリーでトランザクションを検索するときに使用できる識別用ハッシュが含まれています。レジャーオブジェクトの`index`（ID）と[レジャーの`ledger_index`（シーケンス番号）][レジャーインデックス]を混同しないでください。

**ヒント:** レジャーの状態ツリーのオブジェクトは「レジャーノード」と呼ばれることもあります。たとえばトランザクションメタデータは`AffectedNodes`のリストを返します。これをピアツーピアネットワークの「ノード」（サーバー）と混同しないでください。

トランザクションの場合、識別用ハッシュは署名済みトランザクションの指示に基づいていますが、検索時のトランザクションオブジェクトにはトランザクションの結果とメタデータが含まれています。これは、ハッシュの生成時には反映されません。

<!-- TODO: translate these new sections -->

## Open, Closed, and Validated Ledgers

The `rippled` server makes a distinction between ledger versions that are _open_, _closed_, and _validated_. A server has one open ledger, any number of closed but unvalidated ledgers, and an immutable history of validated ledgers. The following table summarizes the difference:

| Ledger Type:                     | Open                        | Closed                                     | Validated |
|:---------------------------------|:----------------------------|:-------------------------------------------|:--|
| **Purpose:**                     | Temporary workspace         | Proposed next state                        | Confirmed previous state |
| **Number used:**                 | 1                           | Any number, but usually 0 or 1             | One per ledger index, growing over time |
| **Can contents change?**         | Yes                         | No, but the whole ledger could be replaced | Never |
| **Transactions are applied in:** | The order they are received | Canonical order                            | Canonical order |

Unintuitively, the XRP Ledger never "closes" an open ledger to convert it into a closed ledger. Instead, the server throws away the open ledger, creates a new closed ledger by applying transactions on top of a previous closed ledger, then creates a new open ledger using the latest closed ledger as a base. This is a consequence of [how consensus solves the double-spend problem](consensus-principles-and-rules.html#問題の単純化).

For an open ledger, servers apply transactions in the order those transactions appear, but different servers may see transactions in different orders. Since there is no central timekeeper to decide which transaction was actually first, servers may disagree on the exact order of transactions that were sent around the same time. Thus, the process for calculating a closed ledger version that is eligible for [validation](consensus.html#検証) is different than the process of building an open ledger from proposed transactions in the order they arrive. To create a "closed" ledger, each XRP Ledger server starts with a set of transactions and a previous, or "parent", ledger version. The server puts the transactions in a canonical order, then applies them to the previous ledger in that order. The canonical order is designed to be deterministic and efficient, but hard to game, to increase the difficulty of front-running Offers in the [decentralized exchange](decentralized-exchange.html).

Thus, an open ledger is only ever used as a temporary workspace, which is a major reason why transactions' [tentative results may vary from their final results](finality-of-results.html).

## Ledger Close Times

The time that a ledger version closed is recorded at the `close_time` field of the [ledger header](ledger-header.html). To make it easier for the network to reach a consensus on an exact close time, this value is rounded to a number of seconds based on the close time resolution, currently 10 seconds. If rounding would cause a ledger's close time to be the same as (or earlier than) its parent ledger's, the child ledger has its close time set to the parent's close time plus 1. This guarantees that the close times of validated ledgers are strictly increasing. <!-- STYLE_OVERRIDE: a number of -->

Since new ledger versions usually close about every 3 to 5 seconds, these rules result in a loose pattern where ledgers' close times end in :00, :01, :02, :10, :11, :20, :21, and so on. Times ending in 2 are less common and times ending in 3 are very rare, but both occur randomly when more ledgers randomly happen to close within a 10-second window.

Generally speaking, the ledger cannot make any time-based measurements that are more precise than the close time resolution. For example, to check if an object has passed an expiration date, the rule is to compare it to the close time of the parent ledger. (The close time of a ledger is not yet known when executing transactions to go into that ledger.) This means that, for example, an [Escrow](escrow.html) could successfully finish at a real-world time that is up to about 10 seconds later than the time-based expiration specified in the Escrow object.

### Example

The following examples demonstrate the rounding behavior of ledger close times, from the perspective of an example validator, following a ledger with the close time **12:00:00**:

**Current consensus round**

1. A validator notes that it was **12:00:03** when the ledger closed and entered consensus. The validator includes this close time in its proposals.
2. The validator observes that most other validators (on its UNL) proposed a close time of 12:00:02, and one other proposed a close time of 12:00:03. It changes its proposed close time to match the consensus of **12:00:02**.
3. The validator rounds this value to the nearest close time interval, resulting in **12:00:00**.
4. Since 12:00:00 is not greater than the previous ledger's close time, the validator adjusts the close time to be exactly 1 second after the previous ledger's close time. The result is an adjusted close time of **12:00:01**.
5. The validator builds the ledger with these details, calculates the resulting hash, and confirms in the [validation step](consensus.html#検証) that others did the same.

Non-validating servers do all the same steps, except they don't propose their recorded close times to the rest of the network.

**Next consensus round**

1. The next ledger enters consensus at **12:00:04** according to most validators.
2. This rounds down again, to a close time of **12:00:00**.
3. Since this is not greater than the previous ledger's close time of 12:00:01, the adjusted close time is **12:00:02**.

**Next consensus round after that**

1. The ledger after that enters consensus at **12:00:05** according to most validators.
2. This rounds up, based on the close time resolution, to **12:00:10**.
3. Since this value is larger than the previous ledger's close time, it does not need to be adjusted. **12:00:10** becomes the official close time.


## 関連項目

レジャーヘッダー、レジャーオブジェクトID、レジャーオブジェクトタイプについての詳細は、[レジャーデータフォーマット](ledger-data-formats.html)を参照してください。


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
