---
html: contribute-documentation.html
parent: resources.html
seo:
    description: XRP Ledgerドキュメントのコントリビューションガイドです。
---
# ドキュメントへの貢献

XRP Ledger開発者ポータルへの貢献を検討いただきありがとうございます！


私たちは、あなたが興味を持ってくださっていることにとても感動しています。XRP Ledger(XRPL)へ貢献することは、XRPLついて学ぶ素晴らしい機会です。

私たちはあなたのプルリクエストを喜んでレビューします。プロセスをできるだけ円滑に進めるため、このドキュメントを読み、記載されているガイドラインに従ってください。

## 当サイトについて

XRPL Dev Portalでは、開発者が開発を開始するためのサンプルコードやその他の情報を含む、XRP Ledgerの包括的なドキュメントを提供しています。

本プロジェクトの公式リポジトリは<https://github.com/XRPLF/xrpl-dev-portal>となっています。投稿の著作権はそれぞれの投稿者に帰属しますが、MIT[ライセンス](https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE)の下で提供されなければなりません。

## リポジトリの構成

- `_api-examples/` - APIリクエストやレスポンスのサンプル(特にドキュメントで使用されているもの)
- `_code-samples/` - ドキュメントで使用されているサンプルコード(可能な限り完全に動作するスクリプト)
- `@i18n` - 英語以外の翻訳コンテンツ
- `@theme` - MarkdocのコンテンツやReactのカスタムページで使用されるコンポーネントのオーバーライドやカスタムコンポーネント
- `about/` - 概要セクションのソースファイル
- `blog/` - XRPL開発者ブログのソースファイル
- `community/` - コミュニティセクションのソースファイル
- `docs/` - ドキュメントをビルドするためのソースファイル(ほとんどがMarkdownファイル)
    - `docs/_snippets/` - ドキュメント内で再利用可能なテキスト
    - `docs/img/` - ドキュメント内で利用する図やその他の画像
    - `docs/img/_sources/` - ドキュメント内で利用する画像のソースファイル(存在する場合)
- `locale/` - **廃止** 以前利用されていた翻訳用のファイル
- `resources/` - リソースセクションのソースファイル
- `shared/` - CodeMirrorなどの依存関係の設定ファイル
- `static/` - Webサイトのテンプレートやテーマで使用される静的ファイル
- `styles/` - カスタムCSS用のSCSSのソースファイル
- `redirects.yaml` - 以前利用されていたパスから現在のコンテンツへのリダイレクトの定義
- `redocly.yaml` - Webサイトにの主要な設定ファイル
- `sidebars.yaml` - ドキュメントおよびリソースセクションのサイドバーの定義
- `top-nav.yaml` - ナビゲーションバーの定義


## プルリクエストが承認されるための条件

レビューやマージが承認される前に、それぞれのプルリクエストは以下の条件を満たしていなければなりません。

- インテグレーションテストに合格すること。
- レビューの準備が整うまで、[Draft](https://github.blog/2019-02-14-introducing-draft-pull-requests/)としてください。
- このリポジトリの[コード規約](https://github.com/XRPLF/xrpl-dev-portal/blob/master/CODE-OF-CONDUCT.ja.md)を遵守してください。

## Redoclyのセットアップ

このポータルはRedocly Realmを使用して構築されています。Realmは現在クローズドベータ版です。ローカル開発環境にインストールするには、Node.js(バージョン20が推奨)とNPMが必要です。

次のコマンドを実行して、Realmとその他の必要な依存関係をインストールできます。

```sh
npm i
```

## サイトの構築

依存関係のインストール後、次のコマンドを実行してローカル開発サーバを起動できます。

```sh
npm run start
```

ブラウザでhttp://localhost:4000/にアクセスしてプレビューを表示できます。


## 設定ファイルのフォーマット

Realmの設定ファイルは、サイト内のナビゲーション要素を生成するために使用されます。これには、ヘッダー、フッター、サイドバー、パンくずリストが含まれます。

新しいページを追加する場合、そのページを`sidebars.yaml`ファイルに追加する必要があります。ドキュメントとブログ用のサイドバーのファイルがあります。以下は、ネストされた子ページがないページの項目の例です。

```yaml
- page: concepts/consensus-protocol/index.md
```

Markdownファイルのページは、[frontmatterスタンザ](#frontmatterのフィールド)で始まる必要があります。

### 規約

ページを作成する際には、以下の規約に従ってください。

- HTMLのファイル名とMDのファイル名は、拡張子を除いて完全に一致していなければなりません。ファイル名は"and"や"the"のような単語を含め、ページのタイトルと密接に一致する必要がありますが、スペースや句読点の代わりにハイフンを使用し、すべて小文字にする必要があります。例えば、`cash-a-check-for-an-exact-amount.md`のようにします。ページのタイトルを変更した場合は、ファイル名も変更する必要があります。(すでに別のURLで公開されている場合は、古いURLからのリダイレクトを残してください)
    - カテゴリ内のページは、そのカテゴリの名前のサブフォルダに配置されるべきですが、親ディレクトリにも同じ単語が含まれている場合は、より簡潔にすることができます。ファイル名は`index.md`で、タイトルはフォルダ名に似ている必要があります。例えば、"Protocol Reference"のインデックスページは`references/protocol/index.md`にあります。
- 常にh1ヘッダーでページを始めます。
- ページの一番上のh1アンカーにはリンクせず、アンカーなしでページ自体にリンクしてください。これは翻訳時のリンク切れを防ぐのに役立ちます。以降のヘッダーへのリンクは問題ありません。
- ページのタイトルに書式( _斜体_ や`コード`など)を使わないでください。
- Markdownファイルのテキストを折り返さないでください。
- コードサンプルの場合、1行は80文字以下になるようにしてください。
- 迷ったら、[Ciro SantilliのMarkdownスタイルガイド (Writability Profile)](https://cirosantilli.com/markdown-style-guide/)に従ってください。
- Markdownやコードサンプルでは、インデントにタブ文字を使用しないでください。**JavaScript**のコードサンプルでは、1字下げにつき2個のスペースを使用してください。
- テキストファイルは改行文字で終わるようにしてください。(一部のテキストエディタはこれを自動的に処理します。)ファイルはBOMなしのUTF-8でエンコードしてください。

### 新機能

新機能を文書化する場合、その機能が導入されたプログラムのバージョンを示すバッジを含めてください。バッジタグは以下の構造です。

`{badge href="myurl" date="<リリース日>"}新規: <プログラム> <バージョン番号>{% /badge%}`

例えば次のようなバッジ定義になります。

`{% badge href="https://github.com/XRPLF/clio/releases/tag/2.0.0" date="February 18, 2024" %}新規: Clio v2.0.0{% /badge %}`

次のように表示されます。 {% badge href="https://github.com/XRPLF/clio/releases/tag/2.0.0" date="February 18, 2024" %}新規: Clio v2.0.0{% /badge %}

When updating a feature, replace _New in:_ with _Updated in:_. For example, the following badge definition:

機能の更新の場合、_新規:_ を _更新:_ に置き換えてください。例えば、次のバッジ定義となります。

`{% badge href="https://github.com/XRPLF/clio/releases/tag/2.1.0" date="May 4, 2024" %} 更新: Clio v2.1.0{% /badge %}`

次のように表示されます。 {% badge href="https://github.com/XRPLF/clio/releases/tag/2.1.0" date="May 4, 2024" %} 更新: Clio v2.1.0{% /badge %}

2年以上前の新規/更新バッジは削除するのがベストプラクティスです。

### 技術用語

以下の単語やフレーズを説明通りに使用してください。

| 用語              | 避けるべき用語    | 備考 |
|-------------------|----------------|-------|
| API, APIs         | API's, RPC | Application Programming Interface (アプリケーション・プログラミング・インターフェース)、ソフトウェアが他のソフトウェアと接続するための機能と定義のセット。 |
| コアサーバ, XRP Ledgerのコアサーバ | `rippled` | `rippled`という名前は近い将来廃止される可能性が高いので、より一般的な名前で呼ぶことを推奨します。必要なときは、`rippled` をすべて小文字で、コードフォントで呼んでください。(発音は "リップルディー" で、"d" は UNIX の伝統に従って"daemon"を意味します)。
| 金融機関 | 銀行, FI, PSP (決済サービスプロバイダ) | この用語は、_銀行_ や他の用語よりも幅広いビジネスを包含し、業界の専門用語の理解に依存しません。 |
| レジャーエントリ | レジャーオブジェクト, ノード | XRP Ledgerの状態データ内の単一のオブジェクト。_レジャーオブジェクト_ という用語は、これらの一つを指すこともあれば、レジャー全体を指すこともあります。レジャーの状態データはグラフとして想定できるため、_ノード_ という用語が使われることもありましたが、_ノード_ には他の用途もあるため、混乱を招きます。 |
| 流動性提供者 | マーケットメイカー | 2つの通貨または資産間の売買を提供し、多くの場合、取引間の価格差から利益を得る企業または個人。マーケットメーカーという用語は、法域によっては特定の法律上の定義があり、すべての同じ状況で適用されるとは限りません。 |
| 悪質業者   | ハッカー | 個人、組織、または自動化されたツールなどによる、機密情報の取得、暗号化の解除、サービスの拒否、その他の安全なリソースへの攻撃を試みる可能性のあるもの。 |
| PostgreSQL        | Postgres | リレーショナルデータベース・ソフトウェアの特定のブランド。非公式な短いバージョンではなく、常に完全な名前を使用します。 |
| オーダーブック      | オファーブック | マッチングされ約定されるのを待っているトレード注文のコレクション。通常は取引レートごとにソートされています。 |
| サーバ             | ノード | サーバとは、ソフトウェアやハードウェアのことで、特にXRP Ledgerのピアツーピアネットワークに接続するものを指します。_ノード_ という用語はこの目的のために使われることもありますが、グラフのエントリやJavaScriptインタプリタであるNode.jsなど、他の意味でも多用されます。 |
| ステーブルコイン発行者 | ゲートウェイ | 発行者とは、XRP Ledgerにおいてトークンを発行する組織です。ステーブルコインとは、発行者が外部の資産（例えば不換紙幣）に完全に裏付けられていることを約束しているトークンのことで、ステーブルコインの発行者は、その2つの資産を（場合によっては手数料を払って）交換する入出金操作を提供します。以前は、このユースケースを表現するために（特にリップル社によって）_ゲートウェイ_ という用語が使用されていましたが、業界の他の部分は代わりに _ステーブルコイン発行者_ を採用しました。 |
| トランザクションコスト  | トランザクション手数料 | XRP Ledgerでトランザクションを送信するために消費されるXRPの金額。これはトランザクションの`Fee`フィールドで指定されますが、_手数料_ という用語は誰かにお金を支払うことを意味するため、_コスト_ の方が望ましいです。 |
| トークン           | IOU, issuances, issues, 発行済み通貨 | XRP Ledgerのトークンは、_IOU_ という名前から想像されるように、レジャーの外部にある価値を表すことはできません。必要であれば、_代替可能トークン_ を使用して、非代替性トークン(NFT)と区別してください。 |
| ウォレット          | ウォレット | 文脈によっては、_ウォレット_ はハードウェア、ソフトウェア、暗号鍵ペア、またはオンラインサービスを指します。意味が明確になるように十分な文脈を提供するか、_キーペア_ や _クライアントアプリケーション_ などの別の表現を使用してください。 |
| XRP               | Ripple, リップル | XRP Ledgerのネイティブデジタルアセットまたは暗号通貨。XRPはレジャーの外部の価値を表すトークンではありません。 |
| XRP Ledger    | Ripple, リップル, Ripple Network, リップルネットワーク, RCL | XRP Ledgerは、過去に様々な場面で「リップルネットワーク」や「リップルコンセンサスレジャー」あるいは「RCL」と呼ばれていました。これらの名称は、コアサーバのリファレンス実装を開発しているRipple(Ripple Labs)の社名と類似しているため、紛らわしく、廃止されました。 |
| XRPL              | XRPL | _XRP Ledger_ の略です。_XRPL_ は不明瞭で、_XRP_ のタイプミスのように見えることがあります。 |

## Frontmatterのフィールド

***Note: Realmのfrontmatter仕様の詳細は完全には文書化されていません。Realmがクローズドベータを終了したら、リンクを更新する必要があります。***

MarkdownファイルのFrontmatterには、以下のような内容が含まれます。

```yaml
---
metadata:
  indexPage: true # 自動生成された子ページのリストを含めたい場合、追加してください。
seo:
  description: rippledはXRP Ledgerを管理するコアとなるピアツーピアサーバです。このセクションでは、rippledサーバの基本的な機能の背景にある「要素」と「その理由」を学ぶのに役立つ概念について説明します。
---
```

サイト内の一部のページには、以前の(Dactyl)ツールチェーンからのメタデータが残っている場合があります。これらのフィールドは効果がないため、新しいページから省略することができます。

### 次へと前へのボタン

ドキュメントとブログページには、ページの下部に「次へ」ボタンと「前へ」ボタンがあります。

これらのボタンが不要な場合は、ページのfrontmatterを更新して無効にすることができます。

```yaml
---
theme:
  navigation:
    nextButton:
      hide: true
---
```

## Markdocのコンポーネント

これらのファイルは[Markdoc](https://markdoc.dev/)で処理されるため、`{% ... %}`構文で特別なタグを含めることができます。Redoclyの組み込みタグに加えて、このリポジトリには`/@theme/markdoc/`に定義されたいくつかのカスタムタグがあります。

### グラフィック

`/docs/img`ディレクトリにグラフィックを保存します。グラフィックを埋め込むには、次の構文を使用します。

`![image_description](/docs/img/my_image.png)`

例えば、`![XRPL財団のロゴ](/docs/img/xrplf-logo.png)`は次のように表示されます。

![XRPL財団のロゴ](/docs/img/xrplf-logo.png)

### ビデオ

ビデオはYouTubeに保存されます。アップロード後、埋め込み手順をコピーしてドキュメントに貼り付けることができます。

コンテンツにYouTubeビデオを埋め込むには、次の手順に従います。

1. YouTubeにビデオをアップロードします。
2. ビデオページの**共有**ボタンをクリックします。
3. **埋め込む**をクリックします。
4. ポップアップ右下の**コピー**をクリックします。
5. コンテンツに`<iframe>`要素を貼り付けます。

例えば、_Send Checks_ ビデオを埋め込むためのコードは次の通りです。

```
<iframe width="560" height="315" src="https://www.youtube.com/embed/5zRBC7dGSaM?
si=Mbi8diaFTDR2fc20" title="YouTube video player" frameborder="0" allow="accelerometer;
autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
```

<iframe width="560" height="315" src="https://www.youtube.com/embed/5zRBC7dGSaM?
si=Mbi8diaFTDR2fc20" title="YouTube video player" frameborder="0" allow="accelerometer;
autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

### テーブル

Markdocは、テーブルを生成するための3つの異なる構文スタイルを提供します。

ほとんどの場合、列を区切るためにパイプ文字(|)を使用し、ハイフン3つ以上(---)を使用して列ヘッダを作成します。

```
|          | Head 1 |
| -------  | ------ |
| Label 1  | Val 1  |
```

次のように表示されます。

|          | Head 1 |
| -------  | ------ |
| Label 1  | Val 1  |

セルの幅は同じである必要はありません。自動的に列を整列し、必要に応じてテキストを折り返します。

```
| Key | Value |
| --- | ----- |
| Name | H. G. Wells |
| Genre | Science Fiction |
| Hyperbole | The greatest story ever told! No one has ever written anything more important than this Victorian era classic. Oh, how swells the heart to ponder the heady philosophies introduced therein! |
```

| Key | Value |
| --- | ----- |
| Name | H. G. Wells |
| Genre | Science Fiction |
| Hyperbole | The greatest story ever told! No one has ever written anything more important than this Victorian era classic. Oh, how swells the heart to ponder the heady philosophies introduced therein! |

ヘッダ行にコロンを使用して、列を左寄せ(:--)、中央寄せ(:-:)、または右寄せ(--:)に配置します。

```
| Model | Color | Price |
| :-: | :--  | --:  |
| Protexra | Electric Blue | 50,000 XRP |
| Joatic | Hot Pink | 165,000 XRP |
| Zhanu | Neon Green | 234,000 XRP |
```

| Model | Color | Price |
| :-: | :--  | --:  |
| Protexra | Electric Blue | 50,000 XRP |
| Joatic | Hot Pink | 165,000 XRP |
| Zhanu | Impetuous Green | 1,728,000 XRP |

左の列はデフォルトで太字になります。左の列に太字のラベルを表示したくない場合は、左の列を空にして、テーブルを1列目から始めてください。

```
|     | French | English | German |
| --- | ---    | ---     | ---    |
|     | Fromage | Cheese | Käse |
|     | Maux d'estomac | Stomach ache | Magenschmerzen |
|     | Cornichon | Pickle | Essiggurke |
```

|     | French | English | German |
| --- | ---    | ---     | ---    |
|     | Fromage | Cheese | Käse |
|     | Maux d'estomac | Stomach ache | Magenschmerzen |
|     | Cornichon | Pickle | Essiggurke |

可能な限り、これらの基本的なテーブルを使用してください。上記の例で提供されていない特別なフォーマットが本当に必要な場合は、HTML構文を使用してテーブルを作成できます。

### リンク

リンクは`[<リンクテキスト>](<URL>)`の構文を使用します。

例えば、次のように書きます。

`[XRPL.org](http://xrpl.org)で世界のあらゆる問題の解決策をご覧ください。`

次のように表示されます。

[XRPL.org](http://xrpl.org)で世界のあらゆる問題の解決策をご覧ください。

### 共通のリンク

共通的に引用されるページへのリンクを作成するには、`{% raw-partial file="/docs/_snippets/common-links.md /%}`タグをMarkdownファイルに追加し、`[account_infoメソッド][]`や`[Paymentトランザクション][]`などの参照スタイルのリンクを使用できます。common-linksファイルの内容はアルファベット順になっています。(以前はスクリプトで生成されていましたが、現在は手動で管理されています。)

### サンプルコード

サンプルコードを挿入する場合は、バッククォート(&#96;)文字でコードを囲みます。例えば:

&nbsp;&nbsp;&nbsp;&nbsp;私のお気に入りのメソッドは&#96;nft_info&#96;です。

次のように表示されます。

&nbsp;&nbsp;&nbsp;&nbsp;私のお気に入りのメソッドは`nft_info`です。

長いコードブロックの場合は、言語名に続いて3つのバッククォート(&#96;&#96;&#96;)を使用します。改行を入力し、サンプルコードを入力します。コードサンプルの最後に改行を入力し、3つのバッククォート(&#96;&#96;&#96;)でブロックを閉じます。

例えば、

&#96;&#96;&#96;javascript<br/>
&nbsp;&nbsp;&nbsp;&nbsp;const prepared = await client.autofill({<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"TransactionType": "Payment",<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Account": standby_wallet.address,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Amount": xrpl.xrpToDrops(sendAmount),<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Destination": standbyDestinationField.value<br/>
&nbsp;&nbsp;})
&#96;&#96;&#96;

次のように表示されます。

```javascript
  const prepared = await client.autofill({
    "TransactionType": "Payment",
    "Account": standby_wallet.address,
    "Amount": xrpl.xrpToDrops(sendAmount),
    "Destination": standbyDestinationField.value
  })
```

### 部分的なコンテンツ

頻繁に使用するテキストや、ドキュメント内の複数の場所で定期的に更新が必要なテキストがある場合は、再利用のために&#95;snippetファイルを作成できます。

`_snippet`ディレクトリにファイルを保存します。部分的なコンテンツを挿入するには、`{% partial file="<file url>" /%}`構文を使用します。

例えば、次のようなスニペット`/docs/_snippets/secret-key-warning.md`があります。

<blockquote>
{&#37; admonition type="warning" name="Caution" &#37;}<br/>
Never submit a secret key to a server you do not control. Do not send a secret key unencrypted over the network.<br/>
{% /admonition %}
</blockquote>

テキストを埋め込むには、`{% partial file="/docs/_snippets/secret-key-warning.md" /%}`タグを使用します。

例えば、

<blockquote>
There I was, happy as a lark, skipping through the daisies, when I shyly handed my secret
 key to my one true love.

{&#37; partial file="/docs/_snippets/secret-key-warning.md" /&#37;}

Alas, if only I had heeded that sage advice, I would not rue the day as I do today.
</blockquote>

次のように表示されます。

<blockquote>
There I was, happy as a lark, skipping through the daisies, when I shyly handed my secret key to my one true love.

{% partial file="/docs/_snippets/secret-key-warning.md" /%}

Alas, if only I had heeded that sage advice, I would not rue the day as I do today.
</blockquote>


{% child-pages /%}
