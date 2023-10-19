---
html: contribute-documentation.html
parent: resources.html
blurb: Contribution guides for XRP Ledger documentation.
---
# Contribute Documentation

Thanks for considering a contribution to the XRP Ledger Developer Portal!

We're thrilled you're interested and your help is greatly appreciated. Contributing is a great way to learn about the XRP Ledger (XRPL).

We are happy to review your pull requests. To make the process as smooth as possible, please read this document and follow the stated guidelines.


## About This Site

The XRPL Dev Portal provides comprehensive documentation of the the XRP Ledger, including sample code and other information for developers to start building.

The official source repository for the site is at <https://github.com/XRPLF/xrpl-dev-portal>. Contributions are copyright their respective contributors, but must be provided under the MIT [LICENSE](https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE).



## Repository Layout

- [assets/](https://github.com/XRPLF/xrpl-dev-portal/tree/master/assets) - Static files used by the site's templates.
- [content/](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content) - Source files used to build the documentation. Mostly in Markdown.
    - [content/\_code-samples/](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples) - Code samples used or referenced by the documentation. Where possible, these are fully functional / executable scripts.
    - [content/\_img-sources/](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_img-sources) - Source files for images used in the documentation. Any `.uxf` files are diagrams made with [Umlet](https://www.umlet.com/).
    - [content/\_snippets/](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_snippets) - Reusable chunks of Markdown text that are included in other content files, using the Dactyl preprocessor.
- [img/](https://github.com/XRPLF/xrpl-dev-portal/tree/master/img) - Images used by the documentation contents.
- [template/](https://github.com/XRPLF/xrpl-dev-portal/tree/master/template) - Template files for building the HTML outputs.
- [tool/](https://github.com/XRPLF/xrpl-dev-portal/tree/master/tool) - Filters, style-checker rules, and other scripts.
- [styles/](https://github.com/XRPLF/xrpl-dev-portal/tree/master/styles) - Source files (SCSS) to generate the CSS files in the assets folder.
- [`dactyl-config.yml`](https://github.com/XRPLF/xrpl-dev-portal/blob/master/dactyl-config.yml) - Main config file, which contains the metadata for the site. For information on our conventions, see [Config Formatting](#config-formatting).

## Requirements for a Successful Pull Request

Before being considered for review or merging, each pull request must:
- Pass continuous integration tests.
- Be [marked as drafts](https://github.blog/2019-02-14-introducing-draft-pull-requests/) until they are ready for review.
- Adhere to the [code of conduct](https://github.com/XRPLF/xrpl-dev-portal/blob/master/CODE_OF_CONDUCT.md) for this repository.

## Dactyl Setup

The portal is built using [Dactyl](https://github.com/ripple/dactyl).

Dactyl requires [Python 3](https://python.org/). Install it with [pip](https://pip.pypa.io/en/stable/):

```
pip3 install dactyl
```

## Building the Site

This repo uses [**Dactyl**](https://github.com/ripple/dactyl) to build HTML display versions of all the documentation. After you've done the [Dactyl Setup](#dactyl-setup), you can build the site from the project root directory:

```
dactyl_build
```

This outputs the generated contents to the `out/` directory. These contents can be opened in a web browser as files or served as static content by a web server.

You can also run link checking or style checking from the root directory.

Link checking should be run after emptying the output folder and then building:

```
dactyl_link_checker
```

Style checking is experimental:

```
dactyl_style_checker
```

## Config Formatting

The templates in this repository use metadata from the `dactyl-config.yml` file as well as the pages' [frontmatter](https://dactyl.link/frontmatter.html) to generate navigation elements in the site, including header, footer, sidebars, and breadcrumbs.

If you add a new page, you must add it to the appropriate page in the pages array of the `dactyl-config.yml` file. An example entry looks like this:

```yaml
    -   md: concepts/the-rippled-server/the-rippled-server.md
        targets:
            - en
            - ja # Include in all targets unless you have a translation
```

The Markdown file itself should start with a frontmatter stanza such as the following:

```yaml
---
html: the-rippled-server.html
parent: concepts.html
template: pagetype-category.html.jinja
blurb: rippled is the core peer-to-peer server that manages the XRP Ledger. This section covers concepts that help you learn the "what" and "why" behind fundamental aspects of the rippled server.
---
```

Most pages should have `html`, `parent` and `blurb` fields in the frontmatter, and the `md` and `targets` fields in the config file. For a fill list

### Conventions

Use the following conventions when creating a page:

- The HTML filename and MD filename should match exactly except for the file extension.
- The filenames should closely match the title of the page, including words like "and" and "the", but should be in all lowercase with hyphens instead of spaces and punctuation. For example, `cash-a-check-for-an-exact-amount.md`. If you change the title of a page, change the filename too. (If it has already been published at another URL, leave a redirect from the old URL.)
- Always start a page with a h1 header.
- Don't link to the top h1 anchor of a page, link to the page itself without an anchor. This helps prevent broken links in translation. It's OK to link to later headers.
- Don't use any formatting (like _italics_ or `code font`) in the title of the page.
- Don't hard-wrap text in Markdown files.
- For code samples, try to keep lines no longer than 80 columns wide.
- When in doubt, follow [Ciro Santilli's Markdown Style Guide (Writability Profile)](https://cirosantilli.com/markdown-style-guide/).
- Landing pages should be in subfolders and should have the same filename as the folder. For example, the landing page of the "Accounts" page group should be `accounts/accounts.md` with the HTML filename `accounts.html`.

    **Warning:** Don't use `index.md`.

- Don't use tab characters for indentation in Markdown or code samples. Use 4 spaces per indent, except in **JavaScript** code samples, which should use 2 spaces per indent.

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

The fronmatter for a Markdown file in this repo can contain arbitrary key-value pairs; the config file entry for the page can add to those or override them. The following fields have specific uses or meaning:

| Field                | Type             | Contents                           |
|:---------------------|:-----------------|:-----------------------------------|
| `html`               | String           | Output filename for the page. Should end in `.html` and MUST be unique within the target. For translated pages, leave the filename the same as the English version page. |
| `parent`             | String           | The exact, unique `html` value of this page's "parent" page. Indicates where this page should appear in the navigation. |
| `blurb`              | String           | Human-readable summary of the page. (Plain text only.) Should be about 1 sentence long. This appears in various places, including landing pages and metadata used in unfurling links on social media. |
| `name`               | String           | Human-readable page name. (Plain text only.) For files with Markdown content, you should omit this so that Dactyl can automatically detect it from a header on the first line of the contents instead. This is usually only provided on landing pages or other special pages with no Markdown source file. |
| `template`           | String           | The filename of a template file to use (in the `template/` directory) for this page. Most pages should use the default template. The `pagetype-category.html.jinja` template shows a list of child pages at the end. Pages with special or particularly unique layouts may need individual templates (conventionally, starting with `page-`). |
| `status`             | String           | Use the value `not_enabled` on pages relating to an amendment that is not yet enabled on the XRP Ledger mainnet. This displays a "flask" badge with a tooltip next to the page in the navigation. |
| `nav_omit`           | Boolean          | Use `true` to cause this page not to appear in any navigation elements. |
| `top_nav_omit`       | Boolean          | Use `true` to cause this page not to appear in the page top dropdown navigation. |
| `top_nav_level`      | Number           | Adjust the indentation level for the page in the top nav dropdowns. Level `2` is indented to appear like a child of the page above it in the dropdown. |
| `sidebar`            | String           | Use `disabled` to hide the left and right sidebars (if the page uses a template derived from the base template) |
| `fb_card`            | String           | Filename of an image (in `assets/img/`) to use when unfurling links to this page on Facebook. |
| `twitter_card`       | String           | Filename of an image (in `assets/img/`) to use when unfurling links to this page on Twitter. |
| `redirect_url`       | String           | Use with `template: pagetype-redirect.html.jinja` only. Automatically redirect the user to the provided URL when they navigate to this page. |
| `cta_text`           | String           | Text to appear in "call to action" buttons that link to this page (on special landings). |
| `curated_anchors`    | Array of Objects | A set of anchors in this page to show, similar to child pages, in landings. Each object in the array should have a human-readable `name` field (such as `"Available Modes"`) and an `anchor` field with the HTML ID to link to (such as `"#available-modes"`). |
| `skip_spell_checker` | Boolean          | Use `true` to make the Dactyl's style checker skip spell-checking this page. |
| `filters`            | Array of Strings | A list of additional filters to use on this page. [Filters](https://github.com/ripple/dactyl/blob/master/README.md#filters) are Python scripts that provide additional pre- or post-processing of page contents. |
| `canonical_url`      | String           | Provides the canonical URL for a page that takes query parameters. Search engines and other tools may use this when linking to the page. |
| `embed_xrpl_js`      | Boolean          | Use `true` to have the latest version of [xrpl.js](https://js.xrpl.org) loaded on the page. |
