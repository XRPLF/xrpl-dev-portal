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
## 8) badge links → badge component
## 9) :not_enabled: → not-enabled component
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
    if fname == "_snippets":
        return True
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

RM_PATTERNS = [
    "<!--_ -->",
    "<!--{#_ #}-->",
    "<!--#{ fix md highlighting_ #}-->",    
]
def rm_extra_syntax(ftext):
    for s in RM_PATTERNS:
        ftext = ftext.replace(s, "")
    ftext = ftext.strip()+"\n"
    return ftext

COMMON_LINKS_INCLUDES = [
    "<!--{# common link defs #}-->",
    "<!-- {# common link defs #} -->",
    "<!--{## common link defs #}-->",
    "{% include '_snippets/rippled-api-links.md' %}",
    "{% include '_snippets/tx-type-links.md' %}",
    "{% include '_snippets/rippled_versions.md' %}",
]
NEW_COMMON_LINKS = '\n{% raw-partial file="/_snippets/common-links.md" /%}\n'
def update_common_links_includes(ftext):
    """
    Remove (with no replacement) the includes that define common links at the
    end of a file. Trim out extra whitespace (except last \n)
    """
    had_common_links = False
    for s in COMMON_LINKS_INCLUDES:
        if s in ftext:
            had_common_links = True
        ftext = ftext.replace(s, "")
    
    ftext = ftext.strip()+"\n"
    if had_common_links:
        ftext += NEW_COMMON_LINKS
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

class TabsToSpaces(RegexReplacer):
    regex = re.compile(r'\t')
    replace = staticmethod(lambda m: "    ")
regex_todos.append(TabsToSpaces())

class IncludeCodeReplacer(RegexReplacer):
    regex = re.compile(r'\{\{ *include_code\( *"(?P<fname>[^"]+)"[,\s]*(start_with="(?P<start_with>[^"]+)"[,\s]*|end_before="(?P<end_before>[^"]+)"[,\s]*|language="(?P<language>[^"]+)"[,\s]*)* *\) *\}\}')
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
    regex = re.compile(r'\{\{ *include_svg\( *"(?P<fname>[^"]+)"[, ]*("(?P<caption>[^"]*)")?[, ]*(classes="(?P<classes>[^"]*)")?\) *}}')
    @staticmethod
    def replace(m):
        return '[{% inline-svg file="/' + m.group("fname") + '" /%}](/'+m.group("fname")+' "'+m.group("caption")+'")'
regex_todos.append(IncludeSvgReplacer())

class PrefixedCodeSnippetReplacer(RegexReplacer):
    regex = re.compile(r"""```(?P<language>\w*)\n(?P<prefix>[^{`]+)\n\{% include ['"](?P<path>[^'"]+)['"] %\}\s*```""")
    @staticmethod
    def replace(m: re.Match):
        escaped_prefix = m.group("prefix").replace("\n","\\n").replace('"', '\\"')+"\\n"
        return '{% code-snippet file="/'+m.group("path")+'" language="'+m.group("language")+'" prefix="'+escaped_prefix+'" /%}'
regex_todos.append(PrefixedCodeSnippetReplacer())

class PlainCodeIncludeReplacer(RegexReplacer):
    regex = re.compile(re.compile(r"""```(?P<language>\w*)\n\{% include ['"](?P<path>[^'"]+)['"] %\}\s*```"""))
    replace = staticmethod(lambda m: '{% code-snippet file="/'+m.group("path")+'" language="'+m.group("language")+'" /%}')
regex_todos.append(PlainCodeIncludeReplacer())

class SnippetReplacer(RegexReplacer):
    # Redocly requires partials to end in md due to Mardoc limitations.
    # Other includes need to be converted to code-snippet instances instead.
    regex = re.compile(r"\{% *include *'(?P<path>_[^']+\.md)' *%\}")

    @staticmethod
    def replace(m: re.Match):
        fpath = m.group("path").replace(".ja.md", ".md")
        return '{{% partial file="/{fpath}" /%}}'.format(fpath=fpath)
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

class CodePageNameReplacer(RegexReplacer):
    regex = re.compile(r"`\{\{ *(target|currentpage)\.name *\}\}`")
    @staticmethod
    def replace(m: re.Match):
        return '{% code-page-name /%}'
regex_todos.append(CodePageNameReplacer())

class VarReplacer(RegexReplacer):
    regex = re.compile(r"\{\{ *(target|currentpage)\.(?P<var>[a-z_]+) *}}")
    @staticmethod
    def replace(m):
        if m.group("var") == "name":
            return '{% $frontmatter.seo.title %}'
        else:
            return '{% $env.PUBLIC_'+m.group("var").upper()+" %}"
regex_todos.append(VarReplacer())

class TabsReplacer(RegexReplacer):
    """
    Meat to run after all the code block replacers
    """
    regex = re.compile(r'<!-- MULTICODE_BLOCK_START -->(.*?)<!-- MULTICODE_BLOCK_END -->', re.DOTALL)
    @staticmethod
    def replace(m: re.Match):
        repl_string = "{% tabs %}\n\n"
        indent = ""
        code_tab_regex = re.compile(r'^[*_](?P<tabname>[^_*]+)[*_]\n+(?P<codeblock>```.+?```|\{% code-snippet .+? /%\}$)', re.MULTILINE|re.DOTALL)
        if not code_tab_regex.search(m.group(1)):
            indented_code_tab_regex = re.compile(r'^(?P<indentation> {4,})[*_](?P<tabname>[^_*]+)[*_]\n\n(?P<codeblock>( {8,}.*|\n)+)\n\n', re.MULTILINE)
            double_indented_code_tab_regex = re.compile(r'^(?P<indentation> {8,})[*_](?P<tabname>[^_*]+)[*_]\n\n(?P<codeblock>( {12,}.*|\n)+)\n\n', re.MULTILINE) # Same as above except one level of indent more.

            if indented_code_tab_regex.search(m.group(1)):
                use_regex = indented_code_tab_regex
                if double_indented_code_tab_regex.search(m.group(1)):
                    use_regex = double_indented_code_tab_regex
                for m2 in re.finditer(use_regex, m.group(1)):
                    indent = m2.group("indentation")
                    repl_string += indent + '```{% label="'+m2.group("tabname")+'" %}\n'
                    for codeline in m2.group("codeblock").split("\n"):
                        if not codeline.strip():
                            repl_string += "\n"
                        else:
                            # Remove extra level of indentation since we're changing it to a fence.
                            # If the codeline isn't long enough, the md file probably has a syntax error.
                            repl_string += codeline[4:]+"\n"

                    # trim any excess trailing newlines
                    repl_string = repl_string.rstrip()+"\n"
                    repl_string += indent+'```\n\n'
            else:
                print("ERROR, no tab found in code tabs")
                print(m.group(1))
                exit(1)
        for m2 in re.finditer(code_tab_regex, m.group(1)):
            repl_string += '{% tab label="'+m2.group("tabname")+'" %}\n'
            repl_string += m2.group("codeblock").strip() + "\n"
            repl_string += '{% /tab %}\n\n'
        repl_string += indent+"{% /tabs %}"
        return repl_string
regex_todos.append(TabsReplacer())

callout_mapping = {
    # lowercase callout name → admonition type
    "tip": "success",
    "note": "info",
    "caution": "warning",
    "warning": "danger",
    "ヒント": "success",
    "注記": "info",
    "注意": "warning",
    "警告": "danger",
}
class BQCalloutReplacer(RegexReplacer):
    regex = re.compile(r'^\> [*_]{1,2}(?P<label>Tip|Note|Caution|Warning|ヒント|注記|注意|警告):?[*_]{1,2} (?P<content>(.*)(\n\> ?.*)*)$', re.MULTILINE|re.I)
    @staticmethod
    def replace(m: re.Match):
        admontype = callout_mapping[m.group("label").lower()]
        bq_start = re.compile(r'^\> |^\>$', re.MULTILINE)
        content = bq_start.sub('', m.group("content"))
        repl_string = '{% admonition type="'+admontype+'" name="'+m.group("label")+'" %}\n'+content+'\n{% /admonition %}'
        return repl_string
regex_todos.append(BQCalloutReplacer())

class OnelineCalloutReplacer(RegexReplacer):
    regex = re.compile(r'^(?P<indentation>\s*)[*_]{1,2}(?P<label>Tip|Note|Caution|Warning|ヒント|注記|注意|警告):?[*_]{1,2} (?P<content>.*)$', re.I)
    @staticmethod
    def replace(m: re.Match):
        admontype = callout_mapping[m.group("label").lower()]
        if m.group("indentation"):
            repl_string = m.group("indentation")+'{% admonition type="'+admontype+'" name="'+m.group("label")+'" %}'+m.group("content")+'{% /admonition %}'
        else:
            repl_string = '{% admonition type="'+admontype+'" name="'+m.group("label")+'" %}\n'+m.group("content")+'\n{% /admonition %}'
        return repl_string
regex_todos.append(OnelineCalloutReplacer())

class ImgPathReplacer(RegexReplacer):
    regex = re.compile(r'\]\(img/([^)]+)\)')
    @staticmethod
    def replace(m: re.Match):
        return "](/img/"+m.group(1)+")"
regex_todos.append(ImgPathReplacer())

class BadgeReplacer(RegexReplacer):
    regex = re.compile(r'\[(?P<text>[^\]]+)\]\((?P<href>[^ ]*)\s+"BADGE_(?P<color>\w+)"\)')
    @staticmethod
    def replace(m: re.Match):
        s = '{% badge '
        #s += 'color="'+m.group("color")+'" '
        if m.group("href"):
            s += 'href="'+m.group("href")+'" '
        s += '%}'+m.group("text")+'{% /badge %}'
        return s
regex_todos.append(BadgeReplacer())

class NotEnabledReplacer(RegexReplacer):
    regex = re.compile(r':not_enabled:')
    replace = staticmethod(lambda s: '{% not-enabled /%}')
regex_todos.append(NotEnabledReplacer())

category_regex = re.compile(r'^#?template: *pagetype-category\.html\.jinja\n', re.MULTILINE)
def convert_category_page(ftext):
    if not category_regex.search(ftext):
        return ftext
    ftext2 = re.sub(category_regex, "metadata:\n  indexPage: true\n", ftext)
    ftext2 = ftext2 + "\n\n{% child-pages /%}\n"
    return ftext2

reflink_regex = re.compile(r"\[(?P<label>[^\]]+)\]\[\]")
badge_ref_regex = re.compile(r'(?P<href>[^ ]*)\s+"BADGE_(?P<color>\w+)"')
with open("tool/autosubs_cheatsheet.yml") as f:
    AUTOSUBS = yaml.load(f)
def convert_reusable_badges(ftext):
    if not reflink_regex.search(ftext):
        return ftext
    for m in reflink_regex.finditer(ftext):
        if m.group("label") in AUTOSUBS.keys():
            ref_target = AUTOSUBS[m.group("label")]
            m2 = badge_ref_regex.match(ref_target)
            if m2:
                # Note: color intentionally omitted so it can be auto-set.
                repl_string = '{% badge href="'+m2.group("href")+'" %}'+m.group("label")+'{% /badge %}'
                ftext = ftext.replace(m.group(0), repl_string)
    return ftext

def main():
    all_mds = list_mds("content")
    for fname in all_mds:
        with open(fname) as f:
            ftext = f.read()
        ftext2 = rm_extra_syntax(ftext)
        ftext2 = update_common_links_includes(ftext2)

        for replacer in regex_todos:
            ftext2 = replacer.replace_all(ftext2)

        ftext2 = convert_reusable_badges(ftext2)

        ftext2 = convert_category_page(ftext2)

        if ftext2 != ftext:
            #print("performing syntax conversion in", fname)
            with open(fname, "w") as f:
                f.write(ftext2)

main()
