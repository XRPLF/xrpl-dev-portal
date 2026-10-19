{% admonition type="danger" name="警告" %}
[fixCleanup3_4_0 Amendment](/resources/known-amendments.md#fixcleanup3_4_0)が有効になるまでは、`PaymentBurn`詳細権限を委任しないことを推奨します。この修正が適用される前は、`PaymentBurn`詳細権限を持つ被委任者が、特定の状況下で新しい代替可能トークン([トラストライントークン](/@l10n/ja/docs/concepts/tokens/fungible-tokens/trust-line-tokens.md)または[MPT](/@l10n/ja/docs/concepts/tokens/fungible-tokens/multi-purpose-tokens.md))を発行できてしまいます。その他の詳細権限には影響ありません。
{% /admonition %}
