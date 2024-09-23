---
html: contribute-code.html
parent: resources.html
seo:
    description: XRP Ledgerプロトコルにどのように機能を実装するかを学びます。
labels:
  - ブロックチェーン
---
# コードへの貢献

XRP Ledgerを動かすソフトウェアはオープンソースです。誰でもダウンロードし、変更し、拡張し、調査することができます。もしあなたがコードに貢献したいのであれば、コミュニティと協力してあなたの変更の仕様を定義し、XRP Ledgerのプロトコルとブロックチェーンの一部になる前にコードをテストすることが重要です。

# コアサーバのソースコード

XRP Ledgerを動かすソフトウェアはオープンソースです。コミュニティが参加することで、より良いものが生まれます。[ドキュメント](/docs/)内の"[Source]"リンクから関連するソースコードに直接ジャンプしたり、GitHubでソースコードを閲覧することができます：

| XRP Ledger ソースコード  |                                                     |
|:-----------------------|:----------------------------------------------------|
| リポジトリ               | <https://github.com/XRPLF/rippled>                |
| ライセンス               | [Multiple; ISC (permissive)](https://github.com/XRPLF/rippled/blob/develop/LICENSE.md) |
| プログラム言語            | C++                                                 |

何から始めたらいいか分からないという方のために、Dev Null Productionsは、XRP Ledgerサーバ(`rippled`)のコア実装の仕組みや機能を説明した、詳細かつ充実した[**ソースコード・ガイド**](https://xrpintel.com/source)を提供しています。


## XRP Ledgerの規格

`rippled`に対する変更はXRP Ledger Standard (XLS)、つまり変更の仕様を特定し詳細に記述した文書によって管理されます。開発にコミットする前に、[XRPL-Standardsリポジトリ](https://github.com/XRPLF/XRPL-Standards/discussions)で議論を始める必要があります。これにより、コミュニティはあなたの変更に関して議論し、フィードバックを提供する機会を得ることができます。

**注記:*** バグ修正にはXLSは必要ありませんが、Amendmentが必要になる場合があります。

XLSの作成には独自のプロセスがありますが、簡単にまとめると次のようになります：

1. ディスカッションを開始し、フィードバックを集めます。
2. StandardリポジトリにXLSドラフトを作成します。
3. XLSドラフトを仕様候補として公開します。

詳細については、[XLS貢献ガイド](https://github.com/XRPLF/XRPL-Standards/blob/master/CONTRIBUTING.md) をご覧ください。


## Amendmentの実装

XLSドラフトを作成した後、その変更にAmendmentが必要かどうかを判断する必要があります。特に次のような**トランザクション処理**に影響する変更にはAmendment が必要です。

- レジャールールを変更し、異なる結果をもたらすもの。
- トランザクションの追加または削除。
- コンセンサスへの影響がある変更。

**注記:** 変更にAmendmentが必要ない場合、そのままコーディングとデプロイに進むことができます。

コードをAmendmentとして実装するには、次のファイルにAmendment情報を追加する必要があります。

- **Feature.cpp**:

  開発が完了するまで、`Supported`パラメータは`no`に設定してください。

  バグの修正の場合、`DefaultVote`パラメータを`yes`に設定する必要があります。

- **Feature.h**: `numFeatures` カウンタを増やし、`extern uint256 const` 変数を宣言します。


## コーディングとデプロイ

一般的な開発プロセスは以下の通りです。

1. コードを開発するためにはまず、[`rippled` リポジトリ](https://github.com/XRPLF/rippled) をフォークまたはブランチを作成します。

    **ヒント:** 何から始めたらいいかわからない場合は、_Dev Null Productions_ が詳細かつ充実した [`rippled` ソースコードガイド](https://xrpintel.com/source) を提供しています。

2. 単体テストと統合テストを実行します。独立した環境で作業をテストするにはスタンドアロンモードでサーバを実行するのが良いでしょう。

3. `XRPLF:develop`にプルリクエストを作成します。

    **Amendment向けの注記:** **Feature.cpp**の`Supported`パラメータを`yes`に更新します。

4. プルリクエストがXRP Ledgerのメンテナによって承認されると、あなたのコードは`develop`にマージされ、Devnet上で追加のテストを行うことができます。

    **Amendment向けの注記:**
    - `DefaultVote`パラメータはロックされます。
    - もしAmendmentに問題が見つかれば、Amendmentの修正と新しいPRの提出を再度行う必要があります。新しいPRでは`DefaultVote`を変更することができます。

年に4回、`develop`で承認されたPRからリリース候補がビルドされます。このパッケージはTestnetとMainnet上のいくつかのノードにデプロイされます。リリース候補に問題がなければ、コードは`master`にマージされ、メインネット上のノードはこのビルドにアップグレードできます。

6. 新しいAmendmentは合意形成プロセスを経て、バリデータがそのAmendmentを有効にするかどうかを投票します。


## コードのフローチャート

![コードのフローチャート](/docs/img/contribute-code-flowchart.png)


## 関連項目

- **コンセプト:**
    - [Amendment](../../docs/concepts/networks-and-servers/amendments.md)
