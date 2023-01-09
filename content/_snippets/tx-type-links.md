{% set txtypes = [
    "AccountDelete",
    "AccountSet",
    "AMMBid",
    "AMMDeposit",
    "AMMCreate",
    "AMMVote",
    "AMMWithdraw",
    "CheckCancel",
    "CheckCash",
    "CheckCreate",
    "DepositPreauth",
    "EscrowCancel",
    "EscrowCreate",
    "EscrowFinish",
    "NFTokenAcceptOffer",
    "NFTokenBurn",
    "NFTokenCancelOffer",
    "NFTokenCreateOffer",
    "NFTokenMint",
    "OfferCancel",
    "OfferCreate",
    "Payment",
    "PaymentChannelClaim",
    "PaymentChannelCreate",
    "PaymentChannelFund",
    "SetRegularKey",
    "SignerListSet",
    "TicketCreate",
    "TrustSet"
] %}
{% set pstxtypes = [
  "EnableAmendment",
  "SetFee",
  "UNLModify"
] %}


{% for tx in txtypes %}
[{{tx}}]: {{tx|lower}}.html
[{{tx}} transaction]: {{tx|lower}}.html
[{{tx}} transactions]: {{tx|lower}}.html
{% if target.lang == "ja" %}
[{{tx}}トランザクション]: {{tx|lower}}.html
[{{tx}} トランザクション]: {{tx|lower}}.html
{% endif %}
{% endfor %}

{% for tx in pstxtypes %}
[{{tx}}]: {{tx|lower}}.html
[{{tx}} pseudo-transaction]: {{tx|lower}}.html
[{{tx}} pseudo-transactions]: {{tx|lower}}.html
[{{tx}}疑似トランザクション]: {{tx|lower}}.html
{% endfor %}
