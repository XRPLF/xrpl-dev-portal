# SignerListSet
[[ソース]<br>](https://github.com/ripple/rippled/blob/ef511282709a6a0721b504c6b7703f9de3eecf38/src/ripple/app/tx/impl/SetSignerList.cpp "Source")

SignerListSetトランザクションは、トランザクションの[マルチ署名](multi-signing.html)に使用できる署名者のリストを作成、置換、削除します。このトランザクションタイプは[MultiSign Amendment][]により導入されました。[新規: rippled 0.31.0][]

## {{currentpage.name}}のJSONの例

```json
{
   "Flags":0,
   "TransactionType":"SignerListSet",
   "Account":"rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
   "Fee":"12",
   "SignerQuorum":3,
   "SignerEntries":[
       {
           "SignerEntry":{
               "Account":"rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
               "SignerWeight":2
           }
       },
       {
           "SignerEntry":{
               "Account":"rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
               "SignerWeight":1
           }
       },
       {
           "SignerEntry":{
               "Account":"raKEEVSGnKSD9Zyvxu4z6Pqpm4ABH8FS6n",
               "SignerWeight":1
           }
       }
   ]
}
```

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->

| フィールド         | JSONの型 | [内部の型][] | 説明                  |
|:--------------|:----------|:------------------|:-----------------------------|
| SignerQuorum  | 数値    | UInt32            | 署名者の重みのターゲット数。このリストの署名者によるマルチ署名は、付与された署名の重みの合計がこの値以上である場合に限り有効となります。SignerListを削除するには、`0`の値を使用します。 |
| SignerEntries | 配列     | 配列             | （削除する場合は省略）このリストの署名者のアドレスと重みを示す[SignerEntryオブジェクト](signerlist.html#signerentryオブジェクト)の配列。SignerListには1～8人のメンバーが含まれている必要があります。リストに1つのアドレスが複数回表示されることはありません。また、トランザクションを送信する`Account`も表示されません。 |

アカウントは複数のSignerListを所有できません。既存のSignerListが存在する場合は、SignerListSetトランザクションが成功するとその既存のSignerListが置き換えられます。SignerListを削除するには、`SignerQuorum`を`0`に設定し、_かつ_`SignerEntries`フィールドを省略します。このようにしないと、トランザクションは[temMALFORMED](tem-codes.html)エラーで失敗します。SignerListを削除するトランザクションは、削除するSignerListがない場合でも成功したとみなされます。

SignerQuorumを満たせない方法でSignerListを作成することはできません。SignerQuorumは0よりも大きく、リストの`SignerWeight`値の合計以下でなければなりません。このようにしないと、トランザクションは[temMALFORMED](tem-codes.html)エラーで失敗します。

トランザクションの署名にマスターキー、レギュラーキー、または現行のSignerListを使用できる場合は、これらを使用してSignerListを作成、更新、削除できます。

トランザクションに署名する最後の方法をアカウントから削除することはできません。アカウントのマスターキーが無効で（[`lsfDisableMaster`フラグ](accountroot.html#accountrootのフラグ)が有効な場合）、アカウントで[レギュラーキー](cryptographic-keys.html)が設定されていない場合、アカウントからSignerListを削除できません。その代わりにトランザクションは[`tecNO_ALTERNATIVE_KEY`](tec-codes.html)エラーで失敗します。

[MultiSignReserve Amendment][] :not_enabled:が有効な場合、SignerListを作成または置換すると、SignerListオブジェクトでlsfOneOwnerCountフラグが有効になります。このフラグが有効な場合、MultiSignReserve Amendmentに定められているとおり、XRP LedgerはSignerListの[`OwnerCount`](accountroot.html#accountrootフィールド)と[所有者準備金](reserves.html#所有者準備金)を減らせます。詳細は、[SignerListのフラグ](signerlist.html#signerlistのフラグ)を参照してください。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
