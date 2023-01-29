---
html: propose-amendments.html
parent: configure-rippled.html
blurb: 
labels:
  - Blockchain
---
# Contribute Code to the XRP Ledger

The software that powers the XRP Ledger is open-source, so anyone can download, modify, extend, or explore it.


## Standards Draft

If you intend to make significant changes to the ledger, write a standards draft detailing the changes and submit it to the **XRPL-Standards** repository. Give the community time to discuss your idea and incorporate feedback before committing time and resources to developing the code.

See: [Standard Proposals](https://github.com/XRPLF/XRPL-Standards/discussions/categories/standard-proposals).

**Note:** Bug fixes don't require a standards draft.


### Naming and Numbering Conventions

Standard drafts must be named and numbered in this format:

`4-digit natural number with leading 0s` XLS-`natural number without leading zeroes.`d: `Title of Proposal`

**Example:** 0032 XLS-32d: Request URI Structure


### Formatting Conventions

Your standards draft should supply the community with the necessary information to facilitate useful discussion. Helpful sections to include are:

- Abstract/Introduction
- Specifications
- Considerations


<!-- This hasn't been updated since 2021; is this step from the README valid? -->
When a standard moves to a folder + file(s) in the Code section of this repository, it will be added to the standards.toml file: https://github.com/XRPLF/XRPL-Standards/blob/master/standards.toml

<!-- How much is enough discussion? The README mentions creating an issue to reference in the PR, but this doesn't seem to be happening in practice. -->
After sufficient input from the community, create a corresponding **Issue** with the finalized standards draft in `XRPLF:develop`.


## Create an Amendment

Any changes that affect **transaction processing** requires an amendment. This applies to:

- Features
- Enhancements
- Bug Fixes

If your change doesn't require an amendment, you can skip this step.

1. Add the name of your amendment as a string to `rippled/src/ripple/protocol/impl/Feature.cpp` to define and initialize a  `uint256` variable. For example:

```cpp
REGISTER_FEATURE(FlowCross,                     Supported::yes, DefaultVote::yes);
REGISTER_FEATURE(CryptoConditionsSuite,         Supported::yes, DefaultVote::no);
REGISTER_FIX    (fix1513,                       Supported::yes, DefaultVote::yes);
```

  - `Supported` parameter should be set to `no` initially.
  - `DefaultVote` parameter should be set to `yes` for bug fixes. Work with the community to decide the default vote for features and enhancements.

2. Navigate to `rippled/src/ripple/protocol/Feature.h` and modify these items:

  - Increment the `numFeatures` counter.

  - Add an `extern uint256 const` variable declaration. For example:

```cpp
extern uint256 const featureFlowCross;
extern uint256 const featureCryptoConditionsSuite;
extern uint256 const fix1513;
```

3. Navigate to `https://github.com/XRPLF/rippled/tree/master/src/ripple/app/tx/impl` and make your changes. Be sure to include an if/else condition to keep old behavior if it's not enabled.

## Develop and Test the Code

1. Create a fork or branch in the [`rippled` repository](https://github.com/XRPLF/rippled) to develop your code.

2. As you develop your amendment, run unit and integration tests. Running a server in *Stand-alone* mode is useful for testing changes, but you may want to stand up a private network for extensive changes.

3. When development is complete, update the `Supported` parameter to `yes` in `Feature.cpp`.

4. Create a **Pull Request** on `XRPLF:develop` and link to the corresponding issue you created.

5. After the PR is approved by XRP Ledger maintainers, your code is merged to `develop`. Additional testing can be done on Devnet.

**Note:**
  - The `DefaultVote` parameter is now locked.
  - If problems are found with the amendment, you must restart the process of making fixes and submitting a new PR. You can change the defaultvote in the new PR.

## Deploy to Mainnet

1. On a quarterly basis, a release candidate is built from the approved PRs on `develop`. The package is deployed to Testnet and a few nodes on Mainnet.

2. If no issues are found with the release candidate, the code is merged into `master` and the nodes on Mainnet upgrade to this build.


## Voting

At this point, the amendment is officially open for voting. Amendments go through the consensus process, and if it maintains 80+% support for two weeks, it's enabled on Mainnet.

## 4. Veto

Amendments that aren't enabled can eventually be vetoed and have its code removed from server packages.