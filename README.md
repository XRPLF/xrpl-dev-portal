ripple-dev-portal
=================

The [Ripple Developer Portal](https://dev.ripple.com) is the authoritative source for Ripple documentation, including the `rippled` server, RippleAPI, the Ripple Data API, and other Ripple open-source software.


Repository Layout
-----------------

The HTML pages in this portal are generated from the markdown files in the [content/](content/) folder. Always edit the markdown files, not the HTML files.

The [tool/](tool/) folder contains a tool, called **Dactyl**, for generating the HTML files in the top level. The `dactyl_build.py` script uses the templates and the a YAML config file to generate HTML output. The `dactyl_link_checker.py` script checks the generated HTML content for broken links. The `dactyl_style_checker.py` script (experimental) checks the content for style guide violations.

In general, Dactyl assumes you are running it with `tool/` as the current working directory, and the included config uses the top level of this repository as the output directory.

Dactyl Setup
------------

Dactyl uses Python 3 and a number of modules. First, make sure you have Python 3 installed in your local operating system, then use [PIP](https://pip.pypa.io/en/stable/) to install the dependencies:

`pip3 install -r tool/packages.txt`


Building
--------

The default configuration is [`dactyl-config.yml`](tool/dactyl-config.yml). You can specify an alternate config file with the `-c` or `--config` parameter:

`./dactyl_build.py -c alt-config.yml`
`./dactyl_link_checker.py -c alt-config.yml`

This script does the following:

1. Chooses a target based on the commandline `-t` parameter. If not specified, uses the first target listed in the config file. If building for PDF, add the `--pdf your_output_file.pdf` parameter (The output filename must end in `.pdf`!)
2. Reads the list of **pages** from the config.
3. For all pages that have a filename as the `md` parameter in the config, it reads the file from the configured **content_path** and "preprocesses" any [Jinja2 Templating Language](http://jinja.pocoo.org/docs/dev/templates/) statements in those files. The markdown files can use this opportunity to include other files, or include or exclude content based on the `target` and `pages` parameters.
4. For all pages that have a URL as the `md` parameter, it fetches the file via HTTP(S). No pre-processing occurs on such contents.
5. For all the retrieved and preprocessed markdown files, it parses them using Python's markdown library, with extras enabled to approximate GitHub-flavored markdown.
6. For each page, it parses the **template** configured for the page using Jinja2, falling back to the **default_template** (or **pdf_template**). If it produced HTML from a Markdown source, it passes that HTML as the `content` parameter to the template. It also passes in several other arguments from the config file, including definition of the current page as the `currentpage` parameter.
7. It applies several post-processing steps on the generated HTML. Additional [filters](#filters) can be configured as plugins to run on a per-page or per-target basis. Dactyl always performs link substitution by target.
8. If building for PDF: It outputs the resulting HTML files to the configured **temporary_files_path**, using filenames specified in the **html** parameter of each page in the config file. It also copies the **template_static_path** and **content_static_path** folders to the temporary folder. Then it runs [Prince](http://www.princexml.com/) to generate a PDF. It writes the generated PDF to the **out_path**.
9. Otherwise: It outputs the resulting HTML files to the **out_path**. This does not generate a working copy of the site unless the necessary static files are also available at the **out_path**. (This is true by default, since the default output directory is the top level of the repository.) You can have it copy the configured **template_static_path** (containing files referenced by the templates) and the **content_static_path** (containing files referenced by the content) to the output directory using the `--copy_static` or `-s` parameter.


Githubify Mode
--------------

Alternate usage: `-g` produces a GitHub-flavored Markdown version of a single file. This parameter takes one argument, which should be a markdown file in the **content_path**. The tool uses Jinja2 to "preprocess" the file, as above, but stops after assembling GitHub-flavored Markdown and writes the output to the same filename in the **out_path**.

**Note:** The tool never erases files from the **out_path** or the **temporary_files_path**. You may want to do that yourself, especially if you remove files from your config or rename them.

Ad-Hoc Targets
--------------

If you want to build output without editing the config file, you can use the `--pages` option, following that with a list of input markdown files. (The `--pages` option is incompatible with the `-t` option.) In this case, Dactyl creates an "ad-hoc" target for the page(s) specified. It includes the `index.html` file (PDF cover in PDF mode) in the ad-hoc target unless you specify `--no_cover` in the command.

For each page, it picks an output filename based on the input filename. It tries to guesses a sensible page title (to use in sidebars, dropdowns, table of contents, and other page navigation) from the first line of the file, falling back to the filename as the page title if the first line isn't a Markdown-formatted header.

Example usage:

```
./dactyl_build.py --pages ~/Ripple/*.md -o /tmp/dactyl_out/ --pdf scraps.pdf
```

Multiple Targets
----------------

You can define multiple **targets** in the config file with arbitrary key-value parameters. The two parameters that the tool cares about by default are **name** (used to identify the target on the commandline and in the pages section of the config) and **filters** (which lists filter plugins to apply, if provided).

By default, the tool builds the first target in the list. Every page in the `pages` array is included in every target unless the page definition includes an explicit list of **targets** to build. (Each member in the list should be the **name** of a target.)

The tool can perform automatic substitution of links in the resulting HTML (or Markdown, when using [githubify](#githubify-mode)). For each parameter in the page definition that matches the name of a target, it replaces links to the `html` file with the contents of the target-name-parameter. Anchors from the original link carry over. This allows you to link to other pages using the filenames from the local version of the site, but replace them with different links for a live site. (As seen in the default configuration, Ripple.com has very different URLs for many pages.)

Filters
-------

Dactyl can apply various filters on document content, which is useful for handling compatibility with alternate Markdown flavors, among other things. The **filters** option, at the target or page level of the config, should contain an array of filters to apply. (Filters at the target level apply to all pages in that target; filters at the page level apply to that page only.) Each filter is implemented by a Python script in the Dactyl directory named `filter_{filter_name}.py`, based on the {filter_name} specified in the config.

Filters can apply at any or all of three steps: Raw markdown, raw HTML, or BeautifulSoup, as follows:

Raw markdown filters implement a `filter_markdown(md)` function, which inputs and outputs a string of markdown text.

Raw HTML filters implement a `filter_html(html)` function, which inputs and outputs a string of HTML text.

BeautifulSoup filters implement a `filter_soup(soup)` method, which takes a BeautifulSoup4 representation of the parsed HTML content as input. Because the input is passed by reference, the function modifies the soup in place instead of returning it.

Dactyl comes with the following filters:

  * `remove_doctoc` - Remove DOCTOC-generated tables of contents
  * `multicode_tabs` - Lets you group multiple code samples to appear in tabs (HTML only)
  * `standardize_header_ids` - Modify the `id` fields of generated header (&lt;h#&gt;) elements to use dashes instead of underscores. (This is for compatibility with previously-used doc tools.)
  * `buttonize` - Adds the `button` class to links whose text ends in &gt;
  * `markdown_in_divs` - Automatically add the `markdown="1"` element to &lt;div&gt; elements so that their contents get parsed as Markdown. (No longer used by the Dev Portal, but useful for compatibility with Markdown flavors that do this automatically.)
  * `add_version` - Adds a "Updated for \[Version\]" link to the page. Only works if the page is remotely-sourced from a git tag on GitHub.
  * ``

Multicode Tabs
--------------

The `multicode_tabs` filter lets you group multiple related code samples to appear in tabs in the HTML version. It has no meaningful effect when building for PDF.

The syntax for multicode tabs is as follows:

~~~
(whatever content comes before the multi-code block)

<!-- MULTICODE_BLOCK_START -->

*Tab 1 Name*

```
Tab 1 code sample
```

*Tab 2 Name*

```
Tab 2 code sample
```

... (repeat for N tabs) ...

<!-- MULTICODE_BLOCK_END -->

(whatever content comes after the multi-code block)
~~~

This syntax is designed to "gracefully degrade" to a sensible syntax in cases (like PDF) where the [javascript to make the tabs work](assets/js/multicodetab.js) is either unavailable or undesirable.

Contributing
------------

The Developer Portal welcomes outside contributions, especially to the documentation contents. If you have any corrections, improvements, or expansions of the portal, please contribute pull requests to the **master** branch.

Contributions become copyright Ripple and are provided under the MIT [LICENSE](LICENSE).
