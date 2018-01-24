## CheckCancel
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/CancelCheck.cpp "Source")

_Requires the [Checks Amendment](reference-amendments.html#checks)._

Cancels an unredeemed Check, removing it from the ledger without sending any money. The source or the destination of the check can cancel a Check at any time using this transaction type. If the Check has expired, any address can cancel it.

Example CheckCancel:

```json
{
    "Account": "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
    "TransactionType": "CheckCancel",
    "CheckID": "49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0",
    "Fee": "12"
}
```

In addition to the [common fields](#common-fields), a CheckCancel transaction has the following:

| Field       | JSON Type | [Internal Type][] | Description                    |
|:------------|:----------|:------------------|:-------------------------------|
| `CheckID`   | String    | Hash256           | The ID of the [Check ledger object](reference-ledger-format.html#check) to cancel, as a 64-character hexadecimal string. |

### Error Cases

- If the object identified by the `CheckID` does not exist or is not a Check, the transaction fails with the result `tecNO_ENTRY`.
- If the Check is not expired and the sender if the CheckCancel transaction is not the source or destination of the Check, the transaction fails with the result `tecNO_PERMISSION`.
