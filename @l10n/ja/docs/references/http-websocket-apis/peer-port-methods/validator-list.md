---
html: validator-list.html
parent: peer-port-methods.html
seo:
    description: 推奨バリデータリストを共有するための特別なAPIメソッド。
labels:
  - コアサーバ
  - ブロックチェーン
---
# バリデータリストメソッド

バリデータリストメソッドは特別なAPIエンドポイントで、`rippled`サーバが現在使用している信頼できるバリデータリストを取得します。これは多くの場合、サーバが信頼するバリデータの正確なリストを表します。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.5.0" %}新規: rippled 1.5.0{% /badge %}.

[ピアクローラ](peer-crawler.md)と同様に、バリデータリストメソッドはデフォルトで非root権限で[ピアプロトコル](../../../concepts/networks-and-servers/peer-protocol.md)ポートから利用できます。

## リクエストのフォーマット

バリデータリストの情報をリクエストするには、以下のHTTPリクエストを実行します。

- **プロトコル:** https
- **HTTPメソッド:** GET
- **ホスト:** (任意の`rippled`サーバ(ホスト名またはIPアドレス))
- **ポート:** (`rippled`サーバがピアプロトコルを使用するポート番号)
- **パス:** `/vl/{public_key}`

    `{public_key}`はリスト発行者の公開鍵で、16進数です。この鍵は発行者を識別し、リストの内容が真正で完全であることを確認するためにも使われます。

- **セキュリティ:** ほとんどの`rippled`サーバはリクエストにレスポンスするために自己署名したTLS証明書を使います。デフォルトでは、(Webブラウザを含む)ほとんどのツールはそのようなレスポンスが信頼できないものであるとしてフラグを立てたりブロックしたりします。これらのサーバからのレスポンスを表示するには、証明書のチェックを無視しなければなりません(たとえばcURLを使う場合は`--insecure`フラグを追加します)。

    バリデータリストの内容は別の暗号鍵で署名されているので、使用するTLS証明書にかかわらずその完全性を検証できます。


## レスポンスのフォーマット

レスポンスにはステータスコード **200 OK** とメッセージボディにJSONオブジェクトがあります。レスポンスボディは、<https://vl.ripple.com/>のようなバリデータリストサイトで使われる書式に非常によく似ています。

JSONオブジェクトには以下のフィールドがあります。

| `Field`          | 値    | 説明                                      |
|:-----------------|:------|:-------------------------------------------------|
| `manifest`       | 文字列 | リスト発行者の[マニフェストデータ](#マニフェストデータ)をbase64または16進数で表します。 |
| `blob`           | 文字列 | バリデータリストを表すBase64エンコードされたJSONデータ。 |
| `signature`      | 文字列 | 16進数で表した`blob`データの署名。 |
| `version`        | 数値   | このオブジェクトが使用するバリデータリストプロトコルのバージョン。現在のバージョンは **1** です。それ以上のバージョン番号は、バリデータリストプロトコルの以前のバージョンとの下位互換性を表します。 |
| `public_key`     | 文字列 | このバリデータリストのデータを検証するために使用する公開鍵。これは32バイトのEd25519公開鍵で、先頭に`0xED`というバイトが付きます。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.7.0" %}新規: rippled 1.7.0{% /badge %}. |

### マニフェストデータ
[[ソース]](https://github.com/XRPLF/rippled/blob/97712107b71a8e2089d2e3fcef9ebf5362951110/src/ripple/app/misc/impl/Manifest.cpp#L43-L66 "ソース")

"マニフェスト"には、コンセンサスプロセスに関与する個人または組織（***バリデータ**または**リスト発行者**）を一意に識別する情報が含まれます。バリデータのマニフェストには、その[バリデータのトークン](../../../infrastructure/configuration/server-modes/run-rippled-as-a-validator.md#3-enable-validation-on-your-rippled-server)の _公開_ 情報が含まれます。リスト発行者のマニフェストはリスト発行者に関する情報を提供します。どちらも通常、XRP Ledgerの標準的な[バイナリフォーマット](../../protocol/binary-format.md)でバイナリにエンコードされます。(マニフェストの標準的なJSON形式はありません)。

マニフェストの主な目的の1つは、バリデータ鍵のローテーションです。バリデータはそのエフェメラル鍵ペアを変更すると、新しいエフェメラル公開鍵を共有するために新しいマニフェストを発行します。バリデータは[コンセンサスプロセス](../../../concepts/consensus-protocol/index.md)の一部としてバリデーションに署名するためにエフェメラル鍵ペアを使用し、新しいマニフェストに署名するためにのみマスター鍵ペアを使用します。(マニフェストは、[バリデータ管理者が`rippled.cfg`設定ファイルに追加する](../../../infrastructure/configuration/server-modes/run-rippled-as-a-validator.md#3-enable-validation-on-your-rippled-server)プライベートデータと一緒にバリデータトークンに組み込まれます)。

マニフェストでエンコードされるデータは次のとおりです。

| `Field`             | 内部の型       | 説明                              |
|:--------------------|:--------------|:-----------------------------------------|
| `sfPublicKey`       | Blob          | この個人または組織を一意に識別するマスター公開鍵。これは33バイトのsecp256k1公開鍵か、32バイトのEd25519公開鍵の前に`0xED`というバイトを付加したものになります。 |
| `sfMasterSignature` | Blob          | マスターキーペアからの、このマニフェストデータの署名。これにより、マニフェストの信頼性が証明されます。 |
| `sfSequence`        | UInt32        | このマニフェストのシーケンス番号。番号が大きいほど新しいマニフェストであり、同じマスター公開鍵からの古いマニフェストはすべて無効になります。 |
| `sfVersion`         | UInt16        | 使用されているマニフェスト形式を示すバージョン番号。数値が高いほど、以前のマニフェスト形式と比較して、変更点を含む新しいマニフェスト形式であることを示します。 |
| `sfDomain`          | Blob          | _(省略可)_ ASCIIエンコードされた、この個人または組織が所有するドメイン名。 |
| `sfSigningPubKey`   | Blob          | _(省略可)_ この個人または組織が現在使用している鍵ペアのエフェメラル公開鍵。これは33バイトのsecp256k1公開鍵でなければなりません。 |
| `sfSignature`       | Blob          | _(省略可)_ エフェメラルキーペアからのこのマニフェストデータの署名。 |

`sfMasterSignature`と`sfSignature`の署名は、署名フィールド(`sfMasterSignature`と`sfSignature`)自体を除いて、マニフェストの[シリアライズされた](../../protocol/binary-format.md)バイナリデータに署名することで作成されます。


### Blobデータ

base64から`blob`をデコードすると、以下のフィールドを持つJSONオブジェクトになります。

| `Field`      | 値   | 解説                                                    |
|:-------------|:-----|:-------------------------------------------------------|
| `sequence`   | 数値 | このリスト固有のシーケンス番号。一度に最新のリストのみが有効です。 |
| `expiration` | 数値 | このリストが期限切れになる時間([Rippleエポック以降の経過秒数][])。  |
| `validators` | 配列 | 推奨されるバリデータのリスト。                               |

`validators`配列の各メンバーは以下のフィールドを持っています。

| `Field`                 | 値    | 説明                                       |
|:------------------------|:------|:------------------------------------------|
| `validation_public_key` | 文字列 | このバリデータを一意に識別するマスター公開鍵。 |
| `manifest`              | 文字列 | このバリデータの[マニフェストデータ](#マニフェストデータ)をbase64または16進数で表します。 |


#### デコードされたBlobの例

{% code-snippet file="/_api-examples/vl/vl-blob.json" language="json" /%}

## 例

リクエスト:

{% tabs %}

{% tab label="HTTP" %}
```
GET https://localhost:51235/vl/ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734
```
{% /tab %}

{% tab label="cURL" %}
```
curl --insecure https://localhost:51235/vl/ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734
```
{% /tab %}

{% /tabs %}

レスポンス:

{% code-snippet file="/_api-examples/vl/vl.json" language="json" prefix="200 OK\n\n" /%}


## 関連項目

- [ピアプロトコル](../../../concepts/networks-and-servers/peer-protocol.md)
- [コンセンサス](../../../concepts/consensus-protocol/index.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
