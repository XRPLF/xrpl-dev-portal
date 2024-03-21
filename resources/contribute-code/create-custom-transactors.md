---
html: create-custom-transactors.html
parent: contribute-code.html
seo:
    description: Create custom transactors to interact with the XRP Ledger.
labels:
  - Development
  - Blockchain
---
# Create Custom Transactors

A _transactor_ is code that processes a transaction and modifies the XRP Ledger. Creating custom transactors enables you to add new functionality to `rippled`. This tutorial walks through coding transactors, but you'll have to go through the amendment process to add it to XRPL. See: [Contribute Code to the XRP Ledger](./index.md).

Transactors follow a basic order of operations:

1. Access a _view_ into a serialized type ledger entry (SLE).
2. Update, erase, or insert values in the _view_.
3. Apply the finalized changes from the _view_ to the ledger.

**Note:** _Views_ are sandboxes into ledgers. Transactors make all necessary error checks and changes in sandboxes, not directly on the ledger. After values are finalized, changes are applied atomically to the ledger.

This tutorial uses the existing `CreateCheck` transactor as an example. You can view the source files here:

- [Header File](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/CreateCheck.h)
- [CPP File](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/CreateCheck.cpp)


## Header File

Create a header file in this format:

```c++
namespace ripple {

class CreateCheck : public Transactor
{
public:
    static constexpr ConsequencesFactoryType ConsequencesFactory{Normal};

    explicit CreateCheck(ApplyContext& ctx) : Transactor(ctx)
    {
    }

    static NotTEC
    preflight(PreflightContext const& ctx);

    static TER
    preclaim(PreclaimContext const& ctx);

    TER
    doApply() override;
};

}  // namespace ripple
```

Initializing the transactor with `ApplyContext` gives it access to:

- The transaction that triggered the transactor.
- A view of the SLE.
- A journal to log errors.


## CPP File

### 1. Add a `preflight` function.

The `preflight` function checks for errors in the transaction itself before accessing the ledger. It should reject invalid and incorrectly formed transactions.

- `PreflightContext` doesn't have a view of the ledger.
- Use bracket notation to retrieve fields from ledgers and transactions:

    ```
    auto const curExpiration = (*sle*)[~sfExpiration];
    (*sle)[sfBalance] = (*sle)[sfBalance] + reqDelta;
    ```

    **Note:** The `~` symbol returns an optional type.

- You can view ledger and transaction schemas here:
    - [`LedgerFormats.cpp`](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/LedgerFormats.cpp)
    - [`TxFormats.cpp`](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/TxFormats.cpp)

- `rippled` summarizes transaction results with result codes. See: [Transaction Results](../../docs/references/protocol/transactions/transaction-results/index.md)

```c++
CreateCheck::preflight(PreflightContext const& ctx)
{
    // Check if this amendment functionality is enabled on the network.
    if (!ctx.rules.enabled(featureChecks))
        return temDISABLED;

    NotTEC const ret{preflight1(ctx)};
    if (!isTesSuccess(ret))
        return ret;

    if (ctx.tx.getFlags() & tfUniversalMask)
    {
        // There are no flags (other than universal) for CreateCheck yet.
        JLOG(ctx.j.warn()) << "Malformed transaction: Invalid flags set.";
        return temINVALID_FLAG;
    }
    if (ctx.tx[sfAccount] == ctx.tx[sfDestination])
    {
        // They wrote a check to themselves.
        JLOG(ctx.j.warn()) << "Malformed transaction: Check to self.";
        return temREDUNDANT;
    }

    {
        STAmount const sendMax{ctx.tx.getFieldAmount(sfSendMax)};
        if (!isLegalNet(sendMax) || sendMax.signum() <= 0)
        {
            JLOG(ctx.j.warn()) << "Malformed transaction: bad sendMax amount: "
                            << sendMax.getFullText();
            return temBAD_AMOUNT;
        }

        if (badCurrency() == sendMax.getCurrency())
        {
            JLOG(ctx.j.warn()) << "Malformed transaction: Bad currency.";
            return temBAD_CURRENCY;
        }
    }

    if (auto const optExpiry = ctx.tx[~sfExpiration])
    {
        if (*optExpiry == 0)
        {
            JLOG(ctx.j.warn()) << "Malformed transaction: bad expiration";
            return temBAD_EXPIRATION;
        }
    }

    return preflight2(ctx);
}
```


### 2. Add a `preclaim` function.

The `preclaim` function checks for errors that require viewing information on the current ledger.

- If this step returns a result code of `tesSUCCESS` or any `tec` result, the transaction will be queued and broadcast to peers.

```c++
CreateCheck::preclaim(PreclaimContext const& ctx)
{
    AccountID const dstId{ctx.tx[sfDestination]};

    // Use the `keylet` function to get the key of the SLE. Views have either `read` or `peek` access.
    // `peek` access allows the developer to modify the SLE returned.
    auto const sleDst = ctx.view.read(keylet::account(dstId));
    if (!sleDst)
    {
        JLOG(ctx.j.warn()) << "Destination account does not exist.";
        return tecNO_DST;
    }

    auto const flags = sleDst->getFlags();

    // Check if the destination has disallowed incoming checks
    if (ctx.view.rules().enabled(featureDisallowIncoming) &&
        (flags & lsfDisallowIncomingCheck))
        return tecNO_PERMISSION;

    if ((flags & lsfRequireDestTag) && !ctx.tx.isFieldPresent(sfDestinationTag))
    {
        // The tag is basically account-specific information we don't
        // understand, but we can require someone to fill it in.
        JLOG(ctx.j.warn()) << "Malformed transaction: DestinationTag required.";
        return tecDST_TAG_NEEDED;
    }

    {
        STAmount const sendMax{ctx.tx[sfSendMax]};
        if (!sendMax.native())
        {
            // The currency may not be globally frozen
            AccountID const& issuerId{sendMax.getIssuer()};
            if (isGlobalFrozen(ctx.view, issuerId))
            {
                JLOG(ctx.j.warn()) << "Creating a check for frozen asset";
                return tecFROZEN;
            }
            // If this account has a trustline for the currency, that
            // trustline may not be frozen.
            //
            // Note that we DO allow create check for a currency that the
            // account does not yet have a trustline to.
            AccountID const srcId{ctx.tx.getAccountID(sfAccount)};
            if (issuerId != srcId)
            {
                // Check if the issuer froze the line
                auto const sleTrust = ctx.view.read(
                    keylet::line(srcId, issuerId, sendMax.getCurrency()));
                if (sleTrust &&
                    sleTrust->isFlag(
                        (issuerId > srcId) ? lsfHighFreeze : lsfLowFreeze))
                {
                    JLOG(ctx.j.warn())
                        << "Creating a check for frozen trustline.";
                    return tecFROZEN;
                }
            }
            if (issuerId != dstId)
            {
                // Check if dst froze the line.
                auto const sleTrust = ctx.view.read(
                    keylet::line(issuerId, dstId, sendMax.getCurrency()));
                if (sleTrust &&
                    sleTrust->isFlag(
                        (dstId > issuerId) ? lsfHighFreeze : lsfLowFreeze))
                {
                    JLOG(ctx.j.warn())
                        << "Creating a check for destination frozen trustline.";
                    return tecFROZEN;
                }
            }
        }
    }
    if (hasExpired(ctx.view, ctx.tx[~sfExpiration]))
    {
        JLOG(ctx.j.warn()) << "Creating a check that has already expired.";
        return tecEXPIRED;
    }
    return tesSUCCESS;
}
```


### 3. Add a `doApply()` function.

The `doApply()` function has read/write access, enabling you to modify the ledger.

```c++
CreateCheck::doApply()
{
    auto const sle = view().peek(keylet::account(account_));
    if (!sle)
        return tefINTERNAL;

    // A check counts against the reserve of the issuing account, but we
    // check the starting balance because we want to allow dipping into the
    // reserve to pay fees.
    {
        STAmount const reserve{
            view().fees().accountReserve(sle->getFieldU32(sfOwnerCount) + 1)};

        if (mPriorBalance < reserve)
            return tecINSUFFICIENT_RESERVE;
    }

    // Note that we use the value from the sequence or ticket as the
    // Check sequence.  For more explanation see comments in SeqProxy.h.
    std::uint32_t const seq = ctx_.tx.getSeqProxy().value();
    Keylet const checkKeylet = keylet::check(account_, seq);
    auto sleCheck = std::make_shared<SLE>(checkKeylet);

    sleCheck->setAccountID(sfAccount, account_);
    AccountID const dstAccountId = ctx_.tx[sfDestination];
    sleCheck->setAccountID(sfDestination, dstAccountId);
    sleCheck->setFieldU32(sfSequence, seq);
    sleCheck->setFieldAmount(sfSendMax, ctx_.tx[sfSendMax]);
    if (auto const srcTag = ctx_.tx[~sfSourceTag])
        sleCheck->setFieldU32(sfSourceTag, *srcTag);
    if (auto const dstTag = ctx_.tx[~sfDestinationTag])
        sleCheck->setFieldU32(sfDestinationTag, *dstTag);
    if (auto const invoiceId = ctx_.tx[~sfInvoiceID])
        sleCheck->setFieldH256(sfInvoiceID, *invoiceId);
    if (auto const expiry = ctx_.tx[~sfExpiration])
        sleCheck->setFieldU32(sfExpiration, *expiry);

    view().insert(sleCheck);

    auto viewJ = ctx_.app.journal("View");
    // If it's not a self-send (and it shouldn't be), add Check to the
    // destination's owner directory.
    if (dstAccountId != account_)
    {
        auto const page = view().dirInsert(
            keylet::ownerDir(dstAccountId),
            checkKeylet,
            describeOwnerDir(dstAccountId));

        JLOG(j_.trace()) << "Adding Check to destination directory "
                        << to_string(checkKeylet.key) << ": "
                        << (page ? "success" : "failure");

        if (!page)
            return tecDIR_FULL;

        sleCheck->setFieldU64(sfDestinationNode, *page);
    }

    {
        auto const page = view().dirInsert(
            keylet::ownerDir(account_),
            checkKeylet,
            describeOwnerDir(account_));

        JLOG(j_.trace()) << "Adding Check to owner directory "
                        << to_string(checkKeylet.key) << ": "
                        << (page ? "success" : "failure");

        if (!page)
            return tecDIR_FULL;

        sleCheck->setFieldU64(sfOwnerNode, *page);
    }
    // If we succeeded, the new entry counts against the creator's reserve.
    adjustOwnerCount(view(), sle, 1, viewJ);
    return tesSUCCESS;
}
```


## Additional Functions

You can add more helper functions to your custom transactor as necessary. There are a few special functions that are relevant in special cases.


### `calculateBaseFee`

Most transactions inherit the default [reference transaction cost](../../docs/concepts/transactions/transaction-cost.md). However, if your transactor needs to define a non-standard transaction cost, you can replace the transactor's `calculateBaseFee` method with a custom one.

The following example shows how `EscrowFinish` transactions charge an additional cost on conditional escrows based on the size of the fulfillment:

```c++
XRPAmount
EscrowFinish::calculateBaseFee(ReadView const& view, STTx const& tx)
{
    XRPAmount extraFee{0};

    if (auto const fb = tx[~sfFulfillment])
    {
        extraFee += view.fees().base * (32 + (fb->size() / 16));
    }

    return Transactor::calculateBaseFee(view, tx) + extraFee;
}
```


### `makeTxConsequences`

`rippled` uses a [`TxConsequences`](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/applySteps.h#L41-L44) class to describe the outcome to an account when applying a transaction. It tracks the fee, maximum possible XRP spent, and how many sequence numbers are consumed by the transaction. There are three types of consequences:

- **Normal:** The transactor doesn't affect transaction signing and _only_ consumes an XRP fee. Transactions that spend XRP beyond the fee aren't considered normal.
- **Blocker:** The transactor affects transaction signing, preventing valid transactions from queueing behind it.
- **Custom:** The transactor needs to do additional work to determination consequences.

The `makeTxConsequences` function enables you to create custom consequences for situations such as:

- Payments sending XRP.
- Tickets consuming more than one sequence number.
- Transactions that are normal or blockers, depending on flags or fields set.

**Note:** `TxConsequences` only affects the [transaction queue](../../docs/concepts/transactions/transaction-queue.md). If a transaction is likely to claim a fee when applied to the ledger, it will be broadcast to peers. If it's not likely to claim a fee, or that can't be determined, it won't be broadcast.


```c++
SetAccount::makeTxConsequences(PreflightContext const& ctx)
{
    // The SetAccount may be a blocker, but only if it sets or clears
    // specific account flags.
    auto getTxConsequencesCategory = [](STTx const& tx) {
        if (std::uint32_t const uTxFlags = tx.getFlags();
            uTxFlags & (tfRequireAuth | tfOptionalAuth))
            return TxConsequences::blocker;

        if (auto const uSetFlag = tx[~sfSetFlag]; uSetFlag &&
            (*uSetFlag == asfRequireAuth || *uSetFlag == asfDisableMaster ||
             *uSetFlag == asfAccountTxnID))
            return TxConsequences::blocker;

        if (auto const uClearFlag = tx[~sfClearFlag]; uClearFlag &&
            (*uClearFlag == asfRequireAuth || *uClearFlag == asfDisableMaster ||
             *uClearFlag == asfAccountTxnID))
            return TxConsequences::blocker;

        return TxConsequences::normal;
    };

    return TxConsequences{ctx.tx, getTxConsequencesCategory(ctx.tx)};
}
```


## Next Steps

Re-compile the server with your new transactor and test it in [stand-alone mode](../../docs/infrastructure/testing-and-auditing/index.md). If you coded the transactor behind an amendment, you can [force-enable](../../docs/infrastructure/testing-and-auditing/test-amendments.md) the feature using the config file.
