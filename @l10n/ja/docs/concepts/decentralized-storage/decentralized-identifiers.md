---
seo:
    description: 分散型IDは、検証可能な分散型デジタルIDを可能にします。
labels:
  - DID
---
# 分散型ID

分散型ID(DID)は、検証可能なデジタルIDを可能にするWorld Wide Web Consortium(W3C)によって定義された新しいタイプの識別子です。DIDはDID所有者の完全な管理下にあり、中央管理レジストリ、IDプロバイダ、認証局から独立しています。

DIDの主な基本原則は以下の通りです。

- **分散型:** 中央の発行機関がDIDを管理することがないため、所有者はDIDを更新、解決、または無効化することができます。また、DIDは通常ブロックチェーン上に保存され、常に確認が可能なため、あなたの本人確認も非常に利用しやすくなります。

- **検証可能な資格情報(Verifiable Credentials):** 誰でもDIDを作成し、その情報を偽造することができます。DIDの真正性を証明するために、ユーザは暗号的に安全で改ざんできない検証可能な資格情報(Verifiable Credentials/VC)を提供しなければなりません。

    DIDエコシステムには3つの当事者がいます。_ユーザ_、_発行者_、_検証者_ です。ユーザはDIDを管理しますが、オフラインで情報を検証するには信頼できる _発行者_ が必要です。_発行者_ は検証可能な資格情報を提供し、ユーザはそれをユーザの身元を確認する必要がある _検証者_ に渡します。DIDエコシステムの詳細については、こちらをご覧ください。[エコシステムの概要](https://www.w3.org/TR/vc-data-model/#ecosystem-overview)

- **相互運用性:** DIDは、W3CのDID規格を認識するあらゆるソリューションに対してオープンです。つまり、DIDは様々なデジタルトランザクションやインタラクションの認証や信頼の確立に使用することができます。

{% admonition type="info" name="注記" %}XRP LedgerにおけるDIDの実装は、[DID v1.0仕様](https://www.w3.org/TR/did-core/)の仕様に準拠しています。{% /admonition %}

{% amendment-disclaimer name="DID" /%}

## 仕組み

1. XRPLアカウント保有者は、アカウントによって管理されるDIDを生成します。
2. DIDはW3C仕様で定義されたDIDドキュメントと関連付けられます。
3. ユーザは、デジタル上のタスクのために、自分のDIDとVCを検証者に提供します。
4. 検証者はDIDをそのドキュメントに変換し、VCを使用してその真正性を検証します。


## DIDドキュメント

DIDドキュメントには、記述された対象の身元を暗号的に検証するために必要な情報が含まれます。サブジェクトは、人、組織、または物であってもかまいません。たとえば、DIDドキュメントには、DIDサブジェクトが自身を認証し、DIDの関連を証明するために使用できる暗号化公開鍵を含めることができます。

{% admonition type="info" name="Note" %}DIDドキュメントは通常、JSONまたはJSON-LDのフォーマットにシリアライズされます。{% /admonition %}

XRP Ledgerでは、DIDをDIDドキュメントに関連付ける方法がいくつか存在します。

1. IPFSやSTORJのような他の分散ストレージネットワークに保存されているドキュメントを指す`DID`オブジェクトの`URI`フィールドにドキュメントへの参照を保存します。
2. 最小限のDIDドキュメントを`DID`オブジェクトの`DIDDocument`フィールドに格納します。
3. DIDとその他の利用可能な公開情報から生成された最小限の _暗黙的な_ DIDドキュメントを使用します。
    {% admonition type="info" name="注記" %}より単純なユースケースでは、署名と単純な認証トークンのみが必要な場合があります。レジャー上に明示的にDIDドキュメントが存在しない場合、代わりに暗黙的なドキュメントが使用されます。たとえば、`did:xrpl:1：0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020`の暗黙のDIDドキュメントでは、単一のキー`0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020`だけでDIDドキュメントの変更を承認したり、DIDの名前で署名に署名したりできます。{% /admonition %}


### XRPL DIDドキュメントの例

```json
{
    "@context": "https://w3id.org/did/v1",
    "id": "did:xrpl:1:rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "publicKey": [
        {
            "id": "did:xrpl:1:rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn#keys-1",
            "type": ["CryptographicKey", "EcdsaKoblitzPublicKey"],
            "curve": "secp256k1",
            "expires": 15674657,
            "publicKeyHex": "04f42987b7faee8b95e2c3a3345224f00e00dfc67ba882..."
        }
    ]
}
```

DIDドキュメントの主要なプロパティの詳細については[Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/#core-properties)をご覧ください。


## プライバシーとセキュリティの懸念

- XRPLアカウントの秘密鍵を管理する人は誰でも、DIDとそれが解決するDIDドキュメントへの参照を管理します。秘密鍵が漏洩しないように注意してください。
- DIDドキュメントにはどのような内容でも含めることができますが、検証方法とサービスポイントに限定すべきです。XRPL上のDIDは公開情報であるので、個人情報を含めるべきではありません。
- IPFSは誰でも分散ネットワークのノードにコンテンツを保存できます。よくある誤解は、誰でもそのコンテンツを編集できるということです。しかし、IPFSのコンテンツアドレス指定可能性は、編集されたコンテンツがオリジナルとは異なるアドレスを持つことを意味します。どんなエンティティでもXRPLアカウントの`DIDDocument`または`URI`フィールドでアンカーされたDIDドキュメントをコピーすることはできますが、対応する`DID`オブジェクトを作成した秘密鍵をコントロールしない限り、ドキュメント自体を変更することはできません。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
