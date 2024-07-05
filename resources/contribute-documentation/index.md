---
html: contribute-documentation.html
parent: resources.html
seo:
    description: Contribution guides for XRP Ledger documentation.
---
# Contribute Documentation

Thanks for considering a contribution to the XRP Ledger Developer Portal!

We're thrilled you're interested and your help is greatly appreciated. Contributing is a great way to learn about the XRP Ledger (XRPL).

We are happy to review your pull requests. To make the process as smooth as possible, please read this document and follow the stated guidelines.


## About This Site

The XRPL Dev Portal provides comprehensive documentation of the the XRP Ledger, including sample code and other information for developers to start building.

The official source repository for the site is at <https://github.com/XRPLF/xrpl-dev-portal>. Contributions are copyright their respective contributors, but must be provided under the MIT [LICENSE](https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE).

## Repository Layout

- `_api-examples/` - Sample API requests and responses, especially ones used in the documentation.
- `_code-samples/` - Code samples used or referenced by the documentation. Where possible, these are fully functional / executable scripts.
- `@i18n` - Translations into languages other than English. Currently, only Japanese.
- `@theme` - Overrides and custom components used in Markdoc contents as well as custom React pages.
- `about/` - Source files for the About section's pages.
- `blog/` - Source files for the XRPL Dev Blog.
- `community/` - Source files for the Community section's pages.
- `docs/` - Source files used to build the documentation. Mostly in Markdown.
    - `docs/_snippets/` - Reusable pieces of text used in the documentation.
    - `docs/img/` - Diagrams and other images used in the documentation.
    - `docs/img/_sources/` - Source files for images used in the documentation, where available.
- `locale/` - **DEPRECATED** Old localization files.
- `resources/` - Source files for the Resources section's pages.
- `shared/` - Configuration files for some dependencies like CodeMirror.
- `static/` - Static files used by the site's templates and theme.
- `styles/` - SCSS source files for custom CSS.
- `redirects.yaml` - Definitions of redirects from old site URLs to current paths.
- `redocly.yaml` - Main config file for the site.
- `sidebars.yaml` - Defines sidebars for the Documentation and Resources sections.
- `top-nav.yaml` - Defines the main top nav elements.


## Requirements for a Successful Pull Request

Before being considered for review or merging, each pull request must:

- Pass continuous integration tests.
- Be [marked as drafts](https://github.blog/2019-02-14-introducing-draft-pull-requests/) until they are ready for review.
- Adhere to the [code of conduct](https://github.com/XRPLF/xrpl-dev-portal/blob/master/CODE-OF-CONDUCT.md) for this repository.

## Redocly Setup

The portal is built using Redocly Realm, which is currently in closed beta. Installing it for local development requires Node.js (version 20 recommended) and NPM.

You can install Realm and other necessary dependencies using NPM from the repository top:

```sh
npm i
```

## Building the Site

After you've installed dependencies, you can start a local dev server with:

```sh
npm run start
```

You can view the preview in a web browser, probably at http://localhost:4000/


## Config Formatting

Realm uses YAML config files to generate navigation elements in the site, including header, footer, sidebars, and breadcrumbs.

If you add a new page, you should add it to the appropriate `sidebars.yaml` file. There is one sidebars file for the documentation and one for the blog. Here's an example of an entry for a page with no nested children:

```yaml
- page: concepts/consensus-protocol/index.md
```

The Markdown file for a page should start with a [frontmatter stanza](#frontmatter-fields).

## Conventions

Use the following conventions when creating a page:

- Filenames (aside from `index.md`) should generally match the title of the page, including words like "and" and "the", but should be in all lowercase with hyphens instead of spaces and punctuation. For example, `cash-a-check-for-an-exact-amount.md`. If you change the title of a page, change the filename too. (If it has already been published at another URL, leave a redirect from the old URL.)
    - The page within a category should be in a subfolder named for that category but can be less verbose (especially if the page title includes words also in the parent directories), should have the filename `index.md`, and a title that is similar to the folder name. For example, the "Protocol Reference" index page is at `references/protocol/index.md`.
- Always start a page with a h1 header.
- Don't link to the top h1 anchor of a page, link to the page itself without an anchor. This helps prevent broken links in translation. It's OK to link to later headers.
- Don't use any formatting (like _italics_ or `code font`) in the title of the page.
- Don't hard-wrap text in Markdown files.
- For code samples, try to keep lines no longer than 80 columns wide.
- When in doubt, follow [Ciro Santilli's Markdown Style Guide (Writability Profile)](https://cirosantilli.com/markdown-style-guide/).
- Don't use tab characters for indentation in Markdown or code samples. Use 4 spaces per indent, except in **JavaScript** code samples, which should use 2 spaces per indent.
- Make sure text files end in a newline character. (Some text editors handle this automatically.) Encode files in UTF-8 with no byte-order mark.

### New Features

When documenting a new feature, include a badge indicating the version of the program when the feature was introduced. The badge tag takes the structure:

`{badge href="myurl" date="<date of release>"} New in: <program> <version number>{% /badge%}`

For example, the following badge definition:

`{% badge href="https://github.com/XRPLF/clio/releases/tag/2.0.0" date="February 18, 2024" %}New in: Clio v2.0.0{% /badge %}`

renders as {% badge href="https://github.com/XRPLF/clio/releases/tag/1.1.0" date="February 18, 2024" %}New in: Clio v2.0.0{% /badge %}.

When updating a feature, replace _New in:_ with _Updated in:_. For example, the following badge definition:

`{% badge href="https://github.com/XRPLF/clio/releases/tag/2.1.0" date="May 4, 2024" %} Updated  in: Clio v2.1.0{% /badge %}`

renders as {% badge href="https://github.com/XRPLF/clio/releases/tag/2.1.0" date="May 4, 2024" %} Updated  in: Clio v2.1.0{% /badge %}.

It is a best practice to remove any new/updated badges more than 2 years old.

### Terminology

Use the following words and phrases as described:

| Term              | Terms to Avoid | Notes |
|-------------------|----------------|-------|
| API, APIs         | API's, RPC | Application Programming Interface, a set of functions and definitions for software to connect to other software. |
| core server, core XRP Ledger server | `rippled` | The `rippled` name is probably going to be retired in the near future, so it's better to refer to it by the more generic name. When necessary, refer to `rippled` in all lowercase and code font. (It's pronounced "ripple dee", and the "d" stands for "daemon" per UNIX tradition.)
| financial institution | bank, FI, PSP (payment services provider) | This term encompasses a wider range of businesses than just _bank_ or other terms and does not rely on an understanding of industry jargon. |
| ledger entry      | ledger object, node | A single object inside the state data of the XRP Ledger. The term _ledger object_ could refer to one of these or to the whole ledger. The term _node_ was sometimes used for this case because the ledger's state data can be envisioned as a graph, but this is confusing because _node_ has other uses. |
| liquidity provider | market maker | A business or individual who offers to exchange between two currencies or assets, often deriving income from the price differential between trades. The term _market maker_ has a specific legal definition in some jurisdictions and may not apply in all the same circumstances. |
| malicious actor   | hacker | A person, organization, or even an automated tool which might attempt to acquire secrets, break encryption, deny service, or otherwise attack a secure resource. |
| a NFT             | an NFT | A NFT object in the XRP Ledger tracks or represents a non-fungible token. Pronounced "nifty" and written _a NFT_ rather than _an NFT_. |
| PostgreSQL        | Postgres | A specific brand of relational database software. Always use the full name, not an informal short version. |
| order book        | orderbook, offer book | A collection of trade orders waiting to be matched and executed, typically sorted by exchange rate. Use two words. |
| server            | node | A server is software and/or hardware, especially the ones that connect to the XRP Ledger peer-to-peer network. The term _node_ is sometimes used for this purpose but is also overloaded with other meanings including entries in a graph and Node.js, a JavaScript interpreter. |
| stablecoin issuer | gateway | An issuer is the organization that issues a token in the XRP Ledger. A stablecoin is a token where the issuer promises that it is fully backed by some outside asset (such as fiat currency), with the stablecoin issuer providing deposit and withdraw operations to convert between the two (possibly for a fee). Previously the term _gateway_ was used (especially by Ripple, the company) to describe this use case, but the rest of the industry adopted _stablecoin issuer_ instead. |
| transaction cost  | transaction fee | The amount of XRP burnt to send a transaction in the XRP Ledger. Even though this is specified in the `Fee` field of transactions, the term _fee_ implies that the money is paid to someone, so _cost_ is preferable. |_
| trust line        | trustline | Use two words. A trust line is a relationship between two accounts in the XRP Ledger that tracks a balance of tokens between those accounts. |
| tokens            | IOUs, issuances, issues, issued currencies | A token in the XRP ledger may not represent money owed outside of the ledger as the name _IOU_ implies. Specify _fungible tokens_ if necessary to distinguish from non-fungible tokens. |
| wallet            | wallet | Depending on the context, _wallet_ could refer to hardware, software, a cryptographic key pair, or an online service. Be sure to provide enough context that the meaning is clear, or use an alternative such as _key pair_ or _client application_. |
| WebSocket         | web socket, Websockets | A two way protocol for communication on the web. Always singular and in CamelCase. |
| XRP               | XRPs, ripples | The native digital asset, or cryptocurrency, of the XRP Ledger. XRP is not a token. |
| the XRP Ledger    | XRP Ledger (no the), Ripple, Ripple Network, RCL | The XRP Ledger was called _the Ripple network_ and the _Ripple Consensus Ledger_ or _RCL_ at various times in the past. These names were confusing and have been retired because of their similarity to the name of the company, Ripple (formerly Ripple Labs) which develops the reference implementation of the core server. |
| XRPL              | XRPL | Short for _XRP Ledger_. As much as possible, spell out _XRP Ledger_ instead; _XRPL_ is cryptic and looks like it could be a typo for _XRP_. |

## Frontmatter Fields

***Note: The details of Realm's frontmatter specification are not fully documented. Update this with a link when Realm exits closed beta.***

Frontmatter for Markdown files can include details such as the following:

```yaml
---
metadata:
  indexPage: true # Add this if you want the page to contain an auto-generated list of its child pages.
seo:
  description: rippled is the core peer-to-peer server that manages the XRP Ledger. This section covers concepts that help you learn the "what" and "why" behind fundamental aspects of the rippled server.
---
```

Some pages in the site have leftover metadata from the previous (Dactyl) toolchain, such as `html`, `parent`, or `targets` fields. These fields have no effect and can be omitted from new pages.

### Next and Previous Buttons

The documentation and blog pages have "Next" and "Previous" buttons at the bottom of the page. 

If these buttons don't make sense as a proper reading order in context you can disable them by updating the frontmatter of the page. 

```yaml
---
theme:
  navigation:
    nextButton:
      hide: true
---
```

## Markdoc Components

The files are processed with [Markdoc](https://markdoc.dev/), which means they can contain special tags in `{% ... %}` syntax. In addition to Redocly's built-in tags, this repository has some custom tags defined in `/@theme/markdoc/`.

### Graphics

Store your graphics in the `/docs/img` directory. Embed graphics using the syntax:

`![image_description](/docs/img/my_image.png)`

For example, `![XRPL Foundation Logo](/docs/img/xrplf-logo.png)` renders as follows.

![XRPL Foundation Logo](/docs/img/xrplf-logo.png)

### Videos

Videos are stored on YouTube. Once uploaded, you can copy the embed instructions and paste them into your document.

To embed a YouTube video in your topic:

1. Locate your video on YouTube.
2. Under the video, click **Share**.
3. Click **Embed**.
4. Click **Copy** in the lower right corner of the pop-up.
5. Paste the `<iframe>` element in your topic.

For example, here is the code to embed the _Send Checks_ video.

```
<iframe width="560" height="315" src="https://www.youtube.com/embed/5zRBC7dGSaM?
si=Mbi8diaFTDR2fc20" title="YouTube video player" frameborder="0" allow="accelerometer;
autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
```

<iframe width="560" height="315" src="https://www.youtube.com/embed/5zRBC7dGSaM?
si=Mbi8diaFTDR2fc20" title="YouTube video player" frameborder="0" allow="accelerometer;
autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

### Tables

Markdoc provides three different syntax styles for generating tables.

In most cases, create tables using the pipe character (|) to separate columns and three or more hyphens (---) to create the column headers.

```
|          | Head 1 |
| -------  | ------ |
| Label 1  | Val 1  |
```

This code renders as follows.

|          | Head 1 |
| -------  | ------ |
| Label 1  | Val 1  |

The cells do not have to be the same width. The renderer aligns the columns and wraps text as needed, as shown.

```
| Key | Value |
| --- | ----- |
| Name | H. G. Wells |
| Genre | Science Fiction |
| Hyperbole | The greatest story ever told! No one has ever written anything more important than this Victorian era classic. Oh, how swells the heart to ponder the heady philosophies introduced therein! |
```

| Key | Value |
| --- | ----- |
| Name | H. G. Wells |
| Genre | Science Fiction |
| Hyperbole | The greatest story ever told! No one has ever written anything more important than this Victorian era classic. Oh, how swells the heart to ponder the heady philosophies introduced therein! |

Use colons in the heading lines to align columns left (:--), middle (:-:), or right (--:).

```
| Model | Color | Price |
| :-: | :--  | --:  |
| Protexra | Electric Blue | 50,000 XRP |
| Joatic | Hot Pink | 165,000 XRP |
| Zhanu | Neon Green | 234,000 XRP |
```

| Model | Color | Price |
| :-: | :--  | --:  |
| Protexra | Electric Blue | 50,000 XRP |
| Joatic | Hot Pink | 165,000 XRP |
| Zhanu | Impetuous Green | 1,728,000 XRP |

The left column is bold by default. If you don't want a bold label in the left column, you can use an empty left column and start your table one column over.

```
|     | French | English | German |
| --- | ---    | ---     | ---    |
|     | Fromage | Cheese | Käse |
|     | Maux d'estomac | Stomach ache | Magenschmerzen |
|     | Cornichon | Pickle | Essiggurke |
```

|     | French | English | German |
| --- | ---    | ---     | ---    |
|     | Fromage | Cheese | Käse |
|     | Maux d'estomac | Stomach ache | Magenschmerzen |
|     | Cornichon | Pickle | Essiggurke |

Use these basic tables whenever possible. If you genuinely require special formatting not provided by the examples above, you can create a table using HTML syntax.

### Links

Links use the syntax `[<link text>](<url>)`.

For example, the sentence:

`See [XRPL.org](http://xrpl.org) for solutions to all the world's problems.`

renders to:

See [XRPL.org](http://xrpl.org) for solutions to all the world's problems.

### Common Links

To make it easier to link to pages that are commonly cited, you can add a `{% raw-partial file="/docs/_snippets/common-links.md /%}` tag to a Markdown file, and then use centrally defined reference-style links such as `[account_info method][]` or `[Payment transaction][]`. The contents of the common-links file are in alphabetical order. (They were first generated by script, but are maintained manually.)

### Code Samples

Format method names and other code structures inline enclosing the code in backtick (&#96;) characters. For example:

&nbsp;&nbsp;&nbsp;&nbsp;My favorite method ever is &#96;nft_info&#96;.

renders as

&nbsp;&nbsp;&nbsp;&nbsp;My favorite method ever is `nft_info`.

For longer code blocks, use three backtics (&#96;&#96;&#96;) followed by the language name. Type a return, and enter the sample code. At the end of your code sample, type a return and close the block again with three backticks (&#96;&#96;&#96;).

For example:

&#96;&#96;&#96;javascript<br/>
&nbsp;&nbsp;&nbsp;&nbsp;const prepared = await client.autofill({<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"TransactionType": "Payment",<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Account": standby_wallet.address,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Amount": xrpl.xrpToDrops(sendAmount),<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Destination": standbyDestinationField.value<br/>
&nbsp;&nbsp;})
&#96;&#96;&#96;

renders as

```javascript
  const prepared = await client.autofill({
    "TransactionType": "Payment",
    "Account": standby_wallet.address,
    "Amount": xrpl.xrpToDrops(sendAmount),
    "Destination": standbyDestinationField.value
  })
```

### Partials

If you have text that you use frequently, or  text that requires periodic update in a number of places in the documentation, you can create a &#95;snippet file for reuse. 

Store your file in the `_snippet` directory. To insert the partial file, use the syntax `{% partial file="<file url>" /%}`.

For example, here is the snippet `/docs/_snippets/secret-key-warning.md`.

<blockquote>
{&#37; admonition type="warning" name="Caution" &#37;}<br/>
Never submit a secret key to a server you do not control. Do not send a secret key unencrypted over the network.<br/>
{% /admonition %}
</blockquote>

To embed the text, use the tag `{% partial file="/docs/_snippets/secret-key-warning.md" /%}`.

For example:

<blockquote>
There I was, happy as a lark, skipping through the daisies, when I shyly handed my secret
 key to my one true love.

{&#37; partial file="/docs/_snippets/secret-key-warning.md" /&#37;}

Alas, if only I had heeded that sage advice, I would not rue the day as I do today.
</blockquote>

renders as:

<blockquote>
There I was, happy as a lark, skipping through the daisies, when I shyly handed my secret key to my one true love.

{% partial file="/docs/_snippets/secret-key-warning.md" /%}

Alas, if only I had heeded that sage advice, I would not rue the day as I do today.
</blockquote>

{% child-pages /%}
