################################################################################
## Unicode-friendly header IDs                                                ##
## Author: Rome Reginelli                                                     ##
## Copyright: Ripple Labs, Inc. 2016-2019                                     ##
## License: MIT https://github.com/ripple/xrpl-dev-portal/blob/master/LICENSE ##
##                                                                            ##
## Changes the header ID formula to accept more unicode characters, so        ##
## non-English, non-Latin-script headers can have nice IDs. Closely matches   ##
## the behavior of GitHub-Flavored Markdown.                                  ##
################################################################################
import re

## HTML5's 'id' attribute requirements are:
## - Must be at least one character in length.
## - Must not contain ASCII whitespace.
## - Must be unique within the document.
## - No other requirements. (HTML4 had stricter requirements.)

## Python-Markdown's default ID formula (as of v3.1.1) is:
## 1. normalize unicode to NFKD form (so it can strip accent marks)
## 2. remove all non-ASCII characters (this is the problem for us)
## 3. remove leading/trailing whitespace
## 4. convert to lowercase
## 5. remove everything except space, hyphen, alphanumerics, and underscores
## 6. replace each block of consecutive whitespace/hyphens with a single hyphen
## 7. add _1, _2 etc. suffixes to non-unique IDs
## Later, the dev portal uses a filter to replace underscores with dashes.

## The new formula is similar, but has some important differences:
## 1. No Unicode normalization. We'd rather leave things as-is.
## 2. Leave the string as unicode throughout.
## 5. Keep hyphens, unicode "space" and unicode "word" characters (includes
##    underscores). Replace everything else with spaces, then strip trailing
##    spaces.
## 7. Add -1, -2 suffixes to non-unique IDs.
## The end result is that this standard closely matches GitHub-flavored
##     Markdown in almost all cases. (The exceptions are cases where GFM makes
##     invalid empty IDs, for example with emoji headers...)

def idify(utext):
    """Make a string ID-friendly (but more unicode-friendly)"""
    utext = re.sub(r'[^\w\s-]', '', utext).strip().lower()
    utext = re.sub(r'[\s-]+', '-', utext)
    if not len(utext):
        # Headers must be non-empty
        return '_'
    return utext

def filter_soup(soup, **kwargs):
    """Generate new IDs for all headers"""
    uniqIDs = {}
    headers = soup.find_all(name=re.compile("h[0-9]"))
    for h in headers:
        new_id = idify(h.get_text())
        if new_id not in uniqIDs.keys():
            uniqIDs[new_id] = 0
        else:
            # not unique, append -1, -2, etc. to this instance
            uniqIDs[new_id] += 1
            new_id = "{id}-{n}".format(id=new_id, n=uniqIDs[new_id])

        h["id"] = new_id
