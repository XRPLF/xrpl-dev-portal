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

{% for tx in txtypes %}
[{{tx}}]: reference-transaction-format.html#{{tx|lower}}
[{{tx}} transaction]: reference-transaction-format.html#{{tx|lower}}
[{{tx}} transactions]: reference-transaction-format.html#{{tx|lower}}
{% endfor %}
