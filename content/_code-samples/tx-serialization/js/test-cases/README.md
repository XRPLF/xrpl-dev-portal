# Transaction Serialization Test Cases

This folder contains several transactions in their JSON and binary forms, which
you can use to verify the behavior of transaction serialization code.

For example (starting from the `tx-serialization/` dir above this one):

```bash
$ python3 serialize.py -f test-cases/tx2.json | \
  diff - test-cases/tx2-binary.txt
```

The expected result is no output because the output of `serialize.py` matches
the contents of `test-cases/tx2-binary.txt` exactly.

For an example of how the output is different if you change the `Fee` parameter of sample transaction 1, we can pipe a modified version of the file into the serializer:

```bash
$ cat test-cases/tx1.json | \
   sed -e 's/"Fee": "10"/"Fee": "100"/' | \
   python3 serialize.py --stdin | \
   diff - test-cases/tx1-binary.txt --color
```

The output shows that the two versions of the transaction binary are different (but because they're all on one line, it's not super clear _where_ within the line the difference is):

```text
1c1
< 120007220008000024001ABED82A2380BF2C2019001ABED764D55920AC93914000000000000000
00000000000055534400000000000A20B3C85F482532A9578DBB3950B85CA06594D165400000037E
11D600684000000000000064732103EE83BB432547885C219634A1BC407A9DB0474145D69737D09C
CDC63E1DEE7FE3744630440220143759437C04F7B61F012563AFE90D8DAFC46E86035E1D965A9CED
282C97D4CE02204CFD241E86F17E011298FC1A39B63386C74306A5DE047E213B0F29EFA4571C2C81
14DD76483FACDEE26E60D8A586BB58D09F27045C46
---
> 120007220008000024001ABED82A2380BF2C2019001ABED764D55920AC93914000000000000000
00000000000055534400000000000A20B3C85F482532A9578DBB3950B85CA06594D165400000037E
11D60068400000000000000A732103EE83BB432547885C219634A1BC407A9DB0474145D69737D09C
CDC63E1DEE7FE3744630440220143759437C04F7B61F012563AFE90D8DAFC46E86035E1D965A9CED
282C97D4CE02204CFD241E86F17E011298FC1A39B63386C74306A5DE047E213B0F29EFA4571C2C81
14DD76483FACDEE26E60D8A586BB58D09F27045C46
```

(If you're curious, the difference appears in the third line of each blob in this example. The modified version of the transaction serializes the `Fee` amount ending in `64` (hex for 100) while the original version ended in `0A` (hex for 10).)

For a friendlier display, you could pipe the output of the serializer to a file and use a visual tool like [Meld](http://meldmerge.org/) that shows intra-line differences:

```bash
$ cat test-cases/tx1.json | sed -e 's/"Fee": "10"/"Fee": "100"/' | python3 serialize.py --stdin > /tmp/tx1-modified.txt && meld /tmp/tx1-modified.txt test-cases/tx1-binary.txt
```

![Meld screenshot showing the `0A` / `64` difference](meld-example.png)
