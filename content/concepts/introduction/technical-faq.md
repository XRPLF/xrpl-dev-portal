# Technical FAQ

## Validators and Unique Node Lists

<!--#{ using h4s for questions to keep them out of the right side nav (too cluttered when they display) and to provide appropriate text size for questions. #}-->
#### What service do transaction validators provide?

Validators determine if transactions meet protocol requirements, and are therefore “valid.” The service validators uniquely provide is grouping transactions into ordered units, agreeing on one such ordering specifically to prevent double spending.

See [Consensus](consensus.html) and the [Ripple Labs Tech Talk: Understanding Consensus](https://ripple.com/insights/ripple-labs-tech-talk-consensus-within-the-ripple-protocol/) for more information about the consensus process.


#### How much does it cost to run a validator?

Running a validator does not require any fees or XRP. It is comparable in cost to running an email server in terms of electricity.


#### What are Unique Node Lists (UNLs)?

They are the lists of transaction validators a given participant believes will not conspire to defraud them.


#### Which UNL should I select?

Since anybody can run a validator, the burden is on the network participants to choose a reliable set. Currently, Ripple provides a default and recommended list which we expand based on watching the history of validators operated by Ripple and third parties. Eventually, Ripple intends to remove itself from this process entirely by having network participants select their own lists based on publicly available data about validator quality.


#### If Ripple recommends adoption of its UNL, doesn’t that create a centralized system?

No. The XRP Ledger network is opt-in. Each participant directly or indirectly chooses its UNL. Should Ripple stop operating or should Ripple act maliciously, participants could change their UNLs to continue using the XRP Ledger.


#### What is the validator incentive structure for validators not run by Ripple?

The primary incentive to run a validator is to preserve and protect the stable operation and sensible evolution of the network. It is the validators who decide the evolution of the XRP Ledger, so any business that uses or depends on the XRP Ledger has an inherent incentive to ensure the reliability and stability of the network.

If you run an XRP Ledger server to participate in the network, the additional cost and effort to operate a validator is minimal. This means that additional incentives, such as the mining rewards in Bitcoin, are not necessary. Ripple avoids paying XRP as a reward for operating a validator so that such incentives do not warp the behavior of validators.


#### Can financial institutions set up transaction validators that will help them meet specific institutional standards and requirements?

No, institutions cannot set up customized validator policies for transaction selection. Validators either follow the protocol, or they do not. If software does not follow protocol rules, it will not function. Thus, it is not recommended that institutions seek out custom implementations without in-house expertise.


#### What will happen if more than 20% of nodes within the network do not agree with the majority? How is the final version of the ledger chosen?

The network may temporarily halt to reconfigure itself to continue with the new UNL list based on those that want to reach consensus. This temporary processing delay is desired rather than double spending.

In the process of determining the final, authoritative version of the ledger, there may be multiple temporary internal versions. Such internal versions  will happen in distributed systems because not all nodes will receive transactions in the same order. The analogous behavior in Bitcoin is where two servers each see a different longest chain because two blocks were mined at about the same time.

However, there will only be one authoritative ledger version at any given time; other versions are irrelevant and harmless.


#### Does the XRP Ledger utilize a formal validator onboarding process?

No, a formal validator onboarding process is not compatible with the XRP Ledger, as it is a system with no central authority.

For recommendations and best practices, see [Run `rippled` as a Validator](run-rippled-as-a-validator.html).


## Role of XRP


#### Why does Ripple use XRP holdings?

Ripple's XRP holdings incentivize the company to make the XRP Ledger as useful as possible. XRP exists as a native asset in the XRP Ledger for anti-spam transaction purposes, and for currency bridging only if beneficial to users. Otherwise, the use of XRP in transactions is completely optional.


#### How does the XRP Ledger respond to transaction floods?

The XRP Ledger is designed to set the transaction cost dynamically based on demand as an anti-spam measure. The impact of any potential XRP manipulation is minimized by increases in network size as the market cap and transaction volume increase.


#### What is Ripple standard operating procedure regarding money laundering and suspicious economic activity?

Ripple is committed to monitoring and reporting any AML flags across the XRP Ledger network, as well as reporting suspicious activity to FinCEN as applicable.


## Security Concerns


#### What is Ripple’s process for reviewing third-party code contributions before they go live in the master codebase?

The code contribution process starts with a developer opening a pull request against Ripple's `rippled` repo. This pull request triggers automated unit and integration tests, as well as code reviews by several developers who, typically, have significant expertise in the area of code that the pull request is changing.

Once the pull request passes automated tests and receives approvals from reviewers, a trusted [maintainer of the repo](https://opensource.guide/best-practices/) can stage it for inclusion in the next beta.

#### Does Ripple own or control the XRP Ledger or XRP Ledger network?

No, Ripple does not own or control the XRP Ledger or XRP Ledger network.

Ripple does publish a reference implementation of the core XRP Ledger server ([`rippled`](https://github.com/ripple/rippled)) and employs a team of engineers who contribute to the open-source codebase. Ripple also periodically publishes precompiled binary packages of the software as a convenience. Anyone is free to [download and compile the software from source](install-rippled.html), if they prefer.  

You don't need to use Ripple’s version of the XRP Ledger software to interact with the XRP Ledger. `rippled` is open-source software and Ripple grants anyone the ability to use, extend, and modify it as long as they follow the terms of the [ISC license](https://github.com/ripple/rippled/blob/develop/LICENSE). The ISC License is very permissive compared to some other open-source licenses that strictly limit how you can extend and adapt the software.

#### Does Ripple offer a secure method to download their software?

`rippled` source code is available at <https://github.com/ripple/rippled>, where the tip of the `master`, `release` and `develop` branches always contains a version-setting commit signed by a `rippled` developer. The XRP Ledger also offers prebuilt binary packages for CentOS, RedHat Enterprise Linux, Fedora, Ubuntu, and Debian Linux. Those packages are digitally signed by Ripple so that they are tamper-evident and their authenticity can be verified. Lastly, release bulletins are made available over a secure website, and include the commit ID of the repository, as well as the cryptographic hash values of the packages that are published.


#### Does Ripple distinguish between the codebase for validation and the one for user software?

Yes. Client software for the XRP Ledger, including ripple-lib, has a different codebase and repositories from `rippled` (validation).


## See Also

- [`rippled` codebase](https://github.com/ripple/rippled)
- User software codebase:
      - [ripple-lib](https://github.com/ripple/ripple-lib)
      - [ripplecharts-frontend](https://github.com/ripple/ripplecharts-frontend)
- [Ripple GitHub Organization](https://github.com/ripple/)
