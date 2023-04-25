# コントリビューション

XRP Ledger開発者ポータルへのコントリビューションをご検討いただきありがとうございます。

ぜひ、皆様の力をお貸しくださいますようお願いいたします。ご協力いただくことで、XRP Ledger（XRPL）への理解を深めることができます。

また、XRPLと併せて、[インターレジャープロトコル（ILP）](https://interledger.org/)を学習することもおすすめいたします。ILPも[RippleX開発者エコシステム](https://ripplex.io)の一部です。

皆様からのプルリクエストをお待ちしております。プルリクエストのレビュー工程をできるだけ円滑に進めるためにも、本ドキュメントをお読みいただき、記載されているガイドラインに従ってください。

ご提供いただいたコードは、XRP Ledgerプロジェクトの著作物となり、MIT[ライセンス](LICENSE)に基づいて提供いたします。

## このサイトについて

XRPL開発者ポータルは、XRP Ledgerに関するドキュメントを幅広く提供します。これには、開発者がビルドを始めるためのサンプルコードなどの情報も含まれます。

## リポジトリーのレイアウト

- [assets/](assets/) - サイトのテンプレートに使用する静的ファイル。
- [content/](content/) - ドキュメントのビルドに使用するソースファイル。主にMarkdownです。
  - [content/\_code-samples/](content/_code-samples/) - ドキュメントに使用するか、ドキュメントで参照するコードサンプル。可能であれば、完全に機能するか実行可能なスクリプトです。
  - [content/\_img-sources/](content/_img-sources/) - ドキュメントで使用する画像のソースファイル。`.uxf`ファイルはすべて、[Umlet](https://www.umlet.com/)で作成された図です。
  - [content/\_snippets/](content/_snippets/) - 再利用可能なMarkdownテキストのまとまり。Dactylプリプロセッサーを使用して他のコンテンツファイルに組み込みます。
- [img/](img/) - ドキュメントのコンテンツに使用する画像。
- [tool/](tool/) - テンプレート、スタイルチェッカーのルール、その他スクリプト。
- [`dactyl-config.yml`](dactyl-config.yml) - メインの設定ファイル。すべてのドキュメントのメタデータが含まれます。規約についての詳細は、[設定の書式](#設定の書式)を参照してください。

## プルリクエストを成功させるための要件

プルリクエストがレビューまたはマージの対象になるためには、各プルリクエストが以下を満たしている必要があります。

- 継続的インティグレーションテストに合格している。
- レビューの準備ができるまでは[ドラフトのマークが付けられている](https://github.blog/2019-02-14-introducing-draft-pull-requests/)。
- このリポジトリーの[行動規範](CODE_OF_CONDUCT.md)に従っている。

## Dactylのセットアップ

このポータルは、[Dactyl](https://github.com/ripple/dactyl)を使用して構築されています。

Dactylには[Python 3](https://python.org/)が必要です。以下のようにして[pip](https://pip.pypa.io/en/stable/)でインストールしてください。

`sudo pip3 install dactyl`

## サイトのビルド

このリポジトリーでは、[**Dactyl**](https://github.com/ripple/dactyl)を使用して、すべてのドキュメントのHTML表示のバージョンをビルドできます。[Dactylのセットアップ](#dactylのセットアップ)が完了したら、プロジェクトのルートディレクトリーから以下のコマンドを使用してドキュメントをビルドできます。

```
dactyl_build
```

生成されたコンテンツが`out/`ディレクトリーに出力されます。これらのコンテンツは、ウェブブラウザーでファイルとして開くことも、ウェブサーバーで静的コンテンツとして提供することもできます。

同様に、ルートディレクトリーからリンクチェックやスタイルチェックを実行することもできます。

リンクチェックは、出力フォルダーを空にし、ドキュメントをビルドしてから実行する必要があります。

```
dactyl_link_checker
```

スタイルチェックは試験的なものです。

```
dactyl_style_checker
```

### 日本語サイトのビルド

ターゲットと出力先を指定してビルドしてください。

```
dactyl_build -t ja -o out/ja
```

日本語サイトの場合、生成されたコンテンツをウェブブラウザーでファイルとして開くことができません。ローカルHTTPサーバーやエディターの拡張機能(VSCodeであればLive Serverなど)を利用してください。

##### ローカルでHTTPサーバを利用する方法

1. `out`直下で次のコマンドを実施しサーバーを起動する

```
python -m http.server
```

2. ウェブブラウザーから`localhost`にアクセスする。
サーバー起動時にアサインされたポート番号を利用してください。

## 設定の書式

このリポジトリー内のテンプレートは`dactyl-config.yml`ファイルのメタデータを使用して、生成されたサイトをナビゲートする際のページ階層を生成します。ナビゲーションを正しく生成するには、ページの定義に適切なフィールドを含める必要があります。以下の例に、すべてのフィールドを指定したページを示します。
```
-   md: concept-authorized-trust-lines.md
    funnel: Docs
    doc_type: Concepts
    category: Payment System
    subcategory: Accounts
    targets:
        - local
```

ナビゲーションには、フィールド`funnel`、`doc_type`、`category`、および`subcategory`をこの順序（広範から詳細へ）で使用します。各階層では、新しい値が最初に記載されるページが、その階層の親かランディングとなります。（例えば、「Accounts」サブカテゴリーの親には`subcategory: Accounts`フィールドがあり、子より前に記載されている必要があります。）ランディングページの場合は、下位階層フィールドを省きます。（例えば、「Concepts」doc_typeのランディングページには、`doc_type`フィールドは必要ですが、`category`フィールドは不要です。）

**警告:** いずれかのフィールドに入力ミスがあると、ページがナビゲーションに表示されないか、誤った場所に表示されるおそれがあります。

規約として、親ページには、親である階層と同じ名前が必要です。（例えば、`Payment System`カテゴリーのランディングページの名前は`Payment System`である必要があります。）`md`をソースとするファイルの名前は、そのファイルの最初の行のヘッダーによって自動的に決まります。

Markdownソースコンテンツのないページの場合は、`md`行を省き、代わりに以下のフィールドを記載します。

| フィールド | 内容 |
|:----------|:----------|
| `name` | 人間が読めるページ名（プレーンテキストのみ） |
| `html` | ページの出力ファイル名`.html`で終わり、ターゲット内で一意である必要があります。 |

## 翻訳

XRP Ledger開発者ポータルは主に英語で記載されているため、通常は英語版が最新かつ正確なバージョンです。しかし、XRP Ledgerのソフトウェアとコミュニティーの利用者を拡大するため、このリポジトリーには翻訳版のドキュメントも含まれています。他の言語を理解するコミュニティーのメンバーの皆様には、どうか開発者ポータルのコンテンツを母国語に翻訳していただけますようお願いいたします。

`dactyl-config.yml`には、使用可能な各言語の「ターゲット」項目が含まれます。（2019年11月18日現在、使用可能な言語は英語と日本語です。）この項目には、テンプレートファイルで使用する文字列の辞書が含まれています。例:

```yaml
-   name: en
    lang: en
    display_name: XRP Ledger Dev Portal
    # These github_ fields are used by the template's "Edit on GitHub" link.
    #  Override them with --vars to change which fork/branch to edit.
    github_forkurl: https://github.com/XRPLF/xrpl-dev-portal
    github_branch: master
    strings:
        blog: "Blog"
        search: "Search site with Google..."
        bc_home: "Home"
        # ...
```

サポート対象の各言語のプロパティーをいくつか定義する最上位の`languages`リストもあります。各言語のショートコードは、[IETF BCP47](https://tools.ietf.org/html/bcp47)に沿ったものである必要があります。例えば、英語は「en」、スペイン語は「es」、日本語は「ja」、簡体字中国語は「zh-CN」、繁体字中国語（台湾で使用）は「zh-TW」になります。`display_name`フィールドでは、言語名をその言語で記載して定義します。`prefix`フィールドでは、その言語版のサイトへのハイパーリンクに使用されるプレフィックスを定義します。`languages`のサンプルの定義を以下に示します。

```yaml
languages:
   -   code: en
        display_name:English
        prefix: "/"
    -   code: ja
        display_name:日本語
        prefix: "/ja/"
```

同じ`dactyl-config.yml`ファイルに、XRP Ledger開発者ポータルの各コンテンツページの項目が記載されています。ページが翻訳されている場合は、翻訳ごとに別個の項目があり、その翻訳「ターゲット」にリンクされています。ページがまだ翻訳されていない場合は、すべての対象に英語版が使用されます。各ページで、HTMLファイル名（`html`フィールド）とナビゲーションフィールド（`funnel`、`doc_type`、`supercategory`、`category`、および`subcategory`。それぞれ、指定される場合）は、どの言語版のページでも同じである必要があります。翻訳版のページで内容の異なるフィールドは、以下のとおりです（いずれの場合においても、そのフィールドが項目で使用される場合に限ります）。

- **`name`** - ページのタイトル。通常は、Markdownソースファイルを使用しないランディングページや、[開発者用ツール](https://xrpl.org/dev-tools.html)などの独自のテンプレートを使用する特殊なページでのみ指定されます。通常、Markdownのファイルではこのフィールドが省かれます。Dactylはファイルの最初の行のヘッダーからタイトルを引き出すためです。
- **`md`** - ページのソースコンテンツとして使用するMarkdownファイル。規約として、翻訳したMarkdownソースファイルには英語版と同じファイル名を使用する必要があります。ただし、ファイルの拡張子は英語版のように`.md`のみでなく、`.{language code}.md`とする必要があります。例えば、日本語の翻訳ファイルは`.ja.md`で終わります。
- **`blurb`** - ページの要約。このテキストは主にcategoryランディングページで使用されます。

以下の例に、`server_info`メソッドページの英語の項目と日本語の項目を示します。

```yaml
    -   md: references/http-websocket-apis/public-api-methods/server-info-methods/server_info.md
        html: server_info.html
        funnel: Docs
        doc_type: References
        supercategory: rippled API
        category: Public rippled Methods
        subcategory: Server Info Methods
        blurb: Retrieve status of the server in human-readable format.
        targets:
            - en

    -   md: references/http-websocket-apis/public-api-methods/server-info-methods/server_info.ja.md
        html: server_info.html
        funnel: Docs
        doc_type: References
        supercategory: rippled API
        category: Public rippled Methods
        subcategory: Server Info Methods
        blurb: rippledサーバーについての各種情報を、人間が読めるフォーマットでサーバーに要求します。
        targets:
            - ja
```

翻訳されていないページの項目の例は以下のとおりです。

```yaml
    -   md: concepts/payment-system-basics/transaction-basics/source-and-destination-tags.md
        html: source-and-destination-tags.html
        funnel: Docs
        doc_type: Concepts
        category: Payment System Basics
        subcategory: Transaction Basics
        blurb: Use source and destination tags to indicate specific purposes for payments from and to multi-purpose addresses.
        targets:
            - en
            - ja
```

### 最初にすべきこと

XRP Ledger開発者ポータルを任意の母国語に翻訳いただける場合は、XRP Ledgerの主要なプロパティーと機能について説明する[XRP Ledgerの概要ファイル](https://github.com/XRPLF/xrpl-dev-portal/blob/master/content/concepts/introduction/xrp-ledger-overview.md)から始めてください。

ファイル名は`xrp-ledger-overview.{language code}.md`で保存してください。`{language code}`は[IETF BCP47](https://tools.ietf.org/html/bcp47)の言語コードです。（例えば、スペイン語は「es」、日本語は「ja」、簡体字中国語は「zh-CN」、台湾で使用される繁体字中国語は「zh-TW」などです。）その後、このリポジトリーにファイルを追加する[プルリクエスト](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests)を開きます。リポジトリーのメンテナーが、サイトに言語を追加するために必要なその他のセットアップについてお手伝いします。

Markdownコンテンツのファイルについては、以下の規則に従ってください。

- 改行には改行文字（`\n`）のみを使用します（Unix形式）。復帰改行文字（`\r`）は使用しないでください（Windows形式）。
- UTF-8エンコーディングを使用します。バイトオーダーマークは使用しないでください。
