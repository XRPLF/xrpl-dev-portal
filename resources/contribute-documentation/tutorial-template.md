---
seo:
    description: A summary of the parts of a standard tutorial.
---
# Tutorial Template

This tutorial demonstrates the structure of a **[tutorial](./tutorial-guidelines.md)** in the XRPL.org standard style, including:

- Typical headings for a tutorial page
- Recommendations for code samples and usage
- Options and variations

The template should begin with an intro that states what the tutorial is about. The intro should have one or more "backlinks" to the conceptual documentation for the core concepts/features that the tutorial demonstrates. You may also want to add a small amount of additional context of _why_ or _when_ you would want to do whatever this tutorial does. Don't go overboard—leave the details for concept or use case articles.

## Goals

This section defines the learning goals of the tutorial:
- Bullet points are a succinct way of outlining learning steps.
- If the tutorial includes a graphical interface, include a screenshot of the final product here.

## Prerequisites

Prerequisites can take several forms: 

- Knowledge and learning background, especially tutorials that this one builds on top of.
- Dev environment setup, especially basic depedencies such as your xrpl client library.
    - Do not include dependencies that are specific to this tutorial here, because people tend to skim/gloss over this section. For dependencies specific to this tutorial, include them in the steps later.
- Specific on-chain structures that need to be in place in advance. For example, to trade against an AMM, the AMM must exist in the ledger.
- Amendments that need to be enabled for this tutorial. Use an amendment disclaimer component to show the Mainnet status of the amendment.

## Source Code

You can find the complete source code for this tutorial's examples in the {% repo-link path="resources/contribute-documentation/tutorial-structure.md" %}resources section of this website's repository{% /repo-link %}.

{% admonition type="success" name="Tip" %}
Use the `{% repo-link ... %}` component to link to the source files; this component is designed to adjust based on the environment, so for example previews link to the code on the preview branch... although it doesn't fully work as of this writing (2025-08-11).
{% /admonition %}

## Usage

To test that the code runs properly, you can navigate to the repository top and start the local Redocly server as follows:

```sh
npm run start
```

Then, navigate to <http://localhost:4000/resources/contribute-documentation/tutorial-structure> to view the parsed version of this page.

{% admonition type="info" name="Usage is optional" %}
You should include a Usage section in **sample app tutorials**. Provide a "Usage" section if this tutorial's sample code:
- Has a GUI with multiple buttons/inputs
- Is a commandline utility with multiple options/parameters
- Consists of multiple scripts that need to be run in a specific order

If there's a user interface, you can also embed a video demonstrating usage of the sample app.

For single-file scripts that perform a linear set of steps without user input, omit the Usage section.
{% /admonition %}

## Steps

Follow these steps to build a tutorial. Number the steps, because they help to orient readers to the structure and serve to identify the core part of the tutorial.

If you change the number or order of steps, remember to update the step numbers and update any links or mentions of specific steps, too.

### 1️1. Install dependencies

Unlike the ones in Prerequisites, this step is for dependencies that are specific to this tutorial. They're here because people tend to gloss over the preamble parts and skip straight to the "meat" of the tutorial.

{% tabs %}
{% tab label="JavaScript" %}
From the code sample folder, use npm to install dependencies:

```sh
npm i
```
{% /tab %}
{% tab label="Python" %}
From the code sample folder, use pip to install dependencies:

```sh
pip install -r requirements.txt
```
{% /tab %}
{% /tabs %}

### 2. Connect and get account(s)

Each step should have a heading in the imperative, in sentence case. Beneath the heading should be a sentence or two introducing the action being taken at this stage of the code sample in more detail. The code samples should be in tabs per programming language.

Most code samples need at least one account. The first step should generally cover from the start of the file (including imports) through instantiating a client, connecting to a network, and deriving wallets and/or funding accounts via the faucet.

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/verify-credential/js/verify_credential.js" language="js" before="// Look up Credential" /%}
{% /tab %}

{% /tabs %}

{% admonition type="info" name="Code snippets and steps" %}
Each "step" of the tutorial should correspond to one code snippet (with tabs by programming language). There can be exceptions, for example if one programming language needs additional code in a separate place to make the same functionality work.
{% /admonition %}

### 3. Check for on-ledger structures

If a script depends on certain ledger data already existing (for example, you are supposed to create it with a different script), the script should have an explicit step to check for the existence of that data. You should also mention the requirement in the [**Prerequisites**](#prerequisites) section.

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/verify-credential/js/verify_credential.js" language="js" from="// Look up Credential" before="// Check if the credential has been accepted" /%}
{% /tab %}

{% /tabs %}

### 4. Add next step

Each additional step should directly continue the code sample from the previous step without skipping anything, to the extent possible. 

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/verify-credential/js/verify_credential.js" language="js" from="// Check if the credential has been accepted" before="// Confirm that the credential is not expired" /%}
{% /tab %}

{% /tabs %}

Optionally, you can provide additional text after the code snippet, such as an explanation of the expected output from this step, or details that you should note down for later.

### 5. Use as many steps as necessary

If the code snippet calls an API method, link to the relevant reference documentation. If you include the common links file, you can generally do this with an automatic link such as the `[ledger method][]`, which turns into the [ledger method][].

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/verify-credential/js/verify_credential.js" language="js" from="// Confirm that the credential is not expired" before="// Credential has passed all checks" /%}
{% /tab %}

{% /tabs %}

{% admonition type="success" name="The right number of steps" %}
Most tutorials should have 3-7 steps. If the tutorial has fewer, maybe it doesn't need to be a tutorial, or maybe you should go into more detail. If it has more, consider splitting it into multiple tutorials.
{% /admonition %}

### 6. Final step

Use `{% code-snippet ... %}` tags instead of copy-paste to display the code samples, so that you don't have to manually keep the code in the doc synchronized with changes to the code sample. To facilitate this, use `from=` and `before=` strings based on unique comments in the code. The first code snippet should omit `from=` and the last should omit `before=`.

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/verify-credential/js/verify_credential.js" language="js" from="// Credential has passed all checks" /%}
{% /tab %}

{% /tabs %}

## See Also

At the end of the tutorial, provide links to additional resources that would be a sensible next step in the learning journey. This could be more tutorials, use cases, or other pages. It's also a good idea to add links here to reference documentation for any API methods, transaction types, and ledger entries used in the tutorial—even though those links should be redundant with links scattered throughout the text of the tutorial.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
