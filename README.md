ripple-dev-portal
=================

The [XRP Ledger Dev Portal](https://xrpl.org) is the authoritative source for XRP Ledger documentation, including the `rippled` server, RippleAPI, the Ripple Data API, and other open-source XRP Ledger software.


Repository Layout
-----------------

The HTML pages in this portal are generated from the markdown files in the [content/](content/) folder. Always edit the markdown files, not the HTML files. The [assets/](assets/) folder contains static files used by the site's templates. The [img](img/) folder contains images used in the docs.

The HTML files are generated using Ripple's documentation tool, called [**Dactyl**](https://github.com/ripple/dactyl). After you've done the [Dactyl Setup](#dactyl-setup), you can build the docs from the project root directory:

```
dactyl_build
```

Dactyl also provides link checking (the `dactyl_link_checker` script) and style checking (`dactyl_style_checker`), which you can run from the project root directory.

The list of which files are built, and metadata about those files, is in the `dactyl-config.yml` file. The `tool/` folder also contains the templates and style-checker rules used by Dactyl. For information on our conventions, see [Config Formatting](#config-formatting).


Dactyl Setup
------------

Dactyl uses Python 3 and a number of modules. First, make sure you have Python 3 installed in your local operating system, then use [PIP](https://pip.pypa.io/en/stable/) to install the dependencies:

`pip3 install dactyl`


Contributing
------------

The Dev Portal welcomes outside contributions, especially to the documentation contents. If you have any corrections, improvements, or expansions of the portal, please contribute pull requests to the **master** branch.

Contributions become copyright Ripple and are provided under the MIT [LICENSE](LICENSE).


Config Formatting
-----------------

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

| `name` | Human-readable page name. (Plain text only) |
| `html` | Output filename for the page. Should end in `.html` and be unique within the target. |
