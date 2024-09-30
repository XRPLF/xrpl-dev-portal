---
html: reserves.html
parent: accounts.html
seo:
    description: XRP Ledgerのアカウントでは、レジャーデータ内のスパムを減らすためにXRPの準備金が必要です。
labels:
  - 手数料
  - アカウント
top_nav_grouping: 人気ページ
---
# 準備金

XRP Ledgerでは、スパムや悪意のある使用によって、共有グローバル台帳(レジャー)が過度に大きくならないように、XRPを用いた _準備金_ の仕組みを採用しています。現在一般に市販されているのマシンで、処理中の現行レジャーを常にRAMに保存でき、全履歴がディスクに収まるように、技術の向上に合わせて台帳サイズが大きくなるのを制限することが目的です。

取引(トランザクション)を送信するには、各アドレスが共有グローバル台帳内に少量のXRPを保有している必要があります。このXRPを他のアドレスに送信することはできません。新しいアドレスに資金供給するには、必要となる準備金を満たすのに十分なXRPを送信する必要があります。

準備金要件は、バリデータが新しい準備金設定に合意する[手数料の投票](../consensus-protocol/fee-voting.md)プロセスにより、随時変更されます。

## 基本準備金と所有者準備金

準備金は2つの部分に分けられます。

* **基本準備金**は、レジャーの各アドレスに必要なXRPの最小額です。
* **所有者準備金**は、アドレスがレジャーに所有しているオブジェクトごとに必要な準備金の増加額です。アイテムごとのコストは「増分準備金」とも呼ばれます。

メインネットにおける現在の準備金要件は次の通りです。

- 基本準備金 **10 XRP**
- 所有者準備金 アイテムにつき**2 XRP**

他のネットワークでの準備金は異なる場合があります。

### 所有者準備金

レジャー内の多くのオブジェクト(レジャーエントリ)は、特定のアカウントが所有しています。通常、所有者はオブジェクトを作成したアカウントです。各オブジェクトは、所有者の合計必要準備金を所有者準備金によって増加させます。オブジェクトがレジャーから削除されると、所有者の必要準備金にカウントされなくなります。

所有者の必要準備金にカウントされるオブジェクトには次のものが含まれます。[Check](../payment-types/checks.md), [入金の事前承認](depositauth.md#事前承認), [エスクロー](../payment-types/escrow.md), [NFTのオファー](../tokens/nfts/trading.md), [NFTのページ](../tokens/nfts/index.md), [オファー](../../references/protocol/ledger-data/ledger-entry-types/offer.md), [ペイメントチャネル](../payment-types/payment-channels.md), [マルチシグの署名者リスト](multi-signing.md), [Ticket](tickets.md), そして[トラストライン](../tokens/fungible-tokens/index.md).

次のようないくつかの特殊なケースが存在します。

- 非代替性トークン(NFT)は、それぞれ最大32個のNFTを含むページにグループ化され、所有者準備金はNFTごとではなくページごとに適用されます。ページの分割と結合の仕組みにより、実際に保存されるNFTの数はページごとに異なります。[NFTokenPageオブジェクトの準備金](../../references/protocol/ledger-data/ledger-entry-types/nftokenpage.md#nftokenpage-オブジェクトの準備金)もご覧ください。
- トラストライン(`RippleState`エントリ)は2つのアカウント間で共有されます。所有者準備金はどちらか一方、または両方に適用できます。多くの場合、トークン所有者は準備金を負担し、発行者は負担しません。[RippleState: 所有者準備金への資金提供](../../references/protocol/ledger-data/ledger-entry-types/ripplestate.md#所有者の準備金への資金供給)もご覧ください。
- 2019年4月に有効化された[MultiSignReserve amendment][]以前に作成された署名者リストは、複数のオブジェクトとしてカウントされます。[署名者リストと準備金](../../references/protocol/ledger-data/ledger-entry-types/signerlist.md#signerlistと準備金)もご覧ください。
- [所有者ディレクトリ](../../references/protocol/ledger-data/ledger-entry-types/directorynode.md)は、アカウントが所有するすべてのオブジェクトを含む、アカウントに関連するすべてのオブジェクトをリストしたレジャーエントリです。ただし、所有者ディレクトリ自体は準備金にカウントされません。

### 準備金の確認

アプリケーションは、[server_infoメソッド][]または[server_stateメソッド][]を使用して、現在の基本準備金と増分準備金の値を調べることができます。

| メソッド                 | 単位          | 基本準備金のフィールド                  | 増分準備金のフィールド                |
|-------------------------|--------------|-------------------------------------|------------------------------------|
| [server_infoメソッド][]  | 10進数のXRP値  | `validated_ledger.reserve_base_xrp` | `validated_ledger.reserve_inc_xrp` |
| [server_stateメソッド][] | 整数のdrop値   | `validated_ledger.reserve_base`     | `validated_ledger.reserve_inc`     |

アカウントの所有者準備金を決定するには、増分準備金にアカウントが所有するオブジェクトの数を掛けます。アカウントが所有しているオブジェクトの数を調べるには、[account_infoメソッド][]を呼び出し、`account_data.OwnerCount`を取得します。

アドレスの必要となる合計準備金を計算するには、`OwnerCount`に`reserve_inc_xrp`を掛け、次に`reserve_base_xrp`を加えます。[この計算をPythonで行うデモ](../../tutorials/python/build-apps/build-a-desktop-wallet-in-python.md#codeblock-17)があります。


## 必要準備金を下回る

トランザクション処理中、[トランザクションコスト](../transactions/transaction-cost.md)によって、送信元アドレスのXRP残高の一部がバーンされます。その結果、そのアドレスのXRPが必要準備金を下回る可能性があります。

アドレスが保持しているXRPが、現在の必要準備金を下回ると、XRPを他のアドレスに送信するトランザクションを送信したり、自身の準備金を増やしたりできなくなります。このような場合でも、そのアドレスはレジャー内に存在し、トランザクションコストを支払うのに十分なXRPを持っている限り、その他のトランザクションを送信することができます。必要準備金を満たすために十分なXRPを受け取った場合、またはそのアドレスのXRP保有額よりも[準備金の必要額が減少した](#準備金要件の変更)場合、そのアドレスはすべてのタイプのトランザクションを再度送信できるようになります。

**ヒント:** アドレスが必要準備金を下回った場合は、新しい[OfferCreateトランザクション][]を送信して、追加のXRP、または既存のトラストライン上の他の通貨を入手することができます。このような取引では、新しい[トラストライン](../../references/protocol/ledger-data/ledger-entry-types/ripplestate.md)や[レジャー内のオファーエントリ](../../references/protocol/ledger-data/ledger-entry-types/offer.md)を作成することはできないため、すでにオーダーブック内にあるオファーを実行するトランザクションのみを実行することができます。


## 準備金要件の変更

XRP Ledgerには、準備金要件を調整する仕組みがあります。このような調整は、例えばXRPの価値の長期的な変化、汎用レベルのハードウェアの性能の向上、サーバソフトウェアの実装の効率化などを考慮することができます。いかなる変更も、コンセンサスプロセスによる合意が必要です。詳細は[手数料の投票](../consensus-protocol/fee-voting.md)をご覧ください。

## 関連項目

- [account_objectsメソッド][]
- [AccountRootオブジェクト][]
- [手数料の投票](../consensus-protocol/fee-voting.md)
- [SetFee疑似トランザクション][]疑似トランザクション
- [チュートリアル: 必要準備金の計算と表示（Python）](../../tutorials/python/build-apps/build-a-desktop-wallet-in-python.md#3-display-an-account)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
