---
html: non-fungible-tokens.html
parent: tokens.html
seo:
    description: XRPL NFTを紹介します。
labels:
 - 非代替性トークン, NFT
---

# 非代替性トークン(NFT)

XRP Ledgerは、非代替性トークン(NFT)をネイティブにサポートしています。 非代替性トークンは、芸術作品やゲーム内アイテムなど、ユニークな物理的、非物理的、あるいは純粋なデジタル商品の所有権を証明する役割を果たします。

_([NonFungibleTokensV1_1 amendment][]により追加されました。)_

このようなデジタル資産を表現するには、XRP LedgerのNon-Fungible Tokens機能（スタンダードドラフト番号で[XLS-20](https://github.com/XRPLF/XRPL-Standards/discussions/46)と呼ばれることもあります）を使用します。

## XRP Ledger上のNFT

XRP Ledger上では、non-fungible tokenは[NFToken][]オブジェクトとして表されます。NFTokenはユニークで分割できない単位で、決済には使用できません。ユーザはこのようなトークンを発行（作成）、保有、購入、売却、焼却（破棄）することができます。

XRP Ledgerでは、容量を節約するために、一つのアカウントで最大32個の`NFToken`オブジェクトを一つの[NFTokenPageオブジェクト][]に格納します。その結果、所有者の`NFToken`オブジェクトに対する[準備金](../../accounts/reserves.md)は、追加のトークンを格納するためにレジャーが新しいページを作成する場合にのみ増加します。

また、アカウントは、自分に代わってNFTokenオブジェクトを発行・販売するブローカー（代理発行者）を指定することができます。

`NFToken`オブジェクトは、トークンが発行された時点で確定し、後で変更することが出来ない設定項目を持ちます。これらは以下の通りです。

- トークンを一意に定義する各種識別データ。
- 発行者が、現在の保有者に関係なく、トークンを焼却できるかどうか。
- トークンの保持者がトークンを他者に転送できるかどうか。(`NFToken`は常に発行者に直接送信したり、発行者から送信することが可能です)。
    - 転送が許可されている場合、発行者は販売価格に対する一定の割合で手数料を徴収することができます。
- NFTokenを[トークン](../index.md)で売却できるか、XRPのみでしか売却できないか。

## `NFToken`のライフサイクル

誰もが[NFTokenMint トランザクション][]を使って新しい`NFToken`を作成することができます。`NFToken`は発行者アカウントの[NFTokenPage オブジェクト][]に格納されます。所有者または利害関係者は[NFTokenCreateOffer トランザクション][]を送信して`NFToken`の売買を提案できます。レジャーは提案された転送を[NFTokenOffer オブジェクト][]として追跡し、一方が承諾またはキャンセルすると`NFTokenOffer`を削除します。`NFToken`が転送可能であれば、アカウント間で複数回取引することができます。

[NFTokenBurn トランザクション][]を使用して、自分が所有する`NFToken`を破棄することができます。発行者が`tfBurnable`フラグを有効にしてトークンを発行した場合、発行者は現在の所有者に関係なくトークンを破棄することが可能です。(例えば、あるイベントのチケットを表すトークンである場合、そのチケットをある時点で消費するといった場合に便利です)。

![The NFT Lifecycle](/docs/img/nft-lifecycle.png "NFT Lifecycle Image")

`NFToken`オブジェクトの転送に関する詳細は、[XRP Ledger上でNFTokenを売買する](trading.md)をご覧ください。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
