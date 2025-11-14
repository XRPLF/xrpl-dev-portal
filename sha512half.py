#!/usr/bin/env python3
"""
Calculate SHA-512Half hash for amendment names.
Used to generate amendment IDs for the XRPL.
"""

import hashlib
import sys

def sha512half(data):
    """
    Calculate SHA-512Half hash of the input data.
    Returns the first 256 bits (32 bytes) of the SHA-512 hash.
    """
    if isinstance(data, str):
        data = data.encode('utf-8')
    
    sha512_hash = hashlib.sha512(data).digest()
    # Return first 32 bytes (256 bits) as hex
    return sha512_hash[:32].hex().upper()

def main():
    if len(sys.argv) < 2:
        print("Usage: sha512half.py <input_string>")
        print("Example: sha512half.py fixPriceOracleOrder")
        sys.exit(1)
    
    input_string = sys.argv[1]
    result = sha512half(input_string)
    print(result)

if __name__ == "__main__":
    main()
