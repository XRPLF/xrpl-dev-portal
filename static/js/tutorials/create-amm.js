// 1. Generate
// 2. Connect
// The code for these steps is handled by interactive-tutorial.js
onCurrentRouteLoaded(() => {

    const EXPLORER = $("#connect-button").data("explorer")

    $("#get-foo").click( async (event) => {
        const block = $(event.target).closest(".interactive-block")
        const wallet = get_wallet(event)
        if (!wallet) {return}

        const currency_code = "FOO"
        const issue_quantity = "1000"

        block.find(".loader").show()
        show_log(block, "<p>Funding an issuer address with the faucet...</p>")
        const issuer = (await api.fundWallet()).wallet
        show_log(block, `<p>Got issuer <span id="issuer-address" data-seed="${issuer.seed}">${issuer.address}</span>.</p>`)
        $(".foo-issuer").text(issuer.address) // Update display in the "Create AMM" step

        // Enable issuer DefaultRipple ----------------------------------------------
        const issuer_setup_tx = {
            "TransactionType": "AccountSet",
            "Account": issuer.address,
            "SetFlag": xrpl.AccountSetAsfFlags.asfDefaultRipple
        }
        add_memo(event, issuer_setup_tx)
        const issuer_setup_result = await api.submitAndWait(issuer_setup_tx, {autofill: true, wallet: issuer} )
        if (issuer_setup_result.result.meta.TransactionResult == "tesSUCCESS") {
            show_log(block, `<p><a href="${EXPLORER}/transactions/${issuer_setup_result.result.hash}">✅ Issuer DefaultRipple enabled</a></p>`)
        } else {
            show_error(block, `Error sending transaction: <pre><code>${pretty_print(issuer_setup_result)}</code></pre>`)
        }

        // Create trust line to issuer ----------------------------------------------
        const trust_tx = {
            "TransactionType": "TrustSet",
            "Account": wallet.address,
            "LimitAmount": {
                "currency": currency_code,
                "issuer": issuer.address,
                "value": "10000000000" // Large limit, arbitrarily chosen
            }
        }
        add_memo(event, trust_tx)
        const trust_result = await api.submitAndWait(trust_tx, {autofill: true, wallet: wallet})
        if (trust_result.result.meta.TransactionResult == "tesSUCCESS") {
            show_log(block, `<p><a href="${EXPLORER}/transactions/${trust_result.result.hash}">✅ Trust line created</a></p>`)
        } else {
            show_error(block, `Error sending transaction: <pre><code>${pretty_print(trust_result)}</code></pre>`)
        }

        // Issue tokens -------------------------------------------------------------
        const issue_tx = {
            "TransactionType": "Payment",
            "Account": issuer.address,
            "Amount": {
              "currency": currency_code,
              "value": issue_quantity,
              "issuer": issuer.address
            },
            "Destination": wallet.address
        }
        add_memo(event, issue_tx)
        const issue_result = await api.submitAndWait(issue_tx, {autofill: true, wallet: issuer})
        if (issue_result.result.meta.TransactionResult == "tesSUCCESS") {
            show_log(block, `<p><a href="${EXPLORER}/transactions/${issue_result.result.hash}">✅ Tokens issued</a></p>`)
            $("#get-foo").data("foo-acquired", true).prop("disabled", true).addClass("disabled").addClass("done")
        } else {
            show_error(block, `Error sending transaction: <pre><code>${pretty_print(issue_result)}</code></pre>`)
        }
        block.find(".loader").hide()

        if ($("#get-foo").data("foo-acquired") && $("#buy-tst").data("tst-acquired")) {
            complete_step("Acquire tokens")
        }
    })

    $("#buy-tst").click( async (event) => {
        const block = $(event.target).closest(".interactive-block")
        const wallet = get_wallet(event)
        if (!wallet) {return}
        block.find(".loader").show()

        const tx_json = {
            "TransactionType": "OfferCreate",
            "Account": wallet.address,
            "TakerPays": {
              currency: "TST",
              issuer: "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
              value: "25"
            },
            "TakerGets": xrpl.xrpToDrops(25*10*1.16)
        }
        add_memo(event, tx_json)

        const offer_result = await api.submitAndWait(tx_json, {autofill: true, wallet: wallet})

        if (offer_result.result.meta.TransactionResult == "tesSUCCESS") {
            show_log(block, `<p><a href="${EXPLORER}/transactions/${offer_result.result.hash}">✅ TST offer placed</a></p>`)
            const balance_changes = xrpl.getBalanceChanges(offer_result.result.meta)
            for (const bc of balance_changes) {
            if (bc.account != wallet.address) {continue}
            for (const bal of bc.balances) {
                if (bal.currency == "TST") {
                    show_log(block, `<p>Got <strong>${bal.value}</strong> ${bal.currency}.${bal.issuer}.</p>`)
                    break
                }
            }
            break
            }
            $("#buy-tst").data("tst-acquired", true).prop("disabled", true).addClass("disabled").addClass("done")
        } else {
            show_error(block, `<p>Transaction failed:</p><pre><code>${pretty_print(offer_result)}</code></pre>`)
        }
        block.find(".loader").hide()

        if ($("#get-foo").data("foo-acquired") && $("#buy-tst").data("tst-acquired")) {
            complete_step("Acquire tokens")
        }
    })

    $("#check-for-amm").click( async (event) => {
        const block = $(event.target).closest(".interactive-block")
        const foo_issuer_address = $("#issuer-address").text()

        block.find(".output-area").html("")
        block.find(".loader").show()
        try {
            const amm_info = await api.request({
                "command": "amm_info",
                "asset": {
                    "currency": "TST",
                    "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
                },
                "asset2": {
                    "currency": "FOO",
                    "issuer": foo_issuer_address
                },
                "ledger_index": "validated"
            })
            show_log(block, `<pre><code>${pretty_print}amm_info</code></pre>`)
        } catch(err) {
            if (err.data.error === 'actNotFound') {
                show_log(block, `<p>✅ No AMM exists yet for the pair
                             FOO.${foo_issuer_address} /
                             TST.rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd.`)
                complete_step("Check for AMM")
              } else {
                show_error(block, err)
              }
        }
        block.find(".loader").hide()
    })

    $("#look-up-ammcreate-cost").click( async (event) => {
        const block = $(event.target).closest(".interactive-block")
        block.find(".loader").show()
        let amm_fee_drops = "5000000"
        try {
            const ss = await api.request({"command": "server_state"})
            amm_fee_drops = ss.result.state.validated_ledger.reserve_inc.toString()
            show_log(block, `<p>Current AMMCreate transaction cost: ${xrpl.dropsToXrp(amm_fee_drops)} XRP (<span id="ammcreate-cost-drops">${amm_fee_drops}</span> drops)</p>`)
            complete_step("Look up AMMCreate cost")
        } catch(err) {
            show_error(block, `Error looking up AMMCreate tx cost: ${err}`)
        }
        block.find(".loader").hide()
    })

    $("#create-amm").click( async (event) => {
        const block = $(event.target).closest(".interactive-block")
        const wallet = get_wallet(event)
        if (!wallet) {return}

        amm_fee_drops = $("#ammcreate-cost-drops").text()
        if (!amm_fee_drops) {return}

        block.find(".output-area").html("")
        block.find(".loader").show()

        const asset_amount = $("#asset-amount").val()
        const asset2_amount = $("#asset2-amount").val()
        const asset2_issuer_address = $("#issuer-address").text()
        const trading_fee = Math.floor($("#trading-fee").val()*1000) // Convert from %

        const ammcreate_tx = {
            "TransactionType": "AMMCreate",
            "Account": wallet.address,
            "Amount": {
              currency: "TST",
              issuer: "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
              value: asset_amount
            },
            "Amount2": {
              "currency": "FOO",
              "issuer": asset2_issuer_address,
              "value": asset2_amount
            },
            "TradingFee": 500, // 0.5%
            "Fee": amm_fee_drops
        }
        add_memo(event, ammcreate_tx)
        const ammcreate_result = await api.submitAndWait(ammcreate_tx, {autofill: true, wallet: wallet, fail_hard: true})
        if (ammcreate_result.result.meta.TransactionResult == "tesSUCCESS") {
            show_log(block, `<p><a href="${EXPLORER}/transactions/${ammcreate_result.result.hash}">AMM created</a>:</p>
                             <pre><code>${pretty_print(ammcreate_result)}</code></pre>`)
            complete_step("Create AMM")
        } else {
            console.error(ammcreate_result)
            show_error(block, `Error sending transaction: ${ammcreate_result.result.meta.TransactionResult}`)
        }
        block.find(".loader").hide()
    })

    $("#check-amm-info").click( async (event) => {
        const block = $(event.target).closest(".interactive-block")
        const foo_issuer_address = $("#issuer-address").text()

        block.find(".output-area").html("")
        block.find(".loader").show()
        try {
            const amm_info = await api.request({
                "command": "amm_info",
                "asset": {
                    "currency": "TST",
                    "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
                },
                "asset2": {
                    "currency": "FOO",
                    "issuer": foo_issuer_address
                },
                "ledger_index": "validated"
            })
            show_log(block, `<p><strong>AMM Info:</strong><pre><code>${pretty_print(amm_info)}</code></pre>`)
            const lp_token = amm_info.result.amm.lp_token
            show_log(block, `<p>The AMM account <strong>${lp_token.issuer}</strong> has <strong>${lp_token.value}</strong> total
               LP tokens outstanding, and uses the currency code <code>${lp_token.currency}</code>.</p>`)
            const amount = amm_info.result.amm.amount
            const amount2 = amm_info.result.amm.amount2
            show_log(block, `<p>In its pool, the AMM holds <strong>${amount.value} ${amount.currency}.${amount.issuer}</strong>
                        and <strong>${amount2.value} ${amount2.currency}.${amount2.issuer}</strong></p>`)
            complete_step("Check AMM info")
        } catch(err) {
            show_error(block, err)
        }
        block.find(".loader").hide()
    })

    $("#check-trust-lines").click( async (event) => {
        const block = $(event.target).closest(".interactive-block")
        const address = get_address()
        if (!address) {return}

        block.find(".output-area").html("")
        block.find(".loader").show()
        try {
            const account_lines = await api.request({
                "command": "account_lines",
                "account": address,
                "ledger_index": "validated"
            })
            show_log(block, `<p><strong>Trust lines:</strong><pre><code>${pretty_print(account_lines)}</code></pre>`)
            complete_step("Check trust lines")
        } catch(err) {
            show_error(block, err)
        }
        block.find(".loader").hide()
    })

})

