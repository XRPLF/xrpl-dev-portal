---
html: deleting-accounts.html
parent: accounts.html
seo:
    description: XRP Ledgerのアカウントの削除について。
labels:
  - アカウント
---
# アカウントの削除

アカウントの所有者は[AccountDeleteトランザクション][]を送信することで、レジャーからアカウントと関連するエントリを削除し、アカウントの残りのXRP残高のほとんどを別のアカウントに送ることができます。アカウントの無駄な作成と削除を抑止するため、アカウントの削除には[トランザクションコスト](../transactions/transaction-cost.md)として通常よりも多くのXRPをバーンする必要があります。

いくつかの種類のレジャーエントリを保有している場合、アカウントの削除がブロックされます。たとえば、(代替可能)トークンの発行者は、そのトークンの発行残高がゼロでなければ、削除することはできません。
アカウントは削除した後、通常の[アカウントの作成方法](index.md#creating-accounts)によって再作成できます。削除後に再作成されたアカウントと、初めて作成されたアカウントに違いはありません。



## 要件

アカウントを削除するには、次の条件を満たす必要があります。

- アカウントの`Sequence`番号に256を加えた値が、現在の[レジャーインデックス][]未満であること。
- アカウントの所有者ディレクトリに「削除ブロッカー」が含まれていないこと。削除ブロッカーとは、一般に資産、債務、または資金の移転を表すレジャーエントリです。完全な一覧は[下記](#削除ブロッカー)をご覧ください。
- アカウントがレジャー内に所有するオブジェクトが1000個未満であること。
- トランザクションの送信時、少なくとも1つ分の[所有者準備金](reserves.md)(現在{% $env.PUBLIC_OWNER_RESERVE %})に相当する特別な[トランザクションコスト][]を支払う必要があります。


## 削除ブロッカー

次の表は、どの[レジャーエントリタイプ](../../references/protocol/ledger-data/ledger-entry-types/index.md)が削除ブロッカーであるかを示します。アカウントが所有するこれ以外のタイプのレジャーエントリは、アカウントとともに自動的に削除されます。

削除ブロッカーの中には、アカウント所有者単独では取り除けないものもあります。たとえば、他者にトークンを発行している場合、その相手がトークンを保有している限り、自分のアカウントを削除することはできません。それ以外の場合は、そのエントリをレジャーから削除するトランザクションを送信することで、削除ブロッカーを取り除けます。

| エントリタイプ | 関連するAmendment | 取り除く方法 |
|---|---|---|
| [Bridge](../../references/protocol/ledger-data/ledger-entry-types/bridge.md) | {% amendment-disclaimer name="XChainBridge" compact=true /%} | 取り除くことはできません。 |
| [Check][Checkエントリ] | {% amendment-disclaimer name="Checks" compact=true /%} | [CheckCancelトランザクション][]を送信してCheckをキャンセルします。 |
| [Escrow](../../references/protocol/ledger-data/ledger-entry-types/escrow.md) | (コアプロトコル) | 期限切れの場合は[EscrowCancelトランザクション][]を送信してキャンセルします。Escrowの時間条件や暗号条件を満たせる場合は、[EscrowFinishトランザクション][]を送信して完了させます。それ以外の場合、このエントリを取り除くことはできません。 |
| [PayChannel][PayChannelエントリ] | (コアプロトコル) | `tfClose`フラグを指定した[PaymentChannelClaimトランザクション][]を送信して、チャネルのクローズを要求します。決済遅延(settle delay)の経過後、もう一度[PaymentChannelClaimトランザクション][]を送信すると、チャネルが完全にクローズされて取り除かれます。 |
| [PermissionedDomain](../../references/protocol/ledger-data/ledger-entry-types/permissioneddomain.md) | {% amendment-disclaimer name="PermissionedDomains" compact=true /%} | [PermissionedDomainDeleteトランザクション](../../references/protocol/transactions/types/permissioneddomaindelete.md)を送信してドメインを削除します。 |
| [RippleState][RippleStateエントリ] | (コアプロトコル) | 相手方の設定がすべてデフォルトである場合にのみ取り除けます。その場合は、残高を0にしたうえで、[TrustSetトランザクション][]で自分側の設定をデフォルトに戻すことで取り除けます。一般的なケースでは、保有者はエントリを取り除けますが、発行者は取り除けません。 |
| [MPToken][MPTokenエントリ] | {% amendment-disclaimer name="MPTokensV1" compact=true /%} | MPTの保有者である場合は、(支払いなどで)残高を0にしてから、`tfMPTUnauthorize`フラグを指定した[MPTokenAuthorizeトランザクション](../../references/protocol/transactions/types/mptokenauthorize.md)を送信します。MPTの発行者である場合、このエントリを取り除くことはできません。 |
| [MPTokenIssuance][MPTokenIssuanceエントリ] | {% amendment-disclaimer name="MPTokensV1" compact=true /%} | [MPTokenIssuanceDestroyトランザクション](../../references/protocol/transactions/types/mptokenissuancedestroy.md)を送信します。これはMPTの保有者が1人もいない場合にのみ可能です。 |
| [NFTokenPage][NFTokenPageエントリ] | {% amendment-disclaimer name="NonFungibleTokensV1_1" compact=true /%} | 保有する各NFTについて、[NFTokenBurnトランザクション][]を送信してバーンするか、[NFTokenCreateOfferトランザクション][]を送信して売却または譲渡します。 |
| [Sponsorship](../../references/protocol/ledger-data/ledger-entry-types/sponsorship.md) | {% amendment-disclaimer name="Sponsor" compact=true /%} | `tfDeleteObject`フラグを指定した[SponsorshipSetトランザクション](../../references/protocol/transactions/types/sponsorshipset.md)を送信します。これはスポンサーと被スポンサー(sponsee)のどちらでも実行でき、エントリの手数料予算に残っているXRPはスポンサーに返還されます。 |
| [Vault](../../references/protocol/ledger-data/ledger-entry-types/vault.md) | {% amendment-disclaimer name="SingleAssetVault" compact=true /%} | [VaultDeleteトランザクション](../../references/protocol/transactions/types/vaultdelete.md)を送信してVaultを削除します。これはVaultが空の場合にのみ可能です。 |
| [XChainOwnedClaimID](../../references/protocol/ledger-data/ledger-entry-types/xchainownedclaimid.md) | {% amendment-disclaimer name="XChainBridge" compact=true /%} | [XChainClaimトランザクション](../../references/protocol/transactions/types/xchainclaim.md)を送信してクロスチェーン送金を完了させます。 |
| [XChainOwned<br>CreateAccountClaimID](../../references/protocol/ledger-data/ledger-entry-types/xchainownedcreateaccountclaimid.md) | {% amendment-disclaimer name="XChainBridge" compact=true /%} | 新しいアカウントを作成するのに十分な数のアテステーション([XChainAddAccountCreateAttestationトランザクション][])を送信します。 |

## 削除コスト

{% admonition type="warning" name="注意" %}アカウントの削除要件を満たしていないためにトランザクションが失敗した場合でも、[AccountDeleteトランザクション][]のトランザクションコストは、トランザクションが検証済みレジャーに含まれる場合常に発生します。アカウントを削除できなかった場合に高いトランザクションコストを支払う可能性を減らすには、AccountDeleteトランザクションを送信するときに`fail_hard`オプションを使用してください。{% /admonition %}

ビットコインや他の多くの暗号通貨とは異なり、XRP Ledgerの公開レジャーチェーンのそれぞれの新しいレジャーバージョンは、レジャーの完全な状態を含んでおり、新しいアカウントが増えるごとにサイズが増加します。そのため、必要な場合を除き、新しいXRP Ledgerアカウントを作成すべきではありません。アカウントを削除することで、アカウントの{% $env.PUBLIC_BASE_RESERVE %}の[準備金](reserves.md)の一部を回復することができますが、そのためには少なくとも{% $env.PUBLIC_OWNER_RESERVE %}を破棄する必要があります。

取引所など、多くのユーザのために価値の送受信を行う組織は、[**送信元タグ**と**宛先タグ**](../transactions/source-and-destination-tags.md)を使用することで、XRP Ledgerのアカウントを1つだけ(または少数)使用するだけで、ユーザの支払いを区別することができます。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
