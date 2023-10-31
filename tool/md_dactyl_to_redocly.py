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
## 2) github_fork / github_branch variables
## 3) owner / account reserve variables
## 4) include_code() macro → code-snippet component
## 5) category template → child pages component
## 6) include_svg() macro?? TBD
###############################################################################

