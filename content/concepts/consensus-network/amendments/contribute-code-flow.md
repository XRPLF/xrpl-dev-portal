---
html: contribute-code-flow.html
parent: amendments.html
blurb: 
labels:
  - Blockchain
---
# Contribute Code to the XRP Ledger

The software that powers the XRP Ledger is open-source, so anyone can download, modify, extend, or explore it. If you want to contribute code, it's important to work with the community in defining the specifications of your changes and testing the code before adding it to `rippled`.


## Standards Draft

Most changes will start with a standards draft. The standards draft outlines the specifications of your change and provides the XRPL community a chance to give feedback. Before committing to development, always submit a standards draft to the [XRPL-Standards repo](https://github.com/XRPLF/XRPL-Standards/discussions/categories/standard-proposals).

**Note:** Bug fixes don't require standards drafts, but may require amendments.

Your standards draft should supply the community with information to facilitate useful discussion. Helpful sections to include are:

- Abstract/Introduction
- Specifications
- Considerations

***TODO: Link to a standards draft outline.***

After receiving sufficient input from the community, you can move forward in the process. "Sufficient" is subjective in open-source development, but gauging the community response to your standards draft can help you understand how it will be received if it needs to be voted on as an amendment.


## Amendment Implementation

After you've finalized the standards draft with the community, you now need to determine if your change requires an amendment. Anything that affects **transaction processing** requires an amendment. This applies to:

- Features
- Enhancements
- Bug Fixes

**Note:** If your change doesn't affect how transactions are processed by the ledger, you can go straight to coding and deployment.

Implementing code as an amendment requires you to modify these files:

- **Feature.cpp**: Add your amendment and set the `DefaultVote` and `Supported` parameters.

- **Feature.h**: Increment the `numFeatures` counter and declare an `extern uint256 const` variable for your amendment.


## Coding and Deployment

The general development path breaks down as follows:

1. Create a fork or branch in the [`rippled` repository](https://github.com/XRPLF/rippled) to develop your code.

    **Tip:** If you're not sure where to start, _Dev Null Productions_ provides a detailed and thorough [`rippled` Source Code Guide](https://xrpintel.com/source).

2. Run unit and integration tests. Running a server in _stand-alone mode_ is useful for testing your changes in an isolated environment, but you may want to stand up a private network for extensive changes.

3. When development is complete, update the `Supported` parameter to `yes` in **Feature.cpp**.

4. Create a pull reuest on `XRPLF:develop`.

5. After the pull request is approved by XRP Ledger maintainers, your code is merged into `develop` and additional testing can be done on Devnet. If problems are found with your amendment, you must fix the issue and submit a new PR.

6. On a quarterly basis, a release candidate is built from approved PRs on `develop`. The package is deployed to Testnet and a few nodes on Mainnet. If no issues are found with the release candidate, the code is merged into `master` and nodes on Mainnet can upgrade to this build.

7. New amendments go through the consensus process and validators vote on enabling them or not.


## Code Flowchart

***TODO: Add flowchart.***

<!-- Move this section into XLS spec outline.

### Naming and Numbering Conventions

Standard drafts must be named and numbered in this format:

`4-digit natural number with leading 0s` XLS-`natural number without leading zeroes.`d: `Title of Proposal`

**Example:** 0032 XLS-32d: Request URI Structure

-->
