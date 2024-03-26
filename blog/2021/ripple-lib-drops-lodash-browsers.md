---
category: 2021
theme:
    markdown:
        editPage:
            hide: true
date: 2021-08-26
labels:
    - xrpl.js Release Notes
---
# ripple-lib Drops Lodash Requirement in Browsers

[Version 1.10.0](https://github.com/ripple/ripple-lib/releases/tag/1.10.0) of ripple-lib, the JavaScript/TypeScript library for the XRP Ledger, no longer requires a separate Lodash script to run in web browsers. This change comes alongside other continued improvements in the library, improving the experience of developing applications on the XRP Ledger.

<!-- BREAK -->

## Update Your Script Tags

Starting with 1.10.0, ripple-lib incorporates Lodash into the browser-ready JavaScript build, so you can import just the library and get a working environment. Previously, you needed a separate script tag to import the Lodash dependency in web browsers.

**Before:**

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js"></script>
<script src="https://unpkg.com/ripple-lib@1.9.8/build/ripple-latest-min.js"></script>
```

**After:**

```html
<script src="https://unpkg.com/ripple-lib@1.10.0/build/ripple-latest-min.js"></script>
```

**Tip:** You can safely update ripple-lib to 1.10.0 even if you haven't removed the Lodash script tag. The extra script tag is now an unnecessary extra download for most cases, but it doesn't cause errors if it's still there.

## Same Process on Node.js

There is no change to how dependencies are managed when using ripple-lib in Node.js.

## Other Changes

As always, version 1.10.0 includes various minor improvements to fix bugs and improve documentation. There's also a new API method to call the [Testnet (or Devnet) faucet](https://xrpl.org/xrp-testnet-faucet.html) to get a new account pre-funded with test XRP. This method automatically selects the appropriate faucet based on which network you're already connected to. (It raises an error if you're connected to the Mainnet!)

Example usage:

```js
const ripple = require('ripple-lib') // Node.js only. Use a <script> tag in browsers
async function main() {
    const api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
  await api.connect()
  const data = await api.generateFaucetWallet()
  console.log(data)
  // {
  //   account: {
  //     xAddress: 'TVH9dJMaXuuTzxgWCqn9PvKdu65Uxij1mS1spgTJ2QkshXg',
  //     secret: 's████████████████████████████',
  //     classicAddress: 'rGyvpAdjkg7EwJdNY8K2GvvEzeNJ8hfHZU',
  //     address: 'rGyvpAdjkg7EwJdNY8K2GvvEzeNJ8hfHZU'
  //   },
  //   amount: 1000,
  //   balance: 1000
  // }

  api.disconnect()
}
main()
```

## Looking Forward: xrpl.js

The developers of ripple-lib are targeting version 2.0 as a major update containing breaking changes. One of the changes will be renaming the library to **xrpl.js**. The name ripple-lib dates back to [the beginning](https://xrpl.org/history.html), and it's long overdue to rename the library in keeping with the evolution of the XRP Ledger as a network and a community.

There is no set schedule for this update, but it's likely to release sometime in Q3 of this year. Stay tuned for more updates on the changes to make xrpl.js version 2.0 a better and more consistent experience for developers, or [follow the development process](https://github.com/ripple/ripple-lib/pulls?q=is%3Apr+label%3A%22ripple-lib+2.0+%28xrpl.js%29%22) and add your voice to the community.
