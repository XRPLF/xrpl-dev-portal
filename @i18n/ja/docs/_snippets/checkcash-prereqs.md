Checkを換金するための前提条件は、正確な金額を換金する場合も変動金額を換金する場合も同じです。

- 現在レジャーに記録されているCheckオブジェクトのIDが必要です。
  - 例えば、以下の例では、あるCheckのIDとして`838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334`を使用していますが、各ステップをご自分で行う際には、異なるIDを使用する必要があります。
- Checkに記載されている受取人の**アドレス**と**秘密鍵**。このアドレスは、Checkオブジェクトの`Destination`アドレスと一致している必要があります。
- 発行済み通貨用のCheckの場合は、ご自身（受取人）にイシュアーに対するトラストラインがある必要があります。このトラストライン上のご自身の限度額は、受け取る金額を追加するための残高より十分高くなければなりません。
  - トラストラインと限度額について詳しくは、[トークン](../concepts/tokens/index.md)および[トラストラインと発行](../concepts/tokens/fungible-tokens/index.md)をご覧ください。
- [トランザクションに安全に署名できる手段](../concepts/transactions/secure-signing.md)。
- XRP Ledgerに接続できる[クライアントライブラリ](../references/client-libraries.md)か、それとも[HTTPライブラリ、WebSocketライブラリなど](../tutorials/http-websocket-apis/build-apps/get-started.md)。
