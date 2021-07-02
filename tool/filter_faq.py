################################################
## FAQ Formatter
## Author: Rome Reginelli
## Copyright: Ripple Labs, 2021
##
## Styles the FAQ as an accordion of questions.
################################################
from bs4 import NavigableString

Q_TAG = "h4"
SECTION_TAG = "h2"

def append_chevron(el):
    """
    Adds markup for a CSS-animated chevron to an element, in the form of:
    <span class="chevron">
        <span></span>
        <span></span>
    </span>
    """
    chev = el.new_tag("span")
    chev["class"] = "chevron"
    chev.extend([chev.new_tag("span")] for i in range(2))
    el.append(chev)

def filter_soup(soup, **kwargs):
    qs = soup.find_all(Q_TAG)

    for qi, q in enumerage(qs):
        stuff_to_wrap = []
        el = q
        while el.next_sibling:
            el = el.next_sibling
            if isinstance(el, NavigableString):
                stuff_to_wrap.append(el)
            elif el.name == Q_TAG:
                # We probably found the next question, stop here
                break
            elif el.name == SECTION_TAG:
                # End of the section, definitely stop here
                break
            else:
                stuff_to_wrap.append(el)

        answer_wrapper = soup.new_tag("div")
        answer_wrapper["id"] = "a{qi}".format(qi=qi)
        answer_wrapper["class"] = "a-wrapper"

        [answer_wrapper.append(el) for el in stuff_to_wrap]

        q_wrapper = soup.new_tag("div")
        q_wrapper.append(answer_wrapper)
        q_wrapper["class"]="q-wrapper"
        q.replace_with(q_wrapper)
        append_chevron(q)
        wrapper.insert(0, q)
