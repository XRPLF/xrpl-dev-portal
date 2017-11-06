XRP Ledger APIs generally use strings, rather than native JSON numbers, to represent numeric amounts of currency for both XRP and issued currencies. This protects against a loss of precision when using JSON parsers, which may automatically try to represent all JSON numbers in a floating-point format. Within the String value, the numbers are serialized in the same way as native JSON numbers:

* Base-10.
* Non-zero-prefaced.
* May contain `.` as a decimal point. For example, ½ is represented as `0.5`. (American style, not European)
* May contain `E` or `e` to indicate being raised to a power of 10 (scientific notation). For example, `1.2E5` is equivalent to 1.2×10<sup>5</sup>, or `120000`.
* No comma (`,`) characters are used.
