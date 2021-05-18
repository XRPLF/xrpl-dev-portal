################################################
## Add class to tables
## Author: Jake Bonham
## Copyright: Ripple Labs, 2021
##
## Finds tables and adds bootstrap class 
################################################

import re

def filter_soup(soup, **kwargs):
    """
    Adds responsive class to tables.
    """

    tables = soup.find_all("table")
    for table in tables:
        table['class'] = table.get('class', []) + ['table-responsive']
