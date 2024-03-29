---
category: 2017
labels:
    - Features
date: 2017-07-19
theme:
    markdown:
        editPage:
            hide: true
author: Nik Bougalis
---
# Protecting the Ledger: Invariant Checking

At Ripple, we have been developing next-generation financial infrastructure with an eye towards making value move as fast and as efficiently as information does today.

But we are also keenly aware of the need for value to also move securely and reliably, so we place heavy emphasis on writing solid, secure and robust code. Our singular focus on code quality is the reason that the Ripple network experienced no service outages through 2016 or, so far, in 2017.

With the release of rippled 0.70.0, and as part of our long-standing and enduring commitment to a reliable and error-free XRP Ledger, we are going further than before. We are adding code that runs automatically and in real time after each transaction completes, and examines the changes it made for correctness before the results are committed to the ledger.

This is the idea behind the [recently activated](https://xrpcharts.ripple.com/#/transactions/17593B03F7D3283966F3C0ACAF4984F26E9D884C9A202097DAED0523908E76C6) [EnforceInvariants amendment](https://ripple.com/build/amendments/#enforceinvariants), which will make it possible to verify that key properties of the system are not violated. The new checks—which we believe will never trigger—help protect the integrity of the XRP Ledger from bugs yet to be discovered, or even created.

What’s more, the process is transparent and public: problematic transactions are marked with a **tecINVARIANT_FAILED** result code and are included in the ledger. This broad exposure, coupled with Ripple’s powerful ability to step through the execution of past transactions, makes it possible to quickly identify and fix any logic flaws in the code.

One key property of the invariant checking functions is that they are simple: each check only does one thing and is easy to read and understand. This means that it is trivial to verify the correctness of the implementation by inspection—an important consideration in any security critical code.

Our existing software development and quality assurance process places heavy emphasis on correctness and security. Over the past five years, we've honed this process to cover the entire software development lifecycle. Some of the systems we've put in place include:

- Extensive unit tests, with tests as a requirement to merge any new code
- Regular use of tools to objectively assess the quality of the codebase
- A rigorous and public review process by Ripple’s world-class team of developers and third-party contributors
- Regular security audits by subject matter experts from the crypto, fintech and C++ communities.

The new invariant checking sits atop and enhances our existing process by extending real-time protection to the XRP Ledger to help ensure its long-term health and security.

As we continue to improve the XRP Ledger by adding new features and by further improving performance, we will also work to refine our process to help ensure that the financial infrastructure of the future will not only be fast, but also robust and secure.
