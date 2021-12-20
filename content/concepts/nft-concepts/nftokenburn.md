---
html: nftokenburn.html
parent: nft-concepts.html
blurb: Use TokenBurn to permanently destroy NFTs.
embed_xrpl_js: true
filters:
 - include_code
labels:
 - Non-fungible Tokens, NFTs
---
# The `NFTokenBurn` Transaction

The `NFTokenBurn` transaction is used to remove a `NFToken` object from the `NFTokenPage` in which it is being held, effectively removing the token from the ledger (_burning_ it).

If this operation succeeds, the corresponding `NFToken` is removed. If this operation empties the `NFTokenPage` holding the `NFToken` or results in consolidation, thus removing a `NFTokenPage`, the owner’s reserve requirement is reduced by one.


## Example `NFTokenBurn` JSON


```
{
      "TransactionType": "NFTokenBurn",
      "Account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
      "Fee": 10,
      "TokenID": "000B013A95F14B0044F78A264E41713C64B5F89242540EE208C3098E00000D65"
}
```



## NFTokenBurn Transaction Fields


<table>
  <tr>
   <td><strong>Field Name</strong>
   </td>
   <td><strong>Required?</strong>
   </td>
   <td><strong>JSON Type</strong>
   </td>
   <td><strong>Internal Type</strong>
   </td>
   <td><strong>Description</strong>
   </td>
  </tr>
  <tr>
   <td><code>TransactionType</code>
   </td>
   <td>Yes
   </td>
   <td>string
   </td>
   <td>UInt16
   </td>
   <td>The <code>NFTokenBurn</code> transaction type.  The integer value is <code>26</code>.
   </td>
  </tr>
  <tr>
   <td><code>Account</code>
   </td>
   <td>Yes
   </td>
   <td>string
   </td>
   <td>Account ID
   </td>
   <td>The <code>AccountID</code> that submitted this transaction. The account must be either the present <code>owner</code> of the token or, if the <code>lsfBurnable</code> flag is set in the <code>NFToken</code>, the <code>issuer</code> account or an account authorized by the issuer,  (that is, the <code>MintAccount</code>).
   </td>
  </tr>
  <tr>
   <td><code>TokenID</code>
   </td>
   <td>Yes
   </td>
   <td>string
   </td>
   <td>UINT256
   </td>
   <td>Identifies the <code>NFToken</code> object to be removed by the transaction.
   </td>
  </tr>
</table>



## Account Root Enhancements


### `MintAccount`


Issuers might want to issue NFTs from their well known account, while at the same time wanting to delegate the issuance of such NFTs to a mint or other third party.


<table>
  <tr>
   <td><strong>Field Name</strong>
   </td>
   <td><strong>Required?</strong>
   </td>
   <td><strong>JSON Type</strong>
   </td>
   <td><strong>Internal Type</strong>
   </td>
   <td><strong>Description</strong>
   </td>
  </tr>
  <tr>
   <td><code>MintAccount</code>
   </td>
   <td>
   </td>
   <td>string
   </td>
   <td>Account ID
   </td>
   <td>The <code>MintAccount</code> field, if set, specifies an alternate account which is allowed to execute the <code>NFTokenMint</code> and <code>NFTokenBurn</code> operations on behalf of the account.
   </td>
  </tr>
</table>


The `SetAccount` transaction allows the `MintAccount` field to be set or cleared.

### `MintedTokens`


The `MintedTokens` field is used to form the `TokenID` of a new object, to ensure the uniqueness of `NFToken` objects. If this field is not present, the value is 0.


### `BurnedTokens`


The `BurnedTokens` field provides a convenient way to determine how many `NFToken` objects issued by an account are still active (that is, not burned). If this field is not present the value 0 is assumed. The field is decremented whenever a token issued by this account is burned.

An account for which the difference the number of minted and burned tokens, as stored in the `MintedTokens` and `BurnedTokens` fields respectively, is non-zero cannot be deleted.
