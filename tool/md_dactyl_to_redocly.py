#!/usr/bin/env python
###############################################################################
## Markdown files: Dactyl (Jinja) to Redocly (Markdoc) syntax converter
## Author: mDuo13
## License: MIT
##
## Searches md files in the content dir for specific syntax and converts it to
## a format that should work under Redocly.
##
## 1) includes → partials
## 2) variables:
##    a) github_fork / github_branch variables → repo-link component
##    b) `{{currentpage.name}}` → code-page-name component
##    c) {{currentpage.name}} → frontmatter.seo.title variable
##    d) owner / account reserve variables → env variables
## 3) include_code() macro → code-snippet component
## 4) category template → child pages component
## 5) include_svg() → inline-svg component
## 6) callouts → admonitions
## 7) code tabs → tabs component
###############################################################################

import os
import os.path
import re
import ruamel.yaml
yaml = ruamel.yaml.YAML(typ="safe")


def should_include(fname):
    """
    Return True if the given file/folder name should be checked.
    Otherwise return False.
    """
    if fname == "node_modules":
        return False
    if fname[:1] == "_":
        return False
    if ".git" in fname:
        return False
    return True


def list_mds(content_dir):
    all_mds = []
    for dirpath, dirnames, filenames in os.walk(content_dir, topdown=True):
        dirnames[:] = [d for d in dirnames if should_include(d)]
        filenames[:] = [f for f in filenames if should_include(f)]
        for filename in filenames:
            if filename[-3:] == ".md":
                #all_mds.append(os.path.relpath(os.path.join(dirpath,filename), content_dir))
                all_mds.append(os.path.join(dirpath,filename))
    return all_mds

COMMON_LINKS_INCLUDES = [
    "<!--{# common link defs #}-->",
    "<!--_ -->",
    "<!--{#_ #}-->",
    "{% include '_snippets/rippled-api-links.md' %}",
    "{% include '_snippets/tx-type-links.md' %}",
    "{% include '_snippets/rippled_versions.md' %}",
]
def rm_common_links_includes(ftext):
    """
    Remove (with no replacement) the includes that define common links at the
    end of a file. Trim out extra whitespace (except last \n)
    """
    for s in COMMON_LINKS_INCLUDES:
        ftext = ftext.replace(s, "")
    ftext = ftext.strip()+"\n"
    return ftext

class RegexReplacer():
    """
    Prototype class for replacing instances of a pattern throughout text
    """

    regex: re.compile('')

    @staticmethod
    def replace(m: re.Match):
        """
        To be overridden. Text that should replace an instance of the regex
        """
        return ""

    def replace_all(self, ftext):
        ftext2 = ftext
        for m in re.finditer(self.regex, ftext):
            raw_string = m.group(0)
            repl_string = self.replace(m)
            ftext2 = ftext2.replace(raw_string, repl_string)
        return ftext2

regex_todos = [] # List of RegexReplacer child instances to run, in order, on each page

class IncludeCodeReplacer(RegexReplacer):
    regex = re.compile(r'\{\{ *include_code\( *"(?P<fname>[^"]+)"[, ]*(start_with="(?P<start_with>[^"]+)"[, ]*|end_before="(?P<end_before>[^"]+)"[, ]*|language="(?P<language>[^"]+)"[, ]*)* *\) *\}\}')
    @staticmethod
    def replace(m: re.Match):
        """
        Convert instances of the include_code() filter to instances
        of the code-snippet Redocly component.
        """
        repl_string = '{% code-snippet file="/'+m.group("fname")+'" '
        if m.group("start_with"):
            repl_string += 'from="'+m.group("start_with")+'" '
        if m.group("end_before"):
            repl_string += 'before="'+m.group("end_before")+'" '
        if m.group("language"):
            repl_string += 'language="'+m.group("language")+'" '
        repl_string += '/%}'
        return repl_string
regex_todos.append(IncludeCodeReplacer())

class IncludeSvgReplacer(RegexReplacer):
    # TODO: handle 'classes="floating-diagram"' case from ledger-structure.md
    # TODO: use caption, link full version of diagram. Maybe wrap in <figure>.
    regex = re.compile(r'\{\{ *include_svg\( *"(?P<fname>[^"]+)"[, ]*("(?P<caption>[^"]+)")?\) *}}')
    @staticmethod
    def replace(m):
        return '<figure><a href="'+m.group("fname")+'" title="'+m.group("caption")+'">{% inline-svg file="/' + m.group("fname") + '" /%}</a></figure>'
regex_todos.append(IncludeSvgReplacer())

class SnippetReplacer(RegexReplacer):
    ## TODO: require ending in `.md` and handle code includes separately.
    ## Redocly doesn't allow snippets to be other file types due to Markdoc
    ## limitations.
    regex = re.compile(r"\{% *include *'(?P<path>_[^']+)' *%\}")
    replace = staticmethod(lambda m: '{{% partial file="/{fpath}" /%}}'.format(fpath=m.group("path")))
regex_todos.append(SnippetReplacer())

class RepoLinkReplacer(RegexReplacer):
    """
    Replacement for links that use {{github_forkurl}} and {{github_branch}}.
    Uses a custom repo-link component to pull info from .env, since variables
    can't be evaluated inside the href of a link.

    Note, this has to be run before general vars replacement since it covers a
    special case that's larger than one variable.
    """
    regex = re.compile(r"\[(?P<linktext>[^\]]+)\]\(\{\{ *target\.github_forkurl *\}\}/(tree|blob)/\{\{ *target\.github_branch *\}\}/(?P<path>[^\)]+)\)")
    replace = staticmethod(lambda m: '{% repo-link path="'+m.group("path")+'" %}'+m.group("linktext")+'{% /repo-link %}')
regex_todos.append(RepoLinkReplacer())

class VarReplacer(RegexReplacer):
    regex = re.compile(r"\{\{ *(target|currentpage)\.(?P<var>[a-z_]+) *}}")
    @staticmethod
    def replace(m):
        if m.group("var") == "name":
            return '{% $frontmatter.seo.title %}'
        else:
            return '{% $env.PUBLIC_'+m.group("var").upper()+" %}"
regex_todos.append(VarReplacer())

def main():
    all_mds = list_mds("content")
    for fname in all_mds:
        with open(fname) as f:
            ftext = f.read()
        ftext2 = rm_common_links_includes(ftext)

        for replacer in regex_todos:
            ftext2 = replacer.replace_all(ftext2)

        if ftext2 != ftext:
            #print("performing syntax conversion in", fname)
            with open(fname, "w") as f:
                f.write(ftext2)

main()