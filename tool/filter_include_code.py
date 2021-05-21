import os

def include_code(filename, lines="", mark_disjoint="", language="",
                 start_with=None, end_before=None):

    # Note: this filter hackily assumes content/ since I don't want to figure
    # out how to actually pull values from the Dactyl config file from this
    # point in the code.
    with open("content/"+filename, encoding="utf-8") as f:
        s = f.read()

    # Set the default marker for skipped lines if a custom one isn't provided
    if mark_disjoint == True:
        mark_disjoint = "..."

    # Truncate everything before the specified starting point (start_with)
    if start_with is not None:
        start_i = s.find(start_with)
        if start_i == -1:
            raise ValueError("include_code: couldn't find start_with point '%s'"%start_with)
        s = s[start_i:]

    # Truncate everything after the specified ending point (end_before)
    if end_before is not None:
        end_i = s.find(end_before)
        if end_i == -1:
            raise ValueError("include_code: couldn't find end_before point '%s'"%end_before)
        s = s[:end_i]

    if lines:
        use_lines = parse_range(lines)
        s2 = ""
        file_lines = s.split("\n")
        old_i = None
        for i in use_lines:
            if i < 1 or i > len(file_lines):
                raise ValueError("include_code: requested line is out of range: '%s'" % i)
            if old_i != None and mark_disjoint:
                if old_i+1 != i:
                    s2 += mark_disjoint + "\n"
            s2 += file_lines[i-1] + "\n"
            old_i = i
        s = s2

    return "```%s\n%s\n```" % (language, s.strip())

def parse_range(range_string):
    range_list = []
    for x in range_string.split(","):
        part = x.split("-")
        if len(part) == 1:
            range_list.append(int(part[0]))
        elif len(part) == 2:
            range_list += [i for i in range(int(part[0]), int(part[1])+1)]
        else:
            raise ValueError("invalid range: '%s'" % range_string)
    return range_list

export = {
    "include_code": include_code
}
