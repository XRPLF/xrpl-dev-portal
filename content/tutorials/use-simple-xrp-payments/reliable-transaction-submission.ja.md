# 信頼できるトランザクションの送信

XRP Ledgerを使用する金融機関やその他のサービスは、ここで説明するベストプラクティスを使用し、迅速で確認可能な方法で、トランザクションが検証または拒否されるようにする必要があります。  信頼できる（ローカルで運営されている）`rippled`サーバーにトランザクションを送信してください。

本書で説明されているベストプラクティスを使用すると、アプリケーションはアーカイブ中にトランザクションをXRP Ledgerに送信できます。

1. [べき等性](https://en.wikipedia.org/wiki/Idempotence) - トランザクションは、一度のみ処理するか、またはまったく処理しないようにします。
2. 検証可能性 - アプリケーションはトランザクションの最終結果を判断できます。

ベストプラクティスを導入しないと、アプリケーションに以下のエラーが発生する可能性があります。

1. 誤って実行されなかったトランザクションを送信する。
2. 暫定的なトランザクションを、最終的で不変の結果として誤判断する。
3. レジャーに以前に適用されたトランザクションの正式な結果を検出できない。

こういったタイプのエラーは、深刻な問題に繋がる可能性があります。  例えば、以前のPaymentトランザクションを検出できないアプリケーションは、誤ってトランザクションを再送信してしまい、元の支払いが重複してしまう可能性があります。  したがって、本書で説明するテクニックを使用し、アプリケーションが正式なトランザクション結果に基づいてアクションをとることが非常に重要です。

## 背景

XRP Ledgerプロトコルは、ネットワークのすべてのサーバーで共有されるレジャー（台帳）を提供します。  [コンセンサスと検証のプロセス](https://ripple.com/build/ripple-ledger-consensus-process/)を通じ、ネットワークはトランザクションがレジャーに適用される（または除外される）順序に同意します。

正しい形式のトランザクションを信頼できるXRP Ledgerサーバーに送信すると、数秒で検証または拒否されます。  ただし、正しい形式のトランザクションであっても迅速に検証も拒否もされないことがあります。このような特殊なケースは、アプリケーションがトランザクションを送信した後にグルーバル[トランザクションコスト](transaction-cost.html)が増加すると発生することがあります。  トランザクションに指定された額よりもトランザクションコストが増加すると、そのトランザクションは次回の検証済みレジャーに含まれません。後日、グローバルトランザクションコストが下がった場合には、そのトランザクションは後のレジャーに含まれます。トランザクションに有効期限が指定されていない場合には、レジャーへの追加はいつになるか分かりません。

電源やネットワークに障害が発生した場合には、送信済みトランザクションのステータスの検出時にさらに多くの問題に直面します。アプリケーションは、トランザクションの適切な送信と、その後の正式結果の適切な受信の両方に十分な注意を払う必要があります。




### トランザクションのタイムライン

XRP Ledgerには、[`rippled` API](rippled-api.html)や[RippleAPI](rippleapi-reference.html)など、トランザクションを送信するためのAPIがいくつかあります。  使用するAPIにかかわらず、トランザクションは以下のようにレジャーに適用されます。

1. アカウント所有者は、トランザクションを作成して署名します。
2. 所有者は、トランザクション候補として、そのトランザクションをネットワークに送信します。
    - 形式が正しくないトランザクションや無意味なトランザクションはただちに拒否されます。
    - 形式が正しいトランザクションは、暫定的に成功し、後で失敗することもあります。
    - 形式が正しいトランザクションは、暫定的に失敗し、後で成功することもあります。
    - 形式が正しいトランザクションは、暫定的に成功し、後で少々異なった形で成功することもあります。（例えば、別のオファーが使用され、暫定的な結果よりも良い（または悪い）為替レートになることがあります。）
3. コンセンサスと検証を通じ、トランザクションがレジャーに適用されます。ネットワークの伝達のコストを適用するために、一部の失敗したトランザクションも適用されることがあります。
4. 検証されたレジャーにはそのトランザクションが含まれ、その結果がレジャーの状態に反映されます。
    - トランザクション結果は暫定的なものではなくなり、成功または失敗の結果は最終的かつ不変のものとなります。

**注記:** `rippled`を介してトランザクションを送信すると、送信コマンドから返される成功ステータスコードによって、`rippled`サーバーがトランザクション候補を受信したことが示されます。このトランザクションは、検証されたレジャーに適用される場合とされない場合があります。

APIは、現在の進行中のレジャーにトランザクション候補を適用した結果に基づいて、暫定的な結果を返すことがあります。アプリケーションでは、この結果を、トランザクションの最終的な*不変の*結果と混同してはなりません。  不変の結果は、検証済みのレジャーだけにあります。  アプリケーションは、トランザクション結果を含むレジャーが検証されるまで、トランザクションのステータスを繰り返し照会する必要があります。

トランザクションの適用時に、`rippled`サーバーは、*最後に検証されたレジャー*を使用します。これは、すでにネットワーク全体によって検証されたトランザクションに基づくレジャーの状態のスナップショットです。  コンセンサスと検証のプロセスは、新しいトランザクションのセットを、最後に検証されたレジャーに正規の順序で適用します。その結果、新しい検証済みレジャーが出来上がります。  この新しい検証済みレジャーインスタンスとその前のインスタンスがレジャー履歴を形成します。

検証済みの各レジャーインスタンスにはシーケンス番号が付けられます。これは、前のインスタンスのシーケンス番号よりも1つ大きい番号です。また、各レジャーには識別用のハッシュ値があります。これは、レジャーの内容から決定される固有の値です。進行中のレジャーには多数のバージョンが存在することがあります。その場合、シーケンス番号は同じですが、ハッシュ値が異なります。検証できるのは、1つのバージョンのみです。

各検証済みレジャーには、トランザクションが適用される正規の順序があります。この順序は、レジャーの最終的なトランザクションセットに基づいて決定されます。これと異なり、各`rippled`サーバーの進行中のレジャーでは、トランザクションの受信時に増分計算されます。トランザクションを暫定的に実行する順序は、新しい検証済みレジャーを構築するためにトランザクションを実行する順序とは通常異なります。これが、トランザクションの暫定的な結果が最終結果とは異なる可能性がある理由の1つです。例えば、ある支払いが、同じオファーを使用する別の支払いの前と後のどちらで実行されるかによって、最終的な為替レートが異なることがあります。



### LastLedgerSequence

`LastLedgerSequence`は、省略可能な[全トランザクションに適用されるパラメーター](transaction-common-fields.html)です。  このパラメーターは、XRP Ledgerに、トランザクションを特定のレジャーインスタンスで検証する必要があること、またはトランザクションを特定のレジャーインスタンスの前に検証する必要があることを指示します。  XRP Ledgerは、シーケンス番号がトランザクションの`LastLedgerSequence`パラメーターよりも大きいトランザクションをレジャーインスタンスに含めることは決してありません。

`LastLedgerSequence`パラメーターを使用すれば、トランザクションが迅速に確認されず、将来のレジャーに含まれるような好ましくないケースを防止できます。  `LastLedgerSequence`パラメーターは、各トランザクションに指定する必要があります。  自動プロセスでは、最後に検証されたレジャーインデックスよりも4つ大きい数値を使用して、トランザクションが予測可能な方法で、かつ迅速に検証または拒否されるようにします。

`rippled` APIを使用するアプリケーションは、トランザクションの送信時に、`LastLedgerSequence`を明示的に指定する必要があります。

RippleAPIでは、[Transaction Instructions](rippleapi-reference.html#transaction-instructions)で説明されている`maxLedgerVersion`フィールドを使用して`LastLedgerSequence`を指定します。  RippleAPIは、デフォルトで自動的に適切な値を提供します。  期限なしで実行される可能性のあるトランザクションを実行する場合には、`maxLedgerVersion`を`null`に指定して故意に`LastLedgerSequence`を省略できますが、これはお勧めできません。



## ベストプラクティス


### 信頼性の高いトランザクション送信

トランザクションを送信するアプリケーションでは、以下のベストプラクティスを使用し、プロセス終了やその他の問題が発生した場合でも信頼性が高い方法でトランザクションを送信する必要があります。  アプリケーションが最終的で検証済みの結果に基づいて処理できるように、アプリケーションのトランザクション結果を確認する必要があります。

送信と確認は別々の異なる手続きであり、本書の説明に基づいてこれを実装することができます。

1. 送信 - トランザクションがネットワークに送信され、暫定的な結果が戻されます。
2. 確認 - 検証済みレジャーを確認し、正式な結果が判断されます。


### 送信

送信が完了する前に電源障害やネットワーク障害が発生する可能性に備え、送信前にトランザクションの詳細を[保持](https://en.wikipedia.org/wiki/Persistence_%28computer_science%29)しておきます。  再起動時に、保持された値により、トランザクションのステータスを確認することが可能になります。

送信プロセスは次のとおりです。

1. トランザクションを生成して署名します
    - `LastLedgerSequence`パラメーターを指定します
2. 以下を保存して、トランザクション詳細を保持しておきます
    - トランザクションハッシュ
    - LastLedgerSequence
    - 送信者のアドレスとシーケンス番号
    - 送信時における最新の検証済みレジャーインデックス
    - 必要に応じて、アプリケーション固有のデータ
3. トランザクションを送信します



### 確認

通常の操作中に、アプリケーションは、送信されたトランザクションのステータスをハッシュによって確認できます。または、使用するAPIによっては、トランザクションが確認（または拒否）されたときにその通知を受信できます。  この通常操作は、ネットワーク障害や電源障害などによって中断されることがあります。  そのような中断が発生した場合には、アプリケーションは信頼性の高い方法で、中断前にネットワークに送信された（または送信されなかった）可能性のあるトランザクションのステータスを確認する必要があります。

再起動時、または最新の検証済みレジャーの確認時の例を示します（擬似コード）:

```
For each persisted transaction without validated result: 
    Query transaction by hash
    If (result appears in validated ledger)
        # Outcome is final
        Persist the final result
        If (result code is tesSUCCESS)
            Application may act based on successful transaction
        Else
            The transaction failed (1)
            If appropriate for the application and failure type, submit with
                new LastLedgerSequence and Fee

    Else if (LastLedgerSequence > newest validated ledger)
        # Outcome is not yet final
        Wait for more ledgers to be validated

    Else
        If (server has continuous ledger history from the ledger when the
              transaction was submitted up to and including the ledger
              identified by LastLedgerSequence)
            The transaction failed (2)
            If appropriate for the application, submit with
                new LastLedgerSequence and Fee

        Else
            # Outcome is final, but not known due to a ledger gap
            Wait to acquire continuous ledger history
```

#### 失敗のケース

2つのトランザクション失敗のケース（疑似コードの（1）と（2））の間の違いは、トランザクションが検証されたレジャーに含まれていたかどうかです。いずれのケースにおいても、失敗の処理には十分な注意が必要です。

- 失敗のケース（1）では、トランザクションはレジャーに含まれ、[XRPトランザクションコスト](transaction-cost.html)は消却されましたが、それ以外には何も起こりませんでした。この原因としては、流動性の欠如、適切でない[パス](paths.html)、またはその他の状況が考えられます。多くの場合、このような失敗の場合には、同様のトランザクションをすぐに試すと同じ結果が出ることが多いです。状況が変わるのを待ってから送信すると、別の結果が得られることがあります。

- 失敗のケース（2）では、トランザクションは検証済みレジャーには含まれないため、何も起こらず、トランザクションコストも消却されませんでした。これは、XRP Ledgerの現在の負荷に対してトランザクションコストが低すぎる、`LastLedgerSequence`が早すぎる、または不安定なネットワーク接続などの状況が原因である可能性があります。
    - 失敗のケース（1）と異なり、このケースでは`LastLedgerSequence`のみを変更（または`Fee`も変更）するだけで、新しいトランザクションが成功する可能性があります。
    - また、トランザクションが成功しないのはレジャーのステータスが原因である可能性もあります。例えば、トランザクションに署名するために使用されたキーペアが送信アドレスで無効になっている場合などです。トランザクションの暫定的な結果が[`tef`-class code](tef-codes.html)の場合には、修正をしない限りそのトランザクションが成功する可能性は低くなります。


#### レジャーのギャップ

サーバーに、トランザクションが最初に送信されてから、レジャーが`LastLedgerSequence`によって識別された時点までを含む、継続したレジャー履歴がない場合には、トランザクションの最終結果を得られない可能性があります。（サーバーにないレジャーバージョンに結果が含まれている場合、成功したか失敗したかが分かりません。）

`rippled`サーバーにリソース（CPU/RAM/ディスクIO）の余裕がある場合には、不足しているレジャーバージョンを自動的に取得します。ただし、取得しようとするレジャーが[保管する履歴の設定量](https://github.com/ripple/rippled/blob/develop/cfg/rippled-example.cfg#L581)よりも古い場合には取得されません。ギャップのサイズや、サーバーのリソース使用率に基づき、不足しているレジャーバージョンの取得には数分かかります。[ledger_requestメソッド][]を使用して履歴となっているレジャーバージョンを手動で要求することもできます。

あるいは、`s2.ripple.com`にあるRippleの完全履歴サーバーなど、必要なレジャー履歴を含む別の`rippled`サーバーを使用して、トランザクションのステータスを検索することもできます。この目的には、信頼できるサーバーのみを使用してください。不正なサーバーは、トランザクションのステータスや結果について偽の情報を提供するようにプログラムされている可能性があります。


## 技術的応用

トランザクションの送信および確認のベストプラクティスを実施するには、アプリケーションで以下を実行する必要があります。

1. 署名するアカウントの次のシーケンス番号を判断します
    * 各トランザクションにはアカウント固有のシーケンス番号があります。  これにより、アカウントによって署名されたトランザクションの実行順序が保証され、再送信しても同じトランザクションがレジャーに二重に適用されることがなくなります。
3. `LastLedgerSequence`を決定します
     * トランザクションの`LastLedgerSequence`は、最後の検証済みレジャーのシーケンス番号から計算されます。
3. トランザクションを生成して署名します
    * 送信前に、署名されたトランザクションの詳細を保持します。
4. トランザクションを送信します
    * 初期の結果は暫定的なものであり、変化する可能性があります。
5. トランザクションの最終結果を判断します
    * 最終結果は、レジャー履歴における不変部分です。

アプリケーションでのこれらのアクションの実行方法は、アプリケーションが使用するAPIによって異なります。  アプリケーションでは、以下のインターフェイスを使用できます。

1. [`rippled` API](rippled-api.html)
2. [RippleAPI](rippleapi-reference.html)
3. `rippled`上にレイヤーされた、任意の数の他のソフトウェアAPI


### rippled - トランザクションの送信と確認

#### アカウントシーケンスの判断

`rippled`には、最後に検証されたレジャーでのアカウントのシーケンス番号を知るための[account_infoメソッド][]があります。

JSON-RPC要求:

```
{
  "method": "account_info",
  "params": [
    {
      "account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
      "ledger": "validated"
    }
  ]
}
```

応答の本文:

```
{
    "result": {
        "validated": true,
        "status": "success",
        "ledger_index": 10266396,
        "account_data": {
            "index": "96AB97A1BBC37F4F8A22CE28109E0D39D709689BDF412FE8EDAFB57A55E37F38",
            "Sequence": 4,
            "PreviousTxnLgrSeq": 9905632,
            "PreviousTxnID": "CAEE0E34B3DB50A7A0CA486E3A236513531DE9E52EAC47CE4C26332CC847DE26",
            "OwnerCount": 2,
            "LedgerEntryType": "AccountRoot",
            "Flags": 0,
            "Balance": "49975988",
            "Account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W"
        }
    }
}
```

この例では、最後に検証されたレジャーの時点において（要求の`"ledger": "validated"`と、応答の`"validated": "true"`を参照）、アカウントのシーケンスは**4**です（`"account_data"`の`"Sequence": 4`を参照）。

アプリケーションが、このアカウントで署名された3つのトランザクションを送信する場合には、4、5、6のシーケンス番号を使用します。  各トランザクションの検証を待たずに複数のトランザクションを送信するには、アプリケーションで継続的なアカウントシーケンス番号を使用します。


#### 最後に検証されたレジャーの判断

[server_stateメソッド][]は、最後に検証されたレジャーのレジャーインデックスを返します。

要求:

```
{
  "id": "client id 1",
  "method": "server_state"
}
```

応答:

```
{
    "result": {
        "status": "success",
        "state": {
            "validation_quorum": 3,
            "validated_ledger": {
                "seq": 10268596,
                "reserve_inc": 5000000,
                "reserve_base": 20000000,
                "hash": "0E0901DA980251B8A4CCA17AB4CA6C3168FE83FA1D3F781AFC5B9B097FD209EF",
                "close_time": 470798600,
                "base_fee": 10
            },
            "server_state": "full",
            "published_ledger": 10268596,
            "pubkey_node": "n9LGg37Ya2SS9TdJ4XEuictrJmHaicdgTKiPJYi8QRSdvQd3xMnK",
            "peers": 58,
            "load_factor": 256000,
            "load_base": 256,
            "last_close": {
                "proposers": 5,
                "converge_time": 3004
            },
            "io_latency_ms": 2,
            "fetch_pack": 10121,
            "complete_ledgers": "10256331-10256382,10256412-10268596",
            "build_version": "0.26.4-sp3-private"
        }
    }
}
```

この例では、最後に検証されたレジャーのシーケンス番号は10268596（応答の`result.state.validated_ledger`）です。  この例では、レジャー履歴にギャップがあることも示されています。  ここで使用されたサーバーは、ギャップの間（レジャー10256383から10256411）に適用されたトランザクションに関する情報を提供することはできません。  その部分のレジャー履歴を取得するよう設定されていれば、最終的にサーバーで取得できます。


#### トランザクションの生成

`rippled`には、トランザクション送信に備えて準備するための[signメソッド][]があります。  このメソッドは信頼できる<rippled/>インスタンスにのみに渡すことができるアカウントの機密情報を必要とします。信頼できる`rippled`インスタンスにのみ渡  この例では、10 FOO（架空の通貨）を別のXRP Ledgerアドレスに発行します。

要求:

```
{
    "method": "sign",
    "params": [
        {
            "offline": true,
            "secret": "sssssssssssssssssssssssssssss",
            "tx_json": {
               "Account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
                "Sequence": 4,
                "LastLedgerSequence": 10268600,
                "Fee": 10000,
                "Amount": {
                    "currency": "FOO",
                    "issuer": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
                    "value": "10"
                },
                "Destination": "rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM",
                "TransactionType": "Payment"
            }
        }
    ]
}
```

アプリケーションは、`tefPAST_SEQ`エラーを防ぐため、`account_info`への以前の呼び出しで判明した`"Sequence": 4`を使用しています。

また、アプリケーションが`server_state`から取得した最後の検証済みレジャーに基づく`LastLedgerSequence`にも注意してください。  バックエンドアプリケーションでは、 *「最後の検証済みレジャーシーケンス + 4」* を使用することをお勧めします。または、 *「現行のレジャー + 3」* の値を使用します。  `LastLedgerSequence`の計算が誤りで、最後の検証済みレジャーの番号よりも小さい場合には、そのトランザクションは`tefMAX_LEDGER`エラーで失敗します。

応答:

```
{
    "result": {
        "tx_json": {
            "hash": "395C313F6F11F70FEBAF3785529A6D6DE3F44C7AF679515A7EAE22B30146DE57",
            "TxnSignature": "304402202646962A21EC0516FCE62DC9280F79E7265778C571E9410D795E67BB72A2D8E402202FF4AF7B2E2160F5BCA93011CB548014626CAC7FCBEBDB81FE8193CEFF69C753",
            "TransactionType": "Payment",
            "SigningPubKey": "0267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC5",
            "Sequence": 4,
            "LastLedgerSequence": 10268600,
            "Flags": 2147483648,
            "Fee": "10000",
            "Destination": "rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM",
            "Amount": {
                "value": "10",
                "issuer": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
                "currency": "FOO"
            },
            "Account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W"
        },
        "tx_blob": "12000022800000002400000004201B009CAFB861D4C38D7EA4C68000000000000000000000000000464F4F0000000000AC5FA3BB28A09BD2EC1AE0EED2315060E83D796A68400000000000271073210267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC57446304402202646962A21EC0516FCE62DC9280F79E7265778C571E9410D795E67BB72A2D8E402202FF4AF7B2E2160F5BCA93011CB548014626CAC7FCBEBDB81FE8193CEFF69C7538114AC5FA3BB28A09BD2EC1AE0EED2315060E83D796A831438BC6F9F5A6F6C4E474DB0D59892E90C2C7CED5C",
        "status": "success"
    }
}
```

トランザクションを送信する前に、アプリケーションでトランザクションのハッシュを保持しておきます。  `sign`メソッドの結果の`tx_json`の下にハッシュが含まれます。



#### トランザクションの送信

`rippled`には、署名されたトランザクションの送信を可能にする、[submitメソッド][]があります。  これは、`sign`メソッドで返された`tx_blob`パラメーターを使用します。

要求:

```
{
    "method": "submit",
    "params": [
        {
        "tx_blob": "12000022800000002400000004201B009CAFB861D4C38D7EA4C68000000000000000000000000000464F4F0000000000AC5FA3BB28A09BD2EC1AE0EED2315060E83D796A68400000000000271073210267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC57446304402202646962A21EC0516FCE62DC9280F79E7265778C571E9410D795E67BB72A2D8E402202FF4AF7B2E2160F5BCA93011CB548014626CAC7FCBEBDB81FE8193CEFF69C7538114AC5FA3BB28A09BD2EC1AE0EED2315060E83D796A831438BC6F9F5A6F6C4E474DB0D59892E90C2C7CED5C"
        }
    ]
}
```

応答:

```
{
    "result": {
        "tx_json": {
            "hash": "395C313F6F11F70FEBAF3785529A6D6DE3F44C7AF679515A7EAE22B30146DE57",
            "TxnSignature": "304402202646962A21EC0516FCE62DC9280F79E7265778C571E9410D795E67BB72A2D8E402202FF4AF7B2E2160F5BCA93011CB548014626CAC7FCBEBDB81FE8193CEFF69C753",
            "TransactionType": "Payment",
            "SigningPubKey": "0267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC5",
            "Sequence": 4,
            "LastLedgerSequence": 10268600,
            "Flags": 2147483648,
            "Fee": "10000",
            "Destination": "rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM",
            "Amount": {
                "value": "10",
                "issuer": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
                "currency": "FOO"
            },
            "Account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W"
        },
        "tx_blob": "12000022800000002400000004201B009CAFB861D4C38D7EA4C68000000000000000000000000000464F4F0000000000AC5FA3BB28A09BD2EC1AE0EED2315060E83D796A68400000000000271073210267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC57446304402202646962A21EC0516FCE62DC9280F79E7265778C571E9410D795E67BB72A2D8E402202FF4AF7B2E2160F5BCA93011CB548014626CAC7FCBEBDB81FE8193CEFF69C7538114AC5FA3BB28A09BD2EC1AE0EED2315060E83D796A831438BC6F9F5A6F6C4E474DB0D59892E90C2C7CED5C",
        "status": "success",
        "engine_result_message": "The transaction was applied.",
        "engine_result_code": 0,
        "engine_result": "tesSUCCESS"
    }
}
```

これは**初期**結果です。  最終結果は検証済みのレジャーのみにあります。  `"validated": true`フィールドがないことが、これが**不変の結果ではない**ことを示しています。


#### トランザクションの確認

トランザクションの結果を取得するために、トランザクションが署名された時に生成されるトランザクションハッシュが[txメソッド][]に渡されます。

要求:

```
{
    "method": "tx",
    "params": [
        {
            "transaction": "395C313F6F11F70FEBAF3785529A6D6DE3F44C7AF679515A7EAE22B30146DE57",
            "binary": false
        }
    ]
}
```

応答:

```
{
    "result": {
        "validated": true,
        "status": "success",
        "meta": {
            "TransactionResult": "tesSUCCESS",
            "TransactionIndex": 2,
            "AffectedNodes": [...]
        },
        "ledger_index": 10268599[d],
        "inLedger": 10268599,
        "hash": "395C313F6F11F70FEBAF3785529A6D6DE3F44C7AF679515A7EAE22B30146DE57",
        "date": 470798270,
        "TxnSignature": "304402202646962A21EC0516FCE62DC9280F79E7265778C571E9410D795E67BB72A2D8E402202FF4AF7B2E2160F5BCA93011CB548014626CAC7FCBEBDB81FE8193CEFF69C753",
        "TransactionType": "Payment",
        "SigningPubKey": "0267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC5",
        "Sequence": 4,
        "LastLedgerSequence": 10268600,
        "Flags": 2147483648,
        "Fee": "10000",
        "Destination": "rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM",
        "Amount": {
            "value": "10",
            "issuer": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
            "currency": "FOO"
        },
        "Account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W"
    }
}
```

この応答例には、`"validated": true`があります。これは、トランザクションが検証済みレジャーに含まれていること、つまりトランザクション結果が不変であることを示しています。  さらに、メタデータには、トランザクションがレジャーに適用されたことを示す`"TransactionResult": "tesSUCCESS"`が含まれています。

応答に`"validated": true`が含まれていない場合には、結果は暫定的であり変化する可能性があります。  最終結果を取得するには、アプリケーションで`tx`メソッドを再度呼び出し、ネットワークでさらに多くのレジャーインスタンスを検証できるよう十分な時間をかけます。  `LastLedgerSequence`で指定されたレジャーが検証されるまで待たなければならない場合もありますが、そのトランザクションが以前の検証済みレジャーに含まれている場合には、その結果はその時点で不変です。


#### 不明のトランザクションの確認

[txメソッド][]への呼び出しに`txnNotFound`エラーが返された場合には、アプリケーションで対処する必要があります。

```
{
    "result": {
        "status": "error",
        "request": {
            "transaction": "395C313F6F11F70FEBAF3785529A6D6DE3F44C7AF679515A7EAE22B30146DE56",
            "command": "tx",
            "binary": false
        },
        "error_message": "Transaction not found.",
        "error_code": 24,
        "error": "txnNotFound"
    }
}
```

`txnNotFound`結果コードは、トランザクションがどのレジャーにも含まれていない場合に発生します。  ただし、`rippled`インスタンスに完全なレジャー履歴がない場合や、そのトランザクションが`rippled`インスタンスにまだ伝達されていない場合にも発生します。  これにどのように対処すべきかを判断するため、アプリケーションはさらに照会を行う必要があります。

[server_stateメソッド][]（最後の検証済みレジャーを判断するために先に使用する）は、`result.state.complete_ledgers`のもとにレジャー履歴が完全かどうかを示します。

```
{
    "result": {
        "status": "success",
        "state": {
            "validation_quorum": 3,
            "validated_ledger": {
                "seq": 10269447,
                "reserve_inc": 5000000,
                "reserve_base": 20000000,
                "hash": "D05C7ECC66DD6F4FEA3A6394F209EB5D6824A76C16438F562A1749CCCE7EAFC2",
                "close_time": 470802340,
                "base_fee": 10
            },
            "server_state": "full",
            "pubkey_node": "n9LJ5eCNjeUXQpNXHCcLv9PQ8LMFYy4W8R1BdVNcpjc1oDwe6XZF",
            "peers": 84,
            "load_factor": 256000,
            "load_base": 256,
            "last_close": {
                "proposers": 5,
                "converge_time": 2002
            },
            "io_latency_ms": 1,
            "complete_ledgers": "10256331-10256382,10256412-10269447",
            "build_version": "0.26.4-sp3-private"
        }
    }
}
```

このトランザクションの例では、その時点の最後の検証済みレジャーに基づいて`LastLedgerSequence` 10268600を指定し、4を足します。  不明のトランザクションが完全に失敗したかどうかを判断するには、`rippled`サーバーに、10268597から10268600のレジャーが必要です。  サーバーの履歴にそれらの検証済みレジャーが存在し、**かつ**`tx`が`txnNotFound`が返される場合には、そのトランザクションは失敗であり、今後のレジャーに含めることはできません。  この場合、アプリケーションのロジックで、同じアカウントシーケンスと更新された`LastLedgerSequence`を使用して代わりのトランザクションを作成して送信することが可能です。

サーバーは、指定された`LastLedgerSequence`よりも小さい検証済みレジャーシーケンス番号をレポートする場合があります。  その場合、`txnNotFound`に、（a）送信されたトランザクションがまだネットワークに配布されていないこと、または（b）トランザクションがネットワークに配布されたものの、まだ処理されていないことを示します。  最初のケースに対処するために、アプリケーションは再度同じ署名済みのトランザクションを送信できます。  トランザクションには固有のアカウントシーケンス番号がつけられているため、処理されるのは一度のみです。

最後に、サーバーにトランザクション履歴のギャップが1つ以上存在する場合があります。上記の応答に示される`completed_ledgers`フィールドは、このrippledインスタンスの10256383から10256411のレジャーが不足していることを示しています。  このトランザクションの例では、（トランザクションの送信時点と`LastLedgerSequence`に基づいて）トランザクションは10268597から10268600のレジャーのみに含まれるため、このギャップはここでは関係ありません。  ただし、必要範囲のレジャーが不足している場合には、`txnNotFound`の結果が不変の結果であるかどうかを判断するために、アプリケーションは別のrippledサーバーに照会する（またはこのサーバーによって不足しているレジャーが取得されるまで待つ）必要があります。


## その他のリソース

- [トランザクションのフォーマット](transaction-formats.html)
- [トランザクションコスト](transaction-cost.html)
- [XRP Ledger コンセンサスプロセスの概要](consensus.html)
- [コンセンサスの原理とルール](consensus-principles-and-rules.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
