---
html: nft-fixed-supply.html
parent: non-fungible-tokens.html
seo:
    description: 新しいアカウントを使って一定数のNFTをミントし、そのアカウントをブラックホール化します。
labels:
  - 非代替性トークン, NFT
---
# NFTの固定供給

プロジェクトによっては、発行アカウントから一定数以上のNFTがミントされないことを保証したい場合があります。

一定数のNFTを保証するためには、

1. 新しいアカウント、_発行者_ を作成し、資金を提供します。このアカウントは、コレクション内のトークンの発行者となります。[アカウントの作成](../../accounts/index.md#アカウントの作成)をご覧ください。
1. `AccountSet`を使用して、自分の運用するウォレットを発行者の認可Minterとして割り当てます。[代理Mint](authorizing-another-minter.md)をご覧ください。
1. 運用アカウントで`NFTokenMint`を使ってトークンをミントします。運用中のウォレットには、発行者のためにMintされたすべてのトークンが保管されます。[Mintのバッチ処理](batch-minting.md)をご覧ください
1. 発行者の認可Minterである自分の運用するウォレットを削除するために、`AccountSet`を使用します。
1. 発行者アカウントを"ブラックホール化"する。[マスターキーペアの無効化](../../../tutorials/how-tos/manage-account-settings/disable-master-key-pair.md)をご覧ください。

この時点で、発行者のアドレスを発行アカウントとする新たなトークンのミントは不可能となります。

{% admonition type="warning" name="注意" %}一度、アカウントを「ブラックホール化」すると、あなた自身を含め、誰も将来のNFTの販売に対するロイヤリティを受け取ることができなくなります。{% /admonition %}
