# Image Sources

This folder has the source files for diagrams used in the dev portal, where possible. `.txt` files contain hyperlinks to diagrams created with Google Draw or other cloud software.

## Diagram Tech

This repo uses a custom `include_svg` Dactyl filter to include SVG diagram files inline in the generated HTML. Among other things, this lets us recolor the diagrams to match the site's theme (so diagrams could, for example, automatically get recolored to be compatible with both light and dark themes).

Some tips to using it correctly:

- Use either [UMLet](http://umlet.com/) or Google Draw to make the diagrams, then export them as SVG.
- Put the SVG in the `img/` folder so the stand-alone file also gets copied to the output. The filter makes the diagram a link to its original file so people can click it to see a zoomed-in version.
- The [`_diagrams.scss` file](../../styles/_diagrams.scss) defines the remapped colorings for the diagrams. If you use a color that isn't remapped, and it looks bad, you need to edit this file and [re-build the CSS](../../styles/README.md).
- The recoloring may not be capable of handling text on top of several different background colors, because it doesn't have a way of recognizing what text is on top of what else. Use with care.


This error happens if you try to include a file that isn't text-based (for example, if you try to `include_svg()` on a PNG file instead of SVG):

```
Preprocessor error in page <Page 'Transaction Queue' (transaction-queue.html)>: 'utf-8' codec can't decode byte 0x89 in position 0: invalid start byte.
```
