---
html: logrotate.html
parent: logging-and-data-management-methods.html
seo:
    description: ログファイルを閉じて再度開きます。
labels:
  - データ保持
---
# logrotate
[[ソース]](https://github.com/XRPLF/rippled/blob/743bd6c9175c472814448ea889413be79dfd1c07/src/ripple/rpc/handlers/LogRotate.cpp "Source")

`logrotate`コマンドは、ログファイルを閉じて再度開きます。これは、Linuxファイルシステムでのログローテーションを促進することを目的としています。

通常、Linuxシステムには、[`logrotate`](https://linux.die.net/man/8/logrotate)プログラムがプリインストールされていますが、このコマンドとは異なります。アプリケーション固有のログローテーションスクリプトは、`/etc/logrotate.d`に配置されています。

次のスクリプトは、`/etc/logrotate.d/rippled`として作成できるサンプルです。

```logrotate
/var/log/rippled/*.log {
  daily
  minsize 200M
  rotate 7
  nocreate
  missingok
  notifempty
  compress
  compresscmd /usr/bin/nice
  compressoptions -n19 ionice -c3 gzip
  compressext .gz
  postrotate
    /opt/ripple/bin/rippled --conf /opt/ripple/etc/rippled.cfg logrotate
  endscript
}
```

保持するログの量に応じて、`minsize`や`rotate`などのパラメーターを構成できます。`rippled.cfg`ファイルの`log_level`設定を使用して、サーバのログの詳細度を設定します。このサンプルスクリプトは標準の`log_level`に基づいており、約2週間分のログを圧縮形式で保存します。

`rippled` 1.3以降、スクリプト`/etc/logrotate.d/rippled`は、DEBおよびRPMパッケージによって自動的にインストールされます。この設定は、必要に応じて変更できます。パッケージのアップグレード時に変更内容が上書きされることはありません。

**注記:** システムのlogrotateスクリプトは、アプリケーションごとに1つしか持てません。同じディレクトリを処理するログローテーションが他にないことを確認してください。

_`logrotate`メソッドは、権限のないユーザは実行できない[管理メソッド](../index.md)です。_

### リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": "lr1",
    "command": "logrotate"
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: logrotate
rippled logrotate
```
{% /tab %}

{% /tabs %}

リクエストにはパラメーターが含まれていません。

### レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
   "result" : {
      "message" : "The log file was closed and reopened.",
      "status" : "success"
   }
}

```
{% /tab %}

{% tab label="コマンドライン" %}
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result" : {
      "message" : "The log file was closed and reopened.",
      "status" : "success"
   }
}

```
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`   | 型     | 説明                                                    |
|:----------|:-------|:--------------------------------------------------------|
| `message` | 文字列 | 正常に完了した場合、次のメッセージが含まれています。`The log file was closed and reopened.` |

### 考えられるエラー

* いずれかの[汎用エラータイプ][]。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
