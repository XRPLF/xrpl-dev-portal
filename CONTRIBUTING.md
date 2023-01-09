# Contributing

Thanks for considering a contribution to the XRP Ledger Developer Portal!


We're thrilled you're interested and your help is greatly appreciated. Contributing is a great way to learn about the XRP Ledger (XRPL).


We are happy to review your pull requests. To make the process as smooth as possible, please read this document and follow the stated guidelines.

Contributions become copyright the XRP Ledger Project and are provided under the MIT [LICENSE](LICENSE).


## About This Site

The XRPL Dev Portal provides comprehensive documentation of the the XRP Ledger, including sample code and other information for developers to start building.

## Repository Layout

- [assets/](assets/) - Static files used by the site's templates.
- [content/](content/) - Source files used to build the documentation. Mostly in Markdown.
    - [content/\_code-samples/](content/_code-samples/) - Code samples used or referenced by the documentation. Where possible, these are fully functional / executable scripts.
    - [content/\_img-sources/](content/_img-sources/) - Source files for images used in the documentation. Any `.uxf` files are diagrams made with [Umlet](https://www.umlet.com/).
    - [content/\_snippets/](content/_snippets/) - Reusable chunks of Markdown text that are included in other content files, using the Dactyl preprocessor.
- [img/](img/) - Images used by the documentation contents.
- [template/](template/) - Template files for building the HTML outputs.
- [tool/](tool/) - Filters, style-checker rules, and other scripts.
- [styles/](styles/) - Source files (SCSS) to generate the CSS files in the assets folder.
- [`dactyl-config.yml`](dactyl-config.yml) - Main config file, which contains the metadata for the site. For information on our conventions, see [Config Formatting](#config-formatting).

## Requirements for a Successful Pull Request

Before being considered for review or merging, each pull request must:
- Pass continuous integration tests.
- Be [marked as drafts](https://github.blog/2019-02-14-introducing-draft-pull-requests/) until they are ready for review.
- Adhere to the [code of conduct](CODE_OF_CONDUCT.md) for this repository.

## Dactyl Setup

The portal is built using [Dactyl](https://github.com/ripple/dactyl).

Dactyl requires [Python 3](https://python.org/). Install it with [pip](https://pip.pypa.io/en/stable/):

`sudo pip3 install dactyl
`

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

At a minimum, most pages should have `html`, `parent` and `blurb` fields (plus the `md` and `targets` fields in the config file). You can put any key-value pairs here or in the config file entry for the page, but the following ones are relevant:


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

### Conventions

Use the following conventions when creating a page:

- The HTML filename and MD filename should match exactly except for the file extension.
- The filenames should closely match the title of the page, including words like "and" and "the", but should be in all lowercase with hyphens instead of spaces and punctuation. For example, `cash-a-check-for-an-exact-amount.md`. If you change the title of a page, change the filename too. (If it has already been published at another URL, leave a redirect from the old URL.)
- Always start a page with a h1 header.
- Don't use any formatting (like _italics_ or `code font`) in the title of the page
- When in doubt, follow [Ciro Santilli's Markdown Style Guide (Writability Profile)](https://cirosantilli.com/markdown-style-guide/).
- Landing pages should be in subfolders and should have the same filename as the folder. For example, the landing page of the "Accounts" page group should be `accounts/accounts.md` with the HTML filename `accounts.html`. **Don't** use `index.md`.
- Don't use tab characters for indentation in Markdown or code samples. Use **4 spaces per indent**, except in **JavaScript** code samples, which should use 2 spaces per indent.

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
| a NFToken         | NFT, an NFToken | A NFToken object in the XRP Ledger tracks or represents a non-fungible token. Pronounced "nif-token" and written _a NFToken_ rather than _an NFToken_ |
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


## Translations

The XRP Ledger Dev Portal is mostly written in English, so the English version is generally the most up-to-date and accurate version. However, to broaden the reach of the XRP Ledger software and community, this repository also contains translated versions of the documentation. We strongly encourage members of the community who understand other languages to contribute translations of the dev portal contents in their native languages.

The `dactyl-config.yml` contains a "target" entry for each available language. (As of 2019-11-18, the available languages are English and Japanese.) This entry includes a dictionary of strings used in the template files. For example:

```yaml
-   name: en
    lang: en
    display_name: XRP Ledger Dev Portal
    # These github_ fields are used by the template's "Edit on GitHub" link.
    #  Override them with --vars to change which fork/branch to edit.
    github_forkurl: https://github.com/XRPLF/xrpl-dev-portal
    github_branch: master
    strings:
        blog: "Blog"
        search: "Search site with Google..."
        bc_home: "Home"
        # ...
```

There is also a top-level `languages` listing that defines some properties for each supported language. The short code for each language should be short code according to [IETF BCP47](https://tools.ietf.org/html/bcp47). For example, "en" for English, "es" for Spanish, "ja" for Japanese, "zh-CN" for Simplified Chinese, "zh-TW" for Traditional Chinese (as used in Taiwan), and so on. The `display_name` field defines the language's name as written natively in that language. The `prefix` field defines a prefix to be used in hyperlinks to that language's version of the site. Example `languages` definition:

```yaml
languages:
    -   code: en
        display_name: English
        prefix: "/"
    -   code: ja
        display_name: 日本語
        prefix: "/ja/"
```

The same `dactyl-config.yml` file contains an entry for each content page in the XRP Ledger Dev Portal. If a page has been translated, there is a separate entry for each translation, linked to the "target" for that translation. If a page has not yet been translated, the English version is used across all targets.

By convention, a page's the HTML filename (`html` field) should be the same across all language versions of a page. Translated Markdown source files should use the same filename as the English-language version except that the file extension should be `.{language code}.md` instead of only `.md` for English. For example, Japanese translated files end in `.ja.md`
- **`blurb`** - a short summary of the page. This text is mostly used on category landing pages.

Example of English and Japanese entries for the `server_info` method page:

```yaml
    -   md: references/http-websocket-apis/public-api-methods/server-info-methods/server_info.md
        targets:
            - en

    -   md: references/http-websocket-apis/public-api-methods/server-info-methods/server_info.ja.md
        targets:
            - ja
```

Example entry for a page that isn't translated:

```yaml
    -   md: concepts/payment-system-basics/transaction-basics/source-and-destination-tags.md
        targets:
            - en
            - ja
```

### Where to Start

If you want to translate the XRP Ledger Dev Portal into your native language of choice, start with the [XRP Ledger Overview file](https://github.com/XRPLF/xrpl-dev-portal/blob/master/content/concepts/introduction/xrp-ledger-overview.md), which describes the core properties and functions of the XRP Ledger.

Save the file as `xrp-ledger-overview.{language code}.md`, where `{language code}` is the [IETF BCP47](https://tools.ietf.org/html/bcp47) language code. (For example, "es" for Spanish, "ja" for Japanese, "zh-CN" for Simplified Chinese, "zh-TW" for Traditional Chinese as used in Taiwan, and so on.) Then open a [pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests) adding your file to this repository. One of the repository's maintainers can help with the other necessary setup to add the language to the site.

For the Markdown content files, please use the following conventions:

- Line-feed newline characters (`\n`) only (Unix style). Do not use carriage return (`\r`) characters (Windows style).
- Use UTF-8 encoding. Avoid the use of Byte-order marks.


## Theme-Aware Diagrams

The site contains code to automatically recolor SVG diagrams for light and dark mode. This is more than just inverting images. The recoloring keeps gradients going the same direction (so that things don't look bottom-lit) and replaces colors with equivalents that fit with the theme rather than their inverse. For example, "Ripple blue" gets recolored to XRPL green, not its inverse orange. Example:

![Comparison of invert and theme-aware recoloring](./theme-aware-recolor.png)

Theme-aware recoloring uses a single source file in SVG format for diagrams, and produces diagrams that are recolored to match the current theme (light/dark) using CSS. If the user changes their theme, the diagrams immediately change to match it.

To include a theme-aware diagram in a document, use the `include_svg` filter with syntax such as the following:

```jinja
{{ include_svg("img/anatomy-of-a-ledger-complete.svg", "Figure 1: XRP Ledger Elements") }}
```

Leave empty lines before and after this syntax. The SVG file in question should be in the [`img/`](./img/) folder at the top level of the repo, or a subfolder of it. The second argument is _title text_, which appears when the user hovers their mouse over the diagram, and can also be used by other software (such as screen readers) to caption the diagram.

The resulting SVG file is inlined directly into the Markdown file. One limitation is that you can't use it inside other Markdown structures such as bulleted lists or tables.

> **Note:** The filter source code is [`tool/filter_include_svg.py`](./tool/filter_include_svg.py). This is also the reason that `lxml` is one of the dependencies for building the site.

### Making Diagrams

You have to take care when creating diagrams so that the recoloring applies correctly; otherwise, some elements might be invisible (white-on-white or black-on-black, for example) when recolored for the other theme. The theme-aware diagrams code supports diagrams created using either [Umlet](https://www.umlet.com/) or [Google Draw](https://docs.google.com/drawings/) and exported as SVG. Additionally, you should follow these guidelines when making diagrams:

0. Create diagrams for light mode by default. Use a transparent background color.
0. Only use colors that the theme-aware diagrams code has mappings for. The code for this, including the full list of colors, is in [`styles/_diagrams.scss`](./styles/_diagrams.scss). If needed, you can add new colors by extending the SCSS code. (Don't forget to re-export the CSS when you're done. See the [styles README](./styles/README.md).)
0. Use actual vector shapes instead of embedded icons/images whenever possible. If you need to put text on top of an image, add a solid background to the text element and use one of the colors the theme has mappings for.
0. Don't layer transparent elements containing text on top of elements with different background colors. Apply a background color directly to the element that contains the text.
