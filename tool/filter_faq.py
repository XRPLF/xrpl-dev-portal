################################################
## FAQ Formatter
## Author: Rome Reginelli
## Copyright: Ripple Labs, 2021
##
## Styles the FAQ as an accordion of questions.
################################################
from bs4 import NavigableString

Q_TAG = "h4"

def filter_soup(soup, **kwargs):
    qs = soup.find_all(Q_TAG)

    for q in qs:
        stuff_to_wrap = []
        el = q
        while el.next_sibling:
            el = el.next_sibling
            if isinstance(el, NavigableString):
                stuff_to_wrap.append(el)
            elif el.name != Q_TAG:
                stuff_to_wrap.append(el)
            else:
                # We probably found the next question, stop here
                break

        wrapper = soup.new_tag("div", class_="q-wrapper")
        [wrapper.append(el) for el in stuff_to_wrap]
        q.replace_with(wrapper)
        wrapper.insert(0, q)
