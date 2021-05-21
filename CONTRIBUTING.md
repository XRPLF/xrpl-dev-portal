# Contributing

Thanks for considering a contribution to the XRP Ledger Developer Portal!


We're thrilled you're interested and your help is greatly appreciated. Contributing is a great way to learn about the XRP Ledger (XRPL).

You may also be interested in learning about [Interledger Protocol (ILP)](https://interledger.org/), which, along with XRPL, is another part of the RippleX developer ecosystem.

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
- [tool/](tool/) - Templates, style-checker rules, and other scripts.
- [styles/](styles/) - Source files (SCSS) to generate the CSS files in the assets folder.
- [`dactyl-config.yml`](dactyl-config.yml) - Main config file, which contains the metadata for all the docs. For information on our conventions, see [Config Formatting](#config-formatting).

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

This repo uses [**Dactyl**](https://github.com/ripple/dactyl) to build HTML display versions of all the documentation. After you've done the [Dactyl Setup](#dactyl-setup), you can build the docs from the project root directory:

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
template: template-landing-children.html
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
| `template`           | String           | The filename of a template file to use (in the `tool/` directory) for this page. Most pages should use the default template. The `template-landing-children.html` page shows a list of child pages at the end. Pages with special or particularly unique layouts may need custom templates. |
| `status`             | String           | Use the value `not_enabled` on pages relating to an amendment that is not yet enabled on the XRP Ledger mainnet. This displays a "flask" badge with a tooltip next to the page in the navigation. |
| `nav_omit`           | Boolean          | Use `true` to cause this page not to appear in any navigation elements. |
| `top_nav_omit`       | Boolean          | Use `true` to cause this page not to appear in the page top dropdown navigation. |
| `top_nav_level`      | Number           | Adjust the indentation level for the page in the top nav dropdowns. Level `2` is indented to appear like a child of the page above it in the dropdown. |
| `sidebar`            | String           | Use `disabled` to hide the left and right sidebars (if the page uses a template derived from the base template) |
| `fb_card`            | String           | Filename of an image (in `assets/img/`) to use when unfurling links to this page on Facebook. |
| `twitter_card`       | String           | Filename of an image (in `assets/img/`) to use when unfurling links to this page on Twitter. |
| `redirect_url`       | String           | Use with `template: template-redirect.html` only. Automatically redirect the user to the provided URL when they navigate to this page. |
| `cta_text`           | String           | Text to appear in "call to action" buttons that link to this page (on special landings). |
| `curated_anchors`    | Array of Objects | A set of anchors in this page to show, similar to child pages, in landings. Each object in the array should have a human-readable `name` field (such as `"Available Modes"`) and an `anchor` field with the HTML ID to link to (such as `"#available-modes"`). |
| `skip_spell_checker` | Boolean          | Use `true` to make the Dactyl's style checker skip spell-checking this page. |
| `filters`            | Array of Strings | A list of additional filters to use on this page. [Filters](https://github.com/ripple/dactyl/blob/master/README.md#filters) are Python scripts that provide additional pre- or post-processing of page contents. |
| `canonical_url`      | String           | Provides the canonical URL for a page that takes query parameters. Search engines and other tools may use this when linking to the page. |
| `embed_ripple_lib`   | Boolean          | Use `true` to have the latest version of ripple-lib and its dependencies loaded on the page. |

### Conventions

Use the following conventions when creating a page:

- The HTML filename and MD filename should match exactly except for the file extension.
- The filenames should closely match the title of the page, including words like "and" and "the", but should be in all lowercase with hyphens instead of spaces and punctuation. For example, `cash-a-check-for-an-exact-amount.md`. If you change the title of a page, change the filename too. (If it has already been published at another URL, leave a redirect from the old URL.)
- Always start a page with a h1 header.
- Don't use any formatting (like _italics_ or `code font`) in the title of the page
- When in doubt, follow [Ciro Santilli's Markdown Style Guide (Writability Profile)](https://cirosantilli.com/markdown-style-guide/).
- Landing pages should be in subfolders and should have the same filename as the folder. For example, the landing page of the "Accounts" page group should be `accounts/accounts.md` with the HTML filename `accounts.html`. **Don't** use `index.md`.


## Translations

The XRP Ledger Dev Portal is mostly written in English, so the English version is generally the most up-to-date and accurate version. However, to broaden the reach of the XRP Ledger software and community, this repository also contains translated versions of the documentation. We strongly encourage members of the community who understand other languages to contribute translations of the dev portal contents in their native languages.

The `dactyl-config.yml` contains a "target" entry for each available language. (As of 2019-11-18, the available languages are English and Japanese.) This entry includes a dictionary of strings used in the template files. For example:

```yaml
-   name: en
    lang: en
    display_name: XRP Ledger Dev Portal
    # These github_ fields are used by the template's "Edit on GitHub" link.
    #  Override them with --vars to change which fork/branch to edit.
    github_forkurl: https://github.com/ripple/xrpl-dev-portal
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
    -   md: references/rippled-api/public-rippled-methods/server-info-methods/server_info.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/server-info-methods/server_info.ja.md
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

If you want to translate the XRP Ledger Dev Portal into your native language of choice, start with the [XRP Ledger Overview file](https://github.com/ripple/xrpl-dev-portal/blob/master/content/concepts/introduction/xrp-ledger-overview.md), which describes the core properties and functions of the XRP Ledger.

Save the file as `xrp-ledger-overview.{language code}.md`, where `{language code}` is the [IETF BCP47](https://tools.ietf.org/html/bcp47) language code. (For example, "es" for Spanish, "ja" for Japanese, "zh-CN" for Simplified Chinese, "zh-TW" for Traditional Chinese as used in Taiwan, and so on.) Then open a [pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests) adding your file to this repository. One of the repository's maintainers can help with the other necessary setup to add the language to the site.

For the Markdown content files, please use the following conventions:

- Line-feed newline characters (`\n`) only (Unix style). Do not use carriage return (`\r`) characters (Windows style).
- Use UTF-8 encoding. Avoid the use of Byte-order marks.
