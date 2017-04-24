{% set txtypes = [
    "AccountSet",
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
