# tx_history
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/TxHistory.cpp "Source")

`tx_history`メソッドは、直近に作成されたトランザクションの一部を取得します。

**注意:** このメソッドは廃止予定であり、今後予告なしに削除される可能性があります。

## 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "id": 5,
 "command": "tx_history",
 "start": 0
}
```

*JSON-RPC*

```
{
   "method": "tx_history",
   "params": [
       {
           "start": 0
       }
   ]
}
```

*コマンドライン*

```
#Syntax: tx_history [start]
rippled tx_history 0
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](websocket-api-tool.html#tx_history)

要求には以下のパラメーターが含まれます。

| `Field` | 型             | 説明                          |
|:--------|:-----------------|:-------------------------------------|
| `start` | 符号なし整数 | スキップするトランザクションの数。 |

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "id": 2,
 "status": "success",
 "type": "response",
 "result": {
   "index": 0,
   "txs": [
     {
       "Account": "r9bf8V4ae5xReYnKPXgnwERDFPoW34FhGy",
       "Fee": "12",
       "Flags": 2147483648,
       "LastLedgerSequence": 6907169,
       "Sequence": 3276,
       "SigningPubKey": "03B7857216DF96BABCC839686670A67602B3EE50D0F12B41C15F73760B8ED394C1",
       "TransactionType": "AccountSet",
       "TxnSignature": "3045022100CC0A2688DC36DC47BDBD5A571407316DD16A6CB3289E60C9589531707D30EBDB022010A2ED1F8562FEF61461B89E90E9D7245F5DD1AAE6680401A60F7FDA60184312",
       "hash": "30FF69D2F2C2FF517A82EC8BA62AA4879E27A6EAF2C9B4AA422B77C23CD11B35",
       "inLedger": 6907162,
       "ledger_index": 6907162
     },
     {
       "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
       "Fee": "15",
       "Flags": 0,
       "Sequence": 1479735,
       "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
       "TakerGets": "9999999999",
       "TakerPays": {
         "currency": "USD",
         "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
         "value": "48.050907917"
       },
       "TransactionType": "OfferCreate",
       "TxnSignature": "3045022100C110F47609CED085E0C184396877685ACAFF0A5846C859E9A57A8E238788FAE2022042A578D36F3D911E2536A39D74B10A741EF4C77B40738DB66E9E4FA85B797DF2",
       "hash": "A5DE72E2E97CB0FA548713FB7C8542FD1A9723EC556D386F13B25F052435B29F",
       "inLedger": 6907162,
       "ledger_index": 6907162
     },
     {
       "Account": "r9bf8V4ae5xReYnKPXgnwERDFPoW34FhGy",
       "Fee": "12",
       "Flags": 2147483648,
       "LastLedgerSequence": 6907169,
       "Sequence": 3275,
       "SigningPubKey": "03B7857216DF96BABCC839686670A67602B3EE50D0F12B41C15F73760B8ED394C1",
       "TransactionType": "AccountSet",
       "TxnSignature": "3044022030E4CCDCBA8D9984C16AD9807D0FE654D4C558C08728B33A6D9F4D05DA811CF102202A6B53015583A6C24054EE93D9B9DDF0D17133676848304BBA5156DD2C2875BE",
       "hash": "55DFC8F7EF3976B5968DC462D91B29274E8097C35D43D6B3740AB20584336A9C",
       "inLedger": 6907162,
       "ledger_index": 6907162
     },
     {
       "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
       "Fee": "15",
       "Flags": 131072,
       "Sequence": 1479734,
       "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
       "TakerGets": {
         "currency": "BTC",
         "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
         "value": "0.009194668"
       },
       "TakerPays": "1073380944",
       "TransactionType": "OfferCreate",
       "TxnSignature": "304402202C0D26EABE058FCE8B6862EF5CAB70674637CE32B1B4E2F3551B9D5A2E1CDC7E02202C191D2697C65478BC2C1489721EB5799A6F3D4A1ECD8FE87A0C4FDCA3704A03",
       "hash": "2499BAE9947BE731D7FE2F8E7B6A55E1E5B43BA8D3A9F22E39F79A0CC027A1C8",
       "inLedger": 6907161,
       "ledger_index": 6907161
     },
     {
       "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
       "Fee": "15",
       "Flags": 131072,
       "Sequence": 1479733,
       "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
       "TakerGets": {
         "currency": "USD",
         "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
         "value": "5.298037873"
       },
       "TakerPays": {
         "currency": "BTC",
         "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
         "value": "0.008937558999999999"
       },
       "TransactionType": "OfferCreate",
       "TxnSignature": "3044022075EF6054ABD08F9B8287314AD4904944A74A6C3BBED9D035BCE7D409FC46E49E022025CFEE7F72BEC1F87EA83E3565CB653643A57CDD13661798D6B70F47AF63FDB6",
       "hash": "F873CB065791DDD503580931A500BB896B9DBAFC9C285C1159B884354F3EF48B",
       "inLedger": 6907161,
       "ledger_index": 6907161
     },
     {
       "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
       "Fee": "15",
       "Flags": 0,
       "OfferSequence": 1479726,
       "Sequence": 1479732,
       "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
       "TransactionType": "OfferCancel",
       "TxnSignature": "3045022100E82B813DA3896051EAAA3D53E197F8F426DF4E51F07A2AB83E43B10CD4008D8402204D93BABA74E63E775D44D77F4F9B07D69B0C86930F2865BBBBD2DC956FA8AE4E",
       "hash": "203613CFA3CB7BFBCFABBBCF80D932DFBBFDECCBB869CCDBE756EAA4C8EEA41D",
       "inLedger": 6907161,
       "ledger_index": 6907161
     },
     {
       "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
       "Fee": "15",
       "Flags": 0,
       "OfferSequence": 1479725,
       "Sequence": 1479731,
       "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
       "TransactionType": "OfferCancel",
       "TxnSignature": "30440220678FF2E754A879EAE72207F191614BBA01B8088CD174AF509E9AA11448798CD502205B326E187A0530E4E90BDD1ED875492836657E4D593FBD655F64604178693D2F",
       "hash": "1CF4D0D583F6FC85BFD15A0BEF5E4779A8ACAD0DE43823F07C9CC2A20E29E422",
       "inLedger": 6907161,
       "ledger_index": 6907161
     },
     {
       "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
       "Fee": "15",
       "Flags": 0,
       "OfferSequence": 1479724,
       "Sequence": 1479730,
       "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
       "TransactionType": "OfferCancel",
       "TxnSignature": "3045022100A5533E81A67B6A88B674864E898FDF31D83787FECE496544EBEE88E6FC220500022002438599B2A0E4F70C2B46FB049CD339F76E466399CA4A8F72C4ADA03F615D90",
       "hash": "D96EC06F2ADF3CF7ED59BD76B8F1BDB127CDE46B45977B477703DB05B8DF5208",
       "inLedger": 6907161,
       "ledger_index": 6907161
     },
     {
       "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
       "Fee": "15",
       "Flags": 0,
       "OfferSequence": 1479723,
       "Sequence": 1479729,
       "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
       "TransactionType": "OfferCancel",
       "TxnSignature": "304402206DEF8C70103AE45BCED6762B238E6F155A57D46300E8FF0A1CD0197362483CAE022007BBDFD93A0BC2473EE4537B44095D1BB5EB83F76661A14230FB3B27C4EABB6D",
       "hash": "089D22F601FB52D0E55A8E27D393F05570DC24E92028BB9D9DCAD7BC3337ADF9",
       "inLedger": 6907161,
       "ledger_index": 6907161
     },
     {
       "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
       "Fee": "15",
       "Flags": 0,
       "OfferSequence": 1479722,
       "Sequence": 1479728,
       "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
       "TransactionType": "OfferCancel",
       "TxnSignature": "3044022065051B7240DE1D46865453B3D7F8FC59FB2B9FD609196AB394F857B75E2B8409022044683F3A35740FC97655A8A4516184D8C582E5D88CA360301B1AD308F4126763",
       "hash": "F6A660EF99E32D02B9AF761B14993CA1ED8BAF3507F580D90A7759ABFAF0284E",
       "inLedger": 6907161,
       "ledger_index": 6907161
     },
     {
       "Account": "rUBLCjWdsPPMkppdFXVJWhHnr3FNqCzgG3",
       "Fee": "15",
       "Flags": 0,
       "LastLedgerSequence": 6907168,
       "Sequence": 173286,
       "SigningPubKey": "03D606359EEA9C0A49CA9EF55F6AED6C8AEDDE604223C1BE51A2D0460A725CF173",
       "TakerGets": {
         "currency": "BTC",
         "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
         "value": "0.44942631"
       },
       "TakerPays": {
         "currency": "USD",
         "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
         "value": "260"
       },
       "TransactionType": "OfferCreate",
       "TxnSignature": "304502205395AF4127AD0B890AC9C47F765B4F4046C70C3DFC6F8DCD2729552FAA97F13C022100C8C2DBA6A466D76D0F103AC88DB166D1EC7F6339238E2C4245C2C26308B38058",
       "hash": "F20F06F36B5FEFF43DD1E8AEDBE9A0ECEF0CE41402AE6F0FE4BEE1F2F82A4D54",
       "inLedger": 6907161,
       "ledger_index": 6907161
     },
     {
       "Account": "rDVynssGDojUPpM4abx9rxYeHG4HiLGxC",
       "Fee": "15",
       "Flags": 2147483648,
       "LastLedgerSequence": 6907169,
       "OfferSequence": 859,
       "Sequence": 860,
       "SigningPubKey": "02C37DA8D793142BD190CE13BB697521A89D1DC318A045816EE657F42527EBFC4E",
       "TakerGets": "19871628459",
       "TakerPays": {
         "currency": "BTC",
         "issuer": "rfYv1TXnwgDDK4WQNbFALykYuEBnrR4pDX",
         "value": "0.166766470665369"
       },
       "TransactionType": "OfferCreate",
       "TxnSignature": "3044022074737D253A0DB39DBB6C63E5BD522C1313CC57658B0A567E1F1DD3414DA3817502201F333D81F29845C53A0271D0C5B005DEE4A250529DAD1A880838E242D358EE35",
       "hash": "AD197326AEF75AA466F32FEA87358C9FB587F1C1ABF41C73E2C3EFDD83B6F33B",
       "inLedger": 6907161,
       "ledger_index": 6907161
     },
     {
       "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
       "Fee": "15",
       "Flags": 0,
       "OfferSequence": 1479721,
       "Sequence": 1479727,
       "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
       "TransactionType": "OfferCancel",
       "TxnSignature": "3045022100CCD7336F78291E1BCAA4F86695119175E0DBC26281B2F13B30A24C726419DFCA022062547E0A4894CEAE87C42CABA94E0731134560F07D8860AE62F4A87AFD16BC43",
       "hash": "20353EA4152C32E63941DE2F3175BA69657BA9FAB39D22BCE38B6CA1B3734D4B",
       "inLedger": 6907161,
       "ledger_index": 6907161
     },
     {
       "Account": "r9bf8V4ae5xReYnKPXgnwERDFPoW34FhGy",
       "Fee": "12",
       "Flags": 2147483648,
       "LastLedgerSequence": 6907168,
       "Sequence": 3274,
       "SigningPubKey": "03B7857216DF96BABCC839686670A67602B3EE50D0F12B41C15F73760B8ED394C1",
       "TransactionType": "AccountSet",
       "TxnSignature": "3045022100F8412BBB1DB830F314F7400E99570A9F92668ACCDEA6096144A47EDF98E18D5D02204AD89122224F353155EACC30F80BA214350968F744A480B4CD5A3174B473D6AF",
       "hash": "16F266ABCC617CF906A25AA83BDDAD2577125E6A692A36543934AA0F0C3B77C0",
       "inLedger": 6907161,
       "ledger_index": 6907161
     },
     {
       "Account": "r9bf8V4ae5xReYnKPXgnwERDFPoW34FhGy",
       "Fee": "12",
       "Flags": 2147483648,
       "LastLedgerSequence": 6907167,
       "Sequence": 3273,
       "SigningPubKey": "03B7857216DF96BABCC839686670A67602B3EE50D0F12B41C15F73760B8ED394C1",
       "TakerGets": "5397",
       "TakerPays": {
         "currency": "USD",
         "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
         "value": "0.00002593363079073453"
       },
       "TransactionType": "OfferCreate",
       "TxnSignature": "3044022061685E23375A299747DE45DA302966C6AF8C07D2DA9BEBB4F5572E3B02C6564D02207187E626EC817EFAFFAD002E75FC16E17A5BD54DA41D4E339F3C2A9F86FFD523",
       "hash": "C9112B7C246FC8A9B377BD762F1D64F0DCA1128D55254A442E5735935A09D83E",
       "inLedger": 6907160,
       "ledger_index": 6907160
     },
     {
       "Account": "rBHMbioz9znTCqgjZ6Nx43uWY43kToEPa9",
       "Amount": {
         "currency": "USD",
         "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
         "value": "4"
       },
       "Destination": "r4X3WWZ3UZMDw3Z7T32FXK2NAaiitSWZ9c",
       "Fee": "12",
       "Flags": 0,
       "LastLedgerSequence": 6907168,
       "Paths": [
         [
           {
             "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
             "type": 1,
             "type_hex": "0000000000000001"
           },
           {
             "currency": "XRP",
             "type": 16,
             "type_hex": "0000000000000010"
           },
           {
             "currency": "USD",
             "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
             "type": 48,
             "type_hex": "0000000000000030"
           },
           {
             "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
             "type": 1,
             "type_hex": "0000000000000001"
           }
         ],
         [
           {
             "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
             "type": 1,
             "type_hex": "0000000000000001"
           },
           {
             "currency": "USD",
             "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
             "type": 48,
             "type_hex": "0000000000000030"
           },
           {
             "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
             "type": 1,
             "type_hex": "0000000000000001"
           }
         ],
         [
           {
             "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
             "type": 1,
             "type_hex": "0000000000000001"
           },
           {
             "currency": "XRP",
             "type": 16,
             "type_hex": "0000000000000010"
           },
           {
             "currency": "USD",
             "issuer": "rwmUaXsWtXU4Z843xSYwgt1is97bgY8yj6",
             "type": 48,
             "type_hex": "0000000000000030"
           },
           {
             "account": "rwmUaXsWtXU4Z843xSYwgt1is97bgY8yj6",
             "type": 1,
             "type_hex": "0000000000000001"
           },
           {
             "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
             "type": 1,
             "type_hex": "0000000000000001"
           }
         ],
         [
           {
             "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
             "type": 1,
             "type_hex": "0000000000000001"
           },
           {
             "currency": "XRP",
             "type": 16,
             "type_hex": "0000000000000010"
           },
           {
             "currency": "USD",
             "issuer": "rfsEoNBUBbvkf4jPcFe2u9CyaQagLVHGfP",
             "type": 48,
             "type_hex": "0000000000000030"
           },
           {
             "account": "rfsEoNBUBbvkf4jPcFe2u9CyaQagLVHGfP",
             "type": 1,
             "type_hex": "0000000000000001"
           },
           {
             "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
             "type": 1,
             "type_hex": "0000000000000001"
           }
         ]
       ],
       "SendMax": {
         "currency": "USD",
         "issuer": "rBHMbioz9znTCqgjZ6Nx43uWY43kToEPa9",
         "value": "4.132649022"
       },
       "Sequence": 4660,
       "SigningPubKey": "03DFEFC9A95AEF55232A2B89867745CE45373F5CE23C34D51D21343CEA92BD61AD",
       "TransactionType": "Payment",
       "TxnSignature": "30450220636E405B96C998BF5EBB665D519FA8B4431A6CB5962F754EEDD48EBE95F8C45F02210097851E297FEDA44F7DFED844AE109CF2D968BD58CD3C0E951B435278A91002FA",
       "hash": "5007E8ECAE64482D258E915FFDEFAF2FE35ED9520BA7BB424BE280691F997435",
       "inLedger": 6907160,
       "ledger_index": 6907160
     },
     {
       "Account": "rfESTMcbvbvCBqU1FTvGWiJP8cmUSu4GKg",
       "Amount": {
         "currency": "BTC",
         "issuer": "rTJdjjQ5wWAMh8TL1ToXXD2mZzesa6DSX",
         "value": "0.0998"
       },
       "Destination": "r3AWbdp2jQLXLywJypdoNwVSvr81xs3uhn",
       "Fee": "10",
       "Flags": 2147483648,
       "InvoiceID": "A98FD36C17BE2B8511AD36DC335478E7E89F06262949F36EB88E2D683BBCC50A",
       "SendMax": {
         "currency": "BTC",
         "issuer": "rTJdjjQ5wWAMh8TL1ToXXD2mZzesa6DSX",
         "value": "0.100798"
       },
       "Sequence": 18697,
       "SigningPubKey": "025D9E40A50D78347EB8AFF7A36222BBE173CB9D06E68D109D189FF8616FC21107",
       "TransactionType": "Payment",
       "TxnSignature": "3044022007AA39E0117963ABF03BAEF0C5AB45862093525344362D34B9F6BA8373A0C9DC02206AB4FE915F4CBDA84E668F7F21A9914DC95C83A72FB3F9A114B10D4ECB697A25",
       "hash": "C738A5095DCE3A256C843AA48BB26F0339EAD3FF09B6D75C2EF50C4AD4B4D17C",
       "inLedger": 6907159,
       "ledger_index": 6907159
     },
     {
       "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
       "Fee": "15",
       "Flags": 0,
       "Sequence": 1479726,
       "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
       "TakerGets": "37284087",
       "TakerPays": {
         "currency": "NZD",
         "issuer": "rsP3mgGb2tcYUrxiLFiHJiQXhsziegtwBc",
         "value": "0.291570426"
       },
       "TransactionType": "OfferCreate",
       "TxnSignature": "3045022100F246F043C97C0DA7947793E9390DBA5AB0C6EB4A0165DADF0E96C939B70D113C0220797F572368EF68490813663C0E2ACF03424CB73B64F3D6C8508C7E8F6D2CC767",
       "hash": "CAE39A38C222DF0BBC9AA25D30320220DC216646CE0A447F330BE279B20BD008",
       "inLedger": 6907159,
       "ledger_index": 6907159
     },
     {
       "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
       "Fee": "15",
       "Flags": 0,
       "Sequence": 1479725,
       "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
       "TakerGets": "10000000000",
       "TakerPays": {
         "currency": "BTC",
         "issuer": "ra9eZxMbJrUcgV8ui7aPc161FgrqWScQxV",
         "value": "0.091183099"
       },
       "TransactionType": "OfferCreate",
       "TxnSignature": "30440220376E6D149435B87CA761ED1A9BD205BA93C0C30D6EB1FB26D8B5D06A55977F510220213E882DD43BC78C96B51E43273D9BD451F8337DDF6960CBFB9802A347FF18E4",
       "hash": "CC07A503ED60F14AF023AB839C726B73591DE5C986D1234671E2518D8F840E12",
       "inLedger": 6907159,
       "ledger_index": 6907159
     },
     {
       "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
       "Fee": "15",
       "Flags": 0,
       "Sequence": 1479724,
       "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
       "TakerGets": "9094329166",
       "TakerPays": {
         "currency": "XAG",
         "issuer": "r9Dr5xwkeLegBeXq6ujinjSBLQzQ1zQGjH",
         "value": "3.022830117"
       },
       "TransactionType": "OfferCreate",
       "TxnSignature": "3045022100CFD63762B3809B37B6A1294C4B4C8DA39023D66893045BA4AA9767DD8570A8F9022005F42B08E94190637158E80DAE99F3FB104EC2AA30F69BBA3417E5BBCDB5DB77",
       "hash": "64029D736C34D21CDB100D976A06A988E2CA6E3BBC0DDFCE840D9619B853B47C",
       "inLedger": 6907159,
       "ledger_index": 6907159
     }
   ]
 }
}
```

*JSON-RPC*

```
200 OK
{
   "result": {
       "index": 0,
       "status": "success",
       "txs": [
           {
               "Account": "rPJnufUfjS22swpE7mWRkn2VRNGnHxUSYc",
               "Fee": "10",
               "Flags": 2147483648,
               "Sequence": 567546,
               "SigningPubKey": "0317766BFFC0AAF5DB4AFDE23236624304AC4BC903AA8B172AE468F6B512616D6A",
               "TakerGets": {
                   "currency": "BTC",
                   "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                   "value": "1.12582"
               },
               "TakerPays": {
                   "currency": "ILS",
                   "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                   "value": "1981.893528"
               },
               "TransactionType": "OfferCreate",
               "TxnSignature": "3045022100C66F3EE8F955724D750D148E3BB9DCAC16A002F9E4FC612C03AFBE9D8C13888902202607508AD0546C496093C9743B13FD596A1F5BE2B778EFE85BDB99F0E5B1D55F",
               "hash": "A95C701F6120061BC40323AE846BBDA51576E67EC38105030BE75C1D32231B61",
               "inLedger": 8696235,
               "ledger_index": 8696235
           },
           {
               "Account": "rwpxNWdpKu2QVgrh5LQXEygYLshhgnRL1Y",
               "Fee": "10",
               "Flags": 2147483648,
               "Sequence": 1865518,
               "SigningPubKey": "02BD6F0CFD0182F2F408512286A0D935C58FF41169DAC7E721D159D711695DFF85",
               "TakerGets": {
                   "currency": "LTC",
                   "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                   "value": "1.12095"
               },
               "TakerPays": {
                   "currency": "ILS",
                   "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                   "value": "20.77526133899999"
               },
               "TransactionType": "OfferCreate",
               "TxnSignature": "304402203F7435A2587A71878B09129A1F4C05066CE6E6463A4A10CD5C40C15FCBD9E42502207E0CB8421FEA4CE8FC052E5A63ACD2444ADAE253B174A153A1DBE901E21B3695",
               "hash": "A8C79DF180167E4D1281247325E2869984F54CBFA68631C1AF13DA346E6B3370",
               "inLedger": 8696235,
               "ledger_index": 8696235
           },
           {
               "Account": "rMWUykAmNQDaM9poSes8VLDZDDKEbmo7MX",
               "Fee": "10",
               "Flags": 2147483648,
               "Sequence": 1886203,
               "SigningPubKey": "0256C64F0378DCCCB4E0224B36F7ED1E5586455FF105F760245ADB35A8B03A25FD",
               "TakerGets": {
                   "currency": "LTC",
                   "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                   "value": "24.154"
               },
               "TakerPays": {
                   "currency": "BTC",
                   "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                   "value": "0.26907556"
               },
               "TransactionType": "OfferCreate",
               "TxnSignature": "30440220102CF96A86AF56BA11698C70D60F22436D763634FEA179D2FF45EB329CFF1CF8022029BF9301B11D09B38EBD4E8EB445ECC53B98C4F0CA7E19BE895272085ED6DBA2",
               "hash": "9EE340379612529F308CA1E4619EC0C8842C1D4308FCA136E25316CE28C28189",
               "inLedger": 8696235,
               "ledger_index": 8696235
           },
           {
               "Account": "rJJksugQDMVu12NrZyw3C55fEUmPtRYVRC",
               "Fee": "10",
               "Flags": 2147483648,
               "Sequence": 119205,
               "SigningPubKey": "03B918730C9FA2451284A00B1EFD08E9BEFD735D84CE09C6B3D7CB8FB0D1F9A84F",
               "TakerGets": "10136500000",
               "TakerPays": {
                   "currency": "USD",
                   "issuer": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
                   "value": "50"
               },
               "TransactionType": "OfferCreate",
               "TxnSignature": "3044022044DB48A760AA7FBA2B1840E1357EF6B1EA9CC9DBBFFB5415C6BE301597B66766022021AA86070416330312E3AFC938376AD0A67A28195D7CD92EC8B03A6039D5C86C",
               "hash": "8149067582081FA1499A53841642345D21FE0750E29C61C6DC3C914E0D1819AB",
               "inLedger": 8696235,
               "ledger_index": 8696235
           },
           {
               "Account": "rLPrL6KUtVZZbDfJMjDXzTKkwH39Udfw6e",
               "Fee": "10",
               "Flags": 2147483648,
               "Sequence": 428775,
               "SigningPubKey": "03B2B67209DBDE2FA68555FB10BD791C4732C685349979FDC47D0DEF2B27EFA364",
               "TakerGets": {
                   "currency": "PPC",
                   "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                   "value": "8.0635"
               },
               "TakerPays": {
                   "currency": "BTC",
                   "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                   "value": "0.01355474349999999"
               },
               "TransactionType": "OfferCreate",
               "TxnSignature": "3045022100EDDC17FE2C32DEAD8ED5D9540B2ECE25D6CD1C65414211D2E4F98FC5BDABB99E0220389D6B3DE8BA50D27406BCE28E67D1E270C6A3A854CDEF25F042BBA52CDB53F8",
               "hash": "70B7DB8E2BD65E554CBF418D591E050A6FD0A387E9500ED0B79BEB775019D9CA",
               "inLedger": 8696235,
               "ledger_index": 8696235
           },
           {
               "Account": "rM7WN56kktEkE5qKwNkQ1af4BZ56bynVUf",
               "Fee": "10",
               "Flags": 2147483648,
               "Sequence": 435008,
               "SigningPubKey": "0256AE48790FEF5F61C1AB3765287EABCBE6B47C5098271F596A576DF7CFA15720",
               "TakerGets": {
                   "currency": "PPC",
                   "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                   "value": "0.365"
               },
               "TakerPays": {
                   "currency": "ILS",
                   "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                   "value": "0.9977421"
               },
               "TransactionType": "OfferCreate",
               "TxnSignature": "3044022057ECAE71B36746AA1574936B03016DC5747EB7DBBA7D85533063E8D35DD2BAF402204F37BCA51CB0D943758BCA89641C2655FB76F20B8AD1883A3ABF232D1E964E80",
               "hash": "572B0B2E96F4A9A88C7EDBDEB6D90AD2975528478186D9179AEC0E366D2778FC",
               "inLedger": 8696235,
               "ledger_index": 8696235
           },
           {
               "Account": "rLjhDX8zT6vy8T7hjUDvK48wTy5SYFpfwZ",
               "Fee": "10",
               "Flags": 2147483648,
               "OfferSequence": 432536,
               "Sequence": 432561,
               "SigningPubKey": "03892D08CE3CE600369BA83A92C3C7785FEA162739643358F1F35F8BE672AFD4A3",
               "TransactionType": "OfferCancel",
               "TxnSignature": "3045022100C25CE3756EB273F6ADD219E951DB7585ADFAF28090BEA3510458785D2EB91866022057A480F167F6D7263CDBFB0E13D571041313F6476176FFE2645CE867BA85DC2D",
               "hash": "521D7F2CF76DEAC8ED695AC5570DFF1E445EB8C599158A351BD46F1D34528373",
               "inLedger": 8696235,
               "ledger_index": 8696235
           },
           {
               "Account": "rn694SpeUFw3VJwapyRKx6bpru3ZpDHzji",
               "Fee": "10",
               "Flags": 2147483648,
               "Sequence": 396235,
               "SigningPubKey": "03896496732D098F2D8EE22D65ED9A88C0FF116785AE448EA1F521534C7C5BC6E3",
               "TakerGets": {
                   "currency": "ILS",
                   "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                   "value": "0.700491"
               },
               "TakerPays": {
                   "currency": "NMC",
                   "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                   "value": "0.22"
               },
               "TransactionType": "OfferCreate",
               "TxnSignature": "30440220218B5B90AB26EAE9FC9833E580653B20A15CEE86E8F1166F626FCDF4EFD4146902207FD99E35EE67E45142776CCD8F910A9E6E1A3C498737B59F182C73183C63D51F",
               "hash": "454479D7EEE4081CF25378571D74858C01B0B43D3A2530781647BD40CD0465E5",
               "inLedger": 8696235,
               "ledger_index": 8696235
           },
           {
               "Account": "rRh634Y6QtoqkwTTrGzX66UYoCAvgE6jL",
               "Fee": "10",
               "Flags": 2147483648,
               "Sequence": 676061,
               "SigningPubKey": "030BB49C591C9CD65C945D4B78332F27633D7771E6CF4D4B942D26BA40748BB8B4",
               "TakerGets": {
                   "currency": "BTC",
                   "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                   "value": "0.09675"
               },
               "TakerPays": "10527647107",
               "TransactionType": "OfferCreate",
               "TxnSignature": "3044022014196BC5867AC2689F7EF31F23E4B2D1D1B7755465AC388B20F8E7721333EEE302201575263F381755E47AFCD37C1D5CCA4C012D624E7947140B40ABF1975959AA78",
               "hash": "22B2F477ADE9C22599EB5CEF70B3377C0478D708D74A47866D9E59B7A2CF57CF",
               "inLedger": 8696235,
               "ledger_index": 8696235
           },
           {
               "Account": "rJJksugQDMVu12NrZyw3C55fEUmPtRYVRC",
               "Fee": "10",
               "Flags": 2147483648,
               "OfferSequence": 119183,
               "Sequence": 119204,
               "SigningPubKey": "03B918730C9FA2451284A00B1EFD08E9BEFD735D84CE09C6B3D7CB8FB0D1F9A84F",
               "TransactionType": "OfferCancel",
               "TxnSignature": "30440220481760ED4F771F960F37FDF32DDEC70D10F9D5F9868571A58D6F5C09D75B71DE022049B35BEA448686D0929271E64EADA684D7684A9195D22826288AD9D9526B4FE9",
               "hash": "5E0E42BDDC7A929875F5E9214AB00C3673CC047833C0EFC093532F2EE1F790C2",
               "inLedger": 8696234,
               "ledger_index": 8696234
           },
           {
               "Account": "rM7WN56kktEkE5qKwNkQ1af4BZ56bynVUf",
               "Fee": "10",
               "Flags": 2147483648,
               "OfferSequence": 434977,
               "Sequence": 435007,
               "SigningPubKey": "0256AE48790FEF5F61C1AB3765287EABCBE6B47C5098271F596A576DF7CFA15720",
               "TransactionType": "OfferCancel",
               "TxnSignature": "304402204B04325A39F3D394A7EBC91CE3A1232E538EFFC80014473C97E84310886A19B302205B2D18C544086BB99E49A1037B65ADDF4864DA60545E33E4116A41599EEE63E3",
               "hash": "E8E55606C757219A740AFA0700506FE99781797E2F54A5144EF43582C65BF0F2",
               "inLedger": 8696234,
               "ledger_index": 8696234
           },
           {
               "Account": "rLPrL6KUtVZZbDfJMjDXzTKkwH39Udfw6e",
               "Fee": "10",
               "Flags": 2147483648,
               "OfferSequence": 428744,
               "Sequence": 428774,
               "SigningPubKey": "03B2B67209DBDE2FA68555FB10BD791C4732C685349979FDC47D0DEF2B27EFA364",
               "TransactionType": "OfferCancel",
               "TxnSignature": "304402202BCB4FCE73C3417AD3E67D795077DE025E766A9136CA20D5B07DA28EA717643E0220579CA32A7BB225DA01999637B316BF7D3902059F9A8DDB2D721F8A62685E5BB7",
               "hash": "E86788EC72CA9CFBBAE4C399744C6B7495E3F6443FE87D7A4118F16FA4A316DB",
               "inLedger": 8696234,
               "ledger_index": 8696234
           },
           {
               "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
               "Fee": "64",
               "Flags": 0,
               "Sequence": 4216371,
               "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
               "TakerGets": "12566721624",
               "TakerPays": {
                   "currency": "USD",
                   "issuer": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
                   "value": "74.999999999"
               },
               "TransactionType": "OfferCreate",
               "TxnSignature": "3045022100D0FA06A78D3333D35C798B45590CD47BD844164ED25FCA4149F5F0CF24BE9A380220243EB636C656D1FBA6888CE8E2873CDA40FE6DE5987BE2FF1C418610D8BDC300",
               "hash": "DD4CAD3EBCF67CE9B184A917FF2C78A80F0FE40A01187840E0EBC6B479DBFE1A",
               "inLedger": 8696234,
               "ledger_index": 8696234
           },
           {
               "Account": "rJJksugQDMVu12NrZyw3C55fEUmPtRYVRC",
               "Fee": "10",
               "Flags": 2147483648,
               "OfferSequence": 119182,
               "Sequence": 119203,
               "SigningPubKey": "03B918730C9FA2451284A00B1EFD08E9BEFD735D84CE09C6B3D7CB8FB0D1F9A84F",
               "TransactionType": "OfferCancel",
               "TxnSignature": "304402202F13D25C82240ABBBEE0D7E8BC2351C49FD6FDD62359EA232233C5A6C989BFAA022005A521A2C5A67BAC27218A6AD9E6917689CBD2F9BB9CE884B6B0EAAEDDEC2057",
               "hash": "C9D8A2ECE636057E8255A231E6C6B6464A730155BA0E75B5111A81EA769FBC89",
               "inLedger": 8696234,
               "ledger_index": 8696234
           },
           {
               "Account": "rGJrzrNBfv6ndJmzt1hTUJVx7z8o2bg3of",
               "Fee": "15",
               "Flags": 2147483648,
               "LastLedgerSequence": 8696241,
               "OfferSequence": 1579754,
               "Sequence": 1579755,
               "SigningPubKey": "03325EB29A014DDE22289D0EA989861D481D54D54C727578AB6C2F18BC342D3829",
               "TransactionType": "OfferCancel",
               "TxnSignature": "3045022100C9F283D461F8A56575A56F8AA31F84683AB0B44D58C9EFD5DC20D448D8AC13E3022012E0A8726BE2D900C4FB7A61AB8FBFEBEBE1F12B2A9880A2BA2AB8D3EC61CB8C",
               "hash": "C4953FE328D54E9104F66253AF50AEBC26E30D5826B433465A795262DFA75B48",
               "inLedger": 8696234,
               "ledger_index": 8696234
           },
           {
               "Account": "rn694SpeUFw3VJwapyRKx6bpru3ZpDHzji",
               "Fee": "10",
               "Flags": 2147483648,
               "Sequence": 396234,
               "SigningPubKey": "03896496732D098F2D8EE22D65ED9A88C0FF116785AE448EA1F521534C7C5BC6E3",
               "TakerGets": {
                   "currency": "ILS",
                   "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                   "value": "0.3335471399999999"
               },
               "TakerPays": {
                   "currency": "NMC",
                   "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                   "value": "0.102"
               },
               "TransactionType": "OfferCreate",
               "TxnSignature": "3045022100DEA2B6D5B0D555D54A4EB7A8FADC187F44C6A9CF7282A1D5491538200DFC97DA022033A52D1EC219553C86DB829108BB5A52B49ED7EF0A566941665DE7FFF70917ED",
               "hash": "A6BE633AECE9FF9CA83D67D09E7EF67F614A9D8B952D7AFB5CB630D03C54C9FC",
               "inLedger": 8696234,
               "ledger_index": 8696234
           },
           {
               "Account": "rwpxNWdpKu2QVgrh5LQXEygYLshhgnRL1Y",
               "Fee": "10",
               "Flags": 2147483648,
               "OfferSequence": 1865490,
               "Sequence": 1865517,
               "SigningPubKey": "02BD6F0CFD0182F2F408512286A0D935C58FF41169DAC7E721D159D711695DFF85",
               "TransactionType": "OfferCancel",
               "TxnSignature": "3044022074A4E9859A5A94169B2C902F074AA964C45E2B86EABEA73E83E083E1EC7549A402203E8F4D46705AFEDFC78C2D40FAA036792E6485AF8CADF7445EA3D427E9DC2474",
               "hash": "A49285E2CA7C5765B68A41EF4A8A65AD5CC7D4EF6C7B7F6D5040B2DE429E0125",
               "inLedger": 8696234,
               "ledger_index": 8696234
           },
           {
               "Account": "rPJnufUfjS22swpE7mWRkn2VRNGnHxUSYc",
               "Fee": "10",
               "Flags": 2147483648,
               "Sequence": 567545,
               "SigningPubKey": "0317766BFFC0AAF5DB4AFDE23236624304AC4BC903AA8B172AE468F6B512616D6A",
               "TakerGets": {
                   "currency": "BTC",
                   "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                   "value": "0.66099"
               },
               "TakerPays": {
                   "currency": "ILS",
                   "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                   "value": "1157.5521276"
               },
               "TransactionType": "OfferCreate",
               "TxnSignature": "3045022100CABC7C1F9FB42C8498E1E9C6C5E8482F325D39B15D9DAE4BD9878D5E508B8FDD0220407B059A22BBBF4FC4AE18BEDCD2DDA80109EE7226D679A8A3BBFC108EFDD3AB",
               "hash": "A0BED2F5A85C48A2AFBA252FF91FD2D5C90A6D6B769068B18891B031812E2AC0",
               "inLedger": 8696234,
               "ledger_index": 8696234
           },
           {
               "Account": "rLLq27Wat93Gxkq5mV5GxtKkT146Su949V",
               "Fee": "10",
               "Flags": 2147483648,
               "Sequence": 722529,
               "SigningPubKey": "02A1BC1CCFACECD00ADC6EE990E2E27148E00D5386A99791F25B6A880BCEC94EC9",
               "TakerGets": "130272502088",
               "TakerPays": {
                   "currency": "BTC",
                   "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                   "value": "1.3177"
               },
               "TransactionType": "OfferCreate",
               "TxnSignature": "30440220436C4A368D534FE1E9A2596C51D1D54931432B789F249E312877FF9B38A3F4D502202A2DBF9517358C009FBEA61EE927DAF72A065A840C7B9136B10C125F25FCD175",
               "hash": "9627AEFC735A848AAE6C36D1089CB8797373DBE95B60E89F5412508CA907243A",
               "inLedger": 8696234,
               "ledger_index": 8696234
           },
           {
               "Account": "rMWUykAmNQDaM9poSes8VLDZDDKEbmo7MX",
               "Fee": "10",
               "Flags": 2147483648,
               "OfferSequence": 1886173,
               "Sequence": 1886202,
               "SigningPubKey": "0256C64F0378DCCCB4E0224B36F7ED1E5586455FF105F760245ADB35A8B03A25FD",
               "TransactionType": "OfferCancel",
               "TxnSignature": "304402202C7BD2C125A0B837CBD2E2FF568AEA1E0EE94615B22564A51C0434460C506C6F02204E39A7BD49086AA794B20F4EE28656217561909ECFBB18636CD400AB33AB0B17",
               "hash": "57277F527B8EBD68FE85906E613338D68F8F8BC4EB3D1748D9A204D7CDC3E174",
               "inLedger": 8696234,
               "ledger_index": 8696234
           }
       ]
   }
}
```

<!-- MULTICODE_BLOCK_END -->

応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field` | 型             | 説明                               |
|:--------|:-----------------|:------------------------------------------|
| `index` | 符号なし整数 | 要求に使用されている`start`の値。 |
| `txs`   | 配列            | トランザクションオブジェクトの配列。             |

各トランザクションオブジェクトに含まれているフィールドは、トランザクションのタイプに応じて多少異なります。詳細は、[トランザクションのフォーマット](transaction-formats.html)を参照してください。

## 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `noPermission` - `start`フィールドに指定されている値が10000を超えていますが、サーバーに管理者として接続していません。


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
