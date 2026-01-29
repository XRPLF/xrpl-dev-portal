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

- Accounts on the XRPL can be vetted by a trusted credential issuer. Credentials can be issued and revoked, based around relevant criteria, such as credit score.
- Permissioned Domains act as a gateway, limiting who can access the credit facilities, based on accepted credentials you define.
- All credential and loan info is transparent on the XRPL, which makes compliance reporting and monitoring simpler and tamper-proof.


### Streamlined Credit Operations

- You can reduce the overhead of managing loans by programmatically setting the terms of loans with the Lending Protocol, which then handles loan disbursements and repayments.
- The Lending Protocol utilizes uncollateralized loans, but the design is simple and flexible enough for you to add additional logic on top of the primitive. For example, if you need collateralized loans, you can utilize on-chain custodians.
- Built-in first-loss capital features automatically protect against asset losses from defaults.


## Implementation Steps

1. Set Up Credential System
  - Select or become a credential issuer.
  - Define required credentials for borrowers.
  - Set up Permissioned Domains to protect your lending protocol and stay compliant with regulations.
2. Set Up Asset Vaults
  - Set up vaults for different lending assets.
  - Define public/private access parameters.
  - Establish vault management policies.
3. Deploy Lending Protocol
  - Create a LoanBroker and configure lending parameters.
  - Create and manage loans, including fees, impairment and default settings.
  - Set up monitoring and reporting systems.
  - Withdraw and repay loans.
