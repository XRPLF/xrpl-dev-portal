---
html: nft-collections.html
parent: non-fungible-tokens.html
seo:
    description: NFTのTaxonフィールドを使用して、NFTをコレクションとしてミントすることができます。
labels:
 - 非代替性トークン, NFT
---
# NFTのコレクション化

`NFTokenTaxon`フィールドを使用すると、NFTをコレクションにグループ化することができます。ミント担当者は、`0x0`から`0xFFFFFFF`までの任意の数値を選択し、NFTを作成する際にそれを割り当てることができます。Taxon(分類群)の定義付けは完全に自由です。

例えば、最初のコレクションでは、`NFTokenTaxon`を`1`に設定します。NFTのコレクションで、Taxonの値が`316`、`420`、`911`であるものがあるかもしれません。NFTの種類を示すために、数字で始まるタクソンを使用することもできます（たとえば、すべての不動産NFTは`2`で始まるTaxonを持っているなど）。

`NFTokenTaxon`フィールドは必須ですが、コレクションを作成するつもりがなければ`0`を設定するのもよいでしょう。

[NFTokenの分類群](../../../references/protocol/data-types/nftoken.md#nftokentaxon分類群)をご覧ください。
