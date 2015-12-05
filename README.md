ripple-dev-portal
=================

The [Ripple Developer Portal](https://dev.ripple.com) is the authoritative source for Ripple documentation, including the `rippled` server, RippleAPI, the Ripple Data API, and other Ripple software.


Repository Layout
-----------------

The HTML pages in this portal are generated from the markdown files in the [content/](content/) folder.

The [tool/](tool/) folder contains tools and templates for generating the HTML files in the top level. The `parse_pages.py` script (requires Python 3, [Jinja 2](http://jinja.pocoo.org/), and various pip modules) uses the templates and the [pages.json](tools/pages.json) file to generate all the HTML files on the top level. Files with "md" properties are considered documentation pages and appear in the appropriate lists. In general, `parse_pages.py` assumes you are running it with `tool/` as the current working directory.

There are a few modes for generating pages:

* By default, parses the Markdown and generates all the HTML files for a locally-hosted environment.
    * Local markdown files are pre-processed using Jinja so you they can have conditional logic
    * You can also remotely reference a markdown file via URL. Such files are not pre-processed, though.
* Build for a specific target (e.g. `./parse_pages.py -t ripple.com`). Replaces local links with alternate versions for the target, uncomments multi-code divs (if target needs them for multi-code tabs), and performs various other cleanup.
* Watch for changes and re-build the HTML files automatically when changes occur. Example: `./parse_pages.py -w`
* Output empty HTML files and use [Flatdoc](ricostacruz.com/flatdoc/) to parse the markdown in-browser. Requires that you host the dev portal in a web server (e.g. Apache), not just open the HTML files in a browser. Example: `./parse_pages.py --flatdoc`
* Output a modified markdown file for GitHub (e.g. for sending changes back upstream). (Builds for a target, but stops at markdown instead of HTML.) e.g. `./parse_pages.py -t ripple.com -g data_v2.md > /tmp/data_v2_githubified.md`
* PDF output using [Prince](http://www.princexml.com/). Use `./parse_pages.py --pdf some_out_file.pdf`. Experimental.

To add more pages to the Dev Portal, simply modify `pages.json` and then run `parse_pages.py` again. For full usage, run `parse_pages.py --help`.


Contributing
------------

The Developer Portal welcomes outside contributions, especially to the documentation contents. If you have any corrections, improvements, or expansions of the portal, please contribute pull requests to the **gh-pages** branch.

Contributions become copyright Ripple, Inc. and are provided under the MIT [LICENSE](LICENSE).

