---
seo:
    description: The XRPL Lending Protocol enables on-chain, uncollateralized fixed-term loans.
labels:
  - Decentralized Finance
  - Lending Protocol
status: not_enabled
---
# Lending Protocol

The Lending Protocol is an XRP Ledger DeFi primitive that enables on-chain, fixed-term, uncollateralized loans using pooled funds from a [Single Asset Vault](./single-asset-vault.md). The protocol is highly configurable, enabling loan brokers to easily tune risk appetite, depostitor protections, and economic incentives. 

The implementation relies on off-chain underwriting and risk management to assess the creditworthiness of borrowers, but offers peer-to-peer loans without intermediaries like banks or financial institutions. First-loss capital protection is used to help offset losses from loan defaults.

The current implementation of the lending protocol doesn't include automated on-chain collateral and liquidation management, instead focusing on on-chain credit origination.

To ensure compliance needs are met, asset issuers can [claw back](../../references/protocol/transactions/types/clawback.md) funds from the vault associated with the lending protocol. Issuers can also [freeze](./fungible-tokens/freezes.md) individual accounts or issue a global freeze.

{% amendment-disclaimer name="LendingProtocol" /%}

## Protocol Flow

There are three parties involved in the process of creating a loan:

- **Loan Brokers**: Create asset vaults and manage associated loans.
- **Depositors**: Add assets to vaults.
- **Borrowers**: Receive loans, making repayments as defined by their loan terms.

[{% inline-svg file="../../img/lending-protocol-diagram.svg" /%}](../../img/lending-protocol-diagram.svg "Diagram: The lifecycle of a loan.")

The lifecycle of a loan is as follows:

1. A loan broker creates a vault.
2. Depositors add assets to the vault.
3. (Optional) The loan broker deposits first-loss capital.
4. A loan broker and borrower create a loan, defining the terms of the loan, and the requested principal (excluding fees) is transferred to the borrower.
5. If payments are missed, the loan enters a grace period. Once the grace period expires, the loan broker has the option to default the loan.
6. The loan is deleted when matured or defaulted.
7. (Optional) The loan broker can withdraw first-loss capital.
8. After all loans are paid, the loan broker can delete the `LoanBroker` ledger entry, and then the corresponding `Vault` ledger entry.


## Accounting

### Risk Management

#### First-Loss Capital

First-Loss Capital is an optional mechanism to mitigate the risks associated with lending. To protect investors' assets, a loan broker can deposit assets as first-loss capital, which acts as a buffer in the event of loan defaults. The first-loss capital is placed into the vault to cover a percentage of losses from missed payments.

Three parameters control the First-Loss Capital:

- `CoverAvailable`: The total amount of cover deposited by the lending protocol owner.
- `CoverRateMinimum`: The percentage of debt that must be covered by `CoverAvailable`.
- `CoverRateLiquidation`: The maximum percentage of the minimum required cover _(DebtTotal x CoverRateMinimum)_ that will be placed in the asset vault to cover a loan default.

Whenever the available cover falls below the minimum required:

- The loan broker can't issue new loans.
- The loan broker can't receive fees. All fees are added to the First-Loss Capital to cover the deficit.

Below is an example of how first-loss capital is used to cover a loan default:

```
** Initial States **

-- Vault --
AssetsTotal             = 100,090 Tokens
AssetsAvailable         = 99,000 Tokens
SharesTotal             = 100,000 Tokens

-- Lending Protocol --
DebtTotal               = 1,090 Tokens
CoverRateMinimum        = 0.1 (10%)
CoverRateLiquidation    = 0.1 (10%)
CoverAvailable          = 1,000 Tokens

-- Loan --
PrincipleOutstanding  = 1,000 Tokens
InterestOutstanding   = 90 Tokens


# First-Loss Capital liquidation maths

DefaultAmount = PrincipleOutstanding + InterestOutstanding
              = 1,000 + 90
              = 1,090

# The amount of the default that the first-loss capital scheme will cover
DefaultCovered      = min((DebtTotal x CoverRateMinimum) x CoverRateLiquidation, DefaultAmount)
                    = min((1,090 * 0.1) * 0.1, 1,090) = min(10.9, 1,090)
                    = 10.9 Tokens

Loss                = DefaultAmount - DefaultCovered
                    = 1,090 - 10.9
                    = 1,079.1 Tokens

FundsReturned       = DefaultCovered
                    = 10.9

# Note, Loss + FundsReturned MUST be equal to PrincipleOutstanding + InterestOutstanding

** State Changes **

-- Vault --
AssetsTotal     = AssetsTotal - Loss
                = 100,090 - 1,079.1
                = 99,010.9 Tokens

AssetsAvailable = AssetsAvailable + FundsReturned
                = 99,000 + 10.9
                = 99,010.9 Tokens

SharesTotal = (UNCHANGED)

-- Lending Protocol --
DebtTotal       = DebtTotal - PrincipleOutstanding + InterestOutstanding
                = 1,090 - (1,000 + 90)
                = 0 Tokens

CoverAvailable  = CoverAvailable - DefaultCovered
                = 1,000 - 10.9
                = 989.1 Tokens
```

#### Impairment

If the loan broker discovers a borrower can't make an upcoming payment, impairment allows the loan broker to register a "paper loss" with the vault. The impairment mechanism moves the due date of the next payment to the time the loan is impaired, allowing the loan to default more quickly. However, if the borrower makes a payment before that date, the impairment status is automatically cleared.


### Compliance

#### Clawback

Issuers (trust line token or MPT, not XRP) can claw back funds from First-Loss Capital. To ensure there is always a minimum amount of capital available to protect depositors, issuers can't claw back the entire available amount. Instead, they can claw back up to a minimum amount of First-Loss Capital that the loan broker must maintain for the lending protocol; the minimum amount is calculated as `LoanBroker.DebtTotal * LoanBroker.CoverRateMinimum`.

#### Freeze

Freezing is a mechanism by which an asset issuer (trust line token or MPT, not XRP) prevents an account from sending their issued asset. _Deep freeze_ takes this a step further by preventing an account from sending _and_ receiving issued assets. Issuers can also enact a _global freeze_, which prevents everyone from sending or receiving their issued asset.

{% admonition type="info" name="Note" %}
In all freeze scenarios, assets can be sent back to the issuer.
{% /admonition %}

If a borrower has their account frozen or deep frozen, they can't make loan payments. This doesn't absolve a borrower of their repayment obligations, and they will eventually default on their loan.

Freezing a borrower's account won't affect a loan broker's functions, but it will prevent them from receiving any lending protocol fees. However, issuers can freeze a loan broker's _pseudo-account_ and prevent the loan broker from creating new loans; existing loans won't be affected. A deep freeze on a loan broker's _pseudo-account_ also prevents loans from being repaid.


### Interest Rates

There are three interest rates associated with a loan:

- **Interest Rate**: The regular interest rate based on the principal amount. It is the cost of borrowing funds.
- **Late Interest Rate**: A higher interest rate charged for a late payment.
- **Full Payment Rate**: An interest rate charged for repaying the total loan early.


### Fees

The lending protocol charges a number of fees that the loan broker can configure. The protocol won't charge these fees if the loan broker hasn't deposited enough first-loss capital.

- **Management Fee**: This is a percentage of interest charged by the loan broker. Vault depositors pay this fee.
- **Loan Origination Fee**: A fee paid to the loan broker, taken from the principal amount loaned out.
- **Loan Service Fee**: A fee charged on top of each loan payment.
- **Late Payment Fee**: A fee paid on top of a late payment.
- **Early Payment Fee**: A fee paid on top of an early payment.


## Loan Payment Processing

Loan payments are evaluated and processed around three criteria: amount, timing, and specified flags. The combination of these criteria determine how funds are applied to the loan's principal, interest, and associated fees.

Each payment consists of four components:

- **Principal**: The portion that reduces the outstanding loan principle.
- **Interest**: The portion that covers the cost of borrowing for the period.
- **Fees**: The portion that covers any applicable service fees, management fees, late payment fees, or other charges.
- **ValueChange**: The amount by which the payment changes the loan balance.

When the loan payment is submitted, the lending protocol then checks these parameters:

- **Timing**: Is the payment on time or late?
- **Amount**: Does the payment amount meet the minimum required amount, or exceed it?

Based on the timing and transaction flags, the lending protocol processes the payment as one of four types:

- **On-Time Payments**: If the payment is on-time, it's further classified into these payment scenarios:
  - **Sequential Periodic Payments**: The payment is applied to as many complete payment cycles as possible; cycles are calculated as the amount due each payment period (including fees).
  - **Overpayments**: After all possible cycles are fully paid, any remaining amount is treated as an overpayment and applied to the principal. This type of payment requires the `lsfLoanOverpayment` flag to be enabled on the `Loan` ledger entry, as well as the `tfLoanOverpayment` flag to be enabled on the `LoanPay` transaction. If these flags are missing, the excess amount is ignored.
  - **Full Early Repayment**: The payment has the `tfLoanFullPayment` flag set, and the amount covers the remainder of the loan (including fees).
- **Late Payments**: The payment is late on a payment cycle. Late payments must be for an exact amount, calculated as:

  `totalDue = periodicPayment + loanServiceFee + latePaymentFee + latePaymentInterest`
  
  Overpayments aren't permitted on late payments; any excess amount is ignored.

{% admonition type="info" name="Note" %}
In scenarios where excess payment amounts are "ignored", the transaction succeeds, but the borrower is only charged on the expected amount.
{% /admonition %}

{% raw-partial file="/docs/_snippets/common-links.md" /%}
