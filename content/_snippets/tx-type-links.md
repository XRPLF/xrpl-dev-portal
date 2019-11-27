{% set txtypes = [
    "AccountDelete",
    "AccountSet",
    "CheckCancel",
    "CheckCash",
    "CheckCreate",
    "DepositPreauth",
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


{% for tx in txtypes %}
[{{tx}}]: {{tx|lower}}.html
[{{tx}} transaction]: {{tx|lower}}.html
[{{tx}} transactions]: {{tx|lower}}.html
{% if target.lang == "ja" %}
[{{tx}}トランザクション]: {{tx|lower}}.html
{% endif %}
{% endfor %}

{% for tx in pstxtypes %}
[{{tx}}]: {{tx|lower}}.html
[{{tx}} pseudo-transaction]:  {{tx|lower}}.html
[{{tx}} pseudo-transactions]:  {{tx|lower}}.html
{% endfor %}
