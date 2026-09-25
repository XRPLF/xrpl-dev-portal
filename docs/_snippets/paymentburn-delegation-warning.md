{% admonition type="danger" name="Warning" %}
Until the [fixCleanup3_4_0 amendment](/resources/known-amendments.md#fixcleanup3_4_0) is enabled, it is recommended not to delegate the `PaymentBurn` granular permission. Before the fix, a delegate with the `PaymentBurn` granular permission can also mint new fungible tokens ([trust line tokens](/docs/concepts/tokens/fungible-tokens/trust-line-tokens) or [MPTs](/docs/concepts/tokens/fungible-tokens/multi-purpose-tokens)) in certain circumstances. Other granular permissions are unaffected.
{% /admonition %}
