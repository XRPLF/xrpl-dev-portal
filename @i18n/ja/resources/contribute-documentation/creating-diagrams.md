---
html: creating-diagrams.html
parent: contribute-documentation.html
seo:
    description: ライトモードとダークモードの設定で適切に動作する図を作成します。
---
# 図の作成

このサイトには、SVGの図をライト・ダークモード用に自動的に再カラーリングするコードが含まれています。これは単に画像を反転させるだけではありません。再カラーリングは（ボトムライトに見えないように）グラデーションを同じ方向に保ち、色をその逆ではなくテーマに合った同等なものに置き換えます。例えば、"Ripple blue"は、その逆のオレンジではなく、XRPLグリーンに再カラーリングされます。

![色の反転とテーマ対応再カラーリングの比較](/docs/img/theme-aware-recolor.png)

テーマを意識した再カラーリングでは、図のSVG形式の単一のソースファイルを使用し、CSSを使用して現在のテーマ（明暗）に合わせて再カラーリングされた図を生成します。ユーザがテーマを変更すると、図は即座にそれに合わせて変更されます。

テーマに対応した図をドキュメントに含めるには、以下のような構文で`include_svg`フィルタを使用します。

```jinja
[{% inline-svg file="/docs/img/anatomy-of-a-ledger-complete.svg" /%}](/docs/img/anatomy-of-a-ledger-complete.svg "図1：XRP Ledgerの要素")
```

この構文の前後は空行にしてください。該当のSVGファイルは、リポジトリのトップレベルにある[`img/`](https://github.com/XRPLF/xrpl-dev-portal/tree/master/img)フォルダか、そのサブフォルダにあるはずです。2番目の引数は _表題_ で、ユーザが図の上にマウスを置いたときに表示されます。

作成されたSVGファイルはMarkdownファイルに直接挿入されます。1点制限事項として、箇条書きリストやテーブルのような他のMarkdown構造の中では使用することはできません。

{% admonition type="info" name="注記" %}
フィルタのソースコードは[`tool/filter_include_svg.py`](https://github.com/XRPLF/xrpl-dev-portal/blob/master/tool/filter_include_svg.py)です。これは`lxml`がサイトを構築するための依存関係の一つである理由でもあります。
{% /admonition %}

## Making Diagrams

図を作成する際には、再カラーリングが正しく適用されるように注意する必要があります。そうしないと、もう一方のテーマ用に再カラーリングしたときに、一部の要素が見えなくなる可能性があります(例えば、白地に白や黒地に黒など)。テーマを考慮したダイアグラムのコードは、[Umlet](https://www.umlet.com/)または[Google Draw](https://docs.google.com/drawings/)のいずれかを使用して作成され、SVGとしてエクスポートされた図をサポートしています。また、図を作成する際には、以下のガイドラインに従ってください。

- デフォルトでライトモード用の図を作成します。透明な背景色を使用してください。
- テーマ対応ダイアグラムのコードがマッピングしている色のみを使用します。色の完全なリストを含む、このためのコードは[`styles/_diagrams.scss`](https://github.com/XRPLF/xrpl-dev-portal/blob/master/styles/_diagrams.scss)にあります。必要であれば、SCSSコードを拡張することで、新しい色を追加することができます。(作業が終わったら、CSSを再エクスポートすることを忘れないでください。[style README](https://github.com/XRPLF/xrpl-dev-portal/blob/master/styles/README.md)をご覧ください)。
- 可能な限り、埋め込みアイコン/画像の代わりにベクター図形を使用してください。画像の上にテキストを配置する必要がある場合は、テキスト要素に無地の背景を追加し、テーマがマッピングしている色のいずれかを使用してください。
- テキストを含む透明な要素を、異なる背景色を持つ要素の上に重ねないでください。テキストを含む要素に直接背景色を適用してください。
