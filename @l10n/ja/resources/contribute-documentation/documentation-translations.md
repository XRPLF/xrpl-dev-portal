---
html: documentation-translations.html
parent: contribute-documentation.html
seo:
    description: このウェブサイトにある文書の翻訳に貢献し、維持する方法を学びましょう。
---
# 翻訳

XRP Ledger Dev Portalは大部分が英語で書かれているため、一般的には英語版が最新かつ正確なバージョンです。しかしながら、XRP Ledgerのソフトウェアとコミュニティへのリーチを広げるために、このリポジトリには翻訳版のドキュメントも含まれています。私たちは、他の言語を理解するコミュニティのメンバーが、開発ポータルの内容を母国語で翻訳することを大いに歓迎します。

`dactyl-config.yml`には利用可能な言語ごとに"target"項目があります(現在、利用可能な言語は英語と日本語です)。このエントリには、次のようにテンプレートファイルで使用される文字列の定義が含まれます。

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

また、トップレベルの`languages`リストもあり、サポートされている各言語が定義されています。各言語のショートコードは[IETF BCP47](https://tools.ietf.org/html/bcp47)に従ったショートコードでなければなりません。例えば、"en"は英語、"es"はスペイン語、"ja"は日本語、"zh-CN"は簡体字中国語、"zh-TW" は繁体字中国語 (台湾で使用) などです。`display_name`フィールドはその言語でネイティブに書かれた言語名を定義します。`prefix`フィールドはその言語のサイトへのハイパーリンクで使用する接頭辞を定義します。次に`languages`の定義例を示します。

```yaml
languages:
    -   code: en
        display_name: English
        prefix: "/"
    -   code: ja
        display_name: 日本語
        prefix: "/ja/"
```

同じ`dactyl-config.yml`ファイルには、XRP Ledger Dev Portalの各コンテンツページのエントリがあります。ページが翻訳されている場合、各翻訳ごとに個別の項目があり、その翻訳の“ターゲット"にリンクされています。ページがまだ翻訳されていない場合、すべてのターゲットで英語版が使用されます。(新しいページが英語のみ追加され、他の言語が提供されない場合、リンクチェッカーはそれをリンク切れとして報告します。)

ページを翻訳するということは、そのページのエントリを他の言語と分割するということです。ページのメタデータは`dactyl-config.yml`ファイルか、ページのMarkdownファイルの先頭にあるfrontmatterに設定します。

| フィールド | 備考 |
|----------|------|
| `html` | ページのHTMLファイル名。慣例により、これはすべての言語バージョンで同じであるべきです。 |
| `md` | ページのMarkdownソースファイル。翻訳されたMarkdownソースファイルは英語版と同じファイル名を使用してください。ただし、拡張子は英語版の`.md`ではなく、`.{言語コード}.md`を使用してください。例えば、日本語の翻訳ファイルの拡張子は `.ja.md` です。 |
| `blurb` | ページの簡単な要約。これは翻訳されるべきです。このテキストは、検索エンジン最適化のためのメタデータや、自動生成されるランディングページで使用されます。 |

`server_info`メソッドページの英語と日本語の記入例：

```yaml
    -   md: references/http-websocket-apis/public-api-methods/server-info-methods/server_info.md
        targets:
            - en

    -   md: references/http-websocket-apis/public-api-methods/server-info-methods/server_info.ja.md
        targets:
            - ja
```

翻訳されていないページの記入例：

```yaml
    -   md: concepts/payment-system-basics/transaction-basics/source-and-destination-tags.md
        targets:
            - en
            - ja
```

## 始めるにあたって

XRP Ledger Dev Portalをあなたの母国語に翻訳したい場合は、まず{% repo-link path="docs/concepts/introduction/what-is-the-xrp-ledger.md" %}"What is the XRP Ledger?" file{% /repo-link %}から始めてください。

このファイルを`xrp-ledger-overview.{言語コード}.md`として保存します。ここで`{言語コード}`は[IETF BCP47](https://tools.ietf.org/html/bcp47)の言語コードです。(例えば、スペイン語は"es"、日本語は"ja"、簡体字中国語は"zh-CN"、台湾で使われている繁体字中国語は"zh-TW"などです)。そして、あなたのファイルをこのリポジトリに追加する[プルリクエスト](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests)を作成してください。リポジトリメンテナの誰かが、サイトに言語を追加するために必要なその他の設定を手伝ってくれるでしょう。

Markdownコンテンツファイルでは、以下の規則に従ってください。

- 改行文字(`\n`)のみ（Unixスタイル）。キャリッジリターン文字(`\r`)は使用しないでください（Windowsスタイル）。
- UTF-8エンコーディングを使用してください。バイトオーダーマークの使用は避けてください。
