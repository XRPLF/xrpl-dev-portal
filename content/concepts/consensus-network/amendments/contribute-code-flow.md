---
html: contribute-code-flow.html
parent: amendments.html
blurb: 
labels:
  - Blockchain
---
# Contribute Code to the XRP Ledger

The software that powers the XRP Ledger is open-source, so anyone can download, modify, extend, or explore it. If you want to contribute code, it's important to work with the community in defining the specifications of your changes and testing the code before adding it to `rippled`.


## XRP Ledger Standards

Changes to `rippled` are tracked by an XRP Ledger Standard (XLS), a document that identifies and details the specifications of a change. Before committing to development, always submit an XLS draft (XLSd) to the [XRPL-Standards repo](https://github.com/XRPLF/XRPL-Standards/discussions/categories/standard-proposals). This provides the community a chance to discuss and provide feedback about your change.

**Note:** Bug fixes don't require an XLS, but may require an amendment.

Your XLSd should supply the community with information to facilitate useful discussion. Helpful sections to include are:

- Abstract/Introduction
- Specifications
- Considerations

See: [XLS README](https://github.com/XRPLF/XRPL-Standards/blob/master/README.md)

After receiving sufficient input from the community, you can move forward in the process. "Sufficient" is subjective in open-source development, but gauging the community response to your XLSd can help you understand how it will be received if it needs to be voted on as an amendment.


## Amendment Implementation

After you've finalized the XLSd with the community, you now need to determine if your change requires an amendment. Changes that affect **transaction processing** require amendments, specifically changes that:

- Modify ledger rules, resulting in different outcomes.
- Add or remove transactions.
- Affect consensus.

**Note:** If your change doesn't need an amendment, you can go straight to coding and deployment.

Implementing code as an amendment requires you to add the amendment to these files:

- **Feature.cpp**:

  `Supported` parameter should be set to `no` until development is complete.

  `DefaultVote` parameter should be set to `yes` for bug fixes; everything else defaults to `no`.

- **Feature.h**: Increment the `numFeatures` counter and declare an `extern uint256 const` variable.


## Coding and Deployment

The general development path breaks down as follows:

1. Create a fork or branch in the [`rippled` repository](https://github.com/XRPLF/rippled) to develop your code.

    **Tip:** If you're not sure where to start, _Dev Null Productions_ provides a detailed and thorough [`rippled` Source Code Guide](https://xrpintel.com/source).

2. Run unit and integration tests. Running a server in _stand-alone mode_ is useful for testing your changes in an isolated environment, but you may want to stand up a private network for extensive changes.

3. Create a pull request on `XRPLF:develop`.

    **Note for Amendments:** Update the `Supported` paramter to `yes` in **Feature.cpp**.

4. After the pull request is approved by XRP Ledger maintainers, your code is merged into `develop` and additional testing can be done on Devnet.

    **Note for Amendments:**
    - The `DefaultVote` parameter is now locked.
    - If problems are found with the amendment, you must restart the process of making fixes and submitting a new PR. You can change the default vote in the new PR.

5. On a quarterly basis, a release candidate is built from approved PRs on `develop`. The package is deployed to Testnet and a few nodes on Mainnet. If no issues are found with the release candidate, the code is merged into `master` and nodes on Mainnet can upgrade to this build.

6. New amendments go through the consensus process and validators vote on enabling them or not.


## Code Flowchart

***TODO: Add flowchart.***
