---
html: amendments.html
parent: networks-and-servers.html
seo:
    description: Amendmentはトランザクション処理の新しい機能やその他の変更を指します。バリデータはコンセンサスを通して連携し、XRP Ledgerにこれらのアップグレードを順序正しく適用します。
labels:
  - ブロックチェーン
---
# Amendment

Amendmentは、トランザクション処理における新機能またはその他の変更を表します。

Amendmentシステムは、XRP Ledger上のトランザクション処理に影響を与える変更を合意形成プロセスを用いて承認します。完全に機能するトランザクション処理の変更は、Amendmentとして提出され、バリデータはその変更について投票します。もしAmendmentが2週間にわたって80%超の支持を得た場合、そのAmendmentは可決され、その後のすべてのレジャーバージョンに変更が恒久的に適用されます。可決されたAmendmentを無効にするには、別の新たなAmendmentが必要です。

**注記:** トランザクションプロセスを変更するバグ修正にも、Amendmentが必要です。

<!-- Amendmentチュートリアルに移動します。
すべてのAmendmentには、16進数の一意な短い名前があります。短い名前は読みやすくするためだけのものです。サーバは同じ Amendment IDを表すのに異なる名前を使うことができ、その名前が一意であることは保証されていません。Amendment IDは、Amendmentの短い名前のSHA-512Halfハッシュでなければなりません。
-->

## Amendmentプロセス

[XRP Ledgerのコードに貢献する](/resources/contribute-code/index.md)のトピックでは、XRP Ledgerのアイデアから有効化までのワークフローを説明しています。

Amendmentのコードがソフトウェアリリースに組み込まれた後、それを有効にするプロセスはXRP Ledgerネットワーク内で行われ、レジャーは _フラグ_ レジャーごとに(通常約15分間隔で)Amendment状況をチェックします。

256番目毎のレジャーは、**フラグ**レジャーと呼ばれます。フラグレジャーは特別な内容を持っているわけではありませんが、フラグレジャーの前後ではAmendment作業が行われます。

1. **フラグレジャー -1:** `rippled`バリデータが検証メッセージを送信するとき、彼らは自身でAmendmentへの投票も送信します。
2. **フラグレジャー:** サーバは、信頼できるバリデータからの投票を処理します。
3. **フラグレジャー +1:** サーバは`EnableAmendment`疑似トランザクションを挿入し、発生したと思われることに基づいてフラグを立てます。
    * `tfGotMajority`フラグは、そのAmendmentが80%超の支持を得ていることを意味します。
    * `tfLostMajority`フラグはAmendmentへの支持が80%以下になったことを意味します。
    * フラグなしは、Amendmentが有効であることを意味します。

    **注記:** Amendmentが有効化されるために必要な2週間の期間に達したのと同一のレジャーで、80%の支持を失う可能性があります。このような場合、両方のシナリオで `EnableAmendment`擬似トランザクションが追加されますが、最終的にそのAmendmentは有効になります。

4. **フラグレジャー +2:** Amendmentが有効になった場合、このレジャー以降のトランザクションに適用されます。


## Amendment投票

`rippled`の各バージョンは、[既知のAmendment](/resources/known-amendments.md)のリストとそれらのAmendmentを実装するためのコードでコンパイルされています。`rippled`バリデータのオペレータは、各Amendmentに投票するようにサーバを設定し、いつでも変更することができます。オペレータが投票を選択しない場合、サーバはソースコードで定義されたデフォルトの投票を使用します。

**注記:** デフォルトの投票はソフトウェアのリリースごとに変更される可能性があります。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.8.1" %}更新: rippled 1.8.1{% /badge %}

Amendmentが有効になるには、信頼できるバリデータの80%超から2週間の支持を得なければなりません。支持率が80%以下となると、そのAmendmentは一時的に却下され、再び2週間の支持が必要となります。Amendmentは、恒久的に有効になるまで、何度でも過半数を獲得したり失ったりすることができます。

有効化されずにソースコードが削除されたAmendmentは、ネットワークによって**撤回**されたとみなされます。


### Amendmentブロックされたサーバ
<a id="amendment-blocked"></a>

AmendmentブロックはXRP Ledgerデータの正確性を守るためのセキュリティ機能です。Amendmentが有効になると、Amendmentのソースコードなしで以前のバージョンの`rippled`を実行しているサーバは、ネットワークのルールを認識できなくなります。レジャーデータを推測して誤って解釈するのではなく、これらのサーバは**Amendmentブロック**された状態になります。Amendmentブロック状態のサーバは次のことが行えません。

* レジャーのバリデータの判断
* トランザクションの送信または処理
* 合意プロセスへの参加
* Amendmentへの投票

`rippled`サーバの投票設定は、そのサーバがAmendmentブロックされることに影響を与えません。`rippled`サーバは常に他のネットワークで有効になっているAmendmentに従うので、ブロックは単にルールの変更を認識するコードを持っているかどうかに基づいています。つまり、異なるAmendmentが有効になっている並列ネットワークにサーバを接続した場合も、Amendmentブロックされる可能性があるということです。例えば、XRP Ledgerの開発ネットでは通常、実験的なAmendmentが有効になっています。最新のプロダクションリリースのコードを使用している場合、あなたのサーバには実験的なAmendmentのコードが存在しない可能性が高いです。

最新バージョンの`rippled`にアップグレードすることで、Amendmentブロックされたサーバのブロックを解除することができます。


### AmendmentブロックされたClioサーバ
<a id="amendment-blocked-clio-servers"></a>

Clioサーバが台帳データのロード中に未知のフィールドに遭遇した場合、Amendmentブロックが発生することがあります。これは、Clioのビルド時に使用された`libxrpl`の依存ファイルにそれらのフィールドが存在しない場合に発生します。Amendmentブロックを解除するには、互換性のある`libxrpl`でビルドされた新しいClioリリースにアップグレードしてください。

## Amendmentの削除

Amendmentを有効にすると、修正前の動作のソースコードは`rippled`に残ります。検証のためにレジャーの結果を再構築するなど、古いコードを保持するユースケースはありますが、Amendmentとレガシーコードの追跡は時間の経過とともに複雑さを増していきます。

[XRP Ledger Standard 11d](https://github.com/XRPLF/XRPL-Standards/discussions/19)では、古いレジャーと関連する以前のレジャーのコードを破棄するプロセスを定義しています。メインネット上でAmendmentが2年間有効である場合、古いコードは削除することができます。Amendmentは自動的にコアプロトコルの一部となり、その後は追跡されず、Amendmentとして扱われず、Amendment前のコードはすべて削除されます。


## 関連項目

- **コンセプト:**
    - [コンセンサスについて](../consensus-protocol/index.md)
- **チュートリアル:**
    - [バリデータとしてrippledを実行](../../infrastructure/configuration/server-modes/run-rippled-as-a-validator.md)
    - [Amendment投票機能の設定](../../infrastructure/configuration/configure-amendment-voting.md)
    - [XRP Ledgerのコードへの貢献](/resources/contribute-code/index.md)
- **リファレンス:**
    - [既知のAmendment](/resources/known-amendments.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
