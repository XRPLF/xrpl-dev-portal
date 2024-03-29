---
labels:
    - Features
    - Security
category: 2019
date: 2019-04-05
theme:
    markdown:
        editPage:
            hide: true
author: Nik Bougalis
---
# Protecting the Ledger: Secure Development Practices

The primary mission of the C++ team at Ripple is to contribute to `rippled`, the reference implementation of the protocol that underpins the XRP Ledger. The codebase—which is now over 6 years old—has contributions from over 100 developers from all over the world.

As a team, our primary focus is on ensuring that the codebase is solid, that the code is robust and that it is well-suited to be the core of the next-generation of financial infrastructure, one which allows value to not only move as fast and as efficiently as information does today, but to move securely as well.

In an [earlier blog post](https://developers.ripple.com/blog/2017/invariant-checking.html), I noted that our existing software development and quality assurance process—honed over several years—places heavy emphasis on correctness and security. I highlighted our use of automated tests and specialized tooling (such as static analyzers) but I also alluded to the human element as well: our rigorous and public code reviews and regular security audits of the codebase by specialists. I’d like to take the opportunity to discuss those practices in greater detail.

<!-- BREAK -->

## Security Audits

Security reviews are an important component of any security development playbook. Unlike a simple code review, which typically focuses only on changes to the code, security reviews involve a deep and thorough analysis of the codebase with the intent of discovering latent bugs.

Such audits can take several weeks to plan and several months to complete. On average, we’ve completed almost one security review every two years, although not every review covers every section of the codebase.

In broad terms, previous audits have not identified any serious issues with the codebase, although some low severity, like resource leaks, were discovered and [fixed](https://github.com/ripple/rippled/commit/b5dbd7942f8896367e65cbc8f58e9bfbce81d953); furthermore, as a result of these audits we added [enhanced warnings about brain-wallets](https://github.com/ripple/rippled/commit/ab8102f927e7db5fee19b453206249f446ab9c70) and deployed [secure memory zeroization](https://github.com/ripple/rippled/commit/39f91351046bdff30b153f8442b562a3abe0ac82) more broadly throughout the codebase. Overall, however, the consensus has been that the software is “well-written and designed” and that the developers have “taken time to carefully consider the implementation.”

In 2018 we engaged with [Guido Vranken](https://twitter.com/guidovranken), a renowned security analyst, who spent several months examining the code base. His excellent and well-researched reports helped us to improve handling of [malformed](https://github.com/ripple/rippled/commit/ea76103d5f522ae3ce4b27155e194faab99e379e) or [incorrect](https://github.com/ripple/rippled/commit/ba9ca1378e0c93c448ab7f73e3246959aaa67783) input data and improve the overall quality and robustness of the code in the face of malicious user input. Guido also supplied us with a suite of tools that we will integrate into our CI/CD process, that will help us to detect a broader set of errors in an automated fashion.

During 2019, we are going to continue engaging with experts like Guido and leading security consulting firms as we work to conduct a thorough and comprehensive assessment of the codebase. Unlike previous assessments which were not made public, we intend to request that the reviewers publicly release their analysis as part of our commitment to transparency and quality.

## Bounty Hunters

Of course, there are plenty of hugely talented individuals who don’t work for a large, established firm and who, unlike Guido, may not be well-known in this space. Perhaps they’re freelancing, analyzing open source software for bugs in their free time or just starting out. Maybe they just stumbled on a bug in the process of evaluating the codebase. Regardless, it makes sense to engage with them as well and to reward them for their efforts. That’s where [Ripple’s Bug Bounty program](https://ripple.com/bug-bounty/) comes into play.

Bug bounty programs must, at first, have seemed an odd practice. After all, why pay strangers to break code? Over time, however, they have proven invaluable, by incentivizing and encouraging responsible disclosure and have become an integral part of any vulnerability management program. At Ripple, our program has been in place for several years already and it has attracted individuals of the highest caliber who have carefully analyzed the code and produced highly detailed bug reports. In fact, during 2018 we paid over $50,000 in bug bounties.

## Improved Threat Models & Processes

Threat models are another important part of secure software development lifecycle because they help identify categories of threats, allowing countermeasures or other protections to be designed and developed. Throughout 2018 we sought to improve not only the codebase directly, but to review and update our threat models and our internal processes as well, something which we will continue to do during 2019.

Going forward, we will expand our use of high-quality third-party libraries, such as [Beast](https://www.boost.org/doc/libs/1_69_0/libs/beast/doc/html/beast/introduction.html) (itself a part of the excellent collection of [Boost](https://www.boost.org/) libraries) and also seek to leverage new C++ features that can help us write simpler and more expressive code.

This reduction in the amount of code and custom functionality will result in a “leaner” and more compact codebase, which will help us expand our use of static and dynamic analysis tools. Together with the improvements in our automated testing and CI/CD processes we will be able to catch more errors, especially those that are typically found in user-accessible API endpoints, before the code is merged.

The net result of these changes will be better, safer code and a reduction in the overall [attack surface](https://en.wikipedia.org/wiki/Attack_surface) of rippled.

## Always Improving

Despite all the improvements made, we know that there’s more that we could be doing. We look forward to working together with the community of XRP Ledger developers and hope that we can exchange ideas that will help to improve the quality of the codebase and advance our shared goal of building a system that allows value to move both securely and quickly, helping to bring about the Internet of Value.

_Contact Nik: <nikb@ripple.com>_ <br />
_Follow Nik on Twitter: [@nbougalis](https://twitter.com/nbougalis)_
