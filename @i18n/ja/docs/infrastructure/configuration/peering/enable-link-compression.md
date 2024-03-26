---
html: enable-link-compression.html
parent: configure-peering.html
seo:
    description: ピアツーピア通信を圧縮して帯域幅を節約します。
labels:
  - コアサーバ
---
# 回線圧縮の有効化

`rippled`サーバは[ピアツーピア通信](../../../concepts/networks-and-servers/peer-protocol.md)を圧縮することで帯域幅を節約できますが、その代償としてCPU使用率が高くなります。回線圧縮を有効にすると、サーバは回線圧縮を有効にしているピアサーバとの通信を自動的に圧縮します。

## 手順

サーバで回線圧縮を有効にするには、以下の手順を実行します。

### 1. `rippled`サーバの設定ファイルを編集します。

```sh
$ vim /etc/opt/ripple/rippled.cfg
```

{% partial file="/@i18n/ja/docs/_snippets/conf-file-location.md" /%}

### 2. 設定ファイルに`[compression]`を追加またはコメントアウトします。

圧縮を有効にするには

```text
[compression]
true
```

圧縮を無効にするには`false`を使用します（デフォルト）。

### 3. `rippled` サーバを再起動します。

```sh
$ sudo systemctl restart rippled.service
```

再起動後、サーバは回線圧縮を有効にしている他のピアとの間で自動的に回線圧縮を使用します。

## 関連項目

- [容量の計画](../../installation/capacity-planning.md)
- [ピアプロトコル](../../../concepts/networks-and-servers/peer-protocol.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
