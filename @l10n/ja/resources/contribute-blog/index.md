---
html: contribute-blog.html
parent: resources.html
seo:
  description: XRPLブログへの投稿手順
labels:
  - ブロックチェーン
---

# ブログ記事を投稿する

XRP Ledger開発者ブログへの投稿をご検討いただきありがとうございます！

このページでは、新しいブログ記事を作成するための概要手順を紹介しています。XRP Ledger開発者ポータルへの投稿に関する詳細な手順やガイドラインについては、[ドキュメントへの貢献](../contribute-documentation/index.md)をご覧ください。

{% admonition type="info" name="Note" %}現在、ブログ記事は英語のみで提供されており、まだ翻訳は行われていません。{% /admonition %}

## ブログ投稿用のディレクトリ構成

ソースファイルは、公開されている `xrpl-dev-portal` リポジトリの `blog` ディレクトリにあります。

ブログ記事で使用される画像ファイルは、`blog/img` ディレクトリにあります。

ブログ記事は年ごとに分類されており、2025年に公開されたすべてのブログ記事は `blog/2025` ディレクトリにあります。

## ブログ記事の新規作成手順

新しい記事を作成するには、以下の手順に従ってください。

1. 作業を始める前に、`xrpl-dev-portal` リポジトリの上流（upstream）`master` ブランチから最新の更新をプルしておいてください。

2. `blog-{記事の概要}` の形式で、新しいブログ記事用のブランチを作成してください。

3. `blog/{年}` フォルダ内に、新しいMarkdownファイルを作成してください。たとえば、以下のようになります：https://github.com/XRPLF/xrpl-dev-portal/tree/master/blog/2025

4. 下書きのブログ記事は、テンプレートファイル [`_blog_template.md`](https://github.com/XRPLF/xrpl-dev-portal/tree/master/%40l10n/ja/resources/contribute-blog/_blog-template.md) を参考にして作成してください。

5. 新しく作成したファイルを `blog/sidebars.yaml` に追加してください。

6. 下書きがレビュー可能な状態になったら、内容を保存し、コミットを実行してください。

7. master ブランチへのマージ用に、新しいプルリクエストを作成してください。
