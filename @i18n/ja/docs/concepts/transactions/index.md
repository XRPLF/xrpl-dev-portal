---
html: transactions.html
parent: concepts.html
seo:
    description: トランザクションは、XRP Ledgerの変更を可能にする唯一の手段です。トランザクションの形態とその使用方法について説明します。
labels:
  - トランザクション送信
  - 支払い
---
# トランザクション

_トランザクション（取引）_ は、XRP Ledgerを変更する唯一の方法です。[コンセンサスプロセス](../consensus-protocol/index.md)に従って署名され、送信され、検証済みのレジャーバージョンに承認された場合にのみ、トランザクションは最終的なものになります。レジャーのルールによっては、_[疑似トランザクション](../../references/protocol/transactions/pseudo-transaction-types/pseudo-transaction-types.md)_ も生成されます。このトランザクションは署名も送信もされませんが、コンセンサスによって承認されなければならないことは同様です。失敗したトランザクションであっても、スパム対策の[トランザクションコスト][]を支払のためXRPの残高が変わるため、レジャーに記録されます。

トランザクションで行えることは、送金だけではありません。XRP Ledgerのトランザクションは、さまざまな[支払いタイプ](../payment-types/index.md)に対応しているだけでなく、[暗号鍵](../accounts/cryptographic-keys.md)のローテーション、その他の設定の管理、およびXRP Ledgerの[分散型取引所](../tokens/decentralized-exchange/index.md)での取引にも使用されます。[トランザクションタイプの詳細なリスト](../../references/protocol/transactions/types/index.md)については、[`rippled` APIリファレンス](../../references/http-websocket-apis/index.md)をご覧ください。


### トランザクションの識別 <a id="identifying-transactions"></a>

署名付きトランザクションには、それを識別する固有の`"hash"`があります。トランザクションを送信すると、サーバのレスポンスでハッシュが返されます。[account_txコマンド](../../references/http-websocket-apis/public-api-methods/account-methods/account_tx.md)を使用して、アカウントのトランザクション履歴でトランザクションを検索することもできます。

だれでも最終的なステータスを確認として[ハッシュによってトランザクションを調べる](finality-of-results/look-up-transaction-results.md)ことができるため、トランザクションハッシュは「支払いの証明」として使用することができます。

{% raw-partial file="/@i18n/ja/docs/_snippets/setfee_uniqueness_note.md" /%}



## 請求コストの正当化

失敗したトランザクションに対しても[トランザクションコスト](transaction-cost.md)が発生するのは不公平に思えるかもしれませんが、正当な理由から`tec`クラスのエラーが存在します。

* 失敗したトランザクションの後に送信するトランザクションでは、シーケンス値の番号を変更する必要はありません。失敗したトランザクションをレジャーに組み込むと、トランザクションのシーケンス番号が順に使われ予想される順序が保持されます。
* ネットワーク全体にトランザクションを拡散されられると、ネットワークの負荷が増大します。トランザクションコストを強制することにより、攻撃者が失敗したトランザクションでネットワークを乱用することが難しくなります。
* トランザクションコストは実際には非常に少額であるため、大量のトランザクションを送信している場合を除き、ユーザに害を及ぼすことはありません。


## トランザクションの承認

分散型XRP Ledgerでは、デジタル署名によって、トランザクションが一定のアクションを起こすが承認されていることが証明されます。署名されたトランザクションのみがネットワークに送信され、検証済みレジャーに含まれます。署名付きトランザクションは不変です。その内容は変更できず、他のトランザクションでこの署名を使用することはできません。 <!-- STYLE_OVERRIDE: is authorized to -->

トランザクションは、次のいずれかの署名によって承認できます。

* 送信元アドレスと数学的に関連付けられている、マスター秘密鍵による単一の署名。[AccountSetトランザクション][]を使用して、マスターキーペアを無効または有効にできます。
* アドレスに関連付けられているレギュラー秘密鍵と一致する単一の署名。[SetRegularKeyトランザクション][]を使用して、レギュラーキーペアを追加、削除、または置き換えることができます。
* アドレスが所有する署名者のリストと一致する[マルチシグ](../accounts/multi-signing.md)。[SignerListSetトランザクション][]を使用して、署名者のリストを追加、削除、または置換することができます。

署名の種類に関係なく、あらゆるタイプのトランザクションを承認できます。ただし、次の例外があります。

* マスター秘密鍵だけが[マスター公開鍵](../../references/protocol/transactions/types/accountset.md)を無効にできます。
* マスター秘密鍵だけが[凍結機能を永続的に放棄](../tokens/fungible-tokens/freezes.md#no-freeze)できます。
* アドレスからトランザクションに署名する最後の方法を削除することはできません。

マスターキーとレギュラーキーペアについて詳しくは、[暗号鍵](../accounts/cryptographic-keys.md)をご覧ください。

<!--{# Add this reference after signatures concept doc is published. For more information about signatures, see [Understanding Signatures](concept-signatures.html). #}-->


## トランザクションへの署名とトランザクションの送信

XRP Ledgerにトランザクションを送信するには、いくつかの手順を実行する必要があります。

1. [未署名のトランザクションをJSON形式](#未署名のトランザクションの例)で作成します。
2. 1つ以上の署名を使用して[トランザクションを承認](#トランザクションの承認)します。
3. `rippled`サーバにトランザクションを送信します。トランザクションが適切に作成されている場合、サーバはそのトランザクションを現行バージョンのレジャーに暫定的に適用し、そのトランザクションをピアツーピアネットワークの他のメンバーに中継します。
4. [コンセンサスプロセス](../consensus-protocol/index.md)によって、次の検証済みレジャーに含まれる暫定的なトランザクションが決定されます。
5. `rippled`サーバはそれらのトランザクションを正規順序で前のレジャーに適用し、それらの結果を共有します。
6. 十分に[信頼できるバリデータ](../networks-and-servers/rippled-server-modes.md#バリデータ)がまったく同じレジャーを作成した場合、そのレジャーは _検証済み_ であると宣言され、そのレジャーの[トランザクションの結果](../../references/protocol/transactions/transaction-results/index.md)は不変となります。

XRP決済の送信に関する対話型チュートリアルについては、[Send XRP](../../tutorials/how-tos/send-xrp.md)をご覧ください。


### 未署名のトランザクションの例

JSON形式の未署名の[Paymentトランザクション][]の例を次に示します。

```json
{
  "TransactionType" : "Payment",
  "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
  "Amount" : {
     "currency" : "USD",
     "value" : "1",
     "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
  },
  "Fee": "12",
  "Flags": 2147483648,
  "Sequence": 2,
}
```

XRP Ledgerは、トランザクションオブジェクトが送信元アドレス（`Account`内）フィールドによって承認されている場合にのみ、トランザクションを中継して実行します。これを安全に行う方法については、[安全な署名の設定](secure-signing.md)をご覧ください。

## 署名付きトランザクションBlobの例

トランザクションに署名すると、ネットワークに送信できるバイナリーBlobが生成されます。この場合、`rippled`の[submitコマンド](../../references/http-websocket-apis/public-api-methods/transaction-methods/submit.md)を使用します。署名付きBlobと同じトランザクションの例を示します。このトランザクションは、WebSocket APIを使用して送信されています。

```json
{
  "id": 2,
  "command": "submit",
  "tx_blob" : "120000240000000461D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA968400000000000000F732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74483046022100982064CDD3F052D22788DB30B52EEA8956A32A51375E72274E417328EBA31E480221008F522C9DB4B0F31E695AA013843958A10DE8F6BA7D6759BEE645F71A7EB240BE81144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754"
}
```

## メタデータを含む実行済みトランザクションの例

トランザクションが送信されたら、APIを使用して（例えば、[txコマンド](../../references/http-websocket-apis/public-api-methods/transaction-methods/tx.md)を使用して）トランザクションのステータスを確認できます。これにより、トランザクションの指示、その結果、およびそれを実行する過程で行われたすべての変更の[メタデータ](../../references/protocol/transactions/metadata.md) が表示されます。

**注意:** トランザクションが結果コード`tesSUCCESS`で**検証済み**のレジャーに表示されない限り、トランザクションの成功は確定ではありません。関連項目: [結果のファイナリティー](finality-of-results/index.md)

`tx`コマンドのレスポンスの例:

```json
{
  "id": 6,
  "status": "success",
  "type": "response",
  "result": {
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Amount": {
      "currency": "USD",
      "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "value": "1"
    },
    "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "Fee": "10",
    "Flags": 2147483648,
    "Sequence": 2,
    "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
    "TransactionType": "Payment",
    "TxnSignature": "3045022100D64A32A506B86E880480CCB846EFA3F9665C9B11FDCA35D7124F53C486CC1D0402206EC8663308D91C928D1FDA498C3A2F8DD105211B9D90F4ECFD75172BAE733340",
    "date": 455224610,
    "hash": "33EA42FC7A06F062A7B843AF4DC7C0AB00D6644DFDF4C5D354A87C035813D321",
    "inLedger": 7013674,
    "ledger_index": 7013674,
    "meta": {
      "AffectedNodes": [
        {
          "ModifiedNode": {
            "FinalFields": {
              "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
              "Balance": "99999980",
              "Flags": 0,
              "OwnerCount": 0,
              "Sequence": 3
            },
            "LedgerEntryType": "AccountRoot",
            "LedgerIndex": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
            "PreviousFields": {
              "Balance": "99999990",
              "Sequence": 2
            },
            "PreviousTxnID": "7BF105CFE4EFE78ADB63FE4E03A851440551FE189FD4B51CAAD9279C9F534F0E",
            "PreviousTxnLgrSeq": 6979192
          }
        },
        {
          "ModifiedNode": {
            "FinalFields": {
              "Balance": {
                "currency": "USD",
                "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                "value": "2"
              },
              "Flags": 65536,
              "HighLimit": {
                "currency": "USD",
                "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "value": "0"
              },
              "HighNode": "0000000000000000",
              "LowLimit": {
                "currency": "USD",
                "issuer": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
                "value": "100"
              },
              "LowNode": "0000000000000000"
            },
            "LedgerEntryType": "RippleState",
            "LedgerIndex": "96D2F43BA7AE7193EC59E5E7DDB26A9D786AB1F7C580E030E7D2FF5233DA01E9",
            "PreviousFields": {
              "Balance": {
                "currency": "USD",
                "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                "value": "1"
              }
            },
            "PreviousTxnID": "7BF105CFE4EFE78ADB63FE4E03A851440551FE189FD4B51CAAD9279C9F534F0E",
            "PreviousTxnLgrSeq": 6979192
          }
        }
      ],
      "TransactionIndex": 0,
      "TransactionResult": "tesSUCCESS"
    },
    "validated": true
  }
}
```


## 関連項目

- **コンセプト:**
  - [支払いタイプ](../payment-types/index.md)
- **チュートリアル:**
  - [安全な署名の設定](secure-signing.md)
  - [XRPの送金](../../tutorials/how-tos/send-xrp.md)
  - [トランザクションの結果の確認](finality-of-results/look-up-transaction-results.md)
  - [WebSocketを使用した着信ペイメントの監視](../../tutorials/http-websocket-apis/build-apps/monitor-incoming-payments-with-websocket.md)
  - [トランザクションの取り消しまたはスキップ](finality-of-results/canceling-a-transaction.md)
  - [信頼できるトランザクションの送信](reliable-transaction-submission.md)
- **リファレンス:**
  - [トランザクションの共通フィールド](../../references/protocol/transactions/common-fields.md)
  - [トランザクションのタイプ](../../references/protocol/transactions/types/index.md)
  - [トランザクションのメタデータ](../../references/protocol/transactions/metadata.md)
  - [account_txメソッド][]
  - [txメソッド][]
  - [submitメソッド][]
  - [submit_multisignedメソッド][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
