# XRPL Dev Portal

The [XRP Ledger Dev Portal](https://xrpl.org) is the authoritative source for XRP Ledger documentation, including the core server, client libraries, and other open-source XRP Ledger software.

The site is built and published using Redocly. 

Before you proceed, make sure you have Node.js and NPM installed. The site is tested with the current LTS release of each.

To build the site locally:

1. Clone the repo and change into its directory:

        git clone git@github.com:XRPLF/xrpl-dev-portal.git && cd xrpl-dev-portal

2. Install **Redocly Realm**:

        npm install @redocly/realm

3. Switch to the `master` branch if you aren't on it already.
      
        git switch master

4. Build and start a local server:

        npm start

For more details, see the [contribution guidelines (EN)](CONTRIBUTING.md) ([日本語](@l10n/ja/CONTRIBUTING.md)) and the [contributor Code of Conduct (EN)](CODE-OF-CONDUCT.md) ([日本語](@l10n/ja/CODE-OF-CONDUCT.md)).


### Localization / Translations

The documentation in this repository is created in English first, then translated into other languages by community contributors. Currently, only the Japanese translations are live on the site; Spanish translation efforts are incomplete and not actively used. For information on the process of adding and maintaining translated files, see [Translations](https://xrpl.org/resources/contribute-documentation/documentation-translations).

## Issues, Projects, and Project Boards

Use GitHub Issues under the [`xrpl-dev-portal`](https://github.com/XRPLF/xrpl-dev-portal) repository to report bugs, feature requests, and suggestions for the XRP Ledger Documentation or the `xrpl.org` website. 

For issues related to `xrpld`/`rippled`, Clio, or client libraries (`xrpl.js`, `xrpl-py`, and others), use the respective source repository under [`https://github.com/XRPLF`](https://github.com/XRPLF).

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

