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

def append_chevron(soup, el):
    """
    Adds markup for a CSS-animated chevron to an element, in the form of:
    <span class="chevron">
        <span></span>
        <span></span>
    </span>
    """
    chev = soup.new_tag("span")
    chev["class"] = "chevron"
    chev.extend([soup.new_tag("span") for i in range(2)])
    el.append(chev)

def wrap_question(soup, qi, q, elements):
    q_wrapper = soup.new_tag("div")
    q_wrapper["class"] = "q-wrapper"
    q.replace_with(q_wrapper)

    answer_wrapper = soup.new_tag("div")
    answer_wrapper["id"] = "a{qi}".format(qi=qi)
    answer_wrapper["class"] = "answer-wrapper collapse"
    answer_wrapper["aria-labelledby"] = "a{qi}".format(qi=qi)
    #answer_wrapper["data-parent"] = "#faqs-accordion"

    for i,el in enumerate(elements):
        # if i==0:
        #     el.replace_with(answer_wrapper)
        answer_wrapper.append(el.extract())
    q_wrapper.append(answer_wrapper)

    q_toggler = soup.new_tag("a")
    q_toggler["data-toggle"] = "collapse"
    q_toggler["href"] = "#{qid}".format(qid=q["id"])
    q_toggler["data-target"] = "#a{qi}".format(qi=qi)
    q_toggler["aria-controls"] = "a{qi}".format(qi=qi)
    q_toggler["aria-expanded"] = "false"
    q_toggler["class"] = "expander collapsed"

    # Strip out permalinks since that would be a link inside a link (invalid)
    [a.decompose() for a in q.find_all("a")]

    append_chevron(soup, q)
    q_toggler.insert(0, q)
    q_wrapper.insert(0, q_toggler)
    return q_wrapper

def wrap_section(soup, elements):
    section = soup.new_tag("section")
    section["class"] = "py-26"
    section.extend([el.extract() for el in elements])

def filter_soup(soup, **kwargs):
    qs = soup.find_all(Q_TAG)

    for qi, q in enumerate(qs):
        current_answer = []
        el = q
        while el.next_sibling:
            el = el.next_sibling
            if isinstance(el, NavigableString):
                current_answer.append(el)
            elif el.name == Q_TAG:
                # We probably found the next question, stop here
                break
            elif el.name == SECTION_TAG:
                # End of the section, definitely stop here
                break
            else:
                current_answer.append(el)

        wrap_question(soup, qi, q, current_answer)
