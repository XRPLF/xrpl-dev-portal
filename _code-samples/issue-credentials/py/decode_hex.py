from binascii import unhexlify

def decode_hex(s_hex):
    """
    Try decoding a hex string as ASCII; return the decoded string on success,
    or the un-decoded string prefixed by '(BIN) ' on failure.
    """
    try:
        s = unhexlify(s_hex).decode("ascii")
        # Could use utf-8 instead, but it has more edge cases.
        # Optionally, sanitize the string for display before returning
    except:
        s = "(BIN) "+s_hex
    return s
