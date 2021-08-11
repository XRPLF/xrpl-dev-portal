################################################################################
## Label Functions                                                            ##
## Author: Rome Reginelli                                                     ##
## Copyright: Ripple Labs, Inc. 2021                                          ##
## License: MIT https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE  ##
##                                                                            ##
## Functions to find pages with a given label                                 ##
################################################################################

from collections import Counter

def children_with_label(pages, parent, label):
    """
    pages: list(Page)
    parent: Page
    label: str

    returns: list(Page)

    Filter for pages that are children of the given parent and tagged with the
    given label.
    """
    return [page for page in pages
            if parent["is_ancestor_of"](page["html"])
            and label in page.get("labels", [])]

def all_with_label(pages, label):
    """
    pages: list(Page)
    label: str

    returns: list(Page)

    Filter for pages that are tagged with the given label.
    """
    return [page for page in pages if label in page.get("labels", [])]

def label_count(pages, label):
    """
    pages: list(Page)
    label: str

    returns: int

    Counts the total number of pages that have a given label.
    """
    return len(all_with_label(pages, label))

def label_sizes(pages):
    """
    pages: list(Page)

    returns: dict[str: int]

    For all labels with landings in the page list, assign each label a "size",
    from 1 to 5, based on the total number of pages with that label. (A larger
    size means the label contains more pages.)
    """

    # Note: this is basically calculating a 5-bin histogram, but I didn't want
    # to add another dependency like numpy just to do this.

    labels = [page["landing_for"] for page in pages if "landing_for" in page]
    label_counts = Counter()
    for page in pages:
        if "labels" in page:
            label_counts.update(page["labels"])

    if not label_counts:
        return {}

    total_labels = len(label_counts.keys())
    label_sizemap = {}
    size = 5
    for i, (label, count) in enumerate(label_counts.most_common()):
        if 1 - (i / total_labels) < (size - 1) / 5:
            size -= 1
        label_sizemap[label] = size

    return label_sizemap


export = {
    "children_with_label": children_with_label,
    "all_with_label": all_with_label,
    "label_count": label_count,
    "label_sizes": label_sizes
}
