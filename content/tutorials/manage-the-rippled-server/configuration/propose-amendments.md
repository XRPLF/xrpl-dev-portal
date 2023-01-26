---
html: propose-amendments.html
parent: configure-rippled.html
blurb: 
labels:
  - Blockchain
---
# Propose Amendments

Any changes to transaction processing on the XRP Ledger requires an amendment before it can be enabled on Mainnet. This includes:

- Features
- Enhancements
- Bug Fixes


## 1. Standards Draft

Feature and enhancement amendments start as a standards draft. This step enables you to incorporate feedback from the XRP Ledger dev community before committing to developing it.

**Note:** Bug fixes don't require a standards draft, but still require an amendment if it affects transaction processing.


### Naming and Numbering Conventions

Standards must be named and numbered in this format:

`4-digit natural number with leading 0s` XLS-`natural number without leading zeroes.`d: `Title of Proposal`

**Example:** 0032 XLS-32d: Request URI Structure

Revisions to your standards draft should use a "." seperator.


### Formatting Conventions

Your standards draft should supply the community with the necessary information to facilitate useful discussion. Helpful sections to include are:

- Abstract/Introduction
- Specifications
- Considerations

See: [Standard Proposals](https://github.com/XRPLF/XRPL-Standards/discussions/categories/standard-proposals)

<!-- This hasn't been updated since 2021; is this step from the README valid? -->
When a standard moves to a folder + file(s) in the Code section of this repository, it will be added to the standards.toml file: https://github.com/XRPLF/XRPL-Standards/blob/master/standards.toml

<!-- How much is enough discussion? The README mentions creating an issue to reference in the PR, but this doesn't seem to be happening in practice. -->

After sufficient input from the community, create a corresponding **Issue** with the finalized standards draft in `XRPLF:develop`.


## 2. Add Amendment to `rippled`

<!-- Fixes are DefaultVote 'yes', but what about features? How is the defaultvote decided? -->

1. Add the name of your feature or fix as a string to `rippled/src/ripple/protocol/impl/Feature.cpp` to define and initialize a  `uint256` variable. For example:

```cpp
REGISTER_FEATURE(FlowCross,                     Supported::yes, DefaultVote::yes);
REGISTER_FEATURE(CryptoConditionsSuite,         Supported::yes, DefaultVote::no);
REGISTER_FIX    (fix1513,                       Supported::yes, DefaultVote::yes);
```

**Note:** Fixes automatically defaultvote yes. `Supported` should only be set to `yes` when it's development complete.

2. Navigate to `rippled/src/ripple/protocol/Feature.h` and modify these items:

- Increment the `numFeatures` counter.

- Add an `extern uint256 const` variable declaration. For example:

```cpp
extern uint256 const featureFlowCross;
extern uint256 const featureCryptoConditionsSuite;
extern uint256 const fix1513;
```


## Develop and Test Amendment

1. As you develop your amendment, run unit tests to ensure your code passes; depending on the complexity of the amendment, you can also deploy to a private network and request feedback. When development and testing are complete, update the `Supported` parameter to `yes` in `Feature.cpp`.

2. Create a **Pull Request** on `XRPLF:develop` and link to the corresponding issue you created.

<!-- Is there a process to add this to a Beta? What constitues a Beta? -->
3. After the PR is approved, merge to `develop` as part of a Beta.

**Note:** The `DefaultVote` parameter is now locked and can't be changed without another PR.

<!-- How are `DefaultVote` no handled? What's the testing phase for these look like? -->
Deploy beta code to Devnet. If the default vote is set to "Yes", it remains on Devnet (and goes through 2 weeks of voting/possible majority loss). If no issues are found on Devnet, the code is merged to the master branch and built into published packages.


## Deploy Code to Devnet

Servers build the latest Deploy beta code to Devnet. If the default vote is set to "Yes", it remains on Devnet, where it goes through the two-week consensus process. After it's enabled, assuming no issues are found, the code is merged into the `master` branch. If problems are found with the amendment, you must restart the process of making fixes and submitting a new PR. You can change the defaultvote in the new PR.

<!-- How often is code merged from develop into master? Who decides the frequency? -->


## 3. Voting

Once the amendment code is merged into `master`, server operators will update to the latest server package and voting begins in earnest. The amendment is officially open for voting. Amendment goes through vetting process and if it keeps 80+% support for two weeks, it's enabled on Mainnet.

## 4. Veto