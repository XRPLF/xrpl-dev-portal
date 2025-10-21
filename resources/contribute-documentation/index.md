---
metadata:
    indexPage: true
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
- `@l10n` - Translations into languages other than English. See [Documentation Translations](./documentation-translations.md) for details.
- `@theme` - Overrides and custom components used in Markdoc contents as well as custom React pages.
- `about/` - Source files for the About section's pages.
- `blog/` - Source files for the XRPL Dev Blog.
- `community/` - Source files for the Community section's pages.
- `docs/` - Source files used to build the documentation. Mostly in Markdown.
    - `docs/_snippets/` - Reusable pieces of text used in the documentation.
    - `docs/img/` - Diagrams and other images used in the documentation. Diagrams can also be placed in the folder with the files that reference them.
    - `docs/img/_sources/` - Source files for images used in the documentation, where available.
- `resources/` - Source files for the Resources section's pages.
- `shared/` - Configuration files for some dependencies like CodeMirror, and React components for some specially styled pages.
- `static/` - Static files used by the site's templates and theme.
- `styles/` - SCSS source files for custom CSS.
- `redirects.yaml` - Definitions of redirects from old site URLs to current paths.
- `redocly.yaml` - Main config file for the site.
- `sidebars.yaml` - Defines sidebars for the Documentation and Resources sections.
- `top-nav.yaml` - Defines the main top nav elements.


## Requirements for a Successful Pull Request

Before being considered for merging, each pull request must:

1. Pass continuous integration tests.
2. Adhere to the [code of conduct](https://github.com/XRPLF/xrpl-dev-portal/blob/master/CODE-OF-CONDUCT.md) for this repository.
3. Pass review from at least one maintainer, who will consider the quality, relevance, and maintainability of the contents in their review.

If your PR is not yet ready to be merged, [mark it as a draft](https://github.blog/2019-02-14-introducing-draft-pull-requests/).

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

## Writing Style

In general, follow the [Microsoft Style Guide](https://learn.microsoft.com/en-us/style-guide/)'s recommendations for tone, phrasing, and structure. You are allowed to deviate from the Microsoft guide.

Try to split documentation pages into the following categories, based on their contents:

- **Concepts:** Explain the _how_ and _why_ of a topic, feature, or practice. Don't go overboard with specific names, values, or code. Use [diagrams](./creating-diagrams.md) to help with understanding.
- **References:** Describe all the possible properties, modes, or features of a piece of technology. Provide only small amounts of context, while linking to concepts for the bigger picture. Use tables or bulleted lists, sorted, to help users find what they need.
- **Tutorials:** Demonstrate how to accomplish a task or use a feature. Provide step-by-step instructions with working code samples if possible. Link to references for more details of the functions used and alternative options. For more recommendations on how to build tutorials, see the [Tutorial Guidelines](./tutorial-guidelines.md).

These types of documents serve people with different roles, or sometimes the same people at different points in their process. For example, software architects or CTOs making technical decisions might read a concept page to decide how to structure their integration or to determine which technology meets their needs; engineers might copy code from tutorials while building, then use the reference to adapt it for their use case.

Some pages, like **Use Cases**, don't fit cleanly into these categories. It is OK to have exceptions where justified.

### Interlinking

Linking is useful for readers, who may arrive at any page in any order, without full context. Links in the body text help humans navigate through the site, since it's common to end up on a page that does not actually have the information you are looking for, but is related in some way to the page that does; links can send people to the right place while also building an understanding of the relationship between pieces of the whole. Frequent usage of links also helps machines point people at the right place, both in terms of search engine optimization and generative engine (AI) optimization.

Links commonly fall into these categories:

- _external links_ go to other sites. These should be used sparingly and clearly indicated; otherwise, suddenly ending up on a different site can be jarring. External links may open in a new tab or window; non-external links should always stay within the same tab.
- _deep links_ go into greater detail than the current page, explaining a topic or option with more specifics. They are called "deep" links because the pages they link to typically exist at a level that is deeper into the site's hierarchical navigation and information architecture. Deep links are commonly introduced with a phrase such as, "For more information about {topic}," or placed in a "See Also" section at the bottom of a page, but that is not always necessary.
- _backlinks_ provide background information or context for understanding the current page. They are called "back" links because they typically send readers "back" to shallower levels of the information architecture instead of following the typical progression of knowledge.

Links can and should be used regularly, but without going overboard. Some additional guidelines:

- In the first paragraph or even first sentence of any reference page, include a backlink to a concept page that provides more context about when and why that reference may be used.
- When using a keyword that may need some explanation, to link the first instance of that keyword back to a concept page that explains it. Don't make every instance of the keyword into a link, which is overkill and distracting, but you may want to link it again if it comes up again in a separate section of the same page, especially if readers are likely to jump ahead to a specific section rather than reading straight through from the first mention to the later one.
- On concept pages that are in the shallower parts of the information architecture, use caution when putting deep links into the text body. Readers may interpret these as backlinks, implying that they need additional background reading to understand the current section, interrupting the flow of information from simpler to more advanced. It is OK to use deep links in concepts when introduced with a warning phrase such as "For more information," or when context makes it clear that it is a deep link—for example, when saying that users can use a particular transaction type to accomplish a certain goal, it is appropriate to use a deep link to the transaction type reference documentation.

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

When documenting a new feature, include a [badge](./markdoc-tags.md#badge) indicating the version of the program when the feature was introduced. It is a best practice to remove any new/updated badges more than 2 years old.

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

Frontmatter for Markdown files can include details such as the following:

```yaml
---
metadata:
    indexPage: true # Use if you want to use the {% child-pages /%} macro to display a list of page children
seo:
    description: Transact with confidence using the XRP Ledger's suite of compliance features for following government regulations and security practices.
---
```

Some pages in the site have leftover metadata from the previous (Dactyl) toolchain, such as `html`, `parent`, or `targets` fields. These fields have no effect and can be removed. For a reference of frontmatter fields that are supported by the current (Redocly) toolchain, see [Front matter configuration options (Realm docs)](https://redocly.com/docs/realm/config/front-matter-config).

Usually, you should not specify a title in the frontmatter, but you might use the `seo` field's `title` sub-field (see below) for non-Markdown pages or when recommended for search engine optimization.

### seo.title, default title, and sidebar label

Every markdown page should have an h1 on the first line of the markdown contents, such as this:

```
# What is XRP?
```

By default, the text of this title is used as the title of the page. You don't need to specify a title separately in the frontmatter, especially since someone might change it in one place and forget to update the other. Sometimes pages have a longer title in the frontmatter's `seo.title` field, for purposes of search engine optimization (SEO). These titles are usually longer and optimized to include phrases or search terms that are likely to match queries people might type while looking for the page. **Titles in the frontmatter should only be used when recommended for SEO.** For example:

```
---
seo:
    title: What is XRP and Why is it Valuable?
---
```

A third place a page might have a title is in a `label` field in the `sidebars.yaml` file. This should always come with a translation key in the `labelTranslationKey` field. Labels in the `sidebars.yaml` file should only be used in these cases:

- To provide a translatable title for a `.page.tsx` file.
- To shorten an SEO title so that it fits better in the sidebar. In this case, the label contents should match the original h1 title.

For example:

```
- page: docs/introduction/what-is-xrp.md
  label: What is XRP?
  labelTranslationKey: sidebar.docs.introduction.what-is-xrp
```

For reference, here's the hierarchy that determines which title gets used where:

| Location | Which title it uses |
|----------|---------------------|
| `<title>` element (the text that displays in the tab name and the title bar of your browser, if it has one) | `seo.title`, falling back to md h1 |
| `<meta name="title" ...>`, `<meta name="og:title" ...>`, `<meta name="twitter:title" ...>` and so on in the `<head>` of the page, which are used when "unfurling" a link (showing a preview) in various chat and social media apps like Discord, Slack, or X (Twitter) | `seo.title`, falling back to md h1 |
| Sidebar navigation | `label` from `sidebars.yaml`, then `seo.title`, and finally md h1 |
| In-page header, that is, the big text in the center column | md h1 only |


### Next and Previous Buttons

The documentation and blog pages have "Next" and "Previous" buttons at the bottom of the page. 

If these buttons don't make sense as a proper reading order in context you can disable them by updating the frontmatter of the page. 

```yaml
---
navigation:
  nextButton:
    hide: true
---
```

## Graphics

Store your graphics in the `/docs/img` directory. Embed graphics using the syntax:

`![image_description](/docs/img/my_image.png)`

For example, `![XRPL X mark](/static/img/xrp-x-logo.png)` renders as follows.

![XRPL X mark](/static/img/xrp-x-logo.png)

## Videos

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

## Tables

Use Markdown tables liberally. Tables are a good way to convey possible options, especially in reference documentation.

The GitHub Flavored Markdown syntax uses the pipe character (|) to separate columns and three or more hyphens (---) to create the column headers. For example:

```
| Key | Value |
|-----|-------|
| Name | H. G. Wells |
| Genre | Science Fiction |
| Hyperbole | The greatest story ever told! No one has ever written anything more important than this Victorian era classic. Oh, how swells the heart to ponder the heady philosophies introduced therein! |
```

This table displays as follows:

| Key | Value |
|-----|-------|
| Name | H. G. Wells |
| Genre | Science Fiction |
| Hyperbole | The greatest story ever told! No one has ever written anything more important than this Victorian era classic. Oh, how swells the heart to ponder the heady philosophies introduced therein! |

The cells do not have to be the same width. The renderer aligns the columns and wraps text as needed. However, it is often helpful for editors if you align the columns of the table in the markdown source file.

Optionally, use colons in the heading lines to align columns left (:--), middle (:-:), or right (--:). For example:

```
| Model    | Color | Price |
|:--------:|:------|------:|
| Protexra | Electric Blue | 50,000 XRP |
| Joatic | Hot Pink | 165,000 XRP |
| Zhanu | Neon Green | 234,000 XRP |
```

| Model    | Color | Price |
|:--------:|:------|------:|
| Protexra | Electric Blue | 50,000 XRP |
| Joatic | Hot Pink | 165,000 XRP |
| Zhanu | Neon Green | 234,000 XRP |


## Links

Links use the syntax `[<link text>](<url>)`.

For example, the sentence:

`See [XRPL.org](http://xrpl.org) for solutions to all the world's problems.`

renders to:

See [XRPL.org](http://xrpl.org) for solutions to all the world's problems.

### Common Links

To make it easier to link to pages that are commonly cited, you can add a `{% raw-partial file="/docs/_snippets/common-links.md /%}` tag to a Markdown file, and then use centrally defined reference-style links such as `[account_info method][]` or `[Payment transaction][]`. The contents of the common-links file are in alphabetical order. (They were first generated by script, but are maintained manually.)

## Code Samples

Format method names and other code structures inline enclosing the code in backtick (&#96;) characters. For example:

> My favorite method ever is &#96;nft_info&#96;.

renders as

> My favorite method ever is `nft_info`.

For longer code blocks, use three backtics (&#96;&#96;&#96;) followed by the language name. Type a return, and enter the sample code. At the end of your code sample, type a return and close the block again with three backticks (&#96;&#96;&#96;).

For example:

<pre><code>
```javascript
const prepared = await client.autofill({
    "TransactionType": "Payment",
    "Account": standby_wallet.address,
    "Amount": xrpl.xrpToDrops(sendAmount),
    "Destination": standbyDestinationField.value
})
```
</code></pre>

renders as

```javascript
  const prepared = await client.autofill({
    "TransactionType": "Payment",
    "Account": standby_wallet.address,
    "Amount": xrpl.xrpToDrops(sendAmount),
    "Destination": standbyDestinationField.value
  })
```

## Markdoc Tags

The files are processed with [Markdoc](https://markdoc.dev/), which means they can contain special tags in `{% ... %}` syntax. In addition to Redocly's built-in tags, this repository has some custom tags. For details on markdoc tags and their usage, see [Markdoc Tags](./markdoc-tags.md).

## More Contributor Documentation

{% child-pages /%}
