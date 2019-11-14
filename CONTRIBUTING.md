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
