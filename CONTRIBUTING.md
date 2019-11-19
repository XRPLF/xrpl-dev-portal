# Contributing

Thanks for considering a contribution to the XRP Ledger Developer Portal!


We're thrilled you're interested and your help is greatly appreciated. Contributing is a great way to learn about the XRP Ledger (XRPL).

You may also be interested in learning about [Interledger Protocol (ILP)](https://interledger.org/), which, along with XRPL, is another part of the [Xpring developer ecosystem](https://xpring.io).

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

The templates in this repository use metadata from the `dactyl-config.yml` file to generate a hierarchy of pages when navigating the generated site. To generate the appropriate navigation, you must include the proper fields in the page definitions. The following example shows a page with all fields provided:

```
-   md: concept-authorized-trust-lines.md
    funnel: Docs
    doc_type: Concepts
    category: Payment System
    subcategory: Accounts
    targets:
        - local
```

Navigation uses the fields `funnel`, `doc_type`, `category`, and `subcategory`, in that order (from broadest to most specific). At each level, the first page to have a new value is the parent or landing of that level. (For example, the parent of the "Accounts" subcategory should have the `subcategory: Accounts` field and must appear before any of its children.) For landing pages, omit the lower level fields. (For example, the "Concepts" doc_type landing should have a `doc_type` field but not a `category` field.)

**Warning:** If you make a typo in one of these fields, your page may not show up in navigation or may appear in the wrong place.

By convention, parent pages should have the same names as the hierarchy for which they are parents. (For example, the landing page for the `Payment System` category should be named `Payment System`.) The name of `md`-sourced files is automatically determined by the header in the first line of the file.

For pages that don't have markdown source content, leave out the `md` line and instead provide the following fields:

| Field  | Contents |
|:-------|:---------|
| `name` | Human-readable page name. (Plain text only) |
| `html` | Output filename for the page. Should end in `.html` and be unique within the target. |


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

The same `dactyl-config.yml` file contains an entry for each content page in the XRP Ledger Dev Portal. If a page has been translated, there is a separate entry for each translation, linked to the "target" for that translation. If a page has not yet been translated, the English version is used across all targets. For each page, the HTML filename (`html` field) and navigation fields (`funnel`, `doc_type`, `supercategory`, `category`, and `subcategory`, if supplied) should be the same across all language versions of a page. The fields that are different for translated versions of the page should be (in all cases, only if the entry uses the field):

- **`name`** - the title of the page. This is usually only provided on landing pages with no Markdown source file, or special pages using unusual templates, such as the [dev tools](https://xrpl.org/dev-tools.html). This field is typically omitted from Markdown files, because Dactyl derives the title from the header on the first line of the file.
- **`md`** - the Markdown file to use as the source content for the page. By convention, translated Markdown source files should use the same filename as the English-language version except that the file extension should be `.{language code}.md` instead of only `.md` for English. For example, Japanese translated files end in `.ja.md`
- **`blurb`** - a short summary of the page. This text is mostly used on category landing pages.

Example of English and Japanese entries for the `server_info` method page:

```yaml
    -   md: references/rippled-api/public-rippled-methods/server-info-methods/server_info.md
        html: server_info.html
        funnel: Docs
        doc_type: References
        supercategory: rippled API
        category: Public rippled Methods
        subcategory: Server Info Methods
        blurb: Retrieve status of the server in human-readable format.
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/server-info-methods/server_info.ja.md
        html: server_info.html
        funnel: Docs
        doc_type: References
        supercategory: rippled API
        category: Public rippled Methods
        subcategory: Server Info Methods
        blurb: rippledサーバーについての各種情報を、人間が読めるフォーマットでサーバーに要求します。
        targets:
            - ja
```

Example entry for a page that isn't translated:

```yaml
    -   md: concepts/payment-system-basics/transaction-basics/source-and-destination-tags.md
        html: source-and-destination-tags.html
        funnel: Docs
        doc_type: Concepts
        category: Payment System Basics
        subcategory: Transaction Basics
        blurb: Use source and destination tags to indicate specific purposes for payments from and to multi-purpose addresses.
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
