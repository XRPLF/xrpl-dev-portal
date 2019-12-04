# sign_for
[[Source]](https://github.com/ripple/rippled/blob/release/src/ripple/rpc/handlers/SignFor.cpp "Source")

The `sign_for` command provides one signature for a [multi-signed transaction](multi-signing.html).

{% include '_snippets/public-signing-note.md' %}
<!--_ -->

This command requires the [MultiSign amendment][] to be enabled. [New in: rippled 0.31.0][]

## Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
    "id": "sign_for_example",
    "command": "sign_for",
    "account": "rLFd1FzHMScFhLsXeaxStzv3UC97QHGAbM",
    "seed": "s████████████████████████████",
    "key_type": "ed25519",
    "tx_json": {
        "TransactionType": "TrustSet",
        "Account": "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
        "Flags": 262144,
        "LimitAmount": {
            "currency": "USD",
            "issuer": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
            "value": "100"
        },
        "Sequence": 2,
        "SigningPubKey": "",
        "Fee": "30000"
    }
}
```

*JSON-RPC*

```
POST http://localhost:5005/
{
    "method": "sign_for",
    "params": [{
        "account": "rLFd1FzHMScFhLsXeaxStzv3UC97QHGAbM",
        "seed": "s████████████████████████████",
        "key_type": "ed25519",
        "tx_json": {
            "TransactionType": "TrustSet",
            "Account": "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
            "Flags": 262144,
            "LimitAmount": {
                "currency": "USD",
                "issuer": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
                "value": "100"
            },
            "Sequence": 2,
            "SigningPubKey": "",
            "Fee": "30000"
        }
    }]
}
```

*Commandline*

```
#Syntax: rippled sign_for <signer_address> <signer_secret> [offline]
rippled sign_for rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW s████████████████████████████ '{
    "TransactionType": "TrustSet",
    "Account": "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
    "Flags": 262144,
    "LimitAmount": {
        "currency": "USD",
        "issuer": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
        "value": "100"
    },
    "Sequence": 2,
    "SigningPubKey": "",
    "Fee": "30000"
}'
```

<!-- MULTICODE_BLOCK_END -->

The request includes the following parameters:

| `Field`      | Type                 | Description                            |
|:-------------|:---------------------|:---------------------------------------|
| `account`    | String - [Address][] | The address which is providing the signature. |
| `tx_json`    | Object               | The [Transaction](transaction-formats.html) to sign. Unlike using the [sign method][], all fields of the transaction must be provided, including `Fee` and `Sequence`. The transaction must include the field `SigningPubKey` with an empty string as the value. The object may optionally contain a `Signers` array with previously-collected signatures. |
| `secret`       | String  | _(Optional)_ Secret key of the account supplying the transaction, used to sign it. Do not send your secret to untrusted servers or through unsecured network connections. Cannot be used with `key_type`, `seed`, `seed_hex`, or `passphrase`. |
| `seed`         | String  | _(Optional)_ Secret key of the account supplying the transaction, used to sign it. Must be in the XRP Ledger's [base58][] format. If provided, you must also specify the `key_type`. Cannot be used with `secret`, `seed_hex`, or `passphrase`. |
| `seed_hex`     | String  | _(Optional)_ Secret key of the account supplying the transaction, used to sign it. Must be in hexadecimal format. If provided, you must also specify the `key_type`. Cannot be used with `secret`, `seed`, or `passphrase`. |
| `passphrase`   | String  | _(Optional)_ Secret key of the account supplying the transaction, used to sign it, as a string passphrase. If provided, you must also specify the `key_type`. Cannot be used with `secret`, `seed`, or `seed_hex`. |
| `key_type`     | String  | _(Optional)_ Type of cryptographic key provided in this request. Valid types are `secp256k1` or `ed25519`. Defaults to `secp256k1`. Cannot be used with `secret`. **Caution:** Ed25519 support is experimental. |

You must provide **exactly 1 field** with the secret key, which can be either of the following:

* Provide a `secret` value and omit the `key_type` field. This value can be formatted as an XRP Ledger [base58][] seed, RFC-1751, hexadecimal, or as a string passphrase. (secp256k1 keys only)
* Provide a `key_type` value and exactly one of `seed`, `seed_hex`, or `passphrase`. Omit the `secret` field. (Not supported by the commandline syntax.)

## Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id": "sign_for_example",
  "status": "success",
  "type": "response",
  "result": {
    "tx_blob": "1200142200040000240000000263D5038D7EA4C680000000000000000000000000005553440000000000B5F762798A53D543A014CAF8B297CFF8F2F937E868400000000000753073008114A3780F5CB5A44D366520FC44055E8ED44D9A2270F3E0107321EDDF4ECB8F34A168143B928D48EFE625501FB8552403BBBD3FC038A5788951D7707440C3DCA3FEDE6D785398EEAB10A46B44047FF1B0863FC4313051FB292C991D1E3A9878FABB301128FE4F86F3D8BE4706D53FA97F5536DBD31AF14CD83A5ACDEB068114D96CB910955AB40A0E987EEE82BB3CEDD4441AAAE1F1",
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
      "Signers": [
        {
          "Signer": {
            "Account": "rLFd1FzHMScFhLsXeaxStzv3UC97QHGAbM",
            "SigningPubKey": "EDDF4ECB8F34A168143B928D48EFE625501FB8552403BBBD3FC038A5788951D770",
            "TxnSignature": "C3DCA3FEDE6D785398EEAB10A46B44047FF1B0863FC4313051FB292C991D1E3A9878FABB301128FE4F86F3D8BE4706D53FA97F5536DBD31AF14CD83A5ACDEB06"
          }
        }
      ],
      "SigningPubKey": "",
      "TransactionType": "TrustSet",
      "hash": "5216A13A3E3CF662352F0B430C7D82B7450415B6883DD428B5EC1DF1DE45DD8C"
    }
  }
}
```

*JSON-RPC*

```
200 OK
{
   "result" : {
      "status" : "success",
      "tx_blob" : "1200142200040000240000000263D5038D7EA4C680000000000000000000000000005553440000000000B5F762798A53D543A014CAF8B297CFF8F2F937E868400000000000753073008114A3780F5CB5A44D366520FC44055E8ED44D9A2270F3E010732102B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF744730450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E58114204288D2E47F8EF6C99BCC457966320D12409711E1F1",
      "tx_json" : {
         "Account" : "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
         "Fee" : "30000",
         "Flags" : 262144,
         "LimitAmount" : {
            "currency" : "USD",
            "issuer" : "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
            "value" : "100"
         },
         "Sequence" : 2,
         "Signers" : [
            {
               "Signer" : {
                  "Account" : "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                  "SigningPubKey" : "02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
                  "TxnSignature" : "30450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E5"
               }
            }
         ],
         "SigningPubKey" : "",
         "TransactionType" : "TrustSet",
         "hash" : "A94A6417D1A7AAB059822B894E13D322ED3712F7212CE9257801F96DE6C3F6AE"
      }
   }
}
```

*Commandline*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "status" : "success",
      "tx_blob" : "1200142200040000240000000263D5038D7EA4C680000000000000000000000000005553440000000000B5F762798A53D543A014CAF8B297CFF8F2F937E868400000000000753073008114A3780F5CB5A44D366520FC44055E8ED44D9A2270F3E010732102B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF744730450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E58114204288D2E47F8EF6C99BCC457966320D12409711E1F1",
      "tx_json" : {
         "Account" : "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
         "Fee" : "30000",
         "Flags" : 262144,
         "LimitAmount" : {
            "currency" : "USD",
            "issuer" : "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
            "value" : "100"
         },
         "Sequence" : 2,
         "Signers" : [
            {
               "Signer" : {
                  "Account" : "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                  "SigningPubKey" : "02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
                  "TxnSignature" : "30450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E5"
               }
            }
         ],
         "SigningPubKey" : "",
         "TransactionType" : "TrustSet",
         "hash" : "A94A6417D1A7AAB059822B894E13D322ED3712F7212CE9257801F96DE6C3F6AE"
      }
   }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`   | Type   | Description                                             |
|:----------|:-------|:--------------------------------------------------------|
| `tx_blob` | String | Hexadecimal representation of the signed transaction, including the newly-added signature. If it has enough signatures, you can [submit this string using the `submit` method](submit.html#submit-only-mode). |
| `tx_json` | Object | The [transaction specification](transaction-formats.html) in JSON format, with the newly-added signature in the `Signers` array. If it has enough signatures, you can submit this object using the [submit_multisigned method][]. |

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `srcActNotFound` - If the `Account` from the transaction is not a funded address in the ledger.
* `srcActMalformed` - If the signing address (`account` field) from the request is not validly formed.
* `badSeed` - The seed value supplied was invalidly-formatted.
* `badSecret` - The secret value supplied was invalidly-formatted.


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
