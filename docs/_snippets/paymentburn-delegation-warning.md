{% admonition type="danger" name="Warning" %}
Until the [fixCleanup3_4_0 amendment](/resources/known-amendments.md#fixcleanup3_4_0) is enabled, it is recommended not to delegate the `PaymentBurn` granular permission. Before the fix, a delegate with only `PaymentBurn` can send a payment whose amount crosses a zero balance, which effectively mints new tokens. Other granular permissions are unaffected.
{% /admonition %}
