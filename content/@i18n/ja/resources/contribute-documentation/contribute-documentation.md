---
html: contribute-documentation.html
parent: resources.html
blurb: XRP Ledgerドキュメントのコントリビューションガイドです。
---
# ドキュメントへの貢献

XRP Ledger開発者ポータルへの貢献を検討いただきありがとうございます！


私たちは、あなたが興味を持ってくださっていることにとても感動しています。XRP Ledger(XRPL)へ貢献することは、XRPLついて学ぶ素晴らしい機会です。

私たちはあなたのプルリクエストを喜んでレビューします。プロセスをできるだけ円滑に進めるため、このドキュメントを読み、記載されているガイドラインに従ってください。

## 当サイトについて

XRPL Dev Portalでは、開発者が開発を開始するためのサンプルコードやその他の情報を含む、XRP Ledgerの包括的なドキュメントを提供しています。

本プロジェクトの公式リポジトリは<https://github.com/XRPLF/xrpl-dev-portal>となっています。投稿の著作権はそれぞれの投稿者に帰属しますが、MIT[ライセンス](https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE)の下で提供されなければなりません。



## リポジトリの構成

- [assets/](https://github.com/XRPLF/xrpl-dev-portal/tree/master/assets) - サイトのテンプレートで使用される静的ファイル。
- [content/](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content) - ドキュメントを構築するために使用されるソースファイル。ほとんどがMarkdownです。
    - [content/\_code-samples/](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples) - ドキュメントで使用または参照されているコードサンプル。可能な限り、これらは完全に機能する/実行可能なスクリプトです。
    - [content/\_img-sources/](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_img-sources) - ドキュメントで使用されている画像の元ファイル。`.uxf`ファイルは[Umlet](https://www.umlet.com/)で作成されたダイアグラムです。
    - [content/\_snippets/](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_snippets) - Dactylプリプロセッサを使用して、他のコンテンツファイルに挿入される再利用可能なMarkdownテキストの断片。
- [img/](https://github.com/XRPLF/xrpl-dev-portal/tree/master/img) - ドキュメントコンテンツで使用される画像。
- [template/](https://github.com/XRPLF/xrpl-dev-portal/tree/master/template) - HTMLを構築するためのテンプレートファイル。
- [tool/](https://github.com/XRPLF/xrpl-dev-portal/tree/master/tool) - フィルター、スタイルチェッカー・ルール等のスクリプト。
- [styles/](https://github.com/XRPLF/xrpl-dev-portal/tree/master/styles) - assetsフォルダにCSSファイルを生成するための元ファイル(SCSS)。
- [`dactyl-config.yml`](https://github.com/XRPLF/xrpl-dev-portal/blob/master/dactyl-config.yml) - サイトのメタデータを含むメイン設定ファイル。設定ファイルのフォーマットについては、[設定フォーマット](#設定ファイルのフォーマット)を参照してください。

## プルリクエストが承認されるための条件

レビューやマージが承認される前に、それぞれのプルリクエストは以下の条件を満たしていなければなりません。
- インテグレーションテストに合格すること。
- レビューの準備が整うまで、[Draft](https://github.blog/2019-02-14-introducing-draft-pull-requests/)としてください。
- このリポジトリの[コード規約](https://github.com/XRPLF/xrpl-dev-portal/blob/master/CODE_OF_CONDUCT.ja.md)を遵守してください。

## Dactylのセットアップ

ポータルは[Dactyl](https://github.com/ripple/dactyl)を使用して構築されています。

Dactylには[Python 3](https://python.org/)が必要です。[pip](https://pip.pypa.io/en/stable/)を使ってインストールしてください：

```
pip3 install dactyl
```

## サイトの構築

このリポジトリでは、[**Dactyl**](https://github.com/ripple/dactyl)を使用して、すべてのドキュメントのHTMLをビルドしています。[Dactylのセットアップ](#dactylのセットアップ)を行った後、プロジェクトのルートディレクトリからサイトをビルドすることができます。

```
dactyl_build
```

生成されたコンテンツは`out/`ディレクトリに出力されます。これらのコンテンツはウェブブラウザでファイルとして開いたり、ウェブサーバで静的コンテンツとして扱うことができます。

ルートディレクトリからリンクチェックやスタイルチェックを実行することもできます。

リンクチェックは出力フォルダを空にしてからビルドしてください。

```
dactyl_link_checker
```

スタイルチェックは実験的なものです。

```
dactyl_style_checker
```

## 設定ファイルのフォーマット

このリポジトリでは、`dactyl-config.yml`ファイルのメタデータとページの[frontmatter](https://dactyl.link/frontmatter.html)を使って、ヘッダー、フッター、サイドバー、パンくずリストなどのナビゲーション要素を生成します。

新しいページを追加する場合、`dactyl-config.yml`ファイルのpages配列の適切な位置に追加する必要があります。追加例は次のようになります。

```yaml
    -   md: concepts/the-rippled-server/the-rippled-server.md
        targets:
            - en
            - ja # 翻訳コンテンツがない場合、全てのターゲットを対象とします。
```

Markdownファイル自体は、以下のようなfrontmatterで始まる必要があります。

```yaml
---
html: the-rippled-server.html
parent: concepts.html
#template: pagetype-category.html.jinja
blurb: rippled is the core peer-to-peer server that manages the XRP Ledger. This section covers concepts that help you learn the "what" and "why" behind fundamental aspects of the rippled server.
---
```

少なくとも、ほとんどのページには `html`、`parent`、`blurb` フィールドが必要です(さらに、設定ファイルでは`md`フィールドと`targets`フィールドも必要です)。ここに、またはページの設定ファイルのエントリに任意のキーと値のペアを記述することができますが、以下のものが関係しています。

### 規約

ページを作成する際には、以下の規約に従ってください。

- HTMLのファイル名とMDのファイル名は、拡張子を除いて完全に一致していなければなりません。
- ファイル名は"and"や"the"のような単語を含め、ページのタイトルと密接に一致する必要がありますが、スペースや句読点の代わりにハイフンを使用し、すべて小文字にする必要があります。例えば、`cash-a-check-for-an-exact-amount.md`のようにします。ページのタイトルを変更した場合は、ファイル名も変更する必要があります。(すでに別のURLで公開されている場合は、古いURLからのリダイレクトを残してください)
- 常にh1ヘッダーでページを始めます。
- ページの一番上のh1アンカーにはリンクせず、アンカーなしでページ自体にリンクしてください。これは翻訳時のリンク切れを防ぐのに役立ちます。以降のヘッダーへのリンクは問題ありません。
- ページのタイトルに書式( _italics_ や`code font`など)を使わないでください。
- Markdownファイルのテキストを折り返さないでください。
- コードサンプルの場合、行は80文字以下になるようにしてください。
- 迷ったら、[Ciro SantilliのMarkdownスタイルガイド (Writability Profile)](https://cirosantilli.com/markdown-style-guide/)に従ってください。
- ランディングページはサブフォルダに入れ、フォルダと同じファイル名とします。例えば、"Accounts"ページグループのランディングページは`accounts/accounts.md`で、HTMLファイル名は`accounts.html`です。

    **注意:** `index.md`は利用しないでください。

- Markdownやコードサンプルでは、インデントにタブ文字を使用しないでください。**JavaScript**のコードサンプルでは、1字下げにつき2個のスペースを使用してください。

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
| XRP Ledger    | Ripple, リップル, Ripple Network, リップルネットワーク, RCL | XRP Ledgerは、過去に様々な場面で「リップルネットワーク」や「リップルコンセンサスレジャー」あるいは「RCL」と呼ばれていました。これらの名称は、コアサーバーのリファレンス実装を開発しているRipple(Ripple Labs)の社名と類似しているため、紛らわしく、廃止されました。 |
| XRPL              | XRPL | _XRP Ledger_ の略です。_XRPL_ は不明瞭で、_XRP_ のタイプミスのように見えることがあります。 |

## Frontmatterのフィールド

このリポジトリのMarkdownファイルのfronmatterは任意のキーと値のペアを含むことができます。以下のフィールドは特定の用途や意味を持ちます。

| フィールド             | 型               | 内容                                |
|:---------------------|:-----------------|:-----------------------------------|
| `html`               | String           | ページの出力ファイル名。`.html`で終わり、ターゲット内で一意でなければなりません。翻訳版のページでは、ファイル名は英語版のページと同じにしてください。 |
| `parent`             | String           | ページの「親」ページの`html`の値。このページがナビゲーションのどこに表示されるかを示します。 |
| `blurb`              | String           | ページの要約文(プレーンテキストのみ)。ランディングページやソーシャルメディア上でリンクを展開する際のメタデータなど、さまざまな場所に表示されます。 |
| `name`               | String           | ページ名(プレーンテキストのみ)。 Markdownコンテンツのあるファイルでは、Dactylがコンテンツの最初の行のヘッダーから自動的に検出できるため、これを省略する必要があります。これは通常、Markdownファイルを持たないランディングページやその他の特別なページでのみ提供されます。 |
| `template`           | String           | このページで使用するテンプレートファイルのファイル名(`template/`ディレクトリ内)。ほとんどのページはデフォルトのテンプレートを使用します。`pagetype-category.html.jinja`テンプレートは最後に子ページのリストを表示します。特別な、あるいは特にユニークなレイアウトを持つページには、個別のテンプレートが必要になることがあります(通常、`page-`で始まります)。 |
| `status`             | String           | XRP Ledgerメインネットでまだ有効になっていない修正に関連するページでは、`not_enabled`を使用します。これにより、ナビゲーションのページの横にツールチップ付きの"フラスコ"バッジが表示されます。 |
| `nav_omit`           | Boolean          | ナビゲーション要素にこのページを表示しないようにするには`true`を使用します。 |
| `top_nav_omit`       | Boolean          | ページトップのドロップダウンナビゲーションに表示しないようにするには、`true`を使用します。 |
| `top_nav_level`      | Number           | トップナビのドロップダウンでページのインデントレベルを調整します。レベル`2`は、ドロップダウン内でその上のページの子のように表示されるようにインデントされます。 |
| `sidebar`            | String           | U左右のサイドバーを非表示にするには、`disabled`を使用します(ページがベーステンプレートから派生したテンプレートを使用している場合)。 |
| `fb_card`            | String           | Facebookでこのページへのリンクを展開する際に使用する画像のファイル名（`assets/img/`内）。 |
| `twitter_card`       | String           | Twitterでこのページへのリンクを展開する際に使用する画像のファイル名（`assets/img/`内）。 |
| `redirect_url`       | String           | `template: pagetype-redirect.html.jinja`でのみ使用します。ユーザがこのページに移動したときに、指定されたURLに自動的にリダイレクトします。 |
| `cta_text`           | String           | このページにリンクする「call to action」ボタンに表示されるテキスト(特別なランディングページにて表示されます)。 |
| `curated_anchors`    | Array of Objects | 子ページと同様に、ランディングページに表示するためのアンカーです。配列の各オブジェクトは、人間が読める`name`フィールド(`"Available Modes"`など) と、リンク先のHTML IDを持つ`anchor`フィールド(`"#available-modes"`など)を持つ必要があります。 |
| `skip_spell_checker` | Boolean          | `true`を使用すると、Dactylのスタイルチェッカーがこのページのスペルチェックをスキップします。 |
| `filters`            | Array of Strings | このページで使用する追加フィルタのリストです。[フィルタ](https://github.com/ripple/dactyl/blob/master/README.md#filters)はPythonスクリプトで、ページ内容の事前または事後の追加処理を行います。 |
| `canonical_url`      | String           | クエリパラメータを受け取るページの正規URLを提供します。検索エンジンやその他のツールは、ページにリンクする際にこれを使用する可能性があります。 |
| `embed_xrpl_js`      | Boolean          | 最新版の[xrpl.js](https://js.xrpl.org)をこのページで読み込むには`true`を使用してください。 |
