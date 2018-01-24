{% set txtypes = [
    "AccountSet",
    "CheckCancel",
    "CheckCash",
    "CheckCreate",
    "EscrowCancel",
    "EscrowCreate",
    "EscrowFinish",
    "OfferCancel",
    "OfferCreate",
    "Payment",
    "PaymentChannelClaim",
    "PaymentChannelCreate",
    "PaymentChannelFund",
    "SetRegularKey",
    "SignerListSet",
    "TrustSet"
] %}
{% set pstxtypes = [
  "EnableAmendment",
  "SetFee"
] %}

{% if currentpage.html == "reference-transaction-format.html" %}
  {% set basepage = "" %}
{% else %}
  {% set basepage = "reference-transaction-format.html" %}
{% endif %}

{% for tx in txtypes %}
[{{tx}}]: {{basepage}}#{{tx|lower}}
[{{tx}} transaction]: {{basepage}}#{{tx|lower}}
[{{tx}} transactions]: {{basepage}}#{{tx|lower}}
{% endfor %}

{% for tx in pstxtypes %}
[{{tx}}]: {{basepage}}#{{tx|lower}}
[{{tx}} pseudo-transaction]: {{basepage}}#{{tx|lower}}
[{{tx}} pseudo-transactions]: {{basepage}}#{{tx|lower}}
{% endfor %}
