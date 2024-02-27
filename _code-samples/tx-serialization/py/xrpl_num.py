# Serializes issued currency amounts from string number representations,
# matching the precision of the XRP Ledger.

from decimal import getcontext, Decimal

class IssuedAmount:
    MIN_MANTISSA = 10**15
    MAX_MANTISSA = 10**16 - 1
    MIN_EXP = -96
    MAX_EXP = 80
    def __init__(self, strnum):
        self.context = getcontext()
        self.context.prec = 15
        self.context.Emin = self.MIN_EXP
        self.context.Emax = self.MAX_EXP

        self.dec = Decimal(strnum)

    def to_bytes(self):
        if self.dec.is_zero():
            return self.canonical_zero_serial()

        # Convert components to integers ---------------------------------------
        sign, digits, exp = self.dec.as_tuple()
        mantissa = int("".join([str(d) for d in digits]))

        # Canonicalize to expected range ---------------------------------------
        while mantissa < self.MIN_MANTISSA and exp > self.MIN_EXP:
            mantissa *= 10
            exp -= 1

        while mantissa > self.MAX_MANTISSA:
            if exp >= self.MAX_EXP:
                raise ValueError("amount overflow")
            mantissa //= 10
            exp += 1

        if exp < self.MIN_EXP or mantissa < self.MIN_MANTISSA:
            # Round to zero
            return self.canonical_zero_serial()

        if exp > self.MAX_EXP or mantissa > self.MAX_MANTISSA:
            raise ValueError("amount overflow")

        # Convert to bytes -----------------------------------------------------
        serial = 0x8000000000000000 # "Not XRP" bit set
        if sign == 0:
            serial |= 0x4000000000000000 # "Is positive" bit set
        serial |= ((exp+97) << 54) # next 8 bits are exponent
        serial |= mantissa # last 54 bits are mantissa

        return serial.to_bytes(8, byteorder="big", signed=False)


    def canonical_zero_serial(self):
        """
        Returns canonical format for zero (a special case):
        - "Not XRP" bit = 1
        - Everything else is zeroes
        - Arguably this means it's canonically written as "negative zero"
          because the encoding usually uses 1 for positive.
        """
        return (0x8000000000000000).to_bytes(8, byteorder="big", signed=False)
