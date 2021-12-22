---
html: nftokenmint.html
parent: nft-concepts.html
blurb: Use TokenMint to issue new NFTs.
filters:
 - include_code
labels:
 - Non-fungible Tokens, NFTs
status: not_enabled
---
# The `NFTokenMint` Transaction
{% include '_snippets/nfts-disclaimer.md' %}

The `NFTokenMint` transaction creates a `NFToken` object and adds it to the relevant `NFTokenPage` object of the `minter`. A required parameter to this transaction is the `Token` field specifying the actual token. This transaction is the only opportunity the `minter` has to specify any token fields that are defined as immutable (for example, the `TokenFlags`).

If the transaction is successful, the newly minted token is owned by the account (the `minter` account) that executed the transaction. If needed, the server creates a new `NFTokenPage`  for the account and applies a reserve charge.


## Example `NFTokenMint` transaction


```
{
  "TransactionType": "NFTokenMint",
  "Account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
  "Issuer": "rNCFjv8Ek5oDrNiMJ3pw6eLLFtMjZLJnf2",
  "TransferFee": 314,
  "Flags": 2147483659,
  "Fee": 10,
  "URI": "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi"
  "Memos": [
        {
            "Memo": {
                "MemoType":
                  "687474703A2F2F6578616D706C652E636F6D2F6D656D6F2F67656E65726963",
                "MemoData": "72656E74"
            }
        }
    ],
}
```


This transaction assumes that the issuer, `rNCFjv8Ek5oDrNiMJ3pw6eLLFtMjZLJnf2`, has set the `MintAccount` field in its `AccountRoot` to `rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B`, thereby authorizing that account to mint tokens on its behalf.


## **Execution**


In executing, this transaction examines the `MintedTokens` field in the account root of the `Issuer` and uses it to construct the `TokenID` for the token being minted. If the field does not exist, the field is assumed to have the value 0; the value of the field is then incremented by exactly 1.


## Transaction-specific Fields


<table>
  <tr>
   <td>Field Name
   </td>
   <td>Required?
   </td>
   <td>JSON Type
   </td>
   <td>Internal Type
   </td>
   <td>Description
   </td>
  </tr>
  <tr>
   <td><code>TransactionType</code>
   </td>
   <td>Yes
   </td>
   <td><code>string</code>
   </td>
   <td><code>UINT16</code>
   </td>
   <td>Indicates the new transaction type <code>NFTokenMint</code>. The integer value is <code>25</code>.
   </td>
  </tr>
  <tr>
   <td><code>Account</code>
   </td>
   <td>Yes
   </td>
   <td><code>string</code>
   </td>
   <td><code>ACCOUNT ID</code>
   </td>
   <td>Indicates the account that is minting the token. The account MUST <em>either</em>:
<ul>

<li>match the <code>Issuer</code> field in the <code>NFToken</code> object; or

<li>match the <code>MintAccount</code> field in the <code>AccountRoot</code> of the <code>Issuer</code> field in the <code>NFToken</code> object.
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td><code>Issuer</code>
   </td>
   <td>No
   </td>
   <td><code>string</code>
   </td>
   <td><code>ACCOUNT ID</code>
   </td>
   <td>Indicates the account that issues the token. This value is <em>optional</em> and should only be specified if the account executing the transaction is not the <code>Issuer</code> of the <code>NFToken</code> object. If it is present, the <code>MintAccount</code> field in the <code>AccountRoot</code> of the <code>Issuer</code> field must match the <code>Account</code>. Otherwise, the transaction fails.
   </td>
  </tr>
  <tr>
   <td><code>TokenTaxon</code>
   </td>
   <td>Yes
   </td>
   <td><code>number</code>
   </td>
   <td><code>UINT32</code>
   </td>
   <td>The taxon associated with the token. The taxon is generally a value chosen by the <code>minter</code> of the token. A given taxon can be used for multiple tokens. This implementation reserves all taxon identifiers greater than or equal to <code>0x80000000</code>; attempts to use mint tokens with such taxons should fail and a fee should be claimed.
   </td>
  </tr>
  <tr>
   <td><code>TransferFee</code>
   </td>
   <td>No
   </td>
   <td><code>number</code>
   </td>
   <td><code>UINT16</code>
   </td>
   <td>The value specifies the fee charged by the issuer for secondary sales of the Token, if such sales are allowed. Valid values for this field are between 0 and 9999 inclusive, allowing transfer rates of between 0.00% and 99.99% in increments of 0.01.
<p>
The field MUST NOT be present if <code>tfTransferable</code> is not set. If it is, the transaction should fail and the server should claim a fee.
   </td>
  </tr>
  <tr>
   <td><code>URI</code>
   </td>
   <td>No
   </td>
   <td><code>string</code>
   </td>
   <td><code>BLOB</code>
   </td>
   <td>A URI that points to the data or metadata associated with the NFT. This field need not be an HTTP or HTTPS URL; it could be an IPFS URI, a magnet link, immediate data encoded as an RFC2379 <a href="https://datatracker.ietf.org/doc/html/rfc2397">"data" URL</a>, or even an opaque issuer-specific encoding. The URI is NOT checked for validity, but the field is limited to a maximum length of 256 bytes.
   </td>
  </tr>
  <tr>
   <td><code>Flags</code>
   </td>
   <td>No
   </td>
   <td><code>number</code>
   </td>
   <td><code>UINT32</code>
   </td>
   <td>Specifies the flags used for the minting transaction. See the mint transaction flags in the following table.
   </td>
  </tr>
</table>


### Mint Transaction Flags


<table>
  <tr>
   <td><strong>Flag Name</strong>
   </td>
   <td><strong>Flag Value</strong>
   </td>
   <td><strong>Description</strong>
   </td>
  </tr>
  <tr>
   <td><code>tfBurnable</code>
   </td>
   <td><code>0x00000001</code>
   </td>
   <td>If set, indicates that the <code>lsfBurnable</code> flag should be set.
   </td>
  </tr>
  <tr>
   <td><code>tfOnlyXRP</code>
   </td>
   <td><code>0x00000002</code>
   </td>
   <td>If set, indicates that the <code>lsfOnlyXRP</code> flag should be set.
   </td>
  </tr>
  <tr>
   <td><code>tfTrustLine</code>
   </td>
   <td><code>0x00000004</code>
   </td>
   <td>If set, indicates that the <code>lsfTrustLine</code> flag should be set.
   </td>
  </tr>
  <tr>
   <td><code>tfTransferable</code>
   </td>
   <td><code>0x00000008</code>
   </td>
   <td>If set, indicates that the <code>lsfTransferable</code> flag should be set.
   </td>
  </tr>
</table>



## Embedding additional information

If you need to specify additional information during minting (for example, details identifying a property by referencing a particular [plat](https://en.wikipedia.org/wiki/Plat), a vehicle by specifying a [VIN](https://en.wikipedia.org/wiki/Vehicle_identification_number), or other object-specific descriptions) you can use the <code>[memo](https://xrpl.org/transaction-common-fields.html#memos-field)</code> functionality already available on the XRP Ledger as a common field. Memos are a part of the signed transaction and are available from historical archives, but are not stored in the ledger.
