---
seo:
  description: Learn how this site's tutorials are structured and guidelines for contributing quality tutorials.
---

# Tutorial Guidelines

We are creating a repository of tutorials and functional code samples that show how various features of the XRP Ledger work. Developers and large language models (LLMs) can use these tutorials and their associated code samples to learn about business solutions, and copy or adapt the scripts for use in their own applications.

The guidelines on this page don't need to be strictly enforced. It's OK to diverge from them in cases where you have good reason to.

## Rationale

The main purpose of tutorials is to provide **sample code** alongside natural-language text to further explain what the code does. This serves multiple purposes:

- Developers can copy and paste the sample code into their own applications.
- Large language models (LLMs) can use this as training data to generate high-quality code for use with the XRP Ledger.

Conceptual information is sometimes necessary, but tutorials are not the place to discuss concepts at length. A tutorial should include a few sentences throughout to help provide context for the action occurring in the code, and should link out to concept and reference pages to provide background reading.

LLMs are increasingly being used in software development. To assist users of these tools, we would like to provide many working code samples that demonstrate best practices and follow consistent structure and style. Tutorials that have descriptions of what the code does alongside matching code snippets help LLMs develop the correct associations between terms used in natural language and programming language, hopefully leading to more accurate results from code generation.

## Recommended Tutorial Structure

Use the {% repo-link path="/resources/contribute-documentation/_tutorial-template.md" %}`_tutorial-template.md` file{% /repo-link %} as a starting point with typical headers and contents expected for a new tutorial. See below for recommendations of what type of content to include in each section.

### Introduction

Immediately after the title, introduce the tutorial with a brief introduction. Using 2-3 sentences, provide contextual information of _what_, _why_, or _when_ you would need to use the tutorial. Do not provide too much information—leave those details for concepts or use case articles—instead, "backlink" to conceptual documentation for core concepts and features demonstrated by the tutorial.

### Prerequisites

The prerequisites help readers recognize when they are in the right place and provide background reading in case there are other topics they need to understand first. Example pre-requisites may include:

- Knowledge and learning background, especially tutorials that this one builds on top of.
- Dev environment setup, especially basic depedencies such as your xrpl client library.
  - Do not include dependencies that are specific to this tutorial here, because people tend to skim/gloss over this section. For dependencies specific to this tutorial, include them in the steps later.
- Specific on-chain structures that need to be in place in advance. For example, to trade against an AMM, the AMM must exist in the ledger.
- Amendments that need to be enabled for this tutorial. Use an amendment disclaimer component to show the Mainnet status of the amendment.

### Source Code

Update the path in the `{% repo-link ... %}` component to link to the source files for this tutorial specifically. This component is designed to adjust based on the environment, so for example previews link to the code on the preview branch... although it doesn't fully work as of this writing (2025-12-15).

### Usage

Include a Usage section only for **sample app tutorials**. Provide a "Usage" section if this tutorial's sample code:

- Has a GUI with multiple buttons/inputs
- Is a commandline utility with multiple options/parameters
- Consists of multiple scripts that need to be run in a specific order

If there's a user interface, you can also embed a video demonstrating usage of the sample app.

For single-file scripts that perform a linear set of steps without user input, omit the Usage section.

### Steps

Using numbered steps, walk through the entire code sample. Numbered steps help to orient readers to the structure and serve to identify the core part of the tutorial. If you change the number or order of steps, remember to update the step numbers and update any links or mentions of specific steps, too.

Each step should have a heading in the imperative, in sentence case. Beneath the heading should be a sentence or two introducing the action being taken at this stage of the code sample in more detail. The code samples should be in tabs per programming language.

Each "step" of the tutorial should correspond to one code snippet (with tabs by programming language). There can be exceptions, for example if one programming language needs additional code in a separate place to make the same functionality work. Most tutorials should have 3-7 steps. If the tutorial has fewer, maybe it doesn't need to be a tutorial, or maybe you should go into more detail. If it has more, consider splitting it into multiple tutorials.

#### 1. Install dependencies

Many tutorials start with this step, because people tend to gloss over requirements mentioned in the prerequisites. It may also include dependencies that are specific to this tutorial rather than general to XRPL development as a whole.

#### 2. Connect and get account(s)

In many tutorials, this step is the first one to show source code from the script itself. The scope of this step typically includes all of the following:

- Importing necessary dependencies.
- Instantiating a client and connecting to the network.
- Defining hard-coded values and constants.
- Deriving wallets or funding accounts via a faucet.

If the scope of the code this covers is more than 15-20 lines, you may want to split it up into multiple steps.

Use `{% code-snippet ... %}` tags instead of copy-paste to display the code samples, so that you don't have to manually keep the code in the doc synchronized with small changes to the code sample. To facilitate this, use `from=` and `before=` strings based on unique comments in the code. The first code snippet should omit `from=` and the last should omit `before=`.

#### Additional notes on steps

If a script depends on certain ledger data already existing (for example, you are supposed to create it with a different script), the script should have an explicit step to check for the existence of that data. You should also mention the requirement in the [**Prerequisites**](#prerequisites) section.

Each step should directly continue the code sample from the previous step without skipping anything, to the extent possible.

Optionally, you can provide additional text after the code snippet, such as an explanation of the expected output from this step, or details that you should note down for later.

If the code snippet calls an API method, link to the relevant reference documentation. If you include the common links file, you can generally do this with an automatic link such as the `[ledger method][]`, which turns into the [ledger method][].

### See Also

At the end of the tutorial, provide links to additional resources that would be a sensible next step in the learning journey. This could be more tutorials, use cases, or other pages. It's also a good idea to add links here to reference documentation for any API methods, transaction types, and ledger entries used in the tutorial—even though those links should be redundant with links scattered throughout the text of the tutorial.

## Sample Code Guidelines

Sample code is well commented scripts, snippets, or applications that illustrate common usage patterns and best practices. Advanced users can typically scan the example and use it immediately without a formal tutorial. Not every piece of sample code needs to be associated with a tutorial, but most tutorials will have a piece of sample code that serves as the basis for that tutorial.

The XRPL.org maintainers are generally committed to providing sample code in both **JavaScript** and **Python** using the official client libraries for those languages. The site may occasionally provide more, depending on what the community needs and provides. This site is open-source, so if you want to maintain examples in other languages, feel free to volunteer!

However, due to the security concerns of using third party libraries, it may take a while to accept contributions in other programming languages.

### Folder Layout

Sample code should be provided in the `_code-samples/` folder at the top of this website's source repository, with separate subfolders by programming language. There should be a `README.md` file for each code sample _above_ the language folders describing what the code sample does in general, _and_ a `README.md` in each programming language folder describing how to install and run that code sample specifically.

For example:

```
- _code_samples/issue-credentials/
    - js/
        - README.md
        - issue-credential.js
        - package.json
    - py/
        - README.md
        - issue_credential.py
        - requirements.txt
    - README.md
```

This information is used to populate the [Code Samples](/resources/code-samples/) page. The outer README's header is the title of the code sample on that page, and the first paragraph is the description.

### Comments

Comments are an important part of readable, accurate code, but don't go overboard. The text of a tutorial may be translated into other languages such as Japanese, while the sample code is kept the same, so don't include any critical information _only_ in the comments.

Use comments to separate out logical sections of the sample code. You can these comments as markers so that the `{% code-snippet ... %}` Markdoc component shows only the relevant section at a time in a tutorial.

### Sample Code Types

Sample code can take many forms, such as the following:

- **Sample Application** - A fully functional program that accepts user input to perform tasks with some flexibility. It may have a graphical user interface or only a commandline interface. Complete sample code for different stages of application development may be provided, but is not recommended because it's more work than it's worth.
- **Script** - A simple program that performs a predetermined set of tasks, often using hard-coded values, with minimal branching. These scripts are not expected to perform robust error handling; they typically exit when an error occurs.
- **Snippet** - A self-contained function or piece of code that demonstrates the best practices for doing one thing, but is not a complete program. Snippets are most likely to _not_ have an associated tutorial.

All three types of sample code have their time and place. However, for most of this website's tutorials, _scripts_ are preferred for the following reasons:

- They demonstrate the relevant, XRPL-specific functionality with minimal distractions.
- You can run a script to demonstrate that it works and is accurate.
- Scripts are easier to create and have a lesser maintenance burden than more complex apps.

### JSON-RPC / WebSocket / Commandline Examples as Sample Code

Some legacy tutorials show example requests and responses using WebSocket, JSON-RPC APIs, or the `rippled` commandline. These are not recommended, for the following reasons:

- People (or LLMs) who copy these formats tend to end up submitting their secret keys to public servers, which is extremely insecure.
- Many tutorials involve steps where you need application logic that can't be represented in API requests/responses. You end up with code in other programming languages anyway, or pseudocode, or just steps that are missing examples of how to do critical work.
- The API references already provide examples in these formats.

If you do have good reason to provide commandline, WebSocket, or JSON-RPC examples, show both the request and an example response in separate code blocks.

### Dependencies

Dependencies can be a source of maintenance burden, because you need to stay up-to-date with security fixes and breaking changes to the dependencies. On the other hand, reimplementing common utilities in every code sample is its own maintenance burden, and it's even worse to "roll your own" security-sensitive code. Some users may be working on codebases that are locked into competing/incompatible dependencies, which can make it harder to adapt your code to their situation; the more dependencies you have, the more likely this is to occur.

Some guidelines:

1. Prefer standard library functions to third-party libraries, even if they're not quite as convenient to use.
   - Use third-party libraries when they're _significantly_ more convenient than the standard library. For example, [even Python's official documentation recommends using the Requests lib instead of `urllib.request`](https://docs.python.org/3/library/urllib.request.html#module-urllib.request).
   - When updating old code samples, look for cases where dependencies can be eliminated because the standard library has grown to encompass functionality that previously needed a library.
2. Implement your own functions when they're small and not security-sensitive; use libraries for complex or security-sensitive functions.
3. Prefer widely-used, actively maintained libraries.

### General Guidelines and Best Practices

The following guidelines apply for XRP Ledger code samples regardless of language:

- Don't hardcode secret keys, even example keys that don't hold real money. Instead, do any of the following:
  - Fund a new account using the faucet.
  - Prompt the user to paste the seed of the account they want to use.
  - Read the secret key from an environment variable.
- Use `client` as the name for the API client instance.
- Print output to the console, especially before doing any network operations such as calling API methods or submitting transactions.
- Use the client library's "submit and wait" function when sending transactions. Autofill, sign, and submit the transaction all in one call.
- Use tabs for code samples even if you only have a code sample in one language.
- When making WebSocket/JSON-RPC API calls, use the latest API version and the `validated` ledger.

### Language-specific Guidelines

{% tabs %}

{% tab label="JavaScript" %}
JavaScript code samples should:

- Use xrpl.js as the XRPL client library.
- Provide a `package.json` file that specifies `"type": "module"` and any relevant dependencies.
- Use **ES Module** syntax such as `import { Client } from "xrpl"`, not Common JS syntax such as `require("xrpl")`.
- Use `await` instead of `.done(...)` or `.then(...)`
- Follow [**JavaScript Standard Style**](https://standardjs.com).
- Be compatible with Node.js versions that are currently in maintenance (security) support.
  - Preferably, be compatible with most widely-used web browsers too.
- When writing JSON objects to the console, use `JSON.stringify(example_object, null, 2)` so that Node.js doesn't skip the interesting inner parts of the object.
  {% /tab %}

{% tab label="Python" %}
Python code samples should:

- Use xrpl-py as the XRPL client library
- Provide a `requirements.txt` file with relevant dependencies.
- Use the `JsonRpcClient` unless asynchronous functionality is needed.
- Follow [**Black Style**](https://black.readthedocs.io/en/stable/).
- Be compatible with Python versions that are currently in maintenance (security) support.
  {% /tab %}

{% /tabs %}
