---
category: 2017
labels:
    - Security
date: 2017-01-12
theme:
    markdown:
        editPage:
            hide: true
---
# Response to China CERT Report

As a leader in open-source, distributed financial technology, Ripple recognizes the importance of security researchers and we always encourage responsible disclosure of potential security vulnerabilities via our [bug bounty program](https://ripple.com/bug-bounty/). Ripple also employs regular external security audits and, as a matter of practice, the maintainers of the Ripple Consensus Ledger (RCL) technology (`rippled`) routinely use static and dynamic analysis tools on the C++ codebase (most recently version 0.50.0-b1).

The results of the last internal static analyzer run determined that the defect rate of rippled was below the threshold that is typical for open source projects. To date, there have been no critical vulnerabilities discovered through static and dynamic analysis of the rippled C++ codebase, and the issues that have been found have been false-positives. In addition to using automated scanning tools, manual reviews of the code by multiple engineers have failed to identify a single vulnerability and the minor issues that have been discovered have long been fixed.

Further, a recent independent security audit conducted by the NCC Group, a global security risk mitigation firm, revealed no serious security vulnerabilities, and found rippled “to be well-written and designed” before adding that it was clear that Ripple “has taken time to carefully consider the implementation.”

In a recent [blockchain security report](http://if.cert.org.cn/res/web_file/bug_analyze_report.pdf) _(dead link)_, China CERT claimed that software related to Ripple’s open-sourced, distributed ledger technology has “230 high-risk security vulnerabilities.” Unfortunately, since the researchers behind the report did not demonstrate responsible disclosure by contacting Ripple prior to publication, we do not know what testing methodology or techniques were used nor which code repositories were tested. As a result, we were forced to investigate the claims being made after the fact, with no guidance from the security researchers and very little context.

From what we can determine, the methodology appears to have been strictly limited to automated analysis tools run over a mixture of both security critical code and code that has no security implications whatsoever. The quantitative results were determined by the number of possible vulnerabilities identified by the tool and the possible severity of actual vulnerabilities in that class. (<i>for example, any code that might have a buffer overflow would be identified as high risk, because if there actually is a buffer overflow issue and the code is actually security relevant, that could cause a significant compromise</i>).

Automated analysis tools typically have extremely high false positive rates of about 99%. When projects that already use this same methodology are tested in this way, the false positive rate nears 100% since all actual vulnerabilities that could be found in this way already have been found.

Again, Ripple recognizes the importance of security researchers, and we take any reports of security vulnerabilities very seriously. At this time, we do not feel confident in the accuracy of the CERT report. Furthermore, based on the way in which the report was published, we question the legitimacy of the reporting body. We are confident in our processes and our codebase, and expressly state that this report identifies no actionable items and our review, in response to it, found none either.

We will continue to promptly and vigorously investigate all reports of security vulnerabilities, and urge anyone who thinks they have identified such a vulnerability to responsibly disclose it to us via our [bug bounty program](https://ripple.com/bug-bounty/).
