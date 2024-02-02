---
html: creating-diagrams.html
parent: contribute-documentation.html
seo:
    description: Create diagrams that interact properly with light and dark mode settings.
---
# Creating Diagrams

The site contains code to automatically recolor SVG diagrams for light and dark mode. This is more than just inverting images. The recoloring keeps gradients going the same direction (so that things don't look bottom-lit) and replaces colors with equivalents that fit with the theme rather than their inverse. For example, "Ripple blue" gets recolored to XRPL green, not its inverse orange. Example:

![Comparison of invert and theme-aware recoloring](/docs/img/theme-aware-recolor.png)

Theme-aware recoloring uses a single source file in SVG format for diagrams, and produces diagrams that are recolored to match the current theme (light/dark) using CSS. If the user changes their theme, the diagrams immediately change to match it.

To include a theme-aware diagram in a document, use the `include_svg` filter with syntax such as the following:

```{% process=false %}
[{% inline-svg file="/docs/img/anatomy-of-a-ledger-complete.svg" /%}](/docs/img/anatomy-of-a-ledger-complete.svg "Figure 1: XRP Ledger Elements")
```

Leave empty lines before and after this syntax. The SVG file in question should be in the [`img/`](https://github.com/XRPLF/xrpl-dev-portal/tree/master/img) folder at the top level of the repo, or a subfolder of it. The second argument is _title text_, which appears when the user hovers their mouse over the diagram, and can also be used by other software (such as screen readers) to caption the diagram.

The resulting SVG file is inlined directly into the Markdown file. One limitation is that you can't use it inside other Markdown structures such as bulleted lists or tables.

{% admonition type="info" name="Note" %}
The filter source code is [`tool/filter_include_svg.py`](https://github.com/XRPLF/xrpl-dev-portal/blob/master/tool/filter_include_svg.py). This is also the reason that `lxml` is one of the dependencies for building the site.
{% /admonition %}

## Making Diagrams

You have to take care when creating diagrams so that the recoloring applies correctly; otherwise, some elements might be invisible (white-on-white or black-on-black, for example) when recolored for the other theme. The theme-aware diagrams code supports diagrams created using either [Umlet](https://www.umlet.com/) or [Google Draw](https://docs.google.com/drawings/) and exported as SVG. Additionally, you should follow these guidelines when making diagrams:

- Create diagrams for light mode by default. Use a transparent background color.
- Only use colors that the theme-aware diagrams code has mappings for. The code for this, including the full list of colors, is in [`styles/_diagrams.scss`](https://github.com/XRPLF/xrpl-dev-portal/blob/master/styles/_diagrams.scss). If needed, you can add new colors by extending the SCSS code. (Don't forget to re-export the CSS when you're done. See the [styles README](https://github.com/XRPLF/xrpl-dev-portal/blob/master/styles/README.md).)
- Use actual vector shapes instead of embedded icons/images whenever possible. If you need to put text on top of an image, add a solid background to the text element and use one of the colors the theme has mappings for.
- Don't layer transparent elements containing text on top of elements with different background colors. Apply a background color directly to the element that contains the text.
