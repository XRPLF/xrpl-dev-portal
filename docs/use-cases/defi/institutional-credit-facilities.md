---
seo:
    description: The XRPL's Lending Protocol, combined with Single Asset Vaults, Credentials, and Permissioned Domains, enable institutional credit facilities.
labels:
  - Decentralized Finance
  - Lending Protocol
status: not_enabled
---
# Institutional Credit Facilities

Financial institutions need efficient ways to provide credit facilities while maintaining regulatory compliance. Traditional uncollateralized lending faces challenges with liquidity management, credit assessment, and operational efficiency. The XRPL's Lending Protocol, combined with Single Asset Vaults, Credentials, and Permissioned Domains, provides a solution for institutional credit facilities.

{% amendment-disclaimer name="LendingProtocol" /%}


## Background: Challenges with traditional credit facilities

Institutional lending typically involves multiple challenges in the current financial system:

1. **Liquidity Management**: Capital inefficiently distributed across multiple lending pools, which makes it difficult to source at low cost.
2. **Credit Assessment**: Complex verification and management of institutional creditworthiness
3. **Settlement Delays**: Multi-day settlement cycles for loan disbursement and repayment
4. **Operational Overhead**: Manual processing of loan documentation and approvals
5. **Regulatory Compliance**: Resource-intensive KYC and reporting requirements


## Solution: Lending on the XRPL

The XRPL lending protocol addresses these challenges through:


### Efficient Liquidity Pooling

- You can create Single Asset Vaults to aggregate lender assets into unified pools and programmatically loan those assets out. The following scenario is difficult to achieve in TradFi because you would have to manage deposits across multiple banks, conduct KYC on each user, handle repayments, and absorb the costs of inefficient rails and transaction fees. Single Asset Vaults provide benefits to all participants in the lending protocol:
  - **Depositors** gain access to larger lending markets by aggregating deposits with other small-sized depositors. This lets them participate in loans they normally wouldn’t be able to in tradfi scenarios which require far more capital. This enables them to earn yield on otherwise idle assets.
  - **Lenders** can source from these vaults cheaply and and quickly, capitalizing on the spread.
  - **Borrowers** gain access to reliable liquidity.
- Single Asset Vaults automate liquidity management, handling deposits and redemptions through a sophisticated exchange algorithm that:
  - Converts deposits into shares for vault depositors.
  - Manages redemptions back into assets.
  - Dynamically adjusts exchange rates to reflect true vault value when interest from loans are paid back into the vault.
- Single Asset Vaults support multiple asset types (XRP, Trust Line Tokens such as RLUSD, or Multi-purpose Tokens).


### Regulatory Compliance

- Accounts on the XRPL can be vetted by a trusted credential issuer. Credentials can be issued and revoked based on relevant criteria, such as credit score.
- Permissioned Domains act as a gateway, limiting who can access the credit facilities based on accepted credentials you define.
- All credential and loan info is transparent on the XRPL, which makes compliance reporting and monitoring simpler and tamper-proof.


### Streamlined Credit Operations

- You can reduce the overhead of managing loans by programmatically setting the terms of loans with the Lending Protocol, which then handles loan disbursements and repayments.
- The Lending Protocol utilizes uncollateralized loans, but the design is simple and flexible enough for you to add additional logic on top of the primitive. For example, if you need collateralized loans, you can utilize on-chain custodians.
- Built-in first-loss capital features automatically protect against asset losses from defaults.


## User Journeys

There are three users that enable institutional credit facilities on the XRP Ledger: Loan Brokers, Lenders, and Borrowers. The tabs below outline which features and transactions each user typically uses in the lending process.

{% tabs %}
{% tab label="Loan Broker" %}
As a **Loan Broker**, I need to:
- Create a [LoanBroker entry][] to define the configuration of a Lending Protocol.
- Maintain the required [first-loss capital](../../concepts/tokens/lending-protocol.md#first-loss-capital) to protect deposits in my Single Asset Vault.

| Step                           | Description | Technical Implementation |
|:-------------------------------|:------------|:-------------------------|
| Vault Setup                    | The Loan Broker creates a Single Asset Vault to aggregate one type of asset to lend out. They define a [permissioned domain][] to ensure only accounts that meet KYB (Know Your Business) compliance requirements can deposit into the vault. | - [Create Permissioned Domains](../../tutorials/javascript/compliance/create-permissioned-domains.md)<br>- [Create a Single Asset Vault](../../tutorials/how-tos/set-up-lending/use-single-asset-vaults/create-a-single-asset-vault.md) |
| Lending Protocol Setup         | The Loan Broker sets up the Lending Protocol instance, linking it to the Single Asset Vault they created, and defining parameters such as payment fees. | [Create a Loan Broker](../../tutorials/how-tos/set-up-lending/use-the-lending-protocol/create-a-loan-broker.md) |
| First-loss Capital Maintenance | The Loan Broker deposits first-loss capital into the Lending Protocol to meet the minimum cover required. When there is excess cover, they withdraw first-loss capital. | [Deposit and Withdraw First-Loss Capital](../../tutorials/how-tos/set-up-lending/use-the-lending-protocol/deposit-and-withdraw-cover.md) |
{% /tab %}

{% tab label="Lender" %}
As a **Lender**, I need to:
- Authorize my account to deposit assets into a Single Asset Vault, so that I can deploy idle liquidity to generate yield.
- Redeem vault shares to realize my earnings and return assets to my account.

| Step            | Description | Technical Implementation |
|:----------------|:------------|:-------------------------|
| Onboarding      | The Lender triggers a verification workflow with the Loan Broker managing the Lending Protocol. The Loan Broker can issue their own credentials or utilize a credential issuer. Upon successful KYB, a credential is issued and the Lender accepts the credential. | [Build a Credential Issuing Service](../../tutorials/javascript/build-apps/credential-issuing-service.md) |
| Deposit Asset   | The Lender deposits assets into a Single Asset Vault to lend out. Vault shares are minted and sent back to the Lender, representing their stake in the vault. | [Deposit into a Vault](../../tutorials/how-tos/set-up-lending/use-single-asset-vaults/deposit-into-a-vault.md) |
| Withdraw Asset  | Vault shares are yield-bearing assets; the vault collects interest and fees on loans, which increases the underlying value of each vault share. The Lender collects their deposit (plus yield) by redeeming vault shares. | [Withdraw from a Vault](../../tutorials/how-tos/set-up-lending/use-single-asset-vaults/withdraw-from-a-vault.md) |
{% /tab %}

{% tab label="Borrower" %}
As a **Borrower**, I need to:
- Authorize my account to request loans from a Loan Broker.
- Repay my loan.

| Step             | Description | Technical Implementation |
|:-----------------|:------------|:-------------------------|
| Onboarding       | The Borrower triggers a verification workflow with the Loan Broker managing the Lending Protocol. The Loan Broker can issue their own credentials or utilize a credential issuer. Upon successful KYB, a credential is issued and the Borrower accepts the credential. | [Build a Credential Issuing Service](../../tutorials/javascript/build-apps/credential-issuing-service.md) |
| Loan Application | The Borrower applies for a loan with the Loan Broker. Both parties agree on the terms and co-sign the loan. | [Create a Loan](../../tutorials/how-tos/set-up-lending/use-the-lending-protocol/create-a-loan.md) |
| Repayment        | The Borrower makes payments on principal, interest, and fees according to the loan agreement. | [Pay Off a Loan](../../tutorials/how-tos/set-up-lending/use-the-lending-protocol/pay-off-a-loan.md) |
{% /tab %}
{% /tabs %}

{% raw-partial file="/docs/_snippets/common-links.md" /%}
