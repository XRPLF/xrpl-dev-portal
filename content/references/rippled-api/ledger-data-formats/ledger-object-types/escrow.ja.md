# Escrow
[[ソース]<br>](https://github.com/ripple/rippled/blob/c6b6d82a754fe449cc533e18659df483c10a5c98/src/ripple/protocol/impl/LedgerFormats.cpp#L90-L101 "Source")

_（[Escrow Amendment][]が必要です。）_

`Escrow`オブジェクトタイプは、実行または取り消しを待機している保留中のXRP支払を表します。[EscrowCreateトランザクション][]はレジャーに`Escrow`オブジェクトを作成します。[EscrowFinish][]トランザクションまたは[EscrowCancel][]トランザクションが正常に完了すると、オブジェクトが削除されます。``Escrow``オブジェクトに [_Crypto-condition_](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02)が指定されている場合、支払が成功するのは、EscrowFinishトランザクションに指定された対応する _フルフィルメント_ がその条件を満たす場合だけです。（サポートされている唯一のCrypto-conditionタイプは[PREIMAGE-SHA-256](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02#section-8.1)です。）`Escrow`オブジェクトに`FinishAfter`時刻が指定されている場合、保留中の支払はその時刻の経過後にのみ実行されます。

`Escrow`オブジェクトには次の2つのアドレスが関連付けられています。

- `Escrow`オブジェクトの作成時にXRPを供給する所有者。保留中の支払が取り消されると、XRPは所有者に返金されます。
- 保留中の支払が成功するとXRPが支払われる宛先。宛先は所有者と同じにできます。

## {{currentpage.name}} JSONの例

```json
{
   "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
   "Amount": "10000",
   "CancelAfter": 545440232,
   "Condition": "A0258020A82A88B2DF843A54F58772E4A3861866ECDB4157645DD9AE528C1D3AEEDABAB6810120",
   "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
   "DestinationTag": 23480,
   "FinishAfter": 545354132,
   "Flags": 0,
   "LedgerEntryType": "Escrow",
   "OwnerNode": "0000000000000000",
   "DestinationNode": "0000000000000000",
   "PreviousTxnID": "C44F2EB84196B9AD820313DBEBA6316A15C9A2D35787579ED172B87A30131DA7",
   "PreviousTxnLgrSeq": 28991004,
   "SourceTag": 11747,
   "index": "DC5F3851D8A1AB622F957761E5963BC5BD439D5C24AC6AD7AC4523F0640244AC"
}
```

## {{currentpage.name}}フィールド

`Escrow`オブジェクトのフィールドは次のとおりです。

| 名前              | JSONの型 | [内部の型][] | 説明 |
|-------------------|-----------|---------------|-------------|
| `LedgerEntryType`   | 文字列    | UInt16    | 値`0x0075`が文字列`Escrow`にマッピングされている場合は、このオブジェクトが`Escrow`オブジェクトであることを示します。 |
| `Account`           | 文字列 | AccountID | この保留中の支払の所有者（送金元）のアドレス。これはXRPを供給し、保留中の支払が取り消された場合にXRPが返金されるアカウントです。 |
| `Destination`       | 文字列 | AccountID | 保留中の支払が成功するとXRPが支払われる宛先アドレス。 |
| `Amount`            | 文字列 | Amount    | 保留中の支払から送金されるXRPの額（drop単位）。 |
| `Condition`         | 文字列 | VariableLength | _（省略可）_ [PREIMAGE-SHA-256 Crypto-condition](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02#section-8.1)（16進数）。指定されている場合、[EscrowFinishトランザクション][]にこの条件を満たすフルフィルメントが含まれている必要があります。 |
| `CancelAfter`       | 数値 | UInt32 | _（省略可）_ このフィールドがあり、 _かつ_ 指定されている時刻を経過している場合にのみ、保留中の支払を取り消すことができます。具体的には、これは[Rippleエポック以降の経過秒数][]として指定され、前の検証済みレジャーの閉鎖時刻よりも早い場合に「経過した」ことになります。 |
| `FinishAfter`       | 数値 | UInt32 | _（省略可）_ [Rippleエポック以降の経過秒数][]で示される時刻が経過した後、保留中の支払を完了できます。この時刻より前の[EscrowFinishトランザクション][]はすべて失敗します。（特にこれは、前の検証済みレジャーの閉鎖時刻と比較されます。） |
| `Flags`             | 数値 | UInt32 | ブールフラグのビットマップ。Escrowタイプにはフラグが定義されていないため、この値は常に`0`です。 |
| `SourceTag`         | 数値 | UInt32 | _（省略可）_ この保留中の支払の支払元（所有者のアドレスにホスティングされている受取人など）を詳しく指定するための任意のタグ。 |
| `DestinationTag`    | 数値 | UInt32 | _（省略可）_ この保留中の支払の宛先（宛先アドレスにホスティングされている受取人など）を詳しく指定するための任意のタグ。 |
| `OwnerNode`         | 文字列    | UInt64    | 所有者のディレクトリが複数ページで構成されている場合に、このオブジェクトにリンクしているページを示すヒントです。**注記:** このオブジェクトには、オブジェクトを含む所有者ディレクトリへの直接リンクは含まれていません。これは、その値を`Account`から取得できるためです。 |
| `DestinationNode`   | 文字列    | UInt64    | _（省略可）_ 宛先の所有者ディレクトリが複数ページで構成されている場合に、このオブジェクトにリンクしているページを示すヒントです。[fix1523 Amendment][]を有効にする前に作成されたEscrowでは省略されています。 |
| `PreviousTxnID`     | 文字列 | Hash256 | 最後にこのオブジェクトを変更したトランザクションの識別用ハッシュ。 |
| `PreviousTxnLgrSeq` | 数値 | UInt32 | 最後にこのオブジェクトを変更したトランザクションが記録された[レジャーインデックス][]。 |


## Escrow IDのフォーマット

`Escrow`オブジェクトのIDは、以下の値がこの順序で連結されている[SHA-512ハーフ][]です。

* Escrowスペースキー（`0x0075`）
* `Escrow`オブジェクトを作成した[EscrowCreateトランザクション][]の送信者のAccountID。
* `Escrow`オブジェクトを作成した[EscrowCreateトランザクション][]のシーケンス番号。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
