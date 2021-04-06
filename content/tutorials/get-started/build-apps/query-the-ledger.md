---
html: query-the-ledger.html
funnel: Build
doc_type: Tutorials
category: Get Started
subcategory: Build Apps
blurb: Learn how to query the ledger.
cta_text: Build Apps
filters:
    - interactive_steps
    - include_code
---

# Query the Ledger

You can query the XRP Ledger to get information about [a specific account](account-methods.html), [a 
specific transaction](tx.html), the state of a [current or a historical ledger](ledger-methods.html), and 
[the XRP Ledger's decentralized exhange](path-and-order-book-methods.html). You need to make these queries, 
among other reasons, to look up account info to follow best practices for [reliable transaction submission]
(reliable-transaction-submission.html).  

Here, we'll use `xrpl-py`'s [`xrpl.account`](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.account.
html) module to look up information about the [wallet we generated](#2-generate-wallet) in the previous step.


{{ include_code("_code-samples/xrpl-py/get-acct-info.py", start_with="# Look up info about your account", 
language="py")  }}
