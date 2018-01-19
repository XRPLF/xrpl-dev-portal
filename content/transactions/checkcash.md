## CheckCash
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/CashCheck.cpp "Source")

_Requires the [Checks Amendment](reference-amendments.html#checks)._

Attempts to redeem a Check object in the ledger to receive up to the amount authorized by the corresponding [CheckCreate transaction][]. Only the `Destination` address of a Check can cash it with a CheckCash transaction. Cashing a check this way is similar to executing a [Payment][] initiated by the destination.

Since the funds for a check are not guaranteed, redeeming a Check can fail because the sender does not have a high enough balance or because there is not enough liquidity to deliver the funds.

Example CheckCash:

```json
TODO
```

In addition to the [common fields](#common-fields), a CheckCancel transaction has the following:

| Field       | JSON Type | [Internal Type][] | Description                    |
|:------------|:----------|:------------------|:-------------------------------|
| `CheckID`   | String    | Hash256           | The ID of the [Check ledger object](reference-ledger-format.html#check) to cash, as a 64-character hexadecimal string. |
| `Amount`    | [Currency Amount][] | Amount  | _(Optional)_ Redeem the Check for exactly this amount, if possible. The currency must match the `SendMax` of the corresponding CheckCreate transaction. |
| `DeliverMin` | [Currency Amount][] | Amount | _(Optional)_ Redeem the Check for at least this amount and as much as possible. The currency must match the `SendMax` of the corresponding CheckCreate transaction. |

The transaction ***must*** include either `Amount` or `DeliverMin`, but not both.

### Error Cases

- If the sender of the CheckCash transaction is not the `Destination` of the check, the transaction fails with the result code `tecNO_PERMISSION`.
- If the transaction specifies both `Amount` and `DeliverMin`, the transaction fails with the result `temMALFORMED`.
