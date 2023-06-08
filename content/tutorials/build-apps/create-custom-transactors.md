---
html: create-custom-transactors.html
parent:
blurb: Create custom transactors to interact with the XRP Ledger.
labels:
  - XRP
---
# Create Custom Transactors

You can create custom transactors to modify 

## Create .h file

1. Initialize your transactor with the `ApplyContext` object. `ApplyContext` includes the transaction that triggered the transactor, the view of the SLE, as well as a journal to log errors.

```c++
public:
  explicit MyTransactor(ApplyContext& ctx) : Transactor(ctx)
  {
  }
```

2. Add a preflight function.

```c++
static NotTEC
preflight(PreflightContext const& ctx);
```

- `PreflightContext` doesn't have a view (no access to the ledger). This function is for error checks on the transaction itself. Good for checking malformed transactors, such as sending an IOU to escrows which don't support IOUs.

- This prevent needless transactions which incurs fees.

3. Add a preclaim function.

```c++
static TER
preclaim(PreclaimContext const& ctx);
```

- `PreclaimContext` has a read-only view of the ledger.

- This is still used for error checking, but will incur fees.

- A good example is checking for errors that require looking at the ledger, such as sending an escrow to an account that doesn't exist.

4. Add a `doApply()` function.

```c++
TER
doApply() override;
```

- doApply() has access to the read/write view, enabling you to modify ledger objects.


```c++
class CashCheck : public Transactor
{
public:
    
    explicit CashCheck(ApplyContext& ctx) : Transactor(ctx)
    {
    }

    static NotTEC
    preflight(PreflightContext const& ctx);

    static TER
    preclaim(PreclaimContext const& ctx);

    TER
    doApply() override;
};
```


```c++
class MyTransactor : public Transactor
{
  public:
    explicit MyTransactor(ApplyContext& ctx) : Transactor(ctx)
    {
    }

    static NotTEC
    preflight(PreflightContext const& ctx);

    static TER
    preclaim(PreclaimContext const& ctx);

    TER
    doApply() override;
};
```

## Create .cpp file




## Ledger Object

- Is how the state of the ledger is stored. Examples are accountroot, which holds balance and publick key.

- SLE is a type alias for STLedgerEntry, or serialized type ledger entry.

- Ledger formats have a known schema, depending on what you get. Stored in `ledgerformats.cpp`.

- Ledger objects know their key in the ledger. it's a 256 bit value.

- Schema for Ledger Objects:

{sfAccount, soeREQUIRED} `sf` stands for static field and then append the field name to get the field you want. `soe` denotes if it's required or not.
{sfBalance, soeREQURIED}

- The way to get Ledger objects from ledger:

Use the `keylet` function to get the key of the ledger object (SLE) you want.

```c++
`view.read(keylet::account(account));
```

You'll use either `read` or `peak` to retrieve the SLE.

- SLE Interface:

The interface/schema of the SLE. Use bracket notation to retrieve fields.

```c++
auto const curExpiration = (*sle*)[~sfExpiration];
(*sle)[sfBalance] = (*sle)[sfBalance] + reqDelta;
```

The `~` symbol returns an optional type.


## Transactions


- Transactions are represented by STTx, or serialized type Tx.

- These are similar to ledger objects.

- Look up known formats in `TxFormats.cpp`


## Views

- Views are sandboxes into ledgers.

- Values are changed in sandboxes, not the ledgers directly. This is done since you want changes to happen atomically, aka all the little steps happen in sandbox, finalized thing submitted on ledger.

- Views can be stacked for more complex code/situations.

- Order of operations in Views.

  1. Peek/read SLE
  2. Update/erase/insert
  3. Apply to ledger.

- Peek vs read. Peek gives you a read/write SLE. Read only gives a read-only (no changes allowed).

```c++
auto const sle = 
  view.peek(keylet::account(txAccount));

(*sle)[sfBalance] = (*sle)[sfBalance] - tx[sfAmount];
view.update(sle);
```

## Invariants

Invariant system run on every transaction to make sure certain things are always true no matter what, serving as a final check on transactions. The system isn't perfect and is designed for checking catastrophic errors, such as never creating new XRP.


## Next Steps

Submit your transactor to the XRPL `Devnet` for others to test.