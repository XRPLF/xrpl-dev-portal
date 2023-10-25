# Interactive Tutorials

The site has code to aid development of interactive tutorials that connect to the live XRP Ledger (Mainnet, Testnet, or Devnet). This document explains how to use that code to create an interactive tutorial.

## Limitations

Interactive Tutorials are intended to demonstrate interactivity with the XRP Ledger from in-browser code. They have some limitations and requirements, as follows:

- The actual code that runs in the interactive tutorial is JavaScript, because web browsers don't run other programming languages natively. Also, you can't use JavaScript functionality that's native to Node.js but not web browsers, such as `require("module")`. (Sometimes there are "shims" that imitate the Node.js behavior in the browser for these sorts of things, but that's more work.)

    - You _can_ still provide examples of the equivalent code in other programming languages. The actual code that runs has some differences than your example JavaScript code anyway because the actual code has to interact with the interactive tutorial's user interface: buttons, HTML outputs, etc.

- The functionality you want to demonstrate has to be available on a public ledger and from the public API, whether that's Mainnet, Testnet, or Devnet. You can't make interactives for features that aren't enabled on a test network, or that require admin permissions.

- If the tutorial involves sending transactions, you need to use a test network and probably the faucet to get credentials. You should not try to send Mainnet transactions because that would require a secret key that holds actual, valuable XRP.

- If the tutorial requires certain objects to exist in the ledger (other than an account you can get from the Testnet faucet) you should either set those objects up on Mainnet in such a way that they'll never get removed, or be prepared to re-create them on the test network.

- As a best practice, don't call the faucet unless the user interacts with the page by clicking a button or something. Otherwise, web crawlers and things just loading the page end up draining the faucet pretty quickly.

## Memos

Transactions sent from interactive tutorials automatically attach a memo indicating what button of which tutorial sent the memo. Anyone who is watching Testnet/Devnet transactions can look for these memos to see when people are using the tutorials.

The memo is identified by a `MemoType` that decodes to the URL of this document:

```
MemoType (hex):
68747470733A2F2F6769746875622E636F6D2F5852504C462F7872706C2D6465762D706F7274616C2F626C6F622F6D61737465722F746F6F6C2F494E5445524143544956455F5455544F5249414C535F524541444D452E6D64

MemoType (ASCII-decoded):
https://github.com/XRPLF/xrpl-dev-portal/blob/master/tool/INTERACTIVE_TUTORIALS_README.md
```

The memo has a `MemoFormat` value of `6170706C69636174696F6E2F6A736F6E` (hex), which represents the MIME type `application/json`.

The memo has a `MemoData` field which is ASCII-encoded JSON containing the following data:

| Field | Type | Contents |
|---|---|---|
| `path` | String | The `window.location.pathname` of the tutorial. For example, `/send-xrp.html`. |
| `button` | String | The unique html ID of the button that triggered this transaction. For example, `submit-button`. |
| `step` | String (Number) | The step number that contained the button to trigger this transaction. For example, `"1"`. The first interactive block is step 1 (they are not 0-indexed). |
| `totalsteps` | String (Number) | The total number of interactive blocks in the tutorial that triggered this transaction. Not all steps of an interactive tutorial involve sending transactions, but all steps are counted. |

For privacy reasons, the memo does not and MUST NOT include personally identifying information about the user or their browser.

**Note:** The interactive tutorial code assumes that the path and ID are both possible to encode with plain ASCII, so please avoid using non-ASCII characters in the IDs and filenames.

## Recommended Process

An interactive tutorial is a page, so you add it to the `dactyl-config.yml` page like any other page. However, you need to add the following pieces to make the interactive stuff work:

1. Set page properties, either in the config file or the page's frontmatter. The `interactive_steps` Dactyl filter gives you access to the functions you use to demarcate the interactive bits in your markdown file. Most of the time, you'll also want to include xrpl.js and its dependencies as well; you can have the templates handle that for you by setting the field `embed_xrpl_js: true`. For example:

        html: use-tickets.html
        parent: manage-account-settings.html
        blurb: Use Tickets to send a transaction outside of normal Sequence order.
        embed_xrpl_js: true
        filters:
            - interactive_steps

    Including the `interactive_steps` filter automatically causes the templates to load the [interactive-tutorial.js](../static/js/interactive-tutorial.js) file on that page. This JavaScript file implements much of the functionality for interactive tutorials, and provides helper functions for a lot of other common things you might want to do.

2. For the tutorial, you're going to create (at least) two JavaScript files:

    - **Example Code:** The example code that you'll display on the page. You want to make sure it actually runs correctly as shown to the user, after all. You should start by making this one. You should save this file as `content/_code-samples/{YOUR TUTORIAL}/{YOUR TUTORIAL}.js`.
    - **Interactive Code:** A modified version of the same code that will actually run, and also interact with the user interface in the browser itself. You should adapt this one from the other version after you get the other one working. While working on this version, remember to backport any changes that are also applicable to the example code version. You should save this file as `static/js/tutorials/{YOUR_TUTORIAL}.js`.

3. Start working on the Example Code file first.

    Rather than starting with empty example code, you copy and adapt one of the existing code samples, such as [Send XRP](../content/_code-samples/send-xrp/). For this, you can just open the `demo.html` directly in your browser and use the developer console; you can see your changes immediately after refreshing the page.

4. When you have working sample code, break it down into logical steps. Then, write the actual prose of the tutorial, with descriptions of each step.

    Use excerpts of the example code to demonstrate each step. You can gloss over certain parts of the sample code if they're tangential to the goal of the tutorial, like the nitty-gritty of getting credentials from the Testnet faucet.

    This is where `include_code` comes in really handy. You can pull in just an excerpt of a code sample based on starting and ending bits. For example:

        {{ include_code("_code-samples/send-xrp/send-xrp.js",
           start_with="// Connect", end_before="// Get credentials",
           language="js") }}

    Both `start_with` and `end_before` are optional; if you omit them, it'll all the way from the start of the file to the end. Alternatively, you can include specific lines of the file as described in the [Dactyl Include Code page](https://dactyl.link/extending-include_code.html). If you combine `start_with` and `lines` the line numbers will be renumbered based on the specified starting point.

    The samples have any extra whitespace trimmed off the very beginning and end of the excerpt, but not from any lines in the middle. The `language` tag is optional but recommended so that syntax highlighting works properly.

5. Figure out what an interactive version of the tutorial looks like and where the user might interact with key steps.

    Understanding [Bootstrap forms code](https://getbootstrap.com/docs/4.0/components/forms/) and [jQuery](https://api.jquery.com/) will help you get a better sense of what's more or less feasible to do. For some tutorials, the only user interaction may be clicking a button and looking at some output in each step. Giving the user some choices and freedom adds a bit of "wow" factor and can also be more educational because users can try it again and see how things turn out differently.

    Just keep in mind, you're not building an entire app, you're just providing a demo.

6. Write the interactive code, embedding interactive blocks in each step of the tutorial near the code samples that do roughly the same thing.


## How to Use the Interactive Bits

To run your custom interactive code on your tutorial page, add a script tag to the Markdown content of the page you're writing. Conventionally, this can be under the "Prerequisites" heading of the tutorial, but it's mostly invisible to the user so it can go almost anywhere. For example:

```html
<!-- Source for this specific tutorial's interactive bits: -->
<script type="application/javascript" src="static/js/tutorials/use-tickets.js"></script>
```

When you want to test changes to this code, you need a Dactyl-built version of the page. You can build just a single page using the following syntax, which also copies your updated version of the `static/` JS to the out folder:

```sh
dactyl_build --only your-page.html
```

### Starting Snippets

There are also snippets that handle some of the most generic and repeated parts of the tutorials.

For many tutorials, the first two steps are going to be "Connect to the Testnet" and "Get Credentials". The snippets for these are:

```jinja2
{% include '_snippets/interactive-tutorials/generate-step.md' %}
{% include '_snippets/interactive-tutorials/connect-step.md' %}
```

If you need to connect to Devnet or Mainnet, set the `use_network` Jinja variable _before_ including either of these snippets, for example in the "Prerequisites section". The code looks like this (case-sensitive!):

```jinja2
{% set use_network = "Devnet" %}
```


### Interactive Blocks

In your Markdown file, you'll use Jinja syntax to mark the start and end of the interactive code sections. By convention, it looks like this, though all the HTML is optional:

```jinja2
{{ start_step("Step Name") }}
<button id="your-button-id" class="btn btn-primary previous-steps-required">Click this button</button>
<div class="loader collapse"><img class="throbber" src="static/img/xrp-loader-96.png"> Doing stuff...</div>
<div class="output-area"></div>
{{ end_step() }}
```

Things you'll want to customize for each section:

- Each step name (`Step Name` in this example) must be unique within the page. It's used in the interactive tutorial breadcrumbs, so it's best if it's short (one or two words). The names `Connect` and `Generate` are taken by their respective snippets.
- The button can have whatever message you want on it (like `Click this button`).
    - The class `previous-steps-required` causes the button to be disabled until the previous step in the tutorial has been marked as complete, and provides a tooltip on the disabled button while it's disabled.
    - You can instead use the class `connection-required`; this allows the user to do this step at any time as long as they're already connected to the ledger, so they can skip ahead to this step. Don't use both that and `previous-steps-required` on the same button.
- Usually you want to give each button a unique ID (like `your-button-id`). This is how you refer to the button in your JavaScript code.
- The loading message (`Doing stuff...`) is hidden by default (that's what the `collapse` class does) but you can show it when you start something that might take a while, like querying or sending a network request, and then hide it again when the thing is done.
- The empty output-area div is where you'll write the results of doing whatever the step does. By convention, you shouldn't put anything in it since most of the example functions wipe its contents as the first thing they do.
- You can put other custom interactive stuff in the block as needed, usually above the loader and output area.

### The Wait Snippet

If you have a step in your tutorial where you wait for a transaction to get validated, the "Wait" snippet is there for you. The "Wait" snippet should be used like this:

```jinja2
{{ start_step("Wait") }}
{% include '_snippets/interactive-tutorials/wait-step.md' %}
{{ end_step() }}
```

If you have multiple "Wait" steps, you need to give each one a unique name, as with all steps.

### Step Code

The custom JavaScript code for your interactive tutorial should be wrapped in a function that runs it when the whole page is loaded, like this:

```js
$(document).ready(() => {
  // Your code here
})
```

Inside that block, the code for each individual block tends to follow a pattern: you make event handlers for the ways users should interact with the buttons and things in each step. Within the handlers, you can use the event to identify the block so that most of the code is very familiar. The following example is pulled from the "Use Tickets" interactive tutorial, with extra comments added to clarify the various pieces.

```js
// 7. Check Available Tickets --------------------------------------------------
// create and bind a handler to a mouse click on the button with ID "check-tickets"
$("#check-tickets").click( async function(event) {
  // Use jQuery to find the interactive block that contains the button that
  // triggered this event, so we can do stuff within it. You can use this as-is
  // in basically every handler.
  const block = $(event.target).closest(".interactive-block")

  // Get the address from the "Generate" step snippet, or display an error and
  // quit out of this handler if it hasn't been run successfully yet.
  // There's also a get_wallet(event) function which works the exact same way,
  // but returns a Wallet instance.
  const address = get_address(event)
  if (!address) {return}

  // Wipe previous output in this interactive block.
  block.find(".output-area").html("")

  // Show the loader animation and text while we wait for the next commands to
  // finish.
  block.find(".loader").show()

  // Make a call using xrpl.js. The "api" is a Client instance provided by
  // the "Connect" step snippet.
  let response = await api.request({
      "command": "account_objects",
      "account": address,
      "type": "ticket"
    })

  // Hide the loader animation. If you called any commands that can error out,
  // don't forget to hide the loader in the error handling case, too. It's safe
  // to call this even if the loader is already hidden; if so, it does nothing.
  block.find(".loader").hide()

  // Display the output of the call in the interactive block for the user's
  // benefit. The pretty_print() helper function handles indentation and can
  // take either a JSON-like object or a string containing serialized JSON.
  // If you use .html() this will replace the contents of the output area; to
  // add to it without resetting it, use .append() instead.
  block.find(".output-area").html(
    `<pre><code>${pretty_print(response)}</code></pre>`)

  // This particular step sets up a set of clickable "radio buttons" in the
  // following step based on the results of the query. So ticket-selector is
  // the ID of an element in the next interactive block's HTML bits.

  // Wipe any previous output from the ticket selector area
  $("#ticket-selector .form-area").html("")
  // For each ticket from the response, add a radio button to the ticket
  // selector area.
  response.result.account_objects.forEach((ticket, i) => {
      $("#ticket-selector .form-area").append(
        `<div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" id="ticket${i}"
        name="ticket-radio-set" value="${ticket.TicketSequence}">
        <label class="form-check-label"
        for="ticket${i}">${ticket.TicketSequence}</label></div>`)
    })

  // This marks the current step as complete. It adds a checkbox to the
  // breadcrumbs at the top of each interactive block, and highlighting the next
  // step. It also enables any buttons and things that have the
  // "previous-steps-required" class.
  // The name of the step has to exactly match the value passed to start_step()
  // in the Markdown file.
  // In this example, the step is complete when we're done processing the
  // results of the #check-tickets button. Depending on your tutorial, you may
  // wait to mark the step as complete until other things have happened.
  complete_step("Check Tickets")
})
```

### All-in-one Transaction Sending

One common pattern is that a step is sending a transaction from the account whose credentials you generated in the "Generate" step. There's a helper function for that. But first, you have to set up the interactive block in your Markdown file. Here's an example:

```jinja2
{{ start_step("Send AccountSet") }}
<button id="send-accountset" class="btn btn-primary previous-steps-required" data-wait-step-name="Wait">Send AccountSet</button>
<div class="loader collapse"><img class="throbber" src="static/img/xrp-loader-96.png">Sending...</div>
<div class="output-area"></div>
{{ end_step() }}
```

Most parts—the start and end, loader, and output area—are exactly the same. But notice that the button has a new attribute: `data-wait-step-name="Wait"`. This basically is storing some information for the JavaScript code to use, and it tells it where to output the results of the transaction, in the form of a step using the "Wait Step" snippet, as described above. The value of the attribute is the exact name of the step, which (remember) has to be unique for each one. So if your tutorial involves sending multiple transactions, the first one might have its outcome displayed in a "Wait" step, and the other one might be in the "Wait Again" step, and so on. Usually the relevant wait step is the one immediately after the current step.

The JavaScript for this example looks like the following:

```js
// 3. Send AccountSet --------------------------------------------------------
$("#send-accountset").click( (event) => {
  const address = get_address()
  if (!address) {return}

  generic_full_send(event, {
    "TransactionType": "AccountSet",
    "Account": address,
    "SetFlag": 1 // RequireDest
  })
  complete_step("Send AccountSet")
})
```

For any step that involves sending a transaction, you can use this exact same pattern, just changing the appropriate parts of the code:

- The ID of the button that triggers the send (`send-accountset`).
- The transaction instructions to submit, as appropriate for your tutorial.
- The name of this step to mark complete after submitting the transaction.

The `generic_full_send(event, transaction)` function handles the rest, including all of the following:

1. Getting the relevant secret key as generated by the "Generate" snippet.
2. Showing this block's loader while stuff is happening and hiding it when done.
3. Preparing the transaction, filling in the auto-fillable fields like `Sequence`, `Fee`, and `LastLedgerSequence`.
4. Signing the transaction.
5. Submitting the transaction.
6. Displaying the preliminary results from preparing/signing/submitting in the current interactive block's output area.
7. Updating the relevant "Wait" step (as defined in the attribute of the HTML on the button that triggered the event) to show the transaction's identifying hash, the relevant ledger indexes to know when it might have expired, and the final result when one is available. It also adds a link to the appropriate (Testnet/Devnet/Mainnet) explorer if the final result is validated by consensus.
8. Marking the related "Wait" step as complete when the transaction has a final result.

### Generic Submit Only

For some tutorials, you might break up the steps of preparing and signing a transaction from the step where you submit it. In those cases, you can use a generic submit button handler provided by the interactive tutorials code. The block in the Markdown looks like this:

```jinja2
{{ start_step("Submit") }}
<button id="ticketcreate-submit" class="btn btn-primary previous-steps-required" data-tx-blob-from="#tx_blob" data-wait-step-name="Wait">Submit</button>
<div class="output-area"></div>
{{ end_step() }}
```

There are _two_ data attributes that are important here:

- `data-wait-step-name="Wait"` is just like in All-in-One Transaction Sending. It's the unique name of the "Wait" step where to display the transaction's results.
- `data-tx-blob-from="#tx_blob"` tells the submit function where to find the transaction blob to submit, in the form of a [jQuery selector](https://api.jquery.com/category/selectors/). Usually this will be the ID of an element created or filled in by your JavaScript in a previous step. The generic submit handler finds the first element matching that selector and reads the text it contains ([`.text()`](https://api.jquery.com/text/#text)) to get the blob (as hexadecimal).

The JavaScript code for this is as follows:

```js
$("#ticketcreate-submit").click( submit_handler )
```

The generic submit handler does all the following:

1. Showing this block's loader while stuff is happening and hiding it when done.
2. Submitting the transaction.
3. Displaying the preliminary results from submitting in the current interactive block's output area.
4. Updating the relevant "Wait" step (as defined in the attribute of the HTML on the button that triggered the event) to show the transaction's identifying hash, the relevant ledger indexes to know when it might have expired, and the final result when one is available. It also adds a link to the appropriate (Testnet/Devnet/Mainnet) explorer if the final result is validated by consensus.
5. Marking the related "Wait" step as complete when the transaction has a final result.

### Other Bits

There are several other functions provided by the [interactive-tutorial.js](../static/js/interactive-tutorial.js) file that may be useful for certain things; for the full details on all of them, read the source. A brief summary of what you can use:

- Check if a step is complete (by name or by ID)
- Get the ID of a step that contains a given HTML element (like the one that triggered an event). You can use this to write an event handler that can process multiple different buttons similarly.
- Mark a step as complete (by name or ID)
- Pretty-print JSON
- Display an nicely-formatted error message in a given block
- Get the address or secret from the Generate step (and display an error if they aren't there yet)
- Call the Testnet/Devnet faucet to get credentials, or to send XRP to a specific address.
- Submit a transaction (all-in-one, submit only, or a full submit button handler)

There's also some translation stuff, but it's not ready to be used outside of that file yet.

## Examples

- **Send XRP** - The original interactive tutorial. (Much improved since its inception.) Uses the `include_code` to pull in the Example Code from an HTML file that also work as a stand-alone.
    - [Markdown](../content/tutorials/use-simple-xrp-payments/send-xrp.md)
    - [Example Code](../content/_code-samples/send-xrp/)
    - [Interactive Code](../static/js/tutorials/send-xrp.js)
- **Use Tickets** - A fairly detailed case with some advanced interactions.
    - [Markdown](../content/tutorials/manage-account-settings/use-tickets.md)
    - Example code is inlined in the Markdown file.
    - [Interactive Code](../static/js/tutorials/use-tickets.js)
- **Require Destination Tags** - A relatively small and simple tutorial.
    - [Markdown](../content/tutorials/manage-account-settings/require-destination-tags.md)
    - [Example Code](../content/_code-samples/require-destination-tags/)
    - [Interactive Code](../static/js/tutorials/require-destination-tags.js)
- **Monitor Incoming Payments with WebSocket** - An interactive tutorial that doesn't use xrpl.js.
    - [Markdown](../content/tutorials/get-started/monitor-incoming-payments-with-websocket.md)
    - [Example Code (incomplete)](../content/_code-samples/require-destination-tags/). The rest is inlined in the Markdown file.
    - The interactive code is inlined in the Markdown file.
