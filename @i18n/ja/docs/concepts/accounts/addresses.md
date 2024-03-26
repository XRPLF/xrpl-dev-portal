---
html: addresses.html
parent: accounts.html
seo:
    description: アドレスは、base58フォーマットを使用して、XRP Ledgerのアカウントを一意に識別します。
labels:
  - アカウント
---
# アドレス

{% partial file="/@i18n/ja/docs/_snippets/data_types/address.md" /%}

有効なアドレスであれば、資金を入金することで[XRP Ledgerのアカウントになる](index.md#creating-accounts)ことができます。また、[レギュラーキー](cryptographic-keys.md)や[署名者リスト](multi-signing.md)のメンバーとして、資金提供されていないアドレスを使用することもできます。資金を供給されたアカウントだけがトランザクションの送信者になることができます。

キーペアの生成を始めとする有効なアドレスの作成は、厳密には数学的な作業です。キーペアの生成とアドレスの計算は、XRP Ledgerや他のいかなる第三者とも通信することなく、完全にオフラインで行うことができます。公開鍵からアドレスへの変換には一方向ハッシュ関数が使用されるため、公開鍵とアドレスの一致を確認することは可能ですが、アドレスのみから公開鍵を導き出すことは不可能です。(これが署名付きトランザクションに公開鍵と送信者のアドレスを含める理由の一部です)。


## 特別なアドレス

XRP Ledgerでは、特別な意味や歴史的な役割を持つアドレスがあります。多くの場合、これらは"ブラックホール"アドレスであり、そのアドレスは既知の秘密鍵に由来するものではありません。アドレスから秘密鍵を推測することは事実上不可能であるため、ブラックホールアドレスが保有するXRPは永遠に失われます。

| アドレス                       | 名称 | 意味 | ブラック ホール? |
|-------------------------------|-----|-----|----------------|
| `rrrrrrrrrrrrrrrrrrrrrhoLvTp` | ACCOUNT\_ZERO | 値0を[base58][]形式にエンコードしたXRP Ledgerのアドレス。ピアツーピア通信では、このアドレスは、XRPの発行者として`rippled`で使用されます。 | はい |
| `rrrrrrrrrrrrrrrrrrrrBZbvji`  | ACCOUNT\_ONE | 値1を[base58][]形式にエンコードしたXRP Ledgerのアドレス。レジャーの[RippleStateエントリ](../../references/protocol/ledger-data/ledger-entry-types/ripplestate.md)では、このアドレスは、トラストライン残高の発行者のプレースホルダーとして使用されます。 | はい |
| `rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh` | ジェネシスアカウント | `rippled`で(スタンドアロンモードなど)新しいジェネシスレジャーが一から開始される場合、このアカウントはすべてのXRPを保持します。このアドレスは、シード値`masterpassphrase`から生成されており、この値は[ハードコーディング](https://github.com/XRPLF/rippled/blob/94ed5b3a53077d815ad0dd65d490c8d37a147361/src/ripple/app/ledger/Ledger.cpp#L184)されています。 | いいえ |
| `rrrrrrrrrrrrrrrrrNAMEtxvNvQ` | Ripple Namesの登録用ブラックホール | 以前、Ripple社は、Ripple Namesを登録するために、このアカウントにXRPを送金するようユーザに求めていました。| はい |
| `rrrrrrrrrrrrrrrrrrrn5RM1rHd` | NaNアドレス | 以前のバージョンの[ripple-lib](https://github.com/XRPLF/xrpl.js)では、XRP Ledgerの[base58][]文字列エンコード形式を使用して、値[NaN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN)をエンコードするときにこのアドレスを生成しました。 | はい |


## アドレスのエンコード

**ヒント:** これらの技術的な詳細は、XRP Ledgerとの互換性を保つために低レベルのライブラリソフトウェアを構築しているユーザのみを対象としています!

[[ソース]](https://github.com/XRPLF/rippled/blob/35fa20a110e3d43ffc1e9e664fc9017b6f2747ae/src/ripple/protocol/impl/AccountID.cpp#L109-L140 "ソース")

XRP Ledgerのアドレスは、[base58][]形式の _ディクショナリ_ `rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz`を使用してエンコードされています。XRP Ledgerはbase58でいくつかのタイプのキーをエンコードするため、それらを区別するためにエンコードされたデータの前に1バイトの「タイプ接頭辞」（「バージョン接頭辞」とも呼ばれます）を付けます。タイプ接頭辞によりアドレスは通常、base58形式の異なる文字で始まります。

次の図は、キーとアドレスの関係を示しています

[{% inline-svg file="/docs/img/address-encoding.ja.svg" /%}](/docs/img/address-encoding.ja.svg "マスター公開鍵 + タイプ接頭辞 → アカウントID + チェックサム → アドレス")

公開鍵からXRP Ledgerアドレスを計算する式は次の通りです。完全なサンプルコードついては、[`encode_address.js`](https://github.com/XRPLF/xrpl-dev-portal/blob/master/_code-samples/address_encoding/js/encode_address.js)をご覧ください。パスフレーズまたはシード値から公開鍵を導出するプロセスについては、[鍵の導出](cryptographic-keys.md#鍵導出)をご覧ください。

1. 次の必須アルゴリズムをインポートします。SHA-256、RIPEMD160、base58。base58のディクショナリを設定します。

    ```
    'use strict';
    const assert = require('assert');
    const crypto = require('crypto');
    const R_B58_DICT = 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz';
    const base58 = require('base-x')(R_B58_DICT);

    assert(crypto.getHashes().includes('sha256'));
    assert(crypto.getHashes().includes('ripemd160'));
    ```

2. 33バイトのECDSA secp256k1公開鍵、または32バイトのEd25519公開鍵で始めます。Ed25519キーの場合は、キーの前にバイト文字`0xED`を付与します。

    ```
    const pubkey_hex =
      'ED9434799226374926EDA3B54B1B461B4ABF7237962EAE18528FEA67595397FA32';
    const pubkey = Buffer.from(pubkey_hex, 'hex');
    assert(pubkey.length == 33);
    ```

3. 公開鍵のSHA-256ハッシュの[RIPEMD160](https://en.wikipedia.org/wiki/RIPEMD)ハッシュを計算します。この値は「Account ID」です。

    ```
    const pubkey_inner_hash = crypto.createHash('sha256').update(pubkey);
    const pubkey_outer_hash = crypto.createHash('ripemd160');
    pubkey_outer_hash.update(pubkey_inner_hash.digest());
    const account_id = pubkey_outer_hash.digest();
    ```

4. アカウントIDのSHA-256ハッシュのSHA-256ハッシュを計算します。最初の4バイトを使用します。この値が「チェックサム」です。

    ```
    const address_type_prefix = Buffer.from([0x00]);
    const payload = Buffer.concat([address_type_prefix, account_id]);
    const chksum_hash1 = crypto.createHash('sha256').update(payload).digest();
    const chksum_hash2 = crypto.createHash('sha256').update(chksum_hash1).digest();
    const checksum =  chksum_hash2.slice(0,4);
    ```

5. ペイロードとチェックサムを連結します。連結バッファーのbase58値を計算します。この結果が、アドレスになります。

    ```
    const dataToEncode = Buffer.concat([payload, checksum]);
    const address = base58.encode(dataToEncode);
    console.log(address);
    // rDTXLQ7ZKZVKz33zJbHjgVShjsBnqMBhmN
    ```

{% raw-partial file="/docs/_snippets/common-links.md" /%}
