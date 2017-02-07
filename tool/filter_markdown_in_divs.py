################################################################################
## Add Markdown Class to Divs filter                                          ##
## Author: Rome Reginelli                                                     ##
## Copyright: Ripple Labs, Inc. 2016                                          ##
##                                                                            ##
## Finds raw divs in the markdown and adds the markdown=1 attribute to them   ##
## so that HTML inside those divs gets parsed as markdown.                    ##
## Some flavors of markdown do this automatically, so this provides           ##
## compatibility with those.                                                  ##
################################################################################

def filter_markdown(md, target=None, page=None, config=None):
    """Python markdown requires markdown="1" on HTML block elements
       that contain markdown. AND there's a bug where if you use
       markdown.extensions.extra, it replaces code fences in HTML
       block elements with garbled text."""
    def add_markdown_class(m):
        if m.group(0).find("markdown=") == -1:
            return m.group(1) + ' markdown="1">'
        else:
            return m.group(0)

    logger.info("... adding markdown class to embedded divs...")
    md = re.sub(r"(<div[^>]*)>", add_markdown_class, md)
    return md
