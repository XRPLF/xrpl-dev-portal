# XRPL Dev Portal

The [XRP Ledger Dev Portal](https://xrpl.org) is the authoritative source for XRP Ledger documentation, including the `rippled` server, RippleAPI, the Ripple Data API, and other open-source XRP Ledger software.

To build the site locally:

1. Install [**Dactyl**](https://github.com/ripple/dactyl) and `lxml`:

        sudo pip3 install dactyl lxml

2. Clone the repo and change into its directory:

        git clone git@github.com:ripple/xrpl-dev-portal.git && cd xrpl-dev-portal

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

        cd assets/js
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
