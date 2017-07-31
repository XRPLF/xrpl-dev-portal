In the XRP Ledger, financial institutions typically use multiple XRP Ledger addresses to minimize the risk associated with a compromised secret key. Ripple strongly recommends the following separation of roles:

* One **issuing address**, also known as a "cold wallet." This address is the hub of the financial institution's accounting relationships in the ledger, but sends as few transactions as possible. <!-- STYLE_OVERRIDE: cold wallet, wallet -->
* One or more **operational addresses**, also known as "hot wallets." Automated, internet-connected systems use the secret keys to these addresses to conduct day-to-day business like transfers to customers and partners. <!-- STYLE_OVERRIDE: hot wallet, wallet -->
* Optional **standby addresses**, also known as "warm wallets." Trusted human operators use these addresses to transfer money to the operational addresses. <!-- STYLE_OVERRIDE: warm wallet, wallet -->
