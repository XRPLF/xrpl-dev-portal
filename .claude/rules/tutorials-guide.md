---
paths:
  - "docs/tutorials/**/*.md"
---

# XRPL Tutorial Conventions

The template below shows the full structure a tutorial should follow; HTML comments provide instructions on how to fill it in. If the tutorial doesn't already link to a specific code sample, prompt the user for which code samples to use.

---

# Tutorial Title
<!-- Title should be an imperative task. -->

This tutorial shows you how to <!-- 2-3 sentences of what/why/when. Link out to concept docs rather than explaining at length. {% amendment-disclaimer name="LendingProtocol" /%} -->


## Goals

By following this tutorial, you should learn how to:

<!-- TODO: 2-4 bullet points describing what the reader will learn. If the tutorial includes a GUI, also include a screenshot of the final product here. -->


## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have an [XRP Ledger client library](../../references/client-libraries.md), such as **xrpl.js**, installed.
<!-- TODO: Add knowledge prerequisites (especially tutorials this one builds on), basic dependencies (xrpl client library), required on-chain state (e.g., for an AMM trade, the AMM must exist), and amendments (use {% amendment-disclaimer %} for amendment-gated features). Tutorial-specific dependencies belong in the steps below — readers gloss over Prerequisites. -->


## Source Code

You can find the complete source code for this tutorial's examples in the {% repo-link path="_code-samples/<topic>/" %}code samples section of this website's repository{% /repo-link %}.
<!-- TODO: Update the path= to point to this tutorial's _code-samples/<topic>/ folder. -->


## Usage
<!-- TODO: Include this section ONLY for sample-app tutorials — a GUI with multiple inputs, a CLI with options/parameters, or multiple scripts that run in a specific order. Omit entirely for single-file linear scripts. If the sample has a UI, optionally embed a video. -->


## Steps
<!-- 3-7 numbered ### subsections total. Fewer suggests the page shouldn't be a tutorial; more suggests splitting into multiple tutorials. Each step corresponds to one {% code-snippet %} (wrapped in {% tabs %}). Each ### heading is imperative, sentence-case. Each step continues the code sample from the previous step without skipping. If the script depends on prior on-chain state, add an explicit check step and also mention the requirement in Prerequisites above. -->

### 1. Install dependencies
<!-- Always begin with dependencies; readers gloss over Prerequisites. Include tutorial-specific dependencies here, not in Prerequisites above. -->

{% tabs %}
{% tab label="JavaScript" %}
From the code sample folder, use `npm` to install dependencies:

```sh
npm i
```
{% /tab %}

{% tab label="Python" %}
From the code sample folder, set up a virtual environment and use `pip` to install dependencies:

```sh
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
{% /tab %}
{% /tabs %}


### 2. Connect and get account(s)
<!-- This step typically covers: importing dependencies, instantiating the client (variable name MUST be `client`), defining hardcoded values/constants, and deriving wallets or funding via faucet. Split into multiple steps if it grows past 15-20 lines. Never hardcode secret keys — use the faucet, an env var, or user-paste. Use the client library's "submit and wait" function for transactions. WebSocket/JSON-RPC calls: latest API version, `validated` ledger. -->

To get started, import the client library and instantiate an API client. <!-- TODO: mention wallets/test accounts if applicable. -->

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/<topic>/js/<file>.js" language="js" before="// TODO" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/<topic>/py/<file>.py" language="py" before="# TODO" /%}
{% /tab %}
{% /tabs %}
<!-- Wrap all snippets in {% tabs %} even when only one language is provided. Use unique comments in the source as from=/before= anchors. The first snippet omits from=; the last snippet omits before=. NEVER copy-paste source code into the tutorial — synchronization is brittle. Never put critical information ONLY in code comments — comments aren't translated; tutorial prose is. -->


### 3. <!-- TODO: imperative sentence-case heading for this step -->
<!-- Duplicate this entire step block (heading + description + tabs + post-snippet text) for each additional step. Code samples should be `scripts` (not full applications or isolated snippets) for most tutorials — they demonstrate XRPL-specific functionality with minimal distractions and are easy to run end-to-end. Avoid JSON-RPC / WebSocket / commandline examples as primary sample code — they encourage insecure key handling and can't represent application logic. -->

<!-- TODO: brief description of what happens in this step. -->

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/<topic>/js/<file>.js" language="js" from="// TODO" before="// TODO next" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/<topic>/py/<file>.py" language="py" from="# TODO" before="# TODO next" /%}
{% /tab %}
{% /tabs %}

<!-- TODO: Optional follow-up text after the code — e.g., expected output, details to note for later. If the snippet calls an API method, link to the relevant reference doc (the common-links partials at the bottom of the file enable auto-links like `[ledger method][]`). -->


## See Also

<!-- TODO: Links to related tutorials, use cases, and references. Include reference docs for every API method, transaction type, and ledger entry used in the tutorial — even if those links are redundant with inline links throughout the prose. -->


{% raw-partial file="/docs/_snippets/common-links.md" /%}

---

## Sample code conventions

Sample code referenced by `{% code-snippet %}` lives at `_code-samples/<topic>/<lang>/` with both:
- A `README.md` at the topic root (used as the title/description on the [Code Samples](/resources/code-samples/) page)
- A per-language `README.md` describing install and run

Language guidelines:
- **JavaScript:** xrpl.js, `package.json` with `"type": "module"`, ESM imports (not CommonJS), `await` over `.then()`, [JavaScript Standard Style](https://standardjs.com), `JSON.stringify(obj, null, 2)` when dumping objects to console.
- **Python:** xrpl-py, `requirements.txt`, `JsonRpcClient` (async only when needed), [Black Style](https://black.readthedocs.io/en/stable/).
