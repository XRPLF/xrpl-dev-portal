# Relative paths work OK as long as you start the tool from its local dir
template_path: tool

# This folder gets copied into the output directory
template_static_path: assets

# Templates should have filenames starting in template-
default_template: template-doc.html
default_pdf_template: template-forpdf.html

# HTML, PDF, GFM all get output here
out_path: out

# MD files should be here (and in subdirs)
content_path: content

# This folder gets copied into the output directory
content_static_path: img

# PDF creation needs a dir for temporary files
temporary_files_path: /tmp/

# Custom filters live here and start with filter_
filter_paths:
    - tool

default_filters:
    - multicode_tabs
    - buttonize
    - callouts
    - badges
    - link_replacement
    - external_links
    - status_badges
    - include_svg
    - css_tables

callout_class: "devportal-callout"
callout_types:
  - "tip"
  - "ヒント" # equiv. of "Tip" in Japanese (lit. "Hint")
  - "note"
  - "注記" # equiv of "Note" in Japanese
  - "caution"
  - "注意" # equiv. of "Caution" in Japanese
  - "warning"
  - "警告" # equiv. of "Warning" in Japanese

cover_page:
    name: Home
    html: index.html
    template: template-home.html
    sidebar: disabled
    canonical_url: https://xrpl.org/

languages:
    -   code: en
        display_name: Eng
        prefix: "/"
    -   code: ja
        display_name: 日本語
        prefix: "/ja/"

default_keys: &defaults
    # These github_ fields are used by the template's "Edit on GitHub" link.
    #  Override them with --vars to change which fork/branch to edit.
    github_forkurl: https://github.com/ripple/xrpl-dev-portal
    github_branch: master
    # Hover icon markup for permalinking headers
    hover_anchors: <i class="fa fa-link"></i>
    # Script tags used in a variety of tools & examples.
    lodash_tag: '<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js" integrity="sha512-WFN04846sdKMIP5LKNphMaWzU7YpMyCU245etK3g/2ARYbPK9Ub18eG+ljU96qKRCWh+quCY7yefSmlkQw1ANQ==" crossorigin="anonymous"></script>'
    ripple_lib_tag: '<script type="application/javascript" src="assets/js/ripple-lib-1.9.1.min.js"></script>'

targets:
    # First member is the default that gets built when target not specified
    -   name: en
        lang: en
        display_name: XRPL.org
        <<: *defaults
        prefix: ""
        blurb: XRPL.org is a community-driven resource for all things XRP and the XRP Ledger—your source for technical information, reference materials and tools.

    -   name: ja
        lang: ja
        display_name: XRPL.org (日本語)
        <<: *defaults
        prefix: "/ja/"
        locale_file: locale/ja/LC_MESSAGES/messages.mo
        blurb: XRPとXRP Ledgerの全てに対してのコミュニティーリーソース
        link_subs:
            # Fix 9 links from untranslated use-an-escrow-as-a-smart-contract.html:
            "send-a-conditionally-held-escrow.html#1-generate-condition-and-fulfillment": "send-a-conditionally-held-escrow.html#1条件とフルフィルメントの生成"
            "send-a-conditionally-held-escrow.html#2-calculate-release-or-cancel-time": "send-a-conditionally-held-escrow.html#2リリース時刻または取消し時刻の計算"
            "send-a-conditionally-held-escrow.html#3-submit-escrowcreate-transaction": "send-a-conditionally-held-escrow.html#3escrowcreateトランザクションの送信"
            "send-a-conditionally-held-escrow.html#4-wait-for-validation": "send-a-conditionally-held-escrow.html#4検証の待機"
            "send-a-conditionally-held-escrow.html#5-confirm-that-the-escrow-was-created": "send-a-conditionally-held-escrow.html#5escrowが作成されたことの確認"
            "send-a-conditionally-held-escrow.html#6-submit-escrowfinish-transaction": "send-a-conditionally-held-escrow.html#6escrowfinishトランザクションの送信"
            "send-a-conditionally-held-escrow.html#7-wait-for-validation": "send-a-conditionally-held-escrow.html#7検証の待機"
            "send-a-conditionally-held-escrow.html#8-confirm-final-result": "send-a-conditionally-held-escrow.html#8最終結果の確認"
            "accounts.html#creating-accounts": "accounts.html#アカウントの作成"
            # Fix 2 links from untranslated demurrage.html:
            "currency-formats.html#issued-currency-precision": "currency-formats.html#発行済み通貨の計算"
            "currency-formats.html#currency-codes": "currency-formats.html#通貨コード"
            # Fix 5 links from untranslated become-an-xrp-ledger-gateway.html
            "paths.html#default-paths": "paths.html#デフォルトパス"
            "payment.html#payment-flags": "payment.html#paymentのフラグ"
            "accountroot.html#accountroot-flags": "accountroot.html#accountrootのフラグ"
            "trustset.html#trustset-flags": "trustset.html#trustsetのフラグ"
            "basic-data-types.html#ledger-index": "basic-data-types.html#レジャーインデックス"
            # Fix links from untranslated open-a-payment-channel-to-enable-an-inter-exchange-network.html
            "use-payment-channels.html#1-the-payer-creates-a-payment-channel-to-a-particular-recipient": "use-payment-channels.html#1-支払人が特定の受取人へのpayment-channelを作成します"
            "use-payment-channels.html#2-the-payee-checks-specifics-of-the-payment-channel": "use-payment-channels.html#2-受取人がpayment-channelの特性を確認します"
            "use-payment-channels.html#3-the-payer-creates-one-or-more-signed-claims-for-the-xrp-in-the-channel": "use-payment-channels.html#3-支払人がchannelのxrpに対して1つ以上の署名付き-クレーム-を作成します"
            "use-payment-channels.html#4-the-payer-sends-a-claim-to-the-payee-as-payment-for-goods-or-services": "use-payment-channels.html#4-支払人が商品またはサービスに対する支払いとしてクレームを受取人に送信します"
            "use-payment-channels.html#5-the-payee-verifies-the-claims": "use-payment-channels.html#5-受取人がクレームを検証します"
            "use-payment-channels.html#7-repeat-steps-3-6-as-desired": "use-payment-channels.html#7-必要に応じてステップ36を繰り返します"
            "use-payment-channels.html#8-when-ready-the-payee-redeems-a-claim-for-the-authorized-amount": "use-payment-channels.html#8-準備が完了すれば受取人は承認された額のクレームを清算します"
            "use-payment-channels.html#9-when-the-payer-and-payee-are-done-doing-business-the-payer-requests-for-the-channel-to-be-closed": "use-payment-channels.html#9-支払人と受取人の取引完了後支払人はchannelの閉鎖を要求します"
            "reserves.html#owner-reserves": "reserves.html#所有者準備金"
            # Fix links from untranslated disable-master-key-pair.html.
            "transaction-basics.html#authorizing-transactions": "transaction-basics.html#トランザクションの承認"
            "transaction-common-fields.html#auto-fillable-fields": "transaction-common-fields.html#自動入力可能なフィールド"
            "set-up-secure-signing.html#use-a-dedicated-signing-device": "set-up-secure-signing.html#専用の署名デバイスを使用する"
            "set-up-secure-signing.html#run-rippled-locally": "set-up-secure-signing.html#ローカルでrippledを実行する"
            # Fix links from untranslated validator-list.html
            "run-rippled-as-a-validator.html#3-enable-validation-on-your-rippled-server": "run-rippled-as-a-validator.html#3-rippledサーバーで検証を有効化"
            "basic-data-types.html#specifying-time": "basic-data-types.html#時間の指定"
            # Fix link from untranslated run-rippled-as-a-wallet-server.html
            "run-rippled-as-a-validator.html#6-provide-domain-verification": "run-rippled-as-a-validator.html#6-ドメイン検証の提供"
            # Fix link from untranslated tutorial-submit-step.md snippet
            "transaction-cost.html#queued-transactions": "transaction-cost.html#キューに入れられたトランザクション"
            # Fix links from multiple untranslated API method reference pages:
            "error-formatting.html#universal-errors": "error-formatting.html#汎用エラー"
            # Fix link to un-updated transaction-metadata.html. REMOVE when the affected nodes section is updated
            "transaction-metadata.html#affectednodes": "transaction-metadata.html"
            # Fix link from untranslated peer-crawler.html:
            "peer-protocol.html#private-peers": "peer-protocol.html#プライベートピア"
            # Fix links from untranslated invariant-checking.html
            "basic-data-types.html#account-sequence": "basic-data-types.html#アカウントシーケンス"
            "xrp.html#xrp-properties": "xrp.html#xrpの特性"
            # Fix links from untranslated health-check.html:
            "rippled-server-modes.html#stand-alone-mode": "rippled-server-modes.html#rippledサーバーをスタンドアロンモードで実行する理由"
            "server-doesnt-sync.html#normal-syncing-behavior": "server-doesnt-sync.html#通常の同期動作"
            # Fix link from untranslated negativeunl.html:
            "consensus.html#validation": "consensus.html#検証"
            # Fix link from untranslated tickets.html:
            "consensus.html#calculate-and-share-validations": "consensus.html#検証の計算と共有"
            # Fix link from untranslated manifest.html:
            "rippled-server-modes.html#reporting-mode": "rippled-server-modes.html#レポーティングモード"
            # Fix links for untranslated get-started-using-python.html:
            "the-rippled-server.html#reasons-to-run-your-own-server": "rippled-server-modes.html#ストックサーバーを運用する理由"
            "cryptographic-keys.html#key-components": "cryptographic-keys.html#キーの生成"
            "accounts.html#addresses": "accounts.html#アドレス"
            "cryptographic-keys.html#private-key": "cryptographic-keys.html#キーの生成"
            "basic-data-types.html#specifying-currency-amounts": "basic-data-types.html#通貨額の指定"
            "transaction-cost.html#current-transaction-cost": "transaction-cost.html#現在のトランザクションコスト"
            "ledgers.html#open-closed-and-validated-ledgers": "ledgers.html#ツリーの形式"
            "account_info.html#response-format": "account_info.html#応答フォーマット"
            # Fix link from untranslated public-servers.html:
            "ledger-history.html#full-history": "ledger-history.html#すべての履歴"
            # Fix link from untranslated amendment-voting.html and rate-limiting.html:
            "get-started-using-http-websocket-apis.html#admin-access": "get-started-using-http-websocket-apis.html#管理者アクセス権限"


pages:

# "Learn" funnel ---------------------------------------------------------------
    -   name: Learn
        template: template-learn-overview.html
        html: overview.html
        parent: index.html
        top_nav_level: 1
        top_nav_name: Overview
        sidebar: disabled
        targets:
            - en

    -   name: 学ぶ
        template: template-learn-overview.html
        html: overview.html
        parent: index.html
        top_nav_level: 1
        top_nav_name: オーバービュー
        sidebar: disabled
        targets:
            - ja

    -   name: Uses
        template: template-learn-uses.html
        html: uses.html
        parent: overview.html # "Learn"
        top_nav_level: 1
        sidebar: disabled
        targets:
            - en

    -   name: 使用
        template: template-learn-uses.html
        html: uses.html
        parent: overview.html # "Learn"
        top_nav_level: 1
        sidebar: disabled
        targets:
            - ja

    -   name: History
        template: template-learn-history.html
        html: history.html
        parent: overview.html # "Learn"
        top_nav_level: 1
        sidebar: disabled
        targets:
            - en

    -   name: 沿革
        template: template-learn-history.html
        html: history.html
        parent: overview.html # "Learn"
        top_nav_level: 1
        sidebar: disabled
        targets:
            - ja

    -   name: Impact
        template: template-learn-impact.html
        html: impact.html
        parent: overview.html # "Learn"
        top_nav_level: 1
        sidebar: disabled
        targets:
            - en

    -   name: インパクト
        template: template-learn-impact.html
        html: impact.html
        parent: overview.html # "Learn"
        top_nav_level: 1
        sidebar: disabled
        targets:
            - ja

    -   name: Carbon Calculator
        template: template-calculator.html
        html: carbon-calculator.html
        parent: overview.html
        top_nav_level: 1
        sidebar: disabled
        blurb: Whether it's cash, credit, or crypto, every transaction you make consumes energy. Use the green currency calculator to compare.
        fb_card: currency-calculator-card-fb.png
        twitter_card: currency-calculator-card-tw.png
        targets:
            - en

    -   name: 二酸化炭素電卓
        template: template-calculator.html
        html: carbon-calculator.html
        parent: overview.html
        top_nav_level: 1
        sidebar: disabled
        blurb: 現金、クレジットカード、暗号資産でもエネルギー消費する。インタラクティブツールで消費量を比較しましょう。
        fb_card: currency-calculator-card-fb.png
        twitter_card: currency-calculator-card-tw.png
        targets:
            - ja

# "Explore" funnel -------------------------------------------------------------
    -   name: Explore
        html: explore.html
        parent: index.html
        template: template-redirect.html
        redirect_url: businesses.html
        top_nav_omit: true
        targets:
            - en

    -   name: 探る
        html: explore.html
        parent: index.html
        template: template-redirect.html
        redirect_url: businesses.html
        top_nav_omit: true
        targets:
            - ja

    -   name: Wallets
        template: template-explore-wallets.html
        html: wallets.html
        parent: explore.html
        top_nav_level: 1
        sidebar: disabled
        targets:
            - en

    -   name: ウォレット
        template: template-explore-wallets.html
        html: wallets.html
        parent: explore.html
        top_nav_level: 1
        sidebar: disabled
        targets:
            - ja

    -   name: Exchanges
        template: template-explore-exchanges.html
        html: exchanges.html
        parent: explore.html
        top_nav_level: 1
        sidebar: disabled
        targets:
            - en

    -   name: 取引所
        template: template-explore-exchanges.html
        html: exchanges.html
        parent: explore.html
        top_nav_level: 1
        sidebar: disabled
        targets:
            - ja

    -   name: Businesses
        template: template-explore-businesses.html
        html: businesses.html
        parent: explore.html
        top_nav_level: 1
        sidebar: disabled
        targets:
            - en

    -   name: 企業
        template: template-explore-businesses.html
        html: businesses.html
        parent: explore.html
        top_nav_level: 1
        sidebar: disabled
        targets:
            - ja

    -   name: Ledger Explorer
        html: https://livenet.xrpl.org/
        parent: explore.html
        targets:
            - en

    -   name: XRP Ledger エクスプローラ
        html: https://livenet.xrpl.org/
        parent: explore.html
        targets:
            - ja

# "Documentation" section ------------------------------------------------------
    -   name: Build
        template: template-landing-docs.html
        html: docs.html
        parent: index.html
        sidebar: disabled
        top_nav_level: 1
        top_nav_name: Docs
        targets:
            - en

    -   name: 作る
        template: template-landing-docs.html
        html: docs.html
        parent: index.html
        top_nav_level: 1
        top_nav_name: ドキュメント
        sidebar: disabled
        targets:
            - ja

# Concepts ---------------------------------------------------------------------

    -   name: Concepts
        html: concepts.html
        parent: docs.html
        top_nav_level: 2
        template: template-landing-children.html
        blurb: Learn the "what" and "why" behind fundamental aspects of the XRP Ledger.
        targets:
            - en

    -   name: コンセプト
        html: concepts.html
        parent: docs.html
        top_nav_level: 2
        template: template-landing-children.html
        blurb: XRP Ledgerの基本的な部分の背景に「何があるか」、「なぜなのか」を学びましょう。
        targets:
            - ja

    -   name: Introduction
        html: introduction.html
        parent: concepts.html
        template: template-landing-children.html
        blurb: Learn the "what" and "why" of the XRP Ledger.
        targets:
            - en

    -   name: 基本
        html: introduction.html
        parent: concepts.html
        template: template-landing-children.html
        blurb: XRP Ledgerとは「何なのか」、「なぜなのか」を学びましょう。
        targets:
            - ja

    -   md: concepts/introduction/xrp-ledger-overview.md
        targets:
            - en

    -   md: concepts/introduction/xrp-ledger-overview.ja.md
        targets:
            - ja

    -   md: concepts/introduction/intro-to-consensus.md
        targets:
            - en

    -   md: concepts/introduction/intro-to-consensus.ja.md
        targets:
            - ja

    -   md: concepts/introduction/xrp.md
        targets:
            - en

    -   md: concepts/introduction/xrp.ja.md
        targets:
            - ja

    -   md: concepts/introduction/software-ecosystem.md
        targets:
            - en

    -   md: concepts/introduction/software-ecosystem.ja.md
        targets:
            - ja

    -   md: concepts/introduction/technical-faq.md
        targets:
            - en

    -   md: concepts/introduction/technical-faq.ja.md
        targets:
            - ja

    -   name: Payment System Basics
        html: payment-system-basics.html
        parent: concepts.html
        template: template-landing-children.html
        blurb: One of the primary purposes of the XRP Ledger is payment processing. Learn more about key concepts that will help you understand the XRP Ledger payment system.
        targets:
            - en

    -   name: 支払いシステムの基本
        html: payment-system-basics.html
        parent: concepts.html
        template: template-landing-children.html
        blurb: XRP Ledgerの主な狙いは決済処理です。主要なコンセプトを詳しく学んで、XRP Ledgerの決済システムの理解を深めましょう。
        targets:
            - ja

    -   md: concepts/payment-system-basics/accounts/accounts.md
        targets:
            - en

    -   md: concepts/payment-system-basics/accounts/accounts.ja.md
        targets:
            - ja

    -   md: concepts/payment-system-basics/accounts/cryptographic-keys.md
        targets:
            - en

    -   md: concepts/payment-system-basics/accounts/cryptographic-keys.ja.md
        targets:
            - ja

    -   md: concepts/payment-system-basics/accounts/multi-signing.md
        targets:
            - en

    -   md: concepts/payment-system-basics/accounts/multi-signing.ja.md
        targets:
            - ja

    -   md: concepts/payment-system-basics/accounts/reserves.md
        targets:
            - en

    -   md: concepts/payment-system-basics/accounts/reserves.ja.md
        targets:
            - ja

    -   md: concepts/payment-system-basics/accounts/tickets.md
        targets:
            - en
            - ja

    -   md: concepts/payment-system-basics/accounts/depositauth.md
        targets:
            - en

    -   md: concepts/payment-system-basics/accounts/depositauth.ja.md
        targets:
            - ja

    -   md: concepts/payment-system-basics/fees.md
        targets:
            - en

    -   md: concepts/payment-system-basics/fees.ja.md
        targets:
            - ja

    -   md: concepts/payment-system-basics/ledgers.md
        targets:
            - en

        # TODO: translation needs to be updated based on ledgers.md
    -   md: concepts/payment-system-basics/ledgers.ja.md
        targets:
            - ja

    -   md: concepts/payment-system-basics/transaction-basics/transaction-basics.md
        targets:
            - en

    -   md: concepts/payment-system-basics/transaction-basics/transaction-basics.ja.md
        targets:
            - ja

    -   md: concepts/payment-system-basics/transaction-basics/transaction-cost.md
        targets:
            - en

    -   md: concepts/payment-system-basics/transaction-basics/transaction-cost.ja.md
        targets:
            - ja

    -   md: concepts/payment-system-basics/transaction-basics/finality-of-results.md
        targets:
            - en

    -   md: concepts/payment-system-basics/transaction-basics/finality-of-results.ja.md
        targets:
            - ja

    -   md: concepts/payment-system-basics/transaction-basics/source-and-destination-tags.md
        targets:
            - en

    # TODO: Somehow this page's blurb got translated into Japanese but the page itself wasn't?
    # For now we overwrite the blurb but use the page otherwise as-is.
    -   md: concepts/payment-system-basics/transaction-basics/source-and-destination-tags.md
        blurb: 多目的アドレスとの間で支払いのやり取りをする具体的な目的を示すためにソースタグと宛先タグを使用します。
        untranslated_warning: true
        targets:
            - ja

    -   name: Payment Types
        html: payment-types.html
        parent: concepts.html
        template: template-landing-children.html
        blurb: The XRP Ledger supports point-to-point XRP payments alongside other, more specialized payment types.
        targets:
            - en

    -   name: 支払いのタイプ
        html: payment-types.html
        parent: concepts.html
        template: template-landing-children.html
        blurb: XRP LedgerはポイントツーポイントのXRPペイメントのほかに、より専門化した支払いタイプをサポートしています。
        targets:
            - ja

        # Redirect from the old landing name/URL
    -   name: Complex Payment Types
        html: complex-payment-types.html
        template: template-redirect.html
        nav_omit: true
        redirect_url: payment-types.html
        targets:
            - en
            - ja

    -   md: concepts/payment-types/direct-xrp-payments.md
        targets:
            - en

    -   md: concepts/payment-types/direct-xrp-payments.ja.md
        targets:
            - ja

    -   md: concepts/payment-types/cross-currency-payments.md
        targets:
            - en

    -   md: concepts/payment-types/cross-currency-payments.ja.md
        targets:
            - ja

    -   md: concepts/payment-types/checks.md
        targets:
            - en

    -   md: concepts/payment-types/checks.ja.md
        targets:
            - ja

    -   md: concepts/payment-types/escrow.md
        targets:
            - en

    -   md: concepts/payment-types/escrow.ja.md
        targets:
            - ja

    -   md: concepts/payment-types/partial-payments.md
        targets:
            - en

    -   md: concepts/payment-types/partial-payments.ja.md
        targets:
            - ja

    -   md: concepts/payment-types/payment-channels.md
        targets:
            - en

    -   md: concepts/payment-types/payment-channels.ja.md
        targets:
            - ja

    -   name: Issued Currencies
        html: issued-currencies.html
        parent: concepts.html
        template: template-landing-children.html
        blurb: All currencies other than XRP can be represented in the XRP Ledger as issued currencies. Learn more about how issued currencies function in the XRP Ledger.
        targets:
            - en

    -   name: 発行済み通貨
        html: issued-currencies.html
        parent: concepts.html
        template: template-landing-children.html
        blurb: XRP Ledgerでは、XRP以外の通貨はすべて発行済み通貨とされます。XRP Ledgerで発行済み通貨がどのように機能するか説明します。
        targets:
            - ja

    -   md: concepts/issued-currencies/issued-currencies-overview.md
        targets:
            - en

    -   md: concepts/issued-currencies/issued-currencies-overview.ja.md
        targets:
            - ja

    -   md: concepts/issued-currencies/trust-lines-and-issuing.md
        targets:
            - en

    -   md: concepts/issued-currencies/trust-lines-and-issuing.ja.md
        targets:
            - ja

    -   md: concepts/issued-currencies/authorized-trust-lines.md
        targets:
            - en

    -   md: concepts/issued-currencies/authorized-trust-lines.ja.md
        targets:
            - ja

    -   md: concepts/issued-currencies/freezes.md
        targets:
            - en

    -   md: concepts/issued-currencies/freezes.ja.md
        targets:
            - ja

    -   md: concepts/issued-currencies/rippling.md
        targets:
            - en

    -   md: concepts/issued-currencies/rippling.ja.md
        targets:
            - ja

    -   md: concepts/issued-currencies/transfer-fees.md
        targets:
            - en

    -   md: concepts/issued-currencies/transfer-fees.ja.md
        targets:
            - ja

    -   md: concepts/issued-currencies/issuing-and-operational-addresses.md
        targets:
            - en

    -   md: concepts/issued-currencies/issuing-and-operational-addresses.ja.md
        targets:
            - ja

    -   md: concepts/issued-currencies/paths.md
        targets:
            - en

    -   md: concepts/issued-currencies/paths.ja.md
        targets:
            - ja

    -   md: concepts/issued-currencies/demurrage.md
        targets:
            - en
            - ja

    -   name: Decentralized Exchange
        html: decentralized-exchange.html
        parent: concepts.html
        template: template-landing-children.html
        blurb: The XRP Ledger contains a fully-functional exchange where users can trade issued currencies for XRP or each other.
        targets:
            - en

    -   name: 分散型取引所
        html: decentralized-exchange.html
        parent: concepts.html
        template: template-landing-children.html
        blurb: XRP Ledgerには多機能な取引所が含まれており、この取引所を利用してユーザーは発行済み通貨をXRPに、あるいはXRPを発行済み通貨に交換できます。
        targets:
            - ja

    -   md: concepts/decentralized-exchange/offers.md
        targets:
            - en

    -   md: concepts/decentralized-exchange/offers.ja.md
        targets:
            - ja

    -   md: concepts/decentralized-exchange/autobridging.md
        targets:
            - en

    -   md: concepts/decentralized-exchange/autobridging.ja.md
        targets:
            - ja

    -   md: concepts/decentralized-exchange/ticksize.md
        targets:
            - en

    -   md: concepts/decentralized-exchange/ticksize.ja.md
        targets:
            - ja

    -   name: Consensus Network
        html: consensus-network.html
        parent: concepts.html
        template: template-landing-children.html
        blurb: The XRP Ledger uses a consensus algorithm to resolve the double spend problem and choose which transactions to execute in which order. Consensus also governs rules of transaction processing.
        targets:
            - en

    -   name: コンセンサスネットワーク
        html: consensus-network.html
        parent: concepts.html
        template: template-landing-children.html
        blurb: XRP Ledgerはコンセンサスアルゴリズムを使用して、二重支払いの問題を解決し、どのトランザクションをどのような順番で実行するか選択します。コンセンサスは、トランザクション処理のルールを左右します。
        targets:
            - ja

    -   md: concepts/consensus-network/consensus.md
        targets:
            - en

    -   md: concepts/consensus-network/consensus.ja.md
        targets:
            - ja

    -   md: concepts/consensus-network/consensus-principles-and-rules.md
        targets:
            - en

    -   md: concepts/consensus-network/consensus-principles-and-rules.ja.md
        targets:
            - ja

    -   md: concepts/consensus-network/consensus-protections.md
        targets:
            - en

    -   md: concepts/consensus-network/consensus-protections.ja.md
        targets:
            - ja

        # TODO: translate this page and blurb
    -   md: concepts/consensus-network/invariant-checking.md
        targets:
            - en
            - ja

        # TODO: translate this page and blurb
    -   md: concepts/consensus-network/negative-unl.md
        targets:
            - en
            - ja

    -   md: concepts/consensus-network/transaction-queue.md
        targets:
            - en

    -   md: concepts/consensus-network/transaction-queue.ja.md
        targets:
            - ja

    -   md: concepts/consensus-network/about-canceling-a-transaction.md
        targets:
            - en

    -   md: concepts/consensus-network/about-canceling-a-transaction.ja.md
        targets:
            - ja

    -   md: concepts/consensus-network/transaction-malleability.md
        targets:
            - en

    -   md: concepts/consensus-network/transaction-malleability.ja.md
        targets:
            - ja

    -   md: concepts/consensus-network/amendments/amendments.md
        targets:
            - en

    -   md: concepts/consensus-network/amendments/amendments.ja.md
        targets:
            - ja

    -   md: concepts/consensus-network/amendments/known-amendments.md
        targets:
            - en

    -   md: concepts/consensus-network/amendments/known-amendments.ja.md
        targets:
            - ja

    -   md: concepts/consensus-network/fee-voting.md
        targets:
            - en

    -   md: concepts/consensus-network/fee-voting.ja.md
        targets:
            - ja

    -   md: concepts/consensus-network/consensus-research.md
        targets:
            - en

    -   md: concepts/consensus-network/consensus-research.ja.md
        targets:
            - ja

    # TODO: add pseudo-transactions concept page

    -   md: concepts/consensus-network/parallel-networks.md
        targets:
            - en

    -   md: concepts/consensus-network/parallel-networks.ja.md
        targets:
            - ja

    -   md: concepts/the-rippled-server/the-rippled-server.md
        targets:
            - en

    -   name: rippledサーバー
        html: the-rippled-server.html
        parent: concepts.html
        template: template-landing-children.html
        blurb: rippledは、XRP Ledgerを管理するコアのピアツーピアサーバーです。このセクションではコンセプトについて説明します。XRP Ledgerの基本的な部分の背景に「何があるか」、「なぜなのか」を学ぶことができます。
        targets:
            - ja

    -   md: concepts/the-rippled-server/rippled-server-modes.md
        targets:
            - en

    -   md: concepts/the-rippled-server/rippled-server-modes.ja.md
        targets:
            - ja

    -   md: concepts/the-rippled-server/clustering.md
        targets:
            - en

    -   md: concepts/the-rippled-server/clustering.ja.md
        targets:
            - ja

    -   md: concepts/the-rippled-server/ledger-history/ledger-history.md
        targets:
            - en

    -   md: concepts/the-rippled-server/ledger-history/ledger-history.ja.md
        targets:
            - ja

    -   md: concepts/the-rippled-server/ledger-history/online-deletion.md
        targets:
            - en

    -   md: concepts/the-rippled-server/ledger-history/online-deletion.ja.md
        targets:
            - ja

    -   md: concepts/the-rippled-server/ledger-history/history-sharding.md
        targets:
            - en

    -   md: concepts/the-rippled-server/ledger-history/history-sharding.ja.md
        targets:
            - ja

    -   md: concepts/the-rippled-server/peer-protocol.md
        targets:
            - en

    -   md: concepts/the-rippled-server/peer-protocol.ja.md
        targets:
            - ja

    -   md: concepts/the-rippled-server/transaction-censorship-detection.md
        targets:
            - en

    -   md: concepts/the-rippled-server/transaction-censorship-detection.ja.md
        targets:
            - ja

# Tutorials --------------------------------------------------------------------

    -   name: Tutorials
        html: tutorials.html
        parent: docs.html
        top_nav_level: 2
        template: template-landing-children.html
        blurb: Get step-by-step guidance to perform common tasks with the XRP Ledger.
        targets:
            - en

    -   name: チュートリアル
        html: tutorials.html
        parent: docs.html
        top_nav_level: 2
        template: template-landing-children.html
        blurb: XRP Ledgerで一般的なタスクを実行するためのステップバイステップのガイダンスを紹介します。
        targets:
            - ja

        # TODO: translate
    -   md: tutorials/get-started/get-started.md
        targets:
            - en

    -   name: 使用開始
        html: get-started.html
        parent: tutorials.html
        template: template-landing-children.html
        blurb: リソースを活用してXRP Ledgerの使用を開始しましょう。
        targets:
            - ja

    -   md: tutorials/get-started/public-servers.md
        targets:
            - en
            - ja

    -   md: tutorials/get-started/get-started-using-python.md
        targets:
            - en
            - ja

    -   md: tutorials/get-started/get-started-using-java.md
        targets:
            - en
            - ja

    -   md: tutorials/get-started/get-started-using-node-js.md
        targets:
            - en

    -   md: tutorials/get-started/get-started-using-node-js.ja.md
        targets:
            - ja

        # Redirect for old JS Client Library URL
    -   name: Get Started Using Node.js
        html: get-started-with-rippleapi-for-javascript.html
        template: template-redirect.html
        redirect_url: get-started-using-node-js.html
        nav_omit: true
        targets:
            - en
            - ja

    -   md: tutorials/get-started/get-started-using-http-websocket-apis.md
        targets:
            - en

    -   md: tutorials/get-started/get-started-using-http-websocket-apis.ja.md
        targets:
            - ja

        # Redirect for old HTTP/WebSocket APIs URL
    -   name: Get Started Using HTTP / WebSocket APIs
        html: get-started-with-the-rippled-api.html
        template: template-redirect.html
        redirect_url: get-started-using-http-websocket-apis.html
        nav_omit: true
        targets:
            - en
            - ja

    -   md: tutorials/get-started/send-xrp.md
        targets:
            - en

    -   md: tutorials/get-started/send-xrp.ja.md
        targets:
            - ja

    -   md: tutorials/get-started/monitor-incoming-payments-with-websocket.md
        targets:
            - en

    -   md: tutorials/get-started/monitor-incoming-payments-with-websocket.ja.md
        targets:
            - ja

        # Send old "Use Direct XRP Payments" landing to "Get Started" instead
    -   name: Use Direct XRP Payments
        html: use-simple-xrp-payments.html
        template: template-redirect.html
        nav_omit: true
        redirect_url: get-started.html
        targets:
            - en
            - ja

        # TODO: translate this page name and blurb
    -   name: Production Readiness
        html: production-readiness.html
        parent: tutorials.html
        template: template-landing-children.html
        blurb: Follow these best practices to build a robust, safe production system for using the XRP Ledger.
        targets:
            - en
            - ja

    -   md: tutorials/production-readiness/set-up-secure-signing.md
        targets:
            - en

    -   md: tutorials/production-readiness/set-up-secure-signing.ja.md
        targets:
            - ja

    -   md: tutorials/production-readiness/look-up-transaction-results.md
        targets:
            - en

    -   md: tutorials/production-readiness/look-up-transaction-results.ja.md
        targets:
            - ja

    -   md: tutorials/production-readiness/reliable-transaction-submission.md
        targets:
            - en

    -   md: tutorials/production-readiness/reliable-transaction-submission.ja.md
        targets:
            - ja

        # Redirect for this page's new home outside of tutorials
    -   name: Cancel or Skip a Transaction
        html: cancel-or-skip-a-transaction.html
        template: template-redirect.html
        nav_omit: true
        redirect_url: about-canceling-a-transaction.html
        targets:
            - en
            - ja

    -   name: Manage Account Settings
        html: manage-account-settings.html
        parent: tutorials.html
        template: template-landing-children.html
        blurb: Set up your XRP Ledger account to send and receive payments the way you want it to.
        targets:
            - en

    -   name: アカウントの設定の利用
        html: manage-account-settings.html
        parent: tutorials.html
        template: template-landing-children.html
        blurb: 希望する方法で支払いをやり取りできるようにXRP Ledgerアカウントを設定します。
        targets:
            - ja

    # TODO: "Get an Account" (DOC-1554)
    # blurb: Learn how to generate and fund an XRP Ledger address to create an XRP Ledger account.

    -   md: tutorials/manage-account-settings/assign-a-regular-key-pair.md
        targets:
            - en

    -   md: tutorials/manage-account-settings/assign-a-regular-key-pair.ja.md
        targets:
            - ja

    -   md: tutorials/manage-account-settings/change-or-remove-a-regular-key-pair.md
        targets:
            - en

    -   md: tutorials/manage-account-settings/change-or-remove-a-regular-key-pair.ja.md
        targets:
            - ja

    # TODO: translate this page & blurb
    -   md: tutorials/manage-account-settings/disable-master-key-pair.md
        targets:
            - en
            - ja

    -   md: tutorials/manage-account-settings/set-up-multi-signing.md
        targets:
            - en

    -   md: tutorials/manage-account-settings/set-up-multi-signing.ja.md
        targets:
            - ja

    -   md: tutorials/manage-account-settings/send-a-multi-signed-transaction.md
        targets:
            - en

    -   md: tutorials/manage-account-settings/send-a-multi-signed-transaction.ja.md
        targets:
            - ja

    -   md: tutorials/manage-account-settings/require-destination-tags.md
        targets:
            - en

    -   md: tutorials/manage-account-settings/require-destination-tags.ja.md
        targets:
            - ja

    -   md: tutorials/manage-account-settings/offline-account-setup.md
        targets:
            - en

    -   md: tutorials/manage-account-settings/offline-account-setup.ja.md
        targets:
            - ja

    -   md: tutorials/manage-account-settings/use-tickets.md
        targets:
            - en
            - ja

    # TODO: "Use Deposit Authorization to Block Unwanted Payments" (DOC-1555)

    -   name: Use Specialized Payment Types
        html: use-specialized-payment-types.html
        parent: tutorials.html
        template: template-landing-children.html
        blurb: Use advanced features like Escrow and Payment Channels to build smart applications on the XRP Ledger.
        targets:
            - en

    -   name: 専門化した支払いタイプの使用
        html: use-specialized-payment-types.html
        parent: tutorials.html
        template: template-landing-children.html
        blurb: EscrowやPayment Channelなどの高度な機能を使用して、XRP Ledgerでスマートアプリケーションを構築します。
        targets:
            - ja

        # Redirect from old "complex" payment types URL
    -   name: Use Complex Payment Types
        html: use-complex-payment-types.html
        template: template-redirect.html
        nav_omit: true
        redirect_url: use-specialized-payment-types.html
        targets:
            - en
            - ja

    -   name: Use Escrows
        html: use-escrows.html
        parent: use-specialized-payment-types.html
        blurb: The XRP Ledger supports escrows that can be executed only after a certain time has passed or a cryptographic condition has been fulfilled. Escrows can only send XRP, not issued currencies.
        template: template-landing-children.html
        targets:
            - en

    -   name: Escrowの使用
        html: use-escrows.html
        parent: use-specialized-payment-types.html
        blurb: XRP Ledgerは、一定時間の経過後か暗号条件が満たされた場合にのみ実行されるEscrowをサポートします。Escrowが送金できるのはXRPのみで、発行済み通貨は送金できません。
        template: template-landing-children.html
        targets:
            - ja

    -   md: tutorials/use-specialized-payment-types/use-escrows/send-a-time-held-escrow.md
        targets:
            - en

    -   md: tutorials/use-specialized-payment-types/use-escrows/send-a-time-held-escrow.ja.md
        targets:
            - ja

    -   md: tutorials/use-specialized-payment-types/use-escrows/send-a-conditionally-held-escrow.md
        targets:
            - en

    -   md: tutorials/use-specialized-payment-types/use-escrows/send-a-conditionally-held-escrow.ja.md
        targets:
            - ja

    -   md: tutorials/use-specialized-payment-types/use-escrows/cancel-an-expired-escrow.md
        targets:
            - en

    -   md: tutorials/use-specialized-payment-types/use-escrows/cancel-an-expired-escrow.ja.md
        targets:
            - ja

    -   md: tutorials/use-specialized-payment-types/use-escrows/look-up-escrows.md
        targets:
            - en

    -   md: tutorials/use-specialized-payment-types/use-escrows/look-up-escrows.ja.md
        targets:
            - ja

    -   md: tutorials/use-specialized-payment-types/use-escrows/use-an-escrow-as-a-smart-contract.md
        targets:
            - en
            - ja

    #TODO: split concept info off of the paychan tutorial
    -   md: tutorials/use-specialized-payment-types/use-payment-channels.md
        targets:
            - en

    -   md: tutorials/use-specialized-payment-types/use-payment-channels.ja.md
        targets:
            - ja

    -   md: tutorials/use-specialized-payment-types/open-a-payment-channel-to-enable-an-inter-exchange-network.md
        targets:
            - en
            - ja

    -   md: tutorials/use-specialized-payment-types/use-checks/use-checks.md
        targets:
            - en

    -   md: tutorials/use-specialized-payment-types/use-checks/use-checks.ja.md
        targets:
            - ja

    -   md: tutorials/use-specialized-payment-types/use-checks/send-a-check.md
        targets:
            - en

    -   md: tutorials/use-specialized-payment-types/use-checks/send-a-check.ja.md
        targets:
            - ja

    -   md: tutorials/use-specialized-payment-types/use-checks/cash-a-check-for-an-exact-amount.md
        targets:
            - en

    -   md: tutorials/use-specialized-payment-types/use-checks/cash-a-check-for-an-exact-amount.ja.md
        targets:
            - ja

    -   md: tutorials/use-specialized-payment-types/use-checks/cash-a-check-for-a-flexible-amount.md
        targets:
            - en

    -   md: tutorials/use-specialized-payment-types/use-checks/cash-a-check-for-a-flexible-amount.ja.md
        targets:
            - ja

    -   md: tutorials/use-specialized-payment-types/use-checks/cancel-a-check.md
        targets:
            - en

    -   md: tutorials/use-specialized-payment-types/use-checks/cancel-a-check.ja.md
        targets:
            - ja

    -   md: tutorials/use-specialized-payment-types/use-checks/look-up-checks-by-sender.md
        targets:
            - en

    -   md: tutorials/use-specialized-payment-types/use-checks/look-up-checks-by-sender.ja.md
        targets:
            - ja

    -   md: tutorials/use-specialized-payment-types/use-checks/look-up-checks-by-recipient.md
        targets:
            - en

    -   md: tutorials/use-specialized-payment-types/use-checks/look-up-checks-by-recipient.ja.md
        targets:
            - ja

    # TODO: "Send a Cross-Currency Payment"

    # TODO: Set up issuing/operational addresses, monitor changes to balances,
    # freeze, enable/disable rippling, set transfer fees, use auth'd trust lines

    -   name: XRP Ledger Businesses
        html: xrp-ledger-businesses.html
        parent: tutorials.html
        blurb: This section demonstrates how to follow various best practices for running businesses that interface with the XRP Ledger, such as exchanges listing XRP and gateways issuing currency in the XRP Ledger.
        template: template-landing-children.html
        targets:
            - en

    -   name: XRP Ledgerが利用する会社について
        html: xrp-ledger-businesses.html
        parent: tutorials.html
        blurb: このセクションでは、さまざまなベストプラクティスに従って、XRPを上場する取引所やXRP Ledgerで通貨を発行するゲートウェアなど、XRP Ledgerとインターフェイス接続するビジネスを運営する方法をデモンストレーションします。
        template: template-landing-children.html
        targets:
            - ja

    -   md: tutorials/xrp-ledger-businesses/list-xrp-as-an-exchange.md
        targets:
            - en

    -   md: tutorials/xrp-ledger-businesses/list-xrp-as-an-exchange.ja.md
        targets:
            - ja

    -   md: tutorials/xrp-ledger-businesses/list-your-exchange-on-xrp-charts.md
        targets:
            - en

    -   md: tutorials/xrp-ledger-businesses/list-your-exchange-on-xrp-charts.ja.md
        targets:
            - ja

    -   md: tutorials/xrp-ledger-businesses/become-an-xrp-ledger-gateway.md
        targets:
            - en
            - ja

    -   name: Manage the rippled Server
        html: manage-the-rippled-server.html
        parent: tutorials.html
        blurb: Install, configure, and manage the core server that powers the XRP Ledger.
        cta_text: Run rippled
        template: template-landing-children.html
        targets:
            - en

    -   name: rippledサーバの利用
        html: manage-the-rippled-server.html
        parent: tutorials.html
        blurb: XRP Ledgerをパワーするサーバーをインストール、設定、管理しよう。
        cta_text: インストールしよう
        template: template-landing-children.html
        targets:
            - ja

    -   name: Install rippled
        html: install-rippled.html
        parent: manage-the-rippled-server.html
        blurb: Install and update the rippled server.
        template: template-landing-children.html
        targets:
            - en

    -   name: rippledのインストール
        html: install-rippled.html
        parent: manage-the-rippled-server.html
        blurb: rippledサーバーをインストールして更新します。
        template: template-landing-children.html
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/installation/system-requirements.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/installation/system-requirements.ja.md
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/installation/install-rippled-on-centos-rhel-with-yum.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/installation/install-rippled-on-centos-rhel-with-yum.ja.md
        targets:
            - ja

    # Redirect old Alien-based install
    -   name: Install rippled on Ubuntu with Alien
        html: install-rippled-on-ubuntu-with-alien.html
        parent: install-rippled.html
        template: template-redirect.html
        nav_omit: true
        redirect_url: install-rippled-on-ubuntu.html
        targets:
            - en
            - ja

    -   md: tutorials/manage-the-rippled-server/installation/install-rippled-on-ubuntu.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/installation/install-rippled-on-ubuntu.ja.md
        targets:
            - ja

    -   name: Update rippled Automatically on CentOS/RHEL
        html: update-rippled-automatically-on-centos-rhel.html
        template: template-redirect.html
        nav_omit: true
        redirect_url: update-rippled-automatically-on-linux.html
        targets:
            - en
            - ja

    -   md: tutorials/manage-the-rippled-server/installation/update-rippled-automatically-on-linux.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/installation/update-rippled-automatically-on-linux.ja.md
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/installation/update-rippled-manually-on-centos-rhel.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/installation/update-rippled-manually-on-centos-rhel.ja.md
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/installation/update-rippled-manually-on-ubuntu.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/installation/update-rippled-manually-on-ubuntu.ja.md
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/installation/build-run-rippled-ubuntu.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/installation/build-run-rippled-ubuntu.ja.md
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/installation/build-run-rippled-macos.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/installation/build-run-rippled-macos.ja.md
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/installation/capacity-planning.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/installation/capacity-planning.ja.md
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/installation/rippled-1-3-migration-instructions.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/installation/rippled-1-3-migration-instructions.ja.md
        targets:
            - ja

    -   name: Configure rippled
        html: configure-rippled.html
        parent: manage-the-rippled-server.html
        blurb: Customize your rippled server configuration.
        template: template-landing-children.html
        targets:
            - en

    -   name: rippledの設定
        html: configure-rippled.html
        parent: manage-the-rippled-server.html
        blurb: rippledサーバーの構成をカスタマイズします。
        template: template-landing-children.html
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/configuration/run-rippled-as-a-validator.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/configuration/run-rippled-as-a-validator.ja.md
        targets:
            - ja

    # TODO: translate this page & blurb
    -   md: tutorials/manage-the-rippled-server/configuration/run-rippled-as-a-wallet-server.md
        targets:
            - en
            - ja

    # TODO: translate this page & blurb
    -   md: tutorials/manage-the-rippled-server/configuration/configure-amendment-voting.md
        targets:
            - en
            - ja

    # TODO: translate this page & blurb
    -   md: tutorials/manage-the-rippled-server/configuration/configure-statsd.md
        targets:
            - en
            - ja

    -   md: tutorials/manage-the-rippled-server/configuration/connect-your-rippled-to-the-xrp-test-net.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/configuration/connect-your-rippled-to-the-xrp-test-net.ja.md
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/configuration/configure-online-deletion.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/configuration/configure-online-deletion.ja.md
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/configuration/configure-advisory-deletion.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/configuration/configure-advisory-deletion.ja.md
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/configuration/configure-history-sharding.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/configuration/configure-history-sharding.ja.md
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/configuration/configure-full-history.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/configuration/configure-full-history.ja.md
        targets:
            - ja

        # TODO: translate page
    -   md: tutorials/manage-the-rippled-server/configuration/configure-grpc.md
        targets:
            - en
            - ja

    -   md: tutorials/manage-the-rippled-server/configuration/enable-public-signing.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/configuration/enable-public-signing.ja.md
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/configure-peering/configure-peering.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/configure-peering/configure-peering.ja.md
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/configure-peering/cluster-rippled-servers.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/configure-peering/cluster-rippled-servers.ja.md
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/configure-peering/configure-a-private-server.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/configure-peering/configure-a-private-server.ja.md
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/configure-peering/configure-the-peer-crawler.md
        targets:
            - en

    # TODO: translate this page. # For now we just have a translated blurb.
    -   md: tutorials/manage-the-rippled-server/configure-peering/configure-the-peer-crawler.md
        blurb: rippledサーバーがステータスとピアについてどの程度の情報を公表するか設定します。
        untranslated_warning: true
        targets:
            - ja

    # TODO: translate this page
    -   md: tutorials/manage-the-rippled-server/configure-peering/enable-link-compression.md
        targets:
            - en
            - ja

    -   md: tutorials/manage-the-rippled-server/configure-peering/forward-ports-for-peering.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/configure-peering/forward-ports-for-peering.ja.md
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/configure-peering/manually-connect-to-a-specific-peer.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/configure-peering/manually-connect-to-a-specific-peer.ja.md
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/configure-peering/set-max-number-of-peers.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/configure-peering/set-max-number-of-peers.ja.md
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/configure-peering/use-a-peer-reservation.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/configure-peering/use-a-peer-reservation.ja.md
        targets:
            - ja

    -   name: Test rippled Functionality in Stand-Alone Mode
        html: use-stand-alone-mode.html
        parent: manage-the-rippled-server.html
        blurb: For new features and experiments, you can use Stand-Alone Mode to test features with a full network.
        template: template-landing-children.html
        targets:
            - en

    -   name: スタンドアロンモードでrippledをテスト
        html: use-stand-alone-mode.html
        parent: manage-the-rippled-server.html
        blurb: 新機能や実験用に、スタンドアロンモードを使用してフルネットワークで機能をテストできます。
        template: template-landing-children.html
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/stand-alone-mode/start-a-new-genesis-ledger-in-stand-alone-mode.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/stand-alone-mode/start-a-new-genesis-ledger-in-stand-alone-mode.ja.md
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/stand-alone-mode/load-a-saved-ledger-in-stand-alone-mode.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/stand-alone-mode/load-a-saved-ledger-in-stand-alone-mode.ja.md
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/stand-alone-mode/advance-the-ledger-in-stand-alone-mode.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/stand-alone-mode/advance-the-ledger-in-stand-alone-mode.ja.md
        targets:
            - ja

    -   name: Troubleshoot the rippled server
        html: troubleshoot-the-rippled-server.html
        parent: manage-the-rippled-server.html
        blurb: Troubleshoot all kinds of problems with the rippled server.
        template: template-landing-children.html
        targets:
            - en

    -   name: rippledのトラブルシューティング
        html: troubleshoot-the-rippled-server.html
        parent: manage-the-rippled-server.html
        blurb: rippledサーバーのあらゆる種類の問題をトラブルシューティングします。
        template: template-landing-children.html
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/troubleshooting/diagnosing-problems.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/troubleshooting/diagnosing-problems.ja.md
        targets:
            - ja

        # TODO: translate page and blurb
    -   md: tutorials/manage-the-rippled-server/troubleshooting/health-check-interventions.md
        targets:
            - en
            - ja

    -   md: tutorials/manage-the-rippled-server/troubleshooting/understanding-log-messages.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/troubleshooting/understanding-log-messages.ja.md
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/troubleshooting/server-doesnt-sync.md
        targets:
            - en

        #TODO: translate the blurb in this page's frontmatter
    -   md: tutorials/manage-the-rippled-server/troubleshooting/server-doesnt-sync.ja.md
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/troubleshooting/server-wont-start.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/troubleshooting/server-wont-start.ja.md
        targets:
            - ja

    -   md: tutorials/manage-the-rippled-server/troubleshooting/fix-sqlite-tx-db-page-size-issue.md
        targets:
            - en

    -   md: tutorials/manage-the-rippled-server/troubleshooting/fix-sqlite-tx-db-page-size-issue.ja.md
        targets:
            - ja

# References -------------------------------------------------------------------

    -   name: References
        longer_name: API References
        template: template-landing-references.html
        html: references.html
        parent: docs.html
        top_nav_level: 2
        sidebar: disabled
        blurb: Complete references for different interfaces to the XRP Ledger.
        targets:
            - en

    -   name: リファレンス
        longer_name: API リファレンス
        template: template-landing-references.html
        html: references.html
        parent: docs.html
        top_nav_level: 2
        sidebar: disabled
        blurb: XRP Ledgerへのさまざまなインターフェイスの包括的なリファレンスです。
        targets:
            - ja


    -   name: XRP Ledger Protocol Reference
        html: protocol-reference.html
        parent: references.html
        template: template-landing-children.html
        blurb: Features and rules of the XRP Ledger protocol, regardless of how you access it.
        targets:
            - en
            - ja

    -   md: references/protocol-reference/basic-data-types.md
        targets:
            - en

    -   md: references/protocol-reference/basic-data-types.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/base58-encodings.md
        targets:
            - en

    -   md: references/protocol-reference/base58-encodings.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/currency-formats.md
        targets:
            - en

    -   md: references/protocol-reference/currency-formats.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/ledger-data/ledger-data-formats.md
        targets:
            - en

    -   md: references/protocol-reference/ledger-data/ledger-data-formats.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/ledger-data/ledger-header.md
        targets:
            - en

    -   md: references/protocol-reference/ledger-data/ledger-header.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/ledger-data/ledger-object-ids.md
        targets:
            - en

    -   md: references/protocol-reference/ledger-data/ledger-object-ids.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/ledger-data/ledger-object-types/ledger-object-types.md
        targets:
            - en

    -   md: references/protocol-reference/ledger-data/ledger-object-types/ledger-object-types.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/ledger-data/ledger-object-types/accountroot.md
        targets:
            - en

    -   md: references/protocol-reference/ledger-data/ledger-object-types/accountroot.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/ledger-data/ledger-object-types/amendments.md
        targets:
            - en

    -   md: references/protocol-reference/ledger-data/ledger-object-types/amendments.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/ledger-data/ledger-object-types/check.md
        targets:
            - en

    -   md: references/protocol-reference/ledger-data/ledger-object-types/check.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/ledger-data/ledger-object-types/depositpreauth.md
        targets:
            - en

    -   md: references/protocol-reference/ledger-data/ledger-object-types/depositpreauth.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/ledger-data/ledger-object-types/directorynode.md
        targets:
            - en

    -   md: references/protocol-reference/ledger-data/ledger-object-types/directorynode.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/ledger-data/ledger-object-types/escrow.md
        targets:
            - en

    -   md: references/protocol-reference/ledger-data/ledger-object-types/escrow.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/ledger-data/ledger-object-types/feesettings.md
        targets:
            - en

    -   md: references/protocol-reference/ledger-data/ledger-object-types/feesettings.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/ledger-data/ledger-object-types/ledgerhashes.md
        targets:
            - en

    -   md: references/protocol-reference/ledger-data/ledger-object-types/ledgerhashes.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/ledger-data/ledger-object-types/negativeunl.md
        targets:
            - en
            - ja

    -   md: references/protocol-reference/ledger-data/ledger-object-types/offer.md
        targets:
            - en

    -   md: references/protocol-reference/ledger-data/ledger-object-types/offer.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/ledger-data/ledger-object-types/paychannel.md
        targets:
            - en

    -   md: references/protocol-reference/ledger-data/ledger-object-types/paychannel.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/ledger-data/ledger-object-types/ripplestate.md
        targets:
            - en

    -   md: references/protocol-reference/ledger-data/ledger-object-types/ripplestate.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/ledger-data/ledger-object-types/signerlist.md
        targets:
            - en

    -   md: references/protocol-reference/ledger-data/ledger-object-types/signerlist.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/ledger-data/ledger-object-types/ticket.md
        targets:
            - en
            - ja

    -   md: references/protocol-reference/transactions/transaction-formats.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-formats.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/transaction-common-fields.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-common-fields.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/transaction-types/transaction-types.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-types/transaction-types.ja.md
        targets:
            - ja

    # TODO: translate _snippets/tx-fields-intro.md

    -   md: references/protocol-reference/transactions/transaction-types/accountset.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-types/accountset.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/transaction-types/accountdelete.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-types/accountdelete.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/transaction-types/checkcancel.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-types/checkcancel.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/transaction-types/checkcash.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-types/checkcash.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/transaction-types/checkcreate.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-types/checkcreate.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/transaction-types/depositpreauth.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-types/depositpreauth.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/transaction-types/escrowcancel.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-types/escrowcancel.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/transaction-types/escrowcreate.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-types/escrowcreate.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/transaction-types/escrowfinish.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-types/escrowfinish.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/transaction-types/offercancel.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-types/offercancel.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/transaction-types/offercreate.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-types/offercreate.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/transaction-types/payment.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-types/payment.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/transaction-types/paymentchannelclaim.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-types/paymentchannelclaim.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/transaction-types/paymentchannelcreate.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-types/paymentchannelcreate.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/transaction-types/paymentchannelfund.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-types/paymentchannelfund.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/transaction-types/setregularkey.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-types/setregularkey.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/transaction-types/signerlistset.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-types/signerlistset.ja.md
        targets:
            - ja

        # TODO: translate
    -   md: references/protocol-reference/transactions/transaction-types/ticketcreate.md
        targets:
            - en
            - ja

    -   md: references/protocol-reference/transactions/transaction-types/trustset.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-types/trustset.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/pseudo-transaction-types/pseudo-transaction-types.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/pseudo-transaction-types/pseudo-transaction-types.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/pseudo-transaction-types/enableamendment.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/pseudo-transaction-types/enableamendment.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/pseudo-transaction-types/setfee.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/pseudo-transaction-types/setfee.ja.md
        targets:
            - ja

        # TODO: translate
    -   md: references/protocol-reference/transactions/pseudo-transaction-types/unlmodify.md
        targets:
            - en
            - ja

    -   md: references/protocol-reference/transactions/transaction-results/transaction-results.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-results/transaction-results.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/transaction-results/tec-codes.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-results/tec-codes.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/transaction-results/tef-codes.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-results/tef-codes.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/transaction-results/tel-codes.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-results/tel-codes.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/transaction-results/tem-codes.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-results/tem-codes.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/transaction-results/ter-codes.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-results/ter-codes.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/transaction-results/tes-success.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-results/tes-success.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/transactions/transaction-metadata.md
        targets:
            - en

    -   md: references/protocol-reference/transactions/transaction-metadata.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/modifying-the-ledger.md
        targets:
            - en

    -   md: references/protocol-reference/modifying-the-ledger.ja.md
        targets:
            - ja

    -   md: references/protocol-reference/serialization.md
        targets:
            - en

    -   md: references/protocol-reference/serialization.ja.md
        targets:
            - ja

    # Client Libraries ---------------------------------------------------------

        # TODO: translate page & blurb
    -   md: references/client-libraries.md
        targets:
            - en
            - ja

    -   name: JavaScript / TypeScript Client Library
        md: https://raw.githubusercontent.com/ripple/ripple-lib/1.9.4/docs/index.md
        html: rippleapi-reference.html
        parent: client-libraries.html
        blurb: JavaScript/TypeScript client library to the XRP Ledger.
        skip_spell_checker: true
        # Japanese: XRP Ledgerに対する公式なクライアントライブラリです。JavaScriptのみで使用できます。
        curated_anchors:
            - name: Transactions
              anchor: "#transaction-overview"
            - name: Basic Types
              anchor: "#basic-types"
            - name: Methods
              anchor: "#api-methods"
        filters:
            - remove_doctoc
            - add_version
        targets:
            - en
            - ja

    -   name: Python Client Library
        html: https://xrpl-py.readthedocs.io/
        parent: client-libraries.html
        blurb: Python client library to the XRP Ledger.
        targets:
            - en
            - ja

    -   name: Java Client Library
        html: https://javadoc.io/doc/org.xrpl/
        parent: client-libraries.html
        blurb: Java client library to the XRP Ledger.
        targets:
            - en
            - ja


    # HTTP / Websocket APIs ----------------------------------------------------

    -   name: HTTP / WebSocket APIs
        html: rippled-api.html
        parent: references.html
        template: template-landing-children.html
        blurb: Communicate directly with rippled, the core peer-to-peer server that manages the XRP Ledger.
        targets:
            - en

    -   name: HTTP / WebSocket API リファレンス
        html: rippled-api.html
        parent: references.html
        template: template-landing-children.html
        blurb: XRP Ledgerを管理するコアのピアツーピアサーバーであるrippledと直接通信します。
        targets:
            - ja

    -   md: references/rippled-api/api-conventions/api-conventions.md
        targets:
            - en

    -   md: references/rippled-api/api-conventions/api-conventions.ja.md
        targets:
            - ja

    -   md: references/rippled-api/api-conventions/request-formatting.md
        targets:
            - en

    -   md: references/rippled-api/api-conventions/request-formatting.ja.md
        targets:
            - ja

    -   md: references/rippled-api/api-conventions/response-formatting.md
        targets:
            - en

    -   md: references/rippled-api/api-conventions/response-formatting.ja.md
        targets:
            - ja

    -   md: references/rippled-api/api-conventions/error-formatting.md
        targets:
            - en

    -   md: references/rippled-api/api-conventions/error-formatting.ja.md
        targets:
            - ja

    -   md: references/rippled-api/api-conventions/markers-and-pagination.md
        targets:
            - en

    -   md: references/rippled-api/api-conventions/markers-and-pagination.ja.md
        targets:
            - ja

    # TODO: translate page & blurb
    -   md: references/rippled-api/api-conventions/rate-limiting.md
        targets:
            - en
            - ja

    -   md: references/rippled-api/api-conventions/rippled-server-states.md
        targets:
            - en

    -   md: references/rippled-api/api-conventions/rippled-server-states.ja.md
        targets:
            - ja

# rippled Public Methods

    -   md: references/rippled-api/public-rippled-methods/public-rippled-methods.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/public-rippled-methods.ja.md
        targets:
            - ja

    -   name: Account Methods
        html: account-methods.html
        parent: public-rippled-methods.html
        template: template-landing-children.html
        blurb: An account in the XRP Ledger represents a holder of XRP and a sender of transactions. Use these methods to work with account info.
        targets:
            - en

    -   name: Account Methods
        html: account-methods.html
        parent: public-rippled-methods.html
        template: template-landing-children.html
        blurb: XRP Ledgerのアカウントとは、XRPの保有者とトランザクションの送信者を意味します。以下のメソッドを使用して、アカウント情報を処理します。
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/account-methods/account_channels.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/account-methods/account_channels.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/account-methods/account_currencies.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/account-methods/account_currencies.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/account-methods/account_info.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/account-methods/account_info.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/account-methods/account_lines.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/account-methods/account_lines.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/account-methods/account_objects.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/account-methods/account_objects.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/account-methods/account_offers.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/account-methods/account_offers.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/account-methods/account_tx.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/account-methods/account_tx.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/account-methods/gateway_balances.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/account-methods/gateway_balances.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/account-methods/noripple_check.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/account-methods/noripple_check.ja.md
        targets:
            - ja

    -   name: Ledger Methods
        html: ledger-methods.html
        parent: public-rippled-methods.html
        blurb: A ledger version contains a header, a transaction tree, and a state tree, which contain account settings, trustlines, balances, transactions, and other data. Use these methods to retrieve ledger info.
        template: template-landing-children.html
        targets:
            - en

    -   name: Ledger Methods
        html: ledger-methods.html
        parent: public-rippled-methods.html
        blurb: レジャーバージョンには、ヘッダー、トランザクションツリー、状態ツリーが含まれ、さらにその中にアカウント設定、トラストライン、残高、トランザクション、その他のデータが含まれます。以下のメソッドを使用して、レジャー情報を取得します。
        template: template-landing-children.html
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/ledger-methods/ledger.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/ledger-methods/ledger.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/ledger-methods/ledger_closed.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/ledger-methods/ledger_closed.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/ledger-methods/ledger_current.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/ledger-methods/ledger_current.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/ledger-methods/ledger_data.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/ledger-methods/ledger_data.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/ledger-methods/ledger_entry.md
        targets:
            - en

        # TODO: update the translation of this page
    -   md: references/rippled-api/public-rippled-methods/ledger-methods/ledger_entry.ja.md
        targets:
            - ja

    -   name: Transaction Methods
        html: transaction-methods.html # watch for clashes w/ this filename
        parent: public-rippled-methods.html
        template: template-landing-children.html
        blurb: Transactions are the only thing that can modify the shared state of the XRP Ledger. All business on the XRP Ledger takes the form of transactions. Use these methods to work with transactions. #TODO:translate
        targets:
            - en

    -   name: Transaction Methods
        html: transaction-methods.html # watch for clashes w/ this filename
        parent: public-rippled-methods.html
        template: template-landing-children.html
        blurb: トランザクションだけが、XRP Ledgerの共有されている状態を変更できます。XRP Ledgerに対するすべてのビジネスはトランザクションの形態をとります。以下のメソッドを使用して、トランザクションを処理します。
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/transaction-methods/sign.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/transaction-methods/sign.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/transaction-methods/sign_for.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/transaction-methods/sign_for.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/transaction-methods/submit.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/transaction-methods/submit.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/transaction-methods/submit_multisigned.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/transaction-methods/submit_multisigned.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/transaction-methods/transaction_entry.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/transaction-methods/transaction_entry.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/transaction-methods/tx.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/transaction-methods/tx.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/transaction-methods/tx_history.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/transaction-methods/tx_history.ja.md
        targets:
            - ja

    -   name: Path and Order Book Methods
        html: path-and-order-book-methods.html
        parent: public-rippled-methods.html
        blurb: Paths define a way for payments to flow through intermediary steps on their way from sender to receiver. Paths enable cross-currency payments by connecting sender and receiver through order books. Use these methods to work with paths and other books.
        template: template-landing-children.html
        targets:
            - en

    -   name: Path and Order Book Methods
        html: path-and-order-book-methods.html
        parent: public-rippled-methods.html
        blurb: パスは、支払いが送信者から受信者に届くまでに中間ステップでたどる道筋を定義します。パスは、送信者と受信者をオーダーブックを介してつなぐことで、複数通貨間の支払いを可能にします。パスと他のオーダーブックに関しては、以下のメソッドを使用します。
        template: template-landing-children.html
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/path-and-order-book-methods/book_offers.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/path-and-order-book-methods/book_offers.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/path-and-order-book-methods/deposit_authorized.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/path-and-order-book-methods/deposit_authorized.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/path-and-order-book-methods/path_find.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/path-and-order-book-methods/path_find.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/path-and-order-book-methods/ripple_path_find.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/path-and-order-book-methods/ripple_path_find.ja.md
        targets:
            - ja

    -   name: Payment Channel Methods
        html: payment-channel-methods.html
        parent: public-rippled-methods.html
        blurb: Payment channels are a tool for facilitating repeated, unidirectional payments, or temporary credit between two parties. Use these methods to work with payment channels. #TODO:translate
        template: template-landing-children.html
        targets:
            - en
            - ja

    -   md: references/rippled-api/public-rippled-methods/payment-channel-methods/channel_authorize.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/payment-channel-methods/channel_authorize.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/payment-channel-methods/channel_verify.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/payment-channel-methods/channel_verify.ja.md
        targets:
            - ja

    -   name: Subscription Methods
        html: subscription-methods.html
        parent: public-rippled-methods.html
        blurb: Use these methods to enable the server to push updates to your client when various events happen, so that you can know and react right away. WebSocket API only. #TODO:translate
        template: template-landing-children.html
        targets:
            - en

    -   name: Subscription Methods
        html: subscription-methods.html
        parent: public-rippled-methods.html
        blurb: 以下のメソッドにより、各種イベントの発生時にサーバーからクライアントに更新が通知されるように設定できます。これにより、イベントを即座に把握し、対処することができます。WebSocket APIのみ。
        template: template-landing-children.html
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/subscription-methods/subscribe.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/subscription-methods/subscribe.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/subscription-methods/unsubscribe.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/subscription-methods/unsubscribe.ja.md
        targets:
            - ja

    -   name: Server Info Methods
        html: server-info-methods.html
        parent: public-rippled-methods.html
        blurb: Use these methods to retrieve information about the current state of the rippled server.
        template: template-landing-children.html
        targets:
            - en

    -   name: Server Info Methods
        html: server-info-methods.html
        parent: public-rippled-methods.html
        blurb: 以下のメソッドを使用して、rippledサーバーの現在の状態についての情報を取得します。
        template: template-landing-children.html
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/server-info-methods/fee.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/server-info-methods/fee.ja.md
        targets:
            - ja

        # TODO: translate
    -   md: references/rippled-api/public-rippled-methods/server-info-methods/manifest.md
        targets:
            - en
            - ja

    -   md: references/rippled-api/public-rippled-methods/server-info-methods/server_info.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/server-info-methods/server_info.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/server-info-methods/server_state.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/server-info-methods/server_state.ja.md
        targets:
            - ja

    -   name: Utility Methods
        html: utility-methods.html
        parent: public-rippled-methods.html
        blurb: Use these methods to perform convenient tasks, such as ping and random number generation.
        template: template-landing-children.html
        targets:
            - en
            - ja

    -   md: references/rippled-api/public-rippled-methods/utility-methods/json.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/utility-methods/json.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/utility-methods/ping.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/utility-methods/ping.ja.md
        targets:
            - ja

    -   md: references/rippled-api/public-rippled-methods/utility-methods/random.md
        targets:
            - en

    -   md: references/rippled-api/public-rippled-methods/utility-methods/random.ja.md
        targets:
            - ja

    -   md: references/rippled-api/admin-rippled-methods/admin-rippled-methods.md
        targets:
            - en

    -   md: references/rippled-api/admin-rippled-methods/admin-rippled-methods.ja.md
        targets:
            - ja

    -   name: Key Generation Methods
        html: key-generation-methods.html
        parent: admin-rippled-methods.html
        blurb: Use these methods to generate and manage keys.
        template: template-landing-children.html
        targets:
            - en

    -   name: キー生成のメソッド
        html: key-generation-methods.html
        parent: admin-rippled-methods.html
        blurb: キーを生成および管理するには、以下のメソッドを使用します。
        template: template-landing-children.html
        targets:
            - ja

    -   md: references/rippled-api/admin-rippled-methods/key-generation-methods/validation_create.md
        targets:
            - en

    -   md: references/rippled-api/admin-rippled-methods/key-generation-methods/validation_create.ja.md
        targets:
            - ja

    -   md: references/rippled-api/admin-rippled-methods/key-generation-methods/wallet_propose.md
        targets:
            - en

    -   md: references/rippled-api/admin-rippled-methods/key-generation-methods/wallet_propose.ja.md
        targets:
            - ja

    -   name: Logging and Data Management Methods
        html: logging-and-data-management-methods.html
        parent: admin-rippled-methods.html
        blurb: Use these methods to manage log levels and other data, such as ledgers.
        template: template-landing-children.html
        targets:
            - en

    -   name: ログとデータ管理のメソッド
        html: logging-and-data-management-methods.html
        parent: admin-rippled-methods.html
        blurb: Use these methods to manage log levels and other data, such as ledgers. #TODO: translate
        template: template-landing-children.html
        targets:
            - ja

    -   md: references/rippled-api/admin-rippled-methods/logging-and-data-management-methods/can_delete.md
        targets:
            - en

    -   md: references/rippled-api/admin-rippled-methods/logging-and-data-management-methods/can_delete.ja.md
        targets:
            - ja

    -   md: references/rippled-api/admin-rippled-methods/logging-and-data-management-methods/crawl_shards.md
        targets:
            - en

    -   md: references/rippled-api/admin-rippled-methods/logging-and-data-management-methods/crawl_shards.ja.md
        targets:
            - ja

    -   md: references/rippled-api/admin-rippled-methods/logging-and-data-management-methods/download_shard.md
        targets:
            - en

    -   md: references/rippled-api/admin-rippled-methods/logging-and-data-management-methods/download_shard.ja.md
        targets:
            - ja

    -   md: references/rippled-api/admin-rippled-methods/logging-and-data-management-methods/ledger_cleaner.md
        targets:
            - en

    -   md: references/rippled-api/admin-rippled-methods/logging-and-data-management-methods/ledger_cleaner.ja.md
        targets:
            - ja

    -   md: references/rippled-api/admin-rippled-methods/logging-and-data-management-methods/ledger_request.md
        targets:
            - en

    -   md: references/rippled-api/admin-rippled-methods/logging-and-data-management-methods/ledger_request.ja.md
        targets:
            - ja

    -   md: references/rippled-api/admin-rippled-methods/logging-and-data-management-methods/log_level.md
        targets:
            - en

    -   md: references/rippled-api/admin-rippled-methods/logging-and-data-management-methods/log_level.ja.md
        targets:
            - ja

    -   md: references/rippled-api/admin-rippled-methods/logging-and-data-management-methods/logrotate.md
        targets:
            - en

    -   md: references/rippled-api/admin-rippled-methods/logging-and-data-management-methods/logrotate.ja.md
        targets:
            - ja

        #TODO: translate title and blurb
    -   name: Server Control Methods
        html: server-control-methods.html
        parent: admin-rippled-methods.html
        blurb: Use these methods to manage the rippled server.
        template: template-landing-children.html
        targets:
            - en
            - ja

    -   md: references/rippled-api/admin-rippled-methods/server-control-methods/ledger_accept.md
        targets:
            - en

    -   md: references/rippled-api/admin-rippled-methods/server-control-methods/ledger_accept.ja.md
        targets:
            - ja

    -   md: references/rippled-api/admin-rippled-methods/server-control-methods/stop.md
        targets:
            - en

    -   md: references/rippled-api/admin-rippled-methods/server-control-methods/stop.ja.md
        targets:
            - ja

    -   md: references/rippled-api/admin-rippled-methods/server-control-methods/validation_seed.md
        targets:
            - en

    -   md: references/rippled-api/admin-rippled-methods/server-control-methods/validation_seed.ja.md
        targets:
            - ja


    -   name: Peer Management Methods
        html: peer-management-methods.html
        parent: admin-rippled-methods.html
        blurb: Use these methods to manage your server's peer-to-peer connections.
        template: template-landing-children.html
        targets:
            - en

    -   name: ピア管理のメソッド
        html: peer-management-methods.html
        parent: admin-rippled-methods.html
        blurb: サーバーのピアツーピア接続を管理するにはこれらのメソッドを使用します。
        template: template-landing-children.html
        targets:
            - ja

    -   md: references/rippled-api/admin-rippled-methods/peer-management-methods/connect.md
        targets:
            - en

    -   md: references/rippled-api/admin-rippled-methods/peer-management-methods/connect.ja.md
        targets:
            - ja

    -   md: references/rippled-api/admin-rippled-methods/peer-management-methods/peer_reservations_add.md
        targets:
            - en

    -   md: references/rippled-api/admin-rippled-methods/peer-management-methods/peer_reservations_add.ja.md
        targets:
            - ja

    -   md: references/rippled-api/admin-rippled-methods/peer-management-methods/peer_reservations_del.md
        targets:
            - en

    -   md: references/rippled-api/admin-rippled-methods/peer-management-methods/peer_reservations_del.ja.md
        targets:
            - ja

    -   md: references/rippled-api/admin-rippled-methods/peer-management-methods/peer_reservations_list.md
        targets:
            - en

    -   md: references/rippled-api/admin-rippled-methods/peer-management-methods/peer_reservations_list.ja.md
        targets:
            - ja

    -   md: references/rippled-api/admin-rippled-methods/peer-management-methods/peers.md
        targets:
            - en

    -   md: references/rippled-api/admin-rippled-methods/peer-management-methods/peers.ja.md
        targets:
            - ja

    -   name: Status and Debugging Methods
        html: status-and-debugging-methods.html
        parent: admin-rippled-methods.html
        blurb: Use these methods to check the status of the network and server.
        template: template-landing-children.html
        targets:
            - en

    -   name: ステータスとデバッグのメソッド
        html: status-and-debugging-methods.html
        parent: admin-rippled-methods.html
        blurb: ネットワークとサーバーのステータスを確認するには、以下のメソッドを使用します。
        template: template-landing-children.html
        targets:
            - ja

    -   md: references/rippled-api/admin-rippled-methods/status-and-debugging-methods/consensus_info.md
        targets:
            - en

    -   md: references/rippled-api/admin-rippled-methods/status-and-debugging-methods/consensus_info.ja.md
        targets:
            - ja

    -   md: references/rippled-api/admin-rippled-methods/status-and-debugging-methods/feature.md
        targets:
            - en

    -   md: references/rippled-api/admin-rippled-methods/status-and-debugging-methods/feature.ja.md
        targets:
            - ja

    -   md: references/rippled-api/admin-rippled-methods/status-and-debugging-methods/fetch_info.md
        targets:
            - en

    -   md: references/rippled-api/admin-rippled-methods/status-and-debugging-methods/fetch_info.ja.md
        targets:
            - ja

    -   md: references/rippled-api/admin-rippled-methods/status-and-debugging-methods/get_counts.md
        targets:
            - en

    -   md: references/rippled-api/admin-rippled-methods/status-and-debugging-methods/get_counts.ja.md
        targets:
            - ja

    -   md: references/rippled-api/admin-rippled-methods/status-and-debugging-methods/print.md
        targets:
            - en

    -   md: references/rippled-api/admin-rippled-methods/status-and-debugging-methods/print.ja.md
        targets:
            - ja

        # TODO: translate
    -   md: references/rippled-api/admin-rippled-methods/status-and-debugging-methods/validator_info.md
        targets:
            - en
            - ja

    -   md: references/rippled-api/admin-rippled-methods/status-and-debugging-methods/validator_list_sites.md
        targets:
            - en

    -   md: references/rippled-api/admin-rippled-methods/status-and-debugging-methods/validator_list_sites.ja.md
        targets:
            - ja

    -   md: references/rippled-api/admin-rippled-methods/status-and-debugging-methods/validators.md
        targets:
            - en

    -   md: references/rippled-api/admin-rippled-methods/status-and-debugging-methods/validators.ja.md
        targets:
            - ja

    -   md: references/rippled-api/commandline-usage.md
        targets:
            - en

    -   md: references/rippled-api/commandline-usage.ja.md
        targets:
            - ja

    # TODO: translate title & blurb
    -   name: Peer Port Methods
        html: peer-port-methods.html
        parent: rippled-api.html
        template: template-landing-children.html
        blurb: Special API method for sharing network topology and status metrics.
        targets:
            - en
            - ja

    # TODO: translate page & blurb
    -   md: references/rippled-api/peer-port-methods/health-check.md
        targets:
            - en
            - ja

    -   md: references/rippled-api/peer-port-methods/peer-crawler.md
        targets:
            - en

    # TODO: translate page (currently only the blurb is translated)
    -   md: references/rippled-api/peer-port-methods/peer-crawler.md
        blurb: ネットワークトポロジーとステータスメトリックを共有するための特殊なAPIメソッドです。
        untranslated_warning: true
        targets:
            - ja

    # TODO: translate page & blurb
    -   md: references/rippled-api/peer-port-methods/validator-list.md
        targets:
            - en
            - ja

        # Placeholder / redirect for XRP-API docs.
    -   md: references/xrp-api.md
        targets:
            - en
            - ja

        # Deprecation warnings for old Data API docs
    -   md: references/data-api.md
        targets:
            - en

    -   md: references/data-api.ja.md
        targets:
            - ja

    -   md: references/xrp-ledger-toml.md
        targets:
            - en

    -   md: references/xrp-ledger-toml.ja.md
        targets:
            - ja



# --------------- end "Docs" section -------------------------------------------
# Use Cases: these have been removed. Only redirects remain.

    -   name: Use Cases
        html: use-cases.html
        template: template-redirect.html
        nav_omit: true
        redirect_url: uses.html
        targets:
            - en

    -   name: ユースケース
        html: use-cases.html
        template: template-redirect.html
        nav_omit: true
        redirect_url: uses.html
        targets:
            - ja

    -   name: Run a rippled Validator
        html: run-a-rippled-validator.html
        template: template-redirect.html
        nav_omit: true
        redirect_url: run-rippled-as-a-validator.html
        targets:
            - en

    -   name: rippledバリデータの実行
        html: run-a-rippled-validator.html
        template: template-redirect.html
        nav_omit: true
        redirect_url: run-rippled-as-a-validator.html
        targets:
            - ja

    -   name: List XRP In Your Exchange
        html: list-xrp-in-your-exchange.html
        template: template-redirect.html
        nav_omit: true
        redirect_url: list-xrp-as-an-exchange.html
        targets:
            - en

    -   name: 取引所でのXRPの上場
        html: list-xrp-in-your-exchange.html
        template: template-redirect.html
        nav_omit: true
        redirect_url: list-xrp-as-an-exchange.html
        targets:
            - ja

    -   name: Contribute Code to rippled
        html: contribute-code-to-rippled.html
        template: template-redirect.html
        nav_omit: true
        redirect_url: contribute-code.html
        targets:
            - en

    -   name: rippledへのコードの提供
        html: contribute-code-to-rippled.html
        template: template-redirect.html
        nav_omit: true
        redirect_url: contribute-code.html
        targets:
            - ja

    -   name: Contribute Code to ripple-lib
        html: contribute-code-to-ripple-lib.html
        template: template-redirect.html
        nav_omit: true
        redirect_url: contribute-code.html
        targets:
            - en

    -   name: ripple-libへのコードの提供
        html: contribute-code-to-ripple-lib.html
        template: template-redirect.html
        nav_omit: true
        redirect_url: contribute-code.html
        targets:
            - ja

# Dev Tools --------------------------------------------------------------------
    -   md: dev-tools/dev-tools.md
        html: dev-tools.html
        parent: docs.html
        top_nav_level: 1
        blurb: Use these web-based tools to interact with the ledger and test your software.
        targets:
            - en

    -   md: dev-tools/dev-tools.ja.md
        html: dev-tools.html
        parent: docs.html
        top_nav_level: 1
        targets:
            - ja

    -   name: Dev Tools # Redirect page for old broken URL
        html: dev-tools-dev-tools.html
        template: template-redirect.html
        nav_omit: true
        redirect_url: dev-tools.html
        targets:
            - en
            - ja

    -   name: RPC Tool
        html: xrp-ledger-rpc-tool.html
        parent: dev-tools.html
        targets:
            - en
            - ja
        template: template-xrp-ledger-rpc-tool.html

    -   name: WebSocket API Tool
        html: websocket-api-tool.html
        parent: dev-tools.html
        template: template-websocket-api-tool.html
        canonical_url: https://xrpl.org/websocket-api-tool.html
        targets:
            - en
            - ja

    # -   name: Data API v2 Tool
    #     html: data-api-v2-tool.html
    #     parent: dev-tools.html
    #     methods_js: js/apitool-methods-data_v2.js
    #     rest_host: https://data.ripple.com
    #     doc_page: data-api.html
    #     sidebar: custom
    #     targets:
    #         - en
    #         - ja
    #     template: template-rest-api-tool.html

    -   name: ripple.txt Validator # Redirect from ripple.txt validator to toml
        html: ripple-txt-validator.html
        parent: dev-tools.html
        template: template-redirect.html
        nav_omit: true
        redirect_url: xrp-ledger-toml-checker.html
        targets:
            - en
            - ja

    -   name: xrp-ledger.toml Checker
        html: xrp-ledger-toml-checker.html
        parent: dev-tools.html
        embed_ripple_lib: true
        targets:
            - en
            - ja
        template: template-xrp-ledger-toml-checker.html

    -   name: Domain Verification Checker
        html: validator-domain-verifier.html
        parent: dev-tools.html
        targets:
            - en
            - ja
        template: template-validator-domain-verifier.html

    -   name: XRP Faucets
        html: xrp-testnet-faucet.html
        parent: dev-tools.html
        template: template-test-net.html
        targets:
            - en
            - ja

    -   name: XRP Test Net Faucet # Redirect from old URL
        html: xrp-test-net-faucet.html
        template: template-redirect.html
        nav_omit: true
        redirect_url: xrp-testnet-faucet.html
        targets:
            - en
            - ja

    -   name: Transaction Sender
        html: tx-sender.html
        parent: dev-tools.html
        embed_ripple_lib: true
        targets:
            - en
            - ja
        template: template-tx-sender.html

# Dev Blog ---------------------------------------------------------------------

    -   name: Dev Blog
        html: https://xrpl.org/blog/
        parent: docs.html
        blurb: Get news about the latest changes to the XRP Ledger protocol and tools.
        cta_text: Read the Blog
        targets:
            - en

    -   name: 開発者ブログ
        html: https://xrpl.org/blog/
        parent: docs.html
        blurb: Get news about the latest changes to the XRP Ledger protocol and tools.
        cta_text: ブログを読む
        targets:
            - ja

# "Contribute" pages -----------------------------------------------------------
    -   name: Contribute
        html: contribute.html
        parent: index.html
        template: template-contribute.html
        sidebar: disabled
        targets:
            - en

    -   name: 貢献する
        html: contribute.html
        parent: index.html
        template: template-contribute.html
        sidebar: disabled
        targets:
            - ja

    -   md: contributing/contribute-code.md
        html: contribute-code.html
        parent: contribute.html
        top_nav_omit: true
        targets:
            - en
            - ja

# Custom 404 page
    -   name: 404 Not Found
        html: 404.html
        template: template-404.html
        nav_omit: true
        prefix: "/"
        targets:
            - en
            - ja

# Special sitemap file (for better Google indexing)
    -   name: Sitemap
        html: sitemap.txt
        template: template-sitemap.txt
        nav_omit: true
        targets:
            - en


ignore_anchors_in:
    - data-api-v2-tool.html
    - websocket-api-tool.html

#Sometimes, a link is not really problematic, but the link checker detects it
# as such and the easiest solution is to ignore it.
known_broken_links:
    # These PDFs download OK in a browser
    - http://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A32015R0847
    - http://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=OJ:L:2006:345:0001:0009:EN:PDF
    # Dev blog link assumes relationship with xrpl.org
    - /blog/
    - /blog/label/rippled-release-notes.html
    - /blog/label/amendments.html
    - /blog/label/features.html
    # For various reasons these links break from the Python requests client,
    #  but they work in browser. (Often a protection against bots, like
    #  Cloudflare.)
    - https://web.archive.org/web/20161007113240/https://wiki.ripple.com/Ripple.txt
    - http://web.archive.org/web/20171211225452/https://forum.ripple.com/viewtopic.php?f=2&t=3613
    - https://bitcoinexchangeguide.com/cryptographic-puzzle-creator-xrpuzzler-offers-137-xrp-reward-to-anyone-who-can-solve-it/
    - https://www.coinbase.com/
    - https://www.forte.io/
    - https://www.kraken.com/
    - https://xrpscan.com/amendments

# Style Checker Config ------------------------------------------------------ #

word_substitutions_file: tool/word_substitutions.yaml
phrase_substitutions_file: tool/phrase_substitutions.yaml
spelling_file: tool/spelling.txt
