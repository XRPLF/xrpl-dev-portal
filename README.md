ripple-dev-portal
=================

The [Ripple Developer Portal](https://dev.ripple.com) is the authoritative source for Ripple documentation, including the `rippled` server, RippleAPI, the Ripple Data API, and other Ripple open-source software.


Repository Layout
-----------------

The HTML pages in this portal are generated from the markdown files in the [content/](content/) folder. Always edit the markdown files, not the HTML files. The [assets/](assets/) folder contains static files used by the site's templates. The [img](img/) folder contains images used in the docs.

The HTML files are generated using Ripple's documentation tool, called [**Dactyl**](https://github.com/ripple/dactyl). After you've done the [Dactyl Setup](#dactyl-setup), you can build the docs from the `tool/` folder:

```
cd tool
dactyl_build
```

Dactyl also provides link checking (the `dactyl_link_checker` script) and style checking (`dactyl_style_checker`), which you can run from the `tool/` folder.

The list of which files are built, and metadata about those files, is in the `tool/dactyl-config.yml` file. The `tool/` folder also contains the templates and style-checker rules used by Dactyl.


Dactyl Setup
------------

Dactyl uses Python 3 and a number of modules. First, make sure you have Python 3 installed in your local operating system, then use [PIP](https://pip.pypa.io/en/stable/) to install the dependencies:

`pip3 install dactyl`


Contributing
------------

The Developer Portal welcomes outside contributions, especially to the documentation contents. If you have any corrections, improvements, or expansions of the portal, please contribute pull requests to the **master** branch.

Contributions become copyright Ripple and are provided under the MIT [LICENSE](LICENSE).
