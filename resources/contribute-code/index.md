---
html: contribute-code.html
parent: resources.html
seo:
    description: Learn how features can be coded into the XRP Ledger protocol.
labels:
  - Blockchain
---
# Contribute Code

The software that powers the XRP Ledger is open source. Anyone can download, modify, extend, or explore it. If you want to contribute code, it's important to work with the community to define the specifications of your changes and test the code before it becomes a part of the XRP Ledger protocol and blockchain.

## Core Server Source

The software that powers the XRP Ledger is open-source, so anyone can download, modify, extend, or explore it. Community involvement makes it better. Look for "[Source]" links in the [documentation](/docs/) to jump directly into the related source code, or browse the source code on GitHub:

| XRP Ledger Source Code |                                                     |
|:-----------------------|:----------------------------------------------------|
| Repository             | <https://github.com/XRPLF/rippled>                |
| License                | [Multiple; ISC (permissive)](https://github.com/XRPLF/rippled/blob/develop/LICENSE.md) |
| Programming Language   | C++                                                 |

If you're not sure where to start, Dev Null Productions provides a detailed and thorough [**Source Code Guide**](https://xrpintel.com/source) that describes the structure and functions of the core XRP Ledger server (`rippled`) implementation.


## XRP Ledger Standards

Changes to `rippled` are tracked by an XRP Ledger Standard (XLS), a document that identifies and details the specifications of a change. Before committing to development, you must start a discussion in the [XRPL-Standards repo](https://github.com/XRPLF/XRPL-Standards/discussions). This provides the community a chance to discuss and provide feedback about your change.

**Note:** Bug fixes don't require an XLS, but may require an amendment.

Creating an XLS has its own process, but can be summarized as:

1. Start a discussion and gather feedback.
2. Create an XLS draft in the standards repo.
3. Publishing the XLS draft as a Candidate Specification.

For details, see the [XLS contributing guide](https://github.com/XRPLF/XRPL-Standards/blob/master/CONTRIBUTING.md).


## Amendment Implementation

After you've created an XLS draft, you now need to determine if your change requires an amendment. Changes that affect **transaction processing** require amendments, specifically changes that:

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

6. New amendments go through the consensus process and validators vote on whether to enable them.


## Code Flowchart

![Code Flowchart](/docs/img/contribute-code-flowchart.png)


## See Also

- **Concepts:**
    - [Amendments](../../docs/concepts/networks-and-servers/amendments.md)
