ripple-dev-portal
=================

The [Ripple Developer Portal](https://dev.ripple.com) is the authoritative source for Ripple documentation, including the `rippled` server, RippleAPI, the Ripple Data API, and other Ripple open-source software.


Repository Layout
-----------------

The HTML pages in this portal are generated from the markdown files in the [content/](content/) folder. Always edit the markdown files, not the HTML files.

The [tool/](tool/) folder contains tools and templates for generating the HTML files in the top level. The `parse_pages.py` script (requires Python 3, [Jinja 2](http://jinja.pocoo.org/), and various pip modules) uses the templates and the a YAML config file to generate HTML output. In general, `parse_pages.py` assumes you are running it with `tool/` as the current working directory, and the default config uses the top level of this repository as the output directory.

Building
--------

The default configuration is [`devportal-config.yml`](tool/devportal-config.yml). You can specify an alternate config file with the `-c` or `--config` parameter:

`./parse_pages.py -c alt-config.yml`

This script does the following:

1. Chooses a target based on the commandline `-t` parameter. If not specified, uses the first target listed in the config file. If building for PDF, add the `--pdf your_output_file.pdf` parameter (The output filename must end in `.pdf`!)
2. Reads the list of **pages** from the config.
3. For all pages that have a filename as the `md` parameter in the config, it reads the file from the configured **content_path** and "preprocesses" any [Jinja2 Templating Language](http://jinja.pocoo.org/docs/dev/templates/) statements in those files. The markdown files can use this opportunity to include other files, or include or exclude content based on the `target` and `pages` parameters.
4. For all pages that have a URL as the `md` parameter, it fetches the file via HTTP(S). No pre-processing occurs on such contents.
5. For all the retrieved and preprocessed markdown files, it parses them using Python's markdown library, with extras enabled to approximate GitHub-flavored markdown.
6. For each page, it parses the **template** configured for the page using Jinja2, falling back to the **default_template** (or **pdf_template**). If it produced HTML from a Markdown source, it passes that HTML as the `content` parameter to the template. It also passes in several other arguments from the config file, including definition of the current page as the `currentpage` parameter.
7. It applies several post-processing steps on the generated HTML, including:
  * Automatic link substitution by target
  * The removal of any content between certain DOCTOC comments
  * Un-comments any &lt;div class="multicode"&gt; and &lt;/div&gt; tags (if building for a target with `multicode_tabs: true` configured).
  * Modifies the `id` fields of generated header (&lt;h#&gt;) elements to use dashes instead of underscores. (This is for compatibility with previously-used doc tools.)
  * Adds the `button` class to links whose text ends in &gt;
8. If building for PDF: It outputs the resulting HTML files to the configured **temporary_files_path**, using filenames specified in the **html** parameter of each page in the config file. It also copies the **template_static_path** and **content_static_path** folders to the temporary folder. Then it runs [Prince](http://www.princexml.com/) to generate a PDF. It writes the generated PDF to the **out_path**.
9. Otherwise: It outputs the resulting HTML files to the **out_path**. This does not generate a working copy of the site unless the necessary static files are also available at the **out_path**. (This is true by default, since the default output directory is the top level of the repository.) You can have it copy the configured **template_static_path** (containing files referenced by the templates) and the **content_static_path** (containing files referenced by the content) to the output directory using the `--copy_static` or `-s` parameter.


Githubify Mode
--------------

Alternate usage: `-g` produces a GitHub-flavored Markdown version of a single file. This parameter takes one argument, which should be a markdown file in the **content_path**. The tool uses Jinja2 to "preprocess" the file, as above, but stops after assembling GitHub-flavored Markdown and writes the output to the same filename in the **out_path**.

**Note:** The tool never erases files from the **out_path**. You may want to do that yourself, especially if you remove files.


Multiple Targets
----------------

You can define multiple **targets** in the config file with arbitrary key-value parameters. The two parameters that the tool cares about by default are **name** (used to identify the target on the commandline and in the pages section of the config) and **multicode_tabs** (which determines whether or not to uncomment certain divs).

By default, the tool builds the first target in the list. Every page in the `pages` array is included in every target unless the page definition includes an explicit list of **targets** to build. (Each member in the list should be the **name** of a target.)

The tool can perform automatic substitution of links in the resulting HTML (or Markdown, when using [githubify](#githubify-mode)). For each parameter in the page definition that matches the name of a target, it replaces links to the `html` file with the contents of the target-name-parameter. Anchors from the original link carry over. This allows you to link to other pages using the filenames from the local version of the site, but replace them with different links for a live site. (As seen in the default configuration, Ripple.com has very different URLs for many pages.)


Contributing
------------

The Developer Portal welcomes outside contributions, especially to the documentation contents. If you have any corrections, improvements, or expansions of the portal, please contribute pull requests to the **gh-pages** branch.

Contributions become copyright Ripple and are provided under the MIT [LICENSE](LICENSE).

