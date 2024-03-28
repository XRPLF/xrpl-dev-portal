---
category: 2014
date: 2014-08-01
labels:
    - Development
theme:
    markdown:
        editPage:
            hide: true
author: Rome Reginelli
---
# Dev Portal Adds rippled APIs

Today, the [Ripple Dev Portal](https://developers.ripple.com/) gets a big boost of content and usability. The new additions to our development portal include thorough and tested documentation of all the public API methods for our core server software, ‘rippled’, alongside a host of improvements in styling and formatting, as well as new introductory material to give you direction in navigating the sea of Ripple technology.

This update brings very crucial content into the fold of documentation that's thorough, complete, and software-tested. Today, you can access [full specs and usage information for all 20+ public methods in the rippled WebSocket API](https://developers.ripple.com/rippled-api.html).

<!-- BREAK -->

Just how much did we change this time? Let's have a look at what an arbitrary API calls looks like in the old and new formats:

**Before:**

[![Old documentation screenshot](https://cdn.ripple.com/wp-content/uploads/2014/08/Screen-Shot-2014-08-01-at-2.45.28-PM.png)](https://cdn.ripple.com/wp-content/uploads/2014/08/Screen-Shot-2014-08-01-at-2.45.28-PM.png)


**After:**

[![New documentation screenshot](https://cdn.ripple.com/wp-content/uploads/2014/08/Screen-Shot-2014-08-01-at-2.47.50-PM1.png)](https://cdn.ripple.com/wp-content/uploads/2014/08/Screen-Shot-2014-08-01-at-2.47.50-PM1.png)


You can see just from the size of the screenshots how much more information our new documentation brings to the table. We’ve standardized the structure of every method reference, and simplified the descriptions of what each one does. All the parameters in the request are listed and explained; so are all the fields in the response. Tested, complete examples are provided for both request and response in every method. Details have been checked against running instances and the source code, and the entire document has been proof-read multiple times by different experts. All the new examples scroll separately so they don’t overflow the layout. (Tip: You can expand any example to its full vertical size by double-clicking it. Careful: some of them are <i>long.</i>) To top it off, there's brand-new introductory material, ranging from why to run a server to how to select the right tool for the job.

While this is a big step forward for the Developer Portal, you should be aware of a few existing gaps in our content coverage which will be resolved shortly. For starters, most of the Websocket API's admin methods aren't covered. For those, you'll still have to refer back to the old wiki documentation. Possible error messages aren't included in the method reference, either. Although every method has an example in WebSocket format, most methods don't have a corresponding example in JSON-RPC syntax yet. Most importantly, this still covers only one piece of the software that Ripple Labs is creating: great pieces of software like [ripple-lib](https://github.com/ripple/ripple-lib) and the [Blobvault](https://github.com/ripple/ripple-blobvault) aren't on the Dev Portal yet. Rest assured, we're working on it.

The good news is, we don't have to go it alone. Following Ripple's company ethos of being inclusive and open, we've got the source for the Dev Portal [available on GitHub](https://github.com/ripple/ripple-dev-portal) for anyone to download and view. If you catch a mistake—let us know with an [issue](https://github.com/ripple/ripple-dev-portal/issues), and we'll take a look. Better yet, fork the repo, fix it yourself, and send us a pull request. We love community contributions, and we'd love to work your changes into the official site.

For all those of you who are following the Ripple protocol and building apps already, thank you. We're hard at work to make your jobs easier. For all those of you who haven't started yet: why not? Now's a better time than ever.
