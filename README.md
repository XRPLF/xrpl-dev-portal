ripple-dev-portal
=================

The [Ripple Developer Portal](https://dev.ripple.com) is the authoritative source for Ripple documentation, including the `rippled` server, Ripple-REST API, Gatewayd, and other Ripple software.


Repository Layout
-----------------

The pages in this portal are generated from the markdown files in the [content/](content/) folder.

You can run your own local copy of the Dev Portal by hosting it in a web server, such as Apache. By default, the Dev Portal uses static HTML pages and client-side JavaScript (specifically, [Flatdoc](http://ricostacruz.com/flatdoc/)) to parse and display the Markdown content on the fly.

The [tool/](tool/) folder contains tools and templates for generating the HTML files in the top level. The `parse_pages.py` script (Python 3 and [Jinja 2](http://jinja.pocoo.org/) required) uses the templates and the [pages.json](tools/pages.json) file to generate all the HTML files on the top level. Files with "md" properties are considered documentation pages and appear in the appropriate lists. There are two modes for generating pages:

* The default, dynamic pages. Generates thin HTML wrappers for each page and uses Flatdoc to load and parse the contents. Great for development since a refresh automatically picks up changes to the md files.
* Pre-compiled pages. Requires [Pandoc](http://johnmacfarlane.net/pandoc/). Parses the Markdown all at once and puts the contents directly into the HTML body of each file. Still experimental.

To add more pages to the Dev Portal, simply modify `pages.json` and then run `parse_pages.py` again.


Contributing
------------

The Developer Portal welcomes outside contributions, especially to the documentation contents. If you have any corrections, improvements, or expansions of the portal, please contribute pull requests to the **gh-pages** branch.

Contributions become copyright Ripple Labs and are provided under the MIT [LICENSE](LICENSE).

