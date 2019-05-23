Request("ACCOUNT METHODS");

Request('account_channels', {
    description: "Returns information about an account's <a href='payment-channels.html'>payment channels</a>.",
    link: "account_channels.html",
    body: {
      "id": 1,
      "command": "account_channels",
      "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
      "destination_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "ledger_index": "validated"
    }
})
