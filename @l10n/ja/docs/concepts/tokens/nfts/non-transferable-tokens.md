---
seo:
    description: ユーザ間で売買ができないNFTを作成する
labels:
  - 非代替性トークン, NFT
---
# 譲渡不可トークン

XRP Ledgerは、[非代替性トークン](./index.md)の一種として、ソウルバウンドトークン(SBT/SoulBound Token)と呼ばれることもある譲渡不可トークン(NTT/Non-Transferable Token)をサポートしています。譲渡不可トークンは、証明書やIDトークン、ゲームにおける実績、あるいはトークンの目的が特定の一人に限定されるような場合に使用されます。

XRP Ledger内のNFTで**Transferable**フラグが無効になっているものは、譲渡不可トークンです。このフラグは、NFTをミントするために利用する[NFTokenMintトランザクション][]にて設定されます。NFTがミントされると、譲渡可能かどうかは[NFTokenオブジェクト](/ja/docs/references/protocol/data-types/nftoken/)の`lsfTransferable`フラグで記録されます。

譲渡不可トークンは、トークンの発行者からまたは発行者へ直接トークンを送信することはできますが、第三者間でトークンを譲渡することはできません。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
