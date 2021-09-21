################################################
## Add copy to clipboard btton
## Author: Jake Bonham
## Copyright: Ripple Labs, 2021
##
## Finds codeblocks and adds copy to clipboard button
################################################

def filter_soup(soup, **kwargs):
    """
    1. Finds all elements with class of "codehilite"
    2. Adds copy to clipboard button.
        Button looks like >
        <button class="btn btn-outline-secondary clipboard-btn" data-clipboard-target="#codeblock-0" id="codeblock-0button">Copy to clipboard</button>
    3. Adds id to <code> element.
    """

    code_blocks = soup.find_all(class_="codehilite")
    index1 = 0
    for code_block in code_blocks:
        # add id to each child <code>
        codeBlock = code_block.find("code")
        codeBlock_id = "codeblock-%d" % index1
        codeBlock["id"] = codeBlock_id
        # Add button group
        btn_group = soup.new_tag('div')
        btn_group['class'] = "btn-group"
        btn_group['role'] = "group"
        btn_group['aria-label'] = "Code Buttons"
        code_block.insert(0, btn_group)

        # Add copy button
        new_tag = soup.new_tag('button', id=codeBlock_id+'button')
        icon = soup.new_tag('i')
        icon['class'] = "fa fa-clipboard"
        new_tag['class'] = "btn btn-outline-secondary clipboard-btn"
        new_tag['alt'] = "Copy to clipboard"
        new_tag['data-clipboard-target'] = "#"+codeBlock_id
        new_tag.insert(0, icon)
        btn_group.insert(0, new_tag)
        #
        index1 += 1
