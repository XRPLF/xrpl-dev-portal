################################################
## Interactive Steps Helper
## Author: Rome Reginelli
## Copyright: Ripple Labs, 2019
##
## Automates the process of building wrappers and breadcrumbs for interactive
## blocks in tutorials that have several interactive steps in order.
################################################

import re

def slugify(s):
    unacceptable_chars = re.compile(r"[^A-Za-z0-9._ ]+")
    whitespace_regex = re.compile(r"\s+")
    s = re.sub(unacceptable_chars, "", s)
    s = re.sub(whitespace_regex, "_", s)
    s = s.lower()
    if not s:
        s = "_"
    return s

def start_step(step_label):
    """Generates the HTML for the start of a step, including breadcrumbs"""

    if '"' in step_label:
        raise ValueError("step_label must not contain \" characters")

    step_id = slugify(step_label)

    out_html = """
<div class="interactive-block" id="interactive-{step_id}">
  <div class="interactive-block-inner">
    <div class="breadcrumbs-wrap">
      <ul class="breadcrumb tutorial-step-crumbs" id="bc-ul-{step_id}" data-steplabel="{step_label}" data-stepid="{step_id}">
      </ul><!--/.breadcrumb.tutorial-step-crumbs-->
    </div><!--/.breadcrumbs-wrap-->
  <div class="interactive-block-ui">

""".format(step_id=step_id, step_label=step_label)
    return out_html

def end_step():
    """Generates the HTML for the end of a step, including breadcrumbs"""
    return "    </div><!--/.interactive-block-ui-->\n  </div><!--/.interactive-block-inner-->\n</div><!--/.interactive-block-->"

def filter_soup(soup, **kwargs):
    """Add steps to each tutorial-step-crumbs element based on the total steps
    in the document. Each step results in a li element such as:
    <li class="breadcrumb-item disabled current bc-connect">
        <a href="#interactive-connect">Connect</a>
    </li>"""
    crumb_uls = soup.find_all(class_="tutorial-step-crumbs")
    steps = [(el.attrs["data-stepid"], el.attrs["data-steplabel"]) for el in crumb_uls]

    def add_lis(parent_ul, steps, current_step_id):
        i = 0
        for step_id, step_label in steps:
            li = soup.new_tag("li")
            li_classes = ["breadcrumb-item", "bc-{step_id}".format(step_id=step_id)]
            if i > 0:
                li_classes.append("disabled") # Steps get enabled in order by JS
            if step_id == current_step_id:
                li_classes.append("current")
            li.attrs['class'] = li_classes
            li_a = soup.new_tag("a", href="#interactive-{step_id}".format(step_id=step_id))
            li_a.append(step_label)
            li.append(li_a)
            parent_ul.append(li)
            i += 1

    for ul in crumb_uls:
        ul_step_id = ul.attrs["data-stepid"]
        add_lis(ul, steps, ul_step_id)



export = {
    "start_step": start_step,
    "end_step": end_step
}
