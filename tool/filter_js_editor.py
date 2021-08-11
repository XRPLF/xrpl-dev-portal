# JS Editor Filter
# Author: Rome Reginelli
# Copyright: Ripple Labs, 2020
#
# Requires: CodeMirror (JS & CSS), js-editor.js
#
# Converts a code block into an editable JavaScript interpreter, with
# "Run" and "Reset" buttons, and an output box that copies console.log().
# Code blocks beyond the first get turned into functions that replace the
# code block's contents and scroll to it.
# Syntax:
#
# <!-- JS_EDITOR_START some_unique_id_here -->
#
# ```js
# const foo = "bar"; // This is the default value
# ```
#
# ```js
# const baz = "Non-default value"
# ```
#
# <!-- JS_EDITOR_END -->
#

import re
import logging

START_REGEX = re.compile(r"<!--\s*JS_EDITOR_START\s*(\w+)\s*-->")
END_REGEX = re.compile(r"<!--\s*JS_EDITOR_END\s*-->")

START_REPL = """<div class="js_interactive" id="\\1">
<div class="editor"></div>"""
END_REPL = """
<p>
  <button type="button" class="btn btn-primary run-button">Run</button>
  <button type="reset" class="btn btn-outline-secondary reset-button">Reset</button>
</p>
<div class="response"></div>
</div>"""


def filter_html(html, mode="html", **kwargs):
    """
    Replace the editor with a div after markdown is parsed
    """

    if mode == "md": # shouldn't even come up, but just in case... don't do it
        return html


    html = re.sub(START_REGEX, START_REPL, html)
    html = re.sub(END_REGEX, END_REPL, html)
    return html
