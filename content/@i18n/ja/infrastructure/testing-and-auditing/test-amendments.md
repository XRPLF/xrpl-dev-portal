---
html: test-amendments.html
parent: configure-rippled.html
blurb: ネットワーク上で有効になる前に、Amendmentをテストすることができます。
labels:
  - ブロックチェーン
---
# Amendmentのテスト


本番ネットワークでAmendmentが完全に有効になる前に、スタンドアロンモードを使って`rippled` の動作をテストすることができます。

**注意:** これは開発目的の利用を想定しています。

機能を強制的に有効にするには、`rippled.cfg` ファイルに `[features]`節とAmendmentの短い名前を追加してください。各Amendmentにはそれぞれ行が必要です。

<!-- MULTICODE_BLOCK_START -->
_Example_

```
[features]
MultiSign
TrustSetAuth
```

<!-- MULTICODE_BLOCK_END -->
