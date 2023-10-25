# XRPL Dev Portal

The [XRP Ledger Dev Portal](https://xrpl.org) is the authoritative source for XRP Ledger documentation, including the `rippled` server, client libraries, and other open-source XRP Ledger software.

To build the site locally:

1. Install [**Dactyl**](https://github.com/ripple/dactyl) and `lxml`:

        sudo pip3 install dactyl lxml

2. Clone the repo and change into its directory:

        git clone git@github.com:XRPLF/xrpl-dev-portal.git && cd xrpl-dev-portal

3. Build the site to the `out/` directory:

        dactyl_build -t en

If you get an error, try upgrading Dactyl before building:

      sudo pip3 install --upgrade dactyl

For more details, see the [contribution guidelines (EN)](CONTRIBUTING.md) ([日本語](CONTRIBUTING.ja.md)) and the [contributor Code of Conduct (EN)](CODE_OF_CONDUCT.md) ([日本語](CODE_OF_CONDUCT.ja.md)).

## Domain Verification Checker

If you make changes to the [Domain Verification Checker](https://xrpl.org/validator-domain-verifier.html) tool and edit the domain-verifier-checker.js file, you will need to do the following:

1. Install [webpack](https://webpack.js.org/) and required libraries via npm:

        npm install webpack webpack-cli --save-dev
        npm install ripple-binary-codec ripple-address-codec ripple-keypairs

2. From the project root directory (this step may be different depending on how you installed webpack)

        cd static/js
        webpack-cli domain-verifier-checker.js --optimize-minimize -o domain-verifier-bundle.js

3. Build the site:

        cd ../..
        dactyl_build -t en

## Locale Strings

The templates can contain strings that are intended to be translated. These strings are marked off with `{% trans %}` and `{% endtrans %}` tags. You can't have any Jinja block control structures in these tags, but you can have some HTML markup and some basic Jinja variable-printing logic. See the [Jinja Documentation](https://jinja.palletsprojects.com/en/2.11.x/templates/#i18n-in-templates) for what's possible.

If you make changes to these strings, or want to add or update a translation, you'll need to do some extra steps to manage the locale files. These steps require the [Babel](http://babel.pocoo.org/) (`pybabel`) commandline utility. To install it:

```sh
sudo pip3 install Babel
```

You don't need Babel to build and view the site otherwise.


### Add a language

This repo has English (en) and Japanese (ja) locales set up already. To add a language (do this from the repo top dir):

```sh
$ pybabel init -l ja -i ./locale/messages.pot -o ./locale/ja/LC_MESSAGES/messages.po
```

Instead of `ja` (in two places in the above line!!) use the locale code for the language you plan to add. There's no exhaustive, definitive list, but [this list of locale codes](https://www.science.co.il/language/Locale-codes.php) is a good starting place.

This creates a "PO" file (`./locale/ja/LC_MESSAGES/messages.po`) with empty translations for the strings in the templates, based on the "PO Template" file (`./locale/messages.pot`).

To actually add translations for strings, you need to edit the new PO file for this translation. You can edit the PO file file with a text editor, or use a more advanced tool if you're a pro. Don't change the `msgid` values, _do_ change the `msgstr` values.

When you're done translating, [compile the PO files](#compile-strings).

### Update Strings

If there are new or updated `{% trans %}` tags in the templates, first use this command to extract them:

```sh
$ pybabel extract -F ./locale/babel.cfg -o ./locale/messages.pot ./
```

Then, update _every_ language's `.po` files with the list of strings, as follows:

```sh
$ pybabel update -l ja -d ./locale/ -i ./locale/messages.pot
```

The above example is for Japanese (`-l ja`). **Repeat for each language code.**

Now edit the PO files (for example, `locale/ja/LC_MESSAGES/messages.po`) to add translations for each newly-added string. Again, **repeat for each language.**

If you only want to change an existing translation for a given string that hasn't changed in the original, you can skip straight to editing the PO files without running any `update` or `extract` commands.

After you've edited all the PO files, be sure to [compile them](#compile-strings).

### Compile Strings

Whether you added a language, added new strings, or tweaked an existing translation, you must compile the PO files (text) to MO files (binary) to get Dactyl to use them.

To compile all PO files:

```sh
$ pybabel compile -f -d ./locale/
```

If you added a new language for the first time, you need to make sure its target definition (in the `dactyl-config.yml` file) has the MO file in the `locale_file` field.

After that, next time you build the site using Dactyl it should pull the updated translations!

## Issues, Projects, and Project Boards

Use GitHub Issues under the [`xrpl-dev-portal`](https://github.com/XRPLF/xrpl-dev-portal) repository to report bugs, feature requests, and suggestions for the XRP Ledger Documentation or the `xrpl.org` website.

For issues related to `rippled` or client libraries (`xrpl.js`, `xrpl-py`, and others), use the respective source repository under [`https://github.com/XRPLF`](https://github.com/XRPLF).

If you are a contributor, use GitHub Projects and Project Boards to plan and track updates to xrpl.org.

### Project Board `xrpl-docs`

The [`xrpl-docs`](https://github.com/orgs/XRPLF/projects/4) Kanban board is used to plan and track updates to the XRP Ledger Documentation. Contributors must update the status of an issue as it progresses through different stages.

The `xrpl-docs` board has six columns based on the status of issues in this repository:

* **No Status**: New or existing issues that no one has triaged yet.

* **Backlog**: Issues that represent tasks to be done eventually. They should contain actionable and helpful information for a contributor to work on addressing the issue.

* **Planned**: Issues with assignees who plan to address them in the near future, like 2-4 weeks.

* **In Progress**: Issues that a contributor is actively working on.

* **In Review**: Issues with a proposed fix that is currently being reviewed. These should be associated with an open pull request.

* **Done**: Issues that have been completed, whose related content updates have been merged.

