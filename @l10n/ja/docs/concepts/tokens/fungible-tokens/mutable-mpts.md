---
seo:
    description: DynamicMPT Amendmentにより、発行者はプロパティを変更できるMPTを作成できます。事業の必要に応じて、後から更新できるようになります。
labels:
  - トークン
  - MPT
  - Multi-Purpose Token
status: not_enabled
---
# ダイナミックMPT

[DynamicMPT amendment][]は、[Multi-Purpose Token(MPT)](multi-purpose-tokens.md)を拡張し、MPTの特定のプロパティを **デフォルトで** 変更可能にします。対象となるのは、オンチェーンメタデータ、送金手数料、そして[MPT発行フラグ](../../../references/protocol/ledger-data/ledger-entry-types/mptokenissuance.md#mptokenissuanceのフラグ)を有効にする権限です。事業の必要の変化に応じて、発行者はこれらのプロパティを後から更新できます。たとえば市況に応じて送金手数料を調整したり、トークンのメタデータを更新したり、取引機能を有効にしたりする場面を想定しています。

発行者は、どのプロパティを変更できないようにするかを明示的に宣言することで、それらを **変更不可** にできます。宣言はMPT発行の作成時にも、後からでも行えます。変更不可と宣言しなかったプロパティは変更可能なままです。アセットスケールや最大数量など、発行時に設定される他のデータはすべて固定で、そのトークンが存在する限り変更できません。

{% amendment-disclaimer name="DynamicMPT" /%}

## MPTプロパティの変更

発行者は[MPTokenIssuanceSetトランザクション][]で変更可能なプロパティを変えられます。このトランザクションでは、トークンのメタデータの更新、送金手数料の変更、そして1つ以上のMPT発行フラグの有効化を一度に行えます。

個々のMPT発行フラグは、保有者にトークンの取引を許可する、発行者にトークンの回収を許可するといった機能を追加します。MPT発行フラグを有効にする操作は **一方向** です。つまり、一度有効化すると、後続のどのトランザクションでも無効化できません。

## MPTプロパティの変更不可化

プロパティを変更不可にするには、発行者が `ImmutableFlags` フィールドでそれを宣言します。宣言は、MPT発行の作成時に[MPTokenIssuanceCreateトランザクション][]で行うことも、後から[MPTokenIssuanceSetトランザクション][]で行うこともできます。

`ImmutableFlags` は追加専用のフィールドです。宣言のたびに、その発行ですでに固定されているプロパティへ追加されます。置き換えられることはなく、クリアすることもできません。そのため、発行者はトークンの設計を段階的に確定できます。たとえば、メタデータの内容が確定した時点でメタデータだけを変更不可にし、送金手数料は変更可能な状態をより長く維持する、といった運用ができます。

発行者は、MPT発行フラグの有効化と変更不可の宣言を同じトランザクションで行えます。変更不可にできるフィールドとフラグの一覧は[MPTokenIssuanceのImmutableフラグ](../../../references/protocol/ledger-data/ledger-entry-types/mptokenissuance.md)を参照してください。

## セキュリティ上の考慮事項

MPTのプロパティがどう変わりうるかは、いくつかのルールで定まっています。

- [MPTokenIssuanceエントリ][]のプロパティを変更し、MPT発行フラグを有効にし、フィールドやフラグを変更不可と宣言できるのは、その発行者だけです。
- `ImmutableFlags` フィールドは決してクリアされないため、[MPTokenIssuanceSetトランザクション][]によって変更不可になったプロパティは、その後誰がトランザクションを送信しても変更不可のままです。
- MPT発行フラグは一方向で、一度有効化すると無効化することはできません。同じトランザクションでフラグを有効にし、`ImmutableFlags` で変更不可とすることもできます。この組み合わせに追加のリスクはありません。フラグは有効にした時点ですでに恒久的であり、変更不可の宣言はその事実を記録するだけで、実際にできることを変えるわけではないからです。

## 関連項目

- **コンセプト:**
    - [Multi-Purpose Token](./multi-purpose-tokens.md)
- **チュートリアル:**
    - [Multi-Purpose Tokenの発行](../../../tutorials/tokens/mpts/issue-a-multi-purpose-token.md)
- **リファレンス:**
    - [MPTokenIssuanceCreateトランザクション][]
    - [MPTokenIssuanceSetトランザクション][]
    - [MPTokenIssuanceエントリ][]

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
