---
html: advance-the-ledger-in-stand-alone-mode.html
parent: use-stand-alone-mode.html
seo:
    description: レジャーを手動で閉鎖して、スタンドアロンモードでの処理を進めます。
labels:
  - コアサーバ
---
# スタンドアロンモードでレジャーを進める

スタンドアロンモードでは`rippled`はピアツーピアネットワークの他のメンバーと通信せず、またコンセンサスプロセスに参加しません。このため、[ledger_acceptメソッド][]を使用してレジャーインデックスを手動で進める必要があります。

```
rippled ledger_accept --conf=/path/to/rippled.cfg
```

スタンドアロンモードでは`rippled`は「閉鎖済み」レジャーバージョンと「検証済み」レジャーバージョンは区別されません。（これらのバージョンの違いについての詳細は、[XRP Ledgerコンセンサスプロセス](../../concepts/consensus-protocol/index.md)をご覧ください。）

`rippled`は、レジャーを閉鎖するたびに、確定的だが操作困難なアルゴリズムに基づいてトランザクションを並べ替えます。（トランザクションはネットワークの異なるパスに異なる順序で着信することがあるため、これはコンセンサスの重要な部分です。）スタンドアロンモードで`rippled`を使用するときには、別のアドレスからのトランザクションの結果に依存するトランザクションは、それを送信する前に、レジャーを手動で進める必要があります。このようにしないと、レジャーの閉鎖時に2つのトランザクションが逆の順序で実行される可能性があります。**注記:** 複数のトランザクションを1つのアドレスから1つのレジャーへ安全に送信できます。これは、同じアドレスからのトランザクションは`rippled`により[`Sequence`番号](../../references/protocol/transactions/common-fields.md)の昇順でソートされるためです。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
