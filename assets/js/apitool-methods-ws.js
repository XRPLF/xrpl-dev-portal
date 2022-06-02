DEFAULT_ADDRESS_1 = "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
DEFAULT_ADDRESS_2 = "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX"

Request("Account Methods")

Request('account_channels', {
    description: "Returns information about an account's <a href='payment-channels.html'>payment channels</a>.",
    link: "account_channels.html",
    body: {
      "id": 1,
      "command": "account_channels",
      "account": DEFAULT_ADDRESS_1,
      "destination_account": DEFAULT_ADDRESS_2,
      "ledger_index": "validated"
    }
})

Request('account_currencies', {
  description: "Retrieves a list of currencies that an account can send or receive, based on its trust lines.",
  link: "account_currencies.html",
  body: {
    "command": "account_currencies",
    "account": DEFAULT_ADDRESS_1,
    "strict": true,
    "ledger_index": "validated"
  }
})

Request('account_info', {
  description: "Retrieves information about an account, its activity, and its XRP balance.",
  link: "account_info.html",
  body: {
    "id": 2,
    "command": "account_info",
    "account": DEFAULT_ADDRESS_1,
    "strict": true,
    "ledger_index": "current",
    "queue": true
  }
})

Request('account_lines', {
  description: "Retrieves information about an account's trust lines, including balances for all non-XRP currencies and assets.",
  link: "account_lines.html",
  body: {
    "id": 2,
    "command": "account_lines",
    "account": DEFAULT_ADDRESS_1,
    "ledger_index": "validated"
  }
})

Request('account_nfts', {
  description: "Retrieves NFTs owned by an account.",
  link: "account_nfts.html",
  status: "not_enabled",
  body: {
    "command": "account_nfts",
    "account": "rsuHaTvJh1bDmDoxX9QcKP7HEBSBt4XsHx",
    "ledger_index": "validated"
  }
})

Request('account_objects', {
  description: "Returns the raw ledger format for all objects owned by an account.",
  link: "account_objects.html",
  body: {
    "id": 1,
    "command": "account_objects",
    "account": DEFAULT_ADDRESS_1,
    "ledger_index": "validated",
    "type": "state",
    "limit": 10
  }
})

Request('account_offers', {
  description: "Retrieves a list of offers made by a given account that are outstanding as of a particular ledger version.",
  link: "account_offers.html",
  body: {
    "id": 2,
    "command": "account_offers",
    "account": DEFAULT_ADDRESS_1
  }
})

Request('account_tx', {
  description: "Retrieves a list of transactions that affected the specified account.",
  link: "account_tx.html",
  body: {
    "id": 2,
    "command": "account_tx",
    "account": DEFAULT_ADDRESS_1,
    "ledger_index_min": -1,
    "ledger_index_max": -1,
    "binary": false,
    "limit": 2,
    "forward": false
  }
})

Request('gateway_balances', {
  description: "Calculates the total balances issued by a given account, optionally excluding amounts held by operational addresses.",
  link: "gateway_balances.html",
  body: {
    "id": "example_gateway_balances_1",
    "command": "gateway_balances",
    "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q", // btc2ripple
    "strict": true,
    "hotwallet": [
      "rKm4uWpg9tfwbVSeATv4KxDe6mpE9yPkgJ",
      "ra7JkEzrgeKHdzKgo4EUUVBnxggY4z37kt"
    ],
    "ledger_index": "validated"
  }
})

Request('noripple_check', {
  description: "Compares an account's Default Ripple and No Ripple flags to the recommended settings.",
  link: "noripple_check.html",
  body: {
    "id": 0,
    "command": "noripple_check",
    "account": DEFAULT_ADDRESS_1,
    "role": "gateway",
    "ledger_index": "current",
    "limit": 2,
    "transactions": true
  }
})

Request("Ledger Methods")

Request('ledger', {
  description: "Retrieves information about the public ledger.",
  link: "ledger.html",
  body: {
    "id": 14,
    "command": "ledger",
    "ledger_index": "validated",
    "full": false,
    "accounts": false,
    "transactions": false,
    "expand": false,
    "owner_funds": false
  }
})

Request('ledger_closed', {
  description: "Returns the unique identifiers of the most recently closed ledger. (This ledger is not necessarily validated and immutable yet.)",
  link: "ledger_closed.html",
  body: {
    "id": 2,
    "command": "ledger_closed"
  }
})

Request('ledger_current', {
  description: "Returns the unique identifiers of the current in-progress ledger.",
  link: "ledger_closed.html",
  body: {
    "id": 2,
    "command": "ledger_current"
  }
})

Request('ledger_data', {
  description: "Retrieves contents of the specified ledger.",
  link: "ledger_data.html",
  body: {
   "id": 2,
   "ledger_hash": "842B57C1CC0613299A686D3E9F310EC0422C84D3911E5056389AA7E5808A93C8",
   "command": "ledger_data",
   "limit": 5,
   "binary": true
 }
})

Request('ledger_entry - by object ID', {
  description: "Returns an object by its unique ID.",
  link: "ledger_entry.html#get-ledger-object-by-id",
  body: {
    "command": "ledger_entry",
    "index": "7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4",
    "ledger_index": "validated"
  }
})

Request('ledger_entry - AccountRoot', {
  description: "Returns a single account in its raw ledger format.",
  link: "ledger_entry.html#get-accountroot-object",
  body: {
    "id": "example_get_accountroot",
    "command": "ledger_entry",
    "account_root": DEFAULT_ADDRESS_1,
    "ledger_index": "validated"
  }
})

Request('ledger_entry - DirectoryNode', {
  description: "Returns a directory object in its raw ledger format.",
  link: "ledger_entry.html#get-directorynode-object",
  body: {
    "id": "example_get_directorynode",
    "command": "ledger_entry",
    "directory": {
      "owner": DEFAULT_ADDRESS_1,
      "sub_index": 0
    },
    "ledger_index": "validated"
  }
})

Request('ledger_entry - Offer', {
  description: "Returns an Offer object in its raw ledger format.",
  link: "ledger_entry.html#get-offer-object",
  body: {
    "id": "example_get_offer",
    "command": "ledger_entry",
    "offer": {
      "account": DEFAULT_ADDRESS_1,
      "seq": 359
    },
    "ledger_index": "validated"
  }
})

Request('ledger_entry - RippleState', {
  description: "Returns a RippleState object in its raw ledger format.",
  link: "ledger_entry.html#get-ripplestate-object",
  body: {
    "id": "example_get_ripplestate",
    "command": "ledger_entry",
    "ripple_state": {
      "accounts": [
        DEFAULT_ADDRESS_1,
        "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW"
      ],
      "currency": "USD"
    },
    "ledger_index": "validated"
  }
})

Request('ledger_entry - Check', {
  description: "Returns a Check object in its raw ledger format.",
  link: "ledger_entry.html#get-check-object",
  body: {
    "id": "example_get_check",
    "command": "ledger_entry",
    "check": "C4A46CCD8F096E994C4B0DEAB6CE98E722FC17D7944C28B95127C2659C47CBEB",
    "ledger_index": "validated"
  }
})

Request('ledger_entry - Escrow', {
  description: "Returns an Escrow object in its raw ledger format.",
  link: "ledger_entry.html#get-escrow-object",
  body: {
    "id": "example_get_escrow",
    "command": "ledger_entry",
    "escrow": { // This is a long-lasting Escrow found in public data
      "owner": "rL4fPHi2FWGwRGRQSH7gBcxkuo2b9NTjKK",
      "seq": 126
    },
    "ledger_index": "validated"
  }
})

Request('ledger_entry - PayChannel', {
  description: "Returns a PayChannel object in its raw ledger format.",
  link: "ledger_entry.html#get-paychannel-object",
  body: {
    "id": "example_get_paychannel",
    "command": "ledger_entry",
    "payment_channel": "C7F634794B79DB40E87179A9D1BF05D05797AE7E92DF8E93FD6656E8C4BE3AE7",
    "ledger_index": "validated"
  }
})

Request('ledger_entry - DepositPreauth', {
  description: "Returns a DepositPreauth object in its raw ledger format.",
  link: "ledger_entry.html#get-depositpreauth-object",
  body: {
    "id": "example_get_deposit_preauth",
    "command": "ledger_entry",
    "deposit_preauth": {
      "owner": DEFAULT_ADDRESS_1,
      "authorized": DEFAULT_ADDRESS_2
    },
    "ledger_index": "validated"
  }
})

// Waiting for TicketBatch amendment on Mainnet
// Request('ledger_entry - Ticket', {
//   description: "Returns a Ticket object in its raw ledger format.",
//   link: "ledger_entry.html#get-ticket-object",
//   body: {
//     "id": "example_get_ticket",
//     "command": "ledger_entry",
//     "ticket": {
//       "owner": DEFAULT_ADDRESS_1,
//       "ticket_sequence": 0 // TODO: make a real ticket, fill in the seq
//     },
//     "ledger_index": "validated"
//   }
// })


Request("Transaction Methods")

// Signing methods are not provided here because they're admin-only by default.
// (Sending your secret to another server is extremely insecure and could cause
// someone else to take over your account, steal all your money, etc.)

Request('submit', {
  description: "Submits a transaction to the network to be confirmed and included in future ledgers.",
  link: "submit.html",
  body: {
    "id": "example_submit",
    "command": "submit",
    "tx_blob": "1200002280000000240000001E61D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA968400000000000000B732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7447304502210095D23D8AF107DF50651F266259CC7139D0CD0C64ABBA3A958156352A0D95A21E02207FCF9B77D7510380E49FF250C21B57169E14E9B4ACFD314CEDC79DDD0A38B8A681144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754"
  }
})

Request('submit_multisigned', {
  description: "Submits a multi-signed transaction to the network to be confirmed and included in future ledgers.",
  link: "submit_multisigned.html",
  body: {
    "id": "submit_multisigned_example",
    "command": "submit_multisigned",
    "tx_json": {
        "Account": "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
        "Fee": "30000",
        "Flags": 262144,
        "LimitAmount": {
            "currency": "USD",
            "issuer": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
            "value": "100"
        },
        "Sequence": 2,
        "Signers": [{
            "Signer": {
                "Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                "SigningPubKey": "02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
                "TxnSignature": "30450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E5"
            }
        }, {
            "Signer": {
                "Account": "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
                "SigningPubKey": "028FFB276505F9AC3F57E8D5242B386A597EF6C40A7999F37F1948636FD484E25B",
                "TxnSignature": "30440220680BBD745004E9CFB6B13A137F505FB92298AD309071D16C7B982825188FD1AE022004200B1F7E4A6A84BB0E4FC09E1E3BA2B66EBD32F0E6D121A34BA3B04AD99BC1"
            }
        }],
        "SigningPubKey": "",
        "TransactionType": "TrustSet",
        "hash": "BD636194C48FD7A100DE4C972336534C8E710FD008C0F3CF7BC5BF34DAF3C3E6"
    }
  }
})

Request('transaction_entry', {
  description: "Retrieves information on a single transaction from a specific ledger version.",
  link: "transaction_entry.html",
  body: {
    "id": 4,
    "command": "transaction_entry",
    "tx_hash": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7",
    "ledger_index": 348734
  }
})

Request('tx', {
  description: "Retrieves information on a single transaction.",
  link: "tx.html",
  body: {
    "id": 1,
    "command": "tx",
    "transaction": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7",
    "binary": false
  }
})

Request("Path and Order Book Methods")

Request('book_offers', {
  description: "Retrieves a list of offers, also known as the order book, between two currencies.",
  link: "book_offers.html",
  body: {
    "id": 4,
    "command": "book_offers",
    "taker": DEFAULT_ADDRESS_1,
    "taker_gets": {
      "currency": "XRP"
    },
    "taker_pays": {
      "currency": "USD",
      "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
    },
    "limit": 10
  }
})

Request('deposit_authorized', {
  description: "Checks whether one account is authorized to send payments directly to another.",
  link: "deposit_authorized.html",
  body: {
    "id": 1,
    "command": "deposit_authorized",
    "source_account": DEFAULT_ADDRESS_1,
    "destination_account": DEFAULT_ADDRESS_2,
    "ledger_index": "validated"
  }
})

Request('nft_buy_offers', {
  description: "Retrieves offers to buy a given NFT.",
  link: "nft_buy_offers.html",
  status: "not_enabled",
  body: {
    "command": "nft_buy_offers",
    "nft_id": "00090000D0B007439B080E9B05BF62403911301A7B1F0CFAA048C0A200000007",
    "ledger_index": "validated"
  }
})

Request('nft_sell_offers', {
  description: "Retrieves offers to sell a given NFT.",
  link: "nft_sell_offers.html",
  status: "not_enabled",
  body: {
    "command": "nft_sell_offers",
    "nft_id": "00090000D0B007439B080E9B05BF62403911301A7B1F0CFAA048C0A200000007",
    "ledger_index": "validated"
  }
})

Request('path_find', {
  description: "Searches for a path along which a payment can possibly be made, and periodically sends updates when the path changes over time.",
  link: "path_find.html",
  ws_only: true,
  body: {
    "id": 8,
    "command": "path_find",
    "subcommand": "create",
    "source_account": DEFAULT_ADDRESS_1,
    "destination_account": DEFAULT_ADDRESS_1,
    "destination_amount": {
        "value": "0.001",
        "currency": "USD",
        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
    }
  }
})

Request('ripple_path_find', {
  description: "Searches one time for a payment path.",
  link: "ripple_path_find.html",
  body: {
    "id": 8,
    "command": "ripple_path_find",
    "source_account": DEFAULT_ADDRESS_1,
    "source_currencies": [
        {
            "currency": "XRP"
        },
        {
            "currency": "USD"
        }
    ],
    "destination_account": DEFAULT_ADDRESS_1,
    "destination_amount": {
        "value": "0.001",
        "currency": "USD",
        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
    }
  }
})

Request("Payment Channel Methods")

Request('channel_authorize', {
  description: "Creates a signature that can be used to redeem a specific amount of XRP from a payment channel.",
  link: "channel_authorize.html",
  body: {
    "id": "channel_authorize_example_id1",
    "command": "channel_authorize",
    "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
    "secret": "s████████████████████████████",
    "amount": "1000000"
  }
})

Request('channel_verify', {
  description: "Checks the validity of a signature that can be used to redeem a specific amount of XRP from a payment channel.",
  link: "channel_verify.html",
  body: {
    "id": 1,
    "command": "channel_verify",
    "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
    "signature": "304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064",
    "public_key": "aB44YfzW24VDEJQ2UuLPV2PvqcPCSoLnL7y5M1EzhdW4LnK5xMS3",
    "amount": "1000000"
  }
})

Request("Subscription Methods")

Request('subscribe', {
  description: "Requests periodic notifications from the server when certain events happen.",
  link: "subscribe.html",
  body: {
    "id": "Example watch one account and all new ledgers",
    "command": "subscribe",
    "streams": ["ledger"],
    "accounts": ["rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1"]
  }
})

Request('unsubscribe', {
  description: "Tells the server to stop sending messages for a particular subscription or set of subscriptions.",
  link: "unsubscribe.html",
  body: {
    "id": "Example stop watching one account and new ledgers",
    "command": "unsubscribe",
    "streams": ["ledger"],
    "accounts": ["rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1"]
  }
})

Request("Server Info Methods")

Request('fee', {
  description: "Reports the current state of the open-ledger requirements for the transaction cost.",
  link: "fee.html",
  body: {
    "id": "fee_websocket_example",
    "command": "fee"
  }
})

Request('server_info', {
  description: "Reports a human-readable version of various information about the rippled server being queried.",
  link: "server_info.html",
  body: {
    "id": 1,
    "command": "server_info"
  }
})

Request('server_state', {
  description: "Reports a machine-readable version of various information about the rippled server being queried.",
  link: "server_state.html",
  body: {
    "id": 1,
    "command": "server_state"
  }
})

Request("Utility Methods")

Request('ping', {
  description: "Checks that the connection is working.",
  link: "ping.html",
  body: {
    "id": 1,
    "command": "ping"
  }
})

Request('random', {
  description: "Provides a random number, which may be a useful source of entropy for clients.",
  link: "random.html",
  body: {
    "id": 1,
    "command": "random"
  }
})
