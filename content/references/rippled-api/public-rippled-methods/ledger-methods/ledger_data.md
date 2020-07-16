# ledger_data
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/LedgerData.cpp "Source")

The `ledger_data` method retrieves contents of the specified ledger. You can iterate through several calls to retrieve the entire contents of a single ledger version.

## Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id": 2,
   "ledger_hash": "842B57C1CC0613299A686D3E9F310EC0422C84D3911E5056389AA7E5808A93C8",
   "command": "ledger_data",
   "limit": 5,
   "binary": true
}
```

*JSON-RPC*

```
{
    "method": "ledger_data",
    "params": [
        {
            "binary": true,
            "ledger_hash": "842B57C1CC0613299A686D3E9F310EC0422C84D3911E5056389AA7E5808A93C8",
            "limit": 5
        }
    ]
}
```

*Commandline*
```
rippled ledger_data
```

<!-- MULTICODE_BLOCK_END -->

**Note:** There is no commandline syntax for `ledger_data`. You can use the [json method][] to access this method from the commandline instead.

A request can include the following fields:

| `Field`        | Type                                       | Description    |
|:---------------|:-------------------------------------------|:---------------|
| `id`           | (Arbitrary)                                | (WebSocket only) Any identifier to separate this request from others in case the responses are delayed or out of order. |
| `ledger_hash`  | String                                     | _(Optional)_ A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index` | String or Unsigned Integer                 | _(Optional)_ The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |
| `binary`       | Boolean                                    | (Optional, defaults to False) If set to true, return ledger objects as hashed hex strings instead of JSON. |
| `limit`        | Integer                                    | (Optional, default varies) Limit the number of ledger objects to retrieve. The server is not required to honor this value. |
| `marker`       | [Marker][] | Value from a previous paginated response. Resume retrieving data where that response left off. |

The `ledger` field is deprecated and may be removed without further notice.

## Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket (binary:true)*

```
{
    "id": 2,
    "result": {
        "ledger_hash": "842B57C1CC0613299A686D3E9F310EC0422C84D3911E5056389AA7E5808A93C8",
        "ledger_index": "6885842",
        "marker": "0002A590029B53BE7857EFF9985F770EC792CE483720EB5E963C4D6A607D43DF",
        "state": [
            {
                "data": "11006122000000002400000001250062FEA42D0000000055C204A65CF2542946289A3358C67D991B5E135FABFA89F271DBA7A150C08CA0466240000000354540208114C909F42250CFE8F12A7A1A0DFBD3CBD20F32CD79",
                "index": "00001A2969BE1FC85F1D7A55282FA2E6D95C71D2E4B9C0FDD3D9994F3C00FF8F"
            },
            {
                "data": "11006F22000000002400000003250035788533000000000000000034000000000000000055555B93628BF3EC318892BB7C7CDCB6732FF53D12B6EEC4FAF60DD1AEE1C6101F501071633D7DE1B6AEB32F87F1A73258B13FC8CC32942D53A66D4F038D7EA4C6800064D4838D7EA4C68000000000000000000000000000425443000000000035DD7DF146893456296BF4061FBE68735D28F3286540000000000F42408114A4B8F5F7B644AEDC3447F9459C132EEB016A133B",
                "index": "000037C6659BB98F8D09F2F4CFEB27DE8EFEAFE54DD9E1C13AECDF5794B0C0F5"
            },
            {
                "data": "11006F2200020000240000000A250067395C33000000000000000034000000000000000055A160BC41A45B6BB118DF23D77E4FF23C723431B917F50DCB41319ECC2821F34C5010DFA3B6DDAB58C7E8E5D944E736DA4B7046C30E4F460FD9DE4C1AA535D3D0C00064D554C88B43EFA00000000000000000000000000055534400000000000A20B3C85F482532A9578DBB3950B85CA06594D165400000B59B9F780081148366FB9ACD2A0FD822E31112D2EB6F98C317C2C1",
                "index": "0000A8791F78CC9B39200E12A9BDAACCF40A72A512FA815525CFC9BA772990F7"
            },
            {
                "data": "1100612200000000240000000125003E742F2D0000000055286498B513710CFEB2D723A554C7557983D1952DF4DEE342C40DCB43067C9A21624000000306DC42008114225BAB89C4A4B94624BB069D6DB3C819F934991C",
                "index": "0000B717320558E2DE1A3B9FDB24E9A695BF05D1A44E4A4683212BB1DD0FBA23"
            },
            {
                "data": "110072220002000025000B65783700000000000000003800000000000000005587591A63051645F37B85D1FBA55EE69B1C96BFF16904F5C99F03FB93D42D03756280000000000000000000000000000000000000004254430000000000000000000000000000000000000000000000000166800000000000000000000000000000000000000042544300000000000A20B3C85F482532A9578DBB3950B85CA06594D167D4C38D7EA4C680000000000000000000000000004254430000000000C795FDF8A637BCAAEDAD1C434033506236C82A2D",
                "index": "000103996A3BAD918657F86E12A67D693E8FC8A814DA4B958A244B5F14D93E58"
            }
        ]
    },
    "status": "success",
    "type": "response"
}
```

*WebSocket (binary:false)*

```
{
    "id": 2,
    "result": {
        "ledger_hash": "842B57C1CC0613299A686D3E9F310EC0422C84D3911E5056389AA7E5808A93C8",
        "ledger_index": "6885842",
        "marker": "0002A590029B53BE7857EFF9985F770EC792CE483720EB5E963C4D6A607D43DF",
        "state": [
            {
                "Account": "rKKzk9ghA2iuy3imqMXUHJqdRPMtNDGf4c",
                "Balance": "893730848",
                "Flags": 0,
                "LedgerEntryType": "AccountRoot",
                "OwnerCount": 0,
                "PreviousTxnID": "C204A65CF2542946289A3358C67D991B5E135FABFA89F271DBA7A150C08CA046",
                "PreviousTxnLgrSeq": 6487716,
                "Sequence": 1,
                "index": "00001A2969BE1FC85F1D7A55282FA2E6D95C71D2E4B9C0FDD3D9994F3C00FF8F"
            },
            {
                "Account": "rGryPmNWFognBgMtr9k4quqPbbEcCrhNmD",
                "BookDirectory": "71633D7DE1B6AEB32F87F1A73258B13FC8CC32942D53A66D4F038D7EA4C68000",
                "BookNode": "0000000000000000",
                "Flags": 0,
                "LedgerEntryType": "Offer",
                "OwnerNode": "0000000000000000",
                "PreviousTxnID": "555B93628BF3EC318892BB7C7CDCB6732FF53D12B6EEC4FAF60DD1AEE1C6101F",
                "PreviousTxnLgrSeq": 3504261,
                "Sequence": 3,
                "TakerGets": "1000000",
                "TakerPays": {
                    "currency": "BTC",
                    "issuer": "rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK",
                    "value": "1"
                },
                "index": "000037C6659BB98F8D09F2F4CFEB27DE8EFEAFE54DD9E1C13AECDF5794B0C0F5"
            },
            {
                "Account": "rUy8tW38MW9ma7kSjRgB2GHtTkQAFRyrN8",
                "BookDirectory": "DFA3B6DDAB58C7E8E5D944E736DA4B7046C30E4F460FD9DE4C1AA535D3D0C000",
                "BookNode": "0000000000000000",
                "Flags": 131072,
                "LedgerEntryType": "Offer",
                "OwnerNode": "0000000000000000",
                "PreviousTxnID": "A160BC41A45B6BB118DF23D77E4FF23C723431B917F50DCB41319ECC2821F34C",
                "PreviousTxnLgrSeq": 6764892,
                "Sequence": 10,
                "TakerGets": "780000000000",
                "TakerPays": {
                    "currency": "USD",
                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                    "value": "5850"
                },
                "index": "0000A8791F78CC9B39200E12A9BDAACCF40A72A512FA815525CFC9BA772990F7"
            },
            {
                "Account": "rh3C81VfNDhhWPQWCU8ZGgknvdgNUvRtM9",
                "Balance": "13000000000",
                "Flags": 0,
                "LedgerEntryType": "AccountRoot",
                "OwnerCount": 0,
                "PreviousTxnID": "286498B513710CFEB2D723A554C7557983D1952DF4DEE342C40DCB43067C9A21",
                "PreviousTxnLgrSeq": 4092975,
                "Sequence": 1,
                "index": "0000B717320558E2DE1A3B9FDB24E9A695BF05D1A44E4A4683212BB1DD0FBA23"
            },
            {
                "Balance": {
                    "currency": "BTC",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                },
                "Flags": 131072,
                "HighLimit": {
                    "currency": "BTC",
                    "issuer": "rKUK9omZqVEnraCipKNFb5q4tuNTeqEDZS",
                    "value": "10"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "BTC",
                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                    "value": "0"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "87591A63051645F37B85D1FBA55EE69B1C96BFF16904F5C99F03FB93D42D0375",
                "PreviousTxnLgrSeq": 746872,
                "index": "000103996A3BAD918657F86E12A67D693E8FC8A814DA4B958A244B5F14D93E58"
            }
        ]
    },
    "status": "success",
    "type": "response"
}
```

*JSON-RPC (binary:true)*

```
200 OK
{
    "result": {
        "ledger_hash": "842B57C1CC0613299A686D3E9F310EC0422C84D3911E5056389AA7E5808A93C8",
        "ledger_index": "6885842",
        "marker": "0002A590029B53BE7857EFF9985F770EC792CE483720EB5E963C4D6A607D43DF",
        "state": [
            {
                "data": "11006122000000002400000001250062FEA42D0000000055C204A65CF2542946289A3358C67D991B5E135FABFA89F271DBA7A150C08CA0466240000000354540208114C909F42250CFE8F12A7A1A0DFBD3CBD20F32CD79",
                "index": "00001A2969BE1FC85F1D7A55282FA2E6D95C71D2E4B9C0FDD3D9994F3C00FF8F"
            },
            {
                "data": "11006F22000000002400000003250035788533000000000000000034000000000000000055555B93628BF3EC318892BB7C7CDCB6732FF53D12B6EEC4FAF60DD1AEE1C6101F501071633D7DE1B6AEB32F87F1A73258B13FC8CC32942D53A66D4F038D7EA4C6800064D4838D7EA4C68000000000000000000000000000425443000000000035DD7DF146893456296BF4061FBE68735D28F3286540000000000F42408114A4B8F5F7B644AEDC3447F9459C132EEB016A133B",
                "index": "000037C6659BB98F8D09F2F4CFEB27DE8EFEAFE54DD9E1C13AECDF5794B0C0F5"
            },
            {
                "data": "11006F2200020000240000000A250067395C33000000000000000034000000000000000055A160BC41A45B6BB118DF23D77E4FF23C723431B917F50DCB41319ECC2821F34C5010DFA3B6DDAB58C7E8E5D944E736DA4B7046C30E4F460FD9DE4C1AA535D3D0C00064D554C88B43EFA00000000000000000000000000055534400000000000A20B3C85F482532A9578DBB3950B85CA06594D165400000B59B9F780081148366FB9ACD2A0FD822E31112D2EB6F98C317C2C1",
                "index": "0000A8791F78CC9B39200E12A9BDAACCF40A72A512FA815525CFC9BA772990F7"
            },
            {
                "data": "1100612200000000240000000125003E742F2D0000000055286498B513710CFEB2D723A554C7557983D1952DF4DEE342C40DCB43067C9A21624000000306DC42008114225BAB89C4A4B94624BB069D6DB3C819F934991C",
                "index": "0000B717320558E2DE1A3B9FDB24E9A695BF05D1A44E4A4683212BB1DD0FBA23"
            },
            {
                "data": "110072220002000025000B65783700000000000000003800000000000000005587591A63051645F37B85D1FBA55EE69B1C96BFF16904F5C99F03FB93D42D03756280000000000000000000000000000000000000004254430000000000000000000000000000000000000000000000000166800000000000000000000000000000000000000042544300000000000A20B3C85F482532A9578DBB3950B85CA06594D167D4C38D7EA4C680000000000000000000000000004254430000000000C795FDF8A637BCAAEDAD1C434033506236C82A2D",
                "index": "000103996A3BAD918657F86E12A67D693E8FC8A814DA4B958A244B5F14D93E58"
            }
        ],
        "status": "success"
    }
}
```

*Commandline*
```json
{
   "result" : {
      "ledger" : {
         "closed" : false,
         "ledger_index" : "56867513",
         "parent_hash" : "1377C0CAD6B0D331CCD3815753469A84D08DDA230481EE5CEA807D30F0AF0E11",
         "seqNum" : "56867513"
      },
      "ledger_current_index" : 56867513,
      "ledger_hash" : "1377C0CAD6B0D331CCD3815753469A84D08DDA230481EE5CEA807D30F0AF0E11",
      "ledger_index" : 56867513,
      "marker" : "0004FCA7BBB8123368374A908D4B9146B42780E3F91653BB1D144795A9E8676E",
      "state" : [
         {
            "Account" : "rMj5DFATVxw91PDy3AM2wu7Uu1kgrhWypE",
            "Balance" : "107723001",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "F18F0DF4B4921A468A5F968CE6E04EA800799C67E0659B9C4588988BCE9972B4",
            "PreviousTxnLgrSeq" : 53524108,
            "Sequence" : 3,
            "index" : "000003E6AFED1AADCC39AAE0727B354C2286F1503274F345FE661748F24366CF"
         },
         {
            "Balance" : {
               "currency" : "GCB",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 2162688,
            "HighLimit" : {
               "currency" : "GCB",
               "issuer" : "rBfVgTnsdh8ckC19RM8aVGNuMZnpwrMP6n",
               "value" : "0"
            },
            "HighNode" : "0000000000000283",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "GCB",
               "issuer" : "rhRFGCy2RJTA8oxkjjtYTvofPVGqcgvXWj",
               "value" : "2000000"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "C0C37CE200B509E0A529880634F7841A9EF4CB65F03C12E6004CFAD9718D6694",
            "PreviousTxnLgrSeq" : 24695242,
            "index" : "0000041EFD027808D3F78C8352F97E324CB816318E00B977C74ECDDC7CD975B2"
         },
         {
            "Account" : "rHeyw38ezc3LSLzYAYwaBci2KssDkYGVr9",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "7540CE04B966D67DBD39F3AA832274902B79AF4782F5AC9D4DC7CD18B1D9AE0D",
            "PreviousTxnLgrSeq" : 47846971,
            "Sequence" : 2,
            "index" : "000004D417A9CE049C9A71A62B004659B5F1AAAB1BEA1EFDE4E01EB3497FD999"
         },
         {
            "Account" : "rLeNL66BfgeszBsCBKJcLmYTRThiWrNTUL",
            "Balance" : "19999988",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 1,
            "PreviousTxnID" : "E4BE6307E377590FF56BBF2F26DCBC4BA9682A4C141269352E4E2D4E53C1116E",
            "PreviousTxnLgrSeq" : 37851086,
            "Sequence" : 2,
            "index" : "00000FB78838CA2CFA82E7438B4F54794A6783327326D58C46B4EF137C059038"
         },
         {
            "Account" : "rUwXrQMa4HHBbfxQT71YJNbQXaxZPR8Uhp",
            "Balance" : "4999941286",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "B24817E7D4B9EC5CB29D2D36215F7BD6C7526020A9C1DC6C892C788E195DFCC4",
            "PreviousTxnLgrSeq" : 55172051,
            "Sequence" : 1,
            "index" : "000012F60C3F1E226D03F974AE8E77250B2BEA91C38AB4146B6055A048C7D540"
         },
         {
            "Flags" : 0,
            "IndexNext" : "00000000000019A5",
            "IndexPrevious" : "00000000000019A3",
            "Indexes" : [
               "07B06AC59BE6D6B3A4EA9B813FE3A13CF7F6FA21BB92D5F691CFE09FAD733EEB",
               "19D40E64B1AB5270A8470542459BC8171A2BC119AD308C46C383495C1595503D",
               "2358E16921A1A577B380F3E000452795D54237ED52A3B21C19ED5C8E2CACCC7B",
               "2817196B387099A9651055D277411847EC9E904FB71CB9CC5CF2931309AC7B6A",
               "39EACF818BBC1581BCE5121A0046C6A8E07EB52C051F3961465D2D612A728684",
               "5326601A89F1529F3675DC13BF0F430E005A55CD0347601532B61A6B43538839",
               "5D2F1DBFE9475D69F365D37B545644CF18CEE20E4A8276030545F40A495F3F28",
               "5E15CE61F291F1119338F4876C5A29EAE547F1AB2C8AAE6598DB2F3F6436067D",
               "829D72DCB03F7E01ED508287E1862471DAE1F438C95814705388950D35935969",
               "87C2963F5A673B1BC9FD3835F1B45A20C50E2654B81739ED33522E33D09323E4",
               "8ECBBA2E63E79F4D9FE2053EC9E497614F5522F40C54D874A16BB31E46DB01D0",
               "938224E0CB58A1DD8879C8167FA5D95D634AD6CF8223BA80923F8566D70A3382",
               "A59CC6C97348E202CE28A47C3DD0422C3CD173F6BD6B8D0EBC78407DDC1A4D30",
               "B34C5B770B6CE3507876B6F6C9C45D53B74EAC8A0705F6E252751A53F3CAF18E",
               "B74A96E754DFD2BC20B913B1586410CBB69CF53B497DFD48330CD8D44FFBA652",
               "BC704823EFD7641B44E7509F2C3EF29596A9C2D95AADA3C3759BE4F9962F3E4E",
               "CBC998EFF58214B886935FEE119DA9CD363489DED76306BE21F4B24A1D9B406E",
               "D754ED5085D5B6A6A9F7C96325DE848292DD4C79F7FFC273F6D76D7A87F7BE7E",
               "E82FC929F4AF4B2ACA74185633FA0D65E86DD65E505EEC38D1140D489772461E",
               "F167F314E3BBFBBDC480860C7266C7C3440764CDF0ACA66F4AFEBD7F92C53FB2"
            ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
            "RootIndex" : "D7AC7D74720E29A563100F2B494BADB198F8A9E9FA46F57AE07123151E0DFA7A",
            "index" : "0000139EDA03EF58CE7176F1402035B5EB6AEE49724555DDB0EBA01432B009A8"
         },
         {
            "Account" : "rKKzk9ghA2iuy3imqMXUHJqdRPMtNDGf4c",
            "Balance" : "40000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 4,
            "PreviousTxnID" : "CF650E9A4AAE1ADFDF2633AE71F1782ADA4D3B52C949FEEC2FF3DAAF8C301762",
            "PreviousTxnLgrSeq" : 42071651,
            "Sequence" : 38,
            "index" : "00001A2969BE1FC85F1D7A55282FA2E6D95C71D2E4B9C0FDD3D9994F3C00FF8F"
         },
         {
            "Account" : "rsSbmeMPVnpwWbDyY6HD9v8TYSg7kFNJga",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "4A12CCD9C8C28088A13D86A44F1C80B81387BD34520A0556509FF5404D9FA05C",
            "PreviousTxnLgrSeq" : 45123172,
            "Sequence" : 2,
            "index" : "00001CA2EE28952E26D329A26BCF7A0DFB655C571863CD7CCCB924101CA3832B"
         },
         {
            "Flags" : 0,
            "Indexes" : [ "4186664D76AFFB709791E2C23CE2B7D1843831F1B9B2D23D29B81108E46D1DED" ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rJYkq4c6QxzuNaM8ELZWH2fdzvFRnCmXg8",
            "RootIndex" : "00001FB94BFF05D391C58C5F72DB5A537F5C4AF8C91786B4A6AE874179928E87",
            "index" : "00001FB94BFF05D391C58C5F72DB5A537F5C4AF8C91786B4A6AE874179928E87"
         },
         {
            "Account" : "rfTzpaFG3VXJsz5DmDhgrWD7Z7bSFWT4UE",
            "Balance" : "20150090",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "E55C1DDDFE20148D1BE0A201E663DFBB282374000C43AE9A1745277CED7450AE",
            "PreviousTxnLgrSeq" : 53524253,
            "Sequence" : 2,
            "index" : "000023E2F2CF80DCDE1C03D848B78FAB5E2B73512ADBA3EC78C85AE291932FBC"
         },
         {
            "Account" : "rh6iGDTJpZCGf86b81wkZ3BotUaKfRxaaN",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "1E9E5BAFDD854F3713D6E06CADE2C84E6C6F7191B6B57A153A7D6CA79C4D110D",
            "PreviousTxnLgrSeq" : 35033153,
            "Sequence" : 2,
            "index" : "00002499977F7BBE9850B47AC2B560B69A809F1CED66F9DAC7C12CA8CCB40F4E"
         },
         {
            "Flags" : 0,
            "Indexes" : [
               "136C747528D439646FE88DC99D2C9E308A7C72F17D844EC38271110118215CE1",
               "55C7A61CCF63A11E20E5276D2ABE35432A42ED03D6C492CC68C93E91ECBC3EFE",
               "66FCEB2CDFF777F27E04CF86EADF4D5A665AA122F6A7EE6F0CF2718D4B7D6295",
               "6A331A832765BA269E9F3D7F211380501E5C6AA59AA0955FB177A0EA0025E60F"
            ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rGRaBuffuAaaeedpvkrRM3cmX3SCK7zpaV",
            "RootIndex" : "000025097E81A5B6FF027221FBB3B3CAFFF6FA690B78DA6EA0DF6E880CBA0A20",
            "index" : "000025097E81A5B6FF027221FBB3B3CAFFF6FA690B78DA6EA0DF6E880CBA0A20"
         },
         {
            "Balance" : {
               "currency" : "USD",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "USD",
               "issuer" : "rwdf1Yb6BpTkZyH9LwP5KagqK5c1uMYFPd",
               "value" : "1000000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "USD",
               "issuer" : "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
               "value" : "0"
            },
            "LowNode" : "0000000000000CBC",
            "PreviousTxnID" : "84AD7C491291135D4FAB7C9AA8D5760105D95A42BBDCF88DA3F66EDF750A929D",
            "PreviousTxnLgrSeq" : 34789991,
            "index" : "000027B473B2EAB084323383428D054E66249BEC4AB16515256FEF2D27CD8D23"
         },
         {
            "Account" : "rKUN4CjifHrBc7yLjgQCDRPxaKevj5VkhX",
            "Balance" : "4796311032",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "4F95433B1598042BD89F81C2CA1861E2340E2772F6A591F4D91E87BA38484B72",
            "PreviousTxnLgrSeq" : 55179796,
            "Sequence" : 3,
            "index" : "000030C724B3C25B89A73D776005E33ACA9F7A1AEFB7538584AA8E9B36C93B8E"
         },
         {
            "Account" : "rD5TQBCZoHHnQQMHzd3bfqb8BHsDw94Msu",
            "Balance" : "19988000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "B87984992FBCD48CA49101E7DC767D9F90889B601F79264F85104BB56F110531",
            "PreviousTxnLgrSeq" : 10696061,
            "Sequence" : 2,
            "index" : "000033E22A320E5D1EA62689C561CB324FFE1103180947065079EB73812717A9"
         },
         {
            "Balance" : {
               "currency" : "BRL",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0.63235217563"
            },
            "Flags" : 1114112,
            "HighLimit" : {
               "currency" : "BRL",
               "issuer" : "rfNZPxoZ5Uaamdp339U9dCLWz2T73nZJZH",
               "value" : "0"
            },
            "HighNode" : "000000000000005C",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "BRL",
               "issuer" : "rauwJ9JC6M6JtMG5dRw9Csny7ZHVBF1tFv",
               "value" : "1000000000"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "26736CF97C8F707109717C1123BB33FBB7B6312332877469A0F82FF2E1F10805",
            "PreviousTxnLgrSeq" : 36874911,
            "index" : "000036A8D891AE85170EDA8658B52EA21C163185A008B14506F3D6EE8C90C5ED"
         },
         {
            "Account" : "rnKNNFcbsZSDDnYFSpHSkRBYvsrP29ocBJ",
            "Balance" : "49988981",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 3,
            "PreviousTxnID" : "D6018D595E70972CF01A1351554D9F51951502C625A0CE5FB7B55001A3809D7E",
            "PreviousTxnLgrSeq" : 30498238,
            "Sequence" : 46,
            "index" : "000036B2E4602C42011987825C97BCB0BEA3396115C2418BE9D70BB2BCA32BBA"
         },
         {
            "Account" : "r4ysrf6g7T6QgLGe6FtGQudWhRnxmyQaGK",
            "Balance" : "20010988",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 1,
            "PreviousTxnID" : "8B707CB44D543F12EBB2E3A3C65596B63C6F7B9AE1E77A6073D0469927E39F9B",
            "PreviousTxnLgrSeq" : 39876093,
            "Sequence" : 2,
            "index" : "00003B5A931AE159DCDDABBDBB32A8F26B07A74203817009097B3F8F4440FF29"
         },
         {
            "Account" : "raAUvyzqUKM3JWZgGuwGfEfxUJJbpVnrQA",
            "Balance" : "48575070060",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "29F37B398FCA123B8B4FAD88510170F156ACEA8E65AA21E8536997A9B238667F",
            "PreviousTxnLgrSeq" : 56468588,
            "Sequence" : 2,
            "index" : "000043EE9FCE52E7691EB21E714D3FE5AE641363317C7D856085B7A0C2BE66EA"
         },
         {
            "Balance" : {
               "currency" : "CNY",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "-2500201.004512104"
            },
            "Flags" : 1179648,
            "HighLimit" : {
               "currency" : "CNY",
               "issuer" : "rGo32zaBLSBwC1fTYHjBsZxQk3Mo9E8rDZ",
               "value" : "20000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "CNY",
               "issuer" : "rbwE6wsxzYat1YyGGxzAwq6wBSF5MdoAg",
               "value" : "0"
            },
            "LowNode" : "000000000000004F",
            "PreviousTxnID" : "6BD812D3AF63299DFD1C123C76D366752AA4F09D0076D868EFC950A967C1B1D7",
            "PreviousTxnLgrSeq" : 27109989,
            "index" : "0000457D66BD69769E4BB05DDAB4269F5EB1A095026FDB04816058385D09568B"
         },
         {
            "Account" : "rP6dAps4bwHTf8bNNkhA4YKx3DeMNdr8sA",
            "Balance" : "1886187898",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "73C54DAC576C4DA8851B47F9D802123C942C21026AF13B849F22215ED8AFA0A4",
            "PreviousTxnLgrSeq" : 56330724,
            "Sequence" : 1,
            "index" : "00004718F616B0CC7E12949C8AC399A9FB383311C5515C110194223F1A8FE627"
         },
         {
            "Balance" : {
               "currency" : "JPY",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "30"
            },
            "Flags" : 3211264,
            "HighLimit" : {
               "currency" : "JPY",
               "issuer" : "rDKcJtUW5b8URJB5AVb41jkTeETfXWwahe",
               "value" : "0"
            },
            "HighNode" : "0000000000000029",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "JPY",
               "issuer" : "rpNSWfSE2TkmwH4VK26d6RGwC7rzQb7xKt",
               "value" : "1000000000"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "3B7C0DE2A9F5FD2CC1C058763690EECB3452C76C6595F97318C98BF8D105DD52",
            "PreviousTxnLgrSeq" : 34623483,
            "index" : "0000484CEEDC4DAE666B2C2DEFD726575DD1D5197CC32C38B63F1D265462BD48"
         },
         {
            "Account" : "rEngbD1J8rrrMkKz8fBtdLRgarmMZTiNRt",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "1D8544851DF1E3B73B4299707AE9FBA4D9A375D30EDE6A7F9F6D2F9905AAA1DC",
            "PreviousTxnLgrSeq" : 35751340,
            "Sequence" : 1,
            "index" : "00004C6EC792D443262DB347376ADB5781FCD6EC84E233826C9172BC14316D1B"
         },
         {
            "Account" : "r4arcs5ngLPmDeYoDLzaG7q5eWKs2LeuFK",
            "Balance" : "200824800",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "9E6D3DC20F4069FAF1F25E2C26BBD8BD8BBBCCB13F92EC4AD4A190D5753604A3",
            "PreviousTxnLgrSeq" : 37180721,
            "Sequence" : 1,
            "index" : "00004CA3D9AA87A56017E8CD56893DAECA090EF8CC393EA38758E22B5BDC7159"
         },
         {
            "Account" : "rDtMRovj32kjpJpnBR2HUqHAZ5HYjauFrL",
            "Balance" : "614201036",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "CBC27919116C08DC751C8E2ED1E9772519C610F93FE8CE9414ACEC6E1E245AAC",
            "PreviousTxnLgrSeq" : 45157979,
            "Sequence" : 55,
            "index" : "00005E8982DE87680E6D3DC143FD0B73A30EF873D1C6EB9F371BBE140F6D49DF"
         },
         {
            "Balance" : {
               "currency" : "CAD",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "99.67048908512925"
            },
            "Flags" : 196608,
            "HighLimit" : {
               "currency" : "CAD",
               "issuer" : "rnziParaNb8nsU4aruQdwYE3j5jUcqjzFm",
               "value" : "60"
            },
            "HighNode" : "0000000000000011",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "CAD",
               "issuer" : "rsPwcozMqkCr76TvABBjyzaGqvUrpcxafd",
               "value" : "100"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "5CB4D8512C74A21DB45DD67F409A7E784FA79E0E0ABCBD3208574A3D4E48AA44",
            "PreviousTxnLgrSeq" : 39514920,
            "index" : "0000655AD48998D4F3D931356363FFBFE89416DD21A9159F647AEE3652AA076D"
         },
         {
            "Account" : "r4rZuKQRF3DpuVoftMfz9q6cae9UXiiTEA",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "2F586F9E23348AF1A6E2E5C11908A269657CBD61A8CB4C4A1CE69FBB34979643",
            "PreviousTxnLgrSeq" : 54003659,
            "Sequence" : 2,
            "index" : "000065C9F41ABE752CBBF18C15B35294045A686B7242B14D6FE5175C48459BFE"
         },
         {
            "Balance" : {
               "currency" : "ALV",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "-0.3"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "ALV",
               "issuer" : "rPJM3GsQjpZLd3CQWSpqGs1qWEG1X4vpSm",
               "value" : "1000000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "ALV",
               "issuer" : "raEQc5krJ2rUXyi6fgmUAf63oAXmF7p6jp",
               "value" : "0"
            },
            "LowNode" : "000000000000005C",
            "PreviousTxnID" : "4B905BDB67CDCE068FB216B7ED3833C0743944B8170B3FB4BBF2C124EA6C7BE7",
            "PreviousTxnLgrSeq" : 37878390,
            "index" : "00006CB62921C8A4D42D4375440A0636104A1F6F3E48ADBFF9D83A405D241223"
         },
         {
            "Account" : "rKQSz4tYnAi4au4v8eEa6hkUrDjukLTVi4",
            "Balance" : "20420366",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "80755ECA9A09E3D9A05D012FEB2F0DE2D6CD93B36478087F4925722E4A8500EA",
            "PreviousTxnLgrSeq" : 36172509,
            "Sequence" : 6,
            "index" : "00006D7682A29260C4079ABC2E810ECF68AE784D4E7E5E152F587C3A0816F254"
         },
         {
            "Account" : "rEhKQnKYjTBqmWyWGfYtJgx9CxCBauLu3S",
            "Balance" : "20150000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "F18D40F603177CE74689FFB5972EC4A167B639A2F2A11AB7671B32CB7A9F3118",
            "PreviousTxnLgrSeq" : 35040704,
            "Sequence" : 2,
            "index" : "0000710FFC8D60A8BCA7BA5BFC00EE81FC7D3BB2AE5E8ECE92CC4E441B63CE80"
         },
         {
            "Account" : "rJLQ56pHabZ6o2mNSmprBxy6DdCwdxTAzd",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "E18725C56FB60084F05162BCE7946861A470AE620BDD5DE519D15D260594578D",
            "PreviousTxnLgrSeq" : 42119175,
            "Sequence" : 4,
            "index" : "00007429BB237782C9406EF25B09463DD751712E4D21F49DC221CFE4CF262660"
         },
         {
            "Balance" : {
               "currency" : "ADA",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 1114112,
            "HighLimit" : {
               "currency" : "ADA",
               "issuer" : "rJXGFDrN5h3ooiCSsupPXhg81QgGtUQmeJ",
               "value" : "0"
            },
            "HighNode" : "0000000000000001",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "ADA",
               "issuer" : "r9TPUpytcjmo9UaM9kwu6VmDSuVXqSxWUi",
               "value" : "1000000"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "E64DE7F158AD81B20D8E10255CC9BE0ABB39347C80CB61205D538F905A1DCABE",
            "PreviousTxnLgrSeq" : 28152986,
            "index" : "0000812BF6B7152E240E8A41A224C876F4A006DCD570F2E9FC6BFB34A9A5F960"
         },
         {
            "Balance" : {
               "currency" : "BTC",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 1114112,
            "HighLimit" : {
               "currency" : "BTC",
               "issuer" : "rBadiLisPCyqeyRA1ufVLv5qgVRenP2Zyc",
               "value" : "0"
            },
            "HighNode" : "0000000000000002",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "BTC",
               "issuer" : "rfVBtKzz4kAuxcaESZv3tF3vcsHfeWBoho",
               "value" : "1000000000"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "12D2D09C90F49889718B60BF3A03493364EB665C0F558EA12CEE1B0C35D5C124",
            "PreviousTxnLgrSeq" : 9301047,
            "index" : "000082B286E3162EC4ADA91330AF0072D1B51748089906F635AB7B30966C56F4"
         },
         {
            "Account" : "rPR6WAoPKByT92Sjuji8Y8EABTGaLaACV3",
            "Balance" : "209270000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "EF6518AB9506BFC883182600E2FDDEC016BEA5412C7C8A3EDFDCEFC06D4CDC3C",
            "PreviousTxnLgrSeq" : 35893835,
            "Sequence" : 1,
            "index" : "000084346288D9C0EC50D79D394230D7C5CB3190DCD9527B8F1FA18084A7DA5C"
         },
         {
            "Account" : "rJUkQCKwM9smokgL7iD6oyLTx813PaQUiY",
            "Balance" : "35009535",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 3,
            "PreviousTxnID" : "8227B98C50DD76CAE2D226066CA9C3AFFD3F3F7B97D0CA755BAA0C61465A3808",
            "PreviousTxnLgrSeq" : 48263445,
            "Sequence" : 36,
            "index" : "000086CE48D95A92F078B5128845C3BCDF56E7DA88D7E35089DBE5AFF7D81C0C"
         },
         {
            "Balance" : {
               "currency" : "ETC",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 1114112,
            "HighLimit" : {
               "currency" : "ETC",
               "issuer" : "rDAN8tzydyNfnNf2bfUQY6iR96UbpvNsze",
               "value" : "0"
            },
            "HighNode" : "00000000000001E5",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "ETC",
               "issuer" : "r3X34kvPSV2jGU7fgUb3wh1XCwr6WCbm94",
               "value" : "1000000000"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "E763D1AF0BFEAA558D42B33361DEB3C7BEDC46AFF41D016EE726554C4C365294",
            "PreviousTxnLgrSeq" : 34855014,
            "index" : "00009472587A9D425875950F0FA34CDC7A69F384AC28A756C5A2322AE0F0A1C1"
         },
         {
            "Balance" : {
               "currency" : "USD",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 1114112,
            "HighLimit" : {
               "currency" : "USD",
               "issuer" : "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
               "value" : "0"
            },
            "HighNode" : "00000000000002D9",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "USD",
               "issuer" : "rpHbU3xao4QxtqHSFS8ojDMxPFcbasrRmb",
               "value" : "1000000000"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "7B25FC571E190538386BEE9F2CEC94E01BC6455B3872151C693171101D5EEF9E",
            "PreviousTxnLgrSeq" : 29254689,
            "index" : "000099FD3C2741BAF3C66AC48F770DDE2B32C16AC81EAAD88262866B263F5523"
         },
         {
            "Account" : "rNB3TknEkY3kjpwNCGVxpvBwyowyGuwfVh",
            "Balance" : "23169305",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "09574601F2AEDFFF4CF61CF377C298F07FC9A13B5127B4C53EED3B29A756F70C",
            "PreviousTxnLgrSeq" : 35690032,
            "Sequence" : 4,
            "index" : "00009C1C21886B5C2BDE0B7751F96EBC3B7C8C57AA8D16E3A818591624A1A5A9"
         },
         {
            "Account" : "rKbyYMKzTgvhsUqgeEbpdq6WvQc8rupMGn",
            "Balance" : "20150000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "8D54FAD13DD5B90133B3FA1F2BDBFA15559DA35159B670AB8B5FF51F29EE39A0",
            "PreviousTxnLgrSeq" : 33977868,
            "Sequence" : 2,
            "index" : "00009C2BEF50C671658F700078E740B87F650E081B55CC3FA32A00475F621D66"
         },
         {
            "Account" : "rLkrSbJgLHPdQFn1QcRTCDmRWvZpp27tah",
            "Balance" : "50624403",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 1,
            "PreviousTxnID" : "412FAE0959898C325238876A0C039096C39B25A3810C708D56C9899FB2384903",
            "PreviousTxnLgrSeq" : 35648800,
            "Sequence" : 5,
            "index" : "00009D28A1AE6FFC984B771DAE107699091DF44F6910FD05B12CC09E3F7DE801"
         },
         {
            "Balance" : {
               "currency" : "XEC",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 2162688,
            "HighLimit" : {
               "currency" : "XEC",
               "issuer" : "rMpiGaEM9Qp3icX7wPHTdxbkphHWLJcX34",
               "value" : "0"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "XEC",
               "issuer" : "rNx3ty1w48iAa4JDfqhZk6bphwXxvCEtZP",
               "value" : "0"
            },
            "LowNode" : "0000000000000007",
            "PreviousTxnID" : "01AD5E21337686A2F709773A28501B2023D3A950550BEB03C43462B98731A9E9",
            "PreviousTxnLgrSeq" : 35883799,
            "index" : "00009E2036FD1B363A6E2B6752F7C672D652E3A559579BFF3C493587C8C231C3"
         },
         {
            "Account" : "rDR96JmJAsEgZThPnREZTSdjKPZDnH5k5f",
            "Balance" : "153819291",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 2,
            "PreviousTxnID" : "EB5515580E16071F0EA96B3313D72C6545F23CDF0C32547A9ACCB2FCE404A4F0",
            "PreviousTxnLgrSeq" : 35368386,
            "Sequence" : 7,
            "index" : "0000A80432DEC44EE6228DE4A0528EFF76E28288D5E2A0384DD3432D976984A3"
         },
         {
            "Balance" : {
               "currency" : "BTC",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "-0.000459110023164767"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "BTC",
               "issuer" : "rPireoEmXsz8hke3T7mrdDkqfzxj4uY4ae",
               "value" : "1000000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "BTC",
               "issuer" : "rchGBxcD1A1C2tdxF6papQYZ8kjRKMYcL",
               "value" : "0"
            },
            "LowNode" : "0000000000001003",
            "PreviousTxnID" : "1F9E636AC4FEE0C01EEE0E0559121689AABC70BE7ECF5B60E4ECB78627523583",
            "PreviousTxnLgrSeq" : 41398225,
            "index" : "0000A9D1FDBC542726D379D855E4CB3E2C05483B6F033F43408DAE9E1838B70B"
         },
         {
            "Account" : "rHKEQxk3G2EEZnsmiCd8RsBM5UigC5qiVe",
            "Balance" : "350000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "A6382E793984B79E2938C66CCA9F2D694F5CACBAE21B50A3FF9EC40930A12599",
            "PreviousTxnLgrSeq" : 34504001,
            "Sequence" : 1,
            "index" : "0000AC1E487CC20D9FF8314022473B1D5F106D35BFC3BB33032FBF976230B0FF"
         },
         {
            "Balance" : {
               "currency" : "BTC",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "BTC",
               "issuer" : "rHYSdyKPrtDegWkHibXK3YApwKfn5J1rEN",
               "value" : "1000000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "BTC",
               "issuer" : "rchGBxcD1A1C2tdxF6papQYZ8kjRKMYcL",
               "value" : "0"
            },
            "LowNode" : "000000000000049B",
            "PreviousTxnID" : "8424AF691677ACEA9B0113B2CBDC577AABE251E1EDDB018E0744FEE8C90C58DB",
            "PreviousTxnLgrSeq" : 31621663,
            "index" : "0000B24C620FBD0E8B1313022AA4857E5300FB70FCDE9F194F901D567C70EDFB"
         },
         {
            "Account" : "rEFh3ZGKaxMJwWPXxiYYa8kiXJyVMJNwoY",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "42F82FF6D1EB50C5DD13784F073F231BA887922AB9958BF2C4A168438711AF88",
            "PreviousTxnLgrSeq" : 47429528,
            "Sequence" : 2,
            "index" : "0000B482CF9E7E9BB4350CF185A306BE9165218401EB559379A00AA0C7915312"
         },
         {
            "Account" : "rh3C81VfNDhhWPQWCU8ZGgknvdgNUvRtM9",
            "Balance" : "13000000894",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "4FEE14F4552879897B61C77CA5E0A884652102EF62396C09835BE9477E2B8969",
            "PreviousTxnLgrSeq" : 55182503,
            "Sequence" : 1,
            "index" : "0000B717320558E2DE1A3B9FDB24E9A695BF05D1A44E4A4683212BB1DD0FBA23"
         },
         {
            "Balance" : {
               "currency" : "CNY",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0.032809672000001"
            },
            "Flags" : 1114112,
            "HighLimit" : {
               "currency" : "CNY",
               "issuer" : "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y",
               "value" : "0"
            },
            "HighNode" : "00000000000001C0",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "CNY",
               "issuer" : "rhNTmR8ej24mL1LXv3ZsCnrQop7c6bocQp",
               "value" : "1000000000"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "4710BF02E5791A7D69FC384C874A40E06F1E23E63FA7FD6355D1B439F436B2D5",
            "PreviousTxnLgrSeq" : 21050911,
            "index" : "0000B87C9CD0F3530C71A8921FBCF127EAECA5C9DA92717AFB1CE9F63C8BBD6E"
         },
         {
            "Account" : "rhVcmcoptD1Kgeeag9mhsTPWQSZk8eTz9A",
            "Balance" : "182376831",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "A6803D6CE4199E0F74C52788C7A148E4AF9E9A0CBFF072B469ECC5C0DCB448CB",
            "PreviousTxnLgrSeq" : 36446538,
            "Sequence" : 1,
            "index" : "0000BF2224BB915521C921773AFE11E1CE59CF69F6AE3AB6827707102103C47B"
         },
         {
            "Balance" : {
               "currency" : "ETH",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "-0.00002"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "ETH",
               "issuer" : "rHzVgKskCRFpg1X3aBU5AtvQnDD5mqSX92",
               "value" : "1000000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "ETH",
               "issuer" : "rcA8X3TVMST1n3CJeAdGk1RdRCHii7N2h",
               "value" : "0"
            },
            "LowNode" : "00000000000009FD",
            "PreviousTxnID" : "AE750643C6C355A176A65981CA9D1831A7C226F230420624CE8C8C32A4C22316",
            "PreviousTxnLgrSeq" : 35743316,
            "index" : "0000C2D68E9A1E1919E930D0D063A183DBA39798286DFEE32E1EF5379A8F6B79"
         },
         {
            "Balance" : {
               "currency" : "RUB",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 65536,
            "HighLimit" : {
               "currency" : "RUB",
               "issuer" : "r4wnCs62uGuGBuoSttaYsiFedZ3Wd6NPJJ",
               "value" : "0"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "RUB",
               "issuer" : "rU73c3tdNz6vpKjs5432YFxgepizkV1qyp",
               "value" : "0"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "B7AC4670461DEA315826E37A90C63D2C66045F829FC6C603AD0C9FB25A2BA226",
            "PreviousTxnLgrSeq" : 56277523,
            "index" : "0000C3C0AE5883C4B4455845A39F97C48DC4D62101F38812213DBAE00A086060"
         },
         {
            "Balance" : {
               "currency" : "JPY",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0.54045001548441"
            },
            "Flags" : 1114112,
            "HighLimit" : {
               "currency" : "JPY",
               "issuer" : "r94s8px6kSw1uZ1MV98dhSRTvc6VMPoPcN",
               "value" : "0"
            },
            "HighNode" : "0000000000000147",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "JPY",
               "issuer" : "raUX9XGwCx7sowwdk8FnvbyZ3LYrvRYsxF",
               "value" : "1000000000"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "0F31CA12B366AF3E658EBA68EEEB1AFCA7D28CFB74BF6CD22C02CFCA82BDC983",
            "PreviousTxnLgrSeq" : 32752843,
            "index" : "0000C864EB051CF0D4A1EBB5B92390769CD2E84FFCFDD00E8FEF6DD6CF545BCF"
         },
         {
            "Balance" : {
               "currency" : "CNY",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "1.2339878"
            },
            "Flags" : 1114112,
            "HighLimit" : {
               "currency" : "CNY",
               "issuer" : "rPT74sUcTBTQhkHVD54WGncoqXEAMYbmH7",
               "value" : "0"
            },
            "HighNode" : "000000000000008F",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "CNY",
               "issuer" : "rRFBj6g2mVXstHfzsQE6Y9WX1F6fhqcTK",
               "value" : "100000000"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "265DBB6009C3CC5A89421DBE0293AFAAE2F9F9040C72CDCA406F0C1EC29314FB",
            "PreviousTxnLgrSeq" : 35575141,
            "index" : "0000C9ECB507AE2CBA320D2D85708AA5C064A291BED7D6988A3F0DAA028F06AC"
         },
         {
            "Flags" : 0,
            "Indexes" : [ "454E2E047AF37AD08E2923C7550A3852EBD5653423BF5C53083BDEDBB1416F3D" ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "r4TByrtckppjYXH1Ga6H67T4cVSo9NbJoa",
            "RootIndex" : "0000D04DD09A3AFFD4F72DBC82676D87FA0E78100318030253F554B716DBAB61",
            "index" : "0000D04DD09A3AFFD4F72DBC82676D87FA0E78100318030253F554B716DBAB61"
         },
         {
            "Flags" : 0,
            "IndexNext" : "0000000000000042",
            "IndexPrevious" : "0000000000000040",
            "Indexes" : [
               "09FD4F9F11B873C9D9305FA3CF6A69DF7094EE62249302E42116FD6785DA01D3",
               "0B7BFBA537D9D61801B71D148C0D009894ADD05421FF3BA3DE9B034735815E97",
               "0DCD793E55A28C0D8FD0605A223A4999B4F0B330B0EBD4E680FE9D211F2A019B",
               "11F82E1B83AED8D65106519CDBF03F4FD593BCED7DB250C11DCC0C4F1E62D722",
               "286BB3EE7EA39BF84F09AD171F2B0A3E989E33430AAD4956060F65BB075D96FE",
               "2FF3DFC02FFDEEF16504F982C45FDCBF64D33474B1BF70AE5D575F87286AB8FE",
               "33B19788AF95B4974AF78334610D36EE12121705E63EA668BE0B5DEE61732157",
               "498A5D8BBB03EE6D9A3895DFDEE92CF0C50F4E59CB6774C403BA8A2144D3B148",
               "564C375F8963269E3025B547E57C6DA19C08F1DD57A9C84638E29CDE012576AC",
               "598F891A026B8CE95A2925D608D22DB9FC421FC89CA94AA779EA423FF0A76ACA",
               "5BB8D13A07B741D1DF1FCC66E97AE8D628FA77CB4DBCC31F8905CFCC1BC49BB7",
               "5FFBF4BD8FAAD3F0BD450C27A14934C6BA0826DC5E0E8E48EFA6136DAC2810A4",
               "62606281D0B3BEDDDC0BEE1D3D71E3786396522238822F38C5FE965FC9A31307",
               "6D6E102E93C57FA1DE3B90C89958ED1A7985CADC790B0B40E44605E50D49B21A",
               "79881E278AB359606FD58984CD0D18AF1364CC589A520DAE28EB60EE5369D0DC",
               "7D9A657FCF24BFBE5DD09C05C44988439D26407937802A0FC6B1922307A886F9",
               "82B1F7A3235BC90220751DB626090054A2C6084B9BAE0CF95B88A6D778964B34",
               "8EB4CA0F9A5492F68F26B04C87B7641EB5FA060BAD3ED76C7EC2E6C76C15EBC2",
               "900C7D947C9F3462F347884EA14A853EFC1417A2BE5B0513F0D422A3A085E1B4",
               "9E853D5188667FA3DBF3E94DB8BCF75DD0AFCEAA84EC44E23E5ADA6CC3E17AC3",
               "AD35E5B4821CDF4334B4A8221218CEF1DA96F24DFA59062C571FB8F4BE27A258",
               "B4294BFC9B9622F15560D0403182D7D6ADD05A4A0CB75808395A8BE303FE97A3",
               "BF44E394383AC131812E3CB525A75174FBDF43C6DEAFA6B5AF78897287B415B5",
               "C08C5409998CED4B0F7B813C4448839ED53A4F290BBC0C71467B6DBA9B5F6B9F",
               "C799828B25BB5C7896FB03A27F36C08CD6BBAFC8F7D7FCA68FF1C727369D647A",
               "CF04F0477E7BF590302293097B5D441451BBC54ACAE0F396D846A5E2BB4ED809",
               "D4172E534583CF88B32357F81402620B0BD7A85248F277CE35654D70792335F9",
               "DFCCAE3AE0FB534E1DE93449F4ABB6670CC88B03B91158B7A52650D251905FF1",
               "E0E55DF7339BF8EC3150A5D0C624ACDA9A2D9CF88781628189CCC0F2ED4E74AB",
               "E329C7D93439B45442CA8B97B8BC2F093EEB1BA2E6C4139C510C3E4FB9F273B4",
               "EAE50BF969F4A3CE8C6FCAE744DF3B797057B0B2CE6CAD38A54136AEE3614D01",
               "FB594E5E88B25B7AF5863CEFC7A3FE0A55F8486C6D5A3DFD7626428F879F60D5"
            ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rpJZ5WyotdphojwMLxCr2prhULvG3Voe3X",
            "RootIndex" : "5655E14CF12014525D1BC1E68DB09518514FEDCD3EE26F4865109B56B9EE3650",
            "index" : "0000DAE48F41B86821B14F1892D6AD3F6996B608338ACFC363823858CB251020"
         },
         {
            "Flags" : 65536,
            "LedgerEntryType" : "SignerList",
            "OwnerNode" : "0000000000000000",
            "PreviousTxnID" : "B06C49812F7E3A84A75C78F38B920966A94ED5F85C4E6EFD34C523A6C797614A",
            "PreviousTxnLgrSeq" : 47260685,
            "SignerEntries" : [
               {
                  "SignerEntry" : {
                     "Account" : "raWr8dtNxddY2bqD51LZh9z77R23iyP3PZ",
                     "SignerWeight" : 1
                  }
               },
               {
                  "SignerEntry" : {
                     "Account" : "rwJkTfV8XXThGBUoC7sACmyWepw4iurYHb",
                     "SignerWeight" : 1
                  }
               },
               {
                  "SignerEntry" : {
                     "Account" : "rGtDNiHFHNTNSnoeLg5usoRnLx33ABTWhT",
                     "SignerWeight" : 1
                  }
               }
            ],
            "SignerListID" : 0,
            "SignerQuorum" : 2,
            "index" : "0000DFFDA866FD9215A794C2FC7FBF3302EF1335E3835D1B74E73780ABE32AB3"
         },
         {
            "Account" : "r4cPWQKVertBh6auBn6t2rXh9kht4LoabA",
            "Balance" : "25032932",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 1,
            "PreviousTxnID" : "27653F0C331B2317D35D5677BBCD0DE639E65E365392EFC8D691A824085AC864",
            "PreviousTxnLgrSeq" : 38365202,
            "Sequence" : 61,
            "index" : "0000E78D01EE4EDDE598B933D1092A1E00B922FDEDD58CFB25E3AF2CE099AF48"
         },
         {
            "Account" : "rKru2mJkxPrum8VAZHhdoSYEwMW7G7KFD9",
            "Balance" : "38871400",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 3,
            "PreviousTxnID" : "0A91F6560E32B6C13285E5F98DF81B04EBC919ABD60126F529ED3A82C93E5F68",
            "PreviousTxnLgrSeq" : 35803787,
            "Sequence" : 23,
            "index" : "0000F5AB075F8C48286156A300F367F7E370434B0F08CA0475DDA47B1854CA62"
         },
         {
            "Account" : "raxoUPmpy1x7bfUX2giVfMWkPMa3vWW8f4",
            "Balance" : "1121000177",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "AD4616FD44650D3E279D534BD1799AB825891449ED7E2413403666E9CF18935E",
            "PreviousTxnLgrSeq" : 53532513,
            "Sequence" : 1,
            "index" : "0000F89B1E8F215DE7D737674050C33557974864924B2F692129560508BAAB0F"
         },
         {
            "Account" : "rQDZcUFcbRNXHppFUFFiTtii3hRoyjTxAV",
            "Balance" : "11834990892",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "1772D4ECED1698225672ACDA3168ED886DD8F7669538BD2AC6F4B12CF9315500",
            "PreviousTxnLgrSeq" : 55170656,
            "Sequence" : 1,
            "index" : "0000FFE18AF90D9780964C9E7A4C2F8D82C6E78C0267344B6B4232AFB9E56DA0"
         },
         {
            "Balance" : {
               "currency" : "BTC",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 131072,
            "HighLimit" : {
               "currency" : "BTC",
               "issuer" : "rKUK9omZqVEnraCipKNFb5q4tuNTeqEDZS",
               "value" : "10"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "BTC",
               "issuer" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
               "value" : "0"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "87591A63051645F37B85D1FBA55EE69B1C96BFF16904F5C99F03FB93D42D0375",
            "PreviousTxnLgrSeq" : 746872,
            "index" : "000103996A3BAD918657F86E12A67D693E8FC8A814DA4B958A244B5F14D93E58"
         },
         {
            "Account" : "rBTpxtceMtXUKit2mQkVcWKuDHYCR7LKdD",
            "Balance" : "999988000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "D59694A9C6A9AAE645E51EF4FD7F9B20835A52381035B2FD99905AC6DB9850A2",
            "PreviousTxnLgrSeq" : 11683667,
            "Sequence" : 2,
            "index" : "00010BC07B606D414CE5F140403152AC34B34EFC27E646E337D1F11593F559DE"
         },
         {
            "Account" : "rPDT5VZCLM2wv1qwmpbCjQfn1wXBANRhQ5",
            "Balance" : "24977500",
            "Flags" : 1179648,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 1,
            "PreviousTxnID" : "AD9F7BF745AC3567B30BAABFEFDA224042A184B3A094450DDFA7E13B1D6DCB3B",
            "PreviousTxnLgrSeq" : 51348778,
            "Sequence" : 4,
            "index" : "00011327A3CA29B88F23A58B640CE23135C18E4E2A8C2333B09D7D3112459637"
         },
         {
            "Flags" : 0,
            "Indexes" : [
               "0DB0815613B4FA7A2DE7E9551E6D2117ACD1036E1CCD14414C7905AEFC072549",
               "405161AF4FBEA97F25331DEB3D2E56531245CA4F010639443AE3C8E9A5A0380C",
               "4F8D5788C721E2B9F38E23DCF5396F2D6B1EF8E32BC8415495122B0F6437743F",
               "C1B13E99BC56A1B4357DED440EBF0BADB1C402F582CF971401629D8FF82619B6"
            ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rBk2i1frpX2jJC1eBm2HcWmnUdR9ZRbHwG",
            "RootIndex" : "000117DF584A463510F7620C204E0FF6F64206ACD62CE887BF57EF93A4BC0DAE",
            "index" : "000117DF584A463510F7620C204E0FF6F64206ACD62CE887BF57EF93A4BC0DAE"
         },
         {
            "Account" : "rGubvAoDEmWdiAd6ovfDVuvAViDFA6nrre",
            "Balance" : "24828477",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "BD722F6D1595FDB183EA340EAF0A781A91CDD487B6EE0C65AF9F031C16957246",
            "PreviousTxnLgrSeq" : 51275279,
            "Sequence" : 5,
            "index" : "00011C8B64D31D25AD6758E0AB72765EF24EB5535AE256A6AA696536A359010A"
         },
         {
            "Flags" : 0,
            "Indexes" : [
               "22E578265CD7E5F46DD0695DD55428CF8F797CC1D6C4C1F5F829EC677253235B",
               "2FB51B174723021E30D21A5CE4CF94CF1A99649EC33D8BE60CDEBE422E18D855",
               "5177CC903382225113B6BDBB881A00EEF4EBB6BFA3947940673DE5FEDC8B751B",
               "81F699D15B2BE1B9FE4486B95593B27067D8E5728AA21D69C86FF4F59BE7F608",
               "A76CE2AC7714162E989F93717F58F7319A08DC2CD7F65411048B5E2DC5365DFF",
               "AA1A0958D561E2A885345AFD76E676EDD29BE76FB2AE65B8739BD889EFD8092A",
               "D00DD039D22BB25EC1DD8AE7BAA3BFECA41766974C094DBDF47A3718975D8749",
               "D127376D2F4E392EBB296001ABFF8E03FC602924618D98EA7D6C748613DEC9CC",
               "EF2F3AA2F93512F263BB79C838B6DDF53E0199C59B63CC7D12D905E7097652A3"
            ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rDoWW6ERjamzXChsuE2YBZMDGUysDyfVpG",
            "RootIndex" : "000124613EE5581AFFBA4C729A0AD1046CEEB9FDFAE4E2C8C0147212F274301E",
            "index" : "000124613EE5581AFFBA4C729A0AD1046CEEB9FDFAE4E2C8C0147212F274301E"
         },
         {
            "Flags" : 0,
            "Indexes" : [
               "49998B8AD85C57D571102032E7099F83E84AB04E9AF7A02A6470CD848B76163F",
               "17712DAC19B5275AEA623477BFD517D5379EB3AE130C1279F3E57B8D1DB9AEFD",
               "BBDF9868E3FCE9CB50AD16719D0009B044F838551392A6EF4029EB390F926A55",
               "1D8485B2F450F6CA0130C53963D3C6F18E256A3795FF7369B9A06A2845CFC96D",
               "BE1B22BC694F1BA8AF1C7E841877598789B5028F11296424A5E521D762636101",
               "9B6EF09CA83A6186F4B1F677ABA02FA4CF0F99E319FDCD05F2BB7EB4668845C3",
               "5A8038F189C15616633456580940927D0B42EBAEF49E97D662DD7336F0006E72"
            ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rad7pqyVBYjom3dNuXbd2WjEga7un9GVtE",
            "RootIndex" : "00012954F2A4838FA5DF0A00BCE54A9CC5C878D6B8E00C7CE9C3A346E44C18DB",
            "index" : "00012954F2A4838FA5DF0A00BCE54A9CC5C878D6B8E00C7CE9C3A346E44C18DB"
         },
         {
            "Account" : "rGP5bTpj6pmvcGKkNqSTM4d7fEVyque8A8",
            "Balance" : "20023735",
            "Flags" : 65536,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "D4D6B2CBF319B7291C68F5372478F2DB2CE6060400FD6675501A1657119DCF60",
            "PreviousTxnLgrSeq" : 48386321,
            "RegularKey" : "rP2gfYFYZRWPzLMPpzjq8ZLZcEDvC4t1n2",
            "Sequence" : 3,
            "index" : "000145F2834A83C6C4F1756528876A331021C36112E8A20F66AAD646CE06D77F"
         },
         {
            "Account" : "r7KCRNjcweTn64ty5eTZ6CCDRKuSPYurW",
            "Balance" : "30099277",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 2,
            "PreviousTxnID" : "81C454E3A8CAC7E2AB6344190AC238402400BCC249AF5F0F4F20512844CB308C",
            "PreviousTxnLgrSeq" : 34678008,
            "Sequence" : 29,
            "index" : "0001505A9C2BBA5C19B812889DE86E8DB411D5E34F8B6DBE78F73376D502E327"
         },
         {
            "Account" : "rwBBnexNbxPNTCh5BkSRubhVzw3asfqG6C",
            "Balance" : "20006468",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "0E1D9A165492CCBA23DEB69A4FD2440A2046A81670C074B381A008FDA08AC9AA",
            "PreviousTxnLgrSeq" : 48236415,
            "Sequence" : 2,
            "index" : "000152F477C08442092FF51513637262A5814ACCEEB873DD4542046A85765E8B"
         },
         {
            "Flags" : 0,
            "Indexes" : [
               "BDF1810D0F8272249D560AAF47168D1BCF664E53D27F3041403A42876475F04F",
               "606519AFA9D8F25AA0C7FBC2BF167FD5F472F4941A222F70B818EFC8F273A1F7"
            ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rLNeS5rVcEVgVnqyve2SSoNyxg5SgJskhN",
            "RootIndex" : "000156EDDD33FD522EEDAC95BBF8C422159A2BC5E9EEDFEF0562F6943663DA05",
            "index" : "000156EDDD33FD522EEDAC95BBF8C422159A2BC5E9EEDFEF0562F6943663DA05"
         },
         {
            "Account" : "rU1AMsDK5Fsyx7WUmhoQTdv7ZDQWtuL71S",
            "Balance" : "24977500",
            "Flags" : 1179648,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 1,
            "PreviousTxnID" : "08C040451C492C4EC0B24FE24E50268755ABE82449F032E481EBF7CEADA0E8A2",
            "PreviousTxnLgrSeq" : 51378627,
            "Sequence" : 4,
            "index" : "00015F6E0B22029ED7A6E470EAC946FF56A65ADDD74E952A8C485FD8E86DC7EF"
         },
         {
            "Flags" : 0,
            "Indexes" : [ "F8351954832393F659DADCDBA60AD9C780E6A1BCB1D862AE63BAAB75DEA9FAE4" ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rheq5biynaKpGcqhRcqvmo1FNGFX98DT3q",
            "RootIndex" : "0001616E695CF6732D8D3809A22498056806383D29116615AF99ADCB029D3171",
            "index" : "0001616E695CF6732D8D3809A22498056806383D29116615AF99ADCB029D3171"
         },
         {
            "Account" : "raSieUta8fy4SfACciECTdn2HGzEu8f48Y",
            "Balance" : "52744206",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "602045615A571475995DA7667E093B8ECB5BE5419CDE9F0ABE8670ED94A3FA48",
            "PreviousTxnLgrSeq" : 41757973,
            "Sequence" : 1,
            "index" : "000162578D0B7D7C9147874B49C69F64E8B229CD599066BC44D64972F7397B59"
         },
         {
            "Account" : "rZWjtggT2aT9539aEb9HPZR2aqonE8UpG",
            "Balance" : "20022340",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "5E7B6DBD193D13F1BC93F776E708EF6D324142144F941C46A83068F7AE05C555",
            "PreviousTxnLgrSeq" : 35875147,
            "Sequence" : 5,
            "index" : "00016BF3FE48CAEA4BC3D5A78A4DAACDCE013655F021FBA5E9F01065CFEC6A9F"
         },
         {
            "Balance" : {
               "currency" : "CNY",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "12.725676646811"
            },
            "Flags" : 1114112,
            "HighLimit" : {
               "currency" : "CNY",
               "issuer" : "rPT74sUcTBTQhkHVD54WGncoqXEAMYbmH7",
               "value" : "0"
            },
            "HighNode" : "00000000000001C0",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "CNY",
               "issuer" : "rExzFtNkWrHrXF9zK2eABuvrhD2ayFoopV",
               "value" : "100000000"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "642A3E7DF7E5471BC671F5862AFF1D935061BB2032BD0DC3BFE9C093B593E992",
            "PreviousTxnLgrSeq" : 40968267,
            "index" : "00016EC4440590FE9DF14F280580B77116341F97D0179B04D7D0B88EE25420A3"
         },
         {
            "Account" : "rEXwDtcsjf6zUairDrJ64beeppn2vZ9u5k",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "A482F307A6F637187BDCD98AC1489301FF7F8E59B5016F6F3042E6C436BAA44B",
            "PreviousTxnLgrSeq" : 47812511,
            "Sequence" : 2,
            "index" : "000171430B5EFB5018FBE245D1119CA61CFB8CD27446D51C9C2CB4C20739AC57"
         },
         {
            "Balance" : {
               "currency" : "EUR",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "EUR",
               "issuer" : "rfz5wUTPtwEnZMvLYR526jWWqygSoHQB72",
               "value" : "1000000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "EUR",
               "issuer" : "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
               "value" : "0"
            },
            "LowNode" : "00000000000004A3",
            "PreviousTxnID" : "28783500A8878DD51E100108F0A831BAC3F02089EF1279553B00D1A75A0738B2",
            "PreviousTxnLgrSeq" : 29830948,
            "index" : "000171D2817C44C4AAFB093F675C44CF76CC77EBB10D67340F04D5C216CC60D9"
         },
         {
            "Account" : "rpSRdnAoTro6CPxqWtSgDouN11eFWPUEtz",
            "Balance" : "10000000970",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "2BA264781737AD0B17B36DEF048D3EAFBAAC24E57973E2A494E68A0A520D214D",
            "PreviousTxnLgrSeq" : 55178856,
            "Sequence" : 1,
            "index" : "0001727436B58F41EA68ED8BD969677AC1763ED7BDC03A9D2AA81959E34909C5"
         },
         {
            "Balance" : {
               "currency" : "BCH",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "BCH",
               "issuer" : "rpVvMLVxo7t1mZM4zJedf9Rw2zwvTFZC9Y",
               "value" : "1000000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "BCH",
               "issuer" : "rcyS4CeCZVYvTiKcxj6Sx32ibKwcDHLds",
               "value" : "0"
            },
            "LowNode" : "00000000000001B3",
            "PreviousTxnID" : "BFF8F2D22ED74DE95FEBCDF4F37A94DE5862AC3E00F312D31F13F19D490591B2",
            "PreviousTxnLgrSeq" : 35359788,
            "index" : "00017430A028B2826B5FF7A13158961E288793079F237A88D1B9447AD40A0F2A"
         },
         {
            "Account" : "rJBHfdXheicLvFdiTchUZQFegJ3F6wtbSe",
            "Balance" : "4909014532",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "B0A908380DF1317C3E0D6E9BDBC23CBF8A3A6CA33291EF7641108BA991D2A66E",
            "PreviousTxnLgrSeq" : 55176290,
            "Sequence" : 1,
            "index" : "0001796FFCC5DE52D25C719765ABC335AC9DC1D87A409CB50EECEB3FF90DA6F9"
         },
         {
            "Account" : "rw6L4pcny4qxHRzcr8rq7Ywhvtj1Zo4gbk",
            "Balance" : "20263325",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "A43A24DCAD70BE5633CBF25A60F24A40926A244FBFD2A68B56E88AD14224774E",
            "PreviousTxnLgrSeq" : 49139053,
            "Sequence" : 18,
            "index" : "00017A965A6B6028B863D5F06C034CCF092067DC7D83CF0DFA7E57E016BB3A8C"
         },
         {
            "Account" : "rrQS26TiFbxSJMeDR3GVkssvUWqNagRA6",
            "Balance" : "5184960776",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "A5A573EE1F1BB78E74C47E8EFF9966D2C034B64B2F96E516829C151D6B0BA271",
            "PreviousTxnLgrSeq" : 55179562,
            "Sequence" : 1,
            "index" : "00017DBFBA3F871DED46B33A9F904E8347D9E12137AACEF3641D26D09481A3F4"
         },
         {
            "Balance" : {
               "currency" : "EUR",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 1114112,
            "HighLimit" : {
               "currency" : "EUR",
               "issuer" : "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
               "value" : "0"
            },
            "HighNode" : "00000000000003C7",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "EUR",
               "issuer" : "rhkYFLnfJjuhhJMSt98LEjHRb5EPPWMMLM",
               "value" : "1000000000"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "62C87C48AB958E6C0EEB5AC537CBA577DDF47005470D8076338BD15A23408AF0",
            "PreviousTxnLgrSeq" : 29684491,
            "index" : "0001967BAA589E2BD8DB305A679A274C091F0995A63A0500A1C4AC13D650EE37"
         },
         {
            "Account" : "ra11vg3cu7y1ekAP77217jAZ2AUxijC4xg",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "F1EB5B4857B3E5B02DEC9AA13CC249DD28B036878EAD605B630A2990F81EBCF1",
            "PreviousTxnLgrSeq" : 43025296,
            "Sequence" : 3,
            "index" : "00019BD625FF83D962FE366F0BF69D7FA50BAD8692BDC4BDDCE8517653B8477B"
         },
         {
            "Flags" : 65536,
            "LedgerEntryType" : "SignerList",
            "OwnerNode" : "0000000000000000",
            "PreviousTxnID" : "44A3BEBFDE97AF4A547CA81B652817FDB7951388AFCC1E151AEDECB035739A7B",
            "PreviousTxnLgrSeq" : 51394555,
            "SignerEntries" : [
               {
                  "SignerEntry" : {
                     "Account" : "rXKRWAQdSk68NakbeY3b4HtDqSaRFjgCR",
                     "SignerWeight" : 1
                  }
               },
               {
                  "SignerEntry" : {
                     "Account" : "rav2svUdPWzwET55egx7AuqREtkYSFScY7",
                     "SignerWeight" : 1
                  }
               },
               {
                  "SignerEntry" : {
                     "Account" : "rGtDNiHFHNTNSnoeLg5usoRnLx33ABTWhT",
                     "SignerWeight" : 1
                  }
               }
            ],
            "SignerListID" : 0,
            "SignerQuorum" : 2,
            "index" : "00019CF2142F600C978EFB986613BE3CCB85CE599405FF757BC34AEE1BF9C982"
         },
         {
            "Flags" : 0,
            "Indexes" : [ "A0DD66478D7E2C9C77B4D0C046A036C828B9A0257702FD7B403B9D0E815CBAB7" ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rNYWvRRd7PDsa69C3bqNq7MH8jBK8jUR2",
            "RootIndex" : "0001A3C2AF2B8210E978BE486AA397DB35DB9D0E6AFAEC8035E536F3DF00401E",
            "index" : "0001A3C2AF2B8210E978BE486AA397DB35DB9D0E6AFAEC8035E536F3DF00401E"
         },
         {
            "Account" : "rPySuBy3dCnDpp4eeD3YvirnLtF19DafYm",
            "Balance" : "21079607",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "D66F918C0DB4009A75FD3BC3D49087DDCEAB3FD676D9003AEB7E2A1A84264D1B",
            "PreviousTxnLgrSeq" : 35083095,
            "Sequence" : 5,
            "index" : "0001B3E919D8905EC2080FB6F593451028233D50E3A82CD16351BD394B4055F4"
         },
         {
            "Account" : "rabbit1eyDGsiWzRH4wL4vnk7giSxWyMeb",
            "Balance" : "100041360",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 4,
            "PreviousTxnID" : "DD2BD18EE4400459E3BC6560E0D3786831EFEA3860B07FFB8AE445532F589927",
            "PreviousTxnLgrSeq" : 41202517,
            "Sequence" : 802375,
            "index" : "0001B7264DF8F7730C3E1530A24A17FA99F062DC0A6E66615F3EA4EC3CED46D9"
         },
         {
            "Account" : "rf7nSY8GXRiiTukpnunSQi4otiH5ZoiEvy",
            "Balance" : "33000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "CB7F74D3CB40602C52302AE42363885E5EFC7536827B14B3BEC3055D4573F356",
            "PreviousTxnLgrSeq" : 40507156,
            "Sequence" : 1,
            "index" : "0001B75BF0B7EDEDD51057F7109144C8FACE381BA0C968596E85E7CA53C1AC9B"
         },
         {
            "Flags" : 0,
            "IndexNext" : "000000000000010F",
            "IndexPrevious" : "000000000000010D",
            "Indexes" : [
               "47EF55938C4C0E228672D6199A2B4BE6E6E2BB863341128BF74193CE5DEB5912",
               "ADDC5C415149EDE4D6F47C2AB0B9033E60156737136EFD850A409060824E4E02",
               "54264648AEC6EB3D25695872798E669E745B05AC765E45E9B5F88053EE41231B",
               "9370A905CA293F0774F454D64315CE52A63B9BDB2A50915EDF643C90CA6444F7",
               "1323A324D39A5DBADBE2F7959C9F8505ED5F43D0C3C25E4892AB0B3632D76ED5",
               "A33C29C307BDAC45F4F1277E60E82B5C26125401C20AB5CDB352DDDE38AAA863",
               "6D712C8B5BDBE99D1C93C25FFF9707D6726C317059662BED12584A706D8AEB41",
               "7CE75E387DF97ADE98718131EE2B19B034B6233D22CB67817440923BA0DC9071",
               "213CB583C0A91E794D5587320801B5F763D9FDDF4DC6AC8A0DC1D0CA6834A4E7",
               "5DCCA52BA4873F8CDDE86A08C415E8C29B4E0AB43ABE1F2B80AF667C1A831CE2",
               "676C3AB3D4953B3D995698B47F8C8BAC715D7236C1513C03D36A90F0AF2CAFBA",
               "FA7B6DBDE818BAA7BAA3FB43266C7DDEF0D6B1035A89E240185CB382FBB9CF1E",
               "162801B3679E3623F5A1E1281D875806FDBF4194C2BE2F3A89E91700FF9A0E9B",
               "C5E6524750B19B938F6A046E95AC6F57DF9C59C0D29B460DA6787840BAF8105D",
               "964B15F052285525F66594C3080EB83FEE4C448F98990B77A12654EA2638A323",
               "2F81C7C101E15DF959E43530B17C6DAEC1BD012BC7CFCC4AFF9AA905724F7D0C",
               "C5A1E3C85B510E0A3FFFE6610355D02A063E160A7A99BA6A7CDAEFD34C45BE9F",
               "F6C003A46C2905EB16A822436D0A0A6A726F7FFFD80ECFF1EEE0228FC3A2BCC8",
               "AA4C93539FAC96D37E121130F1D9225C3758AB814D2A5B4042B29E1F559EA4BB",
               "7EC3784C4CA5BDCB5C798E39B9F655860D5DF0013B39580C94B5D0BEF0A75C7D",
               "F8FED9BE60375A25CEEADE3CAF51522CB5174367C16E8099BB20DD02CA2244AD",
               "8711B16A37882C221E750F429053FBA94D74E3C2615870FFA0ACDA12694E6149",
               "1720BEB74777C45007F46332933B909E629677CE4D00EB5AC71B36A7D04E8962",
               "092E2D46FC1067FAA3A893715EC531E1E75D06BE14DFB66DFB1698EF6D5FC02F",
               "DEA88D84936A98A7BA6A16331BCBA2D5A3EAF996AF9DB25141900A071B76B177"
            ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rckzVpTnKpP4TJ1puQe827bV3X4oYtdTP",
            "RootIndex" : "DC5101C0CC6A7FC8E21465501E0EAEEF475BE2D1FF2E7BF6691360DACA4F9C48",
            "index" : "0001B882C3BDDF2524DA892639A16FAF4985CF19DDEC17EAAC38F6A98F1D3275"
         },
         {
            "Account" : "rEWmZFmKAPWjUoD9pPk9Y7Ut8eEpSZmnq1",
            "Balance" : "126488970",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "1BADA79B7090A31C6EC6A70993FFEF9242B249B9CB42C9251F5FEA5906B8612A",
            "PreviousTxnLgrSeq" : 35569892,
            "Sequence" : 1,
            "index" : "0001C56562C6B32EF503B9B44F65BFA0E4E990A42C8F19CBC8868071D74B4492"
         },
         {
            "Account" : "r4rL7NEbRwzNdKZApRcDP4rUV8JKrqN9tW",
            "Balance" : "20781895",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "7BB899214EB0FFDD5A677D4F391EBA46D6287CBB33052AF0C1F1BBCAF92D541D",
            "PreviousTxnLgrSeq" : 35347840,
            "Sequence" : 3,
            "index" : "0001C817A1A9EA16F3A307CECD2D274B0C402C4C96997E32C6AA047E4D3A9CCB"
         },
         {
            "Balance" : {
               "currency" : "USD",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "USD",
               "issuer" : "rNcvK17hLGoHQuPbZf1R8mAh3M31GMtgnR",
               "value" : "1000000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "USD",
               "issuer" : "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
               "value" : "0"
            },
            "LowNode" : "000000000000123F",
            "PreviousTxnID" : "72D56D94CC6CC2694E1E5EB9DA536F43E8A3FB3C1C0ED081527001D18D8D7A3C",
            "PreviousTxnLgrSeq" : 35435065,
            "index" : "0001D78EB50C60CB9708E8202C9897688363B78F8AB7AC63F66EEDA462EF453A"
         },
         {
            "Account" : "rfHzTZqckursDsc3BaVv84f9FfK81UPMVc",
            "Balance" : "78999988",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "61F7D324154F46A8846A1AE920858AC5893B81CC19C238EA038EC4A79E404B41",
            "PreviousTxnLgrSeq" : 54682342,
            "Sequence" : 2,
            "index" : "0001DAC577DD41000B500FFFCA784A88C04B00788AA210EF5AB6AB54E59DDD49"
         },
         {
            "Account" : "rwao7UjmZbBed84yhGP39W2PLH66Q7aXjb",
            "Balance" : "2481472609",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "5060666111A067C2D877D5F4982F0050903AEE439E2FB082DBBCBD8ABCA0CDEF",
            "PreviousTxnLgrSeq" : 53449904,
            "Sequence" : 1,
            "index" : "0001DD4EC36B9A34D8899ED31E4E388587154016B49FFD82128C68AE919B2BE7"
         },
         {
            "Balance" : {
               "currency" : "DSH",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "DSH",
               "issuer" : "rwrudJs8u5KatPEuGuyDnQ8R5nEQUPB7v2",
               "value" : "1000000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "DSH",
               "issuer" : "rcXY84C4g14iFp6taFXjjQGVeHqSCh9RX",
               "value" : "0"
            },
            "LowNode" : "000000000000016A",
            "PreviousTxnID" : "3FF02890077B48632D1A19744DE05E182E68C9A1A4B0B31F6E41159F512BD41B",
            "PreviousTxnLgrSeq" : 35699762,
            "index" : "0001DF3CB8196255E69A14F92EBAB9877B1F350DF7E62D64AB6587EC3ED9CA4D"
         },
         {
            "Flags" : 0,
            "Indexes" : [
               "278D58129796548AF58E23A40247F050CB3E46BAF058A44D96CBCF1F41A65357",
               "448843AF12951D5119AF6A31F67C19AAF30F9CA4A87E1913F1CE77E8A489A608",
               "4533FC4C079D626A72899A2DDF532829F8838D376C2840B642CF1C53403E8427",
               "7F38E0C8E0214AEF922B617C19156009EF3292A40C6FF52C9CB03625AC09058E",
               "8BD45AFCAFCE035932E6A176836A3E088F90B0854CCA37CAE8760DCB68A40E2A",
               "A1505359F82BE39B0A23190A6F55AFD4ADCA4990337605C74BC2622399799186",
               "B1A644AFAEACE38D9A31E212059BBDAE52184CD63938AA03A2C324201EB0B1BD",
               "B49AC5079F5E2455F141E62F72AB80F7FF9D2E6C98EF894936C01C4E491E49E3",
               "B8A780F02B1B50D9A5A43A08B000F23340F8D48966642FB1BAA2E17E28B83E58"
            ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rEAKkNt5z2HTkqS9baCGaTStHXfptPtCuF",
            "RootIndex" : "0001E959978564B75810992944B463A63B305AA6690410FA4ED790CA7AFCE45D",
            "index" : "0001E959978564B75810992944B463A63B305AA6690410FA4ED790CA7AFCE45D"
         },
         {
            "Balance" : {
               "currency" : "GCB",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "100000"
            },
            "Flags" : 1114112,
            "HighLimit" : {
               "currency" : "GCB",
               "issuer" : "rNdwi8ain5ibXNB9A7H3zzKtSxgVzAqqAe",
               "value" : "0"
            },
            "HighNode" : "00000000000001B0",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "GCB",
               "issuer" : "rNNeAHyaSgDxG8ynpnxuzaVtqp49sctxb9",
               "value" : "1000000000"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "6C6ADA3ADF20D37577BEA94CBA1871B1A030B6D63E3F594D5A9959275E97A999",
            "PreviousTxnLgrSeq" : 37721815,
            "index" : "0001E9604C5FC991A30408A78A299A58AD7DBF5A9069445A3A75D487D04DD607"
         },
         {
            "Account" : "rKbUdv2SnNbgK7t69drPNKmAAeQfs5fNVZ",
            "Balance" : "464278000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "B0DFF30B2BE30663A9BE7A8CA42FD85CF423B041CDA489FA7A18D714260D5C08",
            "PreviousTxnLgrSeq" : 35570527,
            "Sequence" : 1,
            "index" : "0001FD3112599AF2C9991E5E7E56A24268F9DC3438D525C8DA8135E9BBFB7D6A"
         },
         {
            "Account" : "rMJuG542Akwt2idVxQemfPWSKtTeSyR4QL",
            "Balance" : "20150000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "5C79FD3CA953C881C3D4BE48F2EFAC671177B8ACD37A72A38958A293B706B4C6",
            "PreviousTxnLgrSeq" : 35696409,
            "Sequence" : 3,
            "index" : "000201714F588C6F1D440EA526ED868FC48FE4F3508840D58A36D79251D7D8D9"
         },
         {
            "Flags" : 0,
            "Indexes" : [ "9D41377F1EB6E502A7107C2A35CE571506BA8DDC5E57F77AED0C4FD7C5BB6D2B" ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rGUhYCjTac2tuuUPwAJ38iajg44s4H9b3E",
            "RootIndex" : "0002043F91DC997AD832ADB3A90B2B2D762E575AFEBDE372FEE323617EB89255",
            "index" : "0002043F91DC997AD832ADB3A90B2B2D762E575AFEBDE372FEE323617EB89255"
         },
         {
            "Flags" : 0,
            "Indexes" : [
               "63309BC276156760C5BBB0E5F1238546824A861CE478C536DD8B36D6009502C6",
               "34E8966296BF24299BC9D7DC14FEFE60DB5C23C3AC8325B883D6AAE5B4FFDA92",
               "2333718F8324FAE85841B54F86B7486841335A69C4956207905CDF9A65C37D38"
            ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "r49HKrCPQUvs4en9DEUBewA3DASoVNUE4B",
            "RootIndex" : "000204CA2372F5DBB072D5CB38156EF7E67D3A584AA5B02657976DEC6D0C5B88",
            "index" : "000204CA2372F5DBB072D5CB38156EF7E67D3A584AA5B02657976DEC6D0C5B88"
         },
         {
            "Balance" : {
               "currency" : "STR",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "STR",
               "issuer" : "rUwyk5PmESWq1DCMTCTscsRb4kYVYrZw4f",
               "value" : "10000000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "STR",
               "issuer" : "rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS",
               "value" : "0"
            },
            "LowNode" : "00000000000002F4",
            "PreviousTxnID" : "9CE00B05DE793F99081996E2A322ACE374EBD6C7E6F1343AED0BADBD20DAED69",
            "PreviousTxnLgrSeq" : 29743678,
            "index" : "0002068C83B72D014453DC1415A6D30A430CA904FA78BAB33A36900F8AF645C9"
         },
         {
            "Account" : "rBuDDpdVBt57JbyfXbs8gjWvp4ScKssHzx",
            "BookDirectory" : "37AAC93D336021AE94310D0430FFA090F7137C97D473488C4A0D635441A85A45",
            "BookNode" : "0000000000000000",
            "Flags" : 0,
            "LedgerEntryType" : "Offer",
            "OwnerNode" : "000000000000025E",
            "PreviousTxnID" : "17DE3914111D63CBA7BB51B551BD4C14F9BED048B8EA142222B2C4B1CEBDA01A",
            "PreviousTxnLgrSeq" : 52563046,
            "Sequence" : 121220,
            "TakerGets" : "33170680",
            "TakerPays" : {
               "currency" : "BTC",
               "issuer" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
               "value" : "0.00125"
            },
            "index" : "0002133B26A1D5533CD791251844CE17650F2F478EE37F8564D024BA2E0A224C"
         },
         {
            "Account" : "rL45jjo6Ym2isLu5kPQrL8BctBjX2Ur4tq",
            "Balance" : "30000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 2,
            "PreviousTxnID" : "243950CFC1A4FEDCA0A62041EE6FFD4EB116E20FC20DBE816624C24609085A75",
            "PreviousTxnLgrSeq" : 38977070,
            "Sequence" : 26,
            "index" : "000215DE95AD3CE49624ABF5019E13A3D5691B5D21E3A13EDD44A8DFED3C9A85"
         },
         {
            "Account" : "rE8yruJtXACpDWyVyGSP1MLrGBzcnnfUhw",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "17E2EF85A7CAD6EE02610CDB51ADB284AB64B8C88D3B0759ABADE870597EF081",
            "PreviousTxnLgrSeq" : 47828640,
            "Sequence" : 2,
            "index" : "000217A389C05CE05D96FA5A368621F21E0431C21748800240487F1C51321CB7"
         },
         {
            "Account" : "rnoHcWx5sskoiiNMt6CSSeTfjHw7JL3RfJ",
            "Balance" : "122834669",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "2A4B34391F53C0DB49C0C2ABF39611C9EE797B2A71C128453A0A85AE629FB481",
            "PreviousTxnLgrSeq" : 35665140,
            "Sequence" : 1,
            "index" : "000218E0DB87BA2E65CB5F59CCFBAA15DAC6A2D07EDECC72DB0457C50B0F3156"
         },
         {
            "Account" : "rGuvvY7BPCRYmw83EmzYFQZ76ybdZ28DKX",
            "Balance" : "2242284331",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 1,
            "PreviousTxnID" : "F1603850E52D962CDA5A33646A13FDC44990436BC1967C1B45B5556E0CB94EE0",
            "PreviousTxnLgrSeq" : 53527645,
            "Sequence" : 7,
            "index" : "00021CD2D04E777624DC7D15AD7EDC7400375029FC11B1EEAAB187FDA0A86E07"
         },
         {
            "Balance" : {
               "currency" : "CNY",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 1179648,
            "HighLimit" : {
               "currency" : "CNY",
               "issuer" : "rPFd14EgMkmEnvtk2nzsrTfkoDmYzwpowJ",
               "value" : "2000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "CNY",
               "issuer" : "rBfVgTnsdh8ckC19RM8aVGNuMZnpwrMP6n",
               "value" : "0"
            },
            "LowNode" : "00000000000002F9",
            "PreviousTxnID" : "4352226FA79635CBA7D59E9705B1A751834EC5EC4025281DE7A6DFDC3B8CCB73",
            "PreviousTxnLgrSeq" : 24725683,
            "index" : "00021D4E6E9CE88B3DFCBC8917CDF28C7BC2792AD68FA6A269DB454CA8C0160A"
         },
         {
            "Account" : "rBFLqCBHFZCKrZVRZK1oyH5SibamM8uM49",
            "Balance" : "87782000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "EE6E0422AC888EE1C298D17EF069D6D0F937181D861BFA67D8CECB18E6A05CF6",
            "PreviousTxnLgrSeq" : 35105975,
            "Sequence" : 3,
            "index" : "00021FDEE2F788C23C3E11EBCE3657FCF560A61C365A6EFA45726C54A570579D"
         },
         {
            "Flags" : 0,
            "Indexes" : [ "6AB1BA256C26B11B0C2BC28B68CFFF9EBA1A0D7505F43F1D9D4D64A38F38A8F9" ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rUAuRre3GfGDTxdbzo7s7GArR2zhPf61Rd",
            "RootIndex" : "0002228CECB01B2B948DCF2EEE43DBF33637F27F0C6BFDAF238EF2F9E022F4E3",
            "index" : "0002228CECB01B2B948DCF2EEE43DBF33637F27F0C6BFDAF238EF2F9E022F4E3"
         },
         {
            "Account" : "rGFEpTL3rXgsHkopDNbEB3NMfNDspZ23e3",
            "Balance" : "1756380116",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "755AD6C3F0F8075B48409692AA2A336CF5B07DFE9B5B7517DBBD5D6AE79389FD",
            "PreviousTxnLgrSeq" : 53543734,
            "Sequence" : 1,
            "index" : "00022463A30DA0BB03215AC3777746D7DF2794D13A056C08C7947C1D0298A8E2"
         },
         {
            "ExchangeRate" : "54038D7EA4C68000",
            "Flags" : 0,
            "Indexes" : [ "291430753F816826020D5F119325B30E68C9B69A204E97758A84A9E2BDC0AA4C" ],
            "LedgerEntryType" : "DirectoryNode",
            "RootIndex" : "000227CD42FA0FF90ED3DF1940FE988950EC26250C6CA27554038D7EA4C68000",
            "TakerGetsCurrency" : "000000000000000000000000594B540000000000",
            "TakerGetsIssuer" : "9DE47FDE20653B82F1A116B3A82658362CC482FB",
            "TakerPaysCurrency" : "0000000000000000000000004D4C4B0000000000",
            "TakerPaysIssuer" : "9DE47FDE20653B82F1A116B3A82658362CC482FB",
            "index" : "000227CD42FA0FF90ED3DF1940FE988950EC26250C6CA27554038D7EA4C68000"
         },
         {
            "Account" : "rpd9hZKqeXJr7rNjvehBunEdQwLZRY61D5",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "D4A0C37289C478B5B9BA2AC8F93701F5ED52FDEA6429750E9019D622F1B8C9E0",
            "PreviousTxnLgrSeq" : 35222051,
            "Sequence" : 1,
            "index" : "000234B4BD11D93E4810C37F13C6A009498192E957D35FDE55E809E6FA40361F"
         },
         {
            "Balance" : {
               "currency" : "ETH",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "-0.00000000069586"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "ETH",
               "issuer" : "rs7WjWW76Dtq9bkHq98ZfvQzaANiVSW9s2",
               "value" : "1000000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "ETH",
               "issuer" : "rcA8X3TVMST1n3CJeAdGk1RdRCHii7N2h",
               "value" : "0"
            },
            "LowNode" : "0000000000000B36",
            "PreviousTxnID" : "F2ED70C5BEB1B964C344614DEBB2854033B695DEDC444793D3870746FFC4164D",
            "PreviousTxnLgrSeq" : 35823767,
            "index" : "00023646D06EF5D6BA4FDF1F5D8F23FE28D486B54F227C97702AA7A83CBCD8F3"
         },
         {
            "Account" : "rPLXMQ6KhniRFGLxXLg4YbeHmRXSP9ncBv",
            "Balance" : "2600007809796",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "AEA85201CE0D0D9062DB691AA3E05530C6B64FEC0F42D0D645622ADB9BDA558D",
            "PreviousTxnLgrSeq" : 55163667,
            "Sequence" : 15,
            "index" : "000242578431923F7E961D6D69146C0D80B936E60E094450CB7497759BC1F0B6"
         },
         {
            "Balance" : {
               "currency" : "BTC",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "BTC",
               "issuer" : "rMSY8DZpWH9sCvqq1Mg5wKGjqqicXtTNyc",
               "value" : "1000000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "BTC",
               "issuer" : "rchGBxcD1A1C2tdxF6papQYZ8kjRKMYcL",
               "value" : "0"
            },
            "LowNode" : "00000000000007CF",
            "PreviousTxnID" : "E2AB5AEE53AC746F1FDA16AE068E0C39752114E6676DF16E7C2B4A97AE2C9091",
            "PreviousTxnLgrSeq" : 34906009,
            "index" : "00024ECF15C95740AF5FA04C3DD341E8F05B7A069224407F9AF9C59FAEF723E3"
         },
         {
            "Balance" : {
               "currency" : "JPY",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 1114112,
            "HighLimit" : {
               "currency" : "JPY",
               "issuer" : "rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS",
               "value" : "0"
            },
            "HighNode" : "0000000000000367",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "JPY",
               "issuer" : "rf8RiHHJvDosckVtsmZ3SGxYcuduUJ7gus",
               "value" : "10000000000"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "4236B9703C0FA5C1DE1FF8A0316E915477F4ED1300A39C96F5C1D383C5CDCED3",
            "PreviousTxnLgrSeq" : 30038128,
            "index" : "00024F52A82AAD1D2B49549BC2C737BE101F662E4F55F01868F56CE6076C0228"
         },
         {
            "Account" : "rpSHB1VsKFKBx4VjmHH8V4SVdbPYdowAkE",
            "Balance" : "1136037689",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "08C5DADC959F085A22ABBE4CCB5CD8BC361C4854578F1CD9446502A433E563FA",
            "PreviousTxnLgrSeq" : 55609692,
            "Sequence" : 55609692,
            "index" : "00025455DA641B87A2EBE0C1F02F4E17A07CF1D97B708A20DEE7C4EEC25EBBE3"
         },
         {
            "Account" : "rpaD3HhpVPSUj4k9xerLN3nj7CkZ6AwYv3",
            "Balance" : "1685711002969",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "416A1EAFA3EFEF7F27FF4E5E374CA4D4786ACB507522137E5E560289D740F6A6",
            "PreviousTxnLgrSeq" : 55164077,
            "Sequence" : 1,
            "index" : "00025908A8FD8967A049FACB5181AE8F14C1840215B6BDE5063342136597BFA0"
         },
         {
            "Account" : "rUw4QkuMot2GSTfGmu8uAt989f4KsAjcmK",
            "Balance" : "1384845450",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "FD68277F820799FC5A8E58A5EECD4D5AD6BCB42688286E3D4AE6D136EE9C2272",
            "PreviousTxnLgrSeq" : 53528319,
            "Sequence" : 1,
            "index" : "00025CFEF306B3FA99C5000F530F3D967F07B3414C313725F7D9E2DC6FB30412"
         },
         {
            "Account" : "rB4ZqDWBW1SjzbBenKSnsqC7YuPsMCJ1mB",
            "Balance" : "113107120977",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 32,
            "PreviousTxnID" : "F620D678A5578D144292CE94F3B841EB24DBAFFC68D19735272E102E775CC71F",
            "PreviousTxnLgrSeq" : 56852695,
            "Sequence" : 1623,
            "index" : "00026278BB9B84D65F8872C506EBDD4BE182FD31B9930E5D6C327B554006C7CA"
         },
         {
            "Account" : "rB7FbVaugiT9x2tNdUTpMPLB6uEbrzzHDg",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "3473F370144C61BDAFC6340A7AEB41D23274D12542B2CFC82B77E3ABD0E549D9",
            "PreviousTxnLgrSeq" : 56066464,
            "Sequence" : 24,
            "index" : "000263EEFD18A648F716C7201F7E8D9FD53E8157EED200F6B8AADADCA7644B48"
         },
         {
            "Account" : "rJnpxaXdu8WbeYwj1z4s6sYz7uGq5GC1NF",
            "Balance" : "3281565997",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "449E8D4ED990941940FAB231FC916487A81E61491D55A1EC7AFF83D29398CF4D",
            "PreviousTxnLgrSeq" : 55175689,
            "Sequence" : 1,
            "index" : "000264109B71F26AC0C274FD4D2BBDFCC6AA5E4817066C9264FEB606F9746EF8"
         },
         {
            "Account" : "rJkCKqwncDrbDNxgf3QFB6UWUCe5tD2vzs",
            "Balance" : "47451988",
            "Flags" : 65536,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "09B698D2A9369B708325CAC986B4F13BAFC6AEBCED89455A100FCB98E66D87CC",
            "PreviousTxnLgrSeq" : 44981172,
            "RegularKey" : "rncMr3zTqsfGuwiC4goKM6Br7YGmuUy358",
            "Sequence" : 2,
            "index" : "000267A0E4D9EB87145C89BC8352EA105BBFAD618F6AEF637A947E53129E6E83"
         },
         {
            "Balance" : {
               "currency" : "JPY",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "JPY",
               "issuer" : "r4iPSVbRZosUDeuQg7obweH8DgCYvg947o",
               "value" : "1000000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "JPY",
               "issuer" : "rEYD5k6kZPARQbKfB9GpiNPDY93kRQgPKj",
               "value" : "0"
            },
            "LowNode" : "0000000000000008",
            "PreviousTxnID" : "7516F9BC3E8055CCE7F727A29F1FD48E9F9925BB91B62129D1D00B8502DDB4DB",
            "PreviousTxnLgrSeq" : 11378470,
            "index" : "00026AE25E921ACDE0861F983DAAD7852553F53454C69A6113DC8F6A994F19F6"
         },
         {
            "Account" : "raHV45pVDiRUdeGBJNhFSH5heTuebjtzoY",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "EF368FA8D09BC9D278CA7A55F5E2BCCA674C00F7DCDA35CB0565618BB9ED3E6E",
            "PreviousTxnLgrSeq" : 48264559,
            "Sequence" : 2,
            "index" : "00026D54B2F877AD05FB5639DBE2041007B4D6D8613B5301AAB291CED182494A"
         },
         {
            "Balance" : {
               "currency" : "BTC",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "-0.0097"
            },
            "Flags" : 3276800,
            "HighLimit" : {
               "currency" : "BTC",
               "issuer" : "rDvmLrFhAHRxaVmmeppZKzjfzM9RZ7W7m7",
               "value" : "1000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "BTC",
               "issuer" : "rhKgFxe7Mp38yeJzvwoNLm46RxMdXotTn6",
               "value" : "0"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "3E8D2DADF8C4FBA09D117F772F144D982F46D8FC6F050FDDA93DD0066F5ADB09",
            "PreviousTxnLgrSeq" : 35240943,
            "index" : "00026E9C64E0BEF3F562EFE4D13B62BA3284FD7FB09395A936591C0F23D607DA"
         },
         {
            "Account" : "rs7Ne13j2FCJtMS5UZmsYfHV9KBSTyan7w",
            "Balance" : "20023065",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "3F9D327F292D8244735721EE8F9CCB5565306270DF8BF4F642BAFA0C06F12742",
            "PreviousTxnLgrSeq" : 36968533,
            "Sequence" : 11,
            "index" : "0002701E7145F0FCADF2EBC24DFE242C5BB868A5CDCC50A7EDB21F7433E1C3C5"
         },
         {
            "Account" : "rHETEQaUhP6KBLDbQ7jdvytEfLDN5XzviD",
            "Balance" : "44992103",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 4,
            "PreviousTxnID" : "EE896EC16D9017697EDADC0E676F63D4E5855C682BE94A5C2E5A535DB96A2180",
            "PreviousTxnLgrSeq" : 37313330,
            "Sequence" : 33,
            "index" : "00027632FBDE4927164EF1AAE745EDFFDD3B820809464BADEFC18E08FEF42055"
         },
         {
            "Account" : "rKk3VeQP8oUq1Y6J8WxARUFATRoFZn6gz1",
            "Balance" : "20150000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "35F4770B3559A62731ED680C0D8B53C8A58F8994D123AEF43DBE3D66075F22F6",
            "PreviousTxnLgrSeq" : 28960817,
            "Sequence" : 2,
            "index" : "00027ED9E4526B75B2CE0CF80E41EE0011C39589401E717AA700CC692E21D543"
         },
         {
            "Account" : "rGyMFQRn5HtdC2eFoK4n98uc4QeMddiZoF",
            "Balance" : "238529992773",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "FA7FE32E7D86A19D88F79F926AA5A44AEFFCC55C26B07D7BA631D9D9B7B56BE3",
            "PreviousTxnLgrSeq" : 55174593,
            "Sequence" : 2,
            "index" : "000280047BACA5D00427677365D9559F3FAF9027E4FFE69452DD0DD577B44942"
         },
         {
            "Account" : "rnmYfkS85KmV9p4Le7cJC6JjJcysL8Y5bw",
            "Balance" : "25020000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "0F5503095AC7D78B6AD2E8B7C4A0A946C4DA0273C433E8AE8F3FD4D55F68DAC1",
            "PreviousTxnLgrSeq" : 56406521,
            "Sequence" : 7,
            "index" : "000285A460C476F5AD35C6D837EAD4F2CC09D7E8A43F07D77AD8B72204372903"
         },
         {
            "Account" : "rfRnmsbfku4S2nCrPXKFtKsNVE2feYW9Kv",
            "Balance" : "739809000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "8F9C0CBD3E6DCC535B67760BE2C4AB4E96CA855DA763A352E2A5882D5AFB7FC4",
            "PreviousTxnLgrSeq" : 35491168,
            "Sequence" : 1,
            "index" : "0002886C2182362FA2ADBF0794354385F120D4F90316D408DDA1BE254C08F340"
         },
         {
            "ExchangeRate" : "55038D7EA4C68000",
            "Flags" : 0,
            "Indexes" : [ "14472F3D7E46A79BC424FE22782DA8152B3346F240D76B03F17C06C21C56005F" ],
            "LedgerEntryType" : "DirectoryNode",
            "RootIndex" : "00028C6812AF7B7043E8D146563C740614D1293A952026F555038D7EA4C68000",
            "TakerGetsCurrency" : "0000000000000000000000005553440000000000",
            "TakerGetsIssuer" : "A2F38D1722E33796F5880141A8F6318BC91F27C2",
            "TakerPaysCurrency" : "0000000000000000000000005553440000000000",
            "TakerPaysIssuer" : "0B233D3B2EBDC4F12A251C29AF26323EA0864CE9",
            "index" : "00028C6812AF7B7043E8D146563C740614D1293A952026F555038D7EA4C68000"
         },
         {
            "Flags" : 0,
            "Indexes" : [
               "1A319AE7B7FBA78BE7D021AC01C781A842BAAD4BF558A7F709C86A05F1607F8A",
               "5FD00AB6D78C5F742B00E02A8B3A5D47A9642D0FF3143438BA4B9F7FB93898A7",
               "915A2E1823AF08F32A7803BF7B7AF43D2C3EB77CA05F56951304C6D7E974A7FE"
            ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rBcwbD6PTsoveJLT2RLwiKwNBvubWEqB23",
            "RootIndex" : "00028D42EF0C344205C82444A6F67E9875E6CFAB5B9210B6D70ED6AEB16E6CE8",
            "index" : "00028D42EF0C344205C82444A6F67E9875E6CFAB5B9210B6D70ED6AEB16E6CE8"
         },
         {
            "Account" : "rMCuL9Sce7QiJHosT3kkGaF6ySntfVp2Gj",
            "Balance" : "19999990",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "02AF004961D61E2CD1F0BF84C5F31D47EC13086FFE5D51EE8C59842DC1C325A3",
            "PreviousTxnLgrSeq" : 35880386,
            "Sequence" : 5,
            "index" : "00028F39C354A66DD4994A4CD7AB8A91E32452E5039898CCC134FFA61DD0025E"
         },
         {
            "Flags" : 0,
            "Indexes" : [
               "0BA71FA44920D017FC27956BCADE84B103CA8BA11B835BB6ED911A3FABA549A4",
               "80461BDED64B13994E9318F3143BF436C256E81A9B574FE0D511602CA3466E33"
            ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rMqgMdQm1hDh7ZUAWz4AzASi1vg2GMRY4G",
            "RootIndex" : "0002999EEC715951639874C60F2D4F6B28E29CF6432008EF86DEB988CA8AADF6",
            "index" : "0002999EEC715951639874C60F2D4F6B28E29CF6432008EF86DEB988CA8AADF6"
         },
         {
            "Account" : "rPDu1wk2vmLHdCrztVrn4yNMTNeme75Mmk",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "CBDB3EE7253A4E47CAE1BA3FDBA062C364ED4E7FF9686F558E2598E9B19589F6",
            "PreviousTxnLgrSeq" : 47865012,
            "Sequence" : 2,
            "index" : "00029D9DDBE35894846ADEF13949EE95AD3FBD4B749BB800B6508A82160706D2"
         },
         {
            "Account" : "rNFYBtTaywSA2PmjpZSXJ6by1Bh5MjAnj6",
            "Balance" : "1258667366",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "D5944A2C279AAF2749D4F7658ACEBAD24252393B1BD108D51A4572943D88B17E",
            "PreviousTxnLgrSeq" : 53527042,
            "Sequence" : 1,
            "index" : "0002A3F34A62A3FCED5E3DE2AF5012A2B33AB8EC411028E4310947A4BADC6F9E"
         },
         {
            "Account" : "rU51UCvkbJDsjXsE9PmB59TCm5ZjSW6ZPy",
            "Balance" : "10000000811",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "1C916B192126CB9D8524DBF7DD77325EFACE96BF282BF0877F0C22D4BB9BF4D9",
            "PreviousTxnLgrSeq" : 55180029,
            "Sequence" : 1,
            "index" : "0002A590029B53BE7857EFF9985F770EC792CE483720EB5E963C4D6A607D43E0"
         },
         {
            "Account" : "rHW2anzZMwGF6jB3Qe2KJHVvdNp83u8zUB",
            "Balance" : "19988000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "D83E336EBA2F2768A8FCC7A7C9F93CD3145861C5FC89828122006DAFB0DDED38",
            "PreviousTxnLgrSeq" : 18595284,
            "Sequence" : 2,
            "index" : "0002A98F9BA1CB7F71BBD170DE366EB64B818B05CE714C611DCB1B501C5834B9"
         },
         {
            "Account" : "raGNVgTN4vmi8FyNh75ydzJAbeuXjytDA2",
            "Balance" : "476318366",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "FE70E402404608A3E77B23AC61A8652C448EF08AE2DD110C0FCEA8E7BAB8D1A6",
            "PreviousTxnLgrSeq" : 35179921,
            "Sequence" : 1,
            "index" : "0002AD9E073BE86B8D78BE3D6B417F41CB37C5782D05E6859BB57E709543E283"
         },
         {
            "Account" : "r9scREW2BqzWc5EHDPURFXmc2nbE3zk27o",
            "Balance" : "25981483",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 1,
            "PreviousTxnID" : "031F8EB959C780E160DE06921338275E85B3F6CF963DB9BDF6C0C30279CAECF4",
            "PreviousTxnLgrSeq" : 45548830,
            "Sequence" : 9,
            "index" : "0002AE9D14EAF79B4C4928D622CEAF7C192B79682C091E373466E7B4948C3F82"
         },
         {
            "Account" : "rHgmYFSPe4PmHAAxLmXT8gHTHdAkyC8qux",
            "Balance" : "37353357",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 2,
            "PreviousTxnID" : "4F91EB7706212FF41734E3DBB3AAD1107DFFDB1C168EF2C588D5762FCB28B6E4",
            "PreviousTxnLgrSeq" : 36055617,
            "Sequence" : 5,
            "index" : "0002B0BB1E2050F8E9A46A9E8EA28D9602B1439219ABA1932ED251CDA00DCB4A"
         },
         {
            "Account" : "rEMZkiyzyK4ujMEqkcA6RQz8kjjt2Lo85s",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "87F590598CCC90C920C76AB3799867BE73551358852B955A54383EB899BF81E6",
            "PreviousTxnLgrSeq" : 56862164,
            "Sequence" : 56822595,
            "index" : "0002B53E6EFB0DA9EAA4AED495AD95238848042571240D89255AECBD5FBA4451"
         },
         {
            "Account" : "rJ9ocS5wWL93D4nPDPypAmvpvDJaDmNKzy",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "EB19B4DFBAE06FBB920BEADCCDCAE0DE655249A14698D9985F97D5AC2AD52C89",
            "PreviousTxnLgrSeq" : 48079546,
            "Sequence" : 3,
            "index" : "0002BDBDBD34EFAF974F5439F222439CE9F23F80446E9B252C4424543CB42F67"
         },
         {
            "Account" : "rseH6yDsetznMcuUg4uVhTjQPJc9BE4bpQ",
            "Balance" : "20042739",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "59F89927C1B8F3BB5880902EAC796CBE2FFF44C3CDC8E3CDD66A5E9F962966A3",
            "PreviousTxnLgrSeq" : 56775842,
            "Sequence" : 55769928,
            "index" : "0002C6425429A29A0BA566F93145BFBEABFCDE6A7E2AA81E2D0823D8F6E12303"
         },
         {
            "Account" : "rwkEbDdopDS13yADjPNmAnsB4yJvdZyB6s",
            "Balance" : "340570301",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 1,
            "PreviousTxnID" : "8401A5E0142CBE0F3EE3DFFD92C86065FF00EAF189AC7F0466384B64AA45BA2A",
            "PreviousTxnLgrSeq" : 35533603,
            "Sequence" : 7,
            "index" : "0002CA03B25A44145348CDEE8FA9677C40AB515E9ADB9310562F742B0471453A"
         },
         {
            "Flags" : 0,
            "Indexes" : [
               "3C7ECA3343757CF715F41334F4DB668B3FDCC40F4BC4254FBE0400555DCE72D4",
               "537FB843F8AB0749B4D27028B76D2E80D02B5479102EC43F92486C5D7AE75907",
               "6BFED756A60D16582D4132B29E07B087FBFCC2210295CAA6AA11238BC13EA785",
               "F65B5293422BD30522CED800B6D14D9A79DE5698412134FCD5CB276512A1ADDE"
            ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "r8RwFcEDnhCJATxjEjVAjQ1QszVsHD2Hn",
            "RootIndex" : "0002CD31E83DF6281A9A8D7481D5FCFCA5003E57CDA551FF0B99ED6E34E71840",
            "index" : "0002CD31E83DF6281A9A8D7481D5FCFCA5003E57CDA551FF0B99ED6E34E71840"
         },
         {
            "Balance" : {
               "currency" : "EUR",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "EUR",
               "issuer" : "rJ6m73X94YvJxXJRMU2WXQx5s1G3woTAx7",
               "value" : "1000000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "EUR",
               "issuer" : "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
               "value" : "0"
            },
            "LowNode" : "0000000000001B92",
            "PreviousTxnID" : "00CFA69736975A56B4EA193D9207304E077C53F3EFA6C3AA024A8B2974225016",
            "PreviousTxnLgrSeq" : 51640267,
            "index" : "0002CD3BA78E323561C904095C2EDDD0EAE58682C251C3AB249EFB9750E92C8F"
         },
         {
            "Account" : "rKyK3pQtCTMz6nt6Yxtx8vgju6hLyLWpwh",
            "Balance" : "1000000289",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "C0F561FB05A808EE51101B4D451F676224FCD18500049054BABB96DEB07D4C35",
            "PreviousTxnLgrSeq" : 53531363,
            "Sequence" : 1,
            "index" : "0002D81201E576CF3E0120E2CC35C03E08E22452F498B8C874CD1DF9D3DC305B"
         },
         {
            "Balance" : {
               "currency" : "CNY",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0.879917248308"
            },
            "Flags" : 1114112,
            "HighLimit" : {
               "currency" : "CNY",
               "issuer" : "rPT74sUcTBTQhkHVD54WGncoqXEAMYbmH7",
               "value" : "0"
            },
            "HighNode" : "0000000000000178",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "CNY",
               "issuer" : "rGestQBBx9LzvB84EuT4fXLMGJwobM4hf8",
               "value" : "100000000"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "FC708BDFC90FFF03350A3D8DA999382F7D26C23C9E506E21EE85988BAA713868",
            "PreviousTxnLgrSeq" : 46748120,
            "index" : "0002DBB4B998AC5B154C44CF6D09AFC56F1EF7AF932F3F8639148F603849E287"
         },
         {
            "Account" : "rKcA2BEGo1F9FgjxZCpYKXCPdoRgs6HfEx",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "EED2AEB0E8CC724DB3993DC7A4AA39CE45D3EBAA14FF3191833522C3C51ECF0A",
            "PreviousTxnLgrSeq" : 35775598,
            "Sequence" : 3,
            "index" : "0002DC77014AC99A1EE11FC396FE3EC53114075916DB1CA19B6D00FAB2054279"
         },
         {
            "Account" : "rnFzegAparFPG2iT3ZjNLyJCJgTaTGTAze",
            "Balance" : "44977500",
            "Flags" : 1179648,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 5,
            "PreviousTxnID" : "87E952D70F677E01F7BDE997B56CBED3B03B089F983AA4E8B5510A9A4E993818",
            "PreviousTxnLgrSeq" : 44630608,
            "Sequence" : 4,
            "index" : "0002E13AA676C29F39CA24FCE64D649E41EAD3878674E38F15AC2E8A2C62F7C6"
         },
         {
            "Balance" : {
               "currency" : "EUR",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 1114112,
            "HighLimit" : {
               "currency" : "EUR",
               "issuer" : "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
               "value" : "0"
            },
            "HighNode" : "0000000000000B2B",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "EUR",
               "issuer" : "rsrqGKug9zri8a6v1ntrxG1iY29jc17eaW",
               "value" : "1000000000"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "62A36774CBBB4C81A0DFDED7DE937B94C9FED2F1E851FDFE813CAEEB203A6745",
            "PreviousTxnLgrSeq" : 33856831,
            "index" : "0002E2F1FD488A0EE9D03253761F144EC0DA33AE3C4191D257B5B11DA3FD85C6"
         },
         {
            "Account" : "rEJPTXe1N961YD9cGmsmgwMpZmbz26Yave",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "84F8284D4F9C04C3B597C988A09D2EE3429C11432850FA2C6B5174606F47AD2A",
            "PreviousTxnLgrSeq" : 45560553,
            "Sequence" : 4,
            "index" : "0002E40161CF611D05E5E3955ECF602A0CB24B15AC0D34452342564F1ACE8746"
         },
         {
            "Flags" : 0,
            "IndexNext" : "00000000000004CB",
            "IndexPrevious" : "00000000000004C9",
            "Indexes" : [
               "E8C9A4D4FC68E8907135B58F79CB7C9A226354E8763E3366DED150ED31B00A3E",
               "C76498C69D0DA394320DCD231221BFE68DAA799FC83C39BA077535B1C1C64357",
               "A8CF9F1AD796E54FEE58B3325606D629123C27A47D7DC62D3FF9D7EC050FA379",
               "8CCC845672D85DC8409187B6AF07178726852F123C9778B41BE1F725B7D52E85",
               "67DEE30B11DF75D230355AF0F62232B2C3FC741446BD58EDAE8B8E948F10A98C",
               "6CD1B5E38F1E830B178C8539632E1AB649A3AE96D308FD54670AABBC261C2D8D",
               "90015E42BE4342D74C7263CE40B04B19477CA51241DCF5C7EB76C462C1A8A11C",
               "DC23BEE432638C1B2F64DBAE2BAE0178FD16FEEF4B60FB4DC06D89FD9925F043",
               "CAC174B9408518428BAE74A9845581F66CB3E7073C2C34033DFA075B0BADD594",
               "7009D3F91AC4E64B37AFAA5B9FB76AB370E6F9758F99A4BB0167233403F06925",
               "B78CB3A31755211BCC3325B6462A20AD4E6BECE76E788DE8487E6560C364FAFB",
               "12D2F7522CA12F07533987A3C3F79FE62DF285C7D3AAC8886CD9EF05D2EA3310",
               "9FDD34BCDB121570A911E6E318E869FDA3311226F19DC848E9B21926993B3B7A",
               "EFD8D41B49D6503256FA072C3C2B6432C67BCEBF2A66E186EA5ADAB618E84F69",
               "F26F2F1712EE21B75179B4BAB05ACDB28C0C60146ACA1832D738F9FFD8C21495",
               "DB9683C7760AC03A768B3E3E123C315337D3E8C91247BB1AFA2E9BB395B73891",
               "03D2F3700BE5F072967C1AB29ABA0F010E05B938BD08DA8985EAA707EB0ACE34",
               "4431EB0B4C6E133656F48955FE5A0C6954477C665289B0BAED4AC8202781BA77",
               "59956DA4F14C2F71C1ECF70923828616E9285F11CCAC5B7ABD45A3902167C18B",
               "CA5C95DEFE1939A958A673F59844F013C7B46DE6CCE474E3F50FE4C2FCE480DB",
               "E03D2B6D8F58E4B518264FC3E91C806599709F339D141ED3D03D765C7AEA6B0F"
            ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rchGBxcD1A1C2tdxF6papQYZ8kjRKMYcL",
            "RootIndex" : "AC7D605DC4B0E09BB9BA05DF47C1D6CFC01688603B14D86BB0E3896B910EF4B4",
            "index" : "0002EA7BA21C8D8226C854BDB74D687C237CEF8746F3DC932A559F9C2064F8D7"
         },
         {
            "Flags" : 0,
            "LedgerEntryType" : "SignerList",
            "OwnerNode" : "0000000000000000",
            "PreviousTxnID" : "F1A41B304E232A9E3C9D598D07E6937B9EF6C1EE9578A7C083983D1A2B90FAB2",
            "PreviousTxnLgrSeq" : 35126701,
            "SignerEntries" : [
               {
                  "SignerEntry" : {
                     "Account" : "rfPN64wTKpvoEcGXbzaSFwTeJvGgkFwTuY",
                     "SignerWeight" : 1
                  }
               },
               {
                  "SignerEntry" : {
                     "Account" : "rJ5LGeJ3AXgtyUaBj9Nv9LTfSLnD5S5M68",
                     "SignerWeight" : 1
                  }
               },
               {
                  "SignerEntry" : {
                     "Account" : "rKZJjkstK1pRQzk8s7UiaX7Ubo6Z3TVNVD",
                     "SignerWeight" : 1
                  }
               }
            ],
            "SignerListID" : 0,
            "SignerQuorum" : 2,
            "index" : "0002EB7A73AF53419F135C2E732BC70774B84D1235E96AE5F2D4481FD2EB079E"
         },
         {
            "Account" : "rM3swPFaTfwJJuUaGQ8hnA5koULsewx8u1",
            "Balance" : "19978733",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 2,
            "PreviousTxnID" : "3F89A76079746F3EDC49577DE020781A65BC3289122B2F5358F22C8BA27A7D9E",
            "PreviousTxnLgrSeq" : 35582012,
            "Sequence" : 9,
            "index" : "0002F175C2C7472A08F2B030E656B5C6F114A5CA3F00290802C2E16F7D60541B"
         },
         {
            "Flags" : 0,
            "Indexes" : [ "A1DF1B804F052A8831B39E1F6B6B1DE5F4E78C0E33863570E3C665D35C4B9C0B" ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rU5whLGPpEmntcqTwQaLS4nsnrHe85ozM1",
            "RootIndex" : "0002FC2F23C62F316FE8823101479F16BA154E6F2FA798A31C3CFC17072E24B2",
            "index" : "0002FC2F23C62F316FE8823101479F16BA154E6F2FA798A31C3CFC17072E24B2"
         },
         {
            "Balance" : {
               "currency" : "USD",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "-2.939007646409247"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "USD",
               "issuer" : "rn4P59E8AryXfuWyTcP5PkUC8fVDjvLN5f",
               "value" : "1000000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "USD",
               "issuer" : "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
               "value" : "0"
            },
            "LowNode" : "00000000000007A8",
            "PreviousTxnID" : "6047EC41BA9E306F7AB111ED174FEDFAFE85B3E2C22409A0B934252C5C94DB28",
            "PreviousTxnLgrSeq" : 32218908,
            "index" : "0002FF5B1CA1E2C54BCF1E547A8EDAF9A21E4488D88338A7FCBA5D8B5AADAD7E"
         },
         {
            "Account" : "r99ooocgKebimq2QGsQ91zE1haNkMtDhSL",
            "Balance" : "20944251",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 1,
            "PreviousTxnID" : "D93515E7915B3090014A11424F2B04F10DC8FFD3BC32D8E5732BBE7DD80DF51F",
            "PreviousTxnLgrSeq" : 35406923,
            "Sequence" : 5,
            "index" : "000300F1A67DDDF180F2F5FBB4842DE5236307886D2C38188C1407EEA9AE4745"
         },
         {
            "Account" : "rskLVNC3mG17QRroaoppv6Edf8joEorHFT",
            "Balance" : "19999988",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 1,
            "PreviousTxnID" : "3DAF88BE77786AA0AB4D5B19844B88EB181CEDF58E1DA20A198740F7BC0FA024",
            "PreviousTxnLgrSeq" : 40120274,
            "Sequence" : 2,
            "index" : "0003015678A1517A89526AA29CBB8A8BC257FF6622D88557DA658E3411F21B3B"
         },
         {
            "Balance" : {
               "currency" : "XNF",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "5"
            },
            "Flags" : 1114112,
            "HighLimit" : {
               "currency" : "XNF",
               "issuer" : "rPKSvQ1qFAksr7hzk2wC2xtqSqFbxP3wvg",
               "value" : "0"
            },
            "HighNode" : "0000000000000006",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "XNF",
               "issuer" : "rngKfjktN2ULxQrsdbsCvU8CKRA1cevHNP",
               "value" : "500"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "05C99D17CE9575782E6B74151CEEF53A6D693A8AC5F27300B491916219FFAB61",
            "PreviousTxnLgrSeq" : 4479312,
            "index" : "0003072319EEE0498F96A9476F71B6471B1B7F950851E3DFCF9420C1F5298BD3"
         },
         {
            "Account" : "rGXfiCLX166omuSmZbms2ZoMYNBRzvHP8z",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "1A13C53D96A4D339F5BCCFC198D0C5D0C4886BF85D50CDAB3D63E0308CEA9D31",
            "PreviousTxnLgrSeq" : 56480801,
            "Sequence" : 55816494,
            "index" : "0003079A869E1823BDE38CBB99D56BF929EAB01BA290B3E32473221EF02E1466"
         },
         {
            "Balance" : {
               "currency" : "STR",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 131072,
            "HighLimit" : {
               "currency" : "STR",
               "issuer" : "rHCYrkbmxBwMKD6JjVAZBCcuDCPDMjxCB4",
               "value" : "1000000001"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "STR",
               "issuer" : "rsP3mgGb2tcYUrxiLFiHJiQXhsziegtwBc",
               "value" : "0"
            },
            "LowNode" : "000000000000007B",
            "PreviousTxnID" : "7F0F38E7CC1A000F378E1EE9CD42D2C1B98702A269F93359A823FDCD801FD42D",
            "PreviousTxnLgrSeq" : 10178957,
            "index" : "00030A41AA99869C6DBD24DCF0C91A1FD6AD63EAE7820CE92165D025F1EC5B93"
         },
         {
            "Account" : "rN2TMeaxGAGHDsUD2Qaf2CtkPtraKmsvaC",
            "Balance" : "19993287",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "2243B0A351E5778480EDFD2627135B2D33763EDF67D1037A8950A50076D59B2F",
            "PreviousTxnLgrSeq" : 33384428,
            "Sequence" : 6,
            "index" : "00030A5B5C54753400E0FB69A7A376DA8EC245D6942069A3E56CEC3276B0D902"
         },
         {
            "Account" : "rLnnTEpzwrcBj2Zpd33Dsq77iutzSvjNzo",
            "Balance" : "214124738",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 2,
            "PreviousTxnID" : "0EDB7A78F89202267DF062A0DEF0DC9B285774D65053D599DD2FFAF088BE4A83",
            "PreviousTxnLgrSeq" : 28757580,
            "Sequence" : 69,
            "index" : "000311FDE6DA20683ECA81978A6E5C617C38E2836105405FF4129285D506B9C3"
         },
         {
            "Balance" : {
               "currency" : "JPY",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0.3369568318"
            },
            "Flags" : 1114112,
            "HighLimit" : {
               "currency" : "JPY",
               "issuer" : "r94s8px6kSw1uZ1MV98dhSRTvc6VMPoPcN",
               "value" : "0"
            },
            "HighNode" : "00000000000000A3",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "JPY",
               "issuer" : "rfYQMgj3g3Qp8VLoZNvvU35mEuuJC8nCmY",
               "value" : "1000000000"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "06FC7DE374089D50F81AAE13E7BBF3D0E694769331E14F55351B38D0148018EA",
            "PreviousTxnLgrSeq" : 32253063,
            "index" : "000319BAE0A618A7D3BB492F17E98E5D92EA0C6458AFEBED44206B5B4798A840"
         },
         {
            "Flags" : 0,
            "Indexes" : [ "0F6870E7A353A08AE5B4C3BD1CEE6970F453F8A4B3D18B91C4C95838A56EA75F" ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rhkXLsw9GevBLKy6wHTjFYBb3Ym8y3gqGn",
            "RootIndex" : "0003224EF471E4E409840399C5265A20B1A83F8882623974043284461455AA7F",
            "index" : "0003224EF471E4E409840399C5265A20B1A83F8882623974043284461455AA7F"
         },
         {
            "Account" : "rshcmLugYnNfo4LZz11P6p1tHVvKm8exwt",
            "Balance" : "19998149",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 1,
            "PreviousTxnID" : "032FF7D8A3E7B7981A380430C4130304155F8DC5B0D6D7AF2AE9BCEA96043C34",
            "PreviousTxnLgrSeq" : 35909240,
            "Sequence" : 21,
            "index" : "00032BDB9B745EFCAF7E3DB11BA75D05A8286A2AC7EF4AC61F43A72AEB0D504C"
         },
         {
            "Account" : "rUTx5eW837RS2ev1uSzKbAMoiTyeUNJKjR",
            "Balance" : "67766079",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "E3465D18EB0E072F92E918DC43EBDEE2DE991FE6C3C8D99DFD5BC3C34AC7D938",
            "PreviousTxnLgrSeq" : 45158420,
            "Sequence" : 6,
            "index" : "00033122E0DDE1FC1F96F3749A4B05E1DE3743F38CDC6915D9A5524B28A2D423"
         },
         {
            "Account" : "rUXmrQadHNnW5TPKzZiZB2ufVZnLAYRXF1",
            "Balance" : "325818483",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 1,
            "PreviousTxnID" : "AFD43F421282EC80911D6C7893425D6A4502BDD4D2C0682CFB28EE9AB45AFD8F",
            "PreviousTxnLgrSeq" : 41689452,
            "Sequence" : 53,
            "index" : "000333CDAF9C498EF3E726F426B9D953488624B318AF755C6498735CD8855A62"
         },
         {
            "Account" : "rfFMmbCCRSWwArbhfeKGhufZuGRbW2BhW4",
            "Balance" : "125998750000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "261AA7D6FCED1FADD956FC63C72DB2AAB5E8305EA9896D7160D55431DEF6CF61",
            "PreviousTxnLgrSeq" : 56212007,
            "Sequence" : 55935184,
            "index" : "000336C16900E4633CDE390D57C285B5D831842F403900B2B4F65EC56FE17F2C"
         },
         {
            "Account" : "rPyKE3f9VmYFZt1kNWRYrU8NkGWPoJPSoy",
            "Balance" : "20840074",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "D502895B5F48CF00B6D4661F278CEE3B39BBFF1143D8DE6A060E9B8EC31C1F3F",
            "PreviousTxnLgrSeq" : 51806631,
            "Sequence" : 55,
            "index" : "00034DBDAB31C00B376D6A4B33C5F61A50CBDC1446E64C5E125EFBFE1FBB191D"
         },
         {
            "Flags" : 0,
            "Indexes" : [ "081342A0AB45459A54D8E4FA1842339A102680216CF9A152BCE4F4CE467D8246" ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rh6kN9s7spSb3vdv6H8ZGYzsddSLeEUGmc",
            "RootIndex" : "000360186E008422E06B72D5B275E29EE3BE9D87A370F424E0E7BF613C465909",
            "index" : "000360186E008422E06B72D5B275E29EE3BE9D87A370F424E0E7BF613C465909"
         },
         {
            "Account" : "rL98jaU74YA8ApTTKbkMhtDSvcNfiwUcrp",
            "Balance" : "20778948",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "57B6A618645E8B93BAA41AA74E56D7AE985428EE490EC9EAA6C4BAD9F39D4961",
            "PreviousTxnLgrSeq" : 39541514,
            "Sequence" : 2,
            "index" : "0003670FB502C9F2C9CF7294F92B0538B4333E9DDF12D65E36D2F65279086066"
         },
         {
            "Balance" : {
               "currency" : "USD",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "USD",
               "issuer" : "r3dSfgL1c19ckULHUfZpAxHWkwCjWfFhZW",
               "value" : "1000000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "USD",
               "issuer" : "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
               "value" : "0"
            },
            "LowNode" : "000000000000125F",
            "PreviousTxnID" : "EFB3C219A768237D668A7B7B50EB21CDFA3034E70AFBCD4A9338E6CD8F3C4F9E",
            "PreviousTxnLgrSeq" : 35441502,
            "index" : "0003758269F37C061C180B0582EE30F961E3AB9D44E1BC0020B81091ADE999C8"
         },
         {
            "Account" : "rP3mqGi5PYN22WUf1Fo8K7ncUntWL5rtHS",
            "Balance" : "87847269",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "DD15C6074AA46CD8EFAEB0BEF4FF9C8C4B3187E46E89B314EB880808EDD38746",
            "PreviousTxnLgrSeq" : 35798376,
            "Sequence" : 1,
            "index" : "00037AC83282ACE26F066DE2D607300E47D4A62E157CD469E1FE748A4B009F31"
         },
         {
            "Account" : "rfUvH5v84ytdn23UwXWZvV7SNuH2dgv3v8",
            "Balance" : "50019989222",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "82682C0E4EFB0FC31815C36250C6BC129693F8C0B168DB232335DF6D40BAD86D",
            "PreviousTxnLgrSeq" : 53565632,
            "Sequence" : 2,
            "index" : "00038644504E6E379BD37046FDA37C417055D7A88D209F7AB9C3D41840836E7C"
         },
         {
            "Balance" : {
               "currency" : "ETH",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "ETH",
               "issuer" : "rpbXVn3MEwwwXyAHZtKwEqyV1x24qEWdfR",
               "value" : "1000000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "ETH",
               "issuer" : "rcA8X3TVMST1n3CJeAdGk1RdRCHii7N2h",
               "value" : "0"
            },
            "LowNode" : "000000000000056C",
            "PreviousTxnID" : "7E9ECD12BC8814A2F575C983308F6F8D2145802AA2BD9A79430529D805684CF9",
            "PreviousTxnLgrSeq" : 34768922,
            "index" : "00038CAB8AD69D82FAFA3E0B02BB1CA040959B933DF4122EFF009D76A00658FA"
         },
         {
            "Account" : "rpUbFUFNiVcJRgUJj8sutNmLN3LLexyGEt",
            "Balance" : "29974636",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 2,
            "PreviousTxnID" : "E02A6BFB72177EF2BDB1696819233BBD86CFD94B376C1ADC2A6EA831D8F3C5FB",
            "PreviousTxnLgrSeq" : 50996773,
            "Sequence" : 77,
            "index" : "00039B62AAB31EE54B8CF9346CBF12A8A9FB80EB0C2BBA04155B5B4F0FBA594D"
         },
         {
            "Account" : "rQrT1y5CkTKjY6zvci2TruPw2vEGraMvvt",
            "Balance" : "3416025660",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "B9BF42229699062CCEC0EBC171CE1177CF99EF387E1C378047C8E3128021FDF2",
            "PreviousTxnLgrSeq" : 56479420,
            "Sequence" : 55482786,
            "index" : "00039CCD5DFAB67E18E978BA2578600A56CD94B71E5EA2920CB825EAD0950888"
         },
         {
            "Flags" : 0,
            "IndexNext" : "0000000000000784",
            "IndexPrevious" : "0000000000000782",
            "Indexes" : [
               "05F6DD98054AD536FB7D1EE64FF2E37BEA525987300C9051057A428D64CFC64B",
               "0E23EA9F7D1466FD72C2D7330E4C0048B4E4B97351EAD7C7851D8C0BAEBF7E15",
               "2E349E02287ACB74A420254B3E5535DE13327AAB81A524A877F778CE5CDC2149",
               "2FDA646F4E34E04E142223EE957C265C521C28F93DF08998191281C1E5ECA498",
               "37010083EE0EE6FD172F3A9FC8D8C4A61FE49BCD640FB7D14D26DCC0E40E61C8",
               "5233260F503316CB6EA03FA4943D1E51078E98F7D58BB0544344D552884221D0",
               "5775CB45790C38F6EFD6A8D389A683059F00D109E6F39A309BAA852EACA7DEE9",
               "5F13E18B1CE5E53B79606BDCA2CF9F96BFBB82B31E7114A9A7E6730CF7788E23",
               "66E278F46FBF660D6EDA7EEAFFF8D509A4FED347C297B8EB3E88E77B65EEF3A0",
               "75B5F03D5096FBA46E298498583FEDA09C6619F6BD40D12DBB0A8956BA04EE9A",
               "78B60DCC25CA34332C66903DCA62B2F1031F025105C03C2CF1BFC71079E606DA",
               "886CDA9A8C949DE729D83B0087132AFD126B3D1A1155BAE5244F1F1DB957DF64",
               "9085C41FE89F7A7729B5D2E851CA27EFC75C4A5FECC1CF45CF77D68683E7F8E7",
               "95AB2A9A055A76C6FC99C2AB752F825BC4FF097017554C8980A045D9C2106F98",
               "9D17132791D4A6E9A9FCD2335401290F0A24FF5A18D99F1041E36B98DE765C5F",
               "A02CA67F804DFAD220BDFFC49572FE8F8545B6B17F716316A03783619EBBF2C7",
               "A8F40848D68D4D138EDD5CF0F8534657D423C02E40581C5EB8DF4861BEC4BAEF",
               "BC6B27DF63284E418A1C925D4E8B2E999C8672FBB08839B2AACAFC83789CD527",
               "C3A98E846189D1B85DF395ED97F086C3F95B5855C93A07739E6E9AD4E368F679",
               "C9BB90AEBAD895B6E7D7D37C6F2BDF53744F06ED8D720156A5DAB8AE904FD554",
               "CB8A6826ED894DA07CCE3B47BBF51805308A17478580C1F9591A9085D712A6CB",
               "F971A92DF948FF4F8A5A0EBE54C37AD1757C41A02AA1A219A3D0307FDA7E25B6"
            ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rcA8X3TVMST1n3CJeAdGk1RdRCHii7N2h",
            "RootIndex" : "4EC2C3BBB5D149BD55EBFB6841BFC74978B240A5312EA96BF569367782997DBD",
            "index" : "00039FE2851CAFFBF4AB8906A7CA4C6DA20A03AECD402A62E25B5503BA264C90"
         },
         {
            "Balance" : {
               "currency" : "BTC",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "BTC",
               "issuer" : "rw8tGC1FHXeuQHo5ccGRAhwNd9MHFsUaXY",
               "value" : "1000000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "BTC",
               "issuer" : "rchGBxcD1A1C2tdxF6papQYZ8kjRKMYcL",
               "value" : "0"
            },
            "LowNode" : "0000000000000461",
            "PreviousTxnID" : "BFA706F20486360826B396D37B6687A017494B713A0DA607248BC7C1DDD688E9",
            "PreviousTxnLgrSeq" : 31239501,
            "index" : "0003A1E91894EAE15ABD2E8172734A7F56847D845570AA9071EBDC0A4F3994DE"
         },
         {
            "Flags" : 0,
            "Indexes" : [
               "58BE13B0871BBE38CB03C9B3BDD3D449FCA43B992DEC896C99632809354A75BD",
               "52A28BBAF0EC325F81CB248D8C2FDD27289523738DD0BDF861626ABCB1012D75"
            ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rB9KYTdt1NPvt4rjv3HaGyghuV8ZbjxAiv",
            "RootIndex" : "0003A8522014599601A808BF68B490BADE57DD328B07897F9CA18C7782C3C29D",
            "index" : "0003A8522014599601A808BF68B490BADE57DD328B07897F9CA18C7782C3C29D"
         },
         {
            "Account" : "rfretfgjYcB6cVRSqUkGaUBRrPJg7oWXBk",
            "Balance" : "20857762",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "5398461E08D4B541D3A9B120E9B684CA563581732DBA3024EE2B4837C5636854",
            "PreviousTxnLgrSeq" : 36532402,
            "Sequence" : 3,
            "index" : "0003AB72C4F8DC6C6F9FE1776429E758330E7061EC9EF28D4EF46A1C23E535C4"
         },
         {
            "Account" : "rHzcWrLab3MubitUfsNGsLNqKeA75VCzjA",
            "Balance" : "19999990",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "958B8FFA11DBE960A1346D960217180F37600F8A9E7DAE9EB0C170B1F0B85064",
            "PreviousTxnLgrSeq" : 35703532,
            "Sequence" : 6,
            "index" : "0003AC9192E3746F287527542C724A38FB1689F50AB89617930BCA53C051C8AE"
         },
         {
            "Account" : "rEjcYAi1kePMyrQTdxFkAdCg8DjUNG2nGk",
            "Balance" : "19988000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "5A7CE59A33514F05951427EAE6D5139721464730840EC890DC8520E5DA77C7BB",
            "PreviousTxnLgrSeq" : 15913663,
            "Sequence" : 2,
            "index" : "0003B74499E08C266F506BF1F52B4E5212493D913493E4B037DBF867A5437530"
         },
         {
            "Flags" : 0,
            "Indexes" : [ "05654771F9B57011239F2AFE5A92F08220318968F1438DFA64F2CDF0A414B5E6" ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rGt8yFKTASyBxCXE9bzXpF1Ucsdx9wdNYD",
            "RootIndex" : "0003B76E9B32E108BFBD663FDFB30BF1CDE19E411214C1D9E4A28417CFCAF6BD",
            "index" : "0003B76E9B32E108BFBD663FDFB30BF1CDE19E411214C1D9E4A28417CFCAF6BD"
         },
         {
            "Account" : "rJdAZgrkgVAxsksMkZbn9zheeQFLzp6SGs",
            "Balance" : "39999976",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 2,
            "PreviousTxnID" : "0A57BAB1C758ED1D3F808133343FDEE5972E9CD0B071A3A814D1BFC64DB039EE",
            "PreviousTxnLgrSeq" : 37117674,
            "Sequence" : 3,
            "index" : "0003B8F63DC61D899B69A0F889DE22EF5CD4B0532DF2C6F4503E45A74F5C6257"
         },
         {
            "Flags" : 0,
            "Indexes" : [ "792E7B025DA04B17EF4BF7C682EA21C900C189D12994B259DE2980F8C62051B3" ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rDg11bHubiWpoki8rt9gxpTtLyJeZJ9Sp5",
            "RootIndex" : "0003BA5377F7E730EC26B29C412B25707992213103754914DAB2105EA13CB604",
            "index" : "0003BA5377F7E730EC26B29C412B25707992213103754914DAB2105EA13CB604"
         },
         {
            "Account" : "rwZF2RtFafhr3igLU5R32Sedk9gjHDYLDm",
            "Balance" : "24977500",
            "Flags" : 1179648,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 1,
            "PreviousTxnID" : "F15DC44FA931A53BC44940B42A0EFDE4C46BEDF23E1A8A7CFD5BE75224348139",
            "PreviousTxnLgrSeq" : 51619073,
            "Sequence" : 4,
            "index" : "0003C51FEC6DF5EF908A32AD980883A8ED0B39A1855870922C935DB43194D173"
         },
         {
            "Flags" : 0,
            "Indexes" : [
               "6057B8300EF716859B9BF62C8C8C98EA232F7A02E1EF7FED4A0C0F7382F68A51",
               "6D3BBE35F7C18C8747310107B1A6B7295EE1FD6667A00015A9FB6681AB0BE10F"
            ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rPbdWUNunUfAGaprmJo5hQyWUkzXrbANzB",
            "RootIndex" : "0003C626CADF620F2E911CCFB70BBA29795339274DA9EAE7A2BEAA6C105D1AA5",
            "index" : "0003C626CADF620F2E911CCFB70BBA29795339274DA9EAE7A2BEAA6C105D1AA5"
         },
         {
            "Flags" : 0,
            "Indexes" : [
               "C35FF73535631AFA1BF6F15AD391FBE7FFBC5CA9B63411DDCC5E10EC07149AF0",
               "AA32F82B41B573D12970D05D5720DEAEA60C3502A3054816ABDED76ACFEB2C3E",
               "9A0135755653009912CEBE1869626D7DDBBAC4FA2B0302DE70D1AAEDCD29AC5E",
               "1F00033E131AE60F9C3389E849DD4EDB3F00694CED969CC3E8558B5435948899",
               "062DEEFC31527A88DE509CE9F09F1D8710E134AB606D05AEBB9B503303821C59"
            ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rUyB89zuaijCypgLEXzQXUqthe5FPHUMc",
            "RootIndex" : "0003C8E760C9CE377CA4486675760C984DD380E14088CF34E309F7D266956376",
            "index" : "0003C8E760C9CE377CA4486675760C984DD380E14088CF34E309F7D266956376"
         },
         {
            "Account" : "rNxHAm6DrFCgLRV8iyNMzmsmDc3yT9fMew",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "7AF4C24E06DD0F8E2673556DA7E9B4C9F723172898BF29299F3DD5CD62032734",
            "PreviousTxnLgrSeq" : 46462347,
            "Sequence" : 2,
            "index" : "0003CC742B46D74305CA8E046819E1AA97D1562C79220075C88F910DB3D6985F"
         },
         {
            "Account" : "r6NGJbC8Nh7qg7mNNkn2QpAzLWfh8hP58",
            "Balance" : "93294121",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "0A1527D62D932335CB5B3CB39073FDF70E005717A21B81FDB8454C56264CF965",
            "PreviousTxnLgrSeq" : 31926264,
            "Sequence" : 3,
            "index" : "0003DC0717153A0FC5E2EA4BA5B591B212EA1EB5BE7B39855D894A058E202F8D"
         },
         {
            "Account" : "rHpBxwCmb1qDYfL47Yssog86oWYdrWZf5U",
            "Balance" : "2000000002577",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "0FD4DFDA203A9F9D7E47C7DA2412AA38ADBA2B200515A0AB5F077EED7DF53192",
            "PreviousTxnLgrSeq" : 55163924,
            "Sequence" : 1,
            "index" : "0003DD9FD0C0CCCE359F26E8395BA4A60CB7074439188796C9BED785258375E8"
         },
         {
            "Account" : "rs2Pi9HrrmrHSva7Rp6m85WTMbijxU8ZRN",
            "Balance" : "16294773045",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "A887C95A0C6EB0E9052F4DA814D04A411126F255246DCADE73F23184164416DF",
            "PreviousTxnLgrSeq" : 55182715,
            "Sequence" : 1,
            "index" : "0003E412CC0915B3AD068FEF0D8AF37E09DD2DBC802F8D3F5075E13D700955B5"
         },
         {
            "Balance" : {
               "currency" : "ETH",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "-0.000375"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "ETH",
               "issuer" : "rtR4429hdNSHotarYCqzeJAxqRw8cER1S",
               "value" : "1000000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "ETH",
               "issuer" : "rcA8X3TVMST1n3CJeAdGk1RdRCHii7N2h",
               "value" : "0"
            },
            "LowNode" : "0000000000000241",
            "PreviousTxnID" : "A6626B1A8A4D66395DF9B4A29A20A31C0AC2E9151274EF4871F1ADCAA6F434C4",
            "PreviousTxnLgrSeq" : 31100032,
            "index" : "0003E975AB352553F6FC94C4643C2FC13B8CFD1C176DC61694BB5FDEE767EB3F"
         },
         {
            "Account" : "rfr1PerWfzGmbEn8ZKuz1hGsk4smDAZGST",
            "Balance" : "19999980",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "2E9AAC3FA2ECF151EDD81C5E8F88BFA8AEDF755B244283682B086D12F857E0BE",
            "PreviousTxnLgrSeq" : 48589693,
            "Sequence" : 4,
            "index" : "0003EC18AC4B2CF519F33BE734870151F8BED09AA250F1E95CBCD95E04908791"
         },
         {
            "Balance" : {
               "currency" : "GCB",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "-33333"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "GCB",
               "issuer" : "rKVqAXyd2xdP9iPUJ24j7wjX9TW2oBb7iq",
               "value" : "1000000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "GCB",
               "issuer" : "rNdwi8ain5ibXNB9A7H3zzKtSxgVzAqqAe",
               "value" : "0"
            },
            "LowNode" : "0000000000000169",
            "PreviousTxnID" : "9B30B8940D0519DC4DBB904E9ED34A12FC42F366981C3BA73E1C43E3E5D27A06",
            "PreviousTxnLgrSeq" : 38343800,
            "index" : "0003F339D937025D9FAE8724E3949CE4A2D497EE72DCF17CAD03C07E69C312B6"
         },
         {
            "Account" : "rNPYdGhgeVHyD7Loj4vrEPMjSPGig2p2Fj",
            "Balance" : "49999970",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 3,
            "PreviousTxnID" : "BAFCA0A4AFBA0300B8800C16E3ABEB0B095BF3103EA985D064EF9C1AD061B9CF",
            "PreviousTxnLgrSeq" : 44292686,
            "Sequence" : 16,
            "index" : "0003F463DC9910431C20BE61FBE203C1776A97847A6C03FE662D0CF571E812BE"
         },
         {
            "Account" : "rHP4k7K8hxLAJkJjDc6qn6VhkibPU6Vhee",
            "Balance" : "10955579573",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "B00C84FD4723003C3EF88934D2182BFEA3A737BB11E81A52340517D9143DCFB3",
            "PreviousTxnLgrSeq" : 56192692,
            "Sequence" : 2,
            "index" : "0003F8872371E899468914E24BC20DD218BE8A2647AF5348E1FFCA92EFE96717"
         },
         {
            "Account" : "rNozxmhZbAnfcoFrvENNo64HEW5ceNpPPQ",
            "Balance" : "19999988",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "44290B40914D1192777662E29FB32F43207FB52E7E2BBEFF5F01EBA0ADCF8B08",
            "PreviousTxnLgrSeq" : 48580948,
            "Sequence" : 3,
            "index" : "0003F92B400F4AFA2CD3386459C99408786124EA11BF6D5CB211859142BCC8CF"
         },
         {
            "Account" : "rfNXU2szUFio4Hus3nikZCxRTM6SB1wGmG",
            "Balance" : "2000000167",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "91F073C52B1046E4A4280BDC5299FA25766640DDF8D537CD189424B84C55B4B9",
            "PreviousTxnLgrSeq" : 53535233,
            "Sequence" : 1,
            "index" : "0004006B968DCD105EB9235C8E7CF2A5DEEADC645073BA5D43642CE874CB448A"
         },
         {
            "Account" : "rUAcsDtb9haqV4Yu9TeSSjpzb8VScp9WKF",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "76916479558C2B1EFA75271AB49DFD491B1B38A9A024584CE6210F34370CF97F",
            "PreviousTxnLgrSeq" : 43500691,
            "Sequence" : 2,
            "index" : "00040A6B5E10E3BC48E76A1FBD64F26C5DBA536C77EAEFD62DDAD03822E79F0D"
         },
         {
            "Account" : "rBrzrsaHN1NMJ8wNirWGi4xXRixVMa3K4j",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "3BB91826267F85C3A203A5E37FBE643E4AA1F16E2DF8ADB33A009FB93F492BE7",
            "PreviousTxnLgrSeq" : 46452698,
            "Sequence" : 3,
            "index" : "00040B73AB116C267CE43B7A7A7BAC16FDFC0936DC9AB245D54BB4B672BC9A41"
         },
         {
            "Balance" : {
               "currency" : "USD",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 1114112,
            "HighLimit" : {
               "currency" : "USD",
               "issuer" : "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
               "value" : "0"
            },
            "HighNode" : "0000000000000680",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "USD",
               "issuer" : "rhePjBM5Hdhqc2hiyAMMNArwJyHhmN1ys3",
               "value" : "1000000000"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "34B671C49C8226F2993601B9F68383C95FEA701A2055D2E64BAC5E2D0E78AD17",
            "PreviousTxnLgrSeq" : 30260251,
            "index" : "00041008DFADEF0C28810345202B75AB9AE17BA191F3F4821A46D7F476E69B88"
         },
         {
            "Account" : "rEYT8JgAafMNKDBqPePJCQzxgnH2KYiRSE",
            "Balance" : "707739031",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "956669766DE55BEFA53C7C013D113F43A2590451A55452E0787C3FA0C0FEB854",
            "PreviousTxnLgrSeq" : 55788741,
            "Sequence" : 55786539,
            "index" : "00041034B0D6E62B850BEFE74CE4565E47221D550CD274FE4A1EF6310DE39540"
         },
         {
            "Account" : "rfZHqsL53Kix5vGwTss9fzUe2mC7AZbziF",
            "Balance" : "302424455",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 1,
            "PreviousTxnID" : "2DC609DA0D310409F4DB8C9C9DE2A539BD60EE0D94218795D552BFE04921A5A8",
            "PreviousTxnLgrSeq" : 35144098,
            "Sequence" : 2,
            "index" : "00041094FF85918AE56E103122EA8C21B4ED567F17B9AA1764135BF4863BA91C"
         },
         {
            "Account" : "rJYacFmK5NW6q1en2X1WXsC63FeXbdZZcK",
            "Balance" : "1993092237",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "E040A227580A5D98471EC9F08B2BD714D9D131B30C1D9B5DA537625D9D9023ED",
            "PreviousTxnLgrSeq" : 53866398,
            "Sequence" : 1,
            "index" : "00041CFCBED5E832F9AF02921DBA390F2243809CAEE2F6B12FC7FE2257EB4C61"
         },
         {
            "Account" : "rNn9diyjJ8rypuTMT8eowyDdhWvfka7PyW",
            "Balance" : "49995695",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 1,
            "PreviousTxnID" : "6DEF945C56DFF972AD5387BBF158343C18DA2AE38810BEACFCA79F0866F8C6AB",
            "PreviousTxnLgrSeq" : 29843258,
            "Sequence" : 4,
            "index" : "000424554D47800D97BCA002008324F3505F3DFA0051369D2BB1EC9278EC1AFA"
         },
         {
            "Account" : "r4gdggbXw527EehtLpMzSq7HkV8X1ZJNfu",
            "Balance" : "49988000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 1,
            "PreviousTxnID" : "2C5AA5DD28A86D1FD15C71D5EE10ACB379C26353068C677536CAAF5054EBB63B",
            "PreviousTxnLgrSeq" : 10591517,
            "Sequence" : 2,
            "index" : "00042D99424950CEF1C109E1AD59A1BDB39798CE5DC33997118E5C81CA36D736"
         },
         {
            "Balance" : {
               "currency" : "EUR",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 1114112,
            "HighLimit" : {
               "currency" : "EUR",
               "issuer" : "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
               "value" : "0"
            },
            "HighNode" : "0000000000000EB4",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "EUR",
               "issuer" : "rpqf8HjJVfNGzz2xgp6FHgGSDjFUJVF1Z7",
               "value" : "1000000000"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "58F0CE1FC3D3F698B54EEF63327F5312A4E1F6ADFF0D6C0E9E5ED70FAFCE7108",
            "PreviousTxnLgrSeq" : 35077255,
            "index" : "00043116DDC6156D7F1DEB82947E530C5D15BC1110EB4B6610C73026608058E8"
         },
         {
            "Account" : "rhsxXXvmCJSxXdPQh1BghKrwWmGCkidcWb",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "8AD609D944125F19256A8F43BBB306D815237EC2EDDAFDA3BFBBA05DA6207A8E",
            "PreviousTxnLgrSeq" : 35163930,
            "Sequence" : 2,
            "index" : "00043AC62B3EC2680D729DFF135CB31AF9EB59D2866B588959D6F45ADF76949A"
         },
         {
            "Account" : "r3fDQrGYJsLfVnX2UpR3AvHLQMe9ttBhFM",
            "Balance" : "194809789",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 8,
            "PreviousTxnID" : "6BB24B338A3ACE4BADEE7B3F947636C7F657F459CADBE44F2C9B469C999FA3A2",
            "PreviousTxnLgrSeq" : 34106543,
            "Sequence" : 493,
            "index" : "00043C397A43F4E6F99235F840C5783ACE2780A8AD5D5BC344BD7DCB6CD9D853"
         },
         {
            "Account" : "raoc4ckuPpfqGuuAm55HwUvUHcfuNmiAhj",
            "Balance" : "37291669",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "CECA45286DB6F6E01EEE88D950556D6E40BFE67C66A3A765B09C2FD01273391E",
            "PreviousTxnLgrSeq" : 36188661,
            "Sequence" : 1,
            "index" : "00044273E4FCD8932602CBB8545F54E862270F79F183B1C40AA11E98F297E951"
         },
         {
            "Account" : "rE4TJNbsG6CPM7X3Qhyw85QqGENEhgCKp4",
            "Balance" : "20150000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "9850E15578F6D3A6B8232FE9CA6DAF9B4D10B980C88344D96078CBDB81A9461A",
            "PreviousTxnLgrSeq" : 35420496,
            "Sequence" : 2,
            "index" : "00044E668C2326839EC8E145A4E4C07A451FF3C5618E8892EBC0C21D6D852632"
         },
         {
            "Account" : "rDm4AioMMZgd7KedMRgv73yQ6zhMJMHHtH",
            "Balance" : "19999988",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 1,
            "PreviousTxnID" : "1FEC8F660682CD2B450F8D4780E2535ACFE40FCDD9FE66AB97DC190DB9FA3D29",
            "PreviousTxnLgrSeq" : 37735191,
            "Sequence" : 2,
            "index" : "00044E7954EBCFCDD3D21AD53777F89196B6F37CD43A40D0DD26A69C43E5DC04"
         },
         {
            "Account" : "rQBAbNc26Ys3Tbagkmb5jAAf2ZXsaqZyGF",
            "Balance" : "20000076",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "0D5DA3CC42ADBB68B3A08704255720F928D9984E97C3CB7BF70554F134EA3669",
            "PreviousTxnLgrSeq" : 35290357,
            "Sequence" : 4,
            "index" : "000450DCF34F189E5CF2E97EA797000439AE4A9580FB45885BF979F37215DE83"
         },
         {
            "Account" : "rEsNWUZ9vr7GjU6pu5W6cEEg8tKwYJy59X",
            "Balance" : "20226687",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "5A1528246D603633F6E918AA0AB21836E09D7917E698101A702796DE921E6DA2",
            "PreviousTxnLgrSeq" : 41695007,
            "Sequence" : 3,
            "index" : "00045125EE993EF598355CB47A24C482AE07D870F8F0806BA973FB299F4B29AB"
         },
         {
            "Balance" : {
               "currency" : "USD",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 1114112,
            "HighLimit" : {
               "currency" : "USD",
               "issuer" : "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
               "value" : "0"
            },
            "HighNode" : "0000000000000396",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "USD",
               "issuer" : "rq4BtzpHxFRQn9qsk3pRhDWPU1CrmYeT6",
               "value" : "1000000000"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "38276C2BF8B8995573F0CD5B3600922B153393CF0F39F422681580A943DC85EE",
            "PreviousTxnLgrSeq" : 35441092,
            "index" : "00045B7D116EEF9A5441171F497C4ED66BA027A0DB513FA92E13806DB1A0486B"
         },
         {
            "Account" : "rDZCRYBAkW2JhLvoo879f7schNT5WE1hKs",
            "Balance" : "100000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "448F7523B5A49F69B4093F2C310A3CE2DB5E0D1F77EF0A992C01F511239ED4B7",
            "PreviousTxnLgrSeq" : 56260953,
            "Sequence" : 56260953,
            "index" : "0004605DC35B94E8E6481CC6BA45C72C02C05745A1F731A6955863C80845F057"
         },
         {
            "Account" : "rNPRPQPCCPKDu6XKqN6FxK1vhMup9h7xv1",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "5EE647BB6D9700357D5937A970452D9CD6A2E54BF1144F45F2AA7735BEDE8642",
            "PreviousTxnLgrSeq" : 50147716,
            "Sequence" : 2,
            "index" : "0004622E90BF53DBDE39CB7CB902892F77E367C50059D4F82319A1B733ED3389"
         },
         {
            "Account" : "rws2ctKicUhnqq3HcnUq1Qbk39NxsGeu2q",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "49F95E1E9DF098C2CB695D2C0A4C12C0345A82A83AF0AC1D38770FB93BC00D88",
            "PreviousTxnLgrSeq" : 48127460,
            "Sequence" : 2,
            "index" : "00046490305BFB74F60BE369CA1170FFD1C40491D3E4963F630130E42E1F14F0"
         },
         {
            "Account" : "rh5XXc8BFFRA7xeWojr2ZsYgqvgQdhvRAd",
            "Balance" : "20150000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "6DE20189EF8598769263232EABD70197242DBA3196A02E20C1CE30B1C55FB3D2",
            "PreviousTxnLgrSeq" : 34283739,
            "Sequence" : 2,
            "index" : "000466F1C43F93B9A9FAB81F5909438355DECF70C67BAEE2F2B97F7FE80DB23F"
         },
         {
            "Account" : "rjryT2fZHQMUkQ57i7eqjjWMdSXbL1xWz",
            "Balance" : "19988000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "EC38AB0D48757E9E088788A3907BD68FC33FA930160902E1A76D72600081EEDC",
            "PreviousTxnLgrSeq" : 10644634,
            "Sequence" : 2,
            "index" : "00046B3B5D5C5F45AE5393761A99A8DDB2CEC25526148FB529F1404EC0DB230A"
         },
         {
            "Account" : "rnHCMNLwZr6aPhUkHhX1Cog1zkwebJ8k86",
            "Balance" : "25489074",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "0BB27A488FD2D4579C480C1E89AB2EAF65104548FF5D96A6A91ED209F1870560",
            "PreviousTxnLgrSeq" : 48905816,
            "Sequence" : 4,
            "index" : "0004704B77C1942A569589D35F70AFBC3F2040DB4806733CFC51CA942C1EC627"
         },
         {
            "Balance" : {
               "currency" : "USD",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 1114112,
            "HighLimit" : {
               "currency" : "USD",
               "issuer" : "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
               "value" : "0"
            },
            "HighNode" : "00000000000005C8",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "USD",
               "issuer" : "rhBxjDrNybHTk5zM7yR7d54noXVjvLRtZY",
               "value" : "1000000000"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "EDEDFD10BE0D8B5705B3BC2D05E37E4AD041DDF72D4635E5B062656960325D7E",
            "PreviousTxnLgrSeq" : 30031756,
            "index" : "00047509E54628EDC5A904C00C08A1BAB60D24BD23CC34CBB38ABE9F45F955B0"
         },
         {
            "Account" : "r9DvWkeub9kNaESk33UEGFg3euf74sbFWf",
            "Balance" : "19999988",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "A1E466CEB29E2EB339F1DE9D6D3F1D7CFF5D826D5D338C1B8124E6CBA6632393",
            "PreviousTxnLgrSeq" : 34935031,
            "Sequence" : 2,
            "index" : "000477ECA17E9435728D0560E349888965579EE5C1281F24190F988716719FCD"
         },
         {
            "Flags" : 0,
            "Indexes" : [ "4B86893AD9F493ACB05E269A62DEB07A25CF49255030CECC91D69767BBECF16E" ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rJs1i518wUrJtN8n5ZGjnVU4teCS4bVkhw",
            "RootIndex" : "000488530E79F3C7E0B17C0E9DF4C242952A8B85C33AA80F173C842128105EAD",
            "index" : "000488530E79F3C7E0B17C0E9DF4C242952A8B85C33AA80F173C842128105EAD"
         },
         {
            "Account" : "rMgVhSaAnrXBVoqs6QKqaCzcPT28WVbyyz",
            "Balance" : "20959223",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "EB3C10C8ECA22C0F53566396871481EB2176768209232266A5029799D8568544",
            "PreviousTxnLgrSeq" : 38508528,
            "Sequence" : 19,
            "index" : "00048EDD8A181E63056A7B2718EF840FC508ED05354955ED0D80BC10609F6DEA"
         },
         {
            "Account" : "rGbWLvx92cmECTsn3TFJfPuAnbqpdeEgKz",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "585B9341FC91832349AC47ACD4374D6584A44FB16975D83CF0BD7230E3E64F82",
            "PreviousTxnLgrSeq" : 48407938,
            "Sequence" : 2,
            "index" : "0004951F6647029298DF9BF8DB099E8A1A8B74F502BC5CEAD9030A9A9FB7792D"
         },
         {
            "Account" : "rPPnjVhweEsXfmPchVa6GqHEf2kpooP9iv",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "ABC32682023FA3C11A522B7C7F41524D3ACEA0F7FA11C4FA019BFCCC86DE3BF6",
            "PreviousTxnLgrSeq" : 35905984,
            "Sequence" : 1,
            "index" : "0004980A17929CEB800E3E1CF2F6045B6EE0160F4F342B0ECB791F867D5C8AB9"
         },
         {
            "Balance" : {
               "currency" : "CNY",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 131072,
            "HighLimit" : {
               "currency" : "CNY",
               "issuer" : "rHw3NqphfdPiJbctTLmg9rP2yERoqfWeQ2",
               "value" : "10000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "CNY",
               "issuer" : "rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK",
               "value" : "0"
            },
            "LowNode" : "000000000000003B",
            "PreviousTxnID" : "06C4D587DA85B52C504C44DB39272DDCAF216C8403C5D0A943AF0FB9479A665B",
            "PreviousTxnLgrSeq" : 3242268,
            "index" : "00049C6ACC7B48B847E0EFA9313C0B28E79F7AC9A246DE269D85CC3756D15D6A"
         },
         {
            "Balance" : {
               "currency" : "ETH",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "ETH",
               "issuer" : "rUf7tsQugDN8vpTvRdcZgcibmtxHMXATRW",
               "value" : "1000000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "ETH",
               "issuer" : "rcA8X3TVMST1n3CJeAdGk1RdRCHii7N2h",
               "value" : "0"
            },
            "LowNode" : "0000000000000401",
            "PreviousTxnID" : "BF1138E291AC65A99E3D19C0654E223674896ED9A2530A58D3505EF47934DA53",
            "PreviousTxnLgrSeq" : 32435791,
            "index" : "00049E88D4D3337584AE71762ECEC72CC045A1FB0ECE5FD0AD71371EC7C82484"
         },
         {
            "Account" : "rh41r1hMt16UFwaGXCNtC1mAUS5Nuu7omo",
            "Balance" : "48999940",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "D4B29DF22B522758875EAC5364D66690C274D81225EF9A48CF40EE8600D3AC35",
            "PreviousTxnLgrSeq" : 38585786,
            "Sequence" : 6,
            "index" : "0004A34C6D6C448499B8341264CE32AB4700695A99C5E7FD60E470D32C80756E"
         },
         {
            "Account" : "rUfgiY4cAPU8DasL8EYAicPjj4JqCUB4aY",
            "Balance" : "523343166",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "570E22E8A811FA0CC3CAFC0F0235428BB8BAE1C4260A6A123FC1F103332B1608",
            "PreviousTxnLgrSeq" : 49099007,
            "Sequence" : 1,
            "index" : "0004A6317EEF302AD8505B51242BE09AB6D117E05A0BE5E886558B15ADF55C9B"
         },
         {
            "Account" : "rhdHkJnWFvet4Wwhq13iYMHFjT28BGyXbG",
            "Balance" : "20505258",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 2,
            "PreviousTxnID" : "4E3FCD2B7E7B6AEDC6F0E6767CF9D118CD48348F7F58A2CD2F6D1C932AA5190B",
            "PreviousTxnLgrSeq" : 52648559,
            "Sequence" : 170,
            "index" : "0004AAE0CCF1618C2A894B06A30D7E85CCD8BC944FA30486F990A16085EBADBE"
         },
         {
            "Balance" : {
               "currency" : "BTC",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 1179648,
            "HighLimit" : {
               "currency" : "BTC",
               "issuer" : "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
               "value" : "0"
            },
            "HighNode" : "0000000000000003",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "BTC",
               "issuer" : "rUqNn26jQG8zfNDy21NTCwgFXrFgLyRf3U",
               "value" : "0"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "00960BD6EEEEFBAD01B8FBF80B8E8E6783BECF84BBC7C6776F745E3681B8EA52",
            "PreviousTxnLgrSeq" : 14819481,
            "index" : "0004AC676C97112A2A14494B56C1CD9435B8E319F5152DF1F6BD40EC1A2586C4"
         },
         {
            "Account" : "rHK7ga3v53tfTCdVPmpHNdvmUGLpG9gNGh",
            "Balance" : "109685000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "8EE7DE8E9156503E1BAFA8CA00867946F43FCDC254FE650564D1CCF70F47106F",
            "PreviousTxnLgrSeq" : 35185091,
            "Sequence" : 1,
            "index" : "0004AEC9772AB16AF1C9FD08850D918769F60C55C9FF1877FE8125D0F418117F"
         },
         {
            "Balance" : {
               "currency" : "USD",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "USD",
               "issuer" : "rfSEud5jTYqQF3CnKBHgt3AxkWCnwUgJg9",
               "value" : "1000000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "USD",
               "issuer" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
               "value" : "0"
            },
            "LowNode" : "000000000000029E",
            "PreviousTxnID" : "301DBB9F2A532F9AE4B565D74AE24862D715CBA450B99CB2F00B657EBDDE0F9A",
            "PreviousTxnLgrSeq" : 10242481,
            "index" : "0004AF8BD80F295A8E8DA1D6597DAB919037007C70657BAD81B56FCDB7B38E80"
         },
         {
            "Account" : "rJdq8QfaW7Uur9L63xbC17fx1hXvzXmFGn",
            "Balance" : "20439844",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "6187CAA5525A3B413ECACE88C11DD4D1E438D112B04AA43F86DD81DAE2AE440D",
            "PreviousTxnLgrSeq" : 49070852,
            "Sequence" : 39,
            "index" : "0004B458F8891430C7B7A237E66F02E693A78AF2D68822DA5F0DEECC3B171E3D"
         },
         {
            "Balance" : {
               "currency" : "USD",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 2162688,
            "HighLimit" : {
               "currency" : "USD",
               "issuer" : "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
               "value" : "0"
            },
            "HighNode" : "0000000000000081",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "USD",
               "issuer" : "r9GhUNdVsPF8kvGdtZs2EH5KvfWefddyXP",
               "value" : "1000000000"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "4E910D3230F90B2C5F1D0FA27A40196AC55A0B2625BBAEEC346B9A2D2C05B3ED",
            "PreviousTxnLgrSeq" : 24792921,
            "index" : "0004B7BE41198D0C0DFC7456B2941022CDEDF96D2B34BA2B4D0A3E14C67A3541"
         },
         {
            "Account" : "rae6oVSd1aNTJvAwyxE8wKVNVAHyWawN5S",
            "Balance" : "20000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "AB0FFB05D0DCD834B0EC7CBF61801755B595A48CDD7F6AFD5B6E0BF9C988FD09",
            "PreviousTxnLgrSeq" : 45371385,
            "Sequence" : 2,
            "index" : "0004B861C4B94E840FF9401876572F8193C53761BCC8B6DBC99A5D9383D12402"
         },
         {
            "Flags" : 0,
            "Indexes" : [ "8E6889A03B26C4C7D73D48E374471C8C7DFBE994382C229D7D56CF3AF6FB3F28" ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "r9sUeAqPayRSsXamaqvWeZPDVENK1ScPed",
            "RootIndex" : "0004C29FA06DE0D176D987DFD9712F310BDD6749D6A1F83556BBBF710B07EA46",
            "index" : "0004C29FA06DE0D176D987DFD9712F310BDD6749D6A1F83556BBBF710B07EA46"
         },
         {
            "Balance" : {
               "currency" : "CAD",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "-23"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "CAD",
               "issuer" : "rJhd44rcZNXJs3UKZGf28i1j5Dv1kMHMjr",
               "value" : "0"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "CAD",
               "issuer" : "r3ADD8kXSUKHd6zTCKfnKT3zV9EZHjzp1S",
               "value" : "0"
            },
            "LowNode" : "0000000000000009",
            "PreviousTxnID" : "DDDCB07625649FBA5AEF4FEF52628E5B34D9A690DBC653D3E61BCFB332E11184",
            "PreviousTxnLgrSeq" : 6599501,
            "index" : "0004C9E1CF03D437B6D8CE8E3522844BA2DCA9818A83D3E20A1D8FCE374FA3A3"
         },
         {
            "Account" : "rMXy2mvgGfo6VPKZiE2p178MBk4fesnkss",
            "Balance" : "42807000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "713598A0911DB371E6AE6B320D320EAD585E72195728723F4260F86FB41A862C",
            "PreviousTxnLgrSeq" : 35438454,
            "Sequence" : 1,
            "index" : "0004D14B235DD9C0AB959C26C3D1199D3098D8B22DBB694753C398FE011DE000"
         },
         {
            "Balance" : {
               "currency" : "BTC",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "-0.000016588782871"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "BTC",
               "issuer" : "rErS8387dwmS7E3fDnTFa8XAQRPr5uvFhd",
               "value" : "1000000000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "BTC",
               "issuer" : "rchGBxcD1A1C2tdxF6papQYZ8kjRKMYcL",
               "value" : "0"
            },
            "LowNode" : "0000000000000BD2",
            "PreviousTxnID" : "8A292FEDE82F23A60E1BC7188F1C88147DAD7303D297A39875DFC8A7DD74C772",
            "PreviousTxnLgrSeq" : 35731651,
            "index" : "0004D41DDBE051FD5302886A10C9990F4264DC657CE49F62F95DF3A86E255C2D"
         },
         {
            "Flags" : 0,
            "Indexes" : [ "FD6EBE613BED36E97D7FCAEF9870FFDEC49FCC23FA76FA7443AB59F66C4DFBF8" ],
            "LedgerEntryType" : "DirectoryNode",
            "Owner" : "rJTjmpFeVYxKzDXcxPYyxqDFPsAjHU1szc",
            "RootIndex" : "0004E7DEEA81686BE43530355C41B0931EB4DB21726E6FDF913CF1425AF30400",
            "index" : "0004E7DEEA81686BE43530355C41B0931EB4DB21726E6FDF913CF1425AF30400"
         },
         {
            "Balance" : {
               "currency" : "MTL",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "-9999999999999999e-4"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "MTL",
               "issuer" : "rUZt6cD3ZN6iWat1q3Z6B4YmkPBEa88vYE",
               "value" : "1000000000000000e-3"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "MTL",
               "issuer" : "rfe8yiZUymRPx35BEwGjhfkaLmgNsTytxT",
               "value" : "0"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "102CCCA09AC9D0337F1E4E8EE66D7ADC6BCE3E54F1D3785A06C383555E81D08A",
            "PreviousTxnLgrSeq" : 7117664,
            "index" : "0004ED7218296FBABFC9790AFE8A193CB8B4E52CCF6D06D2F5CD81A9125BC7D1"
         },
         {
            "Account" : "rhafmcHgwPDhUtwHKJHeS1AowVQ6yrBzry",
            "Balance" : "186663000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "0B3EF2DEF14E17DEF61DC6489800FCA372A7D2FBBF1344AF690A231EDD722390",
            "PreviousTxnLgrSeq" : 35410824,
            "Sequence" : 1,
            "index" : "0004EFFADB2A92621B66644809830ADC7F5453D96F523D6885D5D4F5953A674C"
         },
         {
            "Account" : "rse7zNjdyUTcuRyAbnmY7GKV2cSSM9xYbx",
            "Balance" : "20150000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "FF39483D49A3132227A5F83316CCFD943248CA3D5D68161B4177791F9ED384F5",
            "PreviousTxnLgrSeq" : 30401374,
            "Sequence" : 4,
            "index" : "0004F80C0082589154F40E9962406ADF2A6BC943BCD073863B8BB9B3EDB306EA"
         }
      ],
      "status" : "success",
      "validated" : false
   }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`        | Type                                | Description           |
|:---------------|:------------------------------------|:----------------------|
| `ledger_index` | Unsigned Integer - [Ledger Index][] | The ledger index of this ledger version. |
| `ledger_hash`  | String - [Hash][]                   | Unique identifying hash of this ledger version. |
| `state`        | Array                               | Array of JSON objects containing data from the ledger's state tree, as defined below. |
| `marker`       | [Marker][]                          | Server-defined value indicating the response is paginated. Pass this to the next call to resume where this call left off. |

The format of each object in the `state` array depends on whether `binary` was set to true or not in the request. Each `state` object may include the following fields:

| `Field`             | Type      | Description                                |
|:--------------------|:----------|:-------------------------------------------|
| `data`              | String    | (Only included if `"binary":true`) Hex representation of the requested data |
| `LedgerEntryType`   | String    | (Only included if `"binary":false`) String indicating what type of ledger object this object represents. See [ledger data formats](ledger-data-formats.html) for the full list. |
| (Additional fields) | (Various) | (Only included if `"binary":false`) Additional fields describing this object, depending on which LedgerEntryType it is. |
| `index`             | String    | Unique identifier for this ledger entry, as hex. |

## Possible Errors

* Any of the [universal error types][]
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
