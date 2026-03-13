# Contributing

For information about how to contribute to this repository, see [Contribute Documentation (XRPL.org)](https://xrpl.org/resources/contribute-documentation/).

## Quick Start

1. **Report an issue** — Use one of the [issue templates](.github/ISSUE_TEMPLATE/) to report bugs, request content updates, or suggest new features.
2. **Work on an issue** — Browse [open issues](https://github.com/XRPLF/xrpl-dev-portal/issues) with the `good first issue` or `help wanted` labels.
3. **Submit a pull request** — Fill out the [PR template](.github/PULL_REQUEST_TEMPLATE.md) completely, including linking to the issue you are addressing.

## Review Process (RACI Model)

This project follows a [RACI model](.github/project-management/RACI.md) to manage contributions:

- **R – Responsible**: The contributor who authors the change
- **A – Accountable**: A maintainer from `@XRPLF/docs-maintainers` who approves and merges
- **C – Consulted**: Subject-matter experts tagged as reviewers for technical accuracy
- **I – Informed**: Stakeholders notified via linked issues and PR comments

**At least one maintainer approval is required before any PR can be merged.**

## Automated Workflows

The following GitHub Actions workflows run automatically:

| Workflow | Trigger | Purpose |
|---|---|---|
| Issue Triage | New issue opened | Applies labels based on content |
| PR Validation | PR opened/updated | Validates description and linked issue |
| Auto-Label | PR opened/updated | Labels PRs based on changed file paths |
| Stale Management | Daily | Marks and closes inactive issues/PRs |
| Greet Contributor | First issue/PR | Welcomes new contributors |