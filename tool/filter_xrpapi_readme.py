def filter_markdown(md, **kwargs):
    """
    Remove the link to the dev portal from the readme and replace it with
    a link to the repo (since we're in the dev portal already).
    """

    REMOVE = """## [➡️ XRP API Reference Documentation](https://xrpl.org/xrp-api.html)

See the full reference documentation on the XRP Ledger Dev Portal."""

    REPLACEMENT = """[[Source]](https://github.com/xpring-eng/xrp-api "Source")"""

    return md.replace(REMOVE, REPLACEMENT)
