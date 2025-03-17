import React from 'react';

interface FAQProps {
  seo: {
    description: string;
  };
  subtitle: string;
  labels: string[];
}

const FAQ: React.FC<FAQProps> = ({ seo, subtitle, labels }) => {
  return (
    <div className="page-faq">
      <div className="container">
        <article>
          <h6>FAQ</h6>
          <h1>{subtitle}</h1>

          <div className="q-wrapper" id="is-xrpl-private">
            <h4>Is XRPL a private blockchain, owned by Ripple?</h4>
            <p>No, the XRP Ledger is a decentralized, public blockchain. Any changes that would impact transaction processing or consensus need to be approved by at least 80% of the network. Ripple is a contributor to the network, but its rights are the same as those of other contributors. In terms of validation, there are 150+ validators on the network with 35+ on the default Unique Node List (see <a href="#what-are-unique-node-lists-unls">"What are Unique Node Lists (UNLs)?" below</a>) — Ripple runs <a href="https://foundation.xrpl.org/2023/03/23/unl-update-march-2023/">only 1</a> of these nodes.</p>
          </div>

          <div className="q-wrapper" id="proof-of-work">
            <h4>Isn't Proof of Work the best validation mechanism?</h4>
            <p>Proof of Work (PoW) was the first mechanism to solve the double spend problem without requiring a trusted 3rd party. <a href="../docs/concepts/consensus-protocol/index.md">The XRP Ledger's consensus mechanism</a> solves the same problem in a far faster, cheaper and more energy efficient way.</p>
          </div>

          <div className="q-wrapper" id="other-currencies">
            <h4>Can currencies other than XRP be traded through XRPL?</h4>
            <p>Yes, the XRP Ledger was built specifically to be able to tokenize arbitrary assets, such as USD, EUR, Oil, Gold, reward points, and more. Any currency can be issued on the XRP Ledger. This is illustrated by XRPL's growing community that backs a variety of fiat and crypto tokens.</p>
          </div>

          <div className="q-wrapper" id="only-payments">
            <h4>Isn't XRPL only for payments?</h4>
            <p>Although XRPL was initially developed for payment use cases, both the ledger and its native digital asset XRP are increasingly popular for a range of innovative blockchain use cases such as NFTs. New standards proposals for an automated market maker (AMM), hooks amendment for smart contract functionality, and cross-chain bridges are all currently works in progress.</p>
          </div>

          <h2>Validators and Unique Node Lists</h2>

          <div className="q-wrapper" id="validator-service">
            <h4>What service do transaction validators provide?</h4>
            <p>All nodes ensure that transactions meet protocol requirements, and are therefore "valid." The service that validators uniquely provide is administratively grouping transactions into ordered units, agreeing on one such ordering specifically to prevent double spending.</p>
            <p>See <a href="../docs/concepts/consensus-protocol/index.md">Consensus</a> for more information about the consensus process.</p>
          </div>

          <div className="q-wrapper" id="validator-cost">
            <h4>How much does it cost to run a validator?</h4>
            <p>Running a validator does not require any fees or XRP. It is comparable in cost to running an email server in terms of its electricity use.</p>
          </div>

          <div className="q-wrapper" id="what-are-unique-node-lists-unls">
            <h4>What are Unique Node Lists (UNLs)?</h4>
            <p>UNLs are the lists of validators a given participant believes will not conspire to defraud them. Each server operator can choose their own UNL, usually based on a default set provided by a trusted publisher. (A default set from a publisher is sometimes called a default UNL, or <em>dUNL</em>.)</p>
          </div>

          <div className="q-wrapper" id="which-unl">
            <h4>Which UNL should I select?</h4>
            <p>Since anybody can run a validator, the burden is on the network participants to choose a reliable set. Currently, the XRP Ledger Foundation and Ripple are known to publish recommended default lists of high quality validators, based on past performance, proven identities, and responsible IT policies. However, every network participant can choose which validators it chooses as reliable and need not follow one of the publishers noted above.</p>
          </div>

          <div className="q-wrapper" id="ripple-unl-centralization">
            <h4>If Ripple recommends adoption of its UNL, doesn't that create a centralized system?</h4>
            <p>No. The XRP Ledger network is opt-in. Each participant directly or indirectly chooses its UNL. If Ripple stops operating or acts maliciously, participants can change their UNLs to use a list from a different publisher.</p>
          </div>

          <div className="q-wrapper" id="validator-incentives">
            <h4>What is the incentive structure for validators?</h4>
            <p>The primary incentive to run a validator is to preserve and protect the stable operation and sensible evolution of the network. It is the validators who decide the evolution of the XRP Ledger, so any business that uses or depends on the XRP Ledger has an inherent incentive to ensure the reliability, and stability of the network. Validators also earn the respect and goodwill of the community by contributing this way.</p>
            <p>If you run an XRP Ledger server to participate in the network, the additional cost and effort to run a validator is minimal. This means that additional incentives, such as the mining rewards in Bitcoin, are not necessary. Ripple avoids paying XRP as a reward for operating a validator so that such incentives do not warp the behavior of validators.</p>
            <p>For examples of how incentives can warp validation behavior, read about <a href="https://arxiv.org/abs/1904.05234">miner extractable value (MEV)</a>.</p>
          </div>

          <div className="q-wrapper" id="institutional-validators">
            <h4>Can financial institutions set up transaction validators to help them meet specific institutional standards and requirements?</h4>
            <p>No, institutions cannot set up customized validator policies for choosing to allow some transactions and reject others. Validators either follow the protocol, or they do not. If software does not follow protocol rules, it does not function. Thus, it is not recommended that institutions seek out custom implementations without in-house expertise.</p>
          </div>

          <div className="q-wrapper" id="network-disagreement">
            <h4>What happens if more than 20% of nodes within the network do not agree with the majority? How is the final version of the ledger chosen?</h4>
            <p>Normally, if there is a dispute about the validity of one transaction, that transaction gets pushed back until the majority can come to an agreement. But if more than 20% of the network did not follow the same protocol rules as the majority, the network would temporarily halt. It could resume when participants reconfigure their UNLs based on those who want to reach consensus with each other. This temporary processing delay is desired rather than double spending.</p>
            <p>In the process of determining the authoritative version of a ledger, there may be multiple temporary internal versions. Such internal versions naturally happen in distributed systems because not all nodes receive transactions in the same order. The analogous behavior in Bitcoin is where two servers each see a different longest chain because two blocks were mined at about the same time.</p>
            <p>However, there can be only one latest <em>validated</em> ledger version at any given time; other versions are irrelevant and harmless.</p>
            <p>For more information about how the XRP Ledger's consensus mechanism behaves in adverse situations, see <a href="../docs/concepts/consensus-protocol/consensus-protections.md">Consensus Protections Against Attacks and Failure Modes</a>.</p>
          </div>

          <div className="q-wrapper" id="adding-validators">
            <h4>Does the XRP Ledger have a formal process for adding validators?</h4>
            <p>No, a formal process for adding validators is not compatible with the XRP Ledger, because it is a system with no central authority.</p>
            <p>Publishers of individual default UNLs set their own policies for when to add or remove validators from their lists of recommendations.</p>
            <p>For recommendations and best practices, see <a href="../docs/infrastructure/configuration/server-modes/run-rippled-as-a-validator.md">Run `rippled` as a Validator</a>.</p>
          </div>

          <div className="q-wrapper" id="dunl-centralization">
            <h4>If the dUNL has the most influence on the network, then is the XRPL centralized?</h4>
            <p>Validators can choose to not use the dUNL, or any widely-used UNL for that matter. Anyone can create a new UNL at any time.</p>
            <p>There can be multiple UNLs in use on the same network. Each operator can customize their server's own UNL or choose to follow a different recommended list. All these servers can still run the same chain and reach consensus with one another.</p>
            <p>However, if your UNL does not have enough overlap with the UNLs used by others, there is a risk that your server forks away from the rest of the network. As long as your UNL has less than 90% overlap with the one used by people you're transacting with, you are completely safe from forking. If you have less overlap, you may still be able to follow the same chain, but the chances of forking increase with lower overlap, worse network connectivity, and the presence of unreliable or malicious validators on your UNL.</p>
          </div>

          <h2>Role of XRP</h2>

          <div className="q-wrapper" id="xrp-purpose">
            <h4>What purpose does XRP serve?</h4>
            <p>XRP was created as the XRP Ledger's native asset to empower a new generation of digital payments—faster, greener, and cheaper than any previous digital asset. It also serves to protect the ledger from spam, and to <a href="../docs/concepts/tokens/decentralized-exchange/autobridging.md">bridge currencies</a> in the XRP Ledger's decentralized exchange, when doing so is beneficial to users. Over time, the XRP Ledger community has pioneered new <a href="/about/uses">use cases</a> for XRP as well as the XRP Ledger itself.</p>
          </div>

          <div className="q-wrapper" id="transaction-floods">
            <h4>How does the XRP Ledger respond to transaction floods?</h4>
            <p>The XRP Ledger is designed to set the <a href="../docs/concepts/transactions/transaction-cost.md">transaction cost</a> dynamically based on demand as an anti-spam measure. The impact of any potential XRP manipulation is minimized by increases in network size as the market cap and transaction volume increase.</p>
          </div>

          <div className="q-wrapper" id="money-laundering">
            <h4>What about money laundering and suspicious economic activity?</h4>
            <p>The XRP Ledger network is an open network, and all transactions are publicly visible.</p>
            <p>Ripple is committed to monitoring and reporting any AML flags across the XRP Ledger network, as well as reporting suspicious activity to FinCEN as applicable.</p>
            <p><a href="https://xrplorer.com/">XRP Forensics / xrplorer</a> maintains an advisory list to track and minimize money laundering, scams, fraud, and illicit use of the XRP Ledger. Exchanges and other service providers can use this service to prevent and react to financial crimes.</p>
          </div>

          <h2>Security Concerns</h2>

          <div className="q-wrapper" id="code-review">
            <h4>What is the process for reviewing third-party code contributions?</h4>
            <p>The code contribution process starts with a developer opening a <a href="https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests">pull request</a> to a source code repository such as the <a href="https://github.com/xrplf/rippled/"><code>rippled</code> repository</a>, which contains Ripple's reference implementation of the core XRP Ledger server and protocol.</p>
            <p>This pull request triggers automated unit and integration tests, as well as code reviews by several developers who, typically, have significant expertise in the area of code that the pull request affects.</p>
            <p>Once the pull request passes automated tests and receives approvals from reviewers, a trusted <a href="https://opensource.guide/best-practices/">maintainer of the repo</a> can stage it for inclusion in the next beta.</p>
          </div>

          <div className="q-wrapper" id="ripple-control">
            <h4>Does Ripple own or control the XRP Ledger or XRP Ledger network?</h4>
            <p>No, Ripple does not own or control the XRP Ledger or XRP Ledger network.</p>
            <p>Ripple contributes to a reference implementation of the core XRP Ledger server (<a href="https://github.com/xrplf/rippled"><code>rippled</code></a>) and employs a team of engineers who contribute to the open-source codebase. Ripple periodically publishes pre-compiled binary packages of the software for convenience. Anyone can <a href="../docs/infrastructure/installation/index.md">download and compile the software from source</a>.</p>
            <p>Several entities publish recommended validator lists (UNLs). As of July 2023, Ripple runs only 1 of the 35 validators in the default UNL.</p>
          </div>

          <div className="q-wrapper" id="codebase-separation">
            <h4>Does the XRP Ledger distinguish between the codebase for validation and the one for user software?</h4>
            <p>Yes. There are several <a href="../docs/references/client-libraries.md">XRP Ledger client libraries</a> which are intended for user software developers. These libraries have different codebases and repositories from the <a href="../docs/concepts/networks-and-servers/index.md">core XRP Ledger server</a> which powers the network and validates transactions.</p>
          </div>
        </article>
      </div>
    </div>
  );
};

export default FAQ; 