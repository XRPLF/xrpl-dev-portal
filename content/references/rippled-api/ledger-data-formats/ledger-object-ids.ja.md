# レジャーオブジェクトID
<a id="sha512half"></a>

レジャーの状態ツリーのすべてのオブジェクトには一意のIDがあります。このフィールドは、オブジェクトの内容と同じレベルでJSONの`index`フィールドとして返されます。IDは、オブジェクトの重要な内容をハッシュし、[名前空間ID](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/LedgerFormats.h#L99)を使用して生成されます。[レジャーオブジェクトタイプ](ledger-object-types.html)により、使用する名前空間IDとハッシュに含める内容が決定します。これにより、すべてのIDが一意になります。ハッシュを計算するため、`rippled`はSHA-512を使用し、その結果を最初の256バイトで切り捨てます。**SHA-512Half**と呼ばれるこのアルゴリズム出力は、SHA-256と同等のセキュリティで、64ビットプロセッサーでは実行にかかる時間が短くなります。

![図: rippledによる、SHA-512Halfを使用したレジャーオブジェクトIDの生成。スペースキーは、異なるオブジェクトタイプIDの競合を防止します。](img/ledger-indexes.ja.png)


## 関連項目

- XRP Ledgerでは、ハッシュがどのように生成、使用されているかについての詳細は、[ハッシュ](basic-data-types.html#ハッシュ)を参照してください。
- レジャーの基本的な説明については、[レジャー](ledgers.html)を参照してください。


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}