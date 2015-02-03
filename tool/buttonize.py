#!/usr/bin/env python

"""
Pandoc filter to make output more like Flatdoc's parser:
* convert links ending in > to button-class links without the >
* convert underscores to dashes in header IDs
"""

from pandocfilters import toJSONFilter, Link, Str, RawInline, Header, stringify

def buttonize(key, value, format, meta):
    if key == 'Link':
        inlines, (href, title) = value
        linktext = stringify(inlines).strip()
        if (format == "html" or format == "html5") and linktext[-1] == ">":
            html = "<a class='button' title='%s' href='%s'>%s</a>" % (title, href, linktext[:-1])
            newlink = RawInline("html", html)
            return newlink
    elif key == 'Header':
        level, (identifier, classes, kv), inlines = value
        identifier = identifier.replace("_","-")
        return Header(level, (identifier, classes, kv), inlines)

if __name__ == "__main__":
    toJSONFilter(buttonize)
