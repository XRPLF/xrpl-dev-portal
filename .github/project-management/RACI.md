# RACI Model — XRP Ledger Developer Portal

This document defines the **RACI model** used to manage contributions to the XRP Ledger Developer Portal. RACI ensures every task has clear ownership, appropriate oversight, and proper communication for all stakeholders.

---

## What is RACI?

| Letter | Role | Description |
|--------|------|-------------|
| **R** | **Responsible** | The person who does the work. Every issue and PR must have exactly one responsible party. |
| **A** | **Accountable** | The person ultimately answerable for the outcome. Must approve work before it is merged. There is always exactly one accountable person per change. |
| **C** | **Consulted** | Subject-matter experts whose input is needed before or during the work. Two-way communication. |
| **I** | **Informed** | Stakeholders kept up to date on decisions and outcomes. One-way communication. |

---

## Role Mapping for This Project

### R – Responsible (Contributors)

- **Community contributors** — anyone opening issues or submitting PRs
- **Assigned issue owners** — maintainers or contributors assigned to an issue
- Responsible parties create PRs, write content, and address review feedback
- A single contributor should be assigned `Responsible` per issue/PR

### A – Accountable (Maintainers / CODEOWNERS)

- The **`@XRPLF/docs-maintainers`** team is accountable for all merged changes
- Enforced via [CODEOWNERS](../CODEOWNERS): every PR requires at least **one approval** from a code owner before it can be merged
- Maintainers may delegate review to subject-matter experts (Consulted) but remain accountable for the final merge decision
- Branch protection rules require:
  - ✅ At least **1 approving review** from a CODEOWNER
  - ✅ All **status checks pass** (CI workflows)
  - ✅ **No unresolved conversations**

### C – Consulted (Subject-Matter Experts)

Depending on the content area, the relevant experts should be tagged as reviewers:

| Content Area | Who to Consult |
|---|---|
| Protocol / core XRP Ledger mechanics | Protocol engineers (`@XRPLF/rippled` team members) |
| Smart contracts / Hooks | Hooks developers |
| NFT / tokenization | Tokenization working group |
| AMM / DeFi | DeFi working group |
| Client libraries (xrpl.js, xrpl-py, xrpl4j) | Respective library maintainers |
| Localization | Translation contributors for the target language |
| Site tooling / Redocly | Redocly configuration owners |

Tag SMEs using `@username` in PR descriptions or inline review comments.

### I – Informed (Stakeholders)

The following parties are automatically informed via GitHub notifications:

- **Issue reporters** — notified of comments and resolution
- **PR watchers** — subscribed to PR updates
- **Repository watchers** — receive notifications for all activity
- **Linked issues** — cross-referenced via `Fixes #<number>` in PR descriptions

---

## RACI by Activity Type

| Activity | R (Does the Work) | A (Approves) | C (Consulted) | I (Informed) |
|---|---|---|---|---|
| Report a bug or issue | Community contributor | Maintainer (triage) | — | Repo watchers |
| Fix a documentation bug | Community contributor / Maintainer | CODEOWNER | SME if technical | Issue reporter |
| Write a new doc page | Assigned contributor | CODEOWNER | Protocol SME + Tech writer | Community |
| Update API reference | Assigned contributor | CODEOWNER | Protocol engineer | Developers |
| Add/update code sample | Contributor | CODEOWNER | Library maintainer | Developers |
| Merge a PR | — | CODEOWNER | — | PR author, watchers |
| Triage issues | Maintainer | Lead maintainer | — | Issue reporter |
| Release / deploy | CI/CD (automated) | Lead maintainer | — | Stakeholders |
| Update site tooling | Maintainer | CODEOWNER | Redocly config owner | All contributors |

---

## Workflow Summary

```
Community Contributor (R)
  │
  ├─ Opens Issue ──────────────────────► Auto-triage labels applied
  │                                       Maintainer triages & prioritizes
  │
  └─ Opens Pull Request ────────────────► PR Validation check runs
       │                                  Auto-labels applied
       │                                  Greeting for new contributors
       │
       ├─ Tags SME reviewers (C) ───────► SMEs leave review comments
       │
       └─ Maintainer reviews (A) ───────► Approves or requests changes
            │
            └─ All checks pass ─────────► PR merged by Accountable maintainer
```

---

## Project Board

The XRP Ledger Developer Portal uses a **GitHub Project board** to track issue and PR status. The board has the following columns:

| Column | Description |
|---|---|
| **📋 Backlog** | Issues that are accepted but not yet scheduled |
| **🔍 Needs Triage** | New issues awaiting maintainer review |
| **📅 Planned** | Issues scheduled for an upcoming milestone |
| **🚧 In Progress** | Issues with a linked open PR or active assignee |
| **👀 In Review** | PRs awaiting review or with pending change requests |
| **✅ Done** | Merged PRs and closed issues |

> **Setup**: Maintainers can create and configure the board at:
> [organization-level project](https://github.com/orgs/XRPLF/projects)
> or
> [repository-level project](https://github.com/XRPLF/xrpl-dev-portal/projects)

### Automation Rules (configure in GitHub Projects)

- **Issue opened** → Move to _Needs Triage_
- **Label `stale` added** → Move to _Backlog_
- **PR opened / linked to issue** → Move issue to _In Progress_
- **PR review requested** → Move PR to _In Review_
- **PR merged** → Move to _Done_ and close linked issue
- **Issue closed** → Move to _Done_

---

## Branch Protection Requirements

To enforce the "at least one human review" requirement, configure branch protection on `master`:

1. Go to **Settings → Branches → Branch protection rules**
2. Add a rule for `master` (or your default branch)
3. Enable:
   - ✅ **Require a pull request before merging**
   - ✅ **Require approvals** — set to **1** (minimum)
   - ✅ **Require review from Code Owners** (enforces CODEOWNERS file)
   - ✅ **Require status checks to pass before merging**
     - Add: `validate-pr` (from `pr-check.yml`)
   - ✅ **Require conversation resolution before merging**
   - ✅ **Do not allow bypassing the above settings** (for non-admins)

---

## Labels Reference

| Label | Description | Who Applies |
|---|---|---|
| `bug` | Typo, broken link, or incorrect info | Auto-triage / contributor |
| `content updates` | Updates to existing documentation | Auto-triage / maintainer |
| `enhancement` | New pages or features | Auto-triage / maintainer |
| `good first issue` | Suitable for new contributors | Maintainer |
| `help wanted` | Community contributions welcome | Maintainer |
| `needs triage` | Awaiting maintainer review | Auto-triage |
| `stale` | No activity for 90+ days | Stale bot |
| `wip` | Work in progress, not ready for review | Contributor |
| `tokenization` | NFT/token-related content | Auto-triage |
| `infra` | Validator/node/server content | Auto-triage |
| `web dev` | Site tooling, styles, templates | Auto-triage |
| `organization` | Navigation, structure, architecture | Auto-triage |
| `docs-tooling` | CI/CD, build tooling | Auto-triage |
| `localization` | Translation and i18n | Auto-triage |
| `javascript` | JavaScript code samples/tutorials | Auto-triage |
| `python` | Python code samples/tutorials | Auto-triage |

---

## Contributing Quick Reference

1. **Find an issue** — Browse the [project board](https://github.com/XRPLF/xrpl-dev-portal/issues) or open a new one using a template
2. **Assign yourself** — Comment "I'll work on this" or ask a maintainer to assign you
3. **Fork & branch** — Create a branch from `master`
4. **Make changes** — Follow the [style guide](https://xrpl.org/resources/contribute-documentation/)
5. **Open a PR** — Fill out the PR template completely, including RACI confirmation
6. **Tag reviewers** — Add SMEs as reviewers for technical accuracy
7. **Address feedback** — Respond to review comments and push updates
8. **Merge** — A maintainer (Accountable) will merge once all checks pass
