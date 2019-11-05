# 取引の基本

 _取引（トランザクション）_ は、XRP Ledgerを変更する唯一の方法です。[コンセンサスプロセス](consensus.html)に従って署名され、送信され、検証済みのレジャーバージョンに承認された場合にのみ、トランザクションは最終的なものになります。レジャーのルールによっては、 _[疑似トランザクション](pseudo-transaction-types.html)_ も生成されます。このトランザクションは署名も送信もされませんが、コンセンサスによって承認されなければならないことは同様です。失敗したトランザクションであっても、スパム対策の[トランザクションコスト][]を支払のためXRPの残高が変わるため、レジャーに記録されます。


### トランザクションの識別

署名付きトランザクションには、それを識別する固有の`"hash"`があります。トランザクションを送信すると、サーバーの応答でハッシュが返されます。[account_txコマンド](account_tx.html)を使用して、アカウントのトランザクション履歴でトランザクションを検索することもできます。

だれでも最終的なステータスを確認として[ハッシュによってトランザクションを調べる](look-up-transaction-results.html)ことができるため、トランザクションハッシュは「支払いの証明」として使用することができます。


## 請求コストの正当化

失敗したトランザクションに対しても[トランザクションコスト](transaction-cost.html)が発生するのは不公平に思えるかもしれませんが、正当な理由から`tec`クラスのエラーが存在します。

* 失敗したトランザクションの後に送信するトランザクションでは、シーケンス値の番号を変更する必要はありません。失敗したトランザクションをレジャーに組み込むと、トランザクションのシーケンス番号が順に使われ予想される順序が保持されます。
* ネットワーク全体にトランザクションを拡散されられると、ネットワークの負荷が増大します。トランザクションコストを強制することにより、攻撃者が失敗したトランザクションでネットワークを乱用することが難しくなります。
* トランザクションコストは実際には非常に少額であるため、大量のトランザクションを送信している場合を除き、ユーザーに害を及ぼすことはありません。


## 取引の承認

分散型XRP Ledgerでは、デジタル署名によって、トランザクションが一定のアクションを起こすが承認されていることが証明されます。署名されたトランザクションのみがネットワークに送信され、有効なレジャーに含まれます。署名付きトランザクションは不変です。その内容は変更できず、他のトランザクションでこの署名を使用することはできません。 <!-- STYLE_OVERRIDE: is authorized to -->

トランザクションは、次のいずれかの署名によって承認できます。

* 送信元アドレスと数学的に関連付けられている、マスター秘密鍵による単一の署名。[AccountSetトランザクション][]を使用して、マスターキーペアを無効または有効にできます。
* アドレスに関連付けられているレギュラー秘密鍵と一致する単一の署名。[SetRegularKeyトランザクション][]を使用して、レギュラーキーペアを追加、削除、または置き換えることができます。
* アドレスが所有する署名者のリストと一致する[マルチ署名](multi-signing.html)。[SignerListSetトランザクション][]を使用して、署名者のリストを追加、削除、または置換することができます。

署名の種類に関係なく、あらゆるタイプのトランザクションを承認できます。ただし、次の例外があります。

* マスター秘密鍵だけが[マスター公開鍵](accountset.html)を無効にできます。
* マスター秘密鍵だけが[凍結機能を永続的に放棄](freezes.html#no-freeze)できます。
* アドレスからトランザクションに署名する最後の方法を削除することはできません。

マスターキーとレギュラーキーペアについて詳しくは、[暗号鍵](cryptographic-keys.html)を参照してください。

<!--{# Add this reference after signatures concept doc is published. For more information about signatures, see [Understanding Signatures](concept-signatures.html). #}-->


## トランザクションへの署名とトランザクションの送信

XRP Ledgerにトランザクションを送信するには、いくつかの手順を実行する必要があります。

1. [未署名のトランザクションをJSON形式](#未署名のトランザクションの例)で作成します。
2. 1つ以上の署名を使用して[トランザクションを承認](#取引の承認)します。
3. `rippled`サーバーにトランザクションを送信します。トランザクションが適切に作成されている場合、サーバーはそのトランザクションを現行バージョンのレジャーに暫定的に適用し、そのトランザクションをピアツーピアネットワークの他のメンバーに中継します。
4. [コンセンサスプロセス](consensus.html)によって、次の検証済みレジャーに含まれる暫定的なトランザクションが決定されます。
5. `rippled`サーバーはそれらのトランザクションを正規順序で前のレジャーに適用し、それらの結果を共有します。
6. 十分に[信頼できるバリデータ](rippled-server-modes.html#バリデータを運用する理由) がまったく同じレジャーを作成した場合、そのレジャーは _検証済み_ であると宣言され、そのレジャーの[トランザクションの結果](transaction-results.html)は不変となります。

XRP決済の送信に関する対話型チュートリアルについては、[Send XRP](send-xrp.html)を参照してください。


### 未署名のトランザクションの例

JSON形式の未署名の[Paymentトランザクション][]の例を次に示します。

```
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

XRP Ledgerは、トランザクションオブジェクトが送信元アドレス（`Account`内）フィールドによって承認されている場合にのみ、トランザクションを中継して実行します。単一の署名によってのみ承認されたトランザクションの場合、2つの選択肢があります。

1. バイナリーブロブに変換してオフラインで署名します。これが望ましい方法です。トランザクションの署名に使用されたアカウントの機密情報がネットワーク接続を介して送信されないことを意味するためです。
    * オフライン署名には[RippleAPI](rippleapi-reference.html#sign)を使用できます。
2. `rippled`サーバーにトランザクションの署名を依頼します。[signコマンド](sign.html)はJSON形式のトランザクションと機密情報を受け取り、送信可能な署名付きバイナリートランザクション形式を返します。（アカウントの機密情報を送信するのは危険です。そのため、信頼できる暗号化された接続内か、またはローカル接続経由で、自分が管理しているサーバーのみに送信するようにしてください。）
    * ショートカットとして、`tx_json`オブジェクトを指定した[submitコマンド](submit.html)を使用してトランザクションへの署名とトランザクションの送信を同時に実行できます。これはテストと開発の目的の場合にのみ推奨されます。

## 署名付きトランザクションブロブの例

トランザクションに署名すると、ネットワークに送信できるバイナリーブロブが生成されます。この場合、`rippled`の[submitコマンド](submit.html)を使用します。署名付きブロブと同じトランザクションの例を示します。このトランザクションは、WebSocket APIを使用して送信されています。

```
{
  "id": 2,
  "command": "submit",
  "tx_blob" : "120000240000000461D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA968400000000000000F732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74483046022100982064CDD3F052D22788DB30B52EEA8956A32A51375E72274E417328EBA31E480221008F522C9DB4B0F31E695AA013843958A10DE8F6BA7D6759BEE645F71A7EB240BE81144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754"
}
```

## メタデータを含む実行済みトランザクションの例

トランザクションが送信されたら、APIを使用して（例えば、[txコマンド](tx.html)を使用して）トランザクションのステータスを確認できます。これにより、トランザクションの指示、その結果、およびそれを実行する過程で行われたすべての変更の[メタデータ](transaction-metadata.html) が表示されます。

**注意:** トランザクションが結果コード`tesSUCCESS`で**検証済み**のレジャーに表示されない限り、トランザクションの成功は最終的なものではありません。関連項目:[結果のファイナリティー](finality-of-results.html)

`tx`コマンドの応答の例:

```
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

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
