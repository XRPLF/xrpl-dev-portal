##################################################
## Slug Function
## Author: Rome Reginelli
## Copyright: Ripple Labs, 2021
##
## Exports a slug function to be used in templates
## to convert arbitrary text to something suitable
## for use as a CSS class, URL, etc.
##################################################
import re

# Unicode-friendly function for making IDs and similar. Removes any non-word
# characters except -, replaces whitespace with - reduces duplicate dashes,
# and lowercases text
def idify(utext):
    """Make a string ID-friendly (but more unicode-friendly)"""
    utext = re.sub(r'[^\w\s-]', '', utext).strip().lower()
    utext = re.sub(r'[\s-]+', '-', utext)
    if not len(utext):
        # IDs and similar must not be an empty string
        return '_'
    return utext

export = {
    "slug": idify
}
