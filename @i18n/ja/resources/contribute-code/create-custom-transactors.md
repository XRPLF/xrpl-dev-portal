---
html: create-custom-transactors.html
parent: contribute-code.html
seo:
    description: XRP Ledgerとやり取りするためのカスタムトランザクタを作成します。
labels:
  - 開発
  - ブロックチェーン
---
# カスタムトランザクタの作成

_トランザクタ_ はトランザクションを処理し、XRP Ledgerを変更するコードです。カスタムトランザクタを作成することで、`rippled`に新しい機能を追加することができます。このチュートリアルではトランザクタのコーディングについて説明しますが、それをXRPLに追加するにはAmendmentプロセスを経る必要があります。 [XRP Ledgerのコードへの貢献](index.md)をご覧ください。

トランザクタは 基本的な処理順序に則って処理されます。

1. シリアライズ型レジャーエントリ(SLE/serialized type ledger entry)の _view_ へアクセスします。
2. _view_ 内の値を更新、削除、挿入します。
3. 確定した変更を _view_ からレジャーに適用します。

**注記:** _view_ はレジャーのサンドボックスです。トランザクタは必要なエラーチェックと変更のすべてをサンドボックス内で行い、レジャーでは直接行いません。値が確定した後、変更はレジャーにアトミックに適用されます。

このチュートリアルでは、既存の`CreateCheck`トランザクションを例として使用します。ソースファイルはここで確認できます。

- [ヘッダファイル](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/CreateCheck.h)
- [CPPファイル](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/CreateCheck.cpp)


## ヘッダファイル

次の形式でヘッダーファイルを作成します。

```c++
namespace ripple {

class CreateCheck : public Transactor
{
public:
    static constexpr ConsequencesFactoryType ConsequencesFactory{Normal};

    explicit CreateCheck(ApplyContext& ctx) : Transactor(ctx)
    {
    }

    static NotTEC
    preflight(PreflightContext const& ctx);

    static TER
    preclaim(PreclaimContext const& ctx);

    TER
    doApply() override;
};

}  // namespace ripple
```

`ApplyContext`でトランザクタを初期化すると、トランザクタは以下にアクセスできます：

- トランザクタをトリガーしたトランザクション。
- SLEのビュー。
- エラーを記録するためのジャーナル。


## CPPファイル

### 1. `preflight`関数の追加

`preflight`関数はレジャーにアクセスする前にトランザクション自体にエラーがないかチェックします。無効なトランザクションや正しく設定されていないトランザクションは拒否されなければなりません。

- `PreflightContext`はレジャーのビューを持っていません。
- レジャーやトランザクションからフィールドを取得するには、次のようにブラケット記法を使用します。

    ```
    auto const curExpiration = (*sle*)[~sfExpiration];
    (*sle)[sfBalance] = (*sle)[sfBalance] + reqDelta;
    ```

    **注記:** `~`記号は optional型を返します。

- レジャーとトランザクションのスキーマはこちらから確認できます。
    - [`LedgerFormats.cpp`](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/LedgerFormats.cpp)
    - [`TxFormats.cpp`](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/TxFormats.cpp)

-` rippled` はトランザクションの結果を結果コードで表します。[トランザクションの結果](../../docs/references/protocol/transactions/transaction-results/index.md)をご覧ください。

```c++
CreateCheck::preflight(PreflightContext const& ctx)
{
    // Check if this amendment functionality is enabled on the network.
    if (!ctx.rules.enabled(featureChecks))
        return temDISABLED;

    NotTEC const ret{preflight1(ctx)};
    if (!isTesSuccess(ret))
        return ret;

    if (ctx.tx.getFlags() & tfUniversalMask)
    {
        // There are no flags (other than universal) for CreateCheck yet.
        JLOG(ctx.j.warn()) << "Malformed transaction: Invalid flags set.";
        return temINVALID_FLAG;
    }
    if (ctx.tx[sfAccount] == ctx.tx[sfDestination])
    {
        // They wrote a check to themselves.
        JLOG(ctx.j.warn()) << "Malformed transaction: Check to self.";
        return temREDUNDANT;
    }

    {
        STAmount const sendMax{ctx.tx.getFieldAmount(sfSendMax)};
        if (!isLegalNet(sendMax) || sendMax.signum() <= 0)
        {
            JLOG(ctx.j.warn()) << "Malformed transaction: bad sendMax amount: "
                            << sendMax.getFullText();
            return temBAD_AMOUNT;
        }

        if (badCurrency() == sendMax.getCurrency())
        {
            JLOG(ctx.j.warn()) << "Malformed transaction: Bad currency.";
            return temBAD_CURRENCY;
        }
    }

    if (auto const optExpiry = ctx.tx[~sfExpiration])
    {
        if (*optExpiry == 0)
        {
            JLOG(ctx.j.warn()) << "Malformed transaction: bad expiration";
            return temBAD_EXPIRATION;
        }
    }

    return preflight2(ctx);
}
```


### 2. `preclaim`関数の追加

`preclaim`関数は、現在のレジャーの情報を見る必要があるエラーをチェックします。

- このステップが結果コード`tesSUCCESS`または`tec`を返した場合、トランザクションはキューに入れられ、ピアに送信されます。

```c++
CreateCheck::preclaim(PreclaimContext const& ctx)
{
    AccountID const dstId{ctx.tx[sfDestination]};

    // Use the `keylet` function to get the key of the SLE. Views have either `read` or `peek` access.
    // `peek` access allows the developer to modify the SLE returned.
    auto const sleDst = ctx.view.read(keylet::account(dstId));
    if (!sleDst)
    {
        JLOG(ctx.j.warn()) << "Destination account does not exist.";
        return tecNO_DST;
    }

    auto const flags = sleDst->getFlags();

    // Check if the destination has disallowed incoming checks
    if (ctx.view.rules().enabled(featureDisallowIncoming) &&
        (flags & lsfDisallowIncomingCheck))
        return tecNO_PERMISSION;

    if ((flags & lsfRequireDestTag) && !ctx.tx.isFieldPresent(sfDestinationTag))
    {
        // The tag is basically account-specific information we don't
        // understand, but we can require someone to fill it in.
        JLOG(ctx.j.warn()) << "Malformed transaction: DestinationTag required.";
        return tecDST_TAG_NEEDED;
    }

    {
        STAmount const sendMax{ctx.tx[sfSendMax]};
        if (!sendMax.native())
        {
            // The currency may not be globally frozen
            AccountID const& issuerId{sendMax.getIssuer()};
            if (isGlobalFrozen(ctx.view, issuerId))
            {
                JLOG(ctx.j.warn()) << "Creating a check for frozen asset";
                return tecFROZEN;
            }
            // If this account has a trustline for the currency, that
            // trustline may not be frozen.
            //
            // Note that we DO allow create check for a currency that the
            // account does not yet have a trustline to.
            AccountID const srcId{ctx.tx.getAccountID(sfAccount)};
            if (issuerId != srcId)
            {
                // Check if the issuer froze the line
                auto const sleTrust = ctx.view.read(
                    keylet::line(srcId, issuerId, sendMax.getCurrency()));
                if (sleTrust &&
                    sleTrust->isFlag(
                        (issuerId > srcId) ? lsfHighFreeze : lsfLowFreeze))
                {
                    JLOG(ctx.j.warn())
                        << "Creating a check for frozen trustline.";
                    return tecFROZEN;
                }
            }
            if (issuerId != dstId)
            {
                // Check if dst froze the line.
                auto const sleTrust = ctx.view.read(
                    keylet::line(issuerId, dstId, sendMax.getCurrency()));
                if (sleTrust &&
                    sleTrust->isFlag(
                        (dstId > issuerId) ? lsfHighFreeze : lsfLowFreeze))
                {
                    JLOG(ctx.j.warn())
                        << "Creating a check for destination frozen trustline.";
                    return tecFROZEN;
                }
            }
        }
    }
    if (hasExpired(ctx.view, ctx.tx[~sfExpiration]))
    {
        JLOG(ctx.j.warn()) << "Creating a check that has already expired.";
        return tecEXPIRED;
    }
    return tesSUCCESS;
}
```


### 3. Add a `doApply()` function.

The `doApply()` function has read/write access, enabling you to modify the ledger.

```c++
CreateCheck::doApply()
{
    auto const sle = view().peek(keylet::account(account_));
    if (!sle)
        return tefINTERNAL;

    // A check counts against the reserve of the issuing account, but we
    // check the starting balance because we want to allow dipping into the
    // reserve to pay fees.
    {
        STAmount const reserve{
            view().fees().accountReserve(sle->getFieldU32(sfOwnerCount) + 1)};

        if (mPriorBalance < reserve)
            return tecINSUFFICIENT_RESERVE;
    }

    // Note that we use the value from the sequence or ticket as the
    // Check sequence.  For more explanation see comments in SeqProxy.h.
    std::uint32_t const seq = ctx_.tx.getSeqProxy().value();
    Keylet const checkKeylet = keylet::check(account_, seq);
    auto sleCheck = std::make_shared<SLE>(checkKeylet);

    sleCheck->setAccountID(sfAccount, account_);
    AccountID const dstAccountId = ctx_.tx[sfDestination];
    sleCheck->setAccountID(sfDestination, dstAccountId);
    sleCheck->setFieldU32(sfSequence, seq);
    sleCheck->setFieldAmount(sfSendMax, ctx_.tx[sfSendMax]);
    if (auto const srcTag = ctx_.tx[~sfSourceTag])
        sleCheck->setFieldU32(sfSourceTag, *srcTag);
    if (auto const dstTag = ctx_.tx[~sfDestinationTag])
        sleCheck->setFieldU32(sfDestinationTag, *dstTag);
    if (auto const invoiceId = ctx_.tx[~sfInvoiceID])
        sleCheck->setFieldH256(sfInvoiceID, *invoiceId);
    if (auto const expiry = ctx_.tx[~sfExpiration])
        sleCheck->setFieldU32(sfExpiration, *expiry);

    view().insert(sleCheck);

    auto viewJ = ctx_.app.journal("View");
    // If it's not a self-send (and it shouldn't be), add Check to the
    // destination's owner directory.
    if (dstAccountId != account_)
    {
        auto const page = view().dirInsert(
            keylet::ownerDir(dstAccountId),
            checkKeylet,
            describeOwnerDir(dstAccountId));

        JLOG(j_.trace()) << "Adding Check to destination directory "
                        << to_string(checkKeylet.key) << ": "
                        << (page ? "success" : "failure");

        if (!page)
            return tecDIR_FULL;

        sleCheck->setFieldU64(sfDestinationNode, *page);
    }

    {
        auto const page = view().dirInsert(
            keylet::ownerDir(account_),
            checkKeylet,
            describeOwnerDir(account_));

        JLOG(j_.trace()) << "Adding Check to owner directory "
                        << to_string(checkKeylet.key) << ": "
                        << (page ? "success" : "failure");

        if (!page)
            return tecDIR_FULL;

        sleCheck->setFieldU64(sfOwnerNode, *page);
    }
    // If we succeeded, the new entry counts against the creator's reserve.
    adjustOwnerCount(view(), sle, 1, viewJ);
    return tesSUCCESS;
}
```


## 追加の関数

必要に応じて、カスタムトランザクタにヘルパー関数を追加することができます。特殊な場合に役立つ特別な関数がいくつかあります。


### `calculateBaseFee`

ほとんどのトランザクションはデフォルトの[Referenceトランザクションコスト](../../docs/concepts/transactions/transaction-cost.md)をそのまま引き継ぎます。しかし、トランザクションで通常以外のトランザクションコストを定義する必要がある場合、トランザクションの`calculateBaseFee`メソッドをカスタムメソッドに置き換えることができます。

次の例では、`EscrowFinish`ランザクションが条件付きエスクローに対して、フルフィルメントの大きさに応じて追加コストを請求する方法を示しています。

```c++
XRPAmount
EscrowFinish::calculateBaseFee(ReadView const& view, STTx const& tx)
{
    XRPAmount extraFee{0};

    if (auto const fb = tx[~sfFulfillment])
    {
        extraFee += view.fees().base * (32 + (fb->size() / 16));
    }

    return Transactor::calculateBaseFee(view, tx) + extraFee;
}
```


### `makeTxConsequences`

`rippled`は[`TxConsequences`](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/applySteps.h#L41-L44)クラスを使用して、トランザクション適用時のアカウントへの結果を記述します。このクラスは手数料、使用可能な最大XRP、トランザクションによって消費されたシーケンス番号の数を追跡します。結果には次の3つのタイプがあります。

- **ノーマル:**トランザクションは署名に影響を与えず、XRP手数料を消費するのみです。手数料を超えてXRPを消費するトランザクションは正常とはみなされません。
- **ブロッカー:**トランザクションの署名に影響を与え、有効なトランザクションがその後ろにキューイングされるのを防ぎます。
- **カスタム:**トランザクタは結果を決定するために追加の作業を行う必要があります。

`makeTxConsequences`関数を使うと、以下のような状況に対してカスタム結果を作成することができます：

- XRPを送信する支払い。
- 複数のシーケンス番号を消費するチケット。
- 設定されたフラグやフィールドによって、正常またはブロッカーとなるトランザクション。

**注記:** `TxConsequences`は[トランザクションキュー](../../docs/concepts/transactions/transaction-queue.md)にのみ影響します。トランザクションがレジャーに適用されたときに手数料を請求する可能性が高い場合、それはピアに送信されます。手数料を請求する可能性がない場合、またはそれが判断できない場合は、送信されません。


```c++
SetAccount::makeTxConsequences(PreflightContext const& ctx)
{
    // The SetAccount may be a blocker, but only if it sets or clears
    // specific account flags.
    auto getTxConsequencesCategory = [](STTx const& tx) {
        if (std::uint32_t const uTxFlags = tx.getFlags();
            uTxFlags & (tfRequireAuth | tfOptionalAuth))
            return TxConsequences::blocker;

        if (auto const uSetFlag = tx[~sfSetFlag]; uSetFlag &&
            (*uSetFlag == asfRequireAuth || *uSetFlag == asfDisableMaster ||
             *uSetFlag == asfAccountTxnID))
            return TxConsequences::blocker;

        if (auto const uClearFlag = tx[~sfClearFlag]; uClearFlag &&
            (*uClearFlag == asfRequireAuth || *uClearFlag == asfDisableMaster ||
             *uClearFlag == asfAccountTxnID))
            return TxConsequences::blocker;

        return TxConsequences::normal;
    };

    return TxConsequences{ctx.tx, getTxConsequencesCategory(ctx.tx)};
}
```


## 次のステップ

新しいトランザクタでサーバを再コンパイルし、[スタンドアロンモード](../../docs/infrastructure/testing-and-auditing/index.md)でテストしてください。もしAmendmentの後ろにトランザクタをコーディングした場合、設定ファイルを使ってその機能を[強制的に有効にする](../../docs/infrastructure/testing-and-auditing/test-amendments.md)ことができます。
