---
paths:
  - "docs/**/*.md"
---

# XRPL General Documentation Style Guide

## Writing style guidelines

| Guideline | Our Style | Not Our Style |
|:----------|:----------|:--------------|
| Use sentence-style capitalization in headings. | Time zone in log messages | Time Zone in Log Messages |
| Avoid using UI terms like button, window, etc. | Click **Menu**. | Click the **Menu** button. |
| Capitalize the main words of a title if it appears as a formal designation or a title of a person. Do not capitalize a title when referring to a role or job descriptively or generically. | "Vice President John Smith", "he's the vice president" | "vice president John Smith", "he's the Vice President" |
| When describing an instruction, give the result before the action. | To complete the payment, type return. | Type return to complete the payment. |
| Don’t use Latin terms. Note: “Ad hoc” is an exception. | "that is", "for example" | "i.e.", "e.g." |
| Avoid using “slash” words. | Navigate to the second or third table. | Navigate to the second and/or third table. |
| Use the exact title of the link for a link wherever appropriate.<ul><li>Use the page or section title wherever appropriate.</li><li>Describe the content wherever page or section title does not fit.</li><li>Don’t use “here”.</li></ul> | The XRPL can create uncollateralized loans. See: [Create a Loan](https://xrpl.org/docs/tutorials/defi/lending/use-the-lending-protocol/create-a-loan). | The XRPL can create uncollateralized loans. [How to create a loan](https://xrpl.org/docs/tutorials/defi/lending/use-the-lending-protocol/create-a-loan). |
| Spell out numbers zero through ten. | If all three fields are missing, the transaction fails. |  If all 3 fields are missing, the transaction fails. |
| Avoid passive voice where possible. | | |
| Avoid future tense where possible. | | |
| Introduce tables with body or paragraph text that describes what it contains. | | |
| Don’t use an article before a product name. | Ripple Custody is Ripple’s latest product. | The Ripple Custody is Ripple’s latest product. |
| Use contractions and be consistent. Avoid ambiguous or awkward contractions, such as there’d, it’ll, and they’d. | This isn’t a very long sentence and it also isn’t a very creative example. | This is not a very long sentence and it also isn’t a very creative example. |
| Follow the Microsoft Writing Style Guide for abbreviations and acronyms. See: [Acronyms](https://learn.microsoft.com/en-us/style-guide/acronyms). | | |
| When you refer to parts of a code object, always put the exact code in monospace or code-style formatting and use a word such as “field”, “value”, “object” or “array” to identify it. | If the payment is successful, the transaction delivers the amount specified in the `Amount` field to the `Destination` address. Find a `DeletedNode` object in the transaction metadata. | |
| When you deal with “flags”, use enabled or disabled wherever possible to specify if a flag is set or not set. Only if the flag name is confusing, specify how to set the flag for results. | Make sure that the ODL flag is enabled. | Make sure that the ODL flag is set. Make sure that the ODL flag is on. |
| When you describe a JSON nested object, separate the arrays with a dot instead of using a sequence. | `content.push_forward_execution_result` | |
| Use ordered lists for instructions and when something is in a sequence, even though the user may not perform an action. | | |
| Use unordered lists if the order doesn’t matter. | | |
| Use the Oxford comma. | | |
| Use imperatives in section headings where you describe a task. | Add a beneficiary | Adding a beneficiary |
| Use gerunds in section headings where you describe conceptual or reference information. | Explaining fees | Explain fees |
| Use good judgement to decide on imperative, gerund, or neither for topic headings where the content of the entire topic is not clearly instructional, conceptual, or referential. | Incentives overview | Describe incentives / Describing incentives |
| For links on the same page, add 'on this page'. | | |

## Preferred phrases

| Preferred Phrase | Acceptable Phrase | Alternatives to avoid |
|:-----------------|:------------------|:----------------------|
| For more information about (topic), see (xref). | For more information, see (xref). | <ul><li>See (xref) for more information about (topic).</li><li>For additional information, see (xref).</li></ul> |
| The default is (value). | | <ul><li>Defaults to (value).</li><li>Default: (value).</li></ul> |
| instance | server or node | |
| It is recommended | | <ul><li>Ripple recommends</li><li>We recommend</li></ul> |

## Frontmatter

Every doc page begins with a YAML frontmatter block. Use the example below as a copy-paste template, then consult the field reference for what each key controls.

```yaml
---
seo:
  description: Create a loan broker on the XRP Ledger.    # one-sentence summary of the page
metadata:
  indexPage: true                                         # set to enable the {% child-pages /%} component for this page
labels:
  - Lending Protocol                                      # topic tags; match the spelling of existing labels (no central registry)
status: not_enabled                                       # omit if the feature is enabled on Mainnet; only valid value is not_enabled
---
```
