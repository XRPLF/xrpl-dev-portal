# XRPL Dev Portal

The [XRP Ledger Dev Portal](https://xrpl.org) is the authoritative source for XRP Ledger documentation, including the `rippled` server, client libraries, and other open-source XRP Ledger software.

The site is built and published using Redocly. 

NOTE: The toolchain used to build and publish the site has recently been migrated from Dactyl to Redocly. 

Before you proceed, make sure you have Node version >= 18 LTS.

To build the site locally:

1. Clone the repo and change into its directory:

        git clone git@github.com:XRPLF/xrpl-dev-portal.git && cd xrpl-dev-portal

2. Install **Redocly Realm**:

        npm install @redocly/realm

3. Switch to the `master` branch if you aren't on it already.
      
        git switch master

4. Build and start a local server:

        npm start

For more details, see the [contribution guidelines (EN)](CONTRIBUTING.md) ([日本語](CONTRIBUTING.ja.md)) and the [contributor Code of Conduct (EN)](CODE-OF-CONDUCT.md) ([日本語](CODE-OF-CONDUCT.ja.md)).

## Domain Verification Checker

If you make changes to the [Domain Verification Checker](https://xrpl.org/validator-domain-verifier.html) tool and edit the domain-verifier-checker.js file, you will need to do the following:

1. Install [webpack](https://webpack.js.org/) and required libraries via npm:

        npm install webpack webpack-cli --save-dev
        npm install ripple-binary-codec ripple-address-codec ripple-keypairs

2. From the project root directory (this step may be different depending on how you installed webpack)

        cd assets/js
        webpack-cli domain-verifier-checker.js --optimize-minimize -o domain-verifier-bundle.js

3. Build the site:

        npm start


### Internationalization 

This repo includes English (en) and Japanese (ja) locales. 

This is done by setting up the internationalization (@i18n) folders, adding the `i18n` configuration to your `redocly.yaml` file, and adding the translated content in the respective language directory under the @i18n directory.

To add support for a new language:

1. Create a new subdirectory in the @i18n directory of the portal. For example, to add support for Spanish, create a new subdirectory "es-ES".

2. Update the i18n configuration in your `redocly.yaml` file defining the display labels for the different languages you support.

        i18n:
          defaultLocale: en-US
          locales:
            - code: en-US
              name: English
            - code: ja
              name: 日本語
            - code: es-ES
              name: Spanish

3. Add the translated content in the respective language directory under the @i18n directory. 

    The relative path from the language directory to the translated file must be the same as the relative path from the root of the portal to the file in the default language. For example, if you originally had a file with path `path/to/my/markdown.md`, the file translated to Spanish must be /`@i18n/es-ES/path/to/my/markdown.md`.

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

