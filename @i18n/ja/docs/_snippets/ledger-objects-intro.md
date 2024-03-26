各[レジャー](../concepts/ledgers/index.md)の状態ツリーは**レジャーオブジェクト**のセットで構成されており、それらが総合して共有レジャーのすべての設定、残高、関係を表します。

rippledサーバが互いに通信するために使用する[ピアプロトコル](../concepts/networks-and-servers/peer-protocol.md)では、レジャーオブジェクトは生[バイナリーフォーマット](../references/protocol/binary-format.md)で表されます。rippled APIでは、レジャーオブジェクトはJSONオブジェクトとして表されます。
